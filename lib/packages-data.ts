// ============================================
// TYPES
// ============================================

export type PackagePromo = "weekday" | "weekend" | "weekdays" | "weekends";

export type PackageCategory = "studio" | "outdoor" | "studio-rental";

export type StudioGroup = "solo" | "couple" | "barkada" | "family";

export interface Package {
    id: string;
    title: string;
    duration: string;
    price: string;
    promo?: PackagePromo;
    category: PackageCategory;
    studioGroup?: StudioGroup; // only for category "studio"
    groupSize?: string; // e.g. "Group of 3"
    description?: string;
    popular?: boolean;
    photos?: string;
    features: string[];
    addons?: string[];
}

export interface FeeItem {
    label: string;
    price: string;
}

export interface StudioGroupInfo {
    key: StudioGroup;
    label: string;
    sub: string;
    lateFees: FeeItem[];
    timeExtensions: FeeItem[];
    addons: string[];
}

// ============================================
// STUDIO FEES & ADD-ONS (differ per group)
// ============================================

export const studioAddonsInfo: string[] = [
    "Creative Materials -- upon request",
    "Full production setup -- upon request",
];

const soloFees = {
    lateFees: [
        { label: "30mins", price: "300" },
        { label: "60mins", price: "500" },
    ],
    timeExtensions: [
        { label: "30mins", price: "500" },
        { label: "60mins", price: "1,000" },
    ],
};

const groupFees = {
    lateFees: [
        { label: "30mins", price: "500" },
        { label: "60mins", price: "1,000" },
    ],
    timeExtensions: [
        { label: "30mins", price: "1,000" },
        { label: "60mins", price: "1,500" },
    ],
};

export const studioGroups: StudioGroupInfo[] = [
    { key: "solo", label: "Solo", sub: "1 person", ...soloFees, addons: studioAddonsInfo },
    { key: "couple", label: "Couple", sub: "2 people", ...groupFees, addons: studioAddonsInfo },
    { key: "barkada", label: "Barkada", sub: "Group of 3 to 5", ...groupFees, addons: studioAddonsInfo },
    { key: "family", label: "Family", sub: "Group of 3 to 5", ...groupFees, addons: studioAddonsInfo },
];

export function getStudioGroupInfo(key: StudioGroup): StudioGroupInfo {
    return studioGroups.find((g) => g.key === key)!;
}

// Kept for backwards compatibility (Solo fees)
export const lateFees: FeeItem[] = soloFees.lateFees;
export const timeExtensions: FeeItem[] = soloFees.timeExtensions;

// ============================================
// SHARED INCLUSIONS (Barkada & Family are identical)
// ============================================

const groupPremiumFeatures = [
    "Unlimited Concepts / Layout",
    "1 & 1/2 Hour (90mins) Professional photoshoot",
    "Complimentary coffee & water",
    "Birthday Shoot - Free One (1) Printed Photo",
    "Anniversary Shoot - Free One (1) Printed Photo",
];

const groupVipFeatures = [
    "Unlimited Concepts / Layout",
    "2 Hours (120mins) Professional photoshoot",
    "1pc Glam Makeup - HMUA",
    "1pc Light Makeup - HMUA",
    "4pcs Solo or Collage Printed Photo",
    "1pc Photoshoot Personal Assistant",
    "1 Professional Photographer",
    "Complimentary coffee & water",
    "Birthday Shoot - Free One (1) Printed Photo",
    "Anniversary Shoot - Free One (1) Printed Photo",
];

const groupVvipFeatures = [
    "Unlimited Concepts / Layout",
    "6 hours Professional photoshoot",
    "1pc Glam Makeup - HMUA",
    "4pc Light Makeup - HMUA",
    "15pcs Solo, couple or Collage Printed Photo",
    "5pcs BTS - Edited behind the scene video reels",
    "5pcs Contact lenses",
    "2pcs Photoshoot Personal Assistant",
    "1 Professional Photographer & 1 Videographer",
    "Unlimited Hair & Makeup retouch",
    "Unlimited use of wardrobe",
    "Free additional 30mins extension",
    "Free creative concepts materials",
    "10% Off on the next visit",
    "2pcs Le Luxe Facial Gift Certificate - worth P3,000",
    "3pcs Le Footspa Diode Gift Certificate - worth P3,000",
    "3pcs G-Limit 1hour Photoshoot Gift Certificate",
    "1pc Complimentary Red Wine",
    "Complimentary coffee & water",
    "Birthday Shoot - Free Two (2) Printed Photos",
    "Anniversary Shoot - Free Two (2) Printed Photos",
    "Note: Can bring food and drinks",
];

