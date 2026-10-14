import { products, bundlePromo, reviews } from "./products.js";

// ==========================================
// Application State
// ==========================================
const state = {
  products: [...products],
  activeFilter: "all",
  searchQuery: "",
  sortBy: "featured",
  cart: JSON.parse(localStorage.getItem("lado_cart") || "[]"),
  wishlist: JSON.parse(localStorage.getItem("lado_wishlist") || "[]"),
  appliedCoupon: null,
  isGiftWrapSelected: false,
  selectedPaymentMethod: "prepaid",
  activeQuickViewProduct: null,
  bundleSelectedItems: {
    "lado-01": true,
    "lado-03": true
  }
};

// ==========================================
// DOM Selectors
// ==========================================
const DOM = {
  // Navigation & Badges
  cartToggleBtn: document.getElementById("cartToggleBtn"),
  wishlistToggleBtn: document.getElementById("wishlistToggleBtn"),
  cartCount: document.getElementById("cartCount"),
  wishlistCount: document.getElementById("wishlistCount"),
  navLinks: document.querySelectorAll(".subnav-link"),
  storyItems: document.querySelectorAll(".cat-pill"),
  
  // Catalog
  productsGrid: document.getElementById("productsGrid"),
  catalogTabs: document.querySelectorAll(".tab-btn"),
  catalogSort: document.getElementById("catalogSort"),
  catalogSearchInput: document.getElementById("catalogSearchInput"),
  catalogTitle: document.getElementById("catalogTitle"),
  
  // Bundle
  bundleItem1: document.getElementById("bundleItem1"),
  bundleItem2: document.getElementById("bundleItem2"),
  bundleOrigTotal: document.getElementById("bundleOrigTotal"),
  bundleFinalTotal: document.getElementById("bundleFinalTotal"),
  bundleSavingsTag: document.getElementById("bundleSavingsTag"),
  addBundleBtn: document.getElementById("addBundleBtn"),
  
  // Reviews
  reviewsGrid: document.getElementById("reviewsGrid"),
  
  // Cart Drawer
  drawerOverlay: document.getElementById("drawerOverlay"),
  cartDrawer: document.getElementById("cartDrawer"),
  closeCartBtn: document.getElementById("closeCartBtn"),
  cartItemsList: document.getElementById("cartItemsList"),
  drawerCountText: document.getElementById("drawerCountText"),
  shippingStatusText: document.getElementById("shippingStatusText"),
  shippingProgressFill: document.getElementById("shippingProgressFill"),
  giftWrapCheckbox: document.getElementById("giftWrapCheckbox"),
  couponCodeInput: document.getElementById("couponCodeInput"),
  applyCouponBtn: document.getElementById("applyCouponBtn"),
  couponMessage: document.getElementById("couponMessage"),
  couponChips: document.querySelectorAll(".coupon-chip"),
  drawerSubtotal: document.getElementById("drawerSubtotal"),
  drawerDiscountRow: document.getElementById("drawerDiscountRow"),
  drawerDiscountLabel: document.getElementById("drawerDiscountLabel"),
  drawerDiscount: document.getElementById("drawerDiscount"),
  drawerGiftRow: document.getElementById("drawerGiftRow"),
  drawerShipping: document.getElementById("drawerShipping"),
  cartSavingsBanner: document.getElementById("cartSavingsBanner"),
  drawerGrandTotal: document.getElementById("drawerGrandTotal"),
  startCheckoutBtn: document.getElementById("startCheckoutBtn"),
  
  // Quick View Modal
  quickViewOverlay: document.getElementById("quickViewOverlay"),
  quickViewContent: document.getElementById("quickViewContent"),
  closeQuickViewBtn: document.getElementById("closeQuickViewBtn"),
  
  // Search Modal
  openSearchBtn: document.getElementById("openSearchBtn"),
  searchModalOverlay: document.getElementById("searchModalOverlay"),
  closeSearchModalBtn: document.getElementById("closeSearchModalBtn"),
  liveSearchInput: document.getElementById("liveSearchInput"),
  searchResultsList: document.getElementById("searchResultsList"),
  quickSearchTags: document.querySelectorAll(".quick-search-tag"),
  
  // Checkout Modal
  checkoutModalOverlay: document.getElementById("checkoutModalOverlay"),
  closeCheckoutBtn: document.getElementById("closeCheckoutBtn"),
  checkoutForm: document.getElementById("checkoutForm"),
  checkoutMainContent: document.getElementById("checkoutMainContent"),
  checkoutMiniItems: document.getElementById("checkoutMiniItems"),
  chkSubtotal: document.getElementById("chkSubtotal"),
  chkDiscountRow: document.getElementById("chkDiscountRow"),
  chkDiscountTitle: document.getElementById("chkDiscountTitle"),
  chkDiscount: document.getElementById("chkDiscount"),
  chkGiftRow: document.getElementById("chkGiftRow"),
  chkShipping: document.getElementById("chkShipping"),
  chkGrandTotal: document.getElementById("chkGrandTotal"),
  checkoutBtnPrice: document.getElementById("checkoutBtnPrice"),
  confirmOrderBtn: document.getElementById("confirmOrderBtn"),
  checkoutBtnLabel: document.getElementById("checkoutBtnLabel"),
  payMethodOptions: document.querySelectorAll(".pay-method-option"),
  customerName: document.getElementById("customerName"),
  customerPhone: document.getElementById("customerPhone"),
  
  // Success View
  orderSuccessView: document.getElementById("orderSuccessView"),
  successCustomerName: document.getElementById("successCustomerName"),
  successCustomerPhone: document.getElementById("successCustomerPhone"),
  generatedOrderId: document.getElementById("generatedOrderId"),
  continueShoppingBtn: document.getElementById("continueShoppingBtn"),
  printReceiptBtn: document.getElementById("printReceiptBtn"),
  
  // Toast & Topbar
  toastContainer: document.getElementById("toastContainer"),
  announcementText: document.getElementById("announcementText"),
  topbarPrev: document.getElementById("topbarPrev"),
  topbarNext: document.getElementById("topbarNext")
};

