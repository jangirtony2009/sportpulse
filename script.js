// script.js

// Error handling and monitoring
class ErrorHandler {
  static log(error, context = '') {
    console.error(`SportPulse Error ${context}:`, error);
    
    // Send to analytics
    Analytics.trackError(error, context);
  }
  
  static showUserError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
      <span>⚠️ ${message}</span>
      <button onclick="this.parentElement.remove()">×</button>
    `;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
      if (errorDiv.parentElement) {
        errorDiv.remove();
      }
    }, 5000);
  }
}

// Loading state management
class LoadingManager {
  static show(element, message = 'Loading...') {
    if (!element) return;
    
    element.innerHTML = `
      <div class="loading-state">
        <div class="loading">${message}</div>
      </div>
    `;
  }
  
  static showSkeleton(element, count = 3) {
    if (!element) return;
    
    const skeletonHTML = Array(count).fill().map(() => `
      <div class="news-card skeleton">
        <div class="news-card-image-wrapper skeleton" style="height: 130px;"></div>
        <div class="news-card-body">
          <div class="skeleton" style="height: 20px; margin-bottom: 8px;"></div>
          <div class="skeleton" style="height: 16px; margin-bottom: 8px;"></div>
          <div class="skeleton" style="height: 14px; width: 60%;"></div>
        </div>
      </div>
    `).join('');
    
    element.innerHTML = `<div class="news-grid">${skeletonHTML}</div>`;
  }
  
  static hide(element) {
    const loading = element?.querySelector('.loading-state');
    if (loading) loading.remove();
  }
}

// Image error handling with retry
function handleImageError(img) {
  const retryCount = parseInt(img.dataset.retryCount || '0');
  
  if (retryCount < 2) {
    img.dataset.retryCount = (retryCount + 1).toString();
    setTimeout(() => {
      img.src = img.src; // Retry loading
    }, 1000 * retryCount);
  } else {
    // Show fallback image
    img.src = 'data:image/svg+xml,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200">
        <rect width="400" height="200" fill="#1f2937"/>
        <text x="200" y="100" text-anchor="middle" fill="#9ca3af" font-family="Arial" font-size="16">
          Image unavailable
        </text>
      </svg>
    `);
    img.alt = 'Image unavailable';
  }
}

// Analytics and Monitoring
class Analytics {
  static init() {
    // Performance monitoring
    this.monitorPageLoad();
    this.monitorUserInteractions();
    this.trackPerformanceMetrics();
  }
  
