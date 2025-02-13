import { FaRegStar, FaStar } from "react-icons/fa";
import styled from "styled-components";
import { useState, useEffect } from "react";

const StarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1px;
  width: fit-content;

  .star {
    color: #ffa500;
    font-size: 16px;
  }

  .score {
    font-size: 20px;
    margin-left: 10px;
  }
`;

const ReviewRating = ({ rating }) => {
  const [starScore, setStarScore] = useState(rating);

  useEffect(() => {
    setStarScore(rating);
  }, [rating]);

  const ratingStarHandler = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i + 1}>
        {i + 1 <= starScore ? (
          <FaStar className="star" />
        ) : (
          <FaRegStar className="star" />
        )}
      </span>
    ));
  };

  return <StarSection>{ratingStarHandler()}</StarSection>;
};

export default ReviewRating;
