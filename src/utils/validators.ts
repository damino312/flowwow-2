export function formatDateInput(raw: string): string {
  const cleaned = raw.replace(/[^\d.]/g, "");

  if (!cleaned.includes(".")) {
    const digits = cleaned.slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
  }

  const chars = cleaned;

  let day = "";
  let month = "";
  let year = "";
  let part: "day" | "month" | "year" = "day";
  let dotAfterDay = false;
  let dotAfterMonth = false;

  for (const char of chars) {
    if (char === ".") {
      if (part === "day" && day.length > 0) {
        part = "month";
        dotAfterDay = true;
      } else if (part === "month" && month.length > 0) {
        part = "year";
        dotAfterMonth = true;
      }
      continue;
    }

    if (part === "day") {
      dotAfterDay = false;
      if (day.length < 2) {
        day += char;
      } else if (month.length < 2) {
        part = "month";
        month += char;
      } else if (year.length < 4) {
        part = "year";
        year += char;
      }
    } else if (part === "month") {
      dotAfterDay = false;
      if (month.length < 2) {
        month += char;
      } else if (year.length < 4) {
        part = "year";
        year += char;
      }
    } else if (year.length < 4) {
      dotAfterMonth = false;
      year += char;
    }
  }

  let result = day;
  if (dotAfterDay || month.length > 0 || dotAfterMonth || year.length > 0) {
    result += `.${month}`;
  }
  if (dotAfterMonth || year.length > 0) {
    result += `.${year}`;
  }
  return result;
}

export function validateDate(dateString: string) {
    // Проверяем формат DD.MM.YYYY
    const regex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/;
    
    if (!regex.test(dateString)) {
      return { isValid: false, error: "Неверный формат даты. Используйте DD.MM.YYYY" };
    }
  
    // Разбиваем дату на части
    const [day, month, year] = dateString.split('.').map(Number);
  
    // Проверяем валидность даты (например, 30.02.2023 - невалидно)
    const date = new Date(year, month - 1, day);
    const isValidDate = (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  
    if (!isValidDate) {
      return { isValid: false, error: "Такой даты не существует" };
    }
  
    return { isValid: true, error: null };
  }