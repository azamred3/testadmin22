// ============================================================
// عودة للعقار — لوحة التحكم (مربوطة بـ Supabase ومتكاملة)
// ============================================================

let adminProperties = [];
let currentPropertyId = null;

const propertiesGrid = document.getElementById('properties-grid');
const propertyModal = document.getElementById('property-modal');
const alertContainer = document.getElementById('alert-container');

// 1. التهيئة
document.addEventListener('DOMContentLoaded', async () => {
    await checkAdminAuth();
    await loadProperties();
    initEventListeners();
});

// 2. فحص صلاحية الأدمن
async function checkAdminAuth() {
    const { data: { user } } = await window.db.auth.getUser();
    if (!user) { window.location.href = 'log.html'; return; }
    
    const { data: profile } = await window.db.from('profiles').select('role').eq('id', user.id).maybeSingle();
    if (!profile || profile.role !== 'admin') { window.location.href = 'index.html'; }
}

// 3. جلب العقارات
async function loadProperties() {
    const { data, error } = await window.db.from('properties').select('*').order('created_at', { ascending: false });
    if (error) { showAlert('خطأ في جلب العقارات: ' + error.message, 'error'); return; }
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

        // عرض المواصفات في الكارد
        let specsHTML = '';
        if (property.specs && property.specs.length > 0) {
            property.specs.forEach(spec => {
                specsHTML += `
                    <div class="spec-item">
                        <i class="${spec.icon}" style="color: var(--accent-bright); font-size: 14px; margin-bottom: 4px;"></i>
                        <div style="font-size: 12px; font-weight: bold;">${spec.value}</div>
                        <div style="font-size: 10px; color: var(--text-secondary);">${spec.label}</div>
                    </div>
                `;
            });
        }

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
                
                <div style="display: flex; justify-content: space-around; background: var(--bg-primary); padding: 10px; border-radius: 10px; margin: 10px 0;">
                    ${specsHTML || '<span style="font-size:12px; color:var(--text-muted);">لا توجد مواصفات مضافة</span>'}
                </div>

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

// 5. مستمعو الأحداث
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

// 6. فتح النافذة (إضافة أو تعديل)
function openPropertyModal(propertyId = null) {
    currentPropertyId = propertyId;
    document.getElementById('property-form').reset();
    
    // تصفير حقول الـ Checkbox
    document.querySelectorAll('.features-grid input').forEach(cb => cb.checked = false);
    
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

            // استخراج المواصفات
            if (p.specs) {
                p.specs.forEach(spec => {
                    if (spec.label === 'غرف نوم') document.getElementById('property-bedrooms').value = spec.value;
                    if (spec.label === 'حمامات') document.getElementById('property-bathrooms').value = spec.value;
                    if (spec.label === 'مواقف') document.getElementById('property-parking').value = spec.value;
                    if (spec.label === 'إضافي') {
                        document.getElementById('property-extra-spec').value = spec.value;
                        document.getElementById('property-extra-spec-icon').value = spec.icon;
                    }
                });
            }

            // استخراج المميزات
            if (p.features) {
                let customFeats = [];
                p.features.forEach(f => {
                    const cb = document.querySelector(`.features-grid input[value="${f}"]`);
                    if (cb) cb.checked = true;
                    else customFeats.push(f);
                });
                document.getElementById('property-custom-features').value = customFeats.join(', ');
            }
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

// 7. الحفظ
async function saveProperty() {
    const title = document.getElementById('property-title').value.trim();
    const code = document.getElementById('property-code').value.trim();
    const category = document.getElementById('property-type').value;
    const type = document.getElementById('property-category').value;
    const price = document.getElementById('property-price').value.trim();
    const area = parseInt(document.getElementById('property-area').value) || 0;
    const location = document.getElementById('property-location').value.trim();
    
    if (!title || !code || !category || !type || !price || !area || !location) {
        showAlert('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }

    // 1. تجميع المواصفات (Specs)
    const specs = [];
    const bedrooms = document.getElementById('property-bedrooms').value;
    const bathrooms = document.getElementById('property-bathrooms').value;
    const parking = document.getElementById('property-parking').value;
    const extraSpec = document.getElementById('property-extra-spec').value;
    const extraIcon = document.getElementById('property-extra-spec-icon').value;

    if (bedrooms) specs.push({ icon: "fas fa-bed", value: bedrooms, label: "غرف نوم" });
    if (bathrooms) specs.push({ icon: "fas fa-bath", value: bathrooms, label: "حمامات" });
    if (area) specs.push({ icon: "fas fa-vector-square", value: area.toString(), label: "م²" });
    if (parking) specs.push({ icon: "fas fa-car", value: parking, label: "مواقف" });
    if (extraSpec) specs.push({ icon: extraIcon, value: extraSpec, label: "إضافي" });

    // 2. تجميع المميزات (Features)
    const features = [];
    document.querySelectorAll('.features-grid input:checked').forEach(cb => features.push(cb.value));
    const customFeatures = document.getElementById('property-custom-features').value.split(',').map(f => f.trim()).filter(f => f);
    features.push(...customFeatures);

    // 3. تجهيز البيانات
    const propertyData = {
        code: code, title: title, description: document.getElementById('property-description').value.trim(),
        price: price, type: type, category: category, area: area, location: location,
        images: document.getElementById('property-image-url').value.trim() ? [document.getElementById('property-image-url').value.trim()] : [],
        specs: specs, features: features, status: 'available',
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

// 8. تعديل وحذف
function editProperty(id) { openPropertyModal(id); }

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

// 9. التنبيهات
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.style.cssText = `background:${type==='error'?'#F87171':'#2DD4BF'}; color:#111; padding:14px; margin:10px auto; max-width:400px; border-radius:8px; text-align:center; font-weight:bold;`;
    alert.textContent = message;
    alertContainer.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
}
