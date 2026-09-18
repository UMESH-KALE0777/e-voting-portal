import { useEffect, useState } from "react";

const useCountdown = (targetDate) => {

  const calculateTimeLeft = () => {

    const difference = new Date(targetDate) - new Date();

    let timeLeft = {};

    if (difference > 0) {

      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),

        hours: Math.floor(
          (difference / (1000 * 60 * 60)) % 24
        ),

        minutes: Math.floor(
          (difference / 1000 / 60) % 60
        ),

        seconds: Math.floor(
          (difference / 1000) % 60
        ),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(
    calculateTimeLeft()
  );

  useEffect(() => {

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);

  }, []);

  return timeLeft;
};

export default useCountdown;