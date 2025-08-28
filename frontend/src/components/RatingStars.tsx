import React from 'react'
import { Star } from 'lucide-react'

interface RatingStarsProps {
  rating: number
  reviews?: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showHalfStars?: boolean
  className?: string
  showReviewCount?: boolean
}

export default function RatingStars({ 
  rating, 
  reviews,
  maxRating = 5, 
  size = 'md', 
  showHalfStars = true,
  className = '',
  showReviewCount = true
}: RatingStarsProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  const renderStars = () => {
    const stars = []
    
    for (let i = 1; i <= maxRating; i++) {
      const starValue = i
      const isFilled = rating >= starValue
      const isHalfFilled = showHalfStars && rating >= starValue - 0.5 && rating < starValue
      
      let starClass = 'text-gray-300'
      if (isFilled) {
        starClass = 'text-amber-400 fill-current'
      } else if (isHalfFilled) {
        starClass = 'text-amber-400'
      }
      
      stars.push(
        <Star 
          key={i}
          className={`${sizeClasses[size]} ${starClass} ${className}`}
          aria-hidden="true"
        />
      )
    }
    
    return stars
  }

  return (
    <div className="flex items-center space-x-2">
      <div 
        className="flex items-center space-x-1"
        role="img"
        aria-label={`Rating: ${rating} out of ${maxRating} stars`}
      >
        {renderStars()}
      </div>
      {showReviewCount && reviews !== undefined && (
        <span className="text-sm text-amber-600">({reviews} reviews)</span>
      )}
    </div>
  )
}

// Helper function for backward compatibility
export const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
  return <RatingStars rating={rating} size={size} />
} 