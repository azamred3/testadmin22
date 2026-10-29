// ============================================================
// عودة للعقار — لوحة التحكم (مربوطة بـ Supabase)
// ============================================================

let adminProperties = [];
let currentPropertyId = null;

// عناصر DOM
const propertiesGrid = document.getElementById('properties-grid');
const propertyModal = document.getElementById('property-modal');
const alertContainer = document.getElementById('alert-container');

// 1. التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', async () => {
    await checkAdminAuth(); // التأكد من أن المستخدم أدمن
    await loadProperties(); // جلب العقارات
    initEventListeners();
});

// 2. التحقق من صلاحية الأدمن (بصمت وبدون رسائل متصفح)
async function checkAdminAuth() {
    const { data: { user } } = await window.db.auth.getUser();
    
    if (!user) {
        window.location.href = 'log.html'; 
        return;
    }
    
    const { data: profile } = await window.db.from('profiles').select('role').eq('id', user.id).maybeSingle();
    
    if (!profile || profile.role !== 'admin') {
        window.location.href = 'index.html'; 
    }
}

// 3. جلب العقارات من قاعدة البيانات
async function loadProperties() {
    const { data, error } = await window.db.from('properties').select('*').order('created_at', { ascending: false });
    if (error) {
        showAlert('خطأ في جلب العقارات: ' + error.message, 'error');
        return;
    }
    adminProperties = data;
    renderPropertiesGrid();
}

// 4. عرض العقارات في الشبكة
function renderPropertiesGrid() {
    propertiesGrid.innerHTML = '';
    
    if (adminProperties.length === 0) {
        propertiesGrid.innerHTML = `<div class="no-data" style="grid-column:1/-1;text-align:center;padding:40px;"><i class="fas fa-home"></i><p>لا توجد عقارات مضافة</p></div>`;
        return;
    }

    adminProperties.forEach(property => {
        const card = document.createElement('div');
        card.className = 'property-card';
        
        let statusText = property.status === 'available' ? 'متاح' : (property.status === 'sold' ? 'تم البيع' : 'تم التأجير');
        let statusClass = property.status === 'available' ? 'for-sale' : (property.status === 'sold' ? 'sold' : 'rented');
        
        const imgUrl = property.images && property.images.length > 0 ? property.images[0] : 'https://via.placeholder.com/400x300';

        card.innerHTML = `
            <div class="property-image">
                <img src="${imgUrl}" alt="${property.title}">
                <div class="property-badge">${property.type}</div>
                <div class="property-code">${property.code}</div>
            </div>
            <div class="property-content">
                <div class="property-header">
                    <h3 class="property-title">${property.title}</h3>
                    <div class="property-price">${property.price}</div>
                </div>
                <div class="property-location"><i class="fas fa-map-marker-alt"></i> <span>${property.location}</span></div>
                <div class="property-footer">
                    <div class="property-status"><span class="status-badge ${statusClass}">${statusText}</span></div>
                    <div class="property-actions">
                        <button class="property-action-btn edit" onclick="editProperty('${property.id}')"><i class="fas fa-edit"></i></button>
                        <button class="property-action-btn delete" onclick="deleteProperty('${property.id}')"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
        `;
        propertiesGrid.appendChild(card);
    });
}

// 5. مستمعو الأحداث (الأزرار)
function initEventListeners() {
    document.getElementById('add-property-btn').addEventListener('click', () => openPropertyModal());
    document.getElementById('close-property-modal').addEventListener('click', closePropertyModal);
    document.getElementById('cancel-property').addEventListener('click', closePropertyModal);
    document.getElementById('save-property').addEventListener('click', saveProperty);
    
    document.getElementById('logout-btn').addEventListener('click', async () => {
        await window.db.auth.signOut();
        window.location.href = 'index.html';
    });
}

// 6. فتح وإغلاق النافذة
function openPropertyModal(propertyId = null) {
    currentPropertyId = propertyId;
    const form = document.getElementById('property-form');
    form.reset();
    
    if (propertyId) {
        document.getElementById('property-modal-title').textContent = 'تعديل العقار';
        const p = adminProperties.find(x => x.id === propertyId);
        if (p) {
            document.getElementById('property-title').value = p.title || '';
            document.getElementById('property-code').value = p.code || '';
            document.getElementById('property-type').value = p.category || '';
            document.getElementById('property-category').value = p.type || '';
            document.getElementById('property-price').value = p.price || '';
            document.getElementById('property-area').value = p.area || '';
            document.getElementById('property-location').value = p.location || '';
            document.getElementById('property-image-url').value = (p.images && p.images[0]) ? p.images[0] : '';
            document.getElementById('property-description').value = p.description || '';
        }
    } else {
        document.getElementById('property-modal-title').textContent = 'إضافة عقار جديد';
    }
    propertyModal.classList.add('active');
}

function closePropertyModal() {
    propertyModal.classList.remove('active');
    currentPropertyId = null;
}

// 7. حفظ العقار (إضافة أو تعديل)
async function saveProperty() {
    const title = document.getElementById('property-title').value.trim();
    const code = document.getElementById('property-code').value.trim();
    const category = document.getElementById('property-type').value;
    const type = document.getElementById('property-category').value;
    const price = document.getElementById('property-price').value.trim();
    const area = parseInt(document.getElementById('property-area').value) || 0;
    const location = document.getElementById('property-location').value.trim();
    const imageUrl = document.getElementById('property-image-url').value.trim();
    const description = document.getElementById('property-description').value.trim();

    if (!title || !code || !category || !type || !price || !area || !location) {
        showAlert('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }

    const propertyData = {
        code: code,
        title: title,
        description: description,
        price: price,
        type: type, 
        category: category,
        area: area,
        location: location,
        images: imageUrl ? [imageUrl] : [],
        specs: [],
        features: [],
        status: 'available',
        created_by: (await window.db.auth.getUser()).data.user.id
    };

    let error;
    if (currentPropertyId) {
        const res = await window.db.from('properties').update(propertyData).eq('id', currentPropertyId);
        error = res.error;
    } else {
        const res = await window.db.from('properties').insert([propertyData]);
        error = res.error;
    }

    if (error) {
        showAlert('خطأ: ' + error.message, 'error');
    } else {
        showAlert('تم الحفظ بنجاح!', 'success');
        closePropertyModal();
        await loadProperties();
    }
}

// 8. حذف العقار
async function deleteProperty(id) {
    if (!confirm('هل أنت متأكد من حذف هذا العقار نهائياً؟')) return;
    
    const { error } = await window.db.from('properties').delete().eq('id', id);
    if (error) {
        showAlert('خطأ في الحذف: ' + error.message, 'error');
    } else {
        showAlert('تم الحذف بنجاح', 'success');
        await loadProperties();
    }
}

// 9. دالة التنبيهات الخاصة بـ admin
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.style.cssText = `background:${type==='error'?'#F87171':'#2DD4BF'}; color:#111; padding:14px; margin:10px auto; max-width:400px; border-radius:8px; text-align:center; font-weight:bold;`;
    alert.textContent = message;
    alertContainer.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
}