// ==========================================
// Toast Notification
// ==========================================
function showToast(message, icon = "✨") {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  DOM.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function formatCurrency(val) {
  return "₹" + Number(val).toLocaleString("en-IN");
}

// ==========================================
// Render Products Grid
// ==========================================
function renderProducts() {
  let list = [...state.products];

  // Category filter
  if (state.activeFilter !== "all") {
    if (state.activeFilter === "under499") {
      list = list.filter(p => p.price <= 499);
    } else {
      list = list.filter(p => p.category === state.activeFilter || p.tags.includes(state.activeFilter));
    }
  }

  // Search filter
  if (state.searchQuery.trim()) {
    const q = state.searchQuery.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.material.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (state.sortBy === "price-low") {
    list.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === "price-high") {
    list.sort((a, b) => b.price - a.price);
  } else if (state.sortBy === "rating") {
    list.sort((a, b) => b.rating - a.rating);
  }

  if (list.length === 0) {
    DOM.productsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--color-text-muted);">
        <p style="font-size: 1.25rem; margin-bottom: 8px;">No jewelry pieces found matching your filter.</p>
        <button class="btn btn-dark" id="resetFiltersBtn">VIEW ALL JEWELLERY</button>
      </div>
    `;
    const resetBtn = document.getElementById("resetFiltersBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        state.activeFilter = "all";
        state.searchQuery = "";
        if (DOM.catalogSearchInput) DOM.catalogSearchInput.value = "";
        updateCategoryTabsUI();
        renderProducts();
      });
    }
    return;
  }

  DOM.productsGrid.innerHTML = list.map(item => {
    const isWishlisted = state.wishlist.includes(item.id);
    let badgeClass = "badge-bestseller";
    if (item.badge === "WATERPROOF") badgeClass = "badge-waterproof";
    if (item.badge === "UNDER ₹499") badgeClass = "badge-under499";
    if (item.badge === "TRENDING" || item.badge === "HOT DEAL") badgeClass = "badge-trending";

    return `
      <article class="product-card" data-id="${item.id}">
        <div class="card-img-wrap">
          <span class="card-badge ${badgeClass}">${item.badge}</span>
          <button class="card-wishlist-btn ${isWishlisted ? "active" : ""}" data-wishlist-id="${item.id}" aria-label="Add to wishlist">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlisted ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
          <img src="${item.image}" alt="${item.name}" loading="lazy">
          <button class="card-quick-view-btn" data-quickview-id="${item.id}">QUICK VIEW</button>
        </div>
        <div class="card-body">
          <div class="card-rating">
            <span class="stars">★★★★★</span>
            <span>${item.rating} (${item.reviewsCount})</span>
          </div>
          <h3 class="card-title" title="${item.name}">${item.name}</h3>
          <div class="card-pricing">
            <span class="price-current">${formatCurrency(item.price)}</span>
            <span class="price-orig">${formatCurrency(item.originalPrice)}</span>
            <span class="price-discount">${item.discount}</span>
          </div>
          <button class="card-add-btn" data-add-cart-id="${item.id}">
            ADD TO BAG
          </button>
        </div>
      </article>
    `;
  }).join("");

  attachProductCardEvents();
}

function attachProductCardEvents() {
  document.querySelectorAll("[data-wishlist-id]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleWishlist(btn.dataset.wishlistId);
    });
  });

  document.querySelectorAll("[data-quickview-id]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openQuickView(btn.dataset.quickviewId);
    });
  });

  document.querySelectorAll("[data-add-cart-id]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.dataset.addCartId;
      const originalText = btn.innerHTML;
      btn.innerHTML = "ADDING...";
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = "ADDED! ✓";
        addToCart(id, 1);
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
        }, 1200);
      }, 200);
    });
  });
}

// ==========================================
// Wishlist Logic
// ==========================================
function toggleWishlist(productId) {
  const index = state.wishlist.indexOf(productId);
  const product = state.products.find(p => p.id === productId);

  if (index === -1) {
    state.wishlist.push(productId);
    showToast(`Added "${product.name}" to your Wishlist! ❤️`);
  } else {
    state.wishlist.splice(index, 1);
    showToast(`Removed "${product.name}" from your Wishlist`, "🤍");
  }

  localStorage.setItem("lado_wishlist", JSON.stringify(state.wishlist));
  updateWishlistUI();
  renderProducts();
}

function updateWishlistUI() {
  DOM.wishlistCount.textContent = state.wishlist.length;
}

// ==========================================
// Cart Logic & Calculations
// ==========================================
function calculateCartTotals() {
  const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const mrpTotal = state.cart.reduce((sum, item) => sum + ((item.originalPrice || item.price * 2) * item.quantity), 0);
  const freeShippingThreshold = 499;

  let discountAmount = 0;
  if (state.appliedCoupon) {
    if (state.appliedCoupon.type === "percent") {
      discountAmount = Math.round(subtotal * (state.appliedCoupon.value / 100));
    } else if (state.appliedCoupon.type === "fixed") {
      discountAmount = Math.min(subtotal, state.appliedCoupon.value);
    }
  }

  const totalSavings = Math.max(0, (mrpTotal - subtotal) + discountAmount);
  const giftWrapFee = state.isGiftWrapSelected ? 49 : 0;
  const shippingFee = (subtotal >= freeShippingThreshold || totalCount === 0) ? 0 : 70;
  const grandTotal = Math.max(0, subtotal - discountAmount + giftWrapFee + shippingFee);

  return {
    totalCount,
    subtotal,
    mrpTotal,
    totalSavings,
    discountAmount,
    giftWrapFee,
    shippingFee,
    grandTotal,
    freeShippingThreshold
  };
}

function addToCart(productId, quantity = 1, customVariant = null) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  const variantName = customVariant || (product.colors && product.colors[0]) || "Standard 18K Polish";
  const existingItemIndex = state.cart.findIndex(item => item.id === productId && item.variant === variantName);

  if (existingItemIndex > -1) {
    state.cart[existingItemIndex].quantity += quantity;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      variant: variantName,
      quantity: quantity
    });
  }

  saveCart();
  updateCartUI();
  openCartDrawer();
  showToast(`Added ${quantity}x "${product.name}" to your bag!`, "🛍️");
}

function updateCartQuantity(productId, variant, delta) {
  const index = state.cart.findIndex(i => i.id === productId && i.variant === variant);
  if (index > -1) {
    state.cart[index].quantity += delta;
    if (state.cart[index].quantity <= 0) {
      state.cart.splice(index, 1);
    }
    saveCart();
    updateCartUI();
  }
}

function removeCartItem(productId, variant) {
  state.cart = state.cart.filter(i => !(i.id === productId && i.variant === variant));
  saveCart();
  updateCartUI();
  showToast("Item removed from bag", "🗑️");
}

function saveCart() {
  localStorage.setItem("lado_cart", JSON.stringify(state.cart));
}

function updateCartUI() {
  const totals = calculateCartTotals();

  DOM.cartCount.textContent = totals.totalCount;
  DOM.drawerCountText.textContent = `(${totals.totalCount} ${totals.totalCount === 1 ? "item" : "items"})`;

  // Free shipping progress bar
  if (totals.subtotal >= totals.freeShippingThreshold) {
    DOM.shippingStatusText.innerHTML = "🎉 <strong>CONGRATULATIONS!</strong> You unlocked <strong>FREE EXPRESS DELIVERY</strong>!";
    DOM.shippingProgressFill.style.width = "100%";
    DOM.shippingProgressFill.classList.add("unlocked");
    DOM.drawerShipping.textContent = "FREE";
  } else {
    const diff = totals.freeShippingThreshold - totals.subtotal;
    const pct = Math.min(100, (totals.subtotal / totals.freeShippingThreshold) * 100);
    DOM.shippingStatusText.innerHTML = `Add <strong>${formatCurrency(diff)}</strong> more for <strong>FREE EXPRESS DELIVERY</strong>!`;
    DOM.shippingProgressFill.style.width = `${pct}%`;
    DOM.shippingProgressFill.classList.remove("unlocked");
    DOM.drawerShipping.textContent = totals.totalCount > 0 ? "₹70" : "FREE";
  }

  DOM.drawerSubtotal.textContent = formatCurrency(totals.subtotal);

  if (totals.discountAmount > 0) {
    DOM.drawerDiscountRow.style.display = "flex";
    DOM.drawerDiscountLabel.textContent = `Coupon (${state.appliedCoupon.code})`;
    DOM.drawerDiscount.textContent = `-${formatCurrency(totals.discountAmount)}`;
  } else {
    DOM.drawerDiscountRow.style.display = "none";
  }

  if (state.isGiftWrapSelected) {
    DOM.drawerGiftRow.style.display = "flex";
  } else {
    DOM.drawerGiftRow.style.display = "none";
  }

  DOM.drawerGrandTotal.textContent = formatCurrency(totals.grandTotal);

  // Total savings banner
  if (DOM.cartSavingsBanner) {
    if (totals.totalSavings > 0 && state.cart.length > 0) {
      DOM.cartSavingsBanner.style.display = "flex";
      DOM.cartSavingsBanner.innerHTML = `🎉 <strong>Total Bag Savings: ${formatCurrency(totals.totalSavings)}!</strong>`;
    } else {
      DOM.cartSavingsBanner.style.display = "none";
    }
  }

  // Update checkout button state
  if (DOM.startCheckoutBtn) {
    if (state.cart.length === 0) {
      DOM.startCheckoutBtn.disabled = true;
      DOM.startCheckoutBtn.textContent = "SHOPPING BAG IS EMPTY";
    } else {
      DOM.startCheckoutBtn.disabled = false;
      DOM.startCheckoutBtn.innerHTML = `PROCEED TO CHECKOUT • ${formatCurrency(totals.grandTotal)} →`;
    }
  }

  // Render items in cart drawer
  if (state.cart.length === 0) {
    DOM.cartItemsList.innerHTML = `
      <div class="cart-empty-state">
        <div class="empty-icon-circle">🛍️</div>
        <p style="font-weight:600; color:#222; margin-bottom:4px;">Your shopping bag is empty</p>
        <p style="font-size: 0.8125rem; color: #777;">Discover our minimal waterproof & anti-tarnish jewelry</p>
        <button type="button" class="empty-shop-btn" id="emptyExploreBtn">Explore Best Sellers ✨</button>
      </div>
    `;
    const emptyBtn = document.getElementById("emptyExploreBtn");
    if (emptyBtn) {
      emptyBtn.addEventListener("click", () => {
        closeCartDrawer();
        document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
      });
    }
  } else {
    DOM.cartItemsList.innerHTML = state.cart.map(item => {
      const discPct = item.originalPrice ? Math.round((1 - item.price / item.originalPrice) * 100) : 0;
      return `
      <div class="cart-item-row">
        <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-variant">Finish: ${item.variant}</div>
          <div class="cart-item-price-wrap">
            <span class="cart-item-price">${formatCurrency(item.price)}</span>
            ${item.originalPrice ? `<span class="cart-item-mrp">${formatCurrency(item.originalPrice)}</span>` : ''}
            ${discPct > 0 ? `<span class="cart-item-savings">${discPct}% OFF</span>` : ''}
          </div>
          <div class="cart-item-controls">
            <div class="qty-counter">
              <button class="qty-btn" data-cart-dec="${item.id}" data-variant="${item.variant}">-</button>
              <span class="qty-number">${item.quantity}</span>
              <button class="qty-btn" data-cart-inc="${item.id}" data-variant="${item.variant}">+</button>
            </div>
            <button class="remove-item-btn" data-cart-remove="${item.id}" data-variant="${item.variant}">Remove</button>
          </div>
        </div>
      </div>
    `;
    }).join("");

    DOM.cartItemsList.querySelectorAll("[data-cart-dec]").forEach(btn => {
      btn.addEventListener("click", () => updateCartQuantity(btn.dataset.cartDec, btn.dataset.variant, -1));
    });
    DOM.cartItemsList.querySelectorAll("[data-cart-inc]").forEach(btn => {
      btn.addEventListener("click", () => updateCartQuantity(btn.dataset.cartInc, btn.dataset.variant, 1));
    });
    DOM.cartItemsList.querySelectorAll("[data-cart-remove]").forEach(btn => {
      btn.addEventListener("click", () => removeCartItem(btn.dataset.cartRemove, btn.dataset.variant));
    });
  }
}

function openCartDrawer() {
  DOM.drawerOverlay.classList.add("active");
  DOM.cartDrawer.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCartDrawer() {
  DOM.drawerOverlay.classList.remove("active");
  DOM.cartDrawer.classList.remove("active");
  document.body.style.overflow = "";
}

// Gift wrap toggle
if (DOM.giftWrapCheckbox) {
  DOM.giftWrapCheckbox.addEventListener("change", (e) => {
    state.isGiftWrapSelected = e.target.checked;
    updateCartUI();
    if (state.isGiftWrapSelected) {
      showToast("Added Signature Royal Velvet Gift Box (+₹49)", "🎁");
    }
  });
}

// Clickable coupon chips
DOM.couponChips.forEach(chip => {
  chip.addEventListener("click", () => {
    const code = chip.dataset.coupon;
    DOM.couponCodeInput.value = code;
    applyCouponCode(code);
  });
});

DOM.applyCouponBtn.addEventListener("click", () => {
  const code = DOM.couponCodeInput.value.trim().toUpperCase();
  applyCouponCode(code);
});

function applyCouponCode(code) {
  const c = code.trim().toUpperCase();
  if (c === "LADO10" || c === "PREPAID10") {
    state.appliedCoupon = { code: c, type: "percent", value: 10 };
    DOM.couponMessage.innerHTML = `✓ Coupon <strong>${c}</strong> applied (10% OFF)! <button type="button" class="remove-coupon-link" id="removeCouponBtn">✕ Remove</button>`;
    DOM.couponMessage.className = "coupon-msg success";
    showToast("10% Discount applied to your bag!", "🎟️");
  } else if (c === "WELCOME200" || c === "SPARKLE200") {
    state.appliedCoupon = { code: c, type: "fixed", value: 200 };
    DOM.couponMessage.innerHTML = `✓ Coupon <strong>${c}</strong> applied (₹200 Welcome Gift)! <button type="button" class="remove-coupon-link" id="removeCouponBtn">✕ Remove</button>`;
    DOM.couponMessage.className = "coupon-msg success";
    showToast("₹200 Welcome Gift applied!", "🎟️");
  } else if (c === "FESTIVE15") {
    state.appliedCoupon = { code: c, type: "percent", value: 15 };
    DOM.couponMessage.innerHTML = `✓ Coupon <strong>${c}</strong> applied (15% Festive Special)! <button type="button" class="remove-coupon-link" id="removeCouponBtn">✕ Remove</button>`;
    DOM.couponMessage.className = "coupon-msg success";
    showToast("15% Festive discount applied!", "✨");
  } else {
    DOM.couponMessage.textContent = "Invalid coupon code. Try LADO10 or FESTIVE15.";
    DOM.couponMessage.className = "coupon-msg error";
  }

  // Toggle active chip
  DOM.couponChips.forEach(chip => {
    chip.classList.toggle("active", state.appliedCoupon && chip.dataset.coupon === state.appliedCoupon.code);
  });

  const remBtn = document.getElementById("removeCouponBtn");
  if (remBtn) {
    remBtn.addEventListener("click", removeAppliedCoupon);
  }

  updateCartUI();
}

function removeAppliedCoupon() {
  state.appliedCoupon = null;
  DOM.couponCodeInput.value = "";
  DOM.couponMessage.textContent = "";
  DOM.couponMessage.className = "coupon-msg";
  DOM.couponChips.forEach(chip => chip.classList.remove("active"));
  updateCartUI();
  showToast("Coupon removed", "ℹ️");
}

// ==========================================
// Client Demo Checkout System
// ==========================================
function openCheckoutModal() {
  if (state.cart.length === 0) {
    showToast("Your shopping bag is empty! Add an item first.", "⚠️");
    return;
  }
  closeCartDrawer();
  
  // Reset success view if any
  DOM.checkoutMainContent.style.display = "block";
  DOM.orderSuccessView.style.display = "none";
  
  updateCheckoutSummaryUI();
  DOM.checkoutModalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCheckoutModal() {
  DOM.checkoutModalOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

function updateCheckoutSummaryUI() {
  const totals = calculateCartTotals();

  // Render mini item list
  DOM.checkoutMiniItems.innerHTML = state.cart.map(item => `
    <div class="chk-mini-item">
      <img src="${item.image}" alt="${item.name}" class="chk-mini-thumb">
      <div class="chk-mini-details">
        <div class="chk-mini-name">${item.name}</div>
        <div class="chk-mini-price">${item.quantity}x • ${formatCurrency(item.price)}</div>
      </div>
    </div>
  `).join("");

  DOM.chkSubtotal.textContent = formatCurrency(totals.subtotal);
  if (totals.discountAmount > 0) {
    DOM.chkDiscountRow.style.display = "flex";
    DOM.chkDiscountTitle.textContent = `Discount (${state.appliedCoupon.code}):`;
    DOM.chkDiscount.textContent = `-${formatCurrency(totals.discountAmount)}`;
  } else {
    DOM.chkDiscountRow.style.display = "none";
  }

  if (state.isGiftWrapSelected) {
    DOM.chkGiftRow.style.display = "flex";
  } else {
    DOM.chkGiftRow.style.display = "none";
  }

  DOM.chkShipping.textContent = totals.shippingFee === 0 ? "FREE" : "₹70";
  DOM.chkGrandTotal.textContent = formatCurrency(totals.grandTotal);
  DOM.checkoutBtnPrice.textContent = formatCurrency(totals.grandTotal);
}

// Payment method options listener
DOM.payMethodOptions.forEach(opt => {
  opt.addEventListener("click", () => {
    DOM.payMethodOptions.forEach(o => o.classList.remove("active"));
    opt.classList.add("active");
    const radio = opt.querySelector("input");
    if (radio) {
      radio.checked = true;
      state.selectedPaymentMethod = radio.value;
    }
  });
});

// Checkout Form Submission & Order Placement
DOM.checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const customer = DOM.customerName.value.trim() || "Ananya";
  const phone = DOM.customerPhone.value.trim() || "+91 98765 43210";
  const orderId = "#LADO-" + Math.floor(1000 + Math.random() * 9000);

  // Show realistic processing state
  DOM.confirmOrderBtn.disabled = true;
  DOM.checkoutBtnLabel.innerHTML = `
    <span style="display:inline-block; animation:spin 0.8s linear infinite;">⏳</span> AUTHORIZING SECURE ORDER...
  `;

  setTimeout(() => {
    DOM.checkoutMainContent.style.display = "none";
    DOM.orderSuccessView.style.display = "block";

    DOM.generatedOrderId.textContent = orderId;
    DOM.successCustomerName.textContent = customer.split(" ")[0];
    DOM.successCustomerPhone.textContent = phone;

    // Reset button
    DOM.confirmOrderBtn.disabled = false;
    DOM.checkoutBtnLabel.innerHTML = `PLACE ORDER • <span id="checkoutBtnPrice">${DOM.chkGrandTotal.textContent}</span>`;

    // Clear cart
    state.cart = [];
    saveCart();
    updateCartUI();
    showToast(`Order ${orderId} Placed Successfully! 💎`, "✅");
  }, 750);
});

DOM.continueShoppingBtn.addEventListener("click", () => {
  closeCheckoutModal();
  DOM.checkoutMainContent.style.display = "block";
  DOM.orderSuccessView.style.display = "none";
});

if (DOM.printReceiptBtn) {
  DOM.printReceiptBtn.addEventListener("click", () => {
    window.print();
  });
}

// ==========================================
// Bundle Deal Calculation
// ==========================================
function updateBundleUI() {
  const item1Checked = DOM.bundleItem1.checked;
  const item2Checked = DOM.bundleItem2.checked;

  let origTotal = 0;
  if (item1Checked) origTotal += 1899;
  if (item2Checked) origTotal += 899;

  let finalTotal = origTotal;
  let savings = 0;

  if (item1Checked && item2Checked) {
    savings = Math.round(origTotal * 0.15);
    finalTotal = origTotal - savings;
    DOM.bundleSavingsTag.textContent = `You Save ${formatCurrency(savings)} (15% Off)`;
    DOM.bundleSavingsTag.style.display = "block";
  } else {
    DOM.bundleSavingsTag.style.display = "none";
  }

  DOM.bundleOrigTotal.textContent = formatCurrency(origTotal);
  DOM.bundleFinalTotal.textContent = formatCurrency(finalTotal);
  DOM.addBundleBtn.disabled = !item1Checked && !item2Checked;
}

DOM.bundleItem1.addEventListener("change", updateBundleUI);
DOM.bundleItem2.addEventListener("change", updateBundleUI);

DOM.addBundleBtn.addEventListener("click", () => {
  const item1 = DOM.bundleItem1.checked;
  const item2 = DOM.bundleItem2.checked;

  if (item1) addToCart("lado-01", 1, "Emerald Gold (Combo Deal)");
  if (item2) addToCart("lado-03", 1, "Royal Gold & Pearl (Combo Deal)");

  showToast("Combo bundle added to bag with 15% discount!", "🎉");
});

// ==========================================
// Quick View Modal Logic
// ==========================================
function openQuickView(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  state.activeQuickViewProduct = product;
  const isWishlisted = state.wishlist.includes(product.id);

  DOM.quickViewContent.innerHTML = `
    <div class="qv-img-wrap">
      <img src="${product.image}" alt="${product.name}">
    </div>
    <div class="qv-details">
      <span style="font-size:0.75rem; font-weight:600; letter-spacing:0.08em; color:var(--color-accent-gold); text-transform:uppercase; margin-bottom:4px;">
        ${product.category.toUpperCase()} • ${product.isAntiTarnish ? "100% WATERPROOF" : "HANDCRAFTED HEIRLOOM"}
      </span>
      <h2 class="qv-title">${product.name}</h2>
      
      <div class="card-rating" style="margin-bottom: 12px;">
        <span class="stars">★★★★★</span>
        <span>${product.rating} / 5.0 (${product.reviewsCount} verified reviews)</span>
      </div>

      <div class="qv-pricing">
        <span class="price-current" style="font-size: 1.4rem;">${formatCurrency(product.price)}</span>
        <span class="price-orig" style="font-size: 0.95rem;">${formatCurrency(product.originalPrice)}</span>
        <span class="price-discount">${product.discount}</span>
      </div>

      <p class="qv-desc">${product.description}</p>

      <div style="margin-bottom: 16px;">
        <label style="display:block; font-size:0.75rem; font-weight:600; text-transform:uppercase; margin-bottom:6px;">Select Finish:</label>
        <div style="display:flex; gap:8px;">
          ${product.colors.map((c, i) => `
            <button class="tab-btn ${i === 0 ? "active" : ""}" style="font-size:0.75rem; padding:4px 12px;" data-qv-color="${c}">${c}</button>
          `).join("")}
        </div>
      </div>

      <ul class="qv-features">
        ${product.features.map(f => `<li>${f}</li>`).join("")}
      </ul>

      <div style="display:flex; gap:12px; margin-top:auto;">
        <button class="btn btn-dark" id="qvAddToCartBtn" style="flex:1;">
          ADD TO BAG • ${formatCurrency(product.price)}
        </button>
        <button class="icon-btn" id="qvWishlistBtn" style="border:1px solid var(--color-border-dark);" aria-label="Wishlist">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="${isWishlisted ? "#da3f3f" : "none"}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
      </div>
    </div>
  `;

  let selectedColor = product.colors[0];
  DOM.quickViewContent.querySelectorAll("[data-qv-color]").forEach(btn => {
    btn.addEventListener("click", () => {
      DOM.quickViewContent.querySelectorAll("[data-qv-color]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedColor = btn.dataset.qvColor;
    });
  });

  document.getElementById("qvAddToCartBtn").addEventListener("click", () => {
    addToCart(product.id, 1, selectedColor);
    closeQuickView();
  });

  document.getElementById("qvWishlistBtn").addEventListener("click", () => {
    toggleWishlist(product.id);
    openQuickView(product.id);
  });

  DOM.quickViewOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeQuickView() {
  DOM.quickViewOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

// ==========================================
// Search Modal Logic
// ==========================================
function openSearchModal() {
  DOM.searchModalOverlay.classList.add("active");
  DOM.liveSearchInput.value = "";
  DOM.liveSearchInput.focus();
  document.body.style.overflow = "hidden";
  performLiveSearch("");
}

function closeSearchModal() {
  DOM.searchModalOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

function performLiveSearch(query) {
  const q = query.trim().toLowerCase();
  if (!q) {
    DOM.searchResultsList.innerHTML = `<p class="search-empty-hint">Type above to see matching jewelry</p>`;
    return;
  }

  const matches = state.products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.material.toLowerCase().includes(q)
  );

  if (matches.length === 0) {
    DOM.searchResultsList.innerHTML = `<p class="search-empty-hint">No products found matching "${query}".</p>`;
    return;
  }

  DOM.searchResultsList.innerHTML = matches.map(m => `
    <div class="search-result-item" data-search-item-id="${m.id}" style="cursor:pointer;">
      <img src="${m.image}" alt="${m.name}" class="search-result-thumb">
      <div style="flex:1;">
        <div style="font-size:0.875rem; font-weight:500; color:#111;">${m.name}</div>
        <div style="font-size:0.75rem; color:#777;">${m.category} • ${formatCurrency(m.price)}</div>
      </div>
      <button class="btn btn-dark" style="padding:6px 14px; font-size:0.75rem;" data-search-add="${m.id}">ADD</button>
    </div>
  `).join("");

  DOM.searchResultsList.querySelectorAll("[data-search-item-id]").forEach(row => {
    row.addEventListener("click", (e) => {
      if (e.target.closest("[data-search-add]")) return;
      closeSearchModal();
      openQuickView(row.dataset.searchItemId);
    });
  });

  DOM.searchResultsList.querySelectorAll("[data-search-add]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(btn.dataset.searchAdd, 1);
      closeSearchModal();
    });
  });
}

// ==========================================
// Reviews Render
// ==========================================
function renderReviews() {
  DOM.reviewsGrid.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="review-stars">★★★★★</div>
      <h3 class="review-title">${r.title}</h3>
      <p class="review-comment">"${r.comment}"</p>
      <div class="review-author">
        <div>
          <strong>${r.name}</strong> • ${r.location}
        </div>
        <span class="verified-badge">✓ Verified Buyer</span>
      </div>
    </div>
  `).join("");
}

// ==========================================
// Filter Navigation
// ==========================================
function updateCategoryTabsUI() {
  DOM.catalogTabs.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.filter === state.activeFilter);
  });
  DOM.navLinks.forEach(link => {
    link.classList.toggle("active", link.dataset.category === state.activeFilter);
  });

  const titles = {
    all: "Best Sellers ✨",
    "anti-tarnish": "Anti-Tarnish Waterproof Collection 💧",
    necklaces: "Necklaces & Chokers",
    earrings: "Earrings & Chandbalis",
    rings: "Stackable Rings & Solitaires",
    bracelets: "Tennis Bracelets & Kadas",
    under499: "Curated Luxury Under ₹499"
  };
  DOM.catalogTitle.textContent = titles[state.activeFilter] || "Fine Artificial Jewellery";
}