  static trackEvent(eventName, parameters = {}) {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'Sports News',
        event_label: parameters.label || '',
        value: parameters.value || 1,
        ...parameters
      });
    }
    
    console.log('Analytics Event:', eventName, parameters);
  }
  
  static trackPageView(pageName, parameters = {}) {
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: pageName,
        page_location: window.location.href,
        ...parameters
      });
    }
  }
  
  static trackError(error, context = '') {
    this.trackEvent('exception', {
      description: error.message || 'Unknown error',
      fatal: false,
      custom_map: { context }
    });
  }
  
  static trackUserEngagement(action, details = {}) {
    this.trackEvent('engagement', {
      engagement_time_msec: details.time || 0,
      custom_parameter: action,
      ...details
    });
  }
  
  static monitorPageLoad() {
    window.addEventListener('load', () => {
      // Track Core Web Vitals
      if ('performance' in window && 'PerformanceObserver' in window) {
        this.observeWebVitals();
      }
    });
  }
  
  static observeWebVitals() {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.trackEvent('web_vitals', {
        metric_name: 'LCP',
        metric_value: Math.round(lastEntry.startTime),
        metric_delta: Math.round(lastEntry.startTime)
      });
    }).observe({ entryTypes: ['largest-contentful-paint'] });
    
    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        this.trackEvent('web_vitals', {
          metric_name: 'FID',
          metric_value: Math.round(entry.processingStart - entry.startTime),
          metric_delta: Math.round(entry.processingStart - entry.startTime)
        });
      });
    }).observe({ entryTypes: ['first-input'] });
    
    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      this.trackEvent('web_vitals', {
        metric_name: 'CLS',
        metric_value: Math.round(clsValue * 1000),
        metric_delta: Math.round(clsValue * 1000)
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }
  
  static monitorUserInteractions() {
    // Track article reads
    document.addEventListener('click', (e) => {
      const newsCard = e.target.closest('.news-card');
      if (newsCard) {
        const articleId = newsCard.dataset.id;
        this.trackEvent('select_content', {
          content_type: 'article',
          content_id: articleId,
          label: 'Article Click'
        });
      }
      
      // Track category changes
      const categoryChip = e.target.closest('.category-chip');
      if (categoryChip) {
        const category = categoryChip.dataset.category;
        this.trackEvent('select_content', {
          content_type: 'category',
          content_id: category,
          label: 'Category Filter'
        });
      }
    });
    
    // Track search usage
    let searchStartTime = 0;
    document.addEventListener('input', (e) => {
      if (e.target.id === 'searchInput') {
        if (!searchStartTime) {
          searchStartTime = Date.now();
        }
        
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
          if (e.target.value.trim()) {
            this.trackEvent('search', {
              search_term: e.target.value.trim(),
              engagement_time_msec: Date.now() - searchStartTime
            });
          }
          searchStartTime = 0;
        }, 1000);
      }
    });
  }
  
  static trackPerformanceMetrics() {
    // Track initial page load time
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigationTiming = performance.getEntriesByType('navigation')[0];
        if (navigationTiming) {
          this.trackEvent('page_timing', {
            page_load_time: Math.round(navigationTiming.loadEventEnd - navigationTiming.loadEventStart),
            dom_content_loaded: Math.round(navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart)
          });
        }
      }, 0);
    });
  }
}

// Theme Management
class ThemeManager {
  constructor() {
    this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
    this.init();
  }
  
  init() {
    this.applyTheme(this.currentTheme);
    this.setupToggleButton();
    this.setupSystemThemeListener();
  }
  
  getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  
  getStoredTheme() {
    return localStorage.getItem('sportpulse-theme');
  }
  
  setStoredTheme(theme) {
    localStorage.setItem('sportpulse-theme', theme);
  }
  
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    this.setStoredTheme(theme);
    this.updateToggleButton();
  }
  
  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    announceUpdate(`Switched to ${newTheme} theme`);
  }
  
  setupToggleButton() {
    const toggleButton = document.getElementById('themeToggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', () => this.toggleTheme());
    }
  }
  
  updateToggleButton() {
    const toggleButton = document.getElementById('themeToggle');
    const icon = toggleButton?.querySelector('.theme-toggle-icon');
    const text = toggleButton?.querySelector('.theme-toggle-text');
    
    if (this.currentTheme === 'light') {
      if (icon) icon.textContent = '🌞';
      if (text) text.textContent = 'Light';
      if (toggleButton) toggleButton.setAttribute('aria-label', 'Switch to dark theme');
    } else {
      if (icon) icon.textContent = '🌙';
      if (text) text.textContent = 'Dark';
      if (toggleButton) toggleButton.setAttribute('aria-label', 'Switch to light theme');
    }
  }
  
  setupSystemThemeListener() {
    window.matchMedia('(prefers-color-scheme: light)').addListener((e) => {
      if (!this.getStoredTheme()) {
        this.applyTheme(e.matches ? 'light' : 'dark');
      }
    });
  }
}

// PWA Setup
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available
              showUpdateNotification();
            }
          });
        });
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// PWA Install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallButton();
});

function showInstallButton() {
  const installButton = document.createElement('button');
  installButton.textContent = '📱 Install App';
  installButton.className = 'install-button';
  installButton.addEventListener('click', () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        deferredPrompt = null;
        installButton.remove();
      });
    }
  });
  
  const header = document.querySelector('.header-right');
  if (header) {
    header.appendChild(installButton);
  }
}

function showUpdateNotification() {
  const notification = document.createElement('div');
  notification.className = 'update-notification';
  notification.innerHTML = `
    <span>New content available!</span>
    <button onclick="location.reload()">Refresh</button>
  `;
  document.body.appendChild(notification);
}

