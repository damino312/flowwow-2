import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container } from "../../components/Container";
import Button from "../../components/Button";
import ShareMeta from "../../components/ShareMeta";
import {
  RESULT_PARAM_DATE,
  RESULT_PARAM_NAME,
} from "../../utils/resultParams";
import { monthPrediction } from "../../const/copyrights";
import {
  capturePageAsBlob,
  downloadFile,
  downloadImage,
  shareImageWithText,
} from "../../utils/capturePage";
import { readResultParams } from "../../utils/resultParams";
import { validateDate } from "../../utils/validators";
import gift3 from "../../assets/gift-3.svg";
import "./Result.css";

const DOWNLOAD_FALLBACK_TEXT = `А ты знаешь, что вот-вот подаришь мне пионы? Это не я придумала — это астрология, наука и вообще судьба. Так что, если ты вдруг в ближайшие дни почувствуешь необъяснимую тягу к красивым цветам, это космос работает.

Не спорь со звездами. Сделай красиво. Вот промокод: LUNAR`;

const IMAGE_FILENAME = "pionovyj-predskazatel.jpeg";

type ExportAction = "download" | "share";

function buildShareText(birthDate: string): string {
  const month = birthDate.split(".")[1];
  const predictionDate = monthPrediction(month)?.date;

  if (predictionDate) {
    return `Я узнала, когда мне закажут пионы на Flowwow! Мой магический момент — ${predictionDate}.`;
  }

  return "Я узнала, когда мне закажут пионы на Flowwow!";
}

const Result = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [pendingAction, setPendingAction] = useState<ExportAction | null>(null);
  const isExporting = pendingAction !== null;

  useEffect(() => {
    const hasUrlParams =
      searchParams.has(RESULT_PARAM_NAME) ||
      searchParams.has(RESULT_PARAM_DATE);

    if (hasUrlParams) {
      const fromUrl = readResultParams(searchParams);

      if (fromUrl) {
        setName(fromUrl.name);
        setDate(fromUrl.date);
        sessionStorage.setItem("formName", fromUrl.name);
        sessionStorage.setItem("formDate", fromUrl.date);
        return;
      }

      navigate("/", { replace: true });
      return;
    }

    const storedName = sessionStorage.getItem("formName") || "";
    const storedDate = sessionStorage.getItem("formDate") || "";

    if (storedName && storedDate && validateDate(storedDate).isValid) {
      setName(storedName);
      setDate(storedDate);
      setSearchParams(
        {
          [RESULT_PARAM_NAME]: storedName,
          [RESULT_PARAM_DATE]: storedDate,
        },
        { replace: true },
      );
      return;
    }

    navigate("/", { replace: true });
  }, [navigate, searchParams, setSearchParams]);

  const handleDownload = async () => {
    if (isExporting) return;

    setPendingAction("download");

    try {
      const blob = await capturePageAsBlob();
      await downloadImage(blob, IMAGE_FILENAME);
    } catch {
      const blob = new Blob([`${name}\n\n${DOWNLOAD_FALLBACK_TEXT}`], {
        type: "text/plain;charset=utf-8",
      });
      await downloadFile(blob, "pionovyj-predskazatel.txt");
    } finally {
      setPendingAction(null);
    }
  };

  const handleShare = async () => {
    if (isExporting || !name || !date) return;

    setPendingAction("share");
    const shareText = buildShareText(date);

    try {
      const blob = await capturePageAsBlob();
      await shareImageWithText(blob, IMAGE_FILENAME, shareText);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;

      try {
        const blob = await capturePageAsBlob();
        await downloadImage(blob, IMAGE_FILENAME);
        alert(
          "Не удалось скопировать в буфер. Картинка сохранена в «Загрузки» — прикрепите её в чат вручную.",
        );
      } catch {
        alert("Не удалось поделиться результатом.");
      }
    } finally {
      setPendingAction(null);
    }
  };

  if (!name || !date) return null;

  const shareUrl = new URL(
    `${import.meta.env.BASE_URL}result?${new URLSearchParams({
      [RESULT_PARAM_NAME]: name,
      [RESULT_PARAM_DATE]: date,
    })}`,
    window.location.origin,
  ).href;

  return (
    <Container>
      <ShareMeta birthDate={date} shareUrl={shareUrl} />
      <div className="result">
        <div className="result-body">
          <p className="name">{name}</p>
          <div className="text">
            <p>
              А&nbsp;ты&nbsp;знаешь, что вот-вот подаришь мне пионы? Это
              не&nbsp;я&nbsp;придумала&nbsp;&mdash; это астрология, наука
              и&nbsp;вообще судьба. Так что, если ты&nbsp;вдруг в&nbsp;ближайшие
              дни почувствуешь необъяснимую тягу к&nbsp;красивым цветам, это
              космос работает.
            </p>
            <p>Не&nbsp;спорь со&nbsp;звездами. Сделай красиво. Вот промокод.</p>
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
              Поделиться
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
