export type Property = {
  id: string; title: string; city: string; area: string; type: string;
  beds: number; baths: number; price: number; frequency: string;
  image: string; images: string[]; verified: boolean; featured: boolean;
  description: string; amenities: string[]; landlord: string;
  agencyFee: number; agreementFee: number; cautionFee: number;
  status: "Available" | "Rented" | "Pending";
};

export const initialProperties: Property[] = [
  {
    id: "CHQ-1001", title: "Modern 2-bedroom apartment", city: "Ibadan", area: "Bodija",
    type: "Apartment", beds: 2, baths: 2, price: 1800000, frequency: "year",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85"
    ],
    verified: true, featured: true,
    description: "A bright, well-planned apartment in a convenient part of Bodija. The home features generous living space, fitted kitchen cabinetry and easy access to everyday essentials.",
    amenities: ["Fitted kitchen", "Water supply", "Secure compound", "Parking", "Tiled floors"],
    landlord: "Adebayo Properties", agencyFee: 0, agreementFee: 100000, cautionFee: 100000, status: "Available"
  },
  {
    id: "CHQ-1002", title: "Contemporary 3-bedroom terrace", city: "Lagos", area: "Lekki Phase 1",
    type: "Terrace", beds: 3, baths: 3, price: 6500000, frequency: "year",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=85",
    images: ["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=85"],
    verified: true, featured: true,
    description: "A contemporary terrace home with practical living spaces in a popular residential neighbourhood.",
    amenities: ["24-hour security", "Parking", "Fitted kitchen", "Balcony", "Water treatment"],
    landlord: "Coastline Homes", agencyFee: 325000, agreementFee: 150000, cautionFee: 200000, status: "Available"
  },
  {
    id: "CHQ-1003", title: "Smart mini flat", city: "Abuja", area: "Wuye",
    type: "Mini flat", beds: 1, baths: 1, price: 2200000, frequency: "year",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85",
    images: ["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85"],
    verified: true, featured: false,
    description: "A compact, modern home designed for comfortable city living, with convenient access to major routes.",
    amenities: ["Wardrobe", "Water supply", "Prepaid meter", "Parking"],
    landlord: "NorthGate Realty", agencyFee: 110000, agreementFee: 75000, cautionFee: 100000, status: "Available"
  },
  {
    id: "CHQ-1004", title: "Airy 1-bedroom apartment", city: "Ibadan", area: "Jericho",
    type: "Apartment", beds: 1, baths: 1, price: 1250000, frequency: "year",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
    images: ["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85"],
    verified: false, featured: true,
    description: "A comfortable one-bedroom option in a quiet residential area. Contact the listing representative for viewing arrangements.",
    amenities: ["Water supply", "Tiled floors", "Kitchen", "Compound parking"],
    landlord: "Jericho Lettings", agencyFee: 0, agreementFee: 70000, cautionFee: 80000, status: "Available"
  },
  {
    id: "CHQ-1005", title: "Family 4-bedroom detached home", city: "Lagos", area: "Ikeja GRA",
    type: "Detached house", beds: 4, baths: 4, price: 9500000, frequency: "year",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85"],
    verified: true, featured: false,
    description: "A spacious detached residence with multiple living areas and a private outdoor space.",
    amenities: ["Boys' quarters", "Private garden", "Parking", "Security", "Fitted kitchen"],
    landlord: "Oak & Stone Realty", agencyFee: 475000, agreementFee: 200000, cautionFee: 300000, status: "Available"
  },
  {
    id: "CHQ-1006", title: "Affordable self-contained studio", city: "Ibadan", area: "Akobo",
    type: "Self-contained", beds: 1, baths: 1, price: 550000, frequency: "year",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85",
    images: ["https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85"],
    verified: true, featured: false,
    description: "A neat studio apartment offering an accessible entry point into the rental market.",
    amenities: ["Water supply", "Prepaid meter", "Tiled floors"],
    landlord: "Akobo Homes", agencyFee: 0, agreementFee: 30000, cautionFee: 40000, status: "Available"
  }
];

export const money = (amount: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);