DOM.catalogTabs.forEach(btn => {
  btn.addEventListener("click", () => {
    state.activeFilter = btn.dataset.filter;
    updateCategoryTabsUI();
    renderProducts();
  });
});

DOM.navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    const cat = link.dataset.category;
    if (cat) {
      e.preventDefault();
      state.activeFilter = cat;
      updateCategoryTabsUI();
      renderProducts();
      document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
    }
  });
});

DOM.storyItems.forEach(story => {
  story.addEventListener("click", () => {
    const cat = story.dataset.category;
    if (cat) {
      state.activeFilter = cat;
      updateCategoryTabsUI();
      renderProducts();
      document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
    }
  });
});

DOM.catalogSort.addEventListener("change", (e) => {
  state.sortBy = e.target.value;
  renderProducts();
});

DOM.catalogSearchInput.addEventListener("input", (e) => {
  state.searchQuery = e.target.value;
  renderProducts();
});

// ==========================================
// Listeners
// ==========================================
DOM.cartToggleBtn.addEventListener("click", openCartDrawer);
DOM.closeCartBtn.addEventListener("click", closeCartDrawer);
DOM.drawerOverlay.addEventListener("click", closeCartDrawer);
DOM.startCheckoutBtn.addEventListener("click", openCheckoutModal);
DOM.closeCheckoutBtn.addEventListener("click", closeCheckoutModal);

