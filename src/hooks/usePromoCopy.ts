import { PROMO_CODE } from "../constants/promo";
import { copyText } from "../utils/copyText";
import { reachGoal, YM_GOALS } from "../utils/metrika";
import { useToast } from "./useToast";

export function usePromoCopy() {
  const { showToast, toast } = useToast();

  const copyPromocode = async () => {
    const copied = await copyText(PROMO_CODE);

    if (copied) {
      reachGoal(YM_GOALS.copyPromocode);
      showToast("Промокод скопирован");
      return;
    }

    showToast("Не удалось скопировать промокод");
  };

  return { copyPromocode, toast };
}