// Utility: format time ago
function timeAgo(isoString) {
  const now = new Date();
  const then = new Date(isoString);
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / (1000 * 60));
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return then.toLocaleDateString();
}

let filteredCategory = "All";
let searchTerm = "";
let currentView = "home"; // "home" | "article"
let featuredArticle = null;

// DOM refs
const mainContent = document.getElementById("mainContent");
const trendingList = document.getElementById("trendingList");
const categoryChips = document.getElementById("categoryChips");
const searchInput = document.getElementById("searchInput");

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  try {
    // Initialize analytics
    Analytics.init();
    
    // Initialize theme first
    new ThemeManager();
    
    // Initialize mobile support
    new MobileSupport();
    
    // Check if newsData is available
    if (typeof newsData === 'undefined' || !Array.isArray(newsData)) {
      throw new Error('News data not available');
    }
    
    featuredArticle = newsData.find((n) => n.isFeatured) || newsData[0];
    
    if (!featuredArticle) {
      throw new Error('No featured article found');
    }
    
    // Show loading state
    LoadingManager.showSkeleton(mainContent);
    
    // Simulate async loading (remove in production)
    setTimeout(() => {
      try {
        renderHome();
        renderTrending();
        renderCategories();
        attachSearch();
        setupImageErrorHandling();
        
        // Track successful page load
        Analytics.trackEvent('page_view', {
          page_title: 'Home',
          content_group1: 'Sports News'
        });
      } catch (error) {
        ErrorHandler.log(error, 'initialization');
        showErrorState();
      }
    }, 500);
    
  } catch (error) {
    ErrorHandler.log(error, 'DOMContentLoaded');
    showErrorState();
  }
});

// Setup image error handling
function setupImageErrorHandling() {
  document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
      handleImageError(e.target);
    }
  }, true);
}

// Show error state when app fails to load
function showErrorState() {
  if (mainContent) {
    mainContent.innerHTML = `
      <div class="error-state">
        <div class="error-icon">⚠️</div>
        <h2>Something went wrong</h2>
        <p>We're having trouble loading the latest sports news. Please try again.</p>
        <button class="retry-button" onclick="location.reload()">Retry</button>
      </div>
    `;
  }
}

// Enhanced renderArticle with error handling
function renderArticle(id) {
  try {
    currentView = "article";
    const article = newsData.find((n) => n.id === id);
    
    if (!article) {
      ErrorHandler.showUserError('Article not found');
      renderHome();
      return;
    }
    
    LoadingManager.show(mainContent, 'Loading article...');
    
    // Simulate loading delay (remove in production)
    setTimeout(() => {
      try {
        renderArticleContent(article);
      } catch (error) {
        ErrorHandler.log(error, 'article rendering');
        ErrorHandler.showUserError('Failed to load article');
        renderHome();
      }
    }, 300);
    
  } catch (error) {
    ErrorHandler.log(error, 'renderArticle');
    ErrorHandler.showUserError('Failed to load article');
    renderHome();
  }
}

