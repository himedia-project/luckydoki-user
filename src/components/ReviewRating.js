import { FaRegStar, FaStar } from "react-icons/fa";
import styled from "styled-components";

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
    font-size: 12px;
    font-weight: 700;
    margin-left: 2px;
  }
`;

const ReviewRating = ({ rating }) => {
  const roundedRating = Math.round(rating);

  const ratingStarHandler = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i + 1}>
        {i < roundedRating ? (
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
      <span className="score">{rating}</span>
    </StarSection>
  );
};

export default ReviewRating;
