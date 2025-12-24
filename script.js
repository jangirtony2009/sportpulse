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
               data-ad-client="ca-pub-3321370711396739"
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
      let needsRetry = false;
      ads.forEach((ad) => {
        try {
          if (ad.offsetWidth === 0 || ad.offsetHeight === 0) {
            needsRetry = true;
            return;
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
      if (needsRetry) {
        setTimeout(initializeAds, 1000);
      }
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
