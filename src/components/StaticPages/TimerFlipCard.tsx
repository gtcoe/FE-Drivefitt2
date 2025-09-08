import React, { useState, useEffect, useRef } from "react";

interface FlipCardProps {
  value: number;
  label: string;
}

const FlipCard = ({ value, label }: FlipCardProps) => {
  const [currentValue, setCurrentValue] = useState("00");
  const [prevValue, setPrevValue] = useState("00");
  const cardRef = useRef<HTMLElement>(null);
  const topRef = useRef<HTMLElement>(null);
  const bottomRef = useRef<HTMLElement>(null);
  const backRef = useRef<HTMLElement>(null);
  const backBottomRef = useRef<HTMLElement>(null);

  const formatNumber = (num: number): string => {
    return ("0" + (num || 0)).slice(-2);
  };

  useEffect(() => {
    const newValue = formatNumber(value);

    if (newValue !== currentValue) {
      const top = topRef.current;
      const bottom = bottomRef.current;
      const back = backRef.current;
      const backBottom = backBottomRef.current;
      const card = cardRef.current;

      if (currentValue !== "00" && back && bottom) {
        back.setAttribute("data-value", currentValue);
        bottom.setAttribute("data-value", currentValue);
      }

      setPrevValue(currentValue);
      setCurrentValue(newValue);

      if (top) {
        top.textContent = newValue;
      }
      if (backBottom) {
        backBottom.setAttribute("data-value", newValue);
      }

      if (card) {
        card.classList.remove("flip");
        void card.offsetWidth;
        card.classList.add("flip");
      }
    }
  }, [value, currentValue]);

  return (
    <span className="flip-clock__piece">
      <b ref={cardRef} className="flip-clock__card card">
        <b ref={topRef} className="card__top">
          {currentValue}
        </b>
        <b ref={bottomRef} className="card__bottom" data-value={prevValue}></b>
        <b ref={backRef} className="card__back" data-value={prevValue}>
          <b
            ref={backBottomRef}
            className="card__bottom"
            data-value={currentValue}
          ></b>
        </b>
      </b>
      <span className="flip-clock__slot">{label}</span>
    </span>
  );
};

interface TimeState {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  total?: number;
}

interface FlipClockProps {
  countdown?: Date;
  labels?: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  onComplete?: () => void;
}