function renderArticleContent(article) {
  const tagsHtml =
    article.tags && article.tags.length
      ? article.tags.map((t) => `<span class="badge-tag">${t}</span>`).join("")
      : "";

  // Related stories with error handling
  const related = newsData
    .filter((n) => n.category === article.category && n.id !== article.id)
    .slice(0, 4);

  const relatedHtml = related
    .map(
      (r) => `
      <article class="news-card" data-id="${r.id}" tabindex="0" 
               onkeydown="handleCardKeydown(event, ${r.id})">
        <div class="news-card-image-wrapper">
          <img src="${r.imageUrl}" alt="${r.title}" loading="lazy" 
               onerror="handleImageError(this)" />
          <span class="news-card-category">${r.category}</span>
        </div>
        <div class="news-card-body">
          <h3 class="news-card-title">${r.title}</h3>
          <div class="news-card-meta">
            <span>${timeAgo(r.publishedAt)}</span>
            <span>Read ›</span>
          </div>
        </div>
      </article>
    `
    )
    .join("");

  // Build article body paragraphs safely
  const paragraphsHtml = (article.fullContent || [])
    .slice(0, 2)
    .map((p) => `<p>${p}</p>`)
    .join("");

  const remainingParagraphsHtml = (article.fullContent || [])
    .slice(2)
    .map((p) => `<p>${p}</p>`)
    .join("");

  mainContent.innerHTML = `
    <div class="article-view">
      <button class="back-button" id="backButton" aria-label="Back to all news">
        ← Back to all news
      </button>

      <div class="article-banner">
        <img src="${article.imageUrl}" alt="${article.title}" 
             onerror="handleImageError(this)" />
        <div class="article-banner-overlay"></div>
        <div class="article-banner-meta">
          <div class="article-badge-row">
            <span class="badge-category">${article.category}</span>
            ${tagsHtml}
          </div>
          <div class="article-meta-line">
            Published • ${new Date(article.publishedAt).toLocaleString()}
          </div>
        </div>
      </div>

      <h1 class="article-title">${article.title}</h1>

      <div class="article-body">
        ${paragraphsHtml}

        <!-- ADSENSE-SLOT-ARTICLE -->
        <div class="ad-slot-article">
          <div class="ad-placeholder">
            <span>Article Inline Ad Placeholder</span>
            <small>Paste AdSense in-article display ad here</small>
          </div>
        </div>

        ${remainingParagraphsHtml}
      </div>

      <section class="related-section">
        <div class="related-header">Related stories</div>
        <div class="related-list">
          ${relatedHtml || "<p style='font-size:12px;color:#9ca3af;'>No related stories available.</p>"}
        </div>
      </section>
    </div>
  `;

  // Attach back button with error handling
  const backButton = document.getElementById("backButton");
  if (backButton) {
    backButton.addEventListener("click", () => {
      try {
        renderHome();
        manageFocus(searchInput || document.querySelector('.brand-title'));
      } catch (error) {
        ErrorHandler.log(error, 'back button');
        location.reload();
      }
    });
  }

  // Attach related article clicks with error handling
  related.forEach((item) => {
    const card = document.querySelector(
      `.related-list .news-card[data-id="${item.id}"]`
    );
    if (card) {
      card.addEventListener("click", () => {
        try {
          renderArticle(item.id);
        } catch (error) {
          ErrorHandler.log(error, 'related article click');
          ErrorHandler.showUserError('Failed to load related article');
        }
      });
    }
  });
  
  // Announce article loaded
  announceUpdate(`Article loaded: ${article.title}`);
}

// Touch and Mobile Support
class MobileSupport {
  constructor() {
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.isSwiping = false;
    this.init();
  }
  
  init() {
    this.setupTouchEvents();
    this.setupPullToRefresh();
    this.optimizeForMobile();
  }
  
