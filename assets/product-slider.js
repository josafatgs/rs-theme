/**
 * Product Image Slider
 * 
 * Handles interactive image slider functionality for product pages including:
 * - Auto-play with 5-second intervals
 * - Manual navigation (arrows, thumbnails, dots)
 * - Touch/swipe support for mobile devices
 * - Pause on user interaction
 * 
 * Requirements: 1.2, 1.3, 1.4, 5.4, 5.5
 */

class ProductSlider {
  constructor(element) {
    this.slider = element;
    this.container = this.slider.querySelector('.slider-container');
    this.slides = this.slider.querySelectorAll('.slider-slide');
    this.thumbnails = this.slider.querySelectorAll('.thumbnail-item');
    this.dots = this.slider.querySelectorAll('.dot-item');
    this.prevBtn = this.slider.querySelector('.slider-prev');
    this.nextBtn = this.slider.querySelector('.slider-next');
    
    this.currentIndex = 0;
    this.imageCount = parseInt(this.slider.dataset.imageCount) || 0;
    this.autoPlayInterval = null;
    this.autoPlayDelay = 5000; // 5 seconds
    this.isAutoPlaying = true;
    this.isPaused = false;
    
    // Touch/swipe properties
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.touchStartY = 0;
    this.touchEndY = 0;
    this.minSwipeDistance = 50;
    this.isScrolling = false;
    
    // Lazy loading properties
    this.intersectionObserver = null;
    this.preloadedImages = new Set();
    this.isLowBandwidth = this.detectLowBandwidth();
    
    // Performance optimization properties
    this.resizeTimeout = null;
    this.touchThrottleTimeout = null;
    this.scrollThrottleTimeout = null;
    this.lastTouchTime = 0;
    this.touchThrottleDelay = 16; // ~60fps
    
    this.init();
  }
  
  init() {
    // Initialize lazy loading for thumbnails
    this.initLazyLoading();
    
    // Preload the first few images for better UX
    this.preloadInitialImages();
    
    if (this.imageCount <= 1) {
      // No need for slider functionality with single image
      return;
    }
    
    this.bindEvents();
    this.startAutoPlay();
  }
  
  bindEvents() {
    // Navigation buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.goToPrevious());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.goToNext());
    }
    
