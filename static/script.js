/**
 * DailyBite - Advanced 3D Culinary Studio & Interactive Micro-Interactions
 * UI/UX Pro Max Edition + Realistic 3D WebGL Engine + Dish Orbit Carousel
 */

// ==========================================================================
// 1. Comprehensive Culinary 3D Profiles for EVERY Food Item
// ==========================================================================
const DISH_3D_REGISTRY = {
    "Veg Fried Rice": {
        type: "rice",
        toppingsColor: 0x4ade80,
        macros: { calories: 340, protein: "8g", carbs: "52g", fat: "9g" },
        layers: { base: "Wok-Tossed Basmati", mid: "Stir-Fried Garden Veggies", top: "Crisp Spring Onions & Sesame" },
        hotspots: [
            { id: "h1", name: "Wok-Charred Basmati", x: 0.35, y: 0.55, z: 0.25, desc: "Aged long-grain rice wok-charred with sesame oil and savory soy aromatics." },
            { id: "h2", name: "Garden Vegetables", x: -0.45, y: 0.6, z: -0.2, desc: "Crisp carrots, French beans, and sweet corn flash-fried to retain crunch." },
            { id: "h3", name: "Spring Onion Snips", x: 0.1, y: 0.72, z: -0.3, desc: "Freshly harvested green scallions for a sharp, fresh herbal finish." }
        ]
    },
    "Paneer Biryani": {
        type: "biryani",
        toppingsColor: 0xfde047,
        macros: { calories: 420, protein: "16g", carbs: "56g", fat: "14g" },
        layers: { base: "Dum Saffron Basmati", mid: "Marinated Malai Paneer Cubes", top: "Caramelized Birista & Fresh Mint" },
        hotspots: [
            { id: "h1", name: "Marinated Malai Paneer", x: -0.4, y: 0.68, z: 0.35, desc: "Handcrafted cottage cheese marinated in hung curd, ginger, and royal shahi garam masala." },
            { id: "h2", name: "Saffron Dum Rice", x: 0.45, y: 0.52, z: -0.2, desc: "Extra long-grain basmati steam-cooked on slow dum with kewra and saffron water." },
            { id: "h3", name: "Caramelized Birista", x: 0.15, y: 0.75, z: 0.2, desc: "Slow-caramelized golden brown onion crisps providing rich sweetness and aroma." }
        ]
    },
    "Chicken Biryani": {
        type: "biryani",
        toppingsColor: 0xd97706,
        macros: { calories: 510, protein: "28g", carbs: "54g", fat: "18g" },
        layers: { base: "Slow-Dum Spiced Basmati", mid: "Tender Marinated Dum Chicken", top: "Golden Shallots & Garden Mint" },
        hotspots: [
            { id: "h1", name: "Tender Dum Chicken", x: -0.35, y: 0.65, z: 0.35, desc: "Succulent bone-in chicken slow cooked until fork-tender in stone-ground spice gravy." },
            { id: "h2", name: "Royal Basmati Rice", x: 0.4, y: 0.55, z: -0.3, desc: "Long, non-sticky aged rice infused with star anise, black cardamom, and desi ghee." },
            { id: "h3", name: "Fresh Mint & Garlic", x: 0.1, y: 0.76, z: -0.15, desc: "Aromatic mountain mint leaves and slivered garlic chips." }
        ]
    },
    "Masala Dosa": {
        type: "dosa",
        toppingsColor: 0xf59e0b,
        macros: { calories: 290, protein: "7g", carbs: "48g", fat: "8g" },
        layers: { base: "Ghee-Roasted Golden Crepe", mid: "Spiced Potato Masala Filling", top: "Curry Leaves & Mustard Tempering" },
        hotspots: [
            { id: "h1", name: "Golden Crispy Crepe", x: 0.0, y: 0.65, z: 0.0, desc: "Naturally fermented lentil-rice batter roasted over cast iron with pure desi ghee." },
            { id: "h2", name: "Potato Masala Filling", x: -0.5, y: 0.5, z: 0.3, desc: "Yukon gold potatoes tempered with mustard seeds, green chilies, and fresh turmeric." },
            { id: "h3", name: "Fresh Coconut Chutney", x: 0.75, y: 0.35, z: 0.45, desc: "Cold-ground fresh grated coconut tempered with dried red chilies and curry leaves." }
        ]
    },
    "Idli Sambar": {
        type: "idli",
        toppingsColor: 0xf8fafc,
        macros: { calories: 220, protein: "8g", carbs: "42g", fat: "2g" },
        layers: { base: "Steamed Fluffy Rice Cakes", mid: "Vegetable Lentil Sambar", top: "Mustard Seed Desi Ghee Tadka" },
        hotspots: [
            { id: "h1", name: "Steamed Soft Idlis", x: -0.3, y: 0.58, z: 0.2, desc: "Ultra-fluffy steamed cakes made from fermented urad dal and parboiled rice." },
            { id: "h2", name: "Tangy Drumstick Sambar", x: 0.55, y: 0.42, z: -0.2, desc: "Toor dal broth simmered with tender drumsticks, shallots, and tamarind pulp." },
            { id: "h3", name: "Mustard Seed Tadka", x: 0.1, y: 0.68, z: -0.35, desc: "Popped black mustard seeds and curry leaves bloomed in hot desi ghee." }
        ]
    },
    "Egg Fried Rice": {
        type: "rice",
        toppingsColor: 0xfacc15,
        macros: { calories: 380, protein: "15g", carbs: "50g", fat: "12g" },
        layers: { base: "Wok-Charred Basmati", mid: "Golden Scrambled Egg Curds", top: "Chopped Scallions & White Pepper" },
        hotspots: [
            { id: "h1", name: "Wok-Scrambled Eggs", x: -0.35, y: 0.62, z: 0.3, desc: "Farm-fresh eggs flash scrambled soft in a smoking cast-iron wok." },
            { id: "h2", name: "Charred Pepper Rice", x: 0.4, y: 0.52, z: -0.3, desc: "Fluffy basmati tossed with toasted sesame oil and fine white pepper." },
            { id: "h3", name: "Green Scallions", x: 0.05, y: 0.72, z: 0.15, desc: "Crisp scallion rounds adding crunch and aroma." }
        ]
    },
    "Poha with Peanuts": {
        type: "poha",
        toppingsColor: 0xfbbf24,
        macros: { calories: 260, protein: "6g", carbs: "44g", fat: "7g" },
        layers: { base: "Turmeric Tempered Flattened Rice", mid: "Roasted Crunchy Peanuts", top: "Crispy Sev, Lemon & Coriander" },
        hotspots: [
            { id: "h1", name: "Turmeric Rice Flakes", x: 0.0, y: 0.55, z: 0.0, desc: "Thick beaten rice soaked and sauteed with onions, mustard, and fragrant turmeric." },
            { id: "h2", name: "Roasted Peanuts", x: 0.4, y: 0.62, z: 0.25, desc: "Crunchy red-skin peanuts roasted with pink rock salt." },
            { id: "h3", name: "Fresh Lemon & Sev", x: -0.35, y: 0.68, z: -0.2, desc: "Tangy freshly squeezed lemon juice and crispy chickpea sev." }
        ]
    },
    "Egg Omelette & Toast": {
        type: "omelette",
        toppingsColor: 0xf59e0b,
        macros: { calories: 320, protein: "17g", carbs: "26g", fat: "16g" },
        layers: { base: "Artisanal Butter Toast", mid: "Fluffy Double-Egg Herb Omelette", top: "Cracked Tellicherry Pepper & Chives" },
        hotspots: [
            { id: "h1", name: "Herb Masala Omelette", x: -0.2, y: 0.58, z: 0.1, desc: "Farm eggs whisked with finely diced red onions, ripe tomatoes, green chilies, and cilantro." },
            { id: "h2", name: "Golden Toast", x: 0.55, y: 0.48, z: -0.25, desc: "Thick cut bread pan-toasted with salted butter until golden brown." },
            { id: "h3", name: "Black Pepper Crush", x: 0.0, y: 0.68, z: 0.25, desc: "Cracked black peppercorns offering warmth and zest." }
        ]
    },
    "South Indian Thali": {
        type: "thali",
        toppingsColor: 0x10b981,
        macros: { calories: 580, protein: "14g", carbs: "92g", fat: "15g" },
        layers: { base: "Steamed Sona Masoori Rice", mid: "Assorted Katoris (Sambar, Rasam, Curd)", top: "Crispy Urad Papad & Sweet Payasam" },
        hotspots: [
            { id: "h1", name: "Steamed Rice & Desi Ghee", x: 0.0, y: 0.58, z: 0.0, desc: "Mound of premium Sona Masoori rice topped with a spoonful of melted cow ghee." },
            { id: "h2", name: "Fiery Pepper Rasam", x: -0.65, y: 0.42, z: 0.3, desc: "Digestive soup of tamarind, crushed tomatoes, cumin, and black pepper." },
            { id: "h3", name: "Crispy Roasted Papad", x: 0.65, y: 0.5, z: -0.35, desc: "Sun-dried urad dal wafer flame-roasted for a crisp accompaniment." }
        ]
    },
    "Fish Curry & Rice": {
        type: "curry",
        toppingsColor: 0xe11d48,
        macros: { calories: 440, protein: "26g", carbs: "50g", fat: "14g" },
        layers: { base: "Fluffy Steamed White Rice", mid: "Tangy Coconut Tamarind Broth", top: "Fresh Seer Fish Fillet & Curry Leaves" },
        hotspots: [
            { id: "h1", name: "Fresh Seer Fish Fillet", x: -0.3, y: 0.62, z: 0.2, desc: "Coastal Kingfish steak cooked gently in coconut-tamarind gravy." },
            { id: "h2", name: "Malabar Coconut Curry", x: 0.35, y: 0.48, z: -0.2, desc: "Rich freshly squeezed coconut milk infused with kudampuli and spices." },
            { id: "h3", name: "Curry Leaf Garnish", x: 0.05, y: 0.68, z: -0.35, desc: "Flash-fried crisp curry leaves for aromatic coastal aroma." }
        ]
    },
    "Paneer Butter Masala": {
        type: "curry",
        toppingsColor: 0xf97316,
        macros: { calories: 460, protein: "18g", carbs: "22g", fat: "32g" },
        layers: { base: "Velvety Makhani Tomato Gravy", mid: "Tender Cottage Cheese Cubes", top: "Fresh Dairy Cream Swirl & Kasuri Methi" },
        hotspots: [
            { id: "h1", name: "Fresh Cottage Cheese", x: -0.3, y: 0.62, z: 0.25, desc: "Melt-in-mouth paneer cubes simmered gently in buttery sauce." },
            { id: "h2", name: "Silky Makhani Sauce", x: 0.35, y: 0.52, z: -0.2, desc: "Slow-simmered vine-ripened tomatoes, cashew cream, and churned butter." },
            { id: "h3", name: "Cream Swirl & Fenugreek", x: 0.0, y: 0.72, z: 0.1, desc: "Drizzle of heavy fresh cream and crushed roasted kasuri methi." }
        ]
    },
    "Dal Tadka & Jeera Rice": {
        type: "curry",
        toppingsColor: 0xeab308,
        macros: { calories: 360, protein: "13g", carbs: "58g", fat: "9g" },
        layers: { base: "Jeera Tempered Basmati Rice", mid: "Yellow Lentil Toor Dal", top: "Garlic, Cumin & Dry Red Chili Tadka" },
        hotspots: [
            { id: "h1", name: "Creamy Toor Dal", x: -0.35, y: 0.52, z: 0.2, desc: "Yellow pigeon peas cooked tender with turmeric, ginger, and green chilies." },
            { id: "h2", name: "Desi Ghee Tadka", x: 0.1, y: 0.65, z: 0.1, desc: "Golden caramelized garlic cloves, crackling cumin seeds, and whole dry chilies." },
            { id: "h3", name: "Fragrant Jeera Rice", x: 0.45, y: 0.52, z: -0.25, desc: "Aromatic basmati rice tempered with whole Shahjeera." }
        ]
    },
    "Butter Chicken & Naan": {
        type: "curry",
        toppingsColor: 0xe11d48,
        macros: { calories: 540, protein: "32g", carbs: "42g", fat: "26g" },
        layers: { base: "Garlic Butter Tandoori Naan", mid: "Smoked Tandoori Chicken Pieces", top: "Rich Makhani Gravy & Herb Garnish" },
        hotspots: [
            { id: "h1", name: "Smoked Tandoori Chicken", x: -0.25, y: 0.62, z: 0.2, desc: "Char-grilled tandoori chicken simmered in rich makhani sauce." },
            { id: "h2", name: "Makhani Butter Gravy", x: 0.25, y: 0.5, z: -0.2, desc: "Tomato-cashew emulsion seasoned with green cardamom and mace." },
            { id: "h3", name: "Garlic Butter Naan", x: 0.65, y: 0.52, z: 0.35, desc: "Soft leavened flatbread brushed with garlic and clarified butter." }
        ]
    },
    "Grilled Chicken Bowl": {
        type: "rice",
        toppingsColor: 0x854d0e,
        macros: { calories: 390, protein: "35g", carbs: "38g", fat: "10g" },
        layers: { base: "Spiced Brown Rice & Quinoa", mid: "Herb-Marinated Chicken Strips", top: "Sautéed Broccoli & Garden Greens" },
        hotspots: [
            { id: "h1", name: "Herb-Charred Chicken", x: -0.25, y: 0.65, z: 0.2, desc: "Lean chicken breast marinated in fresh rosemary, oregano, garlic, and cold-pressed olive oil." },
            { id: "h2", name: "Brown Rice & Quinoa", x: 0.35, y: 0.5, z: -0.25, desc: "Fiber-rich whole grains seasoned with cracked sea salt and herbs." },
            { id: "h3", name: "Garden Greens", x: 0.1, y: 0.72, z: -0.3, desc: "Flash-steamed crisp broccoli florets and tender zucchini." }
        ]
    }
};

