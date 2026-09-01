// ============================================================
// SUIIS BEAUTY - Website Controller Service
// Allows the AI Voice Consultant to control the website in real-time
// (Scrolling, Highlighting Products, Opening Cart, Comparison, Routing)
// ============================================================

export class WebsiteController {
  constructor() {
    this.navigateFn = null;
    this.cartContext = null;
  }

  setNavigator(navigate) {
    this.navigateFn = navigate;
  }

  setCartContext(cartCtx) {
    this.cartContext = cartCtx;
  }

  // ========== REAL-TIME ACTION EXECUTION ==========

  // 1. Scroll to products or sections on screen
  scrollToProducts(productIds = []) {
    // If user is not on shop/home page, navigate to shop page with query
    if (window.location.pathname !== '/shop' && window.location.pathname !== '/') {
      if (this.navigateFn) this.navigateFn('/shop');
    }

    setTimeout(() => {
      // Find element by product id or selector
      let el = null;
      if (productIds.length > 0) {
        el = document.querySelector(`[data-product-id="${productIds[0]}"]`) ||
             document.querySelector(`.product-card`);
      }
      
      if (!el) {
        el = document.querySelector('.product-grid') || document.querySelector('#products-section');
      }

      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        this.highlightElements(productIds);
      } else {
        window.scrollTo({ top: 500, behavior: 'smooth' });
      }
    }, 300);
  }

  // 2. Highlight targeted product cards with luxury glowing ring
  highlightElements(productIds = []) {
    productIds.forEach(id => {
      const card = document.querySelector(`[data-product-id="${id}"]`);
      if (card) {
        card.style.transition = 'all 0.5s ease';
        card.style.boxShadow = '0 0 35px rgba(201, 169, 110, 0.85)';
        card.style.transform = 'scale(1.04)';
        
        setTimeout(() => {
          card.style.boxShadow = '';
          card.style.transform = '';
        }, 3500);
      }
    });
  }

  // 3. Navigate to a product detail view
  showProductPage(productId) {
    if (this.navigateFn && productId) {
      this.navigateFn(`/product/${productId}`);
    }
  }

  // 4. Add item to cart
  addToCartItem(product, quantity = 1, shade = null) {
    if (this.cartContext && this.cartContext.addToCart) {
      this.cartContext.addToCart(product, quantity, shade);
      return true;
    }
    return false;
  }

  // 5. Remove item from cart
  removeFromCartItem(cartKeyOrId) {
    if (this.cartContext && this.cartContext.removeFromCart) {
      this.cartContext.removeFromCart(cartKeyOrId);
      return true;
    }
    return false;
  }

  // 6. Update item quantity in cart
  updateCartQuantity(cartKeyOrId, qty) {
    if (this.cartContext && this.cartContext.updateQty) {
      this.cartContext.updateQty(cartKeyOrId, qty);
      return true;
    }
    return false;
  }

  // 7. Open Cart Drawer / Cart Page
  openCart() {
    if (this.navigateFn) {
      this.navigateFn('/cart');
    }
  }

  // 8. Open Checkout Flow
  proceedToCheckout() {
    if (this.navigateFn) {
      this.navigateFn('/checkout');
    }
  }

  // 9. Track Order Page
  openOrderTracking(orderId = '') {
    if (this.navigateFn) {
      this.navigateFn(orderId ? `/track-order?id=${orderId}` : '/track-order');
    }
  }

  // 10. Filter Shop Page
  applyShopFilter(category, concern, maxPrice) {
    let url = '/shop';
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (concern) params.set('concern', concern);
    if (maxPrice) params.set('maxPrice', maxPrice);

    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;

    if (this.navigateFn) {
      this.navigateFn(url);
    }
  }
}

export const websiteController = new WebsiteController();
export default websiteController;
