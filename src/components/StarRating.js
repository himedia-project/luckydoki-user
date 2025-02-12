import { FaRegStar, FaStar } from "react-icons/fa";
import styled from "styled-components";
import { useState } from "react";

const StarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  .star {
    color: #ffa500;
    font-size: 32px;
    cursor: pointer;
  }

  .score {
    font-size: 20px;
    margin-left: 10px;
  }
`;

const StarRating = ({ setRating }) => {
  const [starScore, setStarScore] = useState(0);

  const handleStarClick = (score) => {
    setStarScore(score);
    setRating(score);
  };

  const ratingStarHandler = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i + 1} onClick={() => handleStarClick(i + 1)}>
        {i + 1 <= starScore ? (
          <FaStar className="star" />
        ) : (
          <FaRegStar className="star" />
        )}
      </span>
    ));
  };

  return (
    <StarSection>
      {ratingStarHandler()}
      <span className="score">{starScore} 점</span>
    </StarSection>
  );
};

export default StarRating;
