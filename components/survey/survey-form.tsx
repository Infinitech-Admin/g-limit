"use client"
import { useState } from "react"
import { motion } from "framer-motion"

interface SurveyFormData {
  name: string
  service: string[]
  easeOfBooking: number
  communication: number
  studioCleanliness: number
  staffProfessionalism: number
  comfortDuringShoot: number
  qualityOfWork: number
  editingStyle: number
  timelinessOfDelivery: number
  overallSatisfaction: number
  wouldRecommend: string
  additionalComments?: string
}

const services = [
  "Photoshoot",
  "Videography",
  "Editing",
  "Event Coverage",
  "Others"
]

const ratingCategories = [
  { key: "easeOfBooking", label: "Ease of booking" },
  { key: "communication", label: "Communication & responsiveness" },
  { key: "studioCleanliness", label: "Studio cleanliness & ambiance" },
  { key: "staffProfessionalism", label: "Staff professionalism" },
  { key: "comfortDuringShoot", label: "Comfort during the shoot" },
  { key: "qualityOfWork", label: "Quality of photos/videos" },
  { key: "editingStyle", label: "Editing style & consistency" },
  { key: "timelinessOfDelivery", label: "Timeliness of delivery" },
]

export default function SurveyForm() {
  const [formData, setFormData] = useState<SurveyFormData>({
    name: "",
    service: [],
    easeOfBooking: 0,
    communication: 0,
    studioCleanliness: 0,
    staffProfessionalism: 0,
    comfortDuringShoot: 0,
    qualityOfWork: 0,
    editingStyle: 0,
    timelinessOfDelivery: 0,
    overallSatisfaction: 0,
    wouldRecommend: "",
    additionalComments: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const handleServiceChange = (service: string) => {
    setFormData(prev => ({
      ...prev,
      service: prev.service.includes(service)
        ? prev.service.filter(s => s !== service)
        : [...prev.service, service]
    }))
  }

  const handleRatingChange = (category: string, rating: number) => {
    setFormData(prev => ({
      ...prev,
      [category]: rating
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    try {
      // Call the Next.js API route which will forward to Laravel
      const response = await fetch("/api/survey-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit survey")
      }

      setSubmitStatus({
        type: "success",
        message: "Thank you for your feedback! Your survey has been submitted successfully."
      })

      // Reset form
      setFormData({
        name: "",
        service: [],
        easeOfBooking: 0,
        communication: 0,
        studioCleanliness: 0,
        staffProfessionalism: 0,
        comfortDuringShoot: 0,
        qualityOfWork: 0,
        editingStyle: 0,
        timelinessOfDelivery: 0,
        overallSatisfaction: 0,
        wouldRecommend: "",
        additionalComments: ""
      })
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error instanceof Error ? error.message : "An error occurred. Please try again."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const RatingStars = ({ value, onChange }: { value: number; onChange: (rating: number) => void }) => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className={`w-10 h-10 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
              value >= rating
                ? "bg-amber-500 border-amber-500 text-white"
                : "border-gray-600 text-gray-600 hover:border-amber-400"
            }`}
          >
            {rating}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto relative z-30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-black/40 backdrop-blur-sm border border-amber-900/30 rounded-2xl p-8 md:p-12 shadow-2xl"
      >
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">
            Client Satisfaction Survey
          </h2>
          <p className="text-gray-300">
            Thank you for choosing our studio! Please rate your experience.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section A: Client Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-amber-500 border-b border-amber-900/30 pb-2">
              A. Client Info (Optional)
            </h3>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="Your name (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Service Availed
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {services.map((service) => (
                  <label
                    key={service}
                    className="flex items-center space-x-2 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={formData.service.includes(service)}
                      onChange={() => handleServiceChange(service)}
                      className="w-5 h-5 rounded border-gray-600 text-amber-500 focus:ring-amber-500 focus:ring-offset-0 bg-black/50"
                    />
                    <span className="text-gray-300 group-hover:text-amber-400 transition-colors">
                      {service}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Section B: Ratings */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-amber-500 border-b border-amber-900/30 pb-2">
              B. Please Rate the Following
            </h3>
            <p className="text-sm text-gray-400">1 – Very Poor | 5 – Excellent</p>

            {ratingCategories.map((category) => (
              <div key={category.key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  {category.label}
                </label>
                <RatingStars
                  value={formData[category.key as keyof SurveyFormData] as number}
                  onChange={(rating) => handleRatingChange(category.key, rating)}
                />
              </div>
            ))}
          </div>

          {/* Section C: Overall */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-amber-500 border-b border-amber-900/30 pb-2">
              C. Overall
            </h3>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Overall Satisfaction
              </label>
              <RatingStars
                value={formData.overallSatisfaction}
                onChange={(rating) => setFormData({ ...formData, overallSatisfaction: rating })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Would you recommend our studio?
              </label>
              <div className="flex gap-4">
                {["Yes", "Maybe", "No"].map((option) => (
                  <label
                    key={option}
                    className="flex items-center space-x-2 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="wouldRecommend"
                      value={option}
                      checked={formData.wouldRecommend === option}
                      onChange={(e) => setFormData({ ...formData, wouldRecommend: e.target.value })}
                      className="w-5 h-5 border-gray-600 text-amber-500 focus:ring-amber-500 focus:ring-offset-0 bg-black/50"
                    />
                    <span className="text-gray-300 group-hover:text-amber-400 transition-colors">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="additionalComments" className="block text-sm font-medium text-gray-300 mb-2">
                Additional Comments (Optional)
              </label>
              <textarea
                id="additionalComments"
                value={formData.additionalComments}
                onChange={(e) => setFormData({ ...formData, additionalComments: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                placeholder="Any additional feedback you'd like to share..."
              />
            </div>
          </div>

          {/* Submit Status */}
          {submitStatus.type && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg ${
                submitStatus.type === "success"
                  ? "bg-green-900/20 border border-green-500/30 text-green-400"
                  : "bg-red-900/20 border border-red-500/30 text-red-400"
              }`}
            >
              {submitStatus.message}
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
              isSubmitting
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 shadow-lg hover:shadow-amber-500/50"
            } text-white`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit Survey"
            )}
          </motion.button>

          <p className="text-center text-sm text-gray-400">
            ✨ Thank you for your time and support!
          </p>
        </form>
      </motion.div>
    </div>
  )
}
