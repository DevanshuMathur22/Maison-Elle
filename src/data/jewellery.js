export const products = [
  {
    slug:"golden-hour",
    code:"ME-001",
    name:"The Golden Hour",
    category:"Earrings",
    collection:"Everyday Edit",
    image:"https://images.unsplash.com/photo-1630019852942-f89202989a59?w=1200&q=85",
    description:"A graceful statement for everyday moments and special evenings.",
    material:"Fashion jewellery with a gold-tone finish"
  },
  {
    slug:"little-romance",
    code:"ME-002",
    name:"A Little Romance",
    category:"Necklaces",
    collection:"Everyday Edit",
    image:"https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1200&q=85",
    description:"A delicate detail designed to bring warmth to your favourite looks.",
    material:"Fashion jewellery with a gold-tone finish"
  },
  {
    slug:"afterglow",
    code:"ME-003",
    name:"Afterglow",
    category:"Earrings",
    collection:"Little Statements",
    image:"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&q=85",
    description:"An expressive piece for the moments worth remembering.",
    material:"Fashion jewellery with a gold-tone finish"
  }
];

export const enquiry = (product) => {
  const message = product
    ? `Hello, I would like to know the price, availability and ordering details for ${product.name} (${product.code}).`
    : "Hello, I would like to explore your jewellery collection and enquire about prices.";
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};