DOM.wishlistToggleBtn.addEventListener("click", () => {
  state.activeFilter = "all";
  state.searchQuery = "";
  const wishlistedItems = state.products.filter(p => state.wishlist.includes(p.id));
  if (wishlistedItems.length === 0) {
    showToast("Your Wishlist is currently empty. Click ❤️ on items to save!", "🤍");
  } else {
    showToast(`Showing ${wishlistedItems.length} wishlisted items`, "❤️");
    DOM.catalogTitle.textContent = `My Wishlist (${wishlistedItems.length} items)`;
    DOM.productsGrid.innerHTML = "";
    document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
    state.products = wishlistedItems;
    renderProducts();
    state.products = [...products];
  }
});

DOM.closeQuickViewBtn.addEventListener("click", closeQuickView);
DOM.quickViewOverlay.addEventListener("click", (e) => {
  if (e.target === DOM.quickViewOverlay) closeQuickView();
});

DOM.openSearchBtn.addEventListener("click", openSearchModal);
DOM.closeSearchModalBtn.addEventListener("click", closeSearchModal);
DOM.searchModalOverlay.addEventListener("click", (e) => {
  if (e.target === DOM.searchModalOverlay) closeSearchModal();
});
DOM.liveSearchInput.addEventListener("input", (e) => performLiveSearch(e.target.value));

