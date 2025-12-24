// script.js - GlowUp Beauty Blog

// Global variables
let currentArticles = [];
let filteredArticles = [];
let currentCategory = 'all';
let isLoading = false;
let searchTimeout = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

// App initialization
function initializeApp() {
  setupEventListeners();
  loadInitialContent();
  initializeLazyLoading();
  initializeTheme();
  initializeAds();
  initializeAnalytics();
}

// Event listeners setup
function setupEventListeners() {
  // Navigation
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', 
        navMenu.classList.contains('active') ? 'true' : 'false');
    });
  }

  // Navigation links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.dataset.section;
      handleNavigation(section);
      
      // Update active state
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      // Close mobile menu
      navMenu?.classList.remove('active');
      mobileToggle?.classList.remove('active');
    });
  });

  // Search functionality
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }

  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Category cards
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      filterArticlesByCategory(category);
    });
  });

  // Newsletter form
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', handleNewsletterSubmit);
  }

  // Skin quiz button
  const skinQuizBtn = document.querySelector('.skin-quiz-btn');
  if (skinQuizBtn) {
    skinQuizBtn.addEventListener('click', openSkinQuiz);
  }
}

// Load initial content
function loadInitialContent() {
  try {
    // Check if newsData is available, if not wait for it
    if (typeof window.newsData === 'undefined') {
      console.log('newsData not yet available, retrying in 100ms...');
      setTimeout(loadInitialContent, 100);
      return;
    }
    
    // Load skincare articles (from newsData)
    currentArticles = window.newsData || [];
    filteredArticles = [...currentArticles];
    
    console.log('Loaded articles:', currentArticles.length);
    console.log('Featured articles:', currentArticles.filter(a => a.isFeatured).length);
    
    renderFeaturedArticles();
    renderMainContent();
    renderPopularArticles();
    renderCategories();
    
  } catch (error) {
    console.error('Error loading content:', error);
    showErrorMessage('Failed to load content. Please refresh the page.');
  }
}

// Render featured articles
function renderFeaturedArticles() {
  const featuredContainer = document.getElementById('featuredArticles');
  if (!featuredContainer) {
    console.error('Featured articles container not found!');
    return;
  }

  const featured = currentArticles.filter(article => article.isFeatured).slice(0, 3);
  console.log('Featured articles to render:', featured.length);
  
  if (featured.length === 0) {
    console.warn('No featured articles found');
    featuredContainer.innerHTML = '<p class="empty-state">No featured articles available.</p>';
    return;
  }

  featuredContainer.innerHTML = featured.map(article => `
    <article class="article-card fade-in" onclick="openArticle(${article.id})">
      <div class="article-card-image">
        <img src="${article.imageUrl}" 
             alt="${article.title}" 
             loading="lazy" 
             onerror="handleImageError(this)" />
        ${article.isTrending ? '<span class="article-badge">Trending</span>' : ''}
      </div>
      <div class="article-card-content">
        <div class="article-category">${article.category}</div>
        <h3 class="article-title">${article.title}</h3>
        <p class="article-excerpt">${article.shortDescription}</p>
        <div class="article-meta">
          <span class="article-date">
            📅 ${formatDate(article.publishedAt)}
          </span>
          <span class="read-time">${article.readTime}</span>
        </div>
      </div>
    </article>
  `).join('');
  
  console.log('Featured articles rendered successfully');
}

