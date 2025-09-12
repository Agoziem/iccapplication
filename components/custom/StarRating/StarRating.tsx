"use client";
import React, { useState, useEffect } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import styles from './StarRating.module.css';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  emptyColor?: string;
  className?: string;
  style?: React.CSSProperties;
  readOnly?: boolean;
  onRatingChange?: (rating: number) => void;
  showValue?: boolean;
  precision?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating,
  maxStars = 5,
  size = 'medium',
  color,
  emptyColor,
  className = "",
  style = {},
  readOnly = true,
  onRatingChange,
  showValue = false,
  precision = 0.5
}) => {
  const [stars, setStars] = useState<React.ReactNode[]>([]);
  const [hoverRating, setHoverRating] = useState<number>(0);

  // Clamp rating between 0 and maxStars
  const clampedRating = Math.max(0, Math.min(maxStars, rating || 0));
  const displayRating = readOnly ? clampedRating : (hoverRating || clampedRating);

  const handleStarClick = (starIndex: number) => {
    if (!readOnly && onRatingChange) {
      const newRating = starIndex + 1;
      onRatingChange(newRating);
    }
  };

  const handleStarHover = (starIndex: number) => {
    if (!readOnly) {
      setHoverRating(starIndex + 1);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'small': return styles.small || 'star-small';
      case 'large': return styles.large || 'star-large';
      default: return styles.medium || 'star-medium';
    }
  };

  useEffect(() => {
    const starArray: React.ReactNode[] = [];
    let tempRating = displayRating;

    for (let i = 0; i < maxStars; i++) {
      const starProps = {
        key: i,
        className: `${styles.star || 'star'} ${getSizeClass()}`,
        style: {
          color: tempRating > 0 ? color : emptyColor,
          cursor: readOnly ? 'default' : 'pointer',
        },
        onClick: () => handleStarClick(i),
        onMouseEnter: () => handleStarHover(i),
        role: readOnly ? 'img' : 'button',
        'aria-label': readOnly ? 
          `Rating: ${clampedRating} out of ${maxStars} stars` : 
          `Rate ${i + 1} out of ${maxStars} stars`,
        tabIndex: readOnly ? -1 : 0,
      };

      if (tempRating >= 1) {
        starArray.push(
          <FaStar 
            {...starProps}
            className={`${starProps.className} ${styles.filled || 'star-filled'}`}
          />
        );
        tempRating -= 1;
      } else if (tempRating >= precision && precision === 0.5) {
        starArray.push(
          <FaStarHalfAlt 
            {...starProps}
            className={`${starProps.className} ${styles.filled || 'star-filled'}`}
          />
        );
        tempRating = 0;
      } else {
        starArray.push(
          <FaRegStar 
            {...starProps}
            className={`${starProps.className} ${styles.empty || 'star-empty'}`}
          />
        );
      }
    }

    setStars(starArray);
  }, [displayRating, maxStars, color, emptyColor, readOnly, precision]);

  return (
    <div 
      className={`${styles.starRating || 'star-rating'} ${className}`}
      style={style}
      onMouseLeave={handleMouseLeave}
      role={readOnly ? 'img' : 'radiogroup'}
      aria-label={`Star rating: ${clampedRating} out of ${maxStars}`}
    >
      {stars}
      {showValue && (
        <span className={`${styles.ratingValue || 'rating-value'} ms-2`}>
          ({clampedRating.toFixed(1)})
        </span>
      )}
    </div>
  );
};

export default StarRating;
