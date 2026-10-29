// ============================================================
// عودة للعقار — Script (مربوط بـ Supabase)
// ============================================================

// ============================================================
// 1. متغيرات عامة
// ============================================================
let propertiesData = []; // سيتم تعبئتها من قاعدة البيانات
let currentProperties = [];
let map;
let currentPropertyMarker;
let currentPreviewProperty = null;
let currentImageIndex = 0;

// ============================================================
// 2. عناصر DOM
// ============================================================
const propertiesContainer = document.getElementById('properties-container');
const heroContainer = document.getElementById('hero-container');
const resultsCount = document.getElementById('results-count');
const previewOverlay = document.querySelector('.property-preview-overlay');
const mapOverlay = document.querySelector('.map-overlay');
const closePreview = document.querySelector('.close-preview');
const closeMap = document.querySelector('.close-map');
const previewContent = document.querySelector('.preview-content');
const propertyMap = document.getElementById('property-map');
const filterModal = document.querySelector('.filter-modal');
const closeFilter = document.querySelector('.close-filter');
const filterModalBtn = document.getElementById('filter-modal-btn');
const filterApplyBtn = document.getElementById('apply-filters');
const filterResetBtn = document.getElementById('reset-filters');
const previewFavoriteBtn = document.getElementById('preview-favorite-btn');
const searchInput = document.getElementById('search-input');
const searchClearBtn = document.getElementById('search-clear');
const shareModal = document.querySelector('.share-modal');
const closeShare = document.querySelector('.close-share');

// ============================================================
// 3. دالة لجلب العقارات من قاعدة البيانات وتحويلها
// ============================================================
async function loadPropertiesFromDB() {
    // نجلب العقارات التي حالتها "متاح" فقط
    const { data, error } = await window.db
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('فشل تحميل العقارات:', error);
        return;
    }

    // تحويل البيانات لتطابق شكل العرض في موقعك
    propertiesData = data.map(row => ({
        id: row.id,
        code: row.code || 'غير محدد',
        title: row.title,
        description: row.description || '',
        price: row.price || '',
        type: row.type || 'للبيع',
        category: row.category || 'شقق',
        area: row.area || 0,
        location: row.location || '',
        coordinates: [row.latitude || 24.7136, row.longitude || 46.6753],
        specs: row.specs || [],
        features: row.features || [],
        images: (row.images && row.images.length > 0) ? row.images : ['https://via.placeholder.com/800x600?text=No+Image'],
        agent: { name: row.agent_name || 'الوكيل', phone: row.agent_phone || '' },
        date: row.created_at
    }));
}

// ============================================================
// 4. التهيئة الأساسية
// ============================================================
document.addEventListener('DOMContentLoaded', initApp);

async function initApp() {
    // ننتظر جلب البيانات من قاعدة البيانات قبل العرض
    await loadPropertiesFromDB();
    
    currentProperties = [...propertiesData];
    renderProperties(currentProperties);
    initEventListeners();
    initFilterButtons();
}

// ============================================================
// 5. مستمعو الأحداث
// ============================================================
function initEventListeners() {
    if (closePreview) closePreview.addEventListener('click', closePropertyPreview);
    if (closeMap) closeMap.addEventListener('click', closePropertyMap);
    if (closeFilter) closeFilter.addEventListener('click', closeFilterModal);
    if (filterModalBtn) filterModalBtn.addEventListener('click', openFilterModal);
    if (filterApplyBtn) filterApplyBtn.addEventListener('click', applyFilters);
    if (filterResetBtn) filterResetBtn.addEventListener('click', resetFilters);
    if (previewFavoriteBtn) previewFavoriteBtn.addEventListener('click', togglePreviewFavorite);
    if (searchInput) searchInput.addEventListener('input', handleSearch);
    if (searchClearBtn) searchClearBtn.addEventListener('click', clearSearch);
    if (closeShare) closeShare.addEventListener('click', closeShareModal);

    if (previewOverlay) {
        previewOverlay.addEventListener('click', function (e) {
            if (e.target === previewOverlay) closePropertyPreview();
        });
    }

    if (mapOverlay) {
        mapOverlay.addEventListener('click', function (e) {
            if (e.target === mapOverlay) closePropertyMap();
        });
    }

    if (filterModal) {
        filterModal.addEventListener('click', function (e) {
            if (e.target === filterModal) closeFilterModal();
        });
    }

    if (shareModal) {
        shareModal.addEventListener('click', function (e) {
            if (e.target === shareModal) closeShareModal();
        });
    }

    const shareOptions = document.querySelectorAll('.share-option');
    shareOptions.forEach(option => {
        option.addEventListener('click', function () {
            const type = this.classList[1].split('-')[0];
            shareProperty(type);
        });
    });
}