// Render main content (all articles)
function renderMainContent() {
  const mainContent = document.getElementById('mainContent');
  if (!mainContent) return;

  if (filteredArticles.length === 0) {
    mainContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <h3>No articles found</h3>
        <p>Try adjusting your search or browse our categories.</p>
      </div>
    `;
    return;
  }

  const articlesHTML = filteredArticles.map(article => `
    <article class="article-card fade-in" onclick="openArticle(${article.id})">
      <div class="article-card-image">
        <img src="${article.imageUrl}" 
             alt="${article.title}" 
             loading="lazy" 
             onerror="handleImageError(this)" />
        ${article.isTrending ? '<span class="article-badge">Trending</span>' : ''}
      </div>
      <div class="article-card-content">
        <div class="article-category">${article.category}</div>
        <h3 class="article-title">${article.title}</h3>
        <p class="article-excerpt">${article.shortDescription}</p>
        <div class="article-meta">
          <span class="article-date">
            📅 ${formatDate(article.publishedAt)}
          </span>
          <span class="read-time">${article.readTime}</span>
        </div>
      </div>
    </article>
  `).join('');

  mainContent.innerHTML = `
    <div class="articles-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--space-lg);">
      ${articlesHTML}
    </div>
  `;
}

// Render popular articles sidebar
function renderPopularArticles() {
  const popularList = document.getElementById('popularList');
  if (!popularList) return;

  const popular = currentArticles
    .filter(article => article.isTrending || article.isFeatured)
    .slice(0, 5);

  popularList.innerHTML = popular.map(article => `
    <div class="popular-item" onclick="openArticle(${article.id})">
      <div class="popular-item-image">
        <img src="${article.imageUrl}" 
             alt="${article.title}" 
             loading="lazy" 
             onerror="handleImageError(this)" />
      </div>
      <div class="popular-item-content">
        <h4>${article.title}</h4>
        <div class="popular-item-meta">
          ${article.category} • ${article.readTime}
        </div>
      </div>
    </div>
  `).join('');
}

// Render categories
function renderCategories() {
  const categoryChips = document.getElementById('categoryChips');
  if (!categoryChips || !window.categories) return;

  const categoriesHTML = window.categories.map(category => `
    <span class="category-chip" 
          onclick="filterArticlesByCategory('${category.name.toLowerCase().replace(/\s+/g, '-')}')"
          title="${category.name} (${category.count} articles)">
      ${category.icon} ${category.name}
    </span>
  `).join('');

  categoryChips.innerHTML = `
    <span class="category-chip ${currentCategory === 'all' ? 'active' : ''}" 
          onclick="filterArticlesByCategory('all')">
      🎯 All Topics
    </span>
    ${categoriesHTML}
  `;
}

// Search functionality
function handleSearch(e) {
  clearTimeout(searchTimeout);
  const query = e.target.value.toLowerCase().trim();
  
  searchTimeout = setTimeout(() => {
    if (!query) {
      filteredArticles = [...currentArticles];
    } else {
      filteredArticles = currentArticles.filter(article => 
        article.title.toLowerCase().includes(query) ||
        article.shortDescription.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    renderMainContent();
    trackEvent('search', { query });
  }, 300);
}

// Filter articles by category
function filterArticlesByCategory(category) {
  currentCategory = category;
  
  if (category === 'all') {
    filteredArticles = [...currentArticles];
  } else {
    const categoryName = category.replace(/-/g, ' ').toLowerCase();
    filteredArticles = currentArticles.filter(article => 
      article.category.toLowerCase().includes(categoryName)
    );
  }
  
  renderMainContent();
  updateCategoryChips();
  trackEvent('filter_category', { category });
}

// Update category chip active states
function updateCategoryChips() {
  document.querySelectorAll('.category-chip').forEach(chip => {
    chip.classList.remove('active');
  });
  
  const activeChip = document.querySelector(`[onclick*="${currentCategory}"]`);
  if (activeChip) {
    activeChip.classList.add('active');
  }
}

// Navigation handling
function handleNavigation(section) {
  const sections = {
    home: () => {
      scrollToTop();
      renderMainContent();
    },
    blog: () => {
      scrollToSection('mainContent');
    },
    products: () => {
      showProductRecommendations();
    },
    about: () => {
      showAboutSection();
    },
    contact: () => {
      showContactSection();
    }
  };

  if (sections[section]) {
    sections[section]();
  }

  trackEvent('navigation', { section });
}

// Open article (modal or new page)
function openArticle(articleId) {
  const article = currentArticles.find(a => a.id === articleId);
  if (!article) return;

  // Navigate to individual article page if articleUrl exists
  if (article.articleUrl) {
    window.location.href = article.articleUrl;
    trackEvent('article_view', { article_id: articleId, title: article.title });
  } else {
    // Fallback to modal for articles without individual pages
    showArticleModal(article);
    trackEvent('article_view', { article_id: articleId, title: article.title });
  }
}

// Show article in modal
function showArticleModal(article) {
  const modal = document.createElement('div');
  modal.className = 'article-modal';
  modal.innerHTML = `
    <div class="article-modal-content">
      <button class="modal-close" onclick="closeModal()">&times;</button>
      <article class="article-full">
        <header class="article-header">
          <div class="article-category">${article.category}</div>
          <h1 class="article-title">${article.title}</h1>
          <div class="article-meta">
            <span>📅 ${formatDate(article.publishedAt)}</span>
            <span>⏱️ ${article.readTime}</span>
          </div>
          <div class="article-tags">
            ${article.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
          </div>
        </header>
        <div class="article-image">
          <img src="${article.imageUrl}" alt="${article.title}" />
        </div>
        <div class="article-body">
          ${article.fullContent.map(paragraph => `<p>${paragraph}</p>`).join('')}
        </div>
        
        <!-- In-article Ad Slot -->
        <div class="ad-slot-article">
          <ins class="adsbygoogle"
               style="display:block; text-align:center;"
               data-ad-layout="in-article"
               data-ad-format="fluid"
               data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
               data-ad-slot="1234567890"></ins>
        </div>
        
        <div class="article-footer">
          <button class="btn-primary" onclick="shareArticle(${article.id})">
            Share Article
          </button>
        </div>
      </article>
    </div>
    <div class="modal-backdrop" onclick="closeModal()"></div>
  `;
  
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  
  // Initialize ads in modal
  setTimeout(() => {
    if (window.adsbygoogle) {
      (adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, 100);
}

// Close modal
function closeModal() {
  const modal = document.querySelector('.article-modal');
  if (modal) {
    modal.remove();
    document.body.style.overflow = 'auto';
  }
}

// Newsletter subscription
function handleNewsletterSubmit(e) {
  e.preventDefault();
  const email = e.target.querySelector('input[type="email"]').value;
  
  if (!email || !isValidEmail(email)) {
    showNotification('Please enter a valid email address.', 'error');
    return;
  }
  
  // Simulate newsletter signup
  showNotification('Thank you for subscribing! 💕', 'success');
  e.target.reset();
  trackEvent('newsletter_signup', { email_domain: email.split('@')[1] });
}

// Skin quiz
function openSkinQuiz() {
  // Simple skin type quiz
  const quiz = [
    {
      question: "How does your skin feel after cleansing?",
      answers: [
        { text: "Tight and dry", type: "dry" },
        { text: "Comfortable", type: "normal" },
        { text: "Oily in T-zone only", type: "combination" },
        { text: "Oily all over", type: "oily" }
      ]
    },
    {
      question: "How often do you break out?",
      answers: [
        { text: "Rarely", type: "normal" },
        { text: "Occasionally", type: "combination" },
        { text: "Frequently", type: "oily" },
        { text: "My skin is very reactive", type: "sensitive" }
      ]
    }
  ];
  
  // Simple implementation - show alert for now
  alert('Skin Quiz coming soon! 🌟\n\nFor now, browse our articles by category to find content perfect for your skin type.');
  trackEvent('quiz_interest', {});
}

// Theme toggle
function toggleTheme() {
  const root = document.documentElement;
  const currentTheme = root.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  root.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  const toggleBtn = document.getElementById('themeToggle');
  if (toggleBtn) {
    const icon = toggleBtn.querySelector('.theme-toggle-icon');
    const text = toggleBtn.querySelector('.theme-toggle-text');
    
    if (newTheme === 'dark') {
      icon.textContent = '🌙';
      text.textContent = 'Dark';
    } else {
      icon.textContent = '☀️';
      text.textContent = 'Light';
    }
  }
  
  trackEvent('theme_toggle', { theme: newTheme });
}

// Initialize theme
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  const toggleBtn = document.getElementById('themeToggle');
  if (toggleBtn) {
    const icon = toggleBtn.querySelector('.theme-toggle-icon');
    const text = toggleBtn.querySelector('.theme-toggle-text');
    
    if (savedTheme === 'dark') {
      icon.textContent = '🌙';
      text.textContent = 'Dark';
    } else {
      icon.textContent = '☀️';
      text.textContent = 'Light';
    }
  }
}

// Lazy loading for images
function initializeLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove('lazy-image');
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    // Observe all images
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.classList.add('lazy-image');
      imageObserver.observe(img);
    });
  }
}

// Initialize Google AdSense
function initializeAds() {
  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAds);
    return;
  }
  
  setTimeout(() => {
    if (typeof adsbygoogle !== 'undefined') {
      const ads = document.querySelectorAll('.adsbygoogle:not([data-adsbygoogle-status])');
      ads.forEach((ad) => {
        try {
          // Ensure ad container has minimum dimensions
          const parent = ad.parentElement;
          if (parent && parent.offsetWidth === 0) {
            parent.style.minWidth = '300px';
            parent.style.minHeight = '250px';
          }
          
          // Ensure the ad element itself has proper dimensions
          if (ad.offsetWidth === 0) {
            ad.style.minWidth = '300px';
            ad.style.minHeight = '250px';
            ad.style.display = 'block';
          }
          
          (adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.log('Ad loading error:', e);
          // Add placeholder content for failed ads
          if (!ad.innerHTML) {
            ad.innerHTML = '<div style="background: #f0f0f0; padding: 20px; text-align: center; color: #666; border: 1px dashed #ccc;">Advertisement</div>';
          }
        }
      });
    } else {
      console.log('AdSense not loaded yet, retrying in 2 seconds');
      setTimeout(initializeAds, 2000);
    }
  }, 1500);
}

// Analytics and tracking
function initializeAnalytics() {
  // Track page view
  trackEvent('page_view', { 
    page_title: document.title,
    page_location: window.location.href
  });
}

function trackEvent(eventName, parameters = {}) {
  // Google Analytics 4
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, {
      event_category: 'Skincare Blog',
      ...parameters
    });
  }
  
  console.log('Event tracked:', eventName, parameters);
}

// Utility functions
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function handleImageError(img) {
  const fallback = 'data:image/svg+xml,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200">
      <rect width="400" height="200" fill="#f8b4cb" opacity="0.1"/>
      <text x="200" y="100" text-anchor="middle" fill="#f8b4cb" font-family="Arial" font-size="16">
        ✨ Image Loading...
      </text>
    </svg>
  `);
  
  if (img.src !== fallback) {
    img.src = fallback;
    img.alt = 'Image unavailable';
  }
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()">&times;</button>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}

function showErrorMessage(message) {
  showNotification(message, 'error');
}

// Product recommendations (placeholder functions)
function showProductRecommendations() {
  const mainContent = document.getElementById('mainContent');
  if (!mainContent) return;
  
  mainContent.innerHTML = `
    <div class="product-recommendations">
      <h2>Product Recommendations</h2>
      <p>Our curated selection of skincare products for every skin type and concern.</p>
      <div class="coming-soon">
        <h3>🚀 Coming Soon!</h3>
        <p>We're carefully curating the best skincare product recommendations for you.</p>
      </div>
    </div>
  `;
}

function showAboutSection() {
  const mainContent = document.getElementById('mainContent');
  if (!mainContent) return;
  
  mainContent.innerHTML = `
    <div class="about-section">
      <h2>About GlowUp Beauty</h2>
      <p>Welcome to GlowUp Beauty, your trusted source for expert skincare advice, beauty tips, and wellness guides.</p>
      <p>Our mission is to help you discover your best skin through science-backed information, honest product reviews, and practical routines that fit your lifestyle.</p>
      <p>Whether you're a skincare beginner or enthusiast, we're here to guide you on your journey to healthy, radiant skin.</p>
    </div>
  `;
}

function showContactSection() {
  const mainContent = document.getElementById('mainContent');
  if (!mainContent) return;
  
  mainContent.innerHTML = `
    <div class="contact-section">
      <h2>Get In Touch</h2>
      <p>Have questions about skincare? Want to collaborate? We'd love to hear from you!</p>
      <div class="contact-info">
        <p>📧 Email: hello@glowupbeauty.com</p>
        <p>📱 Social: @glowupbeauty on Instagram & TikTok</p>
        <p>💌 Newsletter: Subscribe above for weekly beauty tips</p>
      </div>
    </div>
  `;
}

// Export for global use
window.openArticle = openArticle;
window.closeModal = closeModal;
window.filterArticlesByCategory = filterArticlesByCategory;
window.handleImageError = handleImageError;
window.scrollToSection = scrollToSection;
window.openSkinQuiz = openSkinQuiz;
window.handleNewsletterSubmit = handleNewsletterSubmit;

// Analytics Class
class Analytics {
  static trackEvent(eventName, parameters = {}) {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
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