    // Thumbnail navigation
    this.thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener('click', () => this.goToSlide(index));
    });
    
    // Dot navigation
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });
    
    // Touch events for mobile swipe (throttled for performance)
    this.container.addEventListener('touchstart', (e) => this.handleTouchStartThrottled(e), { passive: true });
    this.container.addEventListener('touchmove', (e) => this.handleTouchMoveThrottled(e), { passive: false });
    this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
    
    // Mouse events for desktop drag (optional enhancement)
    this.container.addEventListener('mouseenter', () => this.pauseAutoPlay());
    this.container.addEventListener('mouseleave', () => this.resumeAutoPlay());
    
    // Pause auto-play on focus (accessibility)
    this.slider.addEventListener('focusin', () => this.pauseAutoPlay());
    this.slider.addEventListener('focusout', () => this.resumeAutoPlay());
    
    // Handle visibility change (pause when tab is not active)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAutoPlay();
      } else {
        this.resumeAutoPlay();
      }
    });
    
    // Add debounced resize handler
    window.addEventListener('resize', () => this.handleResize(), { passive: true });
  }
  
  goToSlide(index) {
    if (index === this.currentIndex || index < 0 || index >= this.imageCount) {
      return;
    }
    
    this.pauseAutoPlayTemporarily();
    this.updateSlide(index);
  }
  
  goToNext() {
    const nextIndex = (this.currentIndex + 1) % this.imageCount;
    this.goToSlide(nextIndex);
  }
  
  goToPrevious() {
    const prevIndex = (this.currentIndex - 1 + this.imageCount) % this.imageCount;
    this.goToSlide(prevIndex);
  }
  
  updateSlide(newIndex) {
    // Use optimized update method to minimize reflows and repaints
    this.updateSlideOptimized(newIndex);
  }
  
  preloadNextImage() {
    const nextIndex = (this.currentIndex + 1) % this.imageCount;
    const nextSlide = this.slides[nextIndex];
    if (nextSlide) {
      const img = nextSlide.querySelector('img');
      if (img && !this.preloadedImages.has(img.src)) {
        this.preloadImage(img);
      }
    }
    
    // Also preload the previous image for smooth navigation
    const prevIndex = (this.currentIndex - 1 + this.imageCount) % this.imageCount;
    const prevSlide = this.slides[prevIndex];
    if (prevSlide) {
      const img = prevSlide.querySelector('img');
      if (img && !this.preloadedImages.has(img.src)) {
        this.preloadImage(img);
      }
    }
  }
  
  /**
   * Initialize lazy loading for thumbnail images using Intersection Observer
   * Requirements: 5.3
   */
  initLazyLoading() {
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: load all thumbnails immediately
      this.loadAllThumbnails();
      return;
    }
    
    // Create intersection observer for thumbnails
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          this.loadThumbnailImage(img);
          this.intersectionObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px', // Start loading 50px before the image comes into view
      threshold: 0.1
    });
    
    // Observe all thumbnail images
    this.thumbnails.forEach(thumbnail => {
      const img = thumbnail.querySelector('img');
      if (img && img.loading === 'lazy') {
        this.intersectionObserver.observe(img);
      }
    });
  }
  
  /**
   * Load thumbnail image with appropriate size based on screen size
   * Requirements: 5.3, 1.6 (error handling)
   */
  loadThumbnailImage(img) {
    if (!img.dataset.src && img.src && !img.src.includes('data:image/svg+xml')) {
      // Image already has src, just ensure it's loaded
      return;
    }
    
    // Determine appropriate thumbnail size based on screen width
    const screenWidth = window.innerWidth;
    let thumbnailSize = 120; // default
    
    if (screenWidth <= 480) {
      thumbnailSize = 80; // smaller thumbnails on mobile
    } else if (screenWidth <= 768) {
      thumbnailSize = 100; // medium thumbnails on tablet
    }
    
    // Update src with appropriate size
    if (img.dataset.originalSrc) {
      const newSrc = img.dataset.originalSrc.replace(/width=\d+/, `width=${thumbnailSize}`);
      img.src = newSrc;
    }
    
    // Add loading class for visual feedback
    img.classList.add('loading');
    
    img.onload = () => {
      img.classList.remove('loading', 'error');
      img.classList.add('loaded');
      // Remove any error state from parent
      img.parentElement.classList.remove('thumbnail-error');
    };
    
    img.onerror = () => {
      img.classList.remove('loading');
      img.classList.add('error');
      img.parentElement.classList.add('thumbnail-error');
      
      // Try to reload with a different size first
      if (!img.dataset.retryAttempted) {
        img.dataset.retryAttempted = 'true';
        setTimeout(() => {
          const fallbackSize = Math.max(60, thumbnailSize - 20);
          const fallbackSrc = img.dataset.originalSrc.replace(/width=\d+/, `width=${fallbackSize}`);
          img.src = fallbackSrc;
        }, 1000);
        return;
      }
      
      // Set fallback placeholder after retry failed
      img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjkwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIgcnk9IjIiIHN0cm9rZT0iI2NjYyIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iOC41IiBjeT0iOC41IiByPSIxLjUiIHN0cm9rZT0iI2NjYyIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBvbHlsaW5lIHBvaW50cz0iMjEsMTUgMTYsMTAgNSwyMSIgc3Ryb2tlPSIjY2NjIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIxMiIgeT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI4IiBmaWxsPSIjY2NjIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5FcnJvcjwvdGV4dD48L3N2Zz4=';
      
      // Log error for debugging
      console.warn('Failed to load thumbnail image:', img.dataset.originalSrc || img.src);
    };
  }
  
  /**
   * Fallback method to load all thumbnails when Intersection Observer is not supported
   */
  loadAllThumbnails() {
    this.thumbnails.forEach(thumbnail => {
      const img = thumbnail.querySelector('img');
      if (img) {
        this.loadThumbnailImage(img);
      }
    });
  }
  
  /**
   * Preload initial images for better user experience
   * Requirements: 5.3
   */
  preloadInitialImages() {
    // Always preload the first image (should already be eager)
    if (this.slides[0]) {
      const firstImg = this.slides[0].querySelector('img');
      if (firstImg) {
        this.preloadImage(firstImg);
      }
    }
    
    // Preload second image if not on low bandwidth
    if (!this.isLowBandwidth && this.slides[1]) {
      const secondImg = this.slides[1].querySelector('img');
      if (secondImg) {
        this.preloadImage(secondImg);
      }
    }
  }
  
  /**
   * Preload a specific image with error handling
   * Requirements: 1.6 (error handling)
   */
  preloadImage(img) {
    if (this.preloadedImages.has(img.src)) {
      return;
    }
    
    // Create a new image element for preloading
    const preloadImg = new Image();
    preloadImg.onload = () => {
      this.preloadedImages.add(img.src);
      // Update the original image loading attribute
      if (img.loading === 'lazy') {
        img.loading = 'eager';
      }
      // Remove any error states from the original image
      img.classList.remove('image-error');
      if (img.parentElement) {
        img.parentElement.classList.remove('slide-error');
      }
    };
    
    preloadImg.onerror = () => {
      console.warn('Failed to preload image:', img.src);
      // Try with a smaller size as fallback
      this.handleImagePreloadError(img, preloadImg);
    };
    
    // Start preloading with appropriate size based on screen
    const screenWidth = window.innerWidth;
    let imageWidth = 800; // default
    
    if (screenWidth <= 480) {
      imageWidth = 400; // smaller images on mobile
    } else if (screenWidth <= 768) {
      imageWidth = 600; // medium images on tablet
    }
    
    // Update src with appropriate size if it contains width parameter
    let preloadSrc = img.src;
    if (preloadSrc.includes('width=')) {
      preloadSrc = preloadSrc.replace(/width=\d+/, `width=${imageWidth}`);
    }
    
    preloadImg.src = preloadSrc;
  }
  
  /**
   * Handle image preload errors with fallback strategies
   * Requirements: 1.6
   */
  handleImagePreloadError(originalImg, preloadImg) {
    // Try with smaller size first
    if (!preloadImg.dataset.retryAttempted) {
      preloadImg.dataset.retryAttempted = 'true';
      
      setTimeout(() => {
        let fallbackSrc = originalImg.src;
        if (fallbackSrc.includes('width=')) {
          // Try with 50% smaller size
          const currentWidth = parseInt(fallbackSrc.match(/width=(\d+)/)?.[1] || '800');
          const fallbackWidth = Math.max(200, Math.floor(currentWidth * 0.5));
          fallbackSrc = fallbackSrc.replace(/width=\d+/, `width=${fallbackWidth}`);
        }
        
        preloadImg.onload = () => {
          this.preloadedImages.add(originalImg.src);
          originalImg.classList.remove('image-error');
          if (originalImg.parentElement) {
            originalImg.parentElement.classList.remove('slide-error');
          }
        };
        
        preloadImg.onerror = () => {
          // Final fallback - mark image as problematic
          originalImg.classList.add('image-error');
          if (originalImg.parentElement) {
            originalImg.parentElement.classList.add('slide-error');
          }
          console.error('Image completely failed to load:', originalImg.src);
        };
        
        preloadImg.src = fallbackSrc;
      }, 1500);
    }
  }
  
  /**
   * Detect if user is on a slow connection
   */
  detectLowBandwidth() {
    // Check for Network Information API
    if ('connection' in navigator) {
      const connection = navigator.connection;
      // Consider 2G or slow-2g as low bandwidth
      return connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g';
    }
    
    // Fallback: assume good connection
    return false;
  }
  
  /**
   * Debounced resize handler to optimize performance
   * Requirements: 5.4, 5.5
   */
  handleResize() {
    // Clear existing timeout
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    
    // Debounce resize events to avoid excessive recalculations
    this.resizeTimeout = setTimeout(() => {
      this.optimizeForScreenSize();
      this.updateThumbnailSizes();
    }, 250); // 250ms debounce delay
  }
  
  /**
   * Optimize slider behavior based on current screen size
   */
  optimizeForScreenSize() {
    const screenWidth = window.innerWidth;
    
    // Adjust auto-play delay based on screen size
    if (screenWidth <= 480) {
      // Slower auto-play on mobile to give users more time
      this.autoPlayDelay = 7000;
    } else {
      // Standard auto-play on desktop
      this.autoPlayDelay = 5000;
    }
    
    // Restart auto-play with new delay if it's currently running
    if (this.autoPlayInterval) {
      this.stopAutoPlay();
      this.startAutoPlay();
    }
  }
  
  /**
   * Update thumbnail sizes based on current screen size
   */
  updateThumbnailSizes() {
    const screenWidth = window.innerWidth;
    let thumbnailSize = 120;
    
    if (screenWidth <= 480) {
      thumbnailSize = 80;
    } else if (screenWidth <= 768) {
      thumbnailSize = 100;
    }
    
    // Update thumbnail images that are already loaded
    this.thumbnails.forEach(thumbnail => {
      const img = thumbnail.querySelector('img');
      if (img && img.classList.contains('loaded') && img.src.includes('width=')) {
        const newSrc = img.src.replace(/width=\d+/, `width=${thumbnailSize}`);
        if (newSrc !== img.src) {
          img.src = newSrc;
        }
      }
    });
  }
  
  /**
   * Throttled touch handler to optimize touch performance
   * Requirements: 5.4, 5.5
   */
  handleTouchStartThrottled(e) {
    const now = Date.now();
    
    // Throttle touch events to avoid excessive processing
    if (now - this.lastTouchTime < this.touchThrottleDelay) {
      return;
    }
    
    this.lastTouchTime = now;
    this.handleTouchStart(e);
  }
  
  /**
   * Throttled touch move handler
   */
  handleTouchMoveThrottled(e) {
    const now = Date.now();
    
    if (now - this.lastTouchTime < this.touchThrottleDelay) {
      return;
    }
    
    this.lastTouchTime = now;
    this.handleTouchMove(e);
  }
  
  /**
   * Optimized DOM update method to minimize reflows and repaints
   * Requirements: 5.4, 5.5
   */
  updateSlideOptimized(newIndex) {
    // Batch DOM updates to minimize reflows
    const updates = [];
    
    // Prepare all class changes
    updates.push(() => {
      this.slides[this.currentIndex].classList.remove('active');
      this.slides[newIndex].classList.add('active');
    });
    
    if (this.thumbnails[this.currentIndex]) {
      updates.push(() => {
        this.thumbnails[this.currentIndex].classList.remove('active');
        this.thumbnails[newIndex].classList.add('active');
      });
    }
    
    if (this.dots[this.currentIndex]) {
      updates.push(() => {
        this.dots[this.currentIndex].classList.remove('active');
        this.dots[newIndex].classList.add('active');
      });
    }
    
    // Execute all updates in a single animation frame
    requestAnimationFrame(() => {
      updates.forEach(update => update());
      this.currentIndex = newIndex;
      
      // Preload next image after DOM updates are complete
      requestAnimationFrame(() => {
        this.preloadNextImage();
      });
    });
  }
  
  /**
   * Throttled scroll handler for any scroll-based functionality
   */
  handleScrollThrottled(callback) {
    if (this.scrollThrottleTimeout) {
      return;
    }
    
    this.scrollThrottleTimeout = setTimeout(() => {
      callback();
      this.scrollThrottleTimeout = null;
    }, 16); // ~60fps
  }
  
  startAutoPlay() {
    if (this.imageCount <= 1 || !this.isAutoPlaying) {
      return;
    }
    
    this.autoPlayInterval = setInterval(() => {
      if (!this.isPaused) {
        this.goToNext();
      }
    }, this.autoPlayDelay);
  }
  
  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
  
  pauseAutoPlay() {
    this.isPaused = true;
  }
  
  resumeAutoPlay() {
    this.isPaused = false;
  }
  
  pauseAutoPlayTemporarily() {
    this.pauseAutoPlay();
    // Resume after 3 seconds of no interaction
    setTimeout(() => {
      this.resumeAutoPlay();
    }, 3000);
  }
  
  // Touch event handlers for mobile swipe
  handleTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
    this.isScrolling = false;
    this.pauseAutoPlay();
  }
  
  handleTouchMove(e) {
    if (!this.touchStartX || !this.touchStartY) {
      return;
    }
    
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const deltaX = Math.abs(touchX - this.touchStartX);
    const deltaY = Math.abs(touchY - this.touchStartY);
    
    // Determine if user is scrolling vertically or swiping horizontally
    if (!this.isScrolling) {
      this.isScrolling = deltaY > deltaX;
    }
    
    // Prevent horizontal scroll if swiping horizontally
    if (!this.isScrolling && deltaX > 10) {
      e.preventDefault();
    }
  }
  
  handleTouchEnd(e) {
    if (!this.touchStartX || this.isScrolling) {
      this.resumeAutoPlay();
      return;
    }
    
    this.touchEndX = e.changedTouches[0].clientX;
    this.touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = this.touchStartX - this.touchEndX;
    const deltaY = Math.abs(this.touchStartY - this.touchEndY);
    
    // Only process swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > this.minSwipeDistance && Math.abs(deltaX) > deltaY) {
      if (deltaX > 0) {
        // Swiped left - go to next
        this.goToNext();
      } else {
        // Swiped right - go to previous
        this.goToPrevious();
      }
    }
    
    // Reset touch coordinates
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.touchStartY = 0;
    this.touchEndY = 0;
    
    this.resumeAutoPlay();
  }
  
  // Public method to update slider when variant changes
  updateForVariant(variantImages) {
    // This method can be called from variant selector to update images
    // Implementation would depend on how variant images are structured
    this.stopAutoPlay();
    
    // Handle case when no images are available for variant
    if (!variantImages || variantImages.length === 0) {
      this.showNoImagesState();
      return;
    }
    
    // Update slides, thumbnails, etc. based on new images
    this.updateSliderImages(variantImages);
    
    // Restart auto-play only if there are multiple images
    if (variantImages.length > 1) {
      this.startAutoPlay();
    }
  }
  
  /**
   * Show no images state when variant has no images
   * Requirements: 1.6 (error handling)
   */
  showNoImagesState() {
    const container = this.slider.querySelector('.slider-container');
    if (!container) return;
    
    // Clear existing slides
    container.innerHTML = '';
    
    // Create no images placeholder
    const noImagesSlide = document.createElement('div');
    noImagesSlide.className = 'slider-slide active slider-slide--no-images';
    noImagesSlide.innerHTML = `
      <div class="slider-placeholder">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
          <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="2"/>
          <polyline points="21,15 16,10 5,21" stroke="currentColor" stroke-width="2"/>
        </svg>
        <p>No hay imágenes disponibles para esta opción</p>
      </div>
    `;
    
    container.appendChild(noImagesSlide);
    
    // Hide navigation controls
    const prevBtn = this.slider.querySelector('.slider-prev');
    const nextBtn = this.slider.querySelector('.slider-next');
    const thumbnails = this.slider.querySelector('.slider-thumbnails');
    const dots = this.slider.querySelector('.slider-dots');
    
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (thumbnails) thumbnails.style.display = 'none';
    if (dots) dots.style.display = 'none';
    
    // Update image count
    this.imageCount = 0;
    this.currentIndex = 0;
  }
  
  /**
   * Update slider with new images
   */
  updateSliderImages(images) {
    // This would be implemented based on the specific image structure
    // For now, we'll just update the image count and restart functionality
    this.imageCount = images.length;
    this.currentIndex = 0;
    
    // Show navigation controls if multiple images
    if (this.imageCount > 1) {
      const prevBtn = this.slider.querySelector('.slider-prev');
      const nextBtn = this.slider.querySelector('.slider-next');
      const thumbnails = this.slider.querySelector('.slider-thumbnails');
      const dots = this.slider.querySelector('.slider-dots');
      
      if (prevBtn) prevBtn.style.display = '';
      if (nextBtn) nextBtn.style.display = '';
      if (thumbnails) thumbnails.style.display = '';
      if (dots) dots.style.display = '';
    }
  }
  
  // Cleanup method
  destroy() {
    this.stopAutoPlay();
    
    // Clean up intersection observer
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }
    
    // Clear preloaded images set
    this.preloadedImages.clear();
    
    // Clear performance optimization timeouts
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = null;
    }
    
    if (this.touchThrottleTimeout) {
      clearTimeout(this.touchThrottleTimeout);
      this.touchThrottleTimeout = null;
    }
    
    if (this.scrollThrottleTimeout) {
      clearTimeout(this.scrollThrottleTimeout);
      this.scrollThrottleTimeout = null;
    }
    
    // Remove event listeners
    window.removeEventListener('resize', this.handleResize);
  }
}

