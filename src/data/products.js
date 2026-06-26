// ============================================================
// SUIIS BEAUTY - Complete Product Database
// 32 products across 6 categories
// ============================================================

export const ALL_PRODUCTS = [

  // ========== LIPS ==========
  {
    _id: "lip001",
    name: "Velvet Noir Matte Lipstick",
    brand: "SUIIS",
    price: 849,
    originalPrice: 1200,
    category: "Lips",
    subcategory: "Lipstick",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&q=80",
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80"
    ],
    description: "A luxuriously pigmented matte lipstick that delivers rich, velvety color with an ultra-comfortable wear. Enriched with vitamin E and jojoba oil for all-day hydration.",
    benefits: ["12-hour wear", "Hydrating formula", "Transfer-proof"],
    shades: ["#8B1A1A", "#C41E3A", "#722F37", "#DC143C", "#B22222"],
    rating: 4.8,
    reviews: 234,
    stock: 45,
    isNew: false,
    isBestseller: true,
    isFeatured: true,
    tags: ["matte", "long-lasting", "vegan"]
  },
  {
    _id: "lip002",
    name: "Crystal Gloss Lip Treatment",
    brand: "SUIIS",
    price: 699,
    originalPrice: 999,
    category: "Lips",
    subcategory: "Lip Gloss",
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&q=80"
    ],
    description: "High-shine lip gloss infused with hyaluronic acid and peptides for plumping and hydrating effects. Creates the illusion of fuller lips.",
    benefits: ["Plumping effect", "24hr hydration", "Non-sticky"],
    shades: ["#FFB6C1", "#FF69B4", "#C71585", "#FFE4E1", "#FFA07A"],
    rating: 4.6,
    reviews: 186,
    stock: 60,
    isNew: true,
    isBestseller: false,
    isFeatured: true,
    tags: ["glossy", "plumping", "hydrating"]
  },
  {
    _id: "lip003",
    name: "Satin Kiss Lip Liner",
    brand: "SUIIS",
    price: 449,
    originalPrice: 649,
    category: "Lips",
    subcategory: "Lip Liner",
    image: "https://images.unsplash.com/photo-1583241800862-0820b6c0c2b3?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1583241800862-0820b6c0c2b3?w=600&q=80"
    ],
    description: "Precision lip liner with a creamy formula that glides on effortlessly. Long-wearing and smudge-proof for perfect lip definition.",
    benefits: ["Precision tip", "Smudge-proof", "Rich pigment"],
    shades: ["#8B0000", "#C71585", "#B22222", "#CD5C5C", "#FFA07A"],
    rating: 4.5,
    reviews: 124,
    stock: 80,
    isNew: false,
    isBestseller: false,
    isFeatured: false,
    tags: ["precision", "long-lasting", "define"]
  },
  {
    _id: "lip004",
    name: "Luxe Liquid Velvet Lip",
    brand: "SUIIS",
    price: 949,
    originalPrice: 1399,
    category: "Lips",
    subcategory: "Liquid Lipstick",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80"
    ],
    description: "Award-winning liquid lipstick that sets to a breathtakingly beautiful velvet finish. Intensely pigmented with our proprietary VelvetSet formula.",
    benefits: ["Velvet finish", "16-hour wear", "Feather-proof"],
    shades: ["#722F37", "#800020", "#C41E3A", "#8B008B", "#4B0082"],
    rating: 4.9,
    reviews: 312,
    stock: 35,
    isNew: false,
    isBestseller: true,
    isFeatured: true,
    tags: ["liquid", "velvet", "long-wearing", "bestseller"]
  },

  // ========== EYES ==========
  {
    _id: "eye001",
    name: "Noir Dramatique Eye Palette",
    brand: "SUIIS",
    price: 1699,
    originalPrice: 2499,
    category: "Eyes",
    subcategory: "Eye Shadow",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80"
    ],
    description: "A curated 18-pan palette of neutral-to-smokey shades. Features 6 matte, 6 satin, and 6 metallic shades with our HyperBlend pigment technology.",
    benefits: ["18 shades", "Ultra-blendable", "Long-lasting"],
    shades: [],
    rating: 4.9,
    reviews: 445,
    stock: 28,
    isNew: false,
    isBestseller: true,
    isFeatured: true,
    tags: ["palette", "smokey", "dramatic", "bestseller"]
  },
  {
    _id: "eye002",
    name: "Lash Amplify Volume Mascara",
    brand: "SUIIS",
    price: 799,
    originalPrice: 1149,
    category: "Eyes",
    subcategory: "Mascara",
    image: "https://images.unsplash.com/photo-1583241800862-0820b6c0c2b3?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1583241800862-0820b6c0c2b3?w=600&q=80"
    ],
    description: "Buildable volume mascara with a specially designed hourglass brush. Waterproof formula that holds curls and resists smudging all day.",
    benefits: ["Waterproof", "Buildable volume", "Lash conditioning"],
    shades: ["#000000", "#1a1a1a"],
    rating: 4.7,
    reviews: 289,
    stock: 55,
    isNew: false,
    isBestseller: true,
    isFeatured: false,
    tags: ["waterproof", "volume", "mascara"]
  },
  {
    _id: "eye003",
    name: "Precision Wing Eyeliner",
    brand: "SUIIS",
    price: 649,
    originalPrice: 899,
    category: "Eyes",
    subcategory: "Eyeliner",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80"
    ],
    description: "Jet-black liquid eyeliner with a 0.1mm precision tip. Creates perfect lines from subtle to bold. Dries in seconds, lasts all day.",
    benefits: ["0.1mm tip", "Quick-dry", "All-day wear"],
    shades: ["#000000", "#0a0a2e", "#1C1C1C"],
    rating: 4.6,
    reviews: 178,
    stock: 70,
    isNew: true,
    isBestseller: false,
    isFeatured: true,
    tags: ["precision", "wing", "black"]
  },
  {
    _id: "eye004",
    name: "Brow Sculptor Pencil",
    brand: "SUIIS",
    price: 549,
    originalPrice: 799,
    category: "Eyes",
    subcategory: "Brow",
    image: "https://images.unsplash.com/photo-1590156117763-d6a9f9e2f7ae?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1590156117763-d6a9f9e2f7ae?w=600&q=80"
    ],
    description: "Ultra-fine micro-precision brow pencil that mimics the look of natural brow hairs. Spoolie included for seamless blending.",
    benefits: ["Micro-precision", "Natural finish", "Spoolie included"],
    shades: ["#2C1503", "#5C3317", "#8B4513", "#D2B48C", "#C0C0C0"],
    rating: 4.5,
    reviews: 203,
    stock: 65,
    isNew: false,
    isBestseller: false,
    isFeatured: false,
    tags: ["brow", "natural", "define"]
  },

  // ========== FACE ==========
  {
    _id: "fac001",
    name: "Luminous Skin Foundation",
    brand: "SUIIS",
    price: 1499,
    originalPrice: 1999,
    category: "Face",
    subcategory: "Foundation",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80"
    ],
    description: "A buildable coverage foundation with a natural-luminous finish. Enriched with hyaluronic acid, peptides and SPF 30 for skin-loving benefits.",
    benefits: ["SPF 30", "24hr hydration", "Buildable coverage", "40 shades"],
    shades: [],
    rating: 4.8,
    reviews: 521,
    stock: 40,
    isNew: false,
    isBestseller: true,
    isFeatured: true,
    tags: ["spf", "foundation", "luminous", "bestseller"]
  },
  {
    _id: "fac002",
    name: "Ethereal Glow Highlighter",
    brand: "SUIIS",
    price: 999,
    originalPrice: 1399,
    category: "Face",
    subcategory: "Highlighter",
    image: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=600&q=80"
    ],
    description: "Finely-milled powder highlighter with light-reflecting particles. Buildable from subtle luminosity to blinding highlight.",
    benefits: ["Blinding glow", "Finely milled", "Buildable"],
    shades: ["#FFD700", "#FFF8DC", "#E8A0B4", "#C0C0C0", "#B8860B"],
    rating: 4.7,
    reviews: 267,
    stock: 50,
    isNew: true,
    isBestseller: false,
    isFeatured: true,
    tags: ["glow", "luminous", "highlight", "new"]
  },
  {
    _id: "fac003",
    name: "Silk Cloud Setting Powder",
    brand: "SUIIS",
    price: 849,
    originalPrice: 1199,
    category: "Face",
    subcategory: "Setting Powder",
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80"
    ],
    description: "Ultra-fine translucent setting powder that locks makeup in place for up to 16 hours. Blurs pores and imperfections for a flawless finish.",
    benefits: ["16hr wear", "Pore-blurring", "Feather-light"],
    shades: ["#FDF5E6", "#FAEBD7", "#F5DEB3"],
    rating: 4.6,
    reviews: 198,
    stock: 45,
    isNew: false,
    isBestseller: false,
    isFeatured: false,
    tags: ["setting", "translucent", "matte"]
  },
  {
    _id: "fac004",
    name: "Porcelain Conceal & Correct",
    brand: "SUIIS",
    price: 799,
    originalPrice: 1099,
    category: "Face",
    subcategory: "Concealer",
    image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=600&q=80"
    ],
    description: "High-coverage concealer that neutralizes discoloration and covers dark circles. Lightweight yet full-coverage with skincare benefits.",
    benefits: ["Full coverage", "Crease-proof", "Hydrating"],
    shades: [],
    rating: 4.7,
    reviews: 334,
    stock: 55,
    isNew: false,
    isBestseller: true,
    isFeatured: false,
    tags: ["concealer", "coverage", "dark circles", "bestseller"]
  },
  {
    _id: "fac005",
    name: "Rose Petal Blush Powder",
    brand: "SUIIS",
    price: 749,
    originalPrice: 999,
    category: "Face",
    subcategory: "Blush",
    image: "https://images.unsplash.com/photo-1590156117763-d6a9f9e2f7ae?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1590156117763-d6a9f9e2f7ae?w=600&q=80"
    ],
    description: "Silky powder blush with a natural satin finish. Infused with rose extract for a healthy, flushed look that lasts all day.",
    benefits: ["Natural flush", "Long-lasting", "Buildable"],
    shades: ["#FFB6C1", "#FF69B4", "#DB7093", "#FFC0CB", "#E75480"],
    rating: 4.6,
    reviews: 156,
    stock: 60,
    isNew: false,
    isBestseller: false,
    isFeatured: true,
    tags: ["blush", "natural", "rose"]
  },
  {
    _id: "fac006",
    name: "Silk Hydrating Primer",
    brand: "SUIIS",
    price: 999,
    originalPrice: 1399,
    category: "Face",
    subcategory: "Primer",
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&q=80"
    ],
    description: "Silicone-free hydrating primer that creates the perfect canvas for makeup. Fills pores and fine lines for a smooth, long-lasting base.",
    benefits: ["Silicone-free", "Pore-filling", "Hydrating"],
    shades: [],
    rating: 4.5,
    reviews: 189,
    stock: 48,
    isNew: false,
    isBestseller: false,
    isFeatured: false,
    tags: ["primer", "hydrating", "smooth"]
  },
  {
    _id: "fac007",
    name: "Mist & Fix Setting Spray",
    brand: "SUIIS",
    price: 899,
    originalPrice: 1199,
    category: "Face",
    subcategory: "Setting Spray",
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80"
    ],
    description: "Award-winning setting spray that locks makeup for up to 16 hours. Reduces powder look for a natural, skin-like finish.",
    benefits: ["16hr hold", "Dew finish", "Anti-oxidant rich"],
    shades: [],
    rating: 4.8,
    reviews: 412,
    stock: 52,
    isNew: false,
    isBestseller: true,
    isFeatured: false,
    tags: ["setting", "spray", "long-lasting", "bestseller"]
  },
  {
    _id: "fac008",
    name: "Bronze Goddess Contour",
    brand: "SUIIS",
    price: 1099,
    originalPrice: 1499,
    category: "Face",
    subcategory: "Contour",
    image: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=600&q=80"
    ],
    description: "Contouring powder that sculpts and defines facial features. Cool-toned formula for a natural shadow effect.",
    benefits: ["Sculpting formula", "Natural finish", "Buildable"],
    shades: ["#8B6914", "#A0522D", "#D2691E", "#CD853F"],
    rating: 4.6,
    reviews: 221,
    stock: 38,
    isNew: true,
    isBestseller: false,
    isFeatured: true,
    tags: ["contour", "sculpt", "bronze", "new"]
  },

  // ========== SKIN CARE ==========
  {
    _id: "skn001",
    name: "Radiance Revival Serum",
    brand: "SUIIS",
    price: 2299,
    originalPrice: 2999,
    category: "Skincare",
    subcategory: "Serum",
    image: "https://images.unsplash.com/photo-1607346705624-8a9c9d2b7f6e?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1607346705624-8a9c9d2b7f6e?w=600&q=80"
    ],
    description: "Concentrated brightening serum with 10% Vitamin C, niacinamide, and ferulic acid. Visibly reduces dark spots and uneven skin tone.",
    benefits: ["Brightening", "Anti-aging", "Antioxidant protection"],
    shades: [],
    rating: 4.9,
    reviews: 389,
    stock: 30,
    isNew: false,
    isBestseller: true,
    isFeatured: true,
    tags: ["vitamin c", "brightening", "anti-aging", "bestseller"]
  },
  {
    _id: "skn002",
    name: "Velvet Cloud Moisturizer",
    brand: "SUIIS",
    price: 1799,
    originalPrice: 2399,
    category: "Skincare",
    subcategory: "Moisturizer",
    image: "https://images.unsplash.com/photo-1564164841584-391b5c7b590c?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1564164841584-391b5c7b590c?w=600&q=80"
    ],
    description: "Rich yet lightweight moisturizer with ceramides and peptides. 72-hour hydration that plumps and firms skin.",
    benefits: ["72hr hydration", "Firming", "Barrier repair"],
    shades: [],
    rating: 4.8,
    reviews: 267,
    stock: 35,
    isNew: false,
    isBestseller: false,
    isFeatured: true,
    tags: ["moisturizer", "hydrating", "firming"]
  },
  {
    _id: "skn003",
    name: "Midnight Repair Eye Cream",
    brand: "SUIIS",
    price: 1599,
    originalPrice: 2199,
    category: "Skincare",
    subcategory: "Eye Care",
    image: "https://images.unsplash.com/photo-1598452963314-b09f397a5c48?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1598452963314-b09f397a5c48?w=600&q=80"
    ],
    description: "Intensive overnight eye treatment with retinol, caffeine and gold particles. Reduces dark circles, puffiness and fine lines.",
    benefits: ["Retinol formula", "Reduces puffiness", "Dark circle correction"],
    shades: [],
    rating: 4.7,
    reviews: 198,
    stock: 40,
    isNew: true,
    isBestseller: false,
    isFeatured: true,
    tags: ["eye cream", "retinol", "anti-aging", "new"]
  },
  {
    _id: "skn004",
    name: "Pure Ritual Cleansing Oil",
    brand: "SUIIS",
    price: 1199,
    originalPrice: 1599,
    category: "Skincare",
    subcategory: "Cleanser",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80"
    ],
    description: "Gentle oil-based cleanser that melts away makeup and impurities. Transforms to silky milk on contact with water.",
    benefits: ["Double cleansing", "Non-stripping", "Makeup remover"],
    shades: [],
    rating: 4.6,
    reviews: 156,
    stock: 45,
    isNew: false,
    isBestseller: false,
    isFeatured: false,
    tags: ["cleanser", "oil", "gentle", "makeup remover"]
  },

  // ========== FRAGRANCE ==========
  {
    _id: "frg001",
    name: "Oud & Rose Elixir EDP",
    brand: "SUIIS",
    price: 3499,
    originalPrice: 4999,
    category: "Fragrance",
    subcategory: "Eau de Parfum",
    image: "https://images.unsplash.com/photo-1564294930745-c3fd9fc00d74?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1564294930745-c3fd9fc00d74?w=600&q=80"
    ],
    description: "An intoxicating blend of Bulgarian rose, dark oud wood, and amber. A signature SUIIS fragrance that lingers all day.",
    benefits: ["8-12hr longevity", "Sillage: moderate-strong", "Bottle: 50ml"],
    shades: [],
    rating: 4.9,
    reviews: 312,
    stock: 20,
    isNew: false,
    isBestseller: true,
    isFeatured: true,
    tags: ["fragrance", "oud", "rose", "bestseller", "luxury"]
  },
  {
    _id: "frg002",
    name: "Sakura Bloom Parfum",
    brand: "SUIIS",
    price: 2899,
    originalPrice: 3999,
    category: "Fragrance",
    subcategory: "Parfum",
    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&q=80"
    ],
    description: "A delicate floral fragrance featuring Japanese cherry blossom, white peony, and soft musk. Light and feminine.",
    benefits: ["6-8hr longevity", "Fresh floral", "Bottle: 30ml"],
    shades: [],
    rating: 4.7,
    reviews: 189,
    stock: 25,
    isNew: true,
    isBestseller: false,
    isFeatured: true,
    tags: ["fragrance", "floral", "sakura", "new"]
  },

  // ========== ACCESSORIES ==========
  {
    _id: "acc001",
    name: "Pro Artistry Brush Set 12pc",
    brand: "SUIIS",
    price: 2499,
    originalPrice: 3499,
    category: "Accessories",
    subcategory: "Brushes",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80"
    ],
    description: "Professional 12-piece brush set with synthetic taklon bristles. Includes all essential face and eye brushes in a luxury velvet roll case.",
    benefits: ["12 brushes", "Vegan bristles", "Velvet case"],
    shades: [],
    rating: 4.8,
    reviews: 421,
    stock: 18,
    isNew: false,
    isBestseller: true,
    isFeatured: true,
    tags: ["brushes", "professional", "vegan", "bestseller"]
  },
  {
    _id: "acc002",
    name: "Diamond Gua Sha Stone",
    brand: "SUIIS",
    price: 1299,
    originalPrice: 1799,
    category: "Accessories",
    subcategory: "Tools",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80"
    ],
    description: "Rose quartz gua sha facial tool for lymphatic drainage and facial sculpting. Promotes circulation and reduces puffiness.",
    benefits: ["Rose quartz", "Lymphatic drainage", "Anti-aging ritual"],
    shades: [],
    rating: 4.7,
    reviews: 234,
    stock: 30,
    isNew: true,
    isBestseller: false,
    isFeatured: true,
    tags: ["gua sha", "rose quartz", "facial", "new"]
  },
  {
    _id: "acc003",
    name: "Velvet Compact Mirror",
    brand: "SUIIS",
    price: 899,
    originalPrice: 1199,
    category: "Accessories",
    subcategory: "Mirrors",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80"
    ],
    description: "Double-sided compact mirror with 1x and 5x magnification. Wrapped in luxury velvet with a gold-plated frame.",
    benefits: ["1x & 5x magnification", "LED lighting", "Travel-size"],
    shades: ["#2C2C2C", "#8B0000", "#1C1C8B"],
    rating: 4.5,
    reviews: 178,
    stock: 35,
    isNew: false,
    isBestseller: false,
    isFeatured: false,
    tags: ["mirror", "travel", "luxury"]
  },
  {
    _id: "acc004",
    name: "Satin Makeup Bag",
    brand: "SUIIS",
    price: 1199,
    originalPrice: 1599,
    category: "Accessories",
    subcategory: "Bags",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80"
    ],
    description: "Luxurious satin makeup bag with gold zipper and multiple compartments. Perfect for travel or vanity storage.",
    benefits: ["Multiple pockets", "Water-resistant lining", "Gold hardware"],
    shades: ["#000000", "#FFC0CB", "#E8C998"],
    rating: 4.6,
    reviews: 167,
    stock: 25,
    isNew: false,
    isBestseller: false,
    isFeatured: false,
    tags: ["bag", "travel", "satin", "storage"]
  },
  {
    _id: "acc005",
    name: "Lash Curler Pro",
    brand: "SUIIS",
    price: 649,
    originalPrice: 849,
    category: "Accessories",
    subcategory: "Tools",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80"
    ],
    description: "Ergonomic lash curler with silicone pads that curl and lift lashes without pinching. Gold-plated stainless steel frame.",
    benefits: ["No pinching", "Long-lasting curl", "Gold-plated"],
    shades: [],
    rating: 4.4,
    reviews: 145,
    stock: 40,
    isNew: false,
    isBestseller: false,
    isFeatured: false,
    tags: ["lash", "curler", "tools"]
  },

  // ========== GIFT SETS ==========
  {
    _id: "gift001",
    name: "SUIIS Luxe Starter Collection",
    brand: "SUIIS",
    price: 3499,
    originalPrice: 5499,
    category: "Gift Sets",
    subcategory: "Starter",
    image: "https://images.unsplash.com/photo-1607346705624-8a9c9d2b7f6e?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1607346705624-8a9c9d2b7f6e?w=600&q=80"
    ],
    description: "The perfect introduction to SUIIS beauty. Includes 5 bestselling products in a stunning luxury gift box — ideal for gifting or starting your collection.",
    benefits: ["5 full-size products", "Luxury box", "Great value"],
    shades: [],
    rating: 4.9,
    reviews: 256,
    stock: 15,
    isNew: false,
    isBestseller: true,
    isFeatured: true,
    tags: ["gift", "set", "bestseller", "value"]
  },
  {
    _id: "gift002",
    name: "Golden Hour Glow Kit",
    brand: "SUIIS",
    price: 2799,
    originalPrice: 3999,
    category: "Gift Sets",
    subcategory: "Glow",
    image: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=600&q=80"
    ],
    description: "Everything you need for a radiant, luminous complexion. Includes our Ethereal Glow Highlighter, Luminous Foundation, and Mist & Fix Setting Spray.",
    benefits: ["3 products", "Glow-focused", "Gift-ready"],
    shades: [],
    rating: 4.8,
    reviews: 198,
    stock: 20,
    isNew: true,
    isBestseller: false,
    isFeatured: true,
    tags: ["gift", "glow", "set", "new"]
  },
  {
    _id: "gift003",
    name: "Bridal Beauty Collection",
    brand: "SUIIS",
    price: 4999,
    originalPrice: 7499,
    category: "Gift Sets",
    subcategory: "Bridal",
    image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=600&q=80"
    ],
    description: "The ultimate bridal beauty collection. Features long-wearing, transfer-proof products for makeup that lasts through tears of joy.",
    benefits: ["8 products", "Long-wearing formula", "Bridal packaging"],
    shades: [],
    rating: 4.9,
    reviews: 189,
    stock: 10,
    isNew: false,
    isBestseller: true,
    isFeatured: true,
    tags: ["bridal", "gift", "luxury", "wedding", "bestseller"]
  }
];