// Fallback profile generator for any unknown dish
function getDishProfile(name) {
    if (DISH_3D_REGISTRY[name]) {
        return DISH_3D_REGISTRY[name];
    }
    // Default smart profile
    return {
        type: "rice",
        toppingsColor: 0x10b981,
        macros: { calories: 350, protein: "12g", carbs: "50g", fat: "10g" },
        layers: { base: "Fresh Gourmet Base", mid: "Chef Selected Protein & Spices", top: "Fresh Culinary Herb Garnish" },
        hotspots: [
            { id: "h1", name: "Signature Main", x: 0.0, y: 0.6, z: 0.2, desc: "Prepared fresh with curated farm ingredients and aromatic seasonings." },
            { id: "h2", name: "Slow-Cooked Base", x: 0.4, y: 0.5, z: -0.25, desc: "Traditional slow-cooking brings out deep, natural culinary flavors." },
            { id: "h3", name: "Fresh Herb Garnish", x: -0.2, y: 0.7, z: -0.2, desc: "Topped with freshly snipped herbs and pure desi tempering." }
        ]
    };
}

// ==========================================================================
// 2. Lifecycle Initialization
// ==========================================================================
document.addEventListener('DOMContentLoaded', function () {
    initNavbarScroll();
    initBudgetSlider();
    initQuickFilters();
    initMealDetailsModal();
    initQuickPlanModal();
    initDishOrbitCarousel();
    initFood3DStudio();
});

