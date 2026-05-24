import { Container } from "../components/Container";

const Result = () => {
  return (
    <Container>
      <div className="result">
        <p className="name">{sessionStorage.getItem("formName")}</p>
        <div className="text">
          <p>
            А&nbsp;ты&nbsp;знаешь, что вот-вот подаришь мне пионы? Это
            не&nbsp;я&nbsp;придумала&nbsp;&mdash; это астрология, наука
            и&nbsp;вообще судьба. Так что, если ты&nbsp;вдруг в&nbsp;ближайшие
            дни почувствуешь необъяснимую тягу к&nbsp;красивым цветам, это
            космос работает.
          </p>
          <p>
            Не&nbsp;спорь со&nbsp;звездами. Сделай красиво. Вот промокод*.
          </p>
        </div>
        <div className="gift">
          <img src="src/assets/gift-3.svg" alt="gift" />
          <p>LUNAR</p>
        </div>
        <p className="share">Скринь, шерь, жди пионы</p>
      </div>
    </Container>
  );
};

export default Result;
