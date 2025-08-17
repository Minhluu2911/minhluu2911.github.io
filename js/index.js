/**
 * Enhanced JavaScript for personal website
 * Handles publication hover effects, lightbox functionality, and improves user experience
 */

// Use modern event listeners instead of jQuery for better performance
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all interactive features
  initPublicationHoverEffects();
  initLightboxFunctionality();
  initImageEnhancements();
  initSmoothScrolling();
  initImageLazyLoading();
});

/**
 * Handles hover effects for publication videos/images
 * Shows video on hover, displays image otherwise
 */
function initPublicationHoverEffects() {
  const publicationCells = document.querySelectorAll('.publication-mousecell');
  
  publicationCells.forEach(cell => {
    const video = cell.querySelector('video');
    const image = cell.querySelector('img');
    
    // Only add hover effects if both video and image exist
    if (video && image) {
      // Mouse enter - show video, hide image
      cell.addEventListener('mouseenter', function() {
        video.style.display = 'inline-block';
        image.style.display = 'none';
        // Start video playback with error handling
        video.play().catch(e => {
          console.log('Video autoplay prevented:', e);
        });
      });
      
      // Mouse leave - hide video, show image  
      cell.addEventListener('mouseleave', function() {
        video.style.display = 'none';
        image.style.display = 'inline-block';
        // Pause video to save resources
        video.pause();
        video.currentTime = 0; // Reset to beginning
      });
    }
  });
}

/**
 * Initialize lightbox functionality for publication images
 */
function initLightboxFunctionality() {
  // Create lightbox element if it doesn't exist
  if (!document.querySelector('.lightbox')) {
    createLightboxHTML();
  }
  
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox.querySelector('img');
  const lightboxVideo = lightbox.querySelector('video');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  
  // Add click listeners to all publication images
  const publicationImages = document.querySelectorAll('.publication-image');
  
  publicationImages.forEach(imageContainer => {
    imageContainer.addEventListener('click', function(e) {
      e.preventDefault();
      
      const img = this.querySelector('img');
      const video = this.querySelector('video');
      const title = this.closest('.publication-block').querySelector('.publication-title a').textContent;
      
      // Determine what to show in lightbox
      if (video && this.classList.contains('publication-mousecell')) {
        // Show video in lightbox
        showLightboxVideo(video.src, title);
      } else if (img) {
        // Show image in lightbox
        showLightboxImage(img.src, title);
      }
    });
    
    // Add visual indication that images are clickable
    imageContainer.style.cursor = 'pointer';
  });
  
  // Close lightbox functionality
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  // Close with escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
  
  function showLightboxImage(src, caption) {
    lightboxImg.src = src;
    lightboxImg.style.display = 'block';
    lightboxVideo.style.display = 'none';
    lightboxCaption.textContent = caption;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }
  
  function showLightboxVideo(src, caption) {
    lightboxVideo.src = src;
    lightboxVideo.style.display = 'block';
    lightboxImg.style.display = 'none';
    lightboxCaption.textContent = caption + ' (Video Demo)';
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Auto-play video in lightbox
    lightboxVideo.play().catch(e => {
      console.log('Video autoplay prevented in lightbox:', e);
    });
  }
  
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
    
    // Stop any playing video
    lightboxVideo.pause();
    lightboxVideo.currentTime = 0;
    
    // Clear sources to free memory
    setTimeout(() => {
      if (!lightbox.classList.contains('active')) {
        lightboxImg.src = '';
        lightboxVideo.src = '';
      }
    }, 300);
  }
}

/**
 * Create lightbox HTML structure
 */
function createLightboxHTML() {
  const lightboxHTML = `
    <div class="lightbox">
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
        <img src="" alt="Publication preview" />
        <video controls muted loop>
          <source src="" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        <div class="lightbox-caption"></div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', lightboxHTML);
}

/**
 * Enhanced image loading and optimization
 */
function initImageEnhancements() {
  const images = document.querySelectorAll('.publication-image img');
  
  images.forEach(img => {
    // Add loading animation
    img.style.opacity = '0';
    
    // Handle load event
    img.addEventListener('load', function() {
      this.style.opacity = '1';
      
      // Detect GIFs and add special styling
      if (this.src.toLowerCase().includes('.gif')) {
        this.closest('.publication-image').classList.add('gif-preview');
      }
    });
    
    // Handle error event
    img.addEventListener('error', function() {
      console.warn('Failed to load image:', this.src);
      this.style.opacity = '0.5';
      this.alt = 'Image failed to load';
    });
    
    // Progressive loading effect
    if (img.complete) {
      img.dispatchEvent(new Event('load'));
    }
  });
  
  // Add hover effects for better user feedback
  const publicationBlocks = document.querySelectorAll('.publication-block');
  
  publicationBlocks.forEach(block => {
    const imageContainer = block.querySelector('.publication-image');
    
    if (imageContainer) {
      // Add subtle animation on block hover
      block.addEventListener('mouseenter', function() {
        imageContainer.style.transform = 'translateY(-2px)';
      });
      
      block.addEventListener('mouseleave', function() {
        imageContainer.style.transform = '';
      });
    }
  });
}

/**
 * Adds smooth scrolling to anchor links
 */
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update URL without jumping
        history.pushState(null, null, href);
      }
    });
  });
}

/**
 * Enhanced image loading with intersection observer
 */
function initImageLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Add fade-in effect when image loads
          img.addEventListener('load', function() {
            img.style.opacity = '1';
          });
          
          // Remove loading attribute to trigger loading
          img.removeAttribute('loading');
          observer.unobserve(img);
        }
      });
    }, {
      // Start loading when image is 10% visible
      threshold: 0.1,
      // Start loading 50px before image enters viewport
      rootMargin: '50px'
    });
    
    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver
    images.forEach(img => {
      img.removeAttribute('loading');
    });
  }
}

/**
 * Add keyboard navigation for better accessibility
 */
document.addEventListener('keydown', function(e) {
  // Navigate publications with arrow keys when focused
  if (e.target.closest('.publication-block')) {
    const currentBlock = e.target.closest('.publication-block');
    const allBlocks = Array.from(document.querySelectorAll('.publication-block'));
    const currentIndex = allBlocks.indexOf(currentBlock);
    
    let targetIndex = currentIndex;
    
    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        targetIndex = Math.min(currentIndex + 1, allBlocks.length - 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        targetIndex = Math.max(currentIndex - 1, 0);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        const imageContainer = currentBlock.querySelector('.publication-image');
        if (imageContainer) {
          imageContainer.click();
        }
        break;
    }
    
    if (targetIndex !== currentIndex) {
      allBlocks[targetIndex].focus();
      allBlocks[targetIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }
});

/**
 * Performance monitoring and optimization
 */
function initPerformanceOptimizations() {
  // Debounce scroll events for better performance
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      // Add scroll-based animations here if needed
    }, 16); // ~60fps
  });
  
  // Preload critical images
  const criticalImages = document.querySelectorAll('.publication-image img');
  const firstFewImages = Array.from(criticalImages).slice(0, 3);
  
  firstFewImages.forEach(img => {
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = img.src;
    document.head.appendChild(preloadLink);
  });
}

// Initialize performance optimizations
initPerformanceOptimizations();
