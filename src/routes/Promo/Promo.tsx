import { useEffect, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "../../components/Container";
import Button from "../../components/Button";
import { monthPrediction } from "../../const/copyrights";
import { PROMO_CODE } from "../../constants/promo";
import { usePromoCopy } from "../../hooks/usePromoCopy";
import { buildResultPath } from "../../utils/resultParams";
import gift2 from "../../assets/gift-2.svg";
import "./Promo.css";

const Promo: FC = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<string>("");
  const { copyPromocode, toast } = usePromoCopy();

  useEffect(() => {
    if (!sessionStorage.getItem("formDate")) {
      sessionStorage.setItem("formDate", "25.11.1995");
    }

    if (!sessionStorage.getItem("formName")) {
      sessionStorage.setItem("formName", "Никита");
    }
    setDate(sessionStorage.getItem("formDate") || "");
  }, []);

  const month = date.split(".")[1];

  return (
    <div className="promo">
      {toast}
      <button
        type="button"
        className="code code--copy"
        onClick={copyPromocode}
        aria-label="Скопировать промокод"
      >
        <p className="promotext">Твой промокод:</p>
        <p className="promocode">{PROMO_CODE}</p>
      </button>
      <Container>
        <div>
          <div className="gift">
            <img src={gift2} alt="gift" />
          </div>
          <p className="date">{monthPrediction(month)?.date}</p>
          <p className="text">{monthPrediction(month)?.text}</p>
          <p className="text">{monthPrediction(month)?.promocodeText}</p>
        </div>
        <Button
          color="primary"
          type="button"
          onClick={() => {
            const name = sessionStorage.getItem("formName") || "";
            const date = sessionStorage.getItem("formDate") || "";
            navigate(buildResultPath(name, date));
          }}
        >
          Намекнем ему?
        </Button>
      </Container>
    </div>
  );
};

export default Promo;
