"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ChevronDown, Check } from "lucide-react";

type Pkg = {
  title: string;
  subtitle?: string;
  inclusions: string[];
};
type Category = { label: string; packages: Pkg[] };

// Shared inclusions (Barkada & Family pareho ang laman)
const GROUP_PREMIUM = [
  "Unlimited Concepts / Layout",
  "1 & 1/2 Hour (90mins) Professional photoshoot",
  "Complimentary coffee & water",
  "Birthday Shoot - Free One (1) Printed Photo",
  "Anniversary Shoot - Free One (1) Printed Photo",
];
const GROUP_VIP = [
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
const GROUP_VVIP = [
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
  "Birthday Shoot - Free Two (2) Printed Photo",
  "Anniversary Shoot - Free Two (2) Printed Photo",
  "Note: Can bring food and drinks",
];

const CATEGORIES: Category[] = [
  {
    label: "Solo",
    packages: [
      {
        title: "Solo Premium Package",
        inclusions: [
          "1 to 2 Concepts / Layouts",
          "1 Hour (60mins) Professional photoshoot",
          "Complimentary coffee & water",
          "Birthday Shoot - Free One (1) Printed Photo",
        ],
      },
      {
        title: "Solo VIP Package",
        inclusions: [
          "2 to 3 Concepts / Layouts",
          "1 & 1/2 Hour (90mins) Professional photoshoot",
          "HMUA - Hair & Makeup Artist",
          "1pc Solo or Collage Printed Photo",
          "Complimentary coffee & water",
          "Birthday Shoot - Free One (1) Printed Photo",
        ],
      },
      {
        title: "Solo VVIP Package",
        inclusions: [
          "Unlimited Concepts / Layouts",
          "2 Hours (120mins) Professional photoshoot",
          "HMUA - Hair & Makeup Artist",
          "4pcs Solo or Collage Printed Photo",
          "BTS - Edited behind the scene video reels",
          "1pc Contact lens",
          "Photoshoot Personal Assistant",
          "Unlimited Hair & Makeup retouch",
          "Unlimited use of wardrobe",
          "Free additional 30mins photoshoot extension",
          "Free creative concepts materials",
          "10% Off on the next visit",
          "1pc Le Luxe Facial Gift Certificate - worth P1,500",
          "Complimentary coffee & water",
          "Birthday Shoot - Free Two (2) Printed Photo",
          "Free 30mins Set card / VTR shoot",
        ],
      },
    ],
  },
  {
    label: "Couple",
    packages: [
      {
        title: "Couple Premium Package",
        inclusions: [
          "1 to 2 Concepts / Layouts",
          "1 Hour (60mins) Professional photoshoot",
          "Complimentary coffee & water",
          "Birthday Shoot - Free One (1) Printed Photo",
          "Anniversary Shoot - Free One (1) Printed Photo",
        ],
      },
      {
        title: "Couple VIP Package",
        inclusions: [
          "2 to 3 Concepts / Layouts",
          "1 & 1/2 Hour (90mins) Professional photoshoot",
          "1pc HMUA - Hair & Makeup Artist",
          "2pc Solo or Collage Printed Photo",
          "Complimentary coffee & water",
          "Birthday Shoot - Free One (1) Printed Photo",
          "Anniversary Shoot - Free One (1) Printed Photo",
        ],
      },
      {
        title: "Couple VVIP Package",
        inclusions: [
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
          "Anniversary Shoot - Free Two (2) Printed Photo",
          "Free 30mins Set card / VTR shoot",
          "Complimentary coffee & water",
          "Birthday Shoot - Free Two (2) Printed Photo",
        ],
      },
    ],
  },
  {
    label: "Barkada",
    packages: [
      {
        title: "Barkada Premium Package",
        subtitle: "Group of 3",
        inclusions: GROUP_PREMIUM,
      },
      {
        title: "Barkada VIP Package",
        subtitle: "Group of 4",
        inclusions: GROUP_VIP,
      },
      {
        title: "Barkada VVIP Party Package",
        subtitle: "Group of 5",
        inclusions: GROUP_VVIP,
      },
    ],
  },
  {
    label: "Family",
    packages: [
      {
        title: "Family Premium Package",
        subtitle: "Group of 3",
        inclusions: GROUP_PREMIUM,
      },
      {
        title: "Family VIP Package",
        subtitle: "Group of 4",
        inclusions: GROUP_VIP,
      },
      {
        title: "Family VVIP Party Package",
        subtitle: "Group of 5",
        inclusions: GROUP_VVIP,
      },
    ],
  },
];

type FormData = {
  name: string;
  service: string; // title lang ng package
  rating: number;
  enjoyed: string;
  improvement: string;
  consent: boolean;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const initialData: FormData = {
  name: "",
  service: "",
  rating: 0,
  enjoyed: "",
  improvement: "",
  consent: false,
};

const inputBase =
  "w-full px-4 py-3 bg-amber-500/10 rounded text-white placeholder-gray-500 focus:outline-none";
const borderClass = (hasError?: string) =>
  hasError
    ? "border border-red-500"
    : "border border-amber-500/30 focus:border-amber-500";

const TestimonialsForm = () => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.service)
      newErrors.service = "Please select the type of shoot you booked";
    if (!formData.rating) newErrors.rating = "Please select a rating";
    if (!formData.enjoyed.trim())
      newErrors.enjoyed = "Please tell us what you enjoyed most";
    if (!formData.consent)
      newErrors.consent = "Please agree to the privacy consent to continue";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          title: formData.service, // title lang ng package
          rating: formData.rating,
          message: formData.enjoyed, // ito ang lalabas sa feedback card
          improvement: formData.improvement || null, // private feedback
          consent: formData.consent,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(
          data?.errors ? "Failed to submit feedback." : "Something went wrong.",
          {
            position: "top-right",
            duration: 4000,
          },
        );
        return;
      }

      toast.success("Thank You for Your Feedback", {
        description: "Your feedback has been successfully submitted.",
        position: "top-right",
        duration: 4000,
      });

      setTimeout(() => {
        setFormData(initialData);
        setExpanded(null);
        setActiveCategory(0);
      }, 300);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6 animate-fadeIn">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Jane Doe"
              className={`${inputBase} ${borderClass(errors.name)}`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Type of shoot */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-white">
              What type of shoot did you book?{" "}
              <span className="text-red-500">*</span>
            </label>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 mb-3">
              {CATEGORIES.map((cat, i) => (
                <button
                  type="button"
                  key={cat.label}
                  onClick={() => setActiveCategory(i)}
                  className={`px-4 py-1.5 rounded-full text-sm border transition ${
                    activeCategory === i
                      ? "bg-yellow-500 text-black border-yellow-500 font-semibold"
                      : "border-amber-500/30 text-gray-300 hover:border-amber-500"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Package cards */}
            <div
              role="radiogroup"
              aria-label="Package"
              className={`space-y-3 rounded ${errors.service ? "ring-1 ring-red-500 p-2" : ""}`}
            >
              {CATEGORIES[activeCategory].packages.map((pkg) => {
                const selected = formData.service === pkg.title;
                const isOpen = expanded === pkg.title;

                return (
                  <div
                    key={pkg.title}
                    className={`rounded border transition ${
                      selected
                        ? "border-yellow-500 bg-yellow-500/10"
                        : "border-amber-500/30 bg-amber-500/5 hover:border-amber-500/60"
                    }`}
                  >
                    <div className="flex items-center gap-3 p-4">
                      <button
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            service: pkg.title,
                          }));
                          setErrors((prev) => ({ ...prev, service: "" }));
                        }}
                        className="flex flex-1 items-center gap-3 text-left"
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            selected
                              ? "bg-yellow-500 border-yellow-500"
                              : "border-gray-500"
                          }`}
                        >
                          {selected && <Check className="h-3 w-3 text-black" />}
                        </span>
                        <span>
                          <span className="block text-white font-semibold">
                            {pkg.title}
                          </span>
                          {pkg.subtitle && (
                            <span className="block text-xs text-gray-400">
                              {pkg.subtitle}
                            </span>
                          )}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : pkg.title)}
                        aria-expanded={isOpen}
                        className="flex items-center gap-1 text-xs text-yellow-400 hover:text-yellow-300 whitespace-nowrap"
                      >
                        {isOpen ? "Hide" : "View"} inclusions
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>

                    {isOpen && (
                      <ul className="px-4 pb-4 pt-0 space-y-1.5 text-sm text-gray-300 border-t border-amber-500/20 mt-0 pt-3 max-h-64 overflow-y-auto">
                        {pkg.inclusions.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="text-yellow-500">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>

            {formData.service && (
              <p className="text-xs text-gray-400 mt-2">
                Selected:{" "}
                <span className="text-yellow-400">{formData.service}</span>
              </p>
            )}
            {errors.service && (
              <p className="text-red-500 text-sm mt-1">{errors.service}</p>
            )}
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">
              How would you rate your overall experience? (1–5){" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, rating: star }));
                    setErrors((prev) => ({ ...prev, rating: "" }));
                  }}
                  className={`text-3xl transition ${
                    formData.rating >= star
                      ? "text-yellow-400"
                      : "text-gray-500 hover:text-yellow-300"
                  }`}
                  aria-label={`${star} star${star > 1 ? "s" : ""}`}
                >
                  ★
                </button>
              ))}
            </div>
            {errors.rating && (
              <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
            )}
          </div>

          {/* What did you enjoy most */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">
              What did you enjoy most? <span className="text-red-500">*</span>
            </label>
            <textarea
              name="enjoyed"
              value={formData.enjoyed}
              onChange={handleChange}
              rows={4}
              placeholder="Tell us your favorite part of the experience..."
              className={`${inputBase} ${borderClass(errors.enjoyed)}`}
            />
            {errors.enjoyed && (
              <p className="text-red-500 text-sm mt-1">{errors.enjoyed}</p>
            )}
          </div>

          {/* What could we improve */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">
              What could we improve?{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              name="improvement"
              value={formData.improvement}
              onChange={handleChange}
              rows={3}
              placeholder="Any suggestions to help us serve you better..."
              className={`${inputBase} ${borderClass()}`}
            />
          </div>

          {/* Privacy consent */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.consent}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    consent: e.target.checked,
                  }));
                  setErrors((prev) => ({ ...prev, consent: "" }));
                }}
                className="mt-1 h-4 w-4 accent-yellow-500"
              />
              <span className="text-sm text-gray-300">
                I agree that my comments or feedback may be posted on this
                website and its social media platforms.{" "}
                <span className="text-red-500">*</span>
              </span>
            </label>
            {errors.consent && (
              <p className="text-red-500 text-sm mt-1">{errors.consent}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TestimonialsForm;