// ==========================================================================
// 3. Navbar Glassmorphic Scroll Effect
// ==========================================================================
function initNavbarScroll() {
    const navbar = document.querySelector('.dailybite-navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function () {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ==========================================================================
// 4. Budget Range Slider with Realtime Value Display & Chip Sync
// ==========================================================================
function initBudgetSlider() {
    const slider = document.getElementById('budgetSlider');
    const display = document.getElementById('budgetValueDisplay');
    const chips = document.querySelectorAll('.budget-chip');
    const hiddenInput = document.getElementById('maxPriceInput');

    if (!slider || !display) return;

    function updateSlider(val) {
        slider.value = val;
        display.textContent = '₹' + val;
        if (hiddenInput) hiddenInput.value = val;

        chips.forEach(chip => {
            const chipVal = chip.getAttribute('data-value');
            if (chipVal === String(val)) {
                chip.classList.add('active');
            } else {
                chip.classList.remove('active');
            }
        });
    }

    slider.addEventListener('input', function () {
        updateSlider(this.value);
    });

    chips.forEach(chip => {
        chip.addEventListener('click', function () {
            const val = this.getAttribute('data-value');
            if (val) {
                updateSlider(val);
                const filterForm = document.getElementById('filterForm');
                if (filterForm) filterForm.submit();
            }
        });
    });
}

// ==========================================================================
// 5. Category & Diet Pill Sync + Client Search
// ==========================================================================
function initQuickFilters() {
    const categoryPills = document.querySelectorAll('.category-pill');
    const categoryInput = document.getElementById('categoryInput');
    const filterForm = document.getElementById('filterForm');

    categoryPills.forEach(pill => {
        pill.addEventListener('click', function () {
            const cat = this.getAttribute('data-category');
            if (categoryInput) categoryInput.value = cat;
            if (filterForm) filterForm.submit();
        });
    });

    const dietButtons = document.querySelectorAll('.diet-toggle-btn');
    const dietInput = document.getElementById('foodTypeInput');

    dietButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const diet = this.getAttribute('data-diet');
            if (dietInput) dietInput.value = diet;
            if (filterForm) filterForm.submit();
        });
    });

    const searchInput = document.getElementById('quickSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const query = this.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.meal-card-col');
            let visibleCount = 0;

            cards.forEach(card => {
                const title = card.getAttribute('data-name') || '';
                const desc = card.getAttribute('data-desc') || '';
                const category = card.getAttribute('data-category') || '';

                if (title.includes(query) || desc.includes(query) || category.includes(query)) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            const emptyMsg = document.getElementById('emptySearchMessage');
            if (emptyMsg) {
                emptyMsg.classList.toggle('d-none', visibleCount > 0);
            }
        });
    }
}

// ==========================================================================
// 6. Meal Details Modal
// ==========================================================================
function initMealDetailsModal() {
    const modalElement = document.getElementById('mealDetailModal');
    if (!modalElement) return;

    const modal = new bootstrap.Modal(modalElement);
    const detailButtons = document.querySelectorAll('.btn-view-details');

    detailButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const name = this.getAttribute('data-name');
            const price = this.getAttribute('data-price');
            const category = this.getAttribute('data-category');
            const foodType = this.getAttribute('data-foodtype');
            const desc = this.getAttribute('data-desc');
            const img = this.getAttribute('data-img');
            const mealId = this.getAttribute('data-id');

            document.getElementById('modalMealTitle').textContent = name;
            document.getElementById('modalMealPrice').textContent = '₹' + price;
            document.getElementById('modalMealCategory').textContent = category;
            document.getElementById('modalMealDesc').textContent = desc;

            const modalImg = document.getElementById('modalMealImg');
            if (modalImg) modalImg.src = img || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80';

            const badge = document.getElementById('modalMealDietBadge');
            if (badge) {
                badge.className = 'diet-stamp ' + (foodType === 'Vegetarian' ? 'veg' : 'nonveg');
                badge.innerHTML = '<span class="diet-dot"></span>';
            }

            const planMealIdInput = document.getElementById('modalPlanMealId');
            if (planMealIdInput) planMealIdInput.value = mealId;

            const btn3D = document.getElementById('modalBtnOpen3D');
            if (btn3D) {
                btn3D.onclick = function () {
                    modal.hide();
                    openFood3DStudio({
                        id: mealId,
                        name: name,
                        price: price,
                        category: category,
                        food_type: foodType,
                        description: desc,
                        image_url: img
                    });
                };
            }

            modal.show();
        });
    });
}