  setupTouchEvents() {
    let startX = 0;
    let startY = 0;
    
    document.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
      if (!startX || !startY) return;
      
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const diffX = startX - endX;
      const diffY = startY - endY;
      
      // Check if it's a swipe (minimum distance and more horizontal than vertical)
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          // Swipe left - next article in category
          this.navigateNext();
        } else {
          // Swipe right - previous article or back
          this.navigatePrevious();
        }
      }
      
      startX = 0;
      startY = 0;
    }, { passive: true });
  }
  
  navigateNext() {
    if (currentView === 'article') {
      // Find next article in same category
      const currentArticleIndex = newsData.findIndex(article => article.id === parseInt(document.querySelector('.article-view')?.dataset?.articleId));
      if (currentArticleIndex !== -1 && currentArticleIndex < newsData.length - 1) {
        const nextArticle = newsData[currentArticleIndex + 1];
        if (nextArticle) {
          renderArticle(nextArticle.id);
          Analytics.trackEvent('swipe_navigation', {
            direction: 'next',
            content_type: 'article'
          });
        }
      }
    }
  }
  
  navigatePrevious() {
    if (currentView === 'article') {
      // Go back to home or previous article
      renderHome();
      Analytics.trackEvent('swipe_navigation', {
        direction: 'back',
        content_type: 'home'
      });
    }
  }
  
  setupPullToRefresh() {
    let startY = 0;
    let isPulling = false;
    
    document.addEventListener('touchstart', (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
      }
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
      if (window.scrollY === 0 && startY) {
        const currentY = e.touches[0].clientY;
        const pullDistance = currentY - startY;
        
        if (pullDistance > 50 && !isPulling) {
          isPulling = true;
          this.showPullToRefreshIndicator();
        }
      }
    }, { passive: true });
    
    document.addEventListener('touchend', () => {
      if (isPulling) {
        isPulling = false;
        this.hidePullToRefreshIndicator();
        this.refreshContent();
      }
      startY = 0;
    }, { passive: true });
  }
  
  showPullToRefreshIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'pull-refresh';
    indicator.className = 'pull-refresh-indicator';
    indicator.innerHTML = '⟳ Release to refresh';
    document.body.appendChild(indicator);
  }
  
  hidePullToRefreshIndicator() {
    const indicator = document.getElementById('pull-refresh');
    if (indicator) indicator.remove();
  }
  
  refreshContent() {
    LoadingManager.showSkeleton(mainContent, 2);
    setTimeout(() => {
      renderHome();
      announceUpdate('Content refreshed');
      Analytics.trackEvent('pull_to_refresh', {
        content_type: 'news_feed'
      });
    }, 1000);
  }
  
  optimizeForMobile() {
    // Add viewport meta for iOS Safari
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', viewport.getAttribute('content') + ', viewport-fit=cover');
      }
    }
    
    // Prevent zoom on input focus
    document.addEventListener('touchstart', (e) => {
      if (e.target.tagName === 'INPUT') {
        e.target.style.fontSize = '16px';
      }
    });
  }
}

// Search
function attachSearch() {
  if (!searchInput) return;
  searchInput.addEventListener("input", (e) => {
    searchTerm = e.target.value.trim().toLowerCase();
    if (currentView === "home") {
      renderHome();
    }
  });
}

// Filters
function filterNews() {
  return newsData.filter((item) => {
    const matchesCategory =
      filteredCategory === "All" || item.category === filteredCategory;
    const matchesSearch =
      !searchTerm ||
      item.title.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });
}

// Home view
function renderHome() {
  currentView = "home";
  const items = filterNews();

  let html = "";

  // Featured story – only when no search term and category is All
  if (!searchTerm && filteredCategory === "All" && featuredArticle) {
    html += renderFeatured(featuredArticle);
  }

  // Section header
  html += `
    <div class="news-section-header fade-in">
      <h2>${filteredCategory === "All" ? "Top Stories" : filteredCategory}</h2>
      <span>${items.length} result${items.length !== 1 ? "s" : ""}</span>
    </div>
  `;

  // News cards + ad slot after 3rd card
  html += `<div class="news-grid">`;
  items.forEach((item, index) => {
    if (index === 3) {
      // Feed AdSense placeholder
      html += `
        <!-- ADSENSE-SLOT-HOMEPAGE -->
        <div class="ad-slot-feed slide-up">
          <div class="ad-placeholder glass-card">
            <span>📊 Premium Content</span>
            <small>Sponsored content placement</small>
          </div>
        </div>
      `;
    }
    html += renderNewsCard(item, index);
  });
  html += `</div>`;

  mainContent.innerHTML = html;

  // Attach card click handlers
  items.forEach((item) => {
    const card = document.querySelector(`.news-card[data-id="${item.id}"]`);
    if (card) {
      card.addEventListener("click", () => {
        renderArticle(item.id);
      });
    }
  });

  // Featured click
  if (featuredArticle && !searchTerm && filteredCategory === "All") {
    const featuredEl = document.querySelector(".featured-story");
    if (featuredEl) {
      featuredEl.addEventListener("click", () => {
        renderArticle(featuredArticle.id);
      });
    }
  }
}