// ============================================================
// 6. أزرار الفلترة السريعة
// ============================================================
function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.filters-bar .filter-btn[data-filter]');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterByCategory(this.getAttribute('data-filter'));
        });
    });
}

function filterByCategory(category) {
    if (category === 'all') {
        currentProperties = [...propertiesData];
    } else {
        currentProperties = propertiesData.filter(p => p.category === category);
    }
    renderProperties(currentProperties);
}

// ============================================================
// 7. البحث
// ============================================================
function handleSearch() {
    const term = searchInput.value.trim().toLowerCase();
    searchClearBtn.classList.toggle('active', term.length > 0);

    if (term.length < 2) {
        currentProperties = [...propertiesData];
        renderProperties(currentProperties);
        return;
    }

    currentProperties = propertiesData.filter(p =>
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.location.toLowerCase().includes(term) ||
        p.code.toLowerCase().includes(term)
    );
    renderProperties(currentProperties);
}

function clearSearch() {
    searchInput.value = '';
    searchClearBtn.classList.remove('active');
    currentProperties = [...propertiesData];
    renderProperties(currentProperties);
}

// ============================================================
// 8. العرض — Hero + Bento Grid
// ============================================================
function renderProperties(properties) {
    if (resultsCount) {
        resultsCount.textContent = properties.length === 0
            ? 'لا توجد نتائج'
            : `${properties.length} ${properties.length === 1 ? 'عقار' : 'عقارات'}`;
    }

    if (properties.length === 0) {
        if (heroContainer) heroContainer.innerHTML = '';
        propertiesContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>لا توجد نتائج</h3>
                <p>لم نتمكن من العثور على عقارات تطابق معايير البحث</p>
                <button class="reset-search-btn" onclick="resetFilters()">إعادة تعيين البحث</button>
            </div>
        `;
        return;
    }

    const [first, ...rest] = properties;

    if (heroContainer) {
        heroContainer.innerHTML = createHeroMarkup(first);
        const heroCard = heroContainer.querySelector('.hero-card');
        if (heroCard) {
            heroCard.addEventListener('click', () => openPropertyPreview(first.id));
        }
    }

    propertiesContainer.innerHTML = '';
    rest.forEach((property, index) => {
        const card = createPropertyCard(property);
        card.style.animationDelay = `${index * 0.06}s`;
        propertiesContainer.appendChild(card);
    });
}

// ============================================================
// 9. بناء الهيرو والبطاقات
// ============================================================
function createHeroMarkup(property) {
    const typeLabel = property.type === 'للبيع' ? 'معروض للبيع' : 'متاح للإيجار';
    return `
        <article class="hero-card" data-id="${property.id}">
            <div class="hero-image">
                <img src="${property.images[0]}" alt="${property.title}">
                <div class="hero-overlay"></div>
            </div>
            <div class="hero-badge">✨ مميز هذا الأسبوع</div>
            <div class="hero-content">
                <div class="hero-meta-top">
                    <span class="hero-type-tag">${typeLabel}</span>
                    <span class="hero-code-tag">${property.code}</span>
                </div>
                <h1 class="hero-title">${property.title}</h1>
                <div class="hero-info">
                    <span class="hero-location"><i class="fas fa-map-marker-alt"></i> ${property.location}</span>
                    <span class="hero-price">${property.price}</span>
                </div>
                <button class="hero-cta">عرض التفاصيل <i class="fas fa-arrow-left"></i></button>
            </div>
        </article>
    `;
}

function createPropertyCard(property) {
    const card = document.createElement('div');
    card.className = 'property-card';
    card.setAttribute('data-id', property.id);
    card.setAttribute('data-category', property.category);

    card.innerHTML = `
        <div class="property-image">
            <img src="${property.images[0]}" alt="${property.title}" loading="lazy">
            <div class="property-badge" data-type="${property.type}">${property.type}</div>
            <div class="property-code">${property.code}</div>
            <div class="property-actions-top">
                <button class="property-action-top property-favorite" aria-label="مفضلة"><i class="far fa-heart"></i></button>
                <button class="property-action-top property-share" aria-label="مشاركة"><i class="fas fa-share-alt"></i></button>
            </div>
        </div>
        <div class="property-content">
            <div class="property-header">
                <h3 class="property-title">${property.title}</h3>
                <div class="property-price">${property.price}</div>
            </div>
            <div class="property-location">
                <i class="fas fa-map-marker-alt"></i> <span>${property.location}</span>
            </div>
            <p class="property-description">${property.description}</p>
            <div class="property-specs">
                ${property.specs.map(spec => `
                    <div class="spec-item">
                        <div class="spec-icon"><i class="${spec.icon}"></i></div>
                        <div class="spec-value">${spec.value}</div>
                        <div class="spec-label">${spec.label}</div>
                    </div>
                `).join('')}
            </div>
            <div class="property-footer">
                <div class="property-meta"><i class="far fa-clock"></i> <span>${formatDate(property.date)}</span></div>
                <div class="property-actions">
                    <button class="property-action-btn share-btn" aria-label="مشاركة"><i class="fas fa-share-alt"></i></button>
                    <button class="property-action-btn visit-btn" aria-label="الخريطة"><i class="fas fa-map-marker-alt"></i></button>
                    <button class="property-action-btn preview-btn" aria-label="معاينة"><i class="fas fa-eye"></i></button>
                </div>
            </div>
        </div>
    `;

    card.addEventListener('click', function (e) {
        if (!e.target.closest('.property-actions') && !e.target.closest('.property-actions-top')) {
            openPropertyPreview(property.id);
        }
    });

    const favoriteBtn = card.querySelector('.property-favorite');
    favoriteBtn.addEventListener('click', function (e) { e.stopPropagation(); toggleFavorite(favoriteBtn); });

    const shareTopBtn = card.querySelector('.property-share');
    shareTopBtn.addEventListener('click', function (e) { e.stopPropagation(); openShareModal(property); });

    const previewBtn = card.querySelector('.preview-btn');
    previewBtn.addEventListener('click', function (e) { e.stopPropagation(); openPropertyPreview(property.id); });

    const visitBtn = card.querySelector('.visit-btn');
    visitBtn.addEventListener('click', function (e) { e.stopPropagation(); openPropertyMap(property.id); });

    const shareBottomBtn = card.querySelector('.share-btn');
    shareBottomBtn.addEventListener('click', function (e) { e.stopPropagation(); openShareModal(property); });

    return card;
}

// ============================================================
// 10. المعاينة
// ============================================================
function openPropertyPreview(propertyId) {
    const property = propertiesData.find(p => p.id === propertyId);
    if (!property) return;

    currentPreviewProperty = property;
    currentImageIndex = 0;
    previewContent.innerHTML = generatePreviewContent(property);

    if (property.images.length > 1) {
        initGalleryNavigation(property);
    }

    const previewVisitBtn = document.querySelector('.preview-visit-btn');
    const previewWhatsappBtn = document.querySelector('.preview-whatsapp-btn');

    if (previewVisitBtn) {
        previewVisitBtn.addEventListener('click', function () {
            closePropertyPreview();
            setTimeout(() => openPropertyMap(property.id), 300);
        });
    }

    if (previewWhatsappBtn) {
        previewWhatsappBtn.addEventListener('click', function () { contactViaWhatsapp(property); });
    }

    if (previewFavoriteBtn) {
        previewFavoriteBtn.classList.remove('active');
        const favIcon = previewFavoriteBtn.querySelector('i');
        favIcon.classList.remove('fas');
        favIcon.classList.add('far');
    }

    previewOverlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closePropertyPreview() {
    previewOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentPreviewProperty = null;
}

// ============================================================
// 11. الخريطة
// ============================================================
function openPropertyMap(propertyId) {
    const property = propertiesData.find(p => p.id === propertyId);
    if (!property) return;

    if (!map) {
        initMap(property.coordinates);
    } else {
        map.setView(property.coordinates, 16);
    }

    if (currentPropertyMarker) map.removeLayer(currentPropertyMarker);

    // ⚠️ هنا تم وضع علامات تنصيص حول الـ ID لأنه أصبح نصاً (UUID)
    currentPropertyMarker = L.marker(property.coordinates)
        .addTo(map)
        .bindPopup(`
            <div class="map-popup">
                <img src="${property.images[0]}" style="width: 130px; height: 90px; object-fit: cover; border-radius: 8px;">
                <h3 style="margin: 8px 0 4px; font-size: 13px; color: #F2EEF5; font-family: Tajawal; font-weight: 700;">${property.title}</h3>
                <p style="margin: 0; color: #F25C93; font-weight: 800; font-size: 13px; font-family: Tajawal;">${property.price}</p>
                <button onclick="openPropertyPreview('${property.id}')" style="margin-top: 8px; background: #2563EB; color: white; border: none; padding: 6px 12px; border-radius: 999px; cursor: pointer; width: 100%; font-size: 12px; font-family: Tajawal; font-weight: 700;">عرض التفاصيل</button>
            </div>
        `)
        .openPopup();

    mapOverlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    setTimeout(() => map.setView(property.coordinates, 16), 100);
}

function closePropertyMap() {
    mapOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function initMap(center) {
    map = L.map('property-map').setView(center, 16);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CartoDB',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);
}

// ============================================================
// 12. الفلترة المتقدمة
// ============================================================
function openFilterModal() { filterModal.style.display = 'block'; document.body.style.overflow = 'hidden'; }
function closeFilterModal() { filterModal.style.display = 'none'; document.body.style.overflow = 'auto'; }

function applyFilters() {
    const selectedTypes = Array.from(document.querySelectorAll('input[name="property-type"]:checked')).map(input => input.value);
    const selectedTransactions = Array.from(document.querySelectorAll('input[name="transaction-type"]:checked')).map(input => input.value);
    const minPrice = document.querySelector('#min-price').value;
    const maxPrice = document.querySelector('#max-price').value;
    const minArea = document.querySelector('#min-area').value;
    const maxArea = document.querySelector('#max-area').value;

    currentProperties = propertiesData.filter(property => {
        if (selectedTypes.length > 0 && !selectedTypes.includes(property.category)) return false;
        if (selectedTransactions.length > 0 && !selectedTransactions.some(t => property.type.includes(t))) return false;

        if (minPrice || maxPrice) {
            const price = extractNumber(property.price);
            if (minPrice && price < parseInt(minPrice)) return false;
            if (maxPrice && price > parseInt(maxPrice)) return false;
        }

        if (minArea || maxArea) {
            if (minArea && property.area < parseInt(minArea)) return false;
            if (maxArea && property.area > parseInt(maxArea)) return false;
        }
        return true;
    });

    renderProperties(currentProperties);
    closeFilterModal();
}

function resetFilters() {
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
    document.querySelectorAll('.price-input, .area-input').forEach(input => input.value = '');
    document.querySelectorAll('.filters-bar .filter-btn').forEach(btn => btn.classList.remove('active'));
    const allBtn = document.querySelector('.filters-bar .filter-btn[data-filter="all"]');
    if (allBtn) allBtn.classList.add('active');

    currentProperties = [...propertiesData];
    renderProperties(currentProperties);
    closeFilterModal();
}

// ============================================================
// 13. المشاركة والتواصل
// ============================================================
function openShareModal(property) { shareModal.style.display = 'block'; document.body.style.overflow = 'hidden'; currentPreviewProperty = property; }
function closeShareModal() { shareModal.style.display = 'none'; document.body.style.overflow = 'auto'; }

function shareProperty(type) {
    const property = currentPreviewProperty;
    if (!property) return;
    const url = window.location.href.split('?')[0] + `?property=${property.id}`;
    const text = `تفضل بمعاينة هذا العقار: ${property.title} (${property.code}) - ${property.price}`;

    switch (type) {
        case 'whatsapp': window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank'); break;
        case 'telegram': window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank'); break;
        case 'link': navigator.clipboard.writeText(url).then(() => alert('تم نسخ الرابط')); break;
    }
    closeShareModal();
}

function contactViaWhatsapp(property) {
    const phone = property.agent.phone;
    const message = `مرحباً، أنا مهتم بالعقار ${property.title} (${property.code}) - ${property.price}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
}

// ============================================================
// 14. توليد محتوى المعاينة
// ============================================================
function generatePreviewContent(property) {
    return `
        <div class="preview-gallery">
            <div class="gallery-slider">
                ${property.images.map((img, i) => `<div class="gallery-slide"><img src="${img}"></div>`).join('')}
            </div>
            ${property.images.length > 1 ? `
            <div class="gallery-nav">
                <button class="gallery-nav-btn prev-btn"><i class="fas fa-chevron-right"></i></button>
                <button class="gallery-nav-btn next-btn"><i class="fas fa-chevron-left"></i></button>
            </div>
            <div class="gallery-indicators">
                ${property.images.map((_, i) => `<button class="gallery-indicator ${i === 0 ? 'active' : ''}" data-index="${i}"></button>`).join('')}
            </div>` : ''}
        </div>
        <div class="preview-details">
            <div class="preview-header-info">
                <div>
                    <h2 class="preview-name">${property.title}</h2>
                    <div class="preview-location"><i class="fas fa-map-marker-alt"></i> <span>${property.location}</span></div>
                </div>
                <div class="preview-price">${property.price}</div>
            </div>
            <div class="preview-code"><i class="fas fa-hashtag"></i> <span>رمز العقار: <strong>${property.code}</strong></span></div>
            <p class="preview-description">${property.description}</p>
            <div class="preview-specs-grid">
                ${property.specs.map(spec => `
                    <div class="preview-spec-item">
                        <i class="${spec.icon}"></i>
                        <div><div class="preview-spec-value">${spec.value}</div><div class="preview-spec-label">${spec.label}</div></div>
                    </div>
                `).join('')}
            </div>
            <div class="preview-features">
                <h3 class="preview-features-title">المميزات</h3>
                <div class="preview-features-list">${property.features.map(f => `<div class="preview-feature">${f}</div>`).join('')}</div>
            </div>
        </div>
        <div class="preview-map" id="preview-mini-map">
            <div class="preview-map-overlay">
                <div class="preview-map-address">${property.location}</div>
                <button class="preview-map-btn"><i class="fas fa-expand"></i> عرض كامل</button>
            </div>
        </div>
        <div class="preview-contact-buttons">
            <button class="preview-contact-btn preview-visit-btn"><i class="fas fa-map-marked-alt"></i> زيارة الموقع</button>
            <button class="preview-contact-btn preview-whatsapp-btn"><i class="fab fa-whatsapp"></i> تواصل عبر واتساب</button>
        </div>
    `;
}

// ============================================================
// 15. التنقل بين الصور والمفضلة
// ============================================================
function initGalleryNavigation(property) {
    const slider = document.querySelector('.gallery-slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const indicators = document.querySelectorAll('.gallery-indicator');
    const total = property.images.length;

    function update() {
        slider.style.transform = `translateX(-${currentImageIndex * 100}%)`;
        indicators.forEach((ind, i) => ind.classList.toggle('active', i === currentImageIndex));
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { currentImageIndex = (currentImageIndex + 1) % total; update(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { currentImageIndex = (currentImageIndex - 1 + total) % total; update(); });
    indicators.forEach((ind, i) => ind.addEventListener('click', () => { currentImageIndex = i; update(); }));

    const previewMapBtn = document.querySelector('.preview-map-btn');
    if (previewMapBtn) previewMapBtn.addEventListener('click', () => { closePropertyPreview(); setTimeout(() => openPropertyMap(property.id), 300); });
}

function toggleFavorite(button) {
    button.classList.toggle('active');
    const icon = button.querySelector('i');
    if (button.classList.contains('active')) { icon.classList.remove('far'); icon.classList.add('fas'); } 
    else { icon.classList.remove('fas'); icon.classList.add('far'); }
}

function togglePreviewFavorite() {
    previewFavoriteBtn.classList.toggle('active');
    const icon = previewFavoriteBtn.querySelector('i');
    if (previewFavoriteBtn.classList.contains('active')) { icon.classList.remove('far'); icon.classList.add('fas'); } 
    else { icon.classList.remove('fas'); icon.classList.add('far'); }
}

// ============================================================
// 16. أدوات مساعدة
// ============================================================
function extractNumber(priceString) {
    if (!priceString) return 0;
    const number = priceString.toString().replace(/[^\d]/g, '');
    return parseInt(number) || 0;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'منذ يوم';
    if (diffDays <= 7) return `منذ ${diffDays} أيام`;
    if (diffDays <= 30) return `منذ ${Math.floor(diffDays / 7)} أسابيع`;
    return `منذ ${Math.floor(diffDays / 30)} أشهر`;
}

// ============================================================
// 17. دعم السحب للإغلاق (للجوال)
// ============================================================
let startY = 0, currentY = 0;
function setupSwipeClose(el, closeFn) {
    if (!el) return;
    el.addEventListener('touchstart', e => startY = e.touches[0].clientY);
    el.addEventListener('touchmove', e => { currentY = e.touches[0].clientY; if (currentY - startY > 80) closeFn(); });
}
setupSwipeClose(previewOverlay, closePropertyPreview);
setupSwipeClose(mapOverlay, closePropertyMap);
setupSwipeClose(filterModal, closeFilterModal);
setupSwipeClose(shareModal, closeShareModal);