// ==========================================================================
// 7. Quick Add to Plan Modal
// ==========================================================================
function initQuickPlanModal() {
    const quickPlanBtns = document.querySelectorAll('.btn-quick-plan');
    const modalElement = document.getElementById('quickPlanModal');
    if (!modalElement) return;

    const modal = new bootstrap.Modal(modalElement);

    quickPlanBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const mealId = this.getAttribute('data-id');
            const mealName = this.getAttribute('data-name');
            const mealCategory = this.getAttribute('data-category');
            const mealPrice = this.getAttribute('data-price');

            document.getElementById('quickPlanMealName').textContent = mealName;
            document.getElementById('quickPlanMealMeta').textContent = `${mealCategory} • ₹${mealPrice}`;
            document.getElementById('quickPlanMealId').value = mealId;

            const catSelect = document.getElementById('quickPlanCategorySelect');
            if (catSelect) catSelect.value = mealCategory;

            modal.show();
        });
    });
}

// ==========================================================================
// 8. Dish Orbit Carousel Component
// ==========================================================================
let currentOrbitIndex = 0;

function initDishOrbitCarousel() {
    const container = document.getElementById('orbitSatellitesContainer');
    const heroPlate = document.getElementById('orbitHeroPlate');
    if (!container || !heroPlate) return;

    const dishes = window.DISHES_DATA || [];
    if (dishes.length === 0) return;

    renderOrbitSatellites();
    updateOrbitHero(0);

    const btnNext = document.getElementById('orbitBtnNext');
    const btnPrev = document.getElementById('orbitBtnPrev');

    if (btnNext) {
        btnNext.addEventListener('click', () => rotateOrbit(1));
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', () => rotateOrbit(-1));
    }

    heroPlate.addEventListener('click', function () {
        const dish = dishes[currentOrbitIndex];
        if (dish) openFood3DStudio(dish);
    });

    const heroBtn3D = document.getElementById('orbitHeroBtn3D');
    if (heroBtn3D) {
        heroBtn3D.addEventListener('click', function () {
            const dish = dishes[currentOrbitIndex];
            if (dish) openFood3DStudio(dish);
        });
    }

    let touchStartX = 0;
    container.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', e => {
        const touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 40) rotateOrbit(1);
        if (touchEndX > touchStartX + 40) rotateOrbit(-1);
    }, { passive: true });
}

function rotateOrbit(direction) {
    const dishes = window.DISHES_DATA || [];
    if (dishes.length === 0) return;

    currentOrbitIndex = (currentOrbitIndex + direction + dishes.length) % dishes.length;
    renderOrbitSatellites();
    updateOrbitHero(currentOrbitIndex);
}

function renderOrbitSatellites() {
    const container = document.getElementById('orbitSatellitesContainer');
    if (!container) return;

    const dishes = window.DISHES_DATA || [];
    container.innerHTML = '';

    const total = dishes.length;
    const visibleCount = Math.min(total, 6);
    const rx = 360;
    const ry = 140;

    for (let i = 0; i < visibleCount; i++) {
        const dishIndex = (currentOrbitIndex + i) % total;
        const dish = dishes[dishIndex];

        const angle = ((i / visibleCount) * 2 * Math.PI) - (Math.PI / 2);
        const x = rx * Math.cos(angle);
        const y = ry * Math.sin(angle);

        const depth = (y + ry) / (2 * ry);
        const scale = 0.65 + (depth * 0.35);
        const zIndex = Math.round(depth * 30);
        const opacity = 0.45 + (depth * 0.55);

        const item = document.createElement('div');
        item.className = 'orbit-satellite-item';
        item.style.left = `calc(50% + ${x}px - 55px)`;
        item.style.top = `calc(50% + ${y}px - 55px)`;
        item.style.transform = `scale(${scale})`;
        item.style.zIndex = zIndex;
        item.style.opacity = opacity;

        item.innerHTML = `
            <img src="${dish.image_url}" alt="${dish.name}" title="${dish.name} - ₹${Math.round(dish.price)}"
                 onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80'">
        `;

        item.addEventListener('click', (function (targetIdx) {
            return function () {
                currentOrbitIndex = targetIdx;
                renderOrbitSatellites();
                updateOrbitHero(targetIdx);
            };
        })(dishIndex));

        container.appendChild(item);
    }
}

function updateOrbitHero(idx) {
    const dishes = window.DISHES_DATA || [];
    if (!dishes[idx]) return;

    const dish = dishes[idx];

    const img = document.getElementById('orbitHeroImg');
    const nameEl = document.getElementById('orbitDishName');
    const priceEl = document.getElementById('orbitDishPrice');
    const catEl = document.getElementById('orbitDishCategory');
    const descEl = document.getElementById('orbitDishDesc');
    const dietBadge = document.getElementById('orbitDishDiet');
    const planBtn = document.getElementById('orbitHeroPlanBtn');

    if (img) {
        img.src = dish.image_url;
        img.alt = dish.name;
    }
    if (nameEl) nameEl.textContent = dish.name;
    if (priceEl) priceEl.textContent = '₹' + Math.round(dish.price);
    if (catEl) catEl.textContent = dish.category;
    if (descEl) descEl.textContent = dish.description;

    if (dietBadge) {
        dietBadge.className = 'diet-stamp ' + (dish.food_type === 'Vegetarian' ? 'veg' : 'nonveg');
        dietBadge.innerHTML = '<span class="diet-dot"></span>';
    }

    if (planBtn) {
        planBtn.setAttribute('data-id', dish.id);
        planBtn.setAttribute('data-name', dish.name);
        planBtn.setAttribute('data-category', dish.category);
        planBtn.setAttribute('data-price', Math.round(dish.price));
    }

    const cartBtn = document.getElementById('orbitHeroCartBtn');
    if (cartBtn) {
        cartBtn.onclick = function() {
            if (window.DailyBiteCart) {
                window.DailyBiteCart.addItem({
                    id: dish.id,
                    name: dish.name,
                    price: dish.price,
                    category: dish.category,
                    food_type: dish.food_type,
                    image_url: dish.image_url
                });
            }
        };
    }

    const instantBtn = document.getElementById('orbitHeroInstantBtn');
    if (instantBtn) {
        instantBtn.onclick = function() {
            if (window.DailyBiteCart) {
                window.DailyBiteCart.addItem({
                    id: dish.id,
                    name: dish.name,
                    price: dish.price,
                    category: dish.category,
                    food_type: dish.food_type,
                    image_url: dish.image_url
                }, { openCart: true, mode: 'instant' });
            }
        };
    }
}