// ============================================
// STUDIO PACKAGES (single price every day)
// ============================================

export const studioPackageList: Package[] = [
    // ───────────── SOLO ─────────────
    {
        id: "premium_studio",
        title: "Premium Package",
        duration: "1 hour",
        price: "1,988.00",
        category: "studio",
        studioGroup: "solo",
        groupSize: "Solo",
        features: [
            "1 to 2 Concepts / Layouts",
            "1 Hour (60mins) Professional photoshoot",
            "Complimentary coffee & water",
            "Birthday Shoot - Free One (1) Printed Photo",
        ],
    },
    {
        id: "vip_studio",
        title: "VIP Package",
        duration: "1 Hour and 30 Minutes",
        price: "2,888.00",
        category: "studio",
        studioGroup: "solo",
        groupSize: "Solo",
        popular: true,
        features: [
            "2 to 3 Concepts / Layouts",
            "1 & 1/2 Hour (90mins) Professional photoshoot",
            "HMUA - Hair & Makeup Artist",
            "One (1) pc Solo or Collage Printed Photo",
            "Complimentary coffee & water",
            "Birthday Shoot - Free One (1) Printed Photo",
        ],
    },
    {
        id: "vvip_studio",
        title: "VVIP Package",
        duration: "2 hours",
        price: "3,888.00",
        category: "studio",
        studioGroup: "solo",
        groupSize: "Solo",
        features: [
            "Unlimited Concepts / Layouts",
            "2 Hours (120mins) Professional photoshoot",
            "HMUA - Hair & Makeup Artist",
            "Four (4) pcs Solo or Collage Printed Photo",
            "BTS - Edited behind the scene video reels",
            "One (1) pc Contact lens",
            "Photoshoot Personal Assistant",
            "Unlimited Hair & Makeup retouch",
            "Unlimited use of wardrobe",
            "Free additional 30mins photoshoot extension",
            "Free creative concepts materials",
            "10% Off on the next visit",
            "One (1) pc Le Luxe Facial Gift Certificate - worth P1,500",
            "Complimentary coffee & water",
            "Birthday Shoot - Free Two (2) Printed Photos",
            "Free 30mins Set card / VTR shoot",
        ],
    },

    // ───────────── COUPLE ─────────────
    {
        id: "couple_premium_studio",
        title: "Couple Premium Package",
        duration: "1 hour",
        price: "3,888.00",
        category: "studio",
        studioGroup: "couple",
        groupSize: "Couple",
        features: [
            "1 to 2 Concepts / Layouts",
            "1 Hour (60mins) Professional photoshoot",
            "Complimentary coffee & water",
            "Birthday Shoot - Free One (1) Printed Photo",
            "Anniversary Shoot - Free One (1) Printed Photo",
        ],
    },
    {
        id: "couple_vip_studio",
        title: "Couple VIP Package",
        duration: "1 Hour and 30 Minutes",
        price: "4,888.00",
        category: "studio",
        studioGroup: "couple",
        groupSize: "Couple",
        popular: true,
        features: [
            "2 to 3 Concepts / Layouts",
            "1 & 1/2 Hour (90mins) Professional photoshoot",
            "1pc HMUA - Hair & Makeup Artist",
            "2pcs Solo or Collage Printed Photo",
            "Complimentary coffee & water",
            "Birthday Shoot - Free One (1) Printed Photo",
            "Anniversary Shoot - Free One (1) Printed Photo",
        ],
    },
    {
        id: "couple_vvip_studio",
        title: "Couple VVIP Package",
        duration: "2 hours",
        price: "5,888.00",
        category: "studio",
        studioGroup: "couple",
        groupSize: "Couple",
        features: [
            "Unlimited Concepts / Layout",
            "2 Hours (120mins) Professional photoshoot",
            "HMUA - Hair & Makeup Artist",
            "4pcs Solo, couple or Collage Printed Photo",
            "2pcs BTS - Edited behind the scene video reels",
            "2pcs Contact lenses",
            "Photoshoot Personal Assistant",
            "Unlimited Hair & Makeup retouch",
            "Unlimited use of wardrobe",
            "Free additional 30mins photoshoot extension",
            "Free creative concepts materials",
            "10% Off on the next visit",
            "2pcs Le Luxe Facial Gift Certificate - worth P3,000",
            "Anniversary Shoot - Free Two (2) Printed Photos",
            "Free 30mins Set card / VTR shoot",
            "Complimentary coffee & water",
            "Birthday Shoot - Free Two (2) Printed Photos",
        ],
    },

    // ───────────── BARKADA ─────────────
    {
        id: "barkada_premium_studio",
        title: "Barkada Premium Package",
        duration: "1 Hour and 30 Minutes",
        price: "3,888.00",
        category: "studio",
        studioGroup: "barkada",
        groupSize: "Group of 3",
        features: groupPremiumFeatures,
    },
    {
        id: "barkada_vip_studio",
        title: "Barkada VIP Package",
        duration: "2 hours",
        price: "6,888.00",
        category: "studio",
        studioGroup: "barkada",
        groupSize: "Group of 4",
        popular: true,
        features: groupVipFeatures,
    },
    {
        id: "barkada_vvip_studio",
        title: "Barkada VVIP Party Package",
        duration: "6 hours",
        price: "9,888.00",
        category: "studio",
        studioGroup: "barkada",
        groupSize: "Group of 5",
        features: groupVvipFeatures,
    },

    // ───────────── FAMILY ─────────────
    {
        id: "family_premium_studio",
        title: "Family Premium Package",
        duration: "1 Hour and 30 Minutes",
        price: "3,888.00",
        category: "studio",
        studioGroup: "family",
        groupSize: "Group of 3",
        features: groupPremiumFeatures,
    },
    {
        id: "family_vip_studio",
        title: "Family VIP Package",
        duration: "2 hours",
        price: "6,888.00",
        category: "studio",
        studioGroup: "family",
        groupSize: "Group of 4",
        popular: true,
        features: groupVipFeatures,
    },
    {
        id: "family_vvip_studio",
        title: "Family VVIP Party Package",
        duration: "6 hours",
        price: "9,888.00",
        category: "studio",
        studioGroup: "family",
        groupSize: "Group of 5",
        features: groupVvipFeatures,
    },
];

