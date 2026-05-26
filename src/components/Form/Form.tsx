import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Button";
import { formatDateInput, validateDate } from "../../utils/validators";
import clock from "../../assets/clock.png";
import "./Form.css";

const Form = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const savedName = sessionStorage.getItem("formName");
    if (savedName) {
      setName(savedName);
    }
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    sessionStorage.setItem("formName", value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateDate(date);
    if (!validation.isValid) {
      setError(validation.error || "");
      return;
    }
    navigate("/loading");
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDateInput(e.target.value);
    setDate(formatted);
    sessionStorage.setItem("formDate", formatted);

    if (formatted.length === 10) {
      const validation = validateDate(formatted);
      setError(validation.error || "");
    } else {
      setError("");
    }
  };

  const handleDatePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    const formatted = formatDateInput(pasted);
    setDate(formatted);
    sessionStorage.setItem("formDate", formatted);

    if (formatted.length === 10) {
      const validation = validateDate(formatted);
      setError(validation.error || "");
    } else {
      setError("");
    }
  };

  const handleDateKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Home",
      "End",
    ];

    if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey) return;
    if (/^\d$/.test(e.key) || e.key === ".") return;
    e.preventDefault();
  };

  const handleBlur = () => {
    const validation = validateDate(date);
    setError(validation.error || "");
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div>
        <img src={clock} alt="clock" className="clock" />
      </div>
      <div className="form-group">
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleNameChange}
          placeholder="Его имя"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          inputMode="decimal"
          id="date"
          value={date}
          onChange={handleDateChange}
          onPaste={handleDatePaste}
          onKeyDown={handleDateKeyDown}
          onBlur={handleBlur}
          className="form-input"
          placeholder="Дата его рождения (дд.мм.гггг)"
          maxLength={10}
          autoComplete="off"
        />
        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
      <Button
        type="submit"
        color="secondary"
        disabled={error.length > 0 || date.length !== 10}
      >
        И когда же?
      </Button>
    </form>
  );
};

export default Form;