// ==========================================================================
// 9. Photorealistic 3D WebGL Food Studio Engine
// ==========================================================================
let threeScene, threeCamera, threeRenderer, threeControls;
let mainPlatterGroup, baseFoodMesh, toppingsGroup, garnishGroup, steamParticles;
let dirKeyLight, ambLight, fillLight, rimLight;
let is3DStudioOpen = false;
let activeDishData = null;
let currentProfile = null;
let activePortionScale = 1.0;
let explodeAmount = 0.0;
let steamIntensity = 1.0;

function initFood3DStudio() {
    // Bind all ".btn-open-3d" buttons on ANY food card
    document.querySelectorAll('.btn-open-3d').forEach(btn => {
        btn.addEventListener('click', function () {
            const dish = {
                id: this.getAttribute('data-id'),
                name: this.getAttribute('data-name'),
                price: parseFloat(this.getAttribute('data-price')),
                category: this.getAttribute('data-category'),
                food_type: this.getAttribute('data-foodtype'),
                description: this.getAttribute('data-desc'),
                image_url: this.getAttribute('data-img')
            };
            openFood3DStudio(dish);
        });
    });

    const modalEl = document.getElementById('food3DStudioModal');
    if (!modalEl) return;

    modalEl.addEventListener('shown.bs.modal', function () {
        if (!threeRenderer) {
            setupThreeJS();
        } else {
            onWindowResize3D();
        }
        is3DStudioOpen = true;
    });

    modalEl.addEventListener('hidden.bs.modal', function () {
        is3DStudioOpen = false;
    });

    // Auto-spin toggle
    const btnAutoRotate = document.getElementById('studioBtnAutoRotate');
    if (btnAutoRotate) {
        btnAutoRotate.addEventListener('click', function () {
            if (threeControls) {
                threeControls.autoRotate = !threeControls.autoRotate;
                this.classList.toggle('active', threeControls.autoRotate);
                this.innerHTML = threeControls.autoRotate
                    ? '<i class="bi bi-pause-fill"></i> Pause 360°'
                    : '<i class="bi bi-arrow-repeat"></i> Auto-Spin 360°';
            }
        });
    }

    // Reset camera angle
    const btnReset = document.getElementById('studioBtnResetAngle');
    if (btnReset) {
        btnReset.addEventListener('click', function () {
            if (threeCamera && threeControls) {
                threeCamera.position.set(0, 3.6, 5.0);
                threeControls.target.set(0, 0.45, 0);
                threeControls.update();
            }
        });
    }

    // Zoom In
    const btnZoomIn = document.getElementById('studioBtnZoomIn');
    if (btnZoomIn) {
        btnZoomIn.addEventListener('click', function () {
            if (threeCamera) threeCamera.position.multiplyScalar(0.85);
        });
    }

    // Zoom Out
    const btnZoomOut = document.getElementById('studioBtnZoomOut');
    if (btnZoomOut) {
        btnZoomOut.addEventListener('click', function () {
            if (threeCamera) threeCamera.position.multiplyScalar(1.15);
        });
    }

    // Layer Deconstruct / Explode Slider
    const explodeSlider = document.getElementById('studioExplodeSlider');
    const explodeDisplay = document.getElementById('studioExplodeDisplay');
    if (explodeSlider) {
        explodeSlider.addEventListener('input', function () {
            explodeAmount = parseFloat(this.value) / 100;
            if (explodeDisplay) explodeDisplay.textContent = Math.round(explodeAmount * 100) + '%';
            applyLayerExplosion();
        });
    }

    // Lighting Mode Toggles
    document.querySelectorAll('.lighting-mode-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.lighting-mode-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            setStudioLighting(this.getAttribute('data-mode'));
        });
    });

    // Heat & Steam Intensity Toggles
    document.querySelectorAll('.heat-mode-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.heat-mode-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const level = this.getAttribute('data-heat');
            steamIntensity = level === 'hot' ? 1.0 : (level === 'warm' ? 0.4 : 0.0);
            if (steamParticles) steamParticles.visible = steamIntensity > 0;
        });
    });

    // Portion Size Morpher
    document.querySelectorAll('.portion-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.portion-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const scale = parseFloat(this.getAttribute('data-scale'));
            setPortionScale(scale);
        });
    });

    // Toggle Hotspots Visibility
    const btnHotspots = document.getElementById('studioBtnToggleHotspots');
    if (btnHotspots) {
        btnHotspots.addEventListener('click', function () {
            const container = document.getElementById('studioHotspotsContainer');
            if (container) {
                const isHidden = container.classList.toggle('d-none');
                this.classList.toggle('active', !isHidden);
            }
        });
    }
}