// ============================================
// OUTDOOR PACKAGES
// ============================================

export const outdoorPackages: Package[] = [
    {
        id: "outdoor_basic",
        title: "Basic Outdoor Session",
        price: "2,500",
        duration: "Minimum 2 hours",
        category: "outdoor",
        photos: "20 professionally edited photos",
        features: [
            "Basic studio setup",
            "Choose additional 2 backdrop shoot",
            "FREE use of costumes & accessories",
        ],
        addons: [
            "Extra edited photo — ₱100 every 5 photos",
            "Extended session — ₱1,500 per additional hour",
            "Hair & Make Up Services — ₱1,999+ only",
            "Transportation — depends on the location",
        ],
    },

    {
        id: "outdoor_standard",
        title: "Standard Outdoor Session",
        price: "5,500",
        duration: "Minimum 4-5 hours",
        category: "outdoor",
        photos: "30 professionally edited photos",
        features: [
            "Basic studio setup",
            "Choose additional 5 backdrop shoot",
            "FREE use of costumes & accessories",
        ],
        addons: [
            "Extra edited photo — ₱100 every 5 photos",
            "Extended session — ₱1,500 per additional hour",
            "Hair & Make Up Services — ₱1,999+ only",
            "Transportation — depends on the location",
        ],
    },

    {
        id: "outdoor_premium",
        title: "G-Limitless Premium Outdoor Session",
        price: "8,000",
        duration: "Up to 8 Hours",
        category: "outdoor",
        photos:
            "Professionally edited digital photos with hair and make up services",
        features: [
            "Basic studio setup",
            "FREE use of 12 backdrop shoot",
            "FREE use of costumes & accessories",
            "FREE Hair & Make Up Services for 1 additional person",
        ],
        addons: [
            "Extended session — ₱1,000 per additional hour",
            "Transportation — depends on the location",
        ],
    },
];

