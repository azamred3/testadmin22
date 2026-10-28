// بيانات العقارات الإدارية
let adminProperties = [
    {
        id: 1,
        code: "J101",
        title: "فيلا فاخرة بحي الربيع",
        price: "2,500,000 ريال",
        type: "فلل",
        status: "sold",
        date: "2023-10-15",
        location: "حي الربيع، الرياض",
        image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        area: 400,
        bedrooms: 4,
        bathrooms: 3,
        livingRooms: 2,
        kitchens: 1,
        parking: 2,
        floors: 2,
        yearBuilt: 2020,
        features: ["حديقة خاصة", "مسبح", "نظام أمني", "تكييف مركزي"],
        images: [
            "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
        ],
        videos: [],
        customer: {
            name: "أحمد محمد",
            phone: "+966500000000",
            transactionDate: "2023-11-20",
            transactionAmount: "2,500,000"
        },
        description: "فيلا فاخرة بحي الربيع، مساحة 400 متر، تتكون من 4 غرف نوم و3 حمامات وصالتين استقبال ومطبخ وحديقة خاصة ومسبح."
    },
    {
        id: 2,
        code: "J102",
        title: "شقة راقية بحي النخيل",
        price: "4,500 ريال/شهرياً",
        type: "شقق",
        status: "rented",
        date: "2023-10-10",
        location: "حي النخيل، الرياض",
        image: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        area: 180,
        bedrooms: 3,
        bathrooms: 2,
        livingRooms: 1,
        kitchens: 1,
        parking: 1,
        floors: 1,
        yearBuilt: 2018,
        features: ["إطلالة بانورامية", "نادي صحي", "مسبح مشترك"],
        images: [
            "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
        ],
        videos: [],
        customer: {
            name: "سارة عبدالله",
            phone: "+966511111111",
            transactionDate: "2023-11-15",
            transactionAmount: "4,500"
        },
        description: "شقة راقية بحي النخيل، مساحة 180 متر، تتكون من 3 غرف نوم و2 حمام وصالة استقبال ومطبخ، مع إطلالة بانورامية."
    },
    {
        id: 3,
        code: "J103",
        title: "أرض سكنية بحي الورود",
        price: "1,200,000 ريال",
        type: "أراضي",
        status: "for-sale",
        date: "2023-10-05",
        location: "حي الورود، الرياض",
        image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        area: 600,
        features: ["موقع استراتيجي", "قريبة من الخدمات", "تصريح بناء"],
        images: [
            "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
        ],
        videos: [],
        description: "أرض سكنية بحي الورود، مساحة 600 متر، موقع استراتيجي قريب من الخدمات، مع تصريح بناء."
    }
];

// بيانات العملاء
let customers = [];

// العناصر الرئيسية في DOM
const adminSections = document.querySelectorAll('.admin-section');
const navItems = document.querySelectorAll('.nav-item');
const propertiesGrid = document.getElementById('properties-grid');
const customersTableBody = document.getElementById('customers-table-body');
const propertyModal = document.getElementById('property-modal');
const statusModal = document.getElementById('status-modal');
const detailsModal = document.getElementById('details-modal');
const alertContainer = document.getElementById('alert-container');

// حالة التطبيق
let currentPropertyId = null;
let currentTab = 'basic-info';
let customFeatures = [];
let uploadedImages = [];
let uploadedVideos = [];

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    console.log('جاري تهيئة التطبيق...');
    initAdminApp();
});

// تهيئة تطبيق الإدارة
function initAdminApp() {
    console.log('تهيئة تطبيق الإدارة...');
    initNavigation();
    renderPropertiesGrid();
    renderCustomersTable();
    initEventListeners();
    initModals();
    extractCustomersFromProperties();
    updateCustomerStats();
    
    console.log('تم تهيئة التطبيق بنجاح');
}

// تهيئة التنقل بين الأقسام
function initNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // إزالة النشط من جميع العناصر
            navItems.forEach(nav => nav.classList.remove('active'));
            adminSections.forEach(section => section.classList.remove('active'));
            
            // إضافة النشط للعنصر المختار
            this.classList.add('active');
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

