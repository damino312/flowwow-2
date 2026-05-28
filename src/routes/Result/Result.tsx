import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container } from "../../components/Container";
import Button from "../../components/Button";
import {
  capturePageAsBlob,
  downloadFile,
  downloadImage,
} from "../../utils/capturePage";
import {
  buildResultShareUrl,
  readResultParams,
  RESULT_PARAM_DATE,
  RESULT_PARAM_NAME,
} from "../../utils/resultParams";
import { validateDate } from "../../utils/validators";
import gift3 from "../../assets/gift-3.svg";
import "./Result.css";

const SHARE_TEXT = `А ты знаешь, что вот-вот подаришь мне пионы? Это не я придумала — это астрология, наука и вообще судьба. Так что, если ты вдруг в ближайшие дни почувствуешь необъяснимую тягу к красивым цветам, это космос работает.

Не спорь со звездами. Сделай красиво. Вот промокод: LUNAR`;

const IMAGE_FILENAME = "pionovyj-predskazatel.jpeg";
const SHARE_TITLE = "Пионовый предсказатель";

type ExportAction = "download" | "share";

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
      const blob = new Blob([`${name}\n\n${SHARE_TEXT}`], {
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

    const shareUrl = buildResultShareUrl(name, date);
    const shareData = {
      title: SHARE_TITLE,
      text: SHARE_TEXT,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        if (!navigator.canShare || navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      }

      await navigator.clipboard.writeText(shareUrl);
      alert("Ссылка скопирована в буфер обмена");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      alert("Не удалось поделиться результатом.");
    } finally {
      setPendingAction(null);
    }
  };

  if (!name || !date) return null;

  return (
    <Container>
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