// Initialize sliders when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  const sliders = document.querySelectorAll('.product-slider');
  
  sliders.forEach(slider => {
    // Only initialize if slider has images
    const imageCount = parseInt(slider.dataset.imageCount) || 0;
    if (imageCount > 0) {
      const sliderInstance = new ProductSlider(slider);
      
      // Initial screen size optimization
      sliderInstance.optimizeForScreenSize();
    }
  });
});

/**
 * Product Variant Selector
 * 
 * Handles variant selection functionality including:
 * - Price updates when variant changes
 * - Metafields updates based on selected variant
 * - Image slider updates for variant-specific images
 * 
 * Requirements: 3.2, 3.3, 3.4
 */

class ProductVariantSelector {
  constructor(element) {
    this.selector = element;
    this.productId = this.selector.dataset.productId;
    this.variantInputs = this.selector.querySelectorAll('.variant-input');
    this.hiddenVariantInput = document.getElementById('selected-variant-id');
    
    // Elements to update when variant changes
    this.priceElement = document.querySelector('.product-price .price');
    this.metafieldsContainer = document.querySelector('.property-details');
    this.productSlider = document.querySelector('.product-slider');
    
    // Store original product data
    this.originalPrice = this.priceElement ? this.priceElement.textContent : '';
    this.originalMetafields = this.getMetafieldsData();
    
    // Performance optimization properties
    this.updateTimeout = null;
    this.pendingUpdates = new Set();
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.updateSelectedVariant();
  }
  
