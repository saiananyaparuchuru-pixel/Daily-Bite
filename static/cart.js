/**
 * DailyBite - Unified Food Delivery Cart & Subscription Engine
 * Supports:
 *  1. Instant Delivery (Now - 25-35 mins)
 *  2. Tomorrow Delivery (with Breakfast / Lunch / Dinner time slot selection)
 *  3. Flexible Multi-Day Plans (2 Days, 3 Days, 5 Days, 7 Days, or custom duration)
 * Full cart management, checkout modal, live order confirmation & tracking.
 */

const DailyBiteCart = (function () {
    // LocalStorage Keys
    const STORAGE_KEY_ITEMS = "dailybite_cart_items";
    const STORAGE_KEY_ORDER_TYPE = "dailybite_order_type";
    const STORAGE_KEY_PLAN_DURATION = "dailybite_plan_duration";
    const STORAGE_KEY_TOMORROW_SLOT = "dailybite_tomorrow_slot";
    const STORAGE_KEY_USER_NAME = "dailybite_user_name";
    const STORAGE_KEY_USER_PHONE = "dailybite_user_phone";
    const STORAGE_KEY_USER_ADDRESS = "dailybite_user_address";

    // Internal State
    let cart = [];
    let orderType = "instant"; // 'instant' | 'tomorrow' | 'multi_day'
    let planDuration = 3;      // 2, 3, 5, 7 days
    let tomorrowSlot = "Lunch 1:00 PM";
    let selectedPayment = "UPI";

    // Initialize from LocalStorage
    function init() {
        try {
            const savedItems = localStorage.getItem(STORAGE_KEY_ITEMS);
            if (savedItems) {
                cart = JSON.parse(savedItems);
                if (!Array.isArray(cart)) cart = [];
            }
        } catch (e) {
            cart = [];
        }

        orderType = localStorage.getItem(STORAGE_KEY_ORDER_TYPE) || "instant";
        planDuration = parseInt(localStorage.getItem(STORAGE_KEY_PLAN_DURATION) || "3", 10);
        tomorrowSlot = localStorage.getItem(STORAGE_KEY_TOMORROW_SLOT) || "Lunch 1:00 PM";

        updateBadges();
        renderDrawer();
        syncModeUI();
    }

    function save() {
        try {
            localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(cart));
            localStorage.setItem(STORAGE_KEY_ORDER_TYPE, orderType);
            localStorage.setItem(STORAGE_KEY_PLAN_DURATION, planDuration.toString());
            localStorage.setItem(STORAGE_KEY_TOMORROW_SLOT, tomorrowSlot);
        } catch (e) {
            console.error("Error saving cart to localStorage", e);
        }
    }

    // Add item to cart
    function addItem(meal, options = {}) {
        if (!meal || !meal.name) return;

        const id = meal.id || String(Date.now());
        const price = parseFloat(meal.price) || 0;
        const name = meal.name;
        const category = meal.category || "Meal";
        const foodType = meal.food_type || "Vegetarian";
        const imageUrl = meal.image_url || "/static/images/placeholder.jpg";

        const existingIndex = cart.findIndex(item => item.id == id || item.name.toLowerCase() === name.toLowerCase());

        if (existingIndex > -1) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push({
                id: id,
                name: name,
                price: price,
                category: category,
                food_type: foodType,
                image_url: imageUrl,
                quantity: 1
            });
        }

        if (options.mode) {
            orderType = options.mode;
        }

        save();
        updateBadges();
        renderDrawer();
        syncModeUI();

        // Toast feedback
        if (typeof showDailyBiteToast === "function") {
            showDailyBiteToast(`Added "${name}" to your cart! 🛒`, "success");
        }

        if (options.openCart) {
            openCart();
        }
    }

    // Update quantity
    function updateQuantity(id, delta) {
        const itemIndex = cart.findIndex(i => i.id == id);
        if (itemIndex > -1) {
            cart[itemIndex].quantity += delta;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
            save();
            updateBadges();
            renderDrawer();
        }
    }

    // Remove item
    function removeItem(id) {
        cart = cart.filter(i => i.id != id);
        save();
        updateBadges();
        renderDrawer();
        if (typeof showDailyBiteToast === "function") {
            showDailyBiteToast("Item removed from cart.", "danger");
        }
    }

    // Clear entire cart
    function clearCart() {
        if (cart.length === 0) return;
        cart = [];
        save();
        updateBadges();
        renderDrawer();
        if (typeof showDailyBiteToast === "function") {
            showDailyBiteToast("Your cart has been cleared.", "success");
        }
    }

    // Change Order Mode
    function setOrderType(mode) {
        orderType = mode;
        save();
        syncModeUI();
        renderDrawer();
    }

    // Set Tomorrow Slot
    function setTomorrowSlot(slot) {
        tomorrowSlot = slot;
        save();
        syncModeUI();
    }

    // Set Plan Duration
    function setPlanDuration(days) {
        planDuration = parseInt(days, 10) || 3;
        save();
        syncModeUI();
        renderDrawer();
    }

    // Bulk Add Scheduled Meals from Planner
    function bulkAddScheduledMeals(mealsList, duration = 3) {
        if (!mealsList || mealsList.length === 0) {
            if (typeof showDailyBiteToast === "function") {
                showDailyBiteToast("No meals scheduled for this duration yet.", "danger");
            }
            return;
        }

        orderType = "multi_day";
        planDuration = duration;

        mealsList.forEach(m => {
            if (m.name && m.price) {
                const existing = cart.find(c => c.name.toLowerCase() === m.name.toLowerCase());
                if (existing) {
                    existing.quantity += 1;
                } else {
                    cart.push({
                        id: m.id || String(Date.now() + Math.random()),
                        name: m.name,
                        price: parseFloat(m.price) || 0,
                        category: m.category || "Meal",
                        food_type: m.food_type || "Vegetarian",
                        image_url: m.image_url || "/static/images/placeholder.jpg",
                        quantity: 1
                    });
                }
            }
        });

        save();
        updateBadges();
        renderDrawer();
        syncModeUI();

        if (typeof showDailyBiteToast === "function") {
            showDailyBiteToast(`Added ${mealsList.length} meals for your ${duration}-day plan! 🍱`, "success");
        }
        openCart();
    }

    // Calculations
    function getTotals() {
        const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        // Delivery is FREE for multi-day plans OR subtotal >= 200; else Rs 25
        const isFreeDelivery = (orderType === "multi_day" || subtotal >= 200 || cart.length === 0);
        const deliveryFee = isFreeDelivery ? 0 : 25;
        const taxes = Math.round(subtotal * 0.05 * 100) / 100;
        const grandTotal = Math.round((subtotal + deliveryFee + taxes) * 100) / 100;
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

        return {
            subtotal,
            deliveryFee,
            taxes,
            grandTotal,
            totalItems,
            isFreeDelivery
        };
    }

    // Sync active mode buttons & sub-pickers
    function syncModeUI() {
        // Mode buttons
        document.querySelectorAll(".order-mode-btn").forEach(btn => {
            const mode = btn.getAttribute("data-mode");
            if (mode === orderType) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });

        // Mode badge in header
        const badge = document.getElementById("cartModeBadge");
        if (badge) {
            if (orderType === "instant") {
                badge.className = "badge bg-danger-subtle text-danger fw-bold";
                badge.innerHTML = "⚡ Instant (25-35 mins)";
            } else if (orderType === "tomorrow") {
                badge.className = "badge bg-warning-subtle text-warning-emphasis fw-bold";
                badge.innerHTML = `🌅 Tomorrow (${tomorrowSlot})`;
            } else {
                badge.className = "badge bg-success-subtle text-success fw-bold";
                badge.innerHTML = `📅 ${planDuration}-Day Meal Plan`;
            }
        }

        // Sub selectors
        const tomorrowBox = document.getElementById("tomorrowSlotSelector");
        const multiDayBox = document.getElementById("multiDayDurationSelector");

        if (tomorrowBox) {
            if (orderType === "tomorrow") {
                tomorrowBox.classList.remove("d-none");
            } else {
                tomorrowBox.classList.add("d-none");
            }
        }

        if (multiDayBox) {
            if (orderType === "multi_day") {
                multiDayBox.classList.remove("d-none");
            } else {
                multiDayBox.classList.add("d-none");
            }
        }

        // Tomorrow slot buttons
        document.querySelectorAll(".slot-pill-btn").forEach(btn => {
            if (btn.getAttribute("data-slot") === tomorrowSlot) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });

        // Duration buttons
        document.querySelectorAll(".duration-pill-btn").forEach(btn => {
            if (parseInt(btn.getAttribute("data-days"), 10) === planDuration) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
    }

    // Update navbar badges
    function updateBadges() {
        const { totalItems, grandTotal } = getTotals();

        document.querySelectorAll(".cart-count-badge").forEach(el => {
            el.textContent = totalItems;
            if (totalItems > 0) {
                el.classList.remove("d-none");
            } else {
                el.textContent = "0";
            }
        });

        document.querySelectorAll(".cart-total-badge").forEach(el => {
            el.textContent = `₹${grandTotal.toFixed(0)}`;
        });
    }

    // Render Cart Drawer
    function renderDrawer() {
        const itemsContainer = document.getElementById("cartItemsContainer");
        const footerSummary = document.getElementById("cartFooterSummary");
        const subheading = document.getElementById("cartDrawerSubheading");
        const subtotalText = document.getElementById("cartSubtotalText");
        const deliveryFeeText = document.getElementById("cartDeliveryFeeText");
        const taxesText = document.getElementById("cartTaxesText");
        const totalText = document.getElementById("cartTotalText");
        const checkoutTotal = document.getElementById("cartCheckoutTotal");

        if (!itemsContainer) return;

        const totals = getTotals();

        if (subheading) {
            subheading.textContent = `${totals.totalItems} item${totals.totalItems === 1 ? '' : 's'} added`;
        }

        if (cart.length === 0) {
            itemsContainer.innerHTML = `
                <div class="cart-empty-state text-center py-5">
                    <div class="cart-empty-icon mb-3">
                        <i class="bi bi-basket3 text-muted" style="font-size: 3.5rem;"></i>
                    </div>
                    <h5 class="fw-bold mb-2">Your cart is empty</h5>
                    <p class="text-muted small mb-4">Add your favorite breakfast, lunch, or dinner dishes to order instantly or plan ahead!</p>
                    <a href="/" class="btn btn-outline-custom rounded-pill px-4" data-bs-dismiss="offcanvas">
                        <i class="bi bi-search me-1"></i> Explore Gourmet Menu
                    </a>
                </div>
            `;
            if (footerSummary) footerSummary.classList.add("d-none");
            return;
        }

        if (footerSummary) footerSummary.classList.remove("d-none");

        // Render item list
        let html = '<div class="d-flex flex-column gap-3">';
        cart.forEach(item => {
            const isVeg = (item.food_type || "").toLowerCase().includes("non") ? false : true;
            html += `
                <div class="cart-item-row p-3 rounded-4 border bg-white shadow-xs">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <div class="d-flex align-items-center gap-2">
                            <span class="diet-stamp ${isVeg ? 'veg' : 'non-veg'}" style="width: 14px; height: 14px;">
                                <span class="diet-dot" style="width: 6px; height: 6px;"></span>
                            </span>
                            <span class="badge bg-light text-dark border small">${item.category || 'Meal'}</span>
                        </div>
                        <button type="button" class="btn btn-link text-danger p-0 text-decoration-none small" onclick="DailyBiteCart.removeItem('${item.id}')" title="Remove item">
                            <i class="bi bi-trash3"></i>
                        </button>
                    </div>

                    <div class="d-flex align-items-center gap-3">
                        <img src="${item.image_url}" alt="${item.name}" class="rounded-3 object-fit-cover shadow-xs" style="width: 60px; height: 60px;">
                        <div class="flex-grow-1">
                            <h6 class="fw-bold mb-1 text-dark text-truncate" style="max-width: 170px;">${item.name}</h6>
                            <div class="text-success fw-bold">₹${item.price} <span class="text-muted fw-normal small">each</span></div>
                        </div>

                        <!-- Quantity Stepper -->
                        <div class="quantity-stepper d-flex align-items-center border rounded-pill p-1 bg-light">
                            <button type="button" class="btn-stepper minus" onclick="DailyBiteCart.updateQuantity('${item.id}', -1)">
                                <i class="bi bi-dash"></i>
                            </button>
                            <span class="stepper-val px-2 fw-bold small">${item.quantity}</span>
                            <button type="button" class="btn-stepper plus" onclick="DailyBiteCart.updateQuantity('${item.id}', 1)">
                                <i class="bi bi-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';

        itemsContainer.innerHTML = html;

        // Update Bill Summary
        if (subtotalText) subtotalText.textContent = `₹${totals.subtotal.toFixed(2)}`;
        if (deliveryFeeText) {
            if (totals.isFreeDelivery) {
                deliveryFeeText.className = "text-success fw-bold";
                deliveryFeeText.textContent = "FREE";
            } else {
                deliveryFeeText.className = "text-dark";
                deliveryFeeText.textContent = `₹${totals.deliveryFee.toFixed(2)}`;
            }
        }
        if (taxesText) taxesText.textContent = `₹${totals.taxes.toFixed(2)}`;
        if (totalText) totalText.textContent = `₹${totals.grandTotal.toFixed(2)}`;
        if (checkoutTotal) checkoutTotal.innerHTML = `₹${totals.grandTotal.toFixed(2)} <i class="bi bi-arrow-right ms-1"></i>`;
    }

    // Open Cart Drawer
    function openCart() {
        const offcanvasEl = document.getElementById("cartOffcanvas");
        if (offcanvasEl && typeof bootstrap !== "undefined") {
            const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
            bsOffcanvas.show();
        }
    }

    // Close Cart Drawer
    function closeCart() {
        const offcanvasEl = document.getElementById("cartOffcanvas");
        if (offcanvasEl && typeof bootstrap !== "undefined") {
            const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
            if (bsOffcanvas) bsOffcanvas.hide();
        }
    }

    // Open Checkout Modal
    function openCheckout() {
        if (cart.length === 0) {
            if (typeof showDailyBiteToast === "function") {
                showDailyBiteToast("Your cart is empty. Add food items first!", "danger");
            }
            return;
        }

        closeCart();

        const totals = getTotals();

        // Update Checkout Header / Summary
        const modeSummary = document.getElementById("checkoutOrderModeSummary");
        if (modeSummary) {
            if (orderType === "instant") {
                modeSummary.innerHTML = '<span class="text-danger fw-bold">⚡ Instant Delivery</span> • Arriving in 25-35 minutes';
            } else if (orderType === "tomorrow") {
                modeSummary.innerHTML = `<span class="text-warning fw-bold">🌅 Scheduled for Tomorrow</span> • Slot: ${tomorrowSlot}`;
            } else {
                modeSummary.innerHTML = `<span class="text-success fw-bold">📅 ${planDuration}-Day Meal Plan</span> • Free Delivery Subscription`;
            }
        }

        const countSummary = document.getElementById("checkoutItemCountSummary");
        if (countSummary) countSummary.textContent = `${totals.totalItems} Items`;

        const subtotalSummary = document.getElementById("checkoutSubtotalSummary");
        if (subtotalSummary) subtotalSummary.textContent = `₹${totals.subtotal.toFixed(2)}`;

        const deliverySummary = document.getElementById("checkoutDeliverySummary");
        if (deliverySummary) {
            deliverySummary.textContent = totals.isFreeDelivery ? "FREE" : `₹${totals.deliveryFee.toFixed(2)}`;
        }

        const taxSummary = document.getElementById("checkoutTaxSummary");
        if (taxSummary) taxSummary.textContent = `₹${totals.taxes.toFixed(2)}`;

        const grandSummary = document.getElementById("checkoutGrandTotalSummary");
        if (grandSummary) grandSummary.textContent = `₹${totals.grandTotal.toFixed(2)}`;

        const btnAmount = document.getElementById("btnPayAmount");
        if (btnAmount) btnAmount.textContent = `₹${totals.grandTotal.toFixed(2)}`;

        // Prepopulate saved user details
        const savedName = localStorage.getItem(STORAGE_KEY_USER_NAME);
        const savedPhone = localStorage.getItem(STORAGE_KEY_USER_PHONE);
        const savedAddress = localStorage.getItem(STORAGE_KEY_USER_ADDRESS);

        const nameInput = document.getElementById("custName");
        if (nameInput && savedName) nameInput.value = savedName;

        const phoneInput = document.getElementById("custPhone");
        if (phoneInput && savedPhone) phoneInput.value = savedPhone;

        const addrInput = document.getElementById("custAddress");
        if (addrInput && savedAddress) addrInput.value = savedAddress;

        const modalEl = document.getElementById("checkoutModal");
        if (modalEl && typeof bootstrap !== "undefined") {
            const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
            modal.show();
        }
    }

    // Select payment method tile
    function selectPayment(method, tileElement) {
        selectedPayment = method;
        document.querySelectorAll(".payment-method-tile").forEach(t => t.classList.remove("active"));
        if (tileElement) {
            tileElement.classList.add("active");
            const radio = tileElement.querySelector("input[type='radio']");
            if (radio) radio.checked = true;
        }
    }

    // Submit Checkout Form
    async function handleCheckoutSubmit(event) {
        event.preventDefault();

        if (cart.length === 0) {
            if (typeof showDailyBiteToast === "function") {
                showDailyBiteToast("Your cart is empty.", "danger");
            }
            return;
        }

        const name = (document.getElementById("custName")?.value || "Valued Foodie").trim();
        const phone = (document.getElementById("custPhone")?.value || "9876543210").trim();
        const address = (document.getElementById("custAddress")?.value || "Hyderabad").trim();
        const instructions = (document.getElementById("custInstructions")?.value || "").trim();

        // Save for next time
        localStorage.setItem(STORAGE_KEY_USER_NAME, name);
        localStorage.setItem(STORAGE_KEY_USER_PHONE, phone);
        localStorage.setItem(STORAGE_KEY_USER_ADDRESS, address);

        const submitBtn = document.getElementById("confirmOrderSubmitBtn");
        const originalText = submitBtn ? submitBtn.innerHTML : "Place Order";
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Confirming Order...';
        }

        const payload = {
            order_type: orderType,
            plan_duration: planDuration,
            slot: tomorrowSlot,
            days_selected: `${planDuration} Days Plan`,
            customer_name: name,
            customer_phone: phone,
            delivery_address: address + (instructions ? ` (Note: ${instructions})` : ""),
            payment_method: selectedPayment,
            items: cart.map(i => ({
                id: i.id,
                name: i.name,
                price: i.price,
                quantity: i.quantity,
                category: i.category,
                food_type: i.food_type
            }))
        };

        try {
            const response = await fetch("/place-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const resData = await response.json();

            if (resData.success) {
                // Clear active cart
                cart = [];
                save();
                updateBadges();
                renderDrawer();

                // Close checkout modal
                const checkoutModalEl = document.getElementById("checkoutModal");
                if (checkoutModalEl && typeof bootstrap !== "undefined") {
                    const bsModal = bootstrap.Modal.getInstance(checkoutModalEl);
                    if (bsModal) bsModal.hide();
                }

                // Populate Order Success Modal
                const numEl = document.getElementById("successOrderNumber");
                if (numEl) numEl.textContent = resData.order_number || "DB-SUCCESS";

                const badgeEl = document.getElementById("successScheduleBadge");
                if (badgeEl) {
                    if (resData.order_type === "instant") {
                        badgeEl.className = "badge bg-danger-subtle text-danger fw-bold";
                        badgeEl.textContent = "⚡ Instant Delivery (25-35 mins)";
                    } else if (resData.order_type === "tomorrow") {
                        badgeEl.className = "badge bg-warning-subtle text-warning-emphasis fw-bold";
                        badgeEl.textContent = "🌅 Tomorrow Scheduled";
                    } else {
                        badgeEl.className = "badge bg-success-subtle text-success fw-bold";
                        badgeEl.textContent = `📅 ${resData.plan_duration || planDuration}-Day Meal Plan`;
                    }
                }

                const schedDetail = document.getElementById("successScheduleDetail");
                if (schedDetail) schedDetail.textContent = resData.delivery_schedule || "Preparing hot meal";

                const addrDetail = document.getElementById("successAddressDetail");
                if (addrDetail) addrDetail.textContent = `Delivering to: ${address}`;

                // Show Success Modal
                const successModalEl = document.getElementById("orderSuccessModal");
                if (successModalEl && typeof bootstrap !== "undefined") {
                    const successModal = bootstrap.Modal.getOrCreateInstance(successModalEl);
                    successModal.show();
                }

                if (typeof showDailyBiteToast === "function") {
                    showDailyBiteToast("Order placed successfully! Chef is preparing your meal. 👨‍🍳", "success");
                }
            } else {
                alert(resData.message || "Failed to place order. Please try again.");
            }
        } catch (err) {
            console.error("Order submission failed:", err);
            alert("Network error while placing order. Please check your connection and try again.");
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        }
    }

    // Auto-init on DOMContentLoaded
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    // Expose Public API
    return {
        init,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setOrderType,
        setTomorrowSlot,
        setPlanDuration,
        bulkAddScheduledMeals,
        openCart,
        closeCart,
        openCheckout,
        selectPayment,
        handleCheckoutSubmit,
        getTotals,
        getCart: () => [...cart]
    };
})();

// Global alias for compatibility
window.DailyBiteCart = DailyBiteCart;
window.openCartDrawer = function() {
    DailyBiteCart.openCart();
};