// ============================================
// STUDIO RENTAL — WEEKDAYS (unchanged)
// ============================================

export const studioRentalWeekdays: Package[] = [
    {
        id: "rental_gold_weekdays",
        title: "Gold Package",
        duration: "1 hour",
        description: "",
        price: "1,488.00",
        promo: "weekdays",
        category: "studio-rental",
        features: [
            "Two (2) pcs printed photos per model",
            "One (1) pc group photo with photographer",
            "One (1) pc VOUCHER - 30mins Free Studio Use",
            "One (1) spin the Wheel Game - Photographer",
            "FREE Unlimited use of attire/costumes/wardrobe",
        ],
    },

    {
        id: "rental_platinum_weekdays",
        title: "Platinum Package",
        duration: "3 hours",
        description: "",
        price: "3,988.00",
        promo: "weekdays",
        category: "studio-rental",
        popular: true,
        features: [
            "Three (3) pcs printed photos per model (1 to 3) - Total: 9 pcs",
            "Three (3) pcs group photo with photographer",
            "One (1) pc VOUCHER - 45mins Free Studio Use",
            "FREE Two (2) pcs Contact Lens",
            "FREE Unlimited use of attire/costumes/wardrobe",
            "One (1) spin the Wheel Game - Model",
            "One (1) spin the Wheel Game - Photographer",
        ],
    },

    {
        id: "rental_diamond_weekdays",
        title: "Diamond Package",
        duration: "4 hours",
        description: "",
        price: "5,488.00",
        promo: "weekdays",
        category: "studio-rental",
        features: [
            "Four (4) pcs printed photos per model (1 to 4) - Total: 16 pcs",
            "Four (4) pcs group photo with photographer",
            "One (1) pc VOUCHER - 45mins Free Studio Use",
            "One (1) pc DISCOUNT VOUCHERS - 30% off",
            "FREE Four (4) pcs Contact Lens",
            "FREE Unlimited use of attire/costumes/wardrobe",
            "Four (4) spin the Wheel Game - Model",
            "One (1) spin the Wheel Game - Photographer",
        ],
    },

    {
        id: "rental_onyx_weekdays",
        title: "Onyx Package",
        duration: "5 hours",
        description: "Studio / Party Shoot (Exclusive)",
        price: "7,488.00",
        promo: "weekdays",
        category: "studio-rental",
        features: [
            "Five (5) pcs printed photos per model (1 to 5) - Total: 25 pcs",
            "Five (5) pcs group photo with photographer",
            "Three (3) pcs Collage Photos (Model/Photographer)",
            "FREE 30mins studio party shoot extension",
            "FREE One (1) H&MU - One (1) Model",
            "FREE Four (4) pcs Contact Lens",
            "FREE Unlimited use of attire/costumes/wardrobe",
            "Four (4) spin the Wheel Game - Model",
            "One (1) spin the Wheel Game - Photographer",
            "FREE Complimentary Red Wine - One (1) pc Bottle",
            "FREE Complimentary Snack - One (1) pc Platter",
            "One (1) pc FREE VOUCHER - One (1) hour Studio Use",
            "Two (2) pcs DISCOUNT VOUCHERS - 30% off",
            "One (1) pc FREE VOUCHER - Whitening Facial",
            "One (1) pc FREE VOUCHER - UA Carbon Laser",
            "One (1) pc FREE VOUCHER - EMSCULPT - Tummy",
            "One (1) pc FREE VOUCHER - EMSCULPT - Butt",
            "One (1) pc Photographer VIC Card - 10% Discount (1 year)",
        ],
    },

    {
        id: "rental_luxury_weekdays",
        title: "Luxury Package",
        duration: "12 hours",
        description: "Party / Competition / Event Shoot (Exclusive)",
        price: "16,888.00",
        promo: "weekdays",
        category: "studio-rental",
        features: [
            "Eighty (80) pcs printed photos per model (1 to 5) - Total: 25 pcs",
            "Twenty (20) pcs group photo with photographer",
            "Ten (10) pcs Collage Photos (Model/Photographer)",
            "FREE 30mins studio party shoot extension",
            "FREE Three (3) H&MU Service",
            "FREE Ten (10) pcs Contact Lens",
            "FREE Unlimited use of attire/costumes/wardrobe",
            "Ten (10) spin the Wheel Game - Model",
            "Five (5) spin the Wheel Game - Photographer",
            "FREE Complimentary Red Wine - Three (3) pcs Bottle",
            "FREE Complimentary Snack - Three (3) pcs Platter",
            "Five (5) pcs FREE VOUCHER - One (1) hour Studio Use",
            "Five (5) pcs FREE VOUCHER - Three (3) hour Studio Use",
            "Four (4) pcs DISCOUNT VOUCHERS - 30% off",
            "Two (2) pcs FREE VOUCHER - Whitening Facial",
            "Two (2) pcs FREE VOUCHER - UA Carbon Laser",
            "Two (2) pcs FREE VOUCHER - EMSCULPT - Tummy",
            "Two (2) pcs FREE VOUCHER - EMSCULPT - Butt",
            "Two (2) pcs Photographer VIC Card - 10% Discount (1 year)",
            "Four (4) G-Limit Employees (for assistance)",
            "FREE 11 Concepts with light setup",
        ],
    },
];