// إضافة مستمعي الأحداث
function initEventListeners() {
    console.log('جاري إضافة مستمعي الأحداث...');
    
    // تصفية العقارات
    document.getElementById('properties-search').addEventListener('input', filterProperties);
    document.getElementById('property-status-filter').addEventListener('change', filterProperties);
    document.getElementById('property-type-filter').addEventListener('change', filterProperties);
    
    // تصفية العملاء
    document.getElementById('customers-search').addEventListener('input', filterCustomers);
    document.getElementById('customer-type-filter').addEventListener('change', filterCustomers);
    
    // أزرار الإجراءات
    const addPropertyBtn = document.getElementById('add-property-btn');
    if (addPropertyBtn) {
        addPropertyBtn.addEventListener('click', function() {
            console.log('تم النقر على زر إضافة عقار جديد');
            openPropertyModal();
        });
    } else {
        console.error('لم يتم العثور على زر إضافة عقار جديد');
    }
    
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    // إغلاق النوافذ عند النقر خارجها
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
    
    // تغيير حالة العقار
    document.getElementById('new-status').addEventListener('change', handleStatusChange);
    document.getElementById('save-status-change').addEventListener('click', saveStatusChange);
    document.getElementById('cancel-status-change').addEventListener('click', closeStatusModal);
    
    // إدارة العقار
    const savePropertyBtn = document.getElementById('save-property');
    if (savePropertyBtn) {
        savePropertyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('جاري حفظ العقار...');
            saveProperty();
        });
    }
    
    document.getElementById('cancel-property').addEventListener('click', closePropertyModal);
    
    // تحميل الوسائط
    const imageUploadContainer = document.getElementById('image-upload-container');
    if (imageUploadContainer) {
        imageUploadContainer.addEventListener('click', function() {
            document.getElementById('property-images').click();
        });
    }
    
    const videoUploadContainer = document.getElementById('video-upload-container');
    if (videoUploadContainer) {
        videoUploadContainer.addEventListener('click', function() {
            document.getElementById('property-videos').click();
        });
    }
    
    document.getElementById('property-images').addEventListener('change', handleImageUpload);
    document.getElementById('property-videos').addEventListener('change', handleVideoUpload);
    
    // إدارة علامات التبويب
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.getAttribute('data-tab'));
        });
    });
    
    // إضافة ميزات مخصصة
    document.getElementById('add-feature-btn').addEventListener('click', addCustomFeature);
    document.getElementById('new-feature').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addCustomFeature();
        }
    });
    
    // حفظ الإعدادات
    document.getElementById('settings-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveSettings();
    });
    
    // إغلاق نافذة التفاصيل
    document.getElementById('close-details').addEventListener('click', closeDetailsModal);
    
    console.log('تم إضافة جميع مستمعي الأحداث');
}

// تهيئة النوافذ المنبثقة
function initModals() {
    // إغلاق نوافذ
    document.getElementById('close-property-modal').addEventListener('click', closePropertyModal);
    document.getElementById('close-status-modal').addEventListener('click', closeStatusModal);
    document.getElementById('close-details-modal').addEventListener('click', closeDetailsModal);
}

// عرض شبكة العقارات
function renderPropertiesGrid(properties = adminProperties) {
    console.log('جاري عرض العقارات...');
    propertiesGrid.innerHTML = '';
    
    if (properties.length === 0) {
        propertiesGrid.innerHTML = `
            <div class="no-data" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <i class="fas fa-home" style="font-size: 48px; color: var(--color-text-muted); margin-bottom: 12px;"></i>
                <p style="color: var(--color-text-secondary);">لا توجد عقارات</p>
            </div>
        `;
        return;
    }
    
    properties.forEach(property => {
        const card = document.createElement('div');
        card.className = 'property-card';
        card.setAttribute('data-id', property.id);
        
        // تحديد نص الحالة
        let statusText = '';
        switch(property.status) {
            case 'for-sale':
                statusText = 'للبيع';
                break;
            case 'for-rent':
                statusText = 'للتأجير';
                break;
            case 'sold':
                statusText = 'تم البيع';
                break;
            case 'rented':
                statusText = 'تم التأجير';
                break;
        }
        
        // إنشاء مواصفات العقار
        let specsHTML = '';
        if (property.bedrooms) {
            specsHTML += `
                <div class="spec-item">
                    <div class="spec-icon">
                        <i class="fas fa-bed"></i>
                    </div>
                    <div class="spec-value">${property.bedrooms}</div>
                    <div class="spec-label">غرف نوم</div>
                </div>
            `;
        }
        
        if (property.bathrooms) {
            specsHTML += `
                <div class="spec-item">
                    <div class="spec-icon">
                        <i class="fas fa-bath"></i>
                    </div>
                    <div class="spec-value">${property.bathrooms}</div>
                    <div class="spec-label">حمامات</div>
                </div>
            `;
        }
        
        specsHTML += `
            <div class="spec-item">
                <div class="spec-icon">
                    <i class="fas fa-vector-square"></i>
                </div>
                <div class="spec-value">${property.area}</div>
                <div class="spec-label">م²</div>
            </div>
        `;
        
        card.innerHTML = `
            <div class="property-image">
                <img src="${property.image}" alt="${property.title}" onerror="this.src='https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'">
                <div class="property-badge">${property.type}</div>
                <div class="property-code">${property.code}</div>
            </div>
            
            <div class="property-content">
                <div class="property-header">
                    <h3 class="property-title">${property.title}</h3>
                    <div class="property-price">${property.price}</div>
                </div>
                
                <div class="property-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${property.location}</span>
                </div>
                
                <div class="property-specs">
                    ${specsHTML}
                </div>
                
                <div class="property-footer">
                    <div class="property-status">
                        <span class="status-badge ${property.status}">${statusText}</span>
                    </div>
                    <div class="property-actions">
                        <button class="property-action-btn view" title="عرض التفاصيل" onclick="viewPropertyDetails(${property.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="property-action-btn edit" title="تعديل" onclick="editProperty(${property.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="property-action-btn status" title="تغيير الحالة" onclick="openStatusModal(${property.id})">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                        <button class="property-action-btn delete" title="حذف" onclick="deleteProperty(${property.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        propertiesGrid.appendChild(card);
    });
    
    console.log('تم عرض العقارات بنجاح');
}

// عرض جدول العملاء
function renderCustomersTable(customersList = customers) {
    customersTableBody.innerHTML = '';
    
    if (customersList.length === 0) {
        customersTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center" style="text-align: center; padding: 40px; color: var(--color-text-secondary);">
                    لا توجد عملاء
                </td>
            </tr>
        `;
        return;
    }
    
    customersList.forEach(customer => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${customer.name}</td>
            <td>${customer.phone}</td>
            <td>${customer.transactionType === 'sold' ? 'شراء' : 'تأجير'}</td>
            <td>${customer.propertyTitle}</td>
            <td>${customer.transactionAmount} ${customer.transactionType === 'sold' ? 'ريال' : 'ريال/شهرياً'}</td>
            <td>${formatDate(customer.transactionDate)}</td>
            <td>
                <button class="btn btn-outline" onclick="viewCustomerDetails(${customer.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        
        customersTableBody.appendChild(row);
    });
}

