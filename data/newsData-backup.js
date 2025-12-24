// data/newsData.js
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
    articleUrl: "korean-skincare-routine-guide.html"
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
    articleUrl: "retinol-vs-retinoids-guide.html"
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
    articleUrl: "diy-face-masks-guide.html"
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
    articleUrl: "hormonal-acne-treatment-guide.html"
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
    articleUrl: "vitamin-c-serums-guide.html"
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
    articleUrl: "sensitive-skin-routine.html"
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
    articleUrl: "hyaluronic-acid-guide.html"
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
    articleUrl: "sunscreen-guide.html"
  }
];

// Export to global scope
window.newsData = newsData;

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
  },
  {
    id: 3,
    name: "Neutrogena Ultra Sheer Dry-Touch Sunscreen SPF 100+",
    category: "Sunscreen",
    skinTypes: ["All Skin Types"],
    description: "Lightweight, non-greasy sunscreen with Helioplex technology for superior broad-spectrum protection.",
    keyIngredients: ["Avobenzone", "Homosalate", "Octisalate"],
    benefits: ["Broad Spectrum", "Water Resistant", "Non-comedogenic"],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    priceRange: "$8-15"
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

// Export data
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { skincareData, productRecommendations, categories };
}
      "In reply, India’s top order played with controlled aggression, chasing down the target with several overs to spare.",
      "The series win will be a major confidence boost heading into the T20 World Cup later this year."
    ],
    imageUrl:
      "https://images.pexels.com/photos/2699488/pexels-photo-2699488.jpeg?auto=compress&cs=tinysrgb&w=1200",
    publishedAt: "2025-12-05T18:30:00Z",
    tags: ["Series Win", "T20"],
    isFeatured: false,
    isTrending: true
  },
  {
    id: 3,
    title: "LeBron Drops 40 as Lakers Edge Warriors in OT Thriller",
    category: "NBA",
    shortDescription:
      "LeBron James turned back the clock with a 40-point masterpiece in a statement win.",
    fullContent: [
      "In a game that featured multiple lead changes and clutch shots from both teams, LeBron James delivered yet another iconic performance.",
      "The 40-year-old star logged 40 points, 9 rebounds, and 7 assists in 42 minutes, including a crucial three-pointer in overtime.",
      "The Warriors fought hard behind Steph Curry’s 34 points, but late turnovers proved costly down the stretch.",
      "With the win, the Lakers strengthened their position in the Western Conference playoff race."
    ],
    imageUrl:
      "https://images.pexels.com/photos/1103829/pexels-photo-1103829.jpeg?auto=compress&cs=tinysrgb&w=1200",
    publishedAt: "2025-12-04T04:10:00Z",
    tags: ["Top Story", "Overtime"],
    isFeatured: false,
    isTrending: true
  },
  {
    id: 4,
    title: "Verstappen Dominates Wet Conditions to Win Chaotic F1 Grand Prix",
    category: "F1",
    shortDescription:
      "Changing weather and safety cars defined a wild race that saw Verstappen remain ice-cold under pressure.",
    fullContent: [
      "Rain showers and rapidly changing grip levels made for one of the most unpredictable races of the F1 season.",
      "Max Verstappen executed flawless strategy calls and kept the car on track while many rivals slid off in the tricky conditions.",
      "Multiple safety car periods and a late red flag compressed the field, but Verstappen controlled both restarts with composure.",
      "The victory further extends his lead in the drivers’ standings and solidifies his dominance in the current era."
    ],
    imageUrl:
      "https://images.pexels.com/photos/1163002/pexels-photo-1163002.jpeg?auto=compress&cs=tinysrgb&w=1200",
    publishedAt: "2025-12-01T14:00:00Z",
    tags: ["Grand Prix", "Rain Race"],
    isFeatured: false,
    isTrending: false
  },
  {
    id: 5,
    title: "Djokovic Survives Five-Set Epic to Reach Another Grand Slam Final",
    category: "Tennis",
    shortDescription:
      "The world number one dug deep in a physical and mental battle that lasted over four hours.",
    fullContent: [
      "Novak Djokovic showcased his legendary resilience once again, clawing back from two sets to one down in a gripping semifinal.",
      "The match was filled with breathtaking rallies, strategic shot-making, and momentum swings that kept the crowd on their feet.",
      "Djokovic tightened his game in the final set, cutting down errors while raising his first-serve percentage at the key moments.",
      "With the victory, he moves into yet another Grand Slam final, chasing history and adding to his record-breaking legacy."
    ],
    imageUrl:
      "https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=1200",
    publishedAt: "2025-11-30T17:20:00Z",
    tags: ["Grand Slam", "Five Sets"],
    isFeatured: false,
    isTrending: true
  },
  {
    id: 6,
    title: "Late Knockout Stuns Arena as Underdog Claims UFC Title",
    category: "UFC",
    shortDescription:
      "A shocking spinning elbow in the championship rounds changed everything in an instant.",
    fullContent: [
      "In one of the biggest upsets of the year, a heavy underdog delivered a highlight-reel knockout to claim UFC gold.",
      "The champion controlled much of the early action with crisp striking and effective grappling along the fence.",
      "But in the fourth round, as both fighters began to slow, the challenger unleashed a perfectly timed spinning elbow that landed flush.",
      "The referee waved it off immediately, and the MMA world was left buzzing as a new star was born in dramatic fashion."
    ],
    imageUrl:
      "https://images.pexels.com/photos/4761790/pexels-photo-4761790.jpeg?auto=compress&cs=tinysrgb&w=1200",
    publishedAt: "2025-11-28T03:40:00Z",
    tags: ["Title Fight", "KO"],
    isFeatured: false,
    isTrending: false
  },
  {
    id: 7,
    title: "City Put Five Past Rivals in Statement League Victory",
    category: "Football",
    shortDescription:
      "A ruthless attacking display sent a clear message to the rest of the league.",
    fullContent: [
      "From the opening whistle, City played with intensity and purpose, pressing high and moving the ball with trademark precision.",
      "Their front line combined fluid interchanges with clinical finishing, racing out to a three-goal lead before halftime.",
      "The visitors never truly recovered, and City added two more in the second half to complete a resounding 5–0 win.",
      "The performance reasserts their status as favorites in the title race and piles pressure on their closest rivals."
    ],
    imageUrl:
      "https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=1200",
    publishedAt: "2025-11-26T16:15:00Z",
    tags: ["League", "Big Win"],
    isFeatured: false,
    isTrending: false
  },
  {
    id: 8,
    title: "Rookie Drops Career-High 38 Points in Breakout NBA Performance",
    category: "NBA",
    shortDescription:
      "A first-year guard stole the show with an electric scoring display against a title contender.",
    fullContent: [
      "The highly touted rookie announced his arrival on the big stage with a spectacular 38-point performance.",
      "He attacked the rim fearlessly, hit contested threes, and energized the crowd with highlight-reel plays in transition.",
      "Coaches and teammates praised his poise and shot selection, noting that he never forced the issue despite his hot hand.",
      "If this game is any indication, a new star may be emerging in the league faster than anyone expected."
    ],
    imageUrl:
      "https://images.pexels.com/photos/1103832/pexels-photo-1103832.jpeg?auto=compress&cs=tinysrgb&w=1200",
    publishedAt: "2025-11-24T02:30:00Z",
    tags: ["Rookie Watch"],
    isFeatured: false,
    isTrending: false
  },
  {
    id: 9,
    title: "England Edge Pakistan in Low-Scoring ODI Nail-Biter",
    category: "Cricket",
    shortDescription:
      "Bowlers dominated as both sides struggled on a tricky surface before England held their nerve at the death.",
    fullContent: [
      "On a pitch offering movement and grip for the bowlers, run-scoring never came easy for either side.",
      "Pakistan’s seamers were relentless with the new ball, reducing England to a precarious position inside the first 10 overs.",
      "But a gritty middle-order partnership steadied the innings and inched the total to something just about defendable.",
      "In reply, England’s bowlers applied similar pressure, and a nervy final over saw them cling on for a dramatic three-run victory."
    ],
    imageUrl:
      "https://images.pexels.com/photos/2699483/pexels-photo-2699483.jpeg?auto=compress&cs=tinysrgb&w=1200",
    publishedAt: "2025-11-20T13:05:00Z",
    tags: ["ODI", "Thriller"],
    isFeatured: false,
    isTrending: false
  },
  {
    id: 10,
    title: "Ferrari Unveil Bold New Concept Car Ahead of Next F1 Season",
    category: "F1",
    shortDescription:
      "A radical sidepod and floor design headline Ferrari’s ambitious push to close the gap to the front.",
    fullContent: [
      "Ferrari have revealed an aggressive new car concept as they look to mount a serious title challenge next season.",
      "The design focuses heavily on improved airflow to the rear wing and diffuser, aiming to unlock more downforce without sacrificing straight-line speed.",
      "Team engineers say the new floor is the result of months of simulation and wind-tunnel testing, with several innovative solutions hidden from plain sight.",
      "If the package performs as expected, Ferrari could finally have the consistency needed to take the fight to their main rivals over a full season."
    ],
    imageUrl:
      "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=1200",
    publishedAt: "2025-11-18T10:00:00Z",
    tags: ["Tech Reveal"],
    isFeatured: false,
    isTrending: false
  }
];
