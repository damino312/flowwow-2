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
  buildResultSearchParams,
  buildResultShareUrl,
  hasResultParams,
  readResultParams,
  RESULT_PARAM,
} from "../../utils/resultParams";
import { validateDate } from "../../utils/validators";
import { RESULT_SHARE_TITLE } from "../../constants/share";
import { PROMO_CODE } from "../../constants/promo";
import { usePromoCopy } from "../../hooks/usePromoCopy";
import gift3 from "../../assets/gift-3.svg";
import "./Result.css";

const SHARE_TEXT = `А ты знаешь, что вот-вот подаришь мне пионы? Это не я придумала — это астрология, наука и вообще судьба. Так что, если ты вдруг в ближайшие дни почувствуешь необъяснимую тягу к красивым цветам, это космос работает.

Не спорь со звездами. Сделай красиво. Вот промокод: ${PROMO_CODE}`;

const IMAGE_FILENAME = "pionovyj-predskazatel.jpeg";
const SHARE_TITLE = RESULT_SHARE_TITLE;

type ExportAction = "download" | "share";

const Result = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [pendingAction, setPendingAction] = useState<ExportAction | null>(null);
  const isExporting = pendingAction !== null;
  const { copyPromocode, toast } = usePromoCopy();

  useEffect(() => {
    if (hasResultParams(searchParams)) {
      const fromUrl = readResultParams(searchParams);

      if (fromUrl) {
        setName(fromUrl.name);
        setDate(fromUrl.date);
        sessionStorage.setItem("formName", fromUrl.name);
        sessionStorage.setItem("formDate", fromUrl.date);

        if (!searchParams.has(RESULT_PARAM)) {
          setSearchParams(buildResultSearchParams(fromUrl.name, fromUrl.date), {
            replace: true,
          });
        }

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
      setSearchParams(buildResultSearchParams(storedName, storedDate), {
        replace: true,
      });
      return;
    }

    navigate("/", { replace: true });
  }, [navigate, searchParams, setSearchParams]);

  useEffect(() => {
    if (!name || !date) return;

    document.title = SHARE_TITLE;

    return () => {
      document.title = "Пионовый предсказатель";
    };
  }, [name, date]);

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

    try {
      if (navigator.share) {
        await navigator.share({ url: shareUrl });
        return;
      }
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
      {toast}
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
          <button
            type="button"
            className="gift gift--copy"
            onClick={copyPromocode}
            aria-label="Скопировать промокод"
          >
            <img src={gift3} alt="" />
            <p>{PROMO_CODE}</p>
          </button>
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
