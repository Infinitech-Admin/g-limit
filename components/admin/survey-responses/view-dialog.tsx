'use client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'

interface SurveyResponse {
  id: number
  name: string | null
  service: string[]
  ease_of_booking: number
  communication: number
  studio_cleanliness: number
  staff_professionalism: number
  comfort_during_shoot: number
  quality_of_work: number
  editing_style: number
  timeliness_of_delivery: number
  overall_satisfaction: number
  would_recommend: 'Yes' | 'Maybe' | 'No'
  additional_comments: string | null
  created_at: string
  updated_at: string
}

interface SurveyResponseViewDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  surveyResponse: SurveyResponse | null
}

const RatingDisplay = ({ rating, label }: { rating: number; label: string }) => (
  <div className="space-y-2">
    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{label}</div>
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${
            star <= rating
              ? 'fill-amber-500 text-amber-500'
              : 'fill-gray-200 text-gray-300'
          }`}
        />
      ))}
      <span className="ml-2 text-sm font-bold text-gray-900 dark:text-gray-100">{rating}/5</span>
    </div>
  </div>
)

export function SurveyResponseViewDialog({
  open,
  setOpen,
  surveyResponse,
}: SurveyResponseViewDialogProps) {
  if (!surveyResponse) return null

  const getAverageRating = () => {
    const ratings = [
      surveyResponse.ease_of_booking,
      surveyResponse.communication,
      surveyResponse.studio_cleanliness,
      surveyResponse.staff_professionalism,
      surveyResponse.comfort_during_shoot,
      surveyResponse.quality_of_work,
      surveyResponse.editing_style,
      surveyResponse.timeliness_of_delivery,
    ]
    const sum = ratings.reduce((acc, rating) => acc + rating, 0)
    return (sum / ratings.length).toFixed(2)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Survey Response Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Client Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 border-b-2 border-gray-200 dark:border-gray-700 pb-2">
              Client Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Name</div>
                <div className="text-base font-medium text-gray-900 dark:text-gray-100">
                  {surveyResponse.name || (
                    <span className="italic text-gray-500 dark:text-gray-400">Anonymous</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Submitted</div>
                <div className="text-base font-medium text-gray-900 dark:text-gray-100">
                  {new Date(surveyResponse.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Services Availed</div>
              <div className="flex flex-wrap gap-2">
                {surveyResponse.service && surveyResponse.service.length > 0 ? (
                  surveyResponse.service.map((service, idx) => (
                    <Badge key={idx} variant="secondary" className="text-sm font-medium">
                      {service}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400 italic">No services selected</span>
                )}
              </div>
            </div>
          </div>

          {/* Ratings */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 border-b-2 border-gray-200 dark:border-gray-700 pb-2">
              Service Ratings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RatingDisplay rating={surveyResponse.ease_of_booking} label="Ease of Booking" />
              <RatingDisplay rating={surveyResponse.communication} label="Communication & Responsiveness" />
              <RatingDisplay rating={surveyResponse.studio_cleanliness} label="Studio Cleanliness & Ambiance" />
              <RatingDisplay rating={surveyResponse.staff_professionalism} label="Staff Professionalism" />
              <RatingDisplay rating={surveyResponse.comfort_during_shoot} label="Comfort During Shoot" />
              <RatingDisplay rating={surveyResponse.quality_of_work} label="Quality of Photos/Videos" />
              <RatingDisplay rating={surveyResponse.editing_style} label="Editing Style & Consistency" />
              <RatingDisplay rating={surveyResponse.timeliness_of_delivery} label="Timeliness of Delivery" />
            </div>
          </div>

          {/* Overall */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 border-b-2 border-gray-200 dark:border-gray-700 pb-2">
              Overall Assessment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Overall Satisfaction</div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 ${
                        star <= surveyResponse.overall_satisfaction
                          ? 'fill-amber-500 text-amber-500'
                          : 'fill-gray-200 text-gray-300 dark:fill-gray-600 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {surveyResponse.overall_satisfaction}/5
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Average Rating</div>
                <div className="text-3xl font-bold text-amber-600">{getAverageRating()}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">out of 5</div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Would Recommend</div>
                <Badge
                  className={`text-base font-semibold px-4 py-2 ${
                    surveyResponse.would_recommend === 'Yes'
                      ? 'bg-green-100 text-green-800 border border-green-300 hover:bg-green-100'
                      : surveyResponse.would_recommend === 'Maybe'
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-300 hover:bg-yellow-100'
                        : 'bg-red-100 text-red-800 border border-red-300 hover:bg-red-100'
                  }`}
                >
                  {surveyResponse.would_recommend}
                </Badge>
              </div>
            </div>
          </div>

          {/* Additional Comments */}
          {surveyResponse.additional_comments && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 border-b-2 border-gray-200 dark:border-gray-700 pb-2">
                Additional Comments
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap leading-relaxed">
                  {surveyResponse.additional_comments}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
