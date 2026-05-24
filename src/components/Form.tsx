import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { validateDate } from '../utils/validators';

const Form = () => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');


  const navigate = useNavigate();

  // При монтировании проверяем sessionStorage
  useEffect(() => {
    const savedName = sessionStorage.getItem('formName');
    if (savedName) {
      setName(savedName);
    }
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    // Сохраняем в sessionStorage
    sessionStorage.setItem('formName', value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/loading`);
  };


  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDate(value);
    sessionStorage.setItem('formDate', value);
  };

  const handleBlur = () => {
    const validation = validateDate(date);
    setError(validation.error || '');
  };



  return (
    <form className="form" onSubmit={handleSubmit}>
      <div>
        <img src="src/assets/clock.png" alt="clock" className="clock" />
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
          id="date"
          value={date}
          onChange={handleDateChange}
          onBlur={handleBlur}
          className="form-input"
          placeholder='Дата его рождения (дд.мм.гг)'
          maxLength={10}
        />
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>
      <Button type="submit" color='secondary' disabled={error.length > 0 || !date}>Ну, и когда?</Button>
    </form>
  );
};

export default Form;