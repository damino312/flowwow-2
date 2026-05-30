import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "../../components/Container";
import Button from "../../components/Button";
import logo2 from "../../assets/logo-2.svg";
import peonie1 from "../../assets/peonie_1.png";
import peonie3 from "../../assets/peonie_3.png";
import star from "../../assets/star.png";
import "./Home.css";

const Home: FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/prediction");
  };

  return (
    <div className="home">
      <Container>
        <div className="logo2">
          <img src={logo2} alt="logo" />
        </div>
        <h2>Пионовый предсказатель</h2>
        <p className="home-text">
          Узнай, когда он&nbsp;подарит тебе пионы, и&nbsp;мягко намекни
        </p>
        <Button type="button" color="primary" onClick={handleClick}>
          Предсказать
        </Button>
      </Container>
      <div className="peonie">
        <img src={peonie1} alt="peonie" className="home-img" />
        <img src={peonie3} alt="peonie" className="home-img" />
        <img src={star} alt="peonie" className="home-img" />
      </div>
    </div>
  );
};

export default Home;