// Function called for ANY food item across the application
function openFood3DStudio(dish) {
    activeDishData = dish;
    currentProfile = getDishProfile(dish.name);

    const modalEl = document.getElementById('food3DStudioModal');
    if (!modalEl) return;

    // Update Header and Metadata
    document.getElementById('studioDishTitle').textContent = dish.name;
    document.getElementById('studioDishPrice').textContent = '₹' + Math.round(dish.price);
    document.getElementById('studioDishCategory').textContent = dish.category;
    document.getElementById('studioDishDesc').textContent = dish.description || '';

    const dietBadge = document.getElementById('studioDietBadge');
    if (dietBadge) {
        dietBadge.className = 'diet-stamp ' + (dish.food_type === 'Vegetarian' ? 'veg' : 'nonveg');
        dietBadge.innerHTML = '<span class="diet-dot"></span>';
    }

    // Update Macros
    const calEl = document.getElementById('studioMacroCalories');
    const protEl = document.getElementById('studioMacroProtein');
    const carbsEl = document.getElementById('studioMacroCarbs');
    const fatEl = document.getElementById('studioMacroFat');

    if (calEl) calEl.textContent = `~${currentProfile.macros.calories} kcal`;
    if (protEl) protEl.textContent = `${currentProfile.macros.protein} Protein`;
    if (carbsEl) carbsEl.textContent = `${currentProfile.macros.carbs} Carbs`;
    if (fatEl) fatEl.textContent = `${currentProfile.macros.fat} Healthy Fats`;

    // Layer names in explode panel
    const baseLbl = document.getElementById('layerNameBase');
    const midLbl = document.getElementById('layerNameMid');
    const topLbl = document.getElementById('layerNameTop');
    if (baseLbl) baseLbl.textContent = currentProfile.layers.base;
    if (midLbl) midLbl.textContent = currentProfile.layers.mid;
    if (topLbl) topLbl.textContent = currentProfile.layers.top;

    // Reset explode slider
    const explodeSlider = document.getElementById('studioExplodeSlider');
    const explodeDisplay = document.getElementById('studioExplodeDisplay');
    if (explodeSlider) explodeSlider.value = 0;
    if (explodeDisplay) explodeDisplay.textContent = '0%';
    explodeAmount = 0.0;

    // Reset portion button
    document.querySelectorAll('.portion-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
    activePortionScale = 1.0;

    // Connect Plan & Cart Buttons in 3D Studio
    const planBtn = document.getElementById('studioAddPlanBtn');
    if (planBtn) {
        planBtn.setAttribute('data-id', dish.id);
        planBtn.setAttribute('data-name', dish.name);
        planBtn.setAttribute('data-category', dish.category);
        planBtn.setAttribute('data-price', Math.round(dish.price));
    }

    const cartBtn = document.getElementById('studioAddToCartBtn');
    if (cartBtn) {
        cartBtn.onclick = function() {
            if (window.DailyBiteCart) {
                window.DailyBiteCart.addItem({
                    id: dish.id,
                    name: dish.name,
                    price: dish.price,
                    category: dish.category,
                    food_type: dish.food_type,
                    image_url: dish.image_url
                });
            }
        };
    }

    const instantBtn = document.getElementById('studioOrderInstantBtn');
    if (instantBtn) {
        instantBtn.onclick = function() {
            if (window.DailyBiteCart) {
                window.DailyBiteCart.addItem({
                    id: dish.id,
                    name: dish.name,
                    price: dish.price,
                    category: dish.category,
                    food_type: dish.food_type,
                    image_url: dish.image_url
                }, { openCart: true, mode: 'instant' });
            }
        };
    }

    // Build or update 3D Meshes
    if (threeScene) {
        buildRealistic3DDishes();
    }

    // Render interactive HTML Hotspot Pins
    render3DHotspotPins();

    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modal.show();
}

function setupThreeJS() {
    const canvasContainer = document.getElementById('studioCanvasStage');
    if (!canvasContainer || typeof THREE === 'undefined') return;

    const width = canvasContainer.clientWidth;
    const height = canvasContainer.clientHeight;

    // 1. Scene with soft fog for depth
    threeScene = new THREE.Scene();
    threeScene.fog = new THREE.FogExp2(0x0a0f1d, 0.06);

    // 2. Camera
    threeCamera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    threeCamera.position.set(0, 3.6, 5.0);

    // 3. Renderer with soft shadows
    threeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    threeRenderer.setSize(width, height);
    threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    threeRenderer.shadowMap.enabled = true;
    threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    threeRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    threeRenderer.toneMappingExposure = 1.15;

    canvasContainer.appendChild(threeRenderer.domElement);
    threeRenderer.domElement.id = 'threeJsCanvas';

    // 4. OrbitControls
    if (typeof THREE.OrbitControls !== 'undefined') {
        threeControls = new THREE.OrbitControls(threeCamera, threeRenderer.domElement);
        threeControls.enableDamping = true;
        threeControls.dampingFactor = 0.05;
        threeControls.autoRotate = true;
        threeControls.autoRotateSpeed = 1.8;
        threeControls.minDistance = 2.8;
        threeControls.maxDistance = 7.5;
        threeControls.maxPolarAngle = Math.PI / 2 + 0.04;
        threeControls.target.set(0, 0.45, 0);
    }

    // 5. Studio Lighting Setup
    ambLight = new THREE.AmbientLight(0xffffff, 0.65);
    threeScene.add(ambLight);

    dirKeyLight = new THREE.DirectionalLight(0xfff3e0, 1.4);
    dirKeyLight.position.set(4.5, 7.5, 4.0);
    dirKeyLight.castShadow = true;
    dirKeyLight.shadow.mapSize.width = 1024;
    dirKeyLight.shadow.mapSize.height = 1024;
    dirKeyLight.shadow.bias = -0.001;
    threeScene.add(dirKeyLight);

    fillLight = new THREE.DirectionalLight(0x93c5fd, 0.45);
    fillLight.position.set(-5, 4, -4);
    threeScene.add(fillLight);

    rimLight = new THREE.PointLight(0x10b981, 0.9, 12);
    rimLight.position.set(0, 1.2, -3.5);
    threeScene.add(rimLight);

    // 6. Turntable Pedestal Base & Contact Shadow
    createTurntableBase();

    // 7. Build Food Mesh & Plate
    buildRealistic3DDishes();

    // 8. Volumetric Steam Particles
    createVolumetricSteam();

    // 9. Resize Listener
    window.addEventListener('resize', onWindowResize3D);

    // 10. Animation Loop
    animate3D();
}

// Create Dark Walnut Wooden Turntable Pedestal with Ambient Occlusion
function createTurntableBase() {
    const baseGroup = new THREE.Group();

    // Wooden turntable ring
    const pedestalGeo = new THREE.CylinderGeometry(2.85, 2.95, 0.12, 64);
    const pedestalMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.65,
        metalness: 0.25
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.06;
    pedestal.receiveShadow = true;
    baseGroup.add(pedestal);

    // Gold brass bevel ring
    const goldRingGeo = new THREE.TorusGeometry(2.9, 0.02, 16, 64);
    const goldRingMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.2,
        metalness: 0.8
    });
    const goldRing = new THREE.Mesh(goldRingGeo, goldRingMat);
    goldRing.rotation.x = Math.PI / 2;
    goldRing.position.y = 0.0;
    baseGroup.add(goldRing);

    // Soft Ambient Occlusion shadow plane under plate
    const shadowGeo = new THREE.PlaneGeometry(5.2, 5.2);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const ctx = shadowCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 15, 64, 64, 64);
    grad.addColorStop(0, 'rgba(0,0,0,0.55)');
    grad.addColorStop(0.6, 'rgba(0,0,0,0.2)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.01;
    baseGroup.add(shadowPlane);

    threeScene.add(baseGroup);
}

