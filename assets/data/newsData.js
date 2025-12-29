// data/newsData.js - Clean skincare blog data
const newsData = [
  {
    id: 1,
    title: "The Complete 10-Step Korean Skincare Routine for Beginners",
    category: "Daily Routine",
    shortDescription: "Master the art of K-beauty with this comprehensive guide to building your perfect morning and evening routine.",
    fullContent: [
      "Korean skincare has revolutionized the beauty industry with its multi-step approach focusing on gentle, layered care that prioritizes skin health over quick fixes.",
      "The 10-step routine includes: oil cleanser, water-based cleanser, exfoliant, toner, essence, serum, sheet mask, eye cream, moisturizer, and SPF for morning.",
      "Start slowly with 3-4 steps and gradually build up. The key is consistency and using products suited to your specific skin type and concerns.",
      "Each step serves a purpose: cleansing removes impurities, toning balances pH, treatments target specific issues, and moisturizing locks in hydration for a healthy, glowing complexion."
    ],
    imageUrl: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    publishedAt: "2024-12-20T09:00:00Z",
    tags: ["K-Beauty", "Beginner-Friendly", "Routine"],
    isFeatured: true,
    isTrending: true,
    readTime: "8 min read",
    articleUrl: "pages/korean-skincare-routine-guide.html"
  },
  {
    id: 2,
    title: "Retinol vs. Retinoids: Which Anti-Aging Powerhouse is Right for You?",
    category: "Skin Improvement",
    shortDescription: "Decode the difference between retinol and retinoids to choose the best anti-aging treatment for your skin.",
    fullContent: [
      "Retinol and retinoids are vitamin A derivatives that boost cell turnover, reduce fine lines, and improve skin texture, but they work at different strengths.",
      "Over-the-counter retinol is gentler and perfect for beginners, while prescription retinoids like tretinoin are more potent for advanced anti-aging needs.",
      "Start with retinol 2-3 times per week, always use SPF during the day, and introduce slowly to avoid irritation and dryness.",
      "Both ingredients can transform your skin over 3-6 months, revealing smoother texture, reduced hyperpigmentation, and a more youthful, radiant complexion."
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    publishedAt: "2024-12-18T14:30:00Z",
    tags: ["Anti-Aging", "Ingredients", "Expert Guide"],
    isFeatured: true,
    isTrending: false,
    readTime: "6 min read",
    articleUrl: "pages/retinol-vs-retinoids-guide.html"
  },
  {
    id: 3,
    title: "Natural DIY Face Masks: 5 Kitchen Ingredients for Glowing Skin",
    category: "Skincare Tips",
    shortDescription: "Transform your kitchen into a spa with these simple, effective DIY face masks using ingredients you already have.",
    fullContent: [
      "Natural face masks can be just as effective as expensive treatments when you know which ingredients work for your skin type.",
      "Honey is antibacterial and moisturizing, oatmeal gently exfoliates, turmeric reduces inflammation, avocado nourishes, and yogurt contains natural acids.",
      "Mix honey with oatmeal for sensitive skin, combine turmeric with yogurt for brightening, or mash avocado with honey for intense hydration.",
      "Use DIY masks 1-2 times per week, always patch test first, and follow with your regular skincare routine for best results."
    ],
    imageUrl: "https://images.unsplash.com/photo-1570554886111-e80fcac4feb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    publishedAt: "2024-12-16T11:15:00Z",
    tags: ["DIY", "Natural", "Budget-Friendly"],
    isFeatured: false,
    isTrending: true,
    readTime: "5 min read",
    articleUrl: "pages/diy-face-masks-guide.html"
  },
  {
    id: 4,
    title: "The Ultimate Guide to Treating Hormonal Acne Naturally",
    category: "Skin Improvement",
    shortDescription: "Understand the root causes of hormonal acne and discover gentle, effective treatments for clearer skin.",
    fullContent: [
      "Hormonal acne typically appears around the jawline and chin, fluctuating with menstrual cycles, and requires a holistic approach beyond topical treatments.",
      "Key strategies include balancing hormones through diet, managing stress, using gentle skincare with salicylic acid or niacinamide, and avoiding over-cleansing.",
      "Foods rich in omega-3s, zinc, and probiotics can help, while dairy and high-glycemic foods may worsen breakouts for some people.",
      "Be patient - hormonal acne takes 3-6 months to improve with consistent treatment, and working with a dermatologist can provide additional prescription options."
    ],
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    publishedAt: "2024-12-14T16:45:00Z",
    tags: ["Acne Treatment", "Hormonal Health", "Natural Remedies"],
    isFeatured: false,
    isTrending: true,
    readTime: "7 min read",
    articleUrl: "pages/hormonal-acne-treatment-guide.html"
  },
  {
    id: 5,
    title: "Vitamin C Serums: Your Complete Guide to Brighter, More Even Skin",
    category: "Product Reviews",
    shortDescription: "Everything you need to know about vitamin C serums, from choosing the right formula to maximizing results.",
    fullContent: [
      "Vitamin C is a potent antioxidant that brightens skin, fades dark spots, boosts collagen production, and protects against environmental damage.",
      "Look for stable forms like magnesium ascorbyl phosphate or sodium ascorbyl phosphate if you have sensitive skin, or L-ascorbic acid for maximum potency.",
      "Apply vitamin C serum in the morning before moisturizer and SPF, start with lower concentrations (10-15%), and store in a cool, dark place.",
      "Results typically appear after 4-6 weeks of consistent use, with continued improvement in skin brightness, texture, and overall radiance over time."
    ],
    imageUrl: "https://images.unsplash.com/photo-1620916297893-84c16684bc52?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    publishedAt: "2024-12-12T10:20:00Z",
    tags: ["Vitamin C", "Serums", "Brightening"],
    isFeatured: true,
    isTrending: false,
    readTime: "6 min read",
    articleUrl: "pages/retinol-vs-retinoids-guide.html"
  },
  {
    id: 6,
    title: "Sensitive Skin SOS: Building a Gentle Yet Effective Routine",
    category: "Daily Routine",
    shortDescription: "Learn how to care for sensitive skin with gentle products and techniques that won't cause irritation.",
    fullContent: [
      "Sensitive skin requires a minimalist approach with fragrance-free, hypoallergenic products that focus on barrier repair and gentle care.",
      "Essential steps include a mild cleanser, alcohol-free toner, gentle moisturizer with ceramides, and broad-spectrum SPF 30 or higher.",
      "Avoid common irritants like fragrances, essential oils, alcohol, and over-exfoliation. Introduce new products one at a time to identify triggers.",
      "Key ingredients for sensitive skin include niacinamide, hyaluronic acid, centella asiatica, and ceramides, which soothe and strengthen the skin barrier."
    ],
    imageUrl: "https://images.unsplash.com/photo-1583001742209-98b0cc2d3476?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    publishedAt: "2024-12-10T13:00:00Z",
    tags: ["Sensitive Skin", "Gentle Care", "Barrier Repair"],
    isFeatured: false,
    isTrending: false,
    readTime: "5 min read",
    articleUrl: "pages/diy-face-masks-guide.html"
  },
  {
    id: 7,
    title: "The Science Behind Hyaluronic Acid: Hydration Hero or Hype?",
    category: "Skincare Tips",
    shortDescription: "Discover why hyaluronic acid is the ultimate hydration ingredient and how to use it effectively.",
    fullContent: [
      "Hyaluronic acid can hold up to 1000 times its weight in water, making it the most effective hydrating ingredient in skincare.",
      "It works by drawing moisture from the environment and deeper skin layers to plump the surface, reducing fine lines and creating a dewy glow.",
      "Apply hyaluronic acid to damp skin and follow with a moisturizer to lock in hydration. It works for all skin types, including oily and acne-prone skin.",
      "Look for serums with multiple molecular weights for maximum penetration, and use both morning and evening for optimal hydration benefits."
    ],
    imageUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    publishedAt: "2024-12-08T15:30:00Z",
    tags: ["Hyaluronic Acid", "Hydration", "Science"],
    isFeatured: false,
    isTrending: true,
    readTime: "4 min read",
    articleUrl: "pages/korean-skincare-routine-guide.html"
  },
  {
    id: 8,
    title: "Sunscreen 101: Protecting Your Skin Investment Daily",
    category: "Daily Routine",
    shortDescription: "Master the art of sun protection with this comprehensive guide to choosing and applying sunscreen correctly.",
    fullContent: [
      "SPF 30 blocks 97% of UV rays while SPF 50 blocks 98% - the difference is minimal, but broad-spectrum protection against both UVA and UVB is crucial.",
      "Apply 1/4 teaspoon of sunscreen to your face and neck 15 minutes before sun exposure, and reapply every 2 hours or after swimming/sweating.",
      "Chemical sunscreens absorb UV rays while mineral sunscreens (zinc oxide, titanium dioxide) create a physical barrier - both are effective when used properly.",
      "Make sunscreen the final step in your morning routine, under makeup if worn, and consider SPF-containing moisturizers for daily convenience."
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    publishedAt: "2024-12-06T08:45:00Z",
    tags: ["SPF", "Sun Protection", "Daily Care"],
    isFeatured: true,
    isTrending: false,
    readTime: "5 min read",
    articleUrl: "pages/hormonal-acne-treatment-guide.html"
  }
];

// Product recommendations data
const productRecommendations = [
  {
    id: 1,
    name: "CeraVe Foaming Facial Cleanser",
    category: "Cleanser",
    skinTypes: ["Normal", "Oily", "Combination"],
    description: "Gentle foaming cleanser with ceramides and hyaluronic acid that removes makeup and excess oil without stripping the skin.",
    keyIngredients: ["Ceramides", "Hyaluronic Acid", "Niacinamide"],
    benefits: ["Deep Cleansing", "Barrier Repair", "Non-comedogenic"],
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    priceRange: "$8-12"
  },
  {
    id: 2,
    name: "The Ordinary Niacinamide 10% + Zinc 1%",
    category: "Serum",
    skinTypes: ["Oily", "Acne-Prone", "Combination"],
    description: "High-concentration niacinamide serum that reduces appearance of blemishes and regulates oil production.",
    keyIngredients: ["Niacinamide", "Zinc PCA"],
    benefits: ["Oil Control", "Pore Minimizing", "Blemish Reduction"],
    imageUrl: "https://images.unsplash.com/photo-1620916297893-84c16684bc52?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    priceRange: "$6-8"
  }
];

// Categories data  
const categories = [
  { name: "Daily Routine", icon: "🌅", count: 15 },
  { name: "Skincare Tips", icon: "💫", count: 23 },
  { name: "Product Reviews", icon: "🧴", count: 18 },
  { name: "Skin Improvement", icon: "✨", count: 12 },
  { name: "Anti-Aging", icon: "🌟", count: 9 },
  { name: "Acne Treatment", icon: "🎯", count: 7 },
  { name: "Natural Skincare", icon: "🌿", count: 14 },
  { name: "Sensitive Skin", icon: "💝", count: 8 }
];

// Export to global scope for browser use
window.newsData = newsData;
window.productRecommendations = productRecommendations; 
window.categories = categories;
