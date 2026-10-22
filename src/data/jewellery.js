export const products = [
  {
    "slug": "flower-tealight-duo",
    "code": "CJ-001",
    "name": "Flower Tea Candle Holders",
    "category": "Festive Décor",
    "collection": "Festive Décor",
    "image": "/products/flower-tealight-duo.webp",
    "description": "Explore Flower Tea Candle Holders, part of our curated festive décor collection.",
    "material": "Product details available upon enquiry."
  },
  {
    "slug": "orange-flower-tealight",
    "code": "CJ-002",
    "name": "Orange Floral Tea Candle Holder",
    "category": "Festive Décor",
    "collection": "Festive Décor",
    "image": "/products/orange-flower-tealight.webp",
    "description": "Explore Orange Floral Tea Candle Holder, part of our curated festive décor collection.",
    "material": "Product details available upon enquiry."
  },
  {
    "slug": "shubh-labh-hanging",
    "code": "CJ-003",
    "name": "Shubh Labh Floral Hanging",
    "category": "Festive Décor",
    "collection": "Festive Décor",
    "image": "/products/shubh-labh-hanging.webp",
    "description": "Explore Shubh Labh Floral Hanging, part of our curated festive décor collection.",
    "material": "Product details available upon enquiry."
  },
  {
    "slug": "floral-tealight-handheld",
    "code": "CJ-004",
    "name": "Floral Handheld Candle Holder",
    "category": "Festive Décor",
    "collection": "Festive Décor",
    "image": "/products/floral-tealight-handheld.webp",
    "description": "Explore Floral Handheld Candle Holder, part of our curated festive décor collection.",
    "material": "Product details available upon enquiry."
  },
  {
    "slug": "shubh-labh-blue-hangings",
    "code": "CJ-005",
    "name": "Shubh Labh Pearl Hangings",
    "category": "Festive Décor",
    "collection": "Festive Décor",
    "image": "/products/shubh-labh-blue-hangings.webp",
    "description": "Explore Shubh Labh Pearl Hangings, part of our curated festive décor collection.",
    "material": "Product details available upon enquiry."
  },
  {
    "slug": "pink-floral-hairband",
    "code": "CJ-006",
    "name": "Pink Floral Hairband",
    "category": "Hair Accessories",
    "collection": "Hair Accessories",
    "image": "/products/pink-floral-hairband.webp",
    "description": "Explore Pink Floral Hairband, part of our curated hair accessories collection.",
    "material": "Product details available upon enquiry."
  },
  {
    "slug": "floral-pearl-jewellery-set",
    "code": "CJ-007",
    "name": "Floral Pearl Jewellery Set",
    "category": "Floral Jewellery",
    "collection": "Floral Jewellery",
    "image": "/products/floral-pearl-jewellery-set.webp",
    "description": "Explore Floral Pearl Jewellery Set, part of our curated floral jewellery collection.",
    "material": "Product details available upon enquiry."
  },
  {
    "slug": "rose-pearl-bangles",
    "code": "CJ-008",
    "name": "Rose Pearl Bangles",
    "category": "Floral Jewellery",
    "collection": "Floral Jewellery",
    "image": "/products/rose-pearl-bangles.webp",
    "description": "Explore Rose Pearl Bangles, part of our curated floral jewellery collection.",
    "material": "Product details available upon enquiry."
  },
  {
    "slug": "pearl-phone-charm",
    "code": "CJ-009",
    "name": "Pearl Phone Charm",
    "category": "Accessories",
    "collection": "Accessories",
    "image": "/products/pearl-phone-charm.webp",
    "description": "Explore Pearl Phone Charm, part of our curated accessories collection.",
    "material": "Product details available upon enquiry."
  },
  {
    "slug": "beach-pearl-necklace",
    "code": "CJ-010",
    "name": "Beach Pearl Necklace",
    "category": "Pearl Jewellery",
    "collection": "Pearl Jewellery",
    "image": "/products/beach-pearl-necklace.webp",
    "description": "Explore Beach Pearl Necklace, part of our curated pearl jewellery collection.",
    "material": "Product details available upon enquiry."
  },
  {
    "slug": "korean-bow-pearl-necklace",
    "code": "CJ-011",
    "name": "Korean Bow Pearl Necklace",
    "category": "Pearl Jewellery",
    "collection": "Pearl Jewellery",
    "image": "/products/korean-bow-pearl-necklace.webp",
    "description": "Explore Korean Bow Pearl Necklace, part of our curated pearl jewellery collection.",
    "material": "Product details available upon enquiry."
  }
];

export const enquiry = (product) => {
  const message = product
    ? `Hello Vrinda Élle, I'm interested in ${product.name} (Product Code: ${product.code}). Please share its price, availability and ordering details.`
    : "Hello Vrinda Élle, I would like to explore your collection.";
  return `https://wa.me/919530079054?text=${encodeURIComponent(message)}`;
};