// Build Photorealistic Platter, Contoured Food Mound, 3D Toppings & Garnishes
function buildRealistic3DDishes() {
    if (mainPlatterGroup) {
        threeScene.remove(mainPlatterGroup);
    }

    mainPlatterGroup = new THREE.Group();

    // 1. Realistic Porcelain Coupe Bowl / Plate (Curved Lathe Profile)
    const points = [];
    points.push(new THREE.Vector2(0, 0.02));
    points.push(new THREE.Vector2(1.1, 0.03));
    points.push(new THREE.Vector2(1.35, 0.06));
    points.push(new THREE.Vector2(1.65, 0.14));
    points.push(new THREE.Vector2(2.1, 0.36));
    points.push(new THREE.Vector2(2.45, 0.52));
    points.push(new THREE.Vector2(2.55, 0.54));
    points.push(new THREE.Vector2(2.5, 0.48));
    points.push(new THREE.Vector2(2.0, 0.28));
    points.push(new THREE.Vector2(1.35, 0.02));
    points.push(new THREE.Vector2(0, 0.0));

    const plateGeo = new THREE.LatheGeometry(points, 64);
    plateGeo.computeVertexNormals();

    const plateMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.12,
        metalness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        reflectivity: 0.85
    });

    const plateMesh = new THREE.Mesh(plateGeo, plateMat);
    plateMesh.castShadow = true;
    plateMesh.receiveShadow = true;
    mainPlatterGroup.add(plateMesh);

    // Decorative Gold Rim Line
    const goldRimGeo = new THREE.TorusGeometry(2.5, 0.02, 16, 64);
    const goldRimMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.25, metalness: 0.85 });
    const goldRim = new THREE.Mesh(goldRimGeo, goldRimMat);
    goldRim.rotation.x = Math.PI / 2;
    goldRim.position.y = 0.52;
    mainPlatterGroup.add(goldRim);

    // 2. Base Food Layer (Contoured Natural Organic Mound)
    const foodGeo = new THREE.CylinderGeometry(1.85, 2.05, 0.48, 64, 16);
    // Displace vertices with organic culinary texture
    const pos = foodGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        if (y > 0.1) {
            const x = pos.getX(i);
            const z = pos.getZ(i);
            const bump = Math.sin(x * 3.5) * Math.cos(z * 3.5) * 0.07 + Math.sin(x * 7.5) * 0.03;
            pos.setY(i, y + bump);
        }
    }
    foodGeo.computeVertexNormals();

    const foodMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.38,
        metalness: 0.08
    });

    baseFoodMesh = new THREE.Mesh(foodGeo, foodMat);
    baseFoodMesh.position.y = 0.32;
    baseFoodMesh.castShadow = true;
    baseFoodMesh.receiveShadow = true;
    mainPlatterGroup.add(baseFoodMesh);

    // Load actual texture onto the contoured mound
    if (activeDishData && activeDishData.image_url) {
        new THREE.TextureLoader().load(activeDishData.image_url, function (texture) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            baseFoodMesh.material.map = texture;
            baseFoodMesh.material.bumpMap = texture;
            baseFoodMesh.material.bumpScale = 0.06;
            baseFoodMesh.material.needsUpdate = true;
        });
    }

    // 3. Toppings Layer (3D Procedural Chunks)
    toppingsGroup = new THREE.Group();
    toppingsGroup.position.y = 0.56;

    const profile = currentProfile || getDishProfile(activeDishData ? activeDishData.name : "");
    const chunkColor = profile.toppingsColor || 0xf59e0b;

    // Generate 5-7 distinct 3D chunks (paneer cubes / chicken bits / eggs)
    const chunkGeo = new THREE.BoxGeometry(0.32, 0.28, 0.32);
    const chunkMat = new THREE.MeshStandardMaterial({
        color: chunkColor,
        roughness: 0.3,
        metalness: 0.15
    });

    const chunkPositions = [
        [-0.45, 0.08, 0.35],
        [0.45, 0.06, -0.2],
        [-0.15, 0.12, -0.4],
        [0.35, 0.09, 0.4],
        [-0.5, 0.05, -0.2],
        [0.1, 0.14, 0.15]
    ];

    chunkPositions.forEach(coords => {
        const chunk = new THREE.Mesh(chunkGeo, chunkMat);
        chunk.position.set(coords[0], coords[1], coords[2]);
        chunk.rotation.set(Math.random() * 0.4, Math.random() * 3.14, Math.random() * 0.3);
        chunk.castShadow = true;
        toppingsGroup.add(chunk);
    });

    mainPlatterGroup.add(toppingsGroup);

    // 4. Fresh Garnish Layer (Floating Herb Leaves & Fried Onions)
    garnishGroup = new THREE.Group();
    garnishGroup.position.y = 0.72;

    const leafGeo = new THREE.SphereGeometry(0.08, 8, 4);
    leafGeo.scale(1.8, 0.2, 1.0);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.4 });

    for (let i = 0; i < 9; i++) {
        const leaf = new THREE.Mesh(leafGeo, leafMat);
        const rad = 0.2 + Math.random() * 0.7;
        const ang = Math.random() * Math.PI * 2;
        leaf.position.set(Math.cos(ang) * rad, Math.random() * 0.08, Math.sin(ang) * rad);
        leaf.rotation.set(Math.random(), Math.random() * Math.PI, Math.random());
        garnishGroup.add(leaf);
    }

    mainPlatterGroup.add(garnishGroup);
    threeScene.add(mainPlatterGroup);
}

// Deconstruct / Explode Layers Animation
function applyLayerExplosion() {
    if (!baseFoodMesh || !toppingsGroup || !garnishGroup) return;

    // Base food floats up gently
    baseFoodMesh.position.y = 0.32 + (explodeAmount * 0.75);

    // Toppings separate upward into mid-air
    toppingsGroup.position.y = 0.56 + (explodeAmount * 1.6);

    // Garnish and aromas float up to top tier
    garnishGroup.position.y = 0.72 + (explodeAmount * 2.4);

    // Slight layer rotation for dynamic presentation
    toppingsGroup.rotation.y = explodeAmount * 0.4;
    garnishGroup.rotation.y = -explodeAmount * 0.6;
}

// Lighting Mode Controller
function setStudioLighting(mode) {
    if (!dirKeyLight || !ambLight || !fillLight || !rimLight) return;

    if (mode === 'daylight') {
        dirKeyLight.color.setHex(0xffffff);
        dirKeyLight.intensity = 1.6;
        dirKeyLight.position.set(5, 8, 4);
        ambLight.intensity = 0.8;
        fillLight.color.setHex(0xbae6fd);
        rimLight.color.setHex(0x10b981);
    } else if (mode === 'bistro') {
        dirKeyLight.color.setHex(0xfbbf24);
        dirKeyLight.intensity = 1.35;
        dirKeyLight.position.set(3, 6, 5);
        ambLight.intensity = 0.55;
        fillLight.color.setHex(0xf97316);
        rimLight.color.setHex(0xf59e0b);
    } else if (mode === 'cyber') {
        dirKeyLight.color.setHex(0x38bdf8);
        dirKeyLight.intensity = 1.2;
        dirKeyLight.position.set(-4, 7, 4);
        ambLight.intensity = 0.4;
        fillLight.color.setHex(0xa855f7);
        rimLight.color.setHex(0x06b6d4);
    }
}