  /**
   * Cleanup method for variant selector
   */
  destroy() {
    // Clear any pending updates
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
      this.updateTimeout = null;
    }
    
    // Clear pending updates set
    this.pendingUpdates.clear();
  }
  
  bindEvents() {
    this.variantInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.handleVariantChange(e.target);
        }
      });
    });
  }
  
  handleVariantChange(selectedInput) {
    const variantId = selectedInput.dataset.variantId;
    const variantPrice = selectedInput.dataset.variantPrice;
    const variantTitle = selectedInput.dataset.variantTitle;
    const variantImage = selectedInput.dataset.variantImage;
    const variantAvailable = selectedInput.dataset.variantAvailable === 'true';
    const variantInventory = parseInt(selectedInput.dataset.variantInventory || '0');
    
    // Validate variant availability before processing
    if (!this.validateVariantSelection(selectedInput, variantId, variantAvailable, variantInventory)) {
      return;
    }
    
    // Use optimized batch update to minimize DOM manipulation
    this.batchVariantUpdates(variantId, {
      price: variantPrice,
      title: variantTitle,
      image: variantImage,
      available: variantAvailable,
      inventory: variantInventory
    });
  }
  
  /**
   * Validate variant selection and show appropriate error messages
   * Requirements: 1.6 (error handling)
   */
  validateVariantSelection(selectedInput, variantId, variantAvailable, variantInventory) {
    // Check if variant is actually available
    if (!variantAvailable) {
      this.showVariantError('Esta opción no está disponible actualmente.');
      // Revert to previously selected variant
      this.revertToPreviousVariant();
      return false;
    }
    
    // Check inventory if applicable
    if (variantInventory === 0 && !selectedInput.dataset.allowBackorders) {
      this.showVariantError('Esta opción está agotada.');
      this.revertToPreviousVariant();
      return false;
    }
    
    // Clear any previous error messages
    this.clearVariantError();
    return true;
  }
  
  /**
   * Show variant error message to user
   */
  showVariantError(message) {
    // Remove any existing error message
    this.clearVariantError();
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'variant-error-message';
    errorElement.textContent = message;
    errorElement.setAttribute('role', 'alert');
    errorElement.setAttribute('aria-live', 'polite');
    
    // Insert error message after variant selector
    this.selector.insertAdjacentElement('afterend', errorElement);
    
    // Auto-hide error message after 5 seconds
    setTimeout(() => {
      this.clearVariantError();
    }, 5000);
  }
  
  /**
   * Clear variant error message
   */
  clearVariantError() {
    const existingError = document.querySelector('.variant-error-message');
    if (existingError) {
      existingError.remove();
    }
  }
  
  /**
   * Revert to previously selected variant
   */
  revertToPreviousVariant() {
    const currentlyChecked = this.selector.querySelector('.variant-input:checked');
    if (currentlyChecked) {
      currentlyChecked.checked = false;
    }
    
    // Find first available variant and select it
    const availableVariant = this.selector.querySelector('.variant-input[data-variant-available="true"]:not(:disabled)');
    if (availableVariant) {
      availableVariant.checked = true;
      // Don't trigger change event to avoid recursion
      this.updateSelectedVariant();
    }
  }
  
  /**
   * Batch variant updates to minimize DOM reflows and repaints
   * Requirements: 5.4, 5.5
   */
  batchVariantUpdates(variantId, variantData) {
    // Clear any pending update
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
    
    // Add updates to pending set
    this.pendingUpdates.add({
      type: 'hiddenInput',
      variantId: variantId
    });
    
    this.pendingUpdates.add({
      type: 'price',
      value: variantData.price
    });
    
    this.pendingUpdates.add({
      type: 'metafields',
      variantId: variantId
    });
    
    if (variantData.image) {
      this.pendingUpdates.add({
        type: 'sliderImages',
        variantId: variantId,
        image: variantData.image
      });
    }
    
    this.pendingUpdates.add({
      type: 'url',
      variantId: variantId
    });
    
    this.pendingUpdates.add({
      type: 'event',
      variantId: variantId,
      variantData: variantData
    });
    
    // Batch execute all updates in next animation frame
    this.updateTimeout = setTimeout(() => {
      requestAnimationFrame(() => {
        this.executePendingUpdates();
      });
    }, 10); // Small delay to batch rapid changes
  }
  
  /**
   * Execute all pending updates in a single batch
   */
  executePendingUpdates() {
    const updates = Array.from(this.pendingUpdates);
    this.pendingUpdates.clear();
    
    // Group updates by type to minimize DOM access
    const updatesByType = updates.reduce((acc, update) => {
      if (!acc[update.type]) acc[update.type] = [];
      acc[update.type].push(update);
      return acc;
    }, {});
    
    // Execute updates in optimal order
    if (updatesByType.hiddenInput) {
      updatesByType.hiddenInput.forEach(update => {
        if (this.hiddenVariantInput) {
          this.hiddenVariantInput.value = update.variantId;
        }
      });
    }
    
    if (updatesByType.price) {
      updatesByType.price.forEach(update => {
        this.updatePriceOptimized(update.value);
      });
    }
    
    if (updatesByType.metafields) {
      updatesByType.metafields.forEach(update => {
        this.updateMetafieldsOptimized(update.variantId);
      });
    }
    
    if (updatesByType.sliderImages) {
      updatesByType.sliderImages.forEach(update => {
        this.updateSliderImages(update.variantId, update.image);
      });
    }
    
    if (updatesByType.url) {
      updatesByType.url.forEach(update => {
        this.updateURL(update.variantId);
      });
    }
    
    if (updatesByType.event) {
      updatesByType.event.forEach(update => {
        this.dispatchVariantChangeEvent(update.variantId, update.variantData);
      });
    }
  }
  
  updatePrice(newPrice) {
    this.updatePriceOptimized(newPrice);
  }
  
  /**
   * Optimized price update to minimize DOM manipulation
   */
  updatePriceOptimized(newPrice) {
    if (this.priceElement && newPrice) {
      // Format price as money (assuming Shopify money format)
      const formattedPrice = this.formatMoney(parseInt(newPrice));
      
      // Only update if price actually changed
      if (this.priceElement.textContent !== formattedPrice) {
        this.priceElement.textContent = formattedPrice;
        
        // Add visual feedback for price change
        this.priceElement.classList.add('price-updating');
        
        // Use requestAnimationFrame for smooth animation
        requestAnimationFrame(() => {
          setTimeout(() => {
            this.priceElement.classList.remove('price-updating');
          }, 300);
        });
      }
    }
  }
  
  updateMetafields(variantId) {
    this.updateMetafieldsOptimized(variantId);
  }
  
  /**
   * Optimized metafields update to minimize DOM queries
   */
  updateMetafieldsOptimized(variantId) {
    // This would typically fetch variant-specific metafields via AJAX
    // For now, we'll implement a basic version that works with data attributes
    
    const selectedInput = this.selector.querySelector(`[data-variant-id="${variantId}"]`);
    if (!selectedInput) return;
    
    // Check if variant has specific metafields data
    const variantMetafields = this.getVariantMetafields(selectedInput);
    
    if (variantMetafields && this.metafieldsContainer) {
      this.updateMetafieldsDisplayOptimized(variantMetafields);
    }
  }
  
  getVariantMetafields(variantInput) {
    // Extract metafields from data attributes
    const metafields = {};
    
    // Check for common real estate metafields
    const metafieldKeys = ['bedrooms', 'bathrooms', 'square-meters', 'location', 'property-type', 'parking-spaces'];
    
    metafieldKeys.forEach(key => {
      const value = variantInput.dataset[`metafield${key.replace(/-/g, '').replace(/^\w/, c => c.toUpperCase())}`];
      if (value) {
        metafields[key] = value;
      }
    });
    
    return Object.keys(metafields).length > 0 ? metafields : null;
  }
  
  updateMetafieldsDisplay(metafields) {
    this.updateMetafieldsDisplayOptimized(metafields);
  }
  
  /**
   * Optimized metafields display update
   */
  updateMetafieldsDisplayOptimized(metafields) {
    // Batch DOM queries and updates
    const elementsToUpdate = [];
    
    Object.keys(metafields).forEach(key => {
      const element = this.metafieldsContainer.querySelector(`[data-metafield="${key}"] .detail-value`);
      if (element && element.textContent !== metafields[key]) {
        elementsToUpdate.push({
          element: element,
          value: metafields[key]
        });
      }
    });
    
    // Batch update all elements
    if (elementsToUpdate.length > 0) {
      requestAnimationFrame(() => {
        elementsToUpdate.forEach(({ element, value }) => {
          element.textContent = value;
          element.classList.add('value-updating');
        });
        
        // Remove updating class after animation
        setTimeout(() => {
          elementsToUpdate.forEach(({ element }) => {
            element.classList.remove('value-updating');
          });
        }, 300);
      });
    }
  }
  
  updateSliderImages(variantId, variantImage) {
    // If product slider exists, update it with variant-specific images
    if (this.productSlider && window.ProductSlider) {
      // This is a simplified version - in a real implementation,
      // you might fetch variant-specific images via AJAX
      
      // For now, we'll just update the main image if variant has a featured image
      const mainSlide = this.productSlider.querySelector('.slider-slide.active img');
      if (mainSlide && variantImage) {
        mainSlide.src = variantImage;
        mainSlide.alt = `Imagen de variante: ${variantId}`;
      }
    }
  }
  
  updateURL(variantId) {
    // Update URL with variant parameter for sharing/bookmarking
    if (history.replaceState) {
      const url = new URL(window.location);
      url.searchParams.set('variant', variantId);
      history.replaceState(null, '', url);
    }
  }
  
  dispatchVariantChangeEvent(variantId, variantData) {
    // Dispatch custom event for other components to listen to
    const event = new CustomEvent('variantChanged', {
      detail: {
        variantId: variantId,
        variantData: variantData
      }
    });
    
    document.dispatchEvent(event);
  }
  
  formatMoney(cents) {
    // Basic money formatting - in real Shopify themes, use Shopify.formatMoney
    const dollars = (cents / 100).toFixed(2);
    return `$${dollars.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }
  
  getMetafieldsData() {
    // Store original metafields data for fallback
    const data = {};
    if (this.metafieldsContainer) {
      const metafieldElements = this.metafieldsContainer.querySelectorAll('[data-metafield]');
      metafieldElements.forEach(element => {
        const key = element.dataset.metafield;
        const valueElement = element.querySelector('.detail-value');
        if (valueElement) {
          data[key] = valueElement.textContent;
        }
      });
    }
    return data;
  }
  
  updateSelectedVariant() {
    // Ensure the correct variant is selected based on URL or default
    const urlParams = new URLSearchParams(window.location.search);
    const variantParam = urlParams.get('variant');
    
    if (variantParam) {
      const variantInput = this.selector.querySelector(`[data-variant-id="${variantParam}"]`);
      if (variantInput && !variantInput.disabled) {
        variantInput.checked = true;
        this.handleVariantChange(variantInput);
      }
    }
  }
}

// Initialize variant selectors when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  const variantSelectors = document.querySelectorAll('.variant-selector');
  
  variantSelectors.forEach(selector => {
    const selectorInstance = new ProductVariantSelector(selector);
    
    // Add global error handling for variant changes
    selector.addEventListener('variantError', function(e) {
      console.warn('Variant selection error:', e.detail);
    });
  });
  
  // Initialize global image error handling
  initializeImageErrorHandling();
});

/**
 * Initialize global image error handling for all product images
 * Requirements: 1.6 (error handling)
 */
function initializeImageErrorHandling() {
  // Handle main slider images
  const sliderImages = document.querySelectorAll('.slider-image');
  sliderImages.forEach(img => {
    if (!img.onerror) {
      img.onerror = function() {
        this.classList.add('image-error');
        if (this.parentElement) {
          this.parentElement.classList.add('slide-error');
        }
        
        // Try to reload with smaller size
        if (!this.dataset.retryAttempted && this.dataset.originalSrc) {
          this.dataset.retryAttempted = 'true';
          setTimeout(() => {
            const fallbackSrc = this.dataset.originalSrc.replace(/width=\d+/, 'width=400');
            this.src = fallbackSrc;
          }, 1000);
        }
      };
    }
  });
  
  // Handle thumbnail images
  const thumbnailImages = document.querySelectorAll('.thumbnail-image');
  thumbnailImages.forEach(img => {
    if (!img.onerror) {
      img.onerror = function() {
        this.classList.add('thumbnail-error');
        if (this.parentElement) {
          this.parentElement.classList.add('thumbnail-error');
        }
      };
    }
  });
}

// Export for use in other scripts if needed
window.ProductSlider = ProductSlider;
window.ProductVariantSelector = ProductVariantSelector;or');
  
  variantSelectors.forEach(selector => {
    new ProductVariantSelector(selector);
  });
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ProductSlider, ProductVariantSelector };
}     
   }
      });
    }
    
    if (updatesByType.price) {
      updatesByType.price.forEach(update => {
        this.updatePriceOptimized(update.value);
      });
    }
    
    if (updatesByType.metafields) {
      updatesByType.metafields.forEach(update => {
        this.updateMetafieldsOptimized(update.variantId);
      });
    }
    
    if (updatesByType.sliderImages) {
      updatesByType.sliderImages.forEach(update => {
        this.updateSliderImages(update.variantId, update.image);
      });
    }
    
    if (updatesByType.url) {
      updatesByType.url.forEach(update => {
        this.updateURL(update.variantId);
      });
    }
    
    if (updatesByType.event) {
      updatesByType.event.forEach(update => {
        this.dispatchVariantChangeEvent(update.variantId, update.variantData);
      });
    }
  }
  
  updatePrice(newPrice) {
    this.updatePriceOptimized(newPrice);
  }
  
  /**
   * Optimized price update to minimize DOM manipulation
   */
  updatePriceOptimized(newPrice) {
    if (this.priceElement && newPrice) {
      // Format price as money (assuming Shopify money format)
      const formattedPrice = this.formatMoney(parseInt(newPrice));
      
      // Only update if price actually changed
      if (this.priceElement.textContent !== formattedPrice) {
        this.priceElement.textContent = formattedPrice;
        
        // Add visual feedback for price change
        this.priceElement.classList.add('price-updating');
        
        // Use requestAnimationFrame for smooth animation
        requestAnimationFrame(() => {
          setTimeout(() => {
            this.priceElement.classList.remove('price-updating');
          }, 300);
        });
      }
    }
  }
  
  updateMetafields(variantId) {
    this.updateMetafieldsOptimized(variantId);
  }
  
  /**
   * Optimized metafields update to minimize DOM queries
   */
  updateMetafieldsOptimized(variantId) {
    // This would typically fetch variant-specific metafields via AJAX
    // For now, we'll implement a basic version that works with data attributes
    
    const selectedInput = this.selector.querySelector(`[data-variant-id="${variantId}"]`);
    if (!selectedInput) return;
    
    // Check if variant has specific metafields data
    const variantMetafields = this.getVariantMetafields(selectedInput);
    
    if (variantMetafields && this.metafieldsContainer) {
      this.updateMetafieldsDisplayOptimized(variantMetafields);
    }
  }
  
  getVariantMetafields(variantInput) {
    // Extract metafields from data attributes
    const metafields = {};
    
    // Check for common real estate metafields
    const metafieldKeys = ['bedrooms', 'bathrooms', 'square-meters', 'location', 'property-type', 'parking-spaces'];
    
    metafieldKeys.forEach(key => {
      const camelCaseKey = key.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
      const value = variantInput.dataset[`metafield${camelCaseKey.charAt(0).toUpperCase() + camelCaseKey.slice(1)}`];
      if (value) {
        metafields[key] = value;
      }
    });
    
    return Object.keys(metafields).length > 0 ? metafields : null;
  }
  
  updateMetafieldsDisplay(metafields) {
    this.updateMetafieldsDisplayOptimized(metafields);
  }
  
  /**
   * Optimized metafields display update
   */
  updateMetafieldsDisplayOptimized(metafields) {
    // Batch DOM queries and updates
    const elementsToUpdate = [];
    
    Object.keys(metafields).forEach(key => {
      const element = this.metafieldsContainer.querySelector(`[data-metafield="${key}"] .detail-value`);
      if (element && element.textContent !== metafields[key]) {
        elementsToUpdate.push({
          element: element,
          value: metafields[key]
        });
      }
    });
    
    // Batch update all elements
    if (elementsToUpdate.length > 0) {
      requestAnimationFrame(() => {
        elementsToUpdate.forEach(({ element, value }) => {
          element.textContent = value;
          element.classList.add('value-updating');
        });
        
        // Remove updating class after animation
        setTimeout(() => {
          elementsToUpdate.forEach(({ element }) => {
            element.classList.remove('value-updating');
          });
        }, 300);
      });
    }
  }
  
  updateSliderImages(variantId, variantImage) {
    // If product slider exists, update it with variant-specific images
    if (this.productSlider && window.ProductSlider) {
      // This is a simplified version - in a real implementation,
      // you might fetch variant-specific images via AJAX
      
      // For now, we'll just update the main image if variant has a featured image
      const mainSlide = this.productSlider.querySelector('.slider-slide.active img');
      if (mainSlide && variantImage) {
        mainSlide.src = variantImage;
        mainSlide.alt = `Imagen de variante: ${variantId}`;
        
        // Handle image load error
        mainSlide.onerror = function() {
          this.classList.add('image-error');
          if (this.parentElement) {
            this.parentElement.classList.add('slide-error');
          }
        };
      }
    }
  }
  
  updateURL(variantId) {
    // Update URL with variant parameter for sharing/bookmarking
    if (history.replaceState) {
      const url = new URL(window.location);
      url.searchParams.set('variant', variantId);
      history.replaceState(null, '', url);
    }
  }
  
  dispatchVariantChangeEvent(variantId, variantData) {
    // Dispatch custom event for other components to listen to
    const event = new CustomEvent('variantChanged', {
      detail: {
        variantId: variantId,
        variantData: variantData
      }
    });
    
    document.dispatchEvent(event);
  }
  
  formatMoney(cents) {
    // Basic money formatting - in real Shopify themes, use Shopify.formatMoney
    const dollars = (cents / 100).toFixed(2);
    return `$${dollars.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }
  
  getMetafieldsData() {
    // Store original metafields data for fallback
    const data = {};
    if (this.metafieldsContainer) {
      const metafieldElements = this.metafieldsContainer.querySelectorAll('[data-metafield]');
      metafieldElements.forEach(element => {
        const key = element.dataset.metafield;
        const valueElement = element.querySelector('.detail-value');
        if (valueElement) {
          data[key] = valueElement.textContent;
        }
      });
    }
    return data;
  }
  
  updateSelectedVariant() {
    // Ensure the correct variant is selected based on URL or default
    const urlParams = new URLSearchParams(window.location.search);
    const variantParam = urlParams.get('variant');
    
    if (variantParam) {
      const variantInput = this.selector.querySelector(`[data-variant-id="${variantParam}"]`);
      if (variantInput && !variantInput.disabled) {
        variantInput.checked = true;
        this.handleVariantChange(variantInput);
      }
    }
  }
}