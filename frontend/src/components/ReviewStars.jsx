import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const ReviewStars = ({ rating = 0, count, size = 16, showCount = true }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<FaStar key={i} size={size} color="var(--gold)" />);
    } else if (i === fullStars && hasHalf) {
      stars.push(<FaStarHalfAlt key={i} size={size} color="var(--gold)" />);
    } else {
      stars.push(<FaRegStar key={i} size={size} color="var(--gold)" />);
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <div style={{ display: 'flex', gap: '2px' }}>{stars}</div>
      {showCount && count !== undefined && (
        <span
          style={{
            fontSize: size * 0.8,
            color: 'var(--gray-500)',
            fontFamily: 'var(--font-body)',
          }}
        >
          ({count})
        </span>
      )}
    </div>
  );
};

export default ReviewStars;