// استخراج العملاء من العقارات
function extractCustomersFromProperties() {
    customers = [];
    
    adminProperties.forEach(property => {
        if (property.customer && (property.status === 'sold' || property.status === 'rented')) {
            customers.push({
                id: property.id,
                name: property.customer.name,
                phone: property.customer.phone,
                transactionType: property.status,
                propertyTitle: property.title,
                transactionDate: property.customer.transactionDate,
                transactionAmount: property.customer.transactionAmount
            });
        }
    });
    
    renderCustomersTable();
    updateCustomerStats();
}

// تحديث إحصائيات العملاء
function updateCustomerStats() {
    const soldCustomers = customers.filter(c => c.transactionType === 'sold').length;
    const rentedCustomers = customers.filter(c => c.transactionType === 'rented').length;
    const totalTransactions = soldCustomers + rentedCustomers;
    
    document.getElementById('sold-customers-count').textContent = soldCustomers;
    document.getElementById('rented-customers-count').textContent = rentedCustomers;
    document.getElementById('total-transactions').textContent = totalTransactions;
}

// تصفية العقارات
function filterProperties() {
    const searchTerm = document.getElementById('properties-search').value.toLowerCase();
    const statusFilter = document.getElementById('property-status-filter').value;
    const typeFilter = document.getElementById('property-type-filter').value;
    
    const filteredProperties = adminProperties.filter(property => {
        // فلترة النص
        if (searchTerm && !property.title.toLowerCase().includes(searchTerm) && 
            !property.code.toLowerCase().includes(searchTerm) &&
            !property.location.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        // فلترة الحالة
        if (statusFilter !== 'all' && property.status !== statusFilter) {
            return false;
        }
        
        // فلترة النوع
        if (typeFilter !== 'all' && property.type !== typeFilter) {
            return false;
        }
        
        return true;
    });
    
    renderPropertiesGrid(filteredProperties);
}

// تصفية العملاء
function filterCustomers() {
    const searchTerm = document.getElementById('customers-search').value.toLowerCase();
    const typeFilter = document.getElementById('customer-type-filter').value;
    
    const filteredCustomers = customers.filter(customer => {
        // فلترة النص
        if (searchTerm && !customer.name.toLowerCase().includes(searchTerm) && 
            !customer.phone.toLowerCase().includes(searchTerm) &&
            !customer.propertyTitle.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        // فلترة النوع
        if (typeFilter !== 'all' && customer.transactionType !== typeFilter) {
            return false;
        }
        
        return true;
    });
    
    renderCustomersTable(filteredCustomers);
}

// فتح نافذة إضافة/تعديل عقار
function openPropertyModal(propertyId = null) {
    console.log('فتح نافذة العقار، propertyId:', propertyId);
    
    currentPropertyId = propertyId;
    const modalTitle = document.getElementById('property-modal-title');
    
    if (propertyId) {
        // وضع التعديل
        modalTitle.textContent = 'تعديل العقار';
        const property = adminProperties.find(p => p.id === propertyId);
        if (property) {
            fillPropertyForm(property);
        }
    } else {
        // وضع الإضافة
        modalTitle.textContent = 'إضافة عقار جديد';
        resetPropertyForm();
    }
    
    // إعادة تعيين علامات التبويب
    switchTab('basic-info');
    
    propertyModal.classList.add('active');
    console.log('تم فتح نافذة العقار بنجاح');
}

// إعادة تعيين نموذج العقار
function resetPropertyForm() {
    const form = document.getElementById('property-form');
    if (form) {
        form.reset();
    }
    
    // إعادة تعيين الحقول المخفية
    document.getElementById('property-id').value = '';
    
    // إعادة تعيين الوسائط
    document.getElementById('uploaded-images-preview').innerHTML = '';
    document.getElementById('uploaded-videos-preview').innerHTML = '';
    
    // إعادة تعيين المميزات
    customFeatures = [];
    uploadedImages = [];
    uploadedVideos = [];
    
    // إعادة تعيين المميزات المحددة
    const checkboxes = document.querySelectorAll('.features-checkboxes input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    renderCustomFeatures();
}

// تعبئة نموذج العقار
function fillPropertyForm(property) {
    if (!property) return;
    
    document.getElementById('property-id').value = property.id;
    document.getElementById('property-title').value = property.title;
    document.getElementById('property-code').value = property.code;
    document.getElementById('property-type').value = property.type;
    document.getElementById('property-category').value = property.status === 'for-sale' || property.status === 'sold' ? 'للبيع' : 'للإيجار';
    document.getElementById('property-price').value = property.price;
    document.getElementById('property-area').value = property.area;
    document.getElementById('property-location').value = property.location;
    document.getElementById('property-description').value = property.description || '';
    
    // التفاصيل
    document.getElementById('bedrooms').value = property.bedrooms || '';
    document.getElementById('bathrooms').value = property.bathrooms || '';
    document.getElementById('living-rooms').value = property.livingRooms || '';
    document.getElementById('kitchens').value = property.kitchens || '';
    document.getElementById('parking').value = property.parking || '';
    document.getElementById('floors').value = property.floors || '';
    document.getElementById('year-built').value = property.yearBuilt || '';
    document.getElementById('additional-details').value = property.additionalDetails || '';
    
    // المميزات
    const checkboxes = document.querySelectorAll('.features-checkboxes input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = property.features ? property.features.includes(checkbox.value) : false;
    });
    
    // المميزات المخصصة
    customFeatures = property.customFeatures || [];
    renderCustomFeatures();
    
    // الوسائط
    uploadedImages = property.images || [];
    uploadedVideos = property.videos || [];
    renderUploadedMedia(uploadedImages, 'image');
    renderUploadedMedia(uploadedVideos, 'video');
}

// عرض الوسائط المرفوعة
function renderUploadedMedia(mediaList, type) {
    const container = document.getElementById(`uploaded-${type}s-preview`);
    if (!container) return;
    
    container.innerHTML = '';
    
    mediaList.forEach((media, index) => {
        const mediaElement = document.createElement('div');
        mediaElement.className = 'uploaded-item';
        
        if (type === 'image') {
            mediaElement.innerHTML = `
                <img src="${media}" alt="صورة العقار" onerror="this.style.display='none'">
                <button type="button" class="remove-media" onclick="removeUploadedMedia(${index}, '${type}')">
                    <i class="fas fa-times"></i>
                </button>
            `;
        } else {
            mediaElement.innerHTML = `
                <video controls>
                    <source src="${media}" type="video/mp4">
                    متصفحك لا يدعم تشغيل الفيديو
                </video>
                <button type="button" class="remove-media" onclick="removeUploadedMedia(${index}, '${type}')">
                    <i class="fas fa-times"></i>
                </button>
            `;
        }
        
        container.appendChild(mediaElement);
    });
}

// تبديل علامات التبويب
function switchTab(tabName) {
    // إخفاء جميع المحتويات
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // إزالة النشط من جميع الأزرار
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // إظهار المحتوى المحدد
    const tabContent = document.getElementById(`${tabName}-tab`);
    if (tabContent) {
        tabContent.classList.add('active');
    }
    
    // تفعيل الزر المحدد
    const tabBtn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
    if (tabBtn) {
        tabBtn.classList.add('active');
    }
    
    currentTab = tabName;
}

// إغلاق نافذة العقار
function closePropertyModal() {
    propertyModal.classList.remove('active');
    currentPropertyId = null;
}

// فتح نافذة تغيير الحالة
function openStatusModal(propertyId) {
    currentPropertyId = propertyId;
    const property = adminProperties.find(p => p.id === propertyId);
    
    if (!property) return;
    
    // تعبئة البيانات الحالية
    document.getElementById('status-property-id').value = propertyId;
    
    // تحديث عرض الحالة الحالية
    const statusDisplay = document.getElementById('current-status-display');
    let statusText = '';
    
    switch(property.status) {
        case 'for-sale':
            statusText = 'للبيع';
            break;
        case 'for-rent':
            statusText = 'للتأجير';
            break;
        case 'sold':
            statusText = 'تم البيع';
            break;
        case 'rented':
            statusText = 'تم التأجير';
            break;
    }
    
    statusDisplay.innerHTML = `<span class="status-badge ${property.status}">${statusText}</span>`;
    
    // تعبئة بيانات العميل إذا كانت موجودة
    if (property.customer) {
        document.getElementById('customer-name').value = property.customer.name;
        document.getElementById('customer-phone').value = property.customer.phone;
        document.getElementById('transaction-date').value = property.customer.transactionDate;
        document.getElementById('transaction-amount').value = property.customer.transactionAmount;
    } else {
        document.getElementById('customer-name').value = '';
        document.getElementById('customer-phone').value = '';
        document.getElementById('transaction-date').value = '';
        document.getElementById('transaction-amount').value = '';
    }
    
    // إظهار النافذة
    statusModal.classList.add('active');
}

// إغلاق نافذة تغيير الحالة
function closeStatusModal() {
    statusModal.classList.remove('active');
    currentPropertyId = null;
    
    // إعادة تعيين النموذج
    document.getElementById('status-form').reset();
    document.getElementById('transaction-details').style.display = 'none';
}

// التعامل مع تغيير الحالة
function handleStatusChange() {
    const newStatus = document.getElementById('new-status').value;
    const transactionDetails = document.getElementById('transaction-details');
    
    // إظهار أو إخفاء تفاصيل المعاملة
    if (newStatus === 'sold' || newStatus === 'rented') {
        transactionDetails.style.display = 'block';
    } else {
        transactionDetails.style.display = 'none';
    }
}

// حفظ تغيير الحالة
function saveStatusChange() {
    const newStatus = document.getElementById('new-status').value;
    
    if (!newStatus) {
        showAlert('يرجى اختيار الحالة الجديدة', 'error');
        return;
    }
    
    const propertyIndex = adminProperties.findIndex(p => p.id === currentPropertyId);
    
    if (propertyIndex === -1) {
        showAlert('حدث خطأ في العثور على العقار', 'error');
        return;
    }
    
    // تحديث الحالة
    adminProperties[propertyIndex].status = newStatus;
    
    // إذا كانت حالة بيع أو تأجير، احفظ تفاصيل المعاملة والعميل
    if (newStatus === 'sold' || newStatus === 'rented') {
        const customerName = document.getElementById('customer-name').value;
        const customerPhone = document.getElementById('customer-phone').value;
        const transactionDate = document.getElementById('transaction-date').value;
        const transactionAmount = document.getElementById('transaction-amount').value;
        
        if (!customerName || !customerPhone || !transactionDate || !transactionAmount) {
            showAlert('يرجى ملء جميع تفاصيل المعاملة', 'error');
            return;
        }
        
        adminProperties[propertyIndex].customer = {
            name: customerName,
            phone: customerPhone,
            transactionDate: transactionDate,
            transactionAmount: transactionAmount
        };
        
        // تحديث قائمة العملاء
        extractCustomersFromProperties();
    } else {
        // إذا تم تغيير الحالة من بيع/تأجير إلى حالة أخرى، احذف بيانات العميل
        delete adminProperties[propertyIndex].customer;
        extractCustomersFromProperties();
    }
    
    // إعادة عرض الشبكة
    renderPropertiesGrid();
    
    // إغلاق النافذة
    closeStatusModal();
    
    // إظهار رسالة نجاح
    showAlert('تم تحديث حالة العقار بنجاح', 'success');
}

// التعامل مع رفع الصور
function handleImageUpload(e) {
    const files = e.target.files;
    handleMediaUpload(files, 'image');
}

// التعامل مع رفع الفيديوهات
function handleVideoUpload(e) {
    const files = e.target.files;
    handleMediaUpload(files, 'video');
}

// التعامل مع رفع الوسائط
function handleMediaUpload(files, type) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            if (type === 'image') {
                uploadedImages.push(e.target.result);
                renderUploadedMedia(uploadedImages, 'image');
            } else {
                uploadedVideos.push(e.target.result);
                renderUploadedMedia(uploadedVideos, 'video');
            }
        };
        
        reader.readAsDataURL(file);
    }
}

