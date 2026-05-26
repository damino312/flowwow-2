import { Container } from "../../components/Container";
import Button from "../../components/Button";
import { capturePageAsBlob, downloadBlob } from "../../utils/capturePage";
import gift3 from "../../assets/gift-3.svg";
import "./Result.css";

const SHARE_TEXT = `А ты знаешь, что вот-вот подаришь мне пионы? Это не я придумала — это астрология, наука и вообще судьба. Так что, если ты вдруг в ближайшие дни почувствуешь необъяснимую тягу к красивым цветам, это космос работает.

Не спорь со звездами. Сделай красиво. Вот промокод: LUNAR`;

const IMAGE_FILENAME = "pionovyj-predskazatel.png";

const Result = () => {
  const handleDownload = async () => {
    try {
      const blob = await capturePageAsBlob();
      await downloadBlob(blob, IMAGE_FILENAME);
    } catch {
      const name = sessionStorage.getItem("formName") || "";
      const blob = new Blob([`${name}\n\n${SHARE_TEXT}`], {
        type: "text/plain;charset=utf-8",
      });
      await downloadBlob(blob, "pionovyj-predskazatel.txt");
    }
  };

  const handleShare = async () => {
    try {
      const blob = await capturePageAsBlob();
      const file = new File([blob], IMAGE_FILENAME, { type: "image/png" });
      const shareData = { files: [file] };

      if (navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        return;
      }

      await downloadBlob(blob, IMAGE_FILENAME);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      alert("Не удалось поделиться результатом.");
    }
  };

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
          <p>Не&nbsp;спорь со&nbsp;звездами. Сделай красиво. Вот промокод*.</p>
        </div>
        <div className="gift">
          <img src={gift3} alt="gift" />
          <p>LUNAR</p>
        </div>
        <div className="result-actions">
          <Button color="primary" type="button" onClick={handleDownload}>
            Скачать результат
          </Button>
          <Button color="secondary" type="button" onClick={handleShare}>
            Пошерить
          </Button>
        </div>
        <p className="result-disclaimer">
          *на одно применение при покупке от ххх рублей до хх.хх.хххх
        </p>
      </div>
    </Container>
  );
};

export default Result;
