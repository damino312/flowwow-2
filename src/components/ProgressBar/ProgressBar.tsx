import { useEffect, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import "./ProgressBar.css";

type ProgressBarProps = {
  progress?: number;
};

const ProgressBar: FC<ProgressBarProps> = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: number | undefined;
    if (isLoading && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.random() * 20;
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 500);
    } else if (progress >= 100) {
      setIsLoading(false);
      navigate("/promo");
    }
    return () => clearInterval(interval);
  }, [isLoading, navigate, progress]);

  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${progress}%`,
            backgroundColor: "#FFFFFF",
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