function renderFeatured(item) {
  return `
    <article class="featured-story fade-in" tabindex="0" role="article" aria-labelledby="featured-title-${item.id}">
      <div class="featured-media">
        <img src="${item.imageUrl}" alt="${item.title}" loading="lazy" />
        <div class="featured-overlay"></div>
      </div>
      <div class="featured-content">
        <div class="featured-meta">
          <span class="badge-category">${item.category}</span>
          <span>📅 ${timeAgo(item.publishedAt)}</span>
        </div>
        <h1 id="featured-title-${item.id}" class="featured-title">${item.title}</h1>
        <p class="featured-description">${item.shortDescription}</p>
        <div class="featured-cta">
          <span class="read-featured">Continue reading →</span>
        </div>
      </div>
    </article>
  `;
}

function renderNewsCard(item, index = 0) {
  const tagsHtml =
    item.tags && item.tags.length
      ? item.tags
          .slice(0, 2)
          .map((t) => `<span class="news-tag">${t}</span>`)
          .join("")
      : "";
  
  const animationDelay = `style="animation-delay: ${index * 0.1}s"`;
  
  return `
    <article class="news-card fade-in" ${animationDelay} data-id="${item.id}" tabindex="0" role="article" 
             aria-labelledby="card-title-${item.id}" 
             aria-describedby="card-desc-${item.id}"
             onkeydown="handleCardKeydown(event, ${item.id})">
      <div class="news-card-image-wrapper">
        <img src="${item.imageUrl}" alt="${item.title}" loading="lazy" 
             onerror="handleImageError(this)" />
        <span class="news-card-category">${item.category}</span>
      </div>
      <div class="news-card-body">
        <h3 id="card-title-${item.id}" class="news-card-title">${item.title}</h3>
        <p id="card-desc-${item.id}" class="news-card-desc">${item.shortDescription}</p>
        <div class="news-card-tags">${tagsHtml}</div>
        <div class="news-card-meta">
          <span>${timeAgo(item.publishedAt)}</span>
          <span class="read-more">Read more →</span>
        </div>
      </div>
    </article>
  `;
}

// Article view
function renderArticle(id) {
  currentView = "article";
  const article = newsData.find((n) => n.id === id);
  if (!article) return;

  const tagsHtml =
    article.tags && article.tags.length
      ? article.tags.map((t) => `<span class="badge-tag">${t}</span>`).join("")
      : "";

  // Related stories
  const related = newsData
    .filter((n) => n.category === article.category && n.id !== article.id)
    .slice(0, 4);

  const relatedHtml = related
    .map(
      (r) => `
      <article class="news-card" data-id="${r.id}">
        <div class="news-card-image-wrapper">
          <img src="${r.imageUrl}" alt="${r.title}" loading="lazy" />
          <span class="news-card-category">${r.category}</span>
        </div>
        <div class="news-card-body">
          <h3 class="news-card-title">${r.title}</h3>
          <div class="news-card-meta">
            <span>${timeAgo(r.publishedAt)}</span>
            <span>Read ›</span>
          </div>
        </div>
      </article>
    `
    )
    .join("");

  // Build article body paragraphs
  const paragraphsHtml = (article.fullContent || [])
    .slice(0, 2)
    .map((p) => `<p>${p}</p>`)
    .join("");

  const remainingParagraphsHtml = (article.fullContent || [])
    .slice(2)
    .map((p) => `<p>${p}</p>`)
    .join("");

  mainContent.innerHTML = `
    <div class="article-view">
      <button class="back-button" id="backButton">
        ← Back to all news
      </button>

      <div class="article-banner">
        <img src="${article.imageUrl}" alt="${article.title}" />
        <div class="article-banner-overlay"></div>
        <div class="article-banner-meta">
          <div class="article-badge-row">
            <span class="badge-category">${article.category}</span>
            ${tagsHtml}
          </div>
          <div class="article-meta-line">
            Published • ${new Date(article.publishedAt).toLocaleString()}
          </div>
        </div>
      </div>

      <h1 class="article-title">${article.title}</h1>

      <div class="article-body">
        ${paragraphsHtml}

        <!-- ADSENSE-SLOT-ARTICLE -->
        <div class="ad-slot-article">
          <div class="ad-placeholder">
            <span>Article Inline Ad Placeholder</span>
            <small>Paste AdSense in-article display ad here</small>
          </div>
        </div>

        ${remainingParagraphsHtml}
      </div>

      <section class="related-section">
        <div class="related-header">Related stories</div>
        <div class="related-list">
          ${relatedHtml || "<p style='font-size:12px;color:#9ca3af;'>No related stories available.</p>"}
        </div>
      </section>
    </div>
  `;

  // Attach back button
  document.getElementById("backButton")?.addEventListener("click", () => {
    renderHome();
  });

  // Attach related article clicks
  related.forEach((item) => {
    const card = document.querySelector(
      `.related-list .news-card[data-id="${item.id}"]`
    );
    if (card) {
      card.addEventListener("click", () => {
        renderArticle(item.id);
      });
    }
  });
}

