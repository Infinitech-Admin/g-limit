// ============================================
// TYPES
// ============================================

export type PackagePromo =
    | "weekday"
    | "weekend"
    | "weekdays"
    | "weekends";

export type PackageCategory =
    | "studio"
    | "outdoor"
    | "studio-rental";

export interface Package {
    id: string;
    title: string;
    duration: string;
    price: string;
    promo?: PackagePromo;
    category: PackageCategory;
    description?: string;
    popular?: boolean;
    photos?: string;
    features: string[];
    addons?: string[];
}

// ============================================
// STUDIO PACKAGES — WEEKDAYS
// ============================================

export const studioWeekdays: Package[] = [
    {
        id: "starter_weekday",
        title: "Starter Package",
        duration: "1 hour",
        price: "1,388.00",
        promo: "weekday",
        category: "studio",
        features: [
            "FREE One (1) VOUCHER - 30mins Self-Portrait - 11 Concepts",
            "Two (2) pcs SOLO printed edited photos",
            "One (1) pc COLLAGE printed photo",
            "1 Hour professional-grade Photoshoot",
            "FREE Fifteen (15) pcs edited professional-grade photos",
            "FREE 30mins Self-portrait - 11 Concepts (unli self-shoot)",
            "Within 24 hours output (edited photos) release",
        ],
        addons: [
            "FREE One (1) Makeup service (Light Makeup)",
        ],
    },

    {
        id: "premium_weekday",
        title: "Premium Package",
        duration: "1 Hour and 30 Minutes",
        price: "1,588.00",
        promo: "weekday",
        category: "studio",
        popular: true,
        features: [
            "FREE One (1) pc VOUCHER - 30mins Self-portrait - 11 Concepts",
            "FOUR (4) pcs SOLO printed edited photos",
            "Two (2) pcs COLLAGE printed photo",
            "FREE 1h & 30mins professional-grade photoshoot",
            "FREE Twenty (20) pcs edited professional-grade photos",
            "FREE 30mins Self-portrait - 11 Concepts (unli self-shoot)",
            "One (1) Spin the wheel game",
            "Within 24 hours output (edited photos) release",
        ],
        addons: [
            "FREE One (1) Hair & Makeup service (Light Makeup)",
        ],
    },

    {
        id: "vip_weekday",
        title: "VIP Package",
        duration: "1 Hour and 30 Minutes",
        price: "1,888.00",
        promo: "weekday",
        category: "studio",
        features: [
            "FREE One (1) pc VOUCHER - 1 hour Self-portrait - 11 Concepts",
            "FREE SIX (6) pcs SOLO printed edited photos",
            "FREE Four (4) pcs COLLAGE printed photo",
            "FREE Unlimited professional-grade photoshoot",
            "FREE 1h & 30mins - 11 Concepts with low light setup & Photographer",
            "FREE Thirty (30) pcs edited professional-grade photos",
            "One (1) Spin the wheel game",
            "Within 24 hours output (edited photos) release",
        ],
        addons: [
            "FREE One (1) pc Contact Lens",
            "FREE One (1) Hair & Makeup service (LUXURY GLAM)",
            "FREE Unlimited makeup retouch",
            "FREE Unlimited use of Attire/Costumes",
        ],
    },

    {
        id: "vvip_weekday",
        title: "VVIP Package",
        duration: "Unlimited",
        price: "2,488.00",
        promo: "weekday",
        category: "studio",
        features: [
            "FREE One (1) pc VOUCHER - 1 hour Self-portrait - 11 Concepts",
            "TEN (10) pcs SOLO printed edited photos",
            "Four (4) pcs COLLAGE printed photo",
            "FREE Unlimited professional-grade photoshoot (with concept setup)",
            "FREE Unlimited - 11 Concepts with low light setup & Photographer",
            "FREE Unlimited edited professional-grade photos",
            "FREE BTR & Set Card photoshoot",
            "Two (2) Spin the wheel game",
            "Within 24 hours output (edited photos) release",
        ],
        addons: [
            "FREE Two (2) pcs Contact Lens",
            "FREE Personal Assistant (PA) - One (1) person",
            "One (1) pc FREE VOUCHER - EMSCULPT - Tummy",
            'FREE Edited "Behind the Scene" BTS Video (Makeup to Photoshoot)',
            "FREE Unlimited Makeup retouch",
            "FREE Unlimited use of Attire/Costumes",
        ],
    },
];

// ============================================
// STUDIO PACKAGES — WEEKENDS
// ============================================

