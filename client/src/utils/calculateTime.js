// client/src/utils/calculateTime.js

const calculateTime = (targetDate) => {
  const zero = { days: 0, hours: 0, minutes: 0, seconds: 0 };

  
  if (!targetDate) return zero;

  const target = new Date(targetDate);
  if (isNaN(target.getTime())) return zero; 

  const difference = target - new Date();
  if (difference <= 0) return zero;

  return {
    days:    Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

export default calculateTime;