// ============================================
// STUDIO RENTAL — WEEKENDS (unchanged)
// ============================================

export const studioRentalWeekends: Package[] = [
    {
        id: "rental_gold_weekends",
        title: "Gold Package",
        duration: "1 hour",
        description: "",
        price: "1,988.00",
        promo: "weekends",
        category: "studio-rental",
        features: [
            "Two (2) pcs printed photos per model",
            "One (1) pc group photo with photographer",
            "One (1) pc VOUCHER - 30mins Free Studio Use",
            "One (1) spin the Wheel Game - Photographer",
            "FREE Unlimited use of attire/costumes/wardrobe",
        ],
    },

    {
        id: "rental_platinum_weekends",
        title: "Platinum Package",
        duration: "3 hours",
        description: "",
        price: "5,488.00",
        promo: "weekends",
        category: "studio-rental",
        popular: true,
        features: [
            "Three (3) pcs printed photos per model (1 to 3) - Total: 9 pcs",
            "Three (3) pcs group photo with photographer",
            "One (1) pc VOUCHER - 45mins Free Studio Use",
            "FREE Two (2) pcs Contact Lens",
            "FREE Unlimited use of attire/costumes/wardrobe",
            "One (1) spin the Wheel Game - Model",
            "One (1) spin the Wheel Game - Photographer",
        ],
    },

    {
        id: "rental_diamond_weekends",
        title: "Diamond Package",
        duration: "4 hours",
        description: "",
        price: "7,488.00",
        promo: "weekends",
        category: "studio-rental",
        features: [
            "Four (4) pcs printed photos per model (1 to 4) - Total: 16 pcs",
            "Four (4) pcs group photo with photographer",
            "One (1) pc VOUCHER - 45mins Free Studio Use",
            "One (1) pc DISCOUNT VOUCHERS - 30% off",
            "FREE Four (4) pcs Contact Lens",
            "FREE Unlimited use of attire/costumes/wardrobe",
            "Four (4) spin the Wheel Game - Model",
            "One (1) spin the Wheel Game - Photographer",
        ],
    },

    {
        id: "rental_onyx_weekends",
        title: "Onyx Package",
        duration: "5 hours",
        description: "Studio / Party Shoot (Exclusive)",
        price: "9,988.00",
        promo: "weekends",
        category: "studio-rental",
        features: [
            "Five (5) pcs printed photos per model (1 to 5) - Total: 25 pcs",
            "Five (5) pcs group photo with photographer",
            "Three (3) pcs Collage Photos (Model/Photographer)",
            "FREE 30mins studio party shoot extension",
            "FREE One (1) H&MU - One (1) Model",
            "FREE Four (4) pcs Contact Lens",
            "FREE Unlimited use of attire/costumes/wardrobe",
            "Four (4) spin the Wheel Game - Model",
            "One (1) spin the Wheel Game - Photographer",
            "FREE Complimentary Red Wine - One (1) pc Bottle",
            "FREE Complimentary Snack - One (1) pc Platter",
            "One (1) pc FREE VOUCHER - One (1) hour Studio Use",
            "Two (2) pcs DISCOUNT VOUCHERS - 30% off",
            "One (1) pc FREE VOUCHER - Whitening Facial",
            "One (1) pc FREE VOUCHER - UA Carbon Laser",
            "One (1) pc FREE VOUCHER - EMSCULPT - Tummy",
            "One (1) pc FREE VOUCHER - EMSCULPT - Butt",
            "One (1) pc Photographer VIC Card - 10% Discount (1 year)",
        ],
    },

    {
        id: "rental_luxury_weekends",
        title: "Luxury Package",
        duration: "12 hours",
        description: "Party / Competition / Event Shoot (Exclusive)",
        price: "18,888.00",
        promo: "weekends",
        category: "studio-rental",
        features: [
            "Eighty (80) pcs printed photos per model (1 to 5) - Total: 25 pcs",
            "Twenty (20) pcs group photo with photographer",
            "Ten (10) pcs Collage Photos (Model/Photographer)",
            "FREE 30mins studio party shoot extension",
            "FREE Three (3) H&MU Service",
            "FREE Ten (10) pcs Contact Lens",
            "FREE Unlimited use of attire/costumes/wardrobe",
            "Ten (10) spin the Wheel Game - Model",
            "Five (5) spin the Wheel Game - Photographer",
            "FREE Complimentary Red Wine - Three (3) pcs Bottle",
            "FREE Complimentary Snack - Three (3) pcs Platter",
            "Five (5) pcs FREE VOUCHER - One (1) hour Studio Use",
            "Five (5) pcs FREE VOUCHER - Three (3) hour Studio Use",
            "Four (4) pcs DISCOUNT VOUCHERS - 30% off",
            "Two (2) pcs FREE VOUCHER - Whitening Facial",
            "Two (2) pcs FREE VOUCHER - UA Carbon Laser",
            "Two (2) pcs FREE VOUCHER - EMSCULPT - Tummy",
            "Two (2) pcs FREE VOUCHER - EMSCULPT - Butt",
            "Two (2) pcs Photographer VIC Card - 10% Discount (1 year)",
            "Four (4) G-Limit Employees (for assistance)",
            "FREE 11 Concepts with light setup",
        ],
    },
];

// ============================================
// ALL PACKAGES
// ============================================

export const packages: Package[] = [
    ...studioPackageList,
    ...outdoorPackages,
    ...studioRentalWeekdays,
    ...studioRentalWeekends,
];

// ============================================
// HELPERS
// ============================================

export function getPackageById(id: string): Package | undefined {
    return packages.find((pkg) => pkg.id === id);
}

export function getPackagesByCategory(category: PackageCategory): Package[] {
    return packages.filter((pkg) => pkg.category === category);
}

export function getPackagesByPromo(promo: PackagePromo): Package[] {
    return packages.filter((pkg) => pkg.promo === promo);
}

export function getPopularPackages(): Package[] {
    return packages.filter((pkg) => pkg.popular);
}

// ============================================
// SPECIFIC COLLECTIONS
// ============================================

export const studioPackages = getPackagesByCategory("studio");

export const outdoorSessionPackages = getPackagesByCategory("outdoor");

export const studioRentalPackages = getPackagesByCategory("studio-rental");