// إزالة الوسائط المرفوعة
function removeUploadedMedia(index, type) {
    if (type === 'image') {
        uploadedImages.splice(index, 1);
        renderUploadedMedia(uploadedImages, 'image');
    } else {
        uploadedVideos.splice(index, 1);
        renderUploadedMedia(uploadedVideos, 'video');
    }
}

// إضافة ميزة مخصصة
function addCustomFeature() {
    const featureInput = document.getElementById('new-feature');
    const featureText = featureInput.value.trim();
    
    if (featureText) {
        customFeatures.push(featureText);
        featureInput.value = '';
        renderCustomFeatures();
    }
}

// عرض المميزات المخصصة
function renderCustomFeatures() {
    const container = document.getElementById('custom-features-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    customFeatures.forEach((feature, index) => {
        const featureElement = document.createElement('div');
        featureElement.className = 'custom-feature-tag';
        featureElement.innerHTML = `
            <span>${feature}</span>
            <button type="button" class="remove-feature" onclick="removeCustomFeature(${index})">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(featureElement);
    });
}

// إزالة ميزة مخصصة
function removeCustomFeature(index) {
    customFeatures.splice(index, 1);
    renderCustomFeatures();
}

// حفظ العقار
function saveProperty() {
    console.log('بدء حفظ العقار...');
    
    // التحقق من البيانات المطلوبة
    const requiredFields = ['property-title', 'property-code', 'property-type', 'property-category', 'property-price', 'property-area', 'property-location'];
    let isValid = true;
    let errorMessage = '';
    
    requiredFields.forEach(field => {
        const element = document.getElementById(field);
        if (!element || !element.value.trim()) {
            isValid = false;
            if (element) {
                element.style.borderColor = 'var(--color-danger)';
            }
            errorMessage = 'يرجى ملء جميع الحقول المطلوبة';
        } else if (element) {
            element.style.borderColor = 'var(--color-border)';
        }
    });
    
    if (!isValid) {
        showAlert(errorMessage, 'error');
        return;
    }
    
    // جمع المميزات
    const selectedFeatures = [];
    document.querySelectorAll('.features-checkboxes input[type="checkbox"]:checked').forEach(checkbox => {
        selectedFeatures.push(checkbox.value);
    });
    
    // دمج المميزات المحددة والمخصصة
    const allFeatures = [...selectedFeatures, ...customFeatures];
    
    if (currentPropertyId) {
        // تحديث العقار الموجود
        const propertyIndex = adminProperties.findIndex(p => p.id === currentPropertyId);
        
        if (propertyIndex !== -1) {
            adminProperties[propertyIndex] = {
                ...adminProperties[propertyIndex],
                title: document.getElementById('property-title').value,
                code: document.getElementById('property-code').value,
                type: document.getElementById('property-type').value,
                status: document.getElementById('property-category').value === 'للبيع' ? 'for-sale' : 'for-rent',
                price: document.getElementById('property-price').value,
                area: parseInt(document.getElementById('property-area').value),
                location: document.getElementById('property-location').value,
                description: document.getElementById('property-description').value,
                bedrooms: document.getElementById('bedrooms').value ? parseInt(document.getElementById('bedrooms').value) : null,
                bathrooms: document.getElementById('bathrooms').value ? parseInt(document.getElementById('bathrooms').value) : null,
                livingRooms: document.getElementById('living-rooms').value ? parseInt(document.getElementById('living-rooms').value) : null,
                kitchens: document.getElementById('kitchens').value ? parseInt(document.getElementById('kitchens').value) : null,
                parking: document.getElementById('parking').value ? parseInt(document.getElementById('parking').value) : null,
                floors: document.getElementById('floors').value ? parseInt(document.getElementById('floors').value) : null,
                yearBuilt: document.getElementById('year-built').value ? parseInt(document.getElementById('year-built').value) : null,
                additionalDetails: document.getElementById('additional-details').value || '',
                features: allFeatures,
                customFeatures: customFeatures,
                images: uploadedImages,
                videos: uploadedVideos
            };
            
            showAlert('تم تحديث العقار بنجاح', 'success');
            console.log('تم تحديث العقار:', adminProperties[propertyIndex]);
        }
    } else {
        // إنشاء عقار جديد
        const newProperty = {
            id: adminProperties.length > 0 ? Math.max(...adminProperties.map(p => p.id)) + 1 : 1,
            code: document.getElementById('property-code').value,
            title: document.getElementById('property-title').value,
            price: document.getElementById('property-price').value,
            type: document.getElementById('property-type').value,
            status: document.getElementById('property-category').value === 'للبيع' ? 'for-sale' : 'for-rent',
            date: new Date().toISOString().split('T')[0],
            location: document.getElementById('property-location').value,
            area: parseInt(document.getElementById('property-area').value),
            description: document.getElementById('property-description').value,
            image: uploadedImages.length > 0 ? uploadedImages[0] : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
            bedrooms: document.getElementById('bedrooms').value ? parseInt(document.getElementById('bedrooms').value) : null,
            bathrooms: document.getElementById('bathrooms').value ? parseInt(document.getElementById('bathrooms').value) : null,
            livingRooms: document.getElementById('living-rooms').value ? parseInt(document.getElementById('living-rooms').value) : null,
            kitchens: document.getElementById('kitchens').value ? parseInt(document.getElementById('kitchens').value) : null,
            parking: document.getElementById('parking').value ? parseInt(document.getElementById('parking').value) : null,
            floors: document.getElementById('floors').value ? parseInt(document.getElementById('floors').value) : null,
            yearBuilt: document.getElementById('year-built').value ? parseInt(document.getElementById('year-built').value) : null,
            additionalDetails: document.getElementById('additional-details').value || '',
            features: allFeatures,
            customFeatures: customFeatures,
            images: uploadedImages,
            videos: uploadedVideos
        };
        
        // إضافة العقار إلى القائمة
        adminProperties.unshift(newProperty);
        showAlert('تم إضافة العقار بنجاح', 'success');
        console.log('تم إضافة العقار الجديد:', newProperty);
    }
    
    // إعادة عرض الشبكة
    renderPropertiesGrid();
    
    // إغلاق النافذة
    closePropertyModal();
}

// تعديل العقار
function editProperty(propertyId) {
    openPropertyModal(propertyId);
}

// حذف العقار
function deleteProperty(propertyId) {
    if (confirm('هل أنت متأكد من حذف هذا العقار؟')) {
        adminProperties = adminProperties.filter(p => p.id !== propertyId);
        renderPropertiesGrid();
        extractCustomersFromProperties();
        showAlert('تم حذف العقار بنجاح', 'success');
    }
}

// عرض تفاصيل العقار
function viewPropertyDetails(propertyId) {
    const property = adminProperties.find(p => p.id === propertyId);
    
    if (!property) return;
    
    document.getElementById('details-modal-title').textContent = property.title;
    
    // تحديد نص الحالة
    let statusText = '';
    switch(property.status) {
        case 'for-sale':
            statusText = 'للبيع';
            break;
        case 'for-rent':
            statusText = 'للتأجير';
            break;
        case 'sold':
            statusText = 'تم البيع';
            break;
        case 'rented':
            statusText = 'تم التأجير';
            break;
    }
    
    // إنشاء محتوى التفاصيل
    let detailsHTML = `
        <div class="property-details">
            <div class="property-details-image">
                <img src="${property.image}" alt="${property.title}" onerror="this.src='https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'">
            </div>
            
            <div class="details-section">
                <h4>المعلومات الأساسية</h4>
                <div class="details-grid">
                    <div class="detail-item">
                        <span class="detail-label">رمز العقار:</span>
                        <span class="detail-value">${property.code}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">النوع:</span>
                        <span class="detail-value">${property.type}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">الحالة:</span>
                        <span class="detail-value"><span class="status-badge ${property.status}">${statusText}</span></span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">السعر:</span>
                        <span class="detail-value">${property.price}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">المساحة:</span>
                        <span class="detail-value">${property.area} م²</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">الموقع:</span>
                        <span class="detail-value">${property.location}</span>
                    </div>
                </div>
            </div>
    `;
    
    // إضافة تفاصيل العقار إذا كانت موجودة
    if (property.bedrooms || property.bathrooms || property.livingRooms || property.kitchens || property.parking || property.floors || property.yearBuilt) {
        detailsHTML += `
            <div class="details-section">
                <h4>تفاصيل العقار</h4>
                <div class="details-grid">
        `;
        
        if (property.bedrooms) {
            detailsHTML += `
                <div class="detail-item">
                    <span class="detail-label">غرف النوم:</span>
                    <span class="detail-value">${property.bedrooms}</span>
                </div>
            `;
        }
        
        if (property.bathrooms) {
            detailsHTML += `
                <div class="detail-item">
                    <span class="detail-label">الحمامات:</span>
                    <span class="detail-value">${property.bathrooms}</span>
                </div>
            `;
        }
        
        if (property.livingRooms) {
            detailsHTML += `
                <div class="detail-item">
                    <span class="detail-label">صالات الاستقبال:</span>
                    <span class="detail-value">${property.livingRooms}</span>
                </div>
            `;
        }
        
        if (property.kitchens) {
            detailsHTML += `
                <div class="detail-item">
                    <span class="detail-label">المطابخ:</span>
                    <span class="detail-value">${property.kitchens}</span>
                </div>
            `;
        }
        
        if (property.parking) {
            detailsHTML += `
                <div class="detail-item">
                    <span class="detail-label">مواقف السيارات:</span>
                    <span class="detail-value">${property.parking}</span>
                </div>
            `;
        }
        
        if (property.floors) {
            detailsHTML += `
                <div class="detail-item">
                    <span class="detail-label">الطوابق:</span>
                    <span class="detail-value">${property.floors}</span>
                </div>
            `;
        }
        
        if (property.yearBuilt) {
            detailsHTML += `
                <div class="detail-item">
                    <span class="detail-label">سنة البناء:</span>
                    <span class="detail-value">${property.yearBuilt}</span>
                </div>
            `;
        }
        
        detailsHTML += `
                </div>
            </div>
        `;
    }
    
    detailsHTML += `
            <div class="details-section">
                <h4>المميزات</h4>
                <div class="features-list">
    `;
    
    // إضافة المميزات
    if (property.features && property.features.length > 0) {
        property.features.forEach(feature => {
            detailsHTML += `<span class="feature-tag">${feature}</span>`;
        });
    } else {
        detailsHTML += `<p style="color: var(--color-text-secondary);">لا توجد مميزات</p>`;
    }
    
    detailsHTML += `
                </div>
            </div>
            
            <div class="details-section">
                <h4>الوصف</h4>
                <p>${property.description || 'لا يوجد وصف'}</p>
            </div>
    `;
    
    // إضافة تفاصيل العميل إذا كانت موجودة
    if (property.customer) {
        detailsHTML += `
            <div class="details-section">
                <h4>تفاصيل المعاملة</h4>
                <div class="details-grid">
                    <div class="detail-item">
                        <span class="detail-label">اسم العميل:</span>
                        <span class="detail-value">${property.customer.name}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">رقم الهاتف:</span>
                        <span class="detail-value">${property.customer.phone}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">تاريخ المعاملة:</span>
                        <span class="detail-value">${formatDate(property.customer.transactionDate)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">قيمة المعاملة:</span>
                        <span class="detail-value">${property.customer.transactionAmount} ${property.status === 'sold' ? 'ريال' : 'ريال/شهرياً'}</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    detailsHTML += `</div>`;
    
    document.getElementById('property-details-content').innerHTML = detailsHTML;
    detailsModal.classList.add('active');
}

// إغلاق نافذة التفاصيل
function closeDetailsModal() {
    detailsModal.classList.remove('active');
}

// عرض تفاصيل العميل
function viewCustomerDetails(customerId) {
    const customer = customers.find(c => c.id === customerId);
    
    if (!customer) return;
    
    const property = adminProperties.find(p => p.id === customerId);
    
    if (!property) return;
    
    let detailsHTML = `
        <div class="property-details">
            <div class="details-section">
                <h4>معلومات العميل</h4>
                <div class="details-grid">
                    <div class="detail-item">
                        <span class="detail-label">اسم العميل:</span>
                        <span class="detail-value">${customer.name}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">رقم الهاتف:</span>
                        <span class="detail-value">${customer.phone}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">نوع المعاملة:</span>
                        <span class="detail-value">${customer.transactionType === 'sold' ? 'شراء' : 'تأجير'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">تاريخ المعاملة:</span>
                        <span class="detail-value">${formatDate(customer.transactionDate)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">قيمة المعاملة:</span>
                        <span class="detail-value">${customer.transactionAmount} ${customer.transactionType === 'sold' ? 'ريال' : 'ريال/شهرياً'}</span>
                    </div>
                </div>
            </div>
            
            <div class="details-section">
                <h4>معلومات العقار</h4>
                <div class="details-grid">
                    <div class="detail-item">
                        <span class="detail-label">اسم العقار:</span>
                        <span class="detail-value">${property.title}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">رمز العقار:</span>
                        <span class="detail-value">${property.code}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">النوع:</span>
                        <span class="detail-value">${property.type}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">المساحة:</span>
                        <span class="detail-value">${property.area} م²</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">الموقع:</span>
                        <span class="detail-value">${property.location}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('property-details-content').innerHTML = detailsHTML;
    document.getElementById('details-modal-title').textContent = `تفاصيل العميل: ${customer.name}`;
    detailsModal.classList.add('active');
}

// حفظ الإعدادات
function saveSettings() {
    // في تطبيق حقيقي، يمكن حفظ الإعدادات في قاعدة البيانات
    showAlert('تم حفظ الإعدادات بنجاح', 'success');
}

// إغلاق جميع النوافذ
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// تسجيل الخروج
function handleLogout() {
    if (confirm('هل تريد تسجيل الخروج؟')) {
        // في تطبيق حقيقي، يمكن إعادة التوجيه إلى صفحة تسجيل الدخول
        showAlert('تم تسجيل الخروج بنجاح', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// إظهار رسائل التنبيه
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.innerHTML = `
        <i class="fas fa-${getAlertIcon(type)}"></i>
        <span>${message}</span>
        <button class="close-alert" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    alertContainer.appendChild(alert);
    
    // إزالة الرسالة تلقائياً بعد 5 ثوانٍ
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}

// الحصول على أيقونة التنبيه المناسبة
function getAlertIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

// تنسيق التاريخ
function formatDate(dateString) {
    if (!dateString) return 'غير محدد';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'غير محدد';
    
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'أمس';
    if (diffDays <= 7) return `منذ ${diffDays} أيام`;
    
    return date.toLocaleDateString('ar-SA');
}