// Portion Size Morpher (1x, 1.25x, 1.5x)
function setPortionScale(scale) {
    activePortionScale = scale;
    if (baseFoodMesh && toppingsGroup && garnishGroup) {
        baseFoodMesh.scale.set(scale, scale * 0.9, scale);
        toppingsGroup.scale.set(scale, scale, scale);
        garnishGroup.scale.set(scale, scale, scale);
    }

    if (activeDishData) {
        const cal = Math.round(currentProfile.macros.calories * scale);
        const price = Math.round(activeDishData.price * scale);
        document.getElementById('studioDishPrice').textContent = '₹' + price;
        document.getElementById('studioMacroCalories').textContent = `~${cal} kcal`;
    }
}

// Volumetric Rising Steam Simulation
function createVolumetricSteam() {
    const count = 55;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 1.6;
        pos[i * 3 + 1] = 0.7 + Math.random() * 2.4;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 1.6;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.22,
        transparent: true,
        opacity: 0.32,
        blending: THREE.AdditiveBlending
    });

    steamParticles = new THREE.Points(geo, mat);
    threeScene.add(steamParticles);
}

// ==========================================================================
// 10. Synchronized 3D Ingredient Hotspots (Projected onto 2D)
// ==========================================================================
function render3DHotspotPins() {
    const container = document.getElementById('studioHotspotsContainer');
    if (!container) return;

    container.innerHTML = '';
    const profile = currentProfile || getDishProfile(activeDishData ? activeDishData.name : "");

    profile.hotspots.forEach((h, idx) => {
        const pin = document.createElement('div');
        pin.className = 'studio-3d-pin';
        pin.id = `pin_${h.id}`;
        pin.innerHTML = `
            <i class="bi bi-geo-alt-fill"></i>
            <span class="studio-3d-pin-label">${h.name}</span>
        `;

        // Click pin to focus camera and show ingredient card
        pin.addEventListener('click', function (e) {
            e.stopPropagation();
            showIngredientCard(h);
            if (threeCamera && threeControls) {
                // Smoothly orient toward this ingredient
                threeControls.autoRotate = false;
                const autoBtn = document.getElementById('studioBtnAutoRotate');
                if (autoBtn) {
                    autoBtn.classList.remove('active');
                    autoBtn.innerHTML = '<i class="bi bi-arrow-repeat"></i> Auto-Spin 360°';
                }
            }
        });

        container.appendChild(pin);
    });
}

function showIngredientCard(hotspot) {
    let card = document.getElementById('studioIngredientCard');
    if (!card) {
        card = document.createElement('div');
        card.id = 'studioIngredientCard';
        card.className = 'studio-ingredient-card';
        document.getElementById('studioCanvasStage').appendChild(card);
    }

    card.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="ing-title"><i class="bi bi-stars"></i> ${hotspot.name}</span>
            <button type="button" class="btn-close btn-close-white small" style="font-size: 0.65rem;" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
        <p class="ing-desc">${hotspot.desc}</p>
        <div class="d-flex justify-content-between align-items-center">
            <span class="badge bg-warning-subtle text-warning small fw-bold">100% Authentic Quality</span>
            <span class="text-white-50 small">Chef's Choice</span>
        </div>
    `;
}

function updateHotspotsScreenPosition() {
    if (!threeCamera || !currentProfile) return;

    const container = document.getElementById('studioCanvasStage');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    currentProfile.hotspots.forEach(h => {
        const pin = document.getElementById(`pin_${h.id}`);
        if (!pin) return;

        // Hotspot position in 3D world space
        const v = new THREE.Vector3(h.x * activePortionScale, (h.y + (explodeAmount * 1.5)) * activePortionScale, h.z * activePortionScale);
        if (mainPlatterGroup) {
            v.applyEuler(mainPlatterGroup.rotation);
        }

        v.project(threeCamera);

        // Check if behind camera
        if (v.z > 1.0) {
            pin.style.display = 'none';
            return;
        }

        pin.style.display = 'flex';
        const screenX = (v.x * 0.5 + 0.5) * width;
        const screenY = (-(v.y * 0.5) + 0.5) * height;

        pin.style.left = `${screenX}px`;
        pin.style.top = `${screenY}px`;
    });
}

function onWindowResize3D() {
    const canvasContainer = document.getElementById('studioCanvasStage');
    if (!canvasContainer || !threeCamera || !threeRenderer) return;

    const width = canvasContainer.clientWidth;
    const height = canvasContainer.clientHeight;

    threeCamera.aspect = width / height;
    threeCamera.updateProjectionMatrix();
    threeRenderer.setSize(width, height);
}

// 60 FPS Render & Animation Loop
function animate3D() {
    requestAnimationFrame(animate3D);

    if (!is3DStudioOpen) return;

    if (threeControls) {
        threeControls.update();

        // Update HUD Telemetry
        const hud = document.getElementById('studioTelemetryHud');
        if (hud && threeCamera) {
            const yaw = Math.round((threeControls.getAzimuthalAngle() * 180) / Math.PI);
            const pitch = Math.round((threeControls.getPolarAngle() * 180) / Math.PI);
            const dist = (threeCamera.position.length() / 5.0).toFixed(1);
            hud.textContent = `360° Studio | Yaw: ${yaw}° | Pitch: ${pitch}° | Zoom: ${dist}x`;
        }
    }

    // Animate Steam
    if (steamParticles && steamParticles.visible) {
        const pos = steamParticles.geometry.attributes.position.array;
        for (let i = 1; i < pos.length; i += 3) {
            pos[i] += 0.012 * steamIntensity;
            if (pos[i] > 3.2) {
                pos[i] = 0.7;
            }
        }
        steamParticles.geometry.attributes.position.needsUpdate = true;
        steamParticles.rotation.y += 0.004;
    }

    // Synchronize 3D Hotspot positions
    updateHotspotsScreenPosition();

    if (threeRenderer && threeScene && threeCamera) {
        threeRenderer.render(threeScene, threeCamera);
    }
}

// ==========================================================================
// 11. Toast Notifications
// ==========================================================================
function showDailyBiteToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        container.style.zIndex = '1090';
        document.body.appendChild(container);
    }

    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0 shadow-lg`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body fw-bold">
                <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    container.appendChild(toastEl);
    const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
    toast.show();
    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}
