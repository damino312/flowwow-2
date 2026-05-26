import { type FC } from "react";
import ProgressBar from "../../components/ProgressBar";
import gift from "../../assets/gift.png";
import "./Loading.css";

type TLoadingProps = {
  progress?: number;
};

const Loading: FC<TLoadingProps> = () => {
  return (
    <div className="loading">
      <img src={gift} alt="gift" />
      <p>
        Анализируем положение цветочных планет, делаем выгрузку заказов за 5
        лет
      </p>
      <ProgressBar />
    </div>
  );
};

export default Loading;