const FlipClock = ({ countdown, labels, onComplete }: FlipClockProps) => {
  const [time, setTime] = useState<TimeState>({});
  const animationRef = useRef<number>();

  const getTimeRemaining = (endtime: Date): TimeState => {
    const t =
      Date.parse(endtime.toString()) - Date.parse(new Date().toString());
    return {
      total: t,
      days: Math.floor(t / (1000 * 60 * 60 * 24)),
      hours: Math.floor((t / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((t / 1000 / 60) % 60),
      seconds: Math.floor((t / 1000) % 60),
    };
  };

  const getCurrentTime = (): TimeState => {
    const t = new Date();
    return {
      total: t.getTime(),
      hours: t.getHours() % 12,
      minutes: t.getMinutes(),
      seconds: t.getSeconds(),
    };
  };

  useEffect(() => {
    let frameCount = 0;

    const updateClock = () => {
      animationRef.current = requestAnimationFrame(updateClock);

      if (frameCount++ % 10 !== 0) return;

      const newTime = countdown
        ? getTimeRemaining(countdown)
        : getCurrentTime();

      if (countdown && newTime.total && newTime.total < 0) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (onComplete) {
          onComplete();
        }
        return;
      }

      setTime(newTime);
    };

    setTimeout(updateClock, 500);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [countdown, onComplete]);

  const timeUnits = countdown
    ? [
        { key: "days", label: labels?.days || "Days", value: time.days || 0 },
        {
          key: "hours",
          label: labels?.hours || "Hours",
          value: time.hours || 0,
        },
        {
          key: "minutes",
          label: labels?.minutes || "Minutes",
          value: time.minutes || 0,
        },
        {
          key: "seconds",
          label: labels?.seconds || "Seconds",
          value: time.seconds || 0,
        },
      ]
    : [
        {
          key: "hours",
          label: labels?.hours || "Hours",
          value: time.hours || 0,
        },
        {
          key: "minutes",
          label: labels?.minutes || "Minutes",
          value: time.minutes || 0,
        },
        {
          key: "seconds",
          label: labels?.seconds || "Seconds",
          value: time.seconds || 0,
        },
      ];

  return (
    <div className="flip-clock">
      {timeUnits.map((unit) => (
        <FlipCard key={unit.key} value={unit.value} label={unit.label} />
      ))}
    </div>
  );
};

interface TimeFlipCardProps {
  countdownDate?: string;
  labels?: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
}

const TimeFlipCard = ({ countdownDate, labels }: TimeFlipCardProps) => {
  const [countdownComplete, setCountdownComplete] = useState(false);

  const deadline = countdownDate
    ? new Date(countdownDate)
    : new Date(Date.now() + 12 * 24 * 60 * 60 * 1000);

  return (
    <div>
      <style>{`
        .flip-clock {
          text-align: center;
          perspective: 400px;
          margin: 0;
        }

        .flip-clock *,
        .flip-clock *:before,
        .flip-clock *:after {
          box-sizing: border-box;
        }

        .flip-clock__piece {
          display: inline-block;
          margin: 0 8px;
        }

        .flip-clock__slot {
          font-size: 10px;
          color: #8A8A8A;
          margin-top: 5px;
          display: block;
          font-weight: 500;
          letter-spacing: 1px;
        }

        .card {
          display: block;
          position: relative;
          padding-bottom: 0.72em;
          font-size: 32px;
          line-height: 100%;
          letter-spacing: -2px;
          font-weight: 600;
        }

        .card__top,
        .card__bottom,
        .card__back::before,
        .card__back::after {
          display: block;
          height: 0.72em;
          color: #FFF;
          background: #0D0D0D;
          padding: 0.25em 0.25em;
          border-radius: 0.15em 0.15em 0 0;
          backface-visibility: hidden;
          transform-style: preserve-3d;
          width: 1.8em;
          transform: translateZ(0);
          text-align: center;
          font-weight: bold;
        }

        .card__bottom {
          color: #FFF;
          position: absolute;
          top: 50%;
          left: 0;
          border-top: solid 1px #000;
          background: #393939;
          border-radius: 0 0 0.15em 0.15em;
          pointer-events: none;
          overflow: hidden;
        }

        .card__bottom::after {
          display: block;
          margin-top: -0.72em;
          content: attr(data-value);
        }

        .card__back::before {
          content: attr(data-value);
        }

        .card__back {
          position: absolute;
          top: 0;
          height: 100%;
          left: 0%;
          pointer-events: none;
        }

        .card__back::before {
          position: relative;
          z-index: -1;
          overflow: hidden;
        }

        .flip .card__back::before {
          animation: flipTop 0.3s cubic-bezier(.37,.01,.94,.35);
          animation-fill-mode: both;
          transform-origin: center bottom;
        }

        .flip .card__back .card__bottom {
          transform-origin: center top;
          animation-fill-mode: both;
          animation: flipBottom 0.6s cubic-bezier(.15,.45,.28,1);
        }

        @keyframes flipTop {
          0% {
            transform: rotateX(0deg);
            z-index: 2;
          }
          0%, 99% {
            opacity: 0.99;
          }
          100% {
            transform: rotateX(-90deg);
            opacity: 0;
          }
        }

        @keyframes flipBottom {
          0%, 50% {
            z-index: -1;
            transform: rotateX(90deg);
            opacity: 0;
          }
          51% {
            opacity: 0.99;
          }
          100% {
            opacity: 0.99;
            transform: rotateX(0deg);
            z-index: 5;
          }
        }
      `}</style>

      <FlipClock
        countdown={deadline}
        labels={labels}
        onComplete={() => {
          setCountdownComplete(true);
          alert("Countdown complete!");
        }}
      />

      {countdownComplete && (
        <div style={{ color: "red", fontSize: "2em", margin: "20px" }}>
          Time&apos;s Up!
        </div>
      )}
    </div>
  );
};

export default TimeFlipCard;