export const studioWeekends: Package[] = [
    {
        id: "starter_weekend",
        title: "Starter Package",
        duration: "1 hour",
        price: "1,588.00",
        promo: "weekend",
        category: "studio",
        features: [
            "FREE One (1) pc VOUCHER - 30mins Self-portrait - 11 Concepts",
            "Two (2) pcs SOLO printed edited photos",
            "One (1) pc COLLAGE printed photo",
            "1 Hour professional-grade photoshoot by G-limit Photographer",
            "FREE Fifteen (15) pcs edited professional-grade photos",
            "FREE 30mins Self-portrait - 11 Concepts (unli self-shoot)",
            "Within 24 hours output (edited photos) release",
        ],
        addons: [
            "FREE One (1) Makeup service (Light Makeup)",
        ],
    },

    {
        id: "premium_weekend",
        title: "Premium Package",
        duration: "1 Hour and 30 Minutes",
        price: "1,788.00",
        promo: "weekend",
        category: "studio",
        popular: true,
        features: [
            "FREE One (1) pc VOUCHER - 30mins Self-portrait - 11 Concepts",
            "FOUR (4) pcs SOLO printed edited photos",
            "Two (2) pcs COLLAGE printed photo",
            "FREE 1h & 30mins professional-grade photoshoot",
            "FREE Twenty (20) pcs edited professional-grade photos",
            "FREE 30mins Self-portrait - 11 Concepts (unli self-shoot)",
            "One (1) Spin the wheel game",
            "Within 24 hours output (edited photos) release",
        ],
        addons: [
            "FREE One (1) Hair & Makeup service (Light Makeup)",
        ],
    },

    {
        id: "vip_weekend",
        title: "VIP Package",
        duration: "1 Hour and 30 Minutes",
        price: "2,088.00",
        promo: "weekend",
        category: "studio",
        features: [
            "FREE One (1) pc VOUCHER - 1 hour Self-portrait - 11 Concepts",
            "FREE SIX (6) pcs SOLO printed edited photos",
            "FREE Four (4) pcs COLLAGE printed photo",
            "FREE Unlimited professional-grade photoshoot",
            "FREE 1h & 30mins - 11 Concepts with low light setup & Photographer",
            "FREE Thirty (30) pcs edited professional-grade photos",
            "One (1) Spin the wheel game",
            "Within 24 hours output (edited photos) release",
        ],
        addons: [
            "FREE One (1) pc Contact Lens",
            "FREE One (1) Hair & Makeup service (LUXURY GLAM)",
            "FREE Unlimited Makeup retouch",
            "FREE Unlimited use of Attire/Costumes",
        ],
    },

    {
        id: "vvip_weekend",
        title: "VVIP Package",
        duration: "Unlimited",
        price: "2,688.00",
        promo: "weekend",
        category: "studio",
        features: [
            "FREE One (1) pc VOUCHER - 1 hour Self-portrait - 11 Concepts",
            "TEN (10) pcs SOLO printed edited photos",
            "Four (4) pcs COLLAGE printed photo",
            "FREE Unlimited professional-grade photoshoot (with concept setup)",
            "FREE Unlimited - 11 Concepts with low light setup & Photographer",
            "FREE Unlimited edited professional-grade photos",
            "FREE BTR & Set Card photoshoot",
            "Two (2) Spin the wheel game",
            "Within 24 hours output (edited photos) release",
        ],
        addons: [
            "FREE Two (2) pcs Contact Lens",
            "FREE Personal Assistant (PA) - One (1) person",
            "One (1) pc FREE VOUCHER - EMSCULPT (Tummy)",
            "FREE One (1) Hair & Makeup service (LUXURY GLAM)",
            'FREE Edited "Behind the Scene" BTS Video (Makeup to Photoshoot)',
            "FREE Unlimited Makeup retouch",
            "FREE Unlimited use of Attire/Costumes",
        ],
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
// STUDIO RENTAL — WEEKDAYS
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
// STUDIO RENTAL — WEEKENDS
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
    ...studioWeekdays,
    ...studioWeekends,
    ...outdoorPackages,
    ...studioRentalWeekdays,
    ...studioRentalWeekends,
];

// ============================================
// HELPERS
// ============================================

export function getPackageById(
    id: string
): Package | undefined {
    return packages.find(
        (pkg) => pkg.id === id
    );
}

export function getPackagesByCategory(
    category: PackageCategory
): Package[] {
    return packages.filter(
        (pkg) => pkg.category === category
    );
}

export function getPackagesByPromo(
    promo: PackagePromo
): Package[] {
    return packages.filter(
        (pkg) => pkg.promo === promo
    );
}

export function getPopularPackages(): Package[] {
    return packages.filter(
        (pkg) => pkg.popular
    );
}

// ============================================
// SPECIFIC COLLECTIONS
// ============================================

export const studioPackages =
    getPackagesByCategory("studio");

export const outdoorSessionPackages =
    getPackagesByCategory("outdoor");

export const studioRentalPackages =
    getPackagesByCategory("studio-rental");