// Trending
function renderTrending() {
  const trending = newsData.filter((n) => n.isTrending);
  if (!trendingList) return;
  if (!trending.length) {
    trendingList.innerHTML =
      "<p style='font-size:12px;color:#9ca3af;'>No trending stories.</p>";
    return;
  }

  trendingList.innerHTML = trending
    .map(
      (item) => `
      <div class="trending-item" data-id="${item.id}">
        <div class="trending-title">${item.title}</div>
        <div class="trending-meta">
          <span>${item.category}</span> • <span>${timeAgo(
        item.publishedAt
      )}</span>
        </div>
      </div>
    `
    )
    .join("");

  trending.forEach((item) => {
    const el = document.querySelector(
      `.trending-item[data-id="${item.id}"]`
    );
    if (el) {
      el.addEventListener("click", () => {
        renderArticle(item.id);
      });
    }
  });
}

// Categories
function renderCategories() {
  if (!categoryChips) return;
  const categories = Array.from(
    new Set(newsData.map((n) => n.category))
  ).sort();

  const all = ["All", ...categories];

  categoryChips.innerHTML = all
    .map(
      (cat) => `
    <button
      class="category-chip ${filteredCategory === cat ? "active" : ""}"
      data-category="${cat}"
      aria-pressed="${filteredCategory === cat}"
      aria-label="Filter by ${cat} ${cat === 'All' ? 'categories' : 'category'}"
    >
      ${cat}
    </button>
  `
    )
    .join("");

  all.forEach((cat) => {
    const chip = document.querySelector(
      `.category-chip[data-category="${cat}"]`
    );
    if (chip) {
      chip.addEventListener("click", () => {
        filteredCategory = cat;
        renderCategories();
        renderHome();
        announceUpdate(`Showing ${cat === 'All' ? 'all' : cat} articles`);
      });
    }
  });
}

// Keyboard navigation support
function handleCardKeydown(event, itemId) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    renderArticle(itemId);
  }
}

// Screen reader announcements
function announceUpdate(message) {
  const announcer = document.getElementById('sr-announcer') || createAnnouncer();
  announcer.textContent = message;
}

function createAnnouncer() {
  const announcer = document.createElement('div');
  announcer.id = 'sr-announcer';
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  document.body.appendChild(announcer);
  return announcer;
}

// Focus management
function manageFocus(targetElement) {
  if (targetElement) {
    targetElement.focus();
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// Enhanced search with announcements
function attachSearch() {
  if (!searchInput) return;
  
  let searchTimeout;
  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const previousTerm = searchTerm;
      searchTerm = e.target.value.trim().toLowerCase();
      
      if (currentView === "home") {
        renderHome();
        
        // Announce search results
        const items = filterNews();
        if (searchTerm && searchTerm !== previousTerm) {
          announceUpdate(`Found ${items.length} result${items.length !== 1 ? 's' : ''} for "${searchTerm}"`);
        }
      }
    }, 300); // Debounce search
  });
  
  // Support keyboard navigation in search
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      searchTerm = '';
      renderHome();
      announceUpdate('Search cleared');
    }
  });
}
