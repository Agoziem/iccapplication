"use client";
import { useState, useEffect } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import styles from './StarRating.module.css';

const StarRating = ({ rating }) => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const starArray = [];
    let tempRating = rating;

    for (let i = 0; i < 5; i++) {
      if (tempRating >= 1) {
        starArray.push(<FaStar key={i} className={styles.filled} />);
        tempRating -= 1;
      } else if (tempRating >= 0.5) {
        starArray.push(<FaStarHalfAlt key={i} className={styles.filled} />);
        tempRating -= 0.5;
      } else {
        starArray.push(<FaRegStar key={i} className={styles.empty} />);
      }
    }

    setStars(starArray);
  }, [rating]);

  return <div className={styles.starRating}>{stars}</div>;
};

export default StarRating;