DOM.quickSearchTags.forEach(tag => {
  tag.addEventListener("click", () => {
    const query = tag.dataset.tag;
    DOM.liveSearchInput.value = query;
    performLiveSearch(query);
  });
});

window.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    openSearchModal();
  }
  if (e.key === "Escape") {
    closeCartDrawer();
    closeQuickView();
    closeSearchModal();
    closeCheckoutModal();
  }
});

// Topbar rotating announcement (PRAO style)
const announcements = [
  "Cash On Delivery (COD) Available Across India ✨",
  "Free Express Delivery on Orders Above ₹499 🚚",
  "Flat 10% Off on All Prepaid Orders | Code: LADO10 💎"
];
let currentAnnouncementIndex = 0;

function updateAnnouncement(index) {
  currentAnnouncementIndex = (index + announcements.length) % announcements.length;
  if (DOM.announcementText) {
    DOM.announcementText.style.opacity = "0";
    setTimeout(() => {
      DOM.announcementText.textContent = announcements[currentAnnouncementIndex];
      DOM.announcementText.style.opacity = "1";
    }, 180);
  }
}

if (DOM.topbarPrev) DOM.topbarPrev.addEventListener("click", () => updateAnnouncement(currentAnnouncementIndex - 1));
if (DOM.topbarNext) DOM.topbarNext.addEventListener("click", () => updateAnnouncement(currentAnnouncementIndex + 1));
setInterval(() => updateAnnouncement(currentAnnouncementIndex + 1), 4000);

// Initialize
function init() {
  renderProducts();
  renderReviews();
  updateWishlistUI();
  updateCartUI();
  updateBundleUI();
  console.log("LADO Cart & Checkout system ready for demo.");
}

init();
