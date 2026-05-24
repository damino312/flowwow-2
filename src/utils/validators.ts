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