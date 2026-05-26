import { Container } from "../components/Container";
import Button from "../components/Button";
import {
  capturePageAsBlob,
  downloadBlob,
} from "../utils/capturePage";

const SHARE_TEXT = `А ты знаешь, что вот-вот подаришь мне пионы? Это не я придумала — это астрология, наука и вообще судьба. Так что, если ты вдруг в ближайшие дни почувствуешь необъяснимую тягу к красивым цветам, это космос работает.

Не спорь со звездами. Сделай красиво. Вот промокод: LUNAR`;

const IMAGE_FILENAME = "pionovyj-predskazatel.png";

const Result = () => {
  const handleDownload = async () => {
    try {
      const blob = await capturePageAsBlob();
      downloadBlob(blob, IMAGE_FILENAME);
    } catch {
      const name = sessionStorage.getItem("formName") || "";
      const blob = new Blob([`${name}\n\n${SHARE_TEXT}`], {
        type: "text/plain;charset=utf-8",
      });
      downloadBlob(blob, "pionovyj-predskazatel.txt");
    }
  };

  const handleShare = async () => {
    try {
      const blob = await capturePageAsBlob();
      const file = new File([blob], IMAGE_FILENAME, { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Пионовый предсказатель",
          text: SHARE_TEXT,
        });
        return;
      }

      downloadBlob(blob, IMAGE_FILENAME);

      const vkUrl = `https://vk.com/share.php?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(SHARE_TEXT)}`;
      window.open(vkUrl, "_blank", "noopener,noreferrer");
    } catch {
      const vkUrl = `https://vk.com/share.php?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(SHARE_TEXT)}`;
      window.open(vkUrl, "_blank", "noopener,noreferrer");
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
          <p>
            Не&nbsp;спорь со&nbsp;звездами. Сделай красиво. Вот промокод*.
          </p>
        </div>
        <div className="gift">
          <img src="src/assets/gift-3.svg" alt="gift" />
          <p>LUNAR</p>
        </div>
        <div className="result-actions">
          <Button color="primary" type="button" onClick={handleDownload}>
            Скачать результат
          </Button>
          <Button color="secondary" type="button" onClick={handleShare}>
            Поделиться ВК
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
