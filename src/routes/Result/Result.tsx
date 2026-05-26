import { useState } from "react";
import { Container } from "../../components/Container";
import Button from "../../components/Button";
import {
  capturePageAsBlob,
  downloadFile,
  downloadImage,
  shareImage,
} from "../../utils/capturePage";
import gift3 from "../../assets/gift-3.svg";
import "./Result.css";

const SHARE_TEXT = `А ты знаешь, что вот-вот подаришь мне пионы? Это не я придумала — это астрология, наука и вообще судьба. Так что, если ты вдруг в ближайшие дни почувствуешь необъяснимую тягу к красивым цветам, это космос работает.

Не спорь со звездами. Сделай красиво. Вот промокод: LUNAR`;

const IMAGE_FILENAME = "pionovyj-predskazatel.png";

type ExportAction = "download" | "share";

const Result = () => {
  const [pendingAction, setPendingAction] = useState<ExportAction | null>(null);
  const isExporting = pendingAction !== null;

  const handleDownload = async () => {
    if (isExporting) return;

    setPendingAction("download");

    try {
      const blob = await capturePageAsBlob();
      await downloadImage(blob, IMAGE_FILENAME);
    } catch {
      const name = sessionStorage.getItem("formName") || "";
      const blob = new Blob([`${name}\n\n${SHARE_TEXT}`], {
        type: "text/plain;charset=utf-8",
      });
      await downloadFile(blob, "pionovyj-predskazatel.txt");
    } finally {
      setPendingAction(null);
    }
  };

  const handleShare = async () => {
    if (isExporting) return;

    setPendingAction("share");

    try {
      const blob = await capturePageAsBlob();
      await shareImage(blob, IMAGE_FILENAME);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      alert("Не удалось поделиться результатом.");
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <Container>
      <div className="result">
        <div className="result-body">
          <p className="name">{sessionStorage.getItem("formName")}</p>
          <div className="text">
            <p>
              А&nbsp;ты&nbsp;знаешь, что вот-вот подаришь мне пионы? Это
              не&nbsp;я&nbsp;придумала&nbsp;&mdash; это астрология, наука
              и&nbsp;вообще судьба. Так что, если ты&nbsp;вдруг
              в&nbsp;ближайшие дни почувствуешь необъяснимую тягу
              к&nbsp;красивым цветам, это космос работает.
            </p>
            <p>
              Не&nbsp;спорь со&nbsp;звездами. Сделай красиво. Вот промокод*.
            </p>
          </div>
          <div className="gift">
            <img src={gift3} alt="gift" />
            <p>LUNAR</p>
          </div>
          <div className="result-actions">
            <Button
              color="primary"
              type="button"
              onClick={handleDownload}
              disabled={isExporting}
              loading={pendingAction === "download"}
            >
              Скачать результат
            </Button>
            <Button
              color="secondary"
              type="button"
              onClick={handleShare}
              disabled={isExporting}
              loading={pendingAction === "share"}
            >
              Пошерить
            </Button>
          </div>
        </div>

        <p className="result-disclaimer">
          *на одно применение при покупке от ххх рублей до хх.хх.хххх
        </p>
      </div>
    </Container>
  );
};

export default Result;
