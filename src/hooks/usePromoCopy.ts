import { PROMO_CODE } from "../constants/promo";
import { copyText } from "../utils/copyText";
import { useToast } from "./useToast";

export function usePromoCopy() {
  const { showToast, toast } = useToast();

  const copyPromocode = async () => {
    const copied = await copyText(PROMO_CODE);

    if (copied) {
      showToast("Промокод скопирован");
      return;
    }

    showToast("Не удалось скопировать промокод");
  };

  return { copyPromocode, toast };
}