export const CATEGORIES = [
  { id: "all", name: "All Products", count: ALL_PRODUCTS.length },
  { id: "Lips", name: "Lips", count: ALL_PRODUCTS.filter(p => p.category === "Lips").length },
  { id: "Eyes", name: "Eyes", count: ALL_PRODUCTS.filter(p => p.category === "Eyes").length },
  { id: "Face", name: "Face", count: ALL_PRODUCTS.filter(p => p.category === "Face").length },
  { id: "Skincare", name: "Skincare", count: ALL_PRODUCTS.filter(p => p.category === "Skincare").length },
  { id: "Fragrance", name: "Fragrance", count: ALL_PRODUCTS.filter(p => p.category === "Fragrance").length },
  { id: "Accessories", name: "Accessories", count: ALL_PRODUCTS.filter(p => p.category === "Accessories").length },
  { id: "Gift Sets", name: "Gift Sets", count: ALL_PRODUCTS.filter(p => p.category === "Gift Sets").length },
];

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "bestseller", label: "Best Sellers" },
];

export const FEATURED_PRODUCTS = ALL_PRODUCTS.filter(p => p.isFeatured).slice(0, 8);
export const BESTSELLER_PRODUCTS = ALL_PRODUCTS.filter(p => p.isBestseller).slice(0, 6);
export const NEW_PRODUCTS = ALL_PRODUCTS.filter(p => p.isNew).slice(0, 4);

export const getProductById = (id) => ALL_PRODUCTS.find(p => p._id === id);

export const getRelatedProducts = (product, limit = 4) =>
  ALL_PRODUCTS
    .filter(p => p._id !== product._id && p.category === product.category)
    .slice(0, limit);