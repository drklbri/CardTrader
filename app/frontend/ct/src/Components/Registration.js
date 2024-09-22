import React, {useState} from 'react';
import './Registration.css'; // Импорт CSS файла
import axios from 'axios';

function RegistrationForm() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // Состояние для ошибок
    const [successMessage, setSuccessMessage] = useState(''); // Состояние для успешных сообщений

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://card-trader.online/auth/register', {
                email: email,
                username: username,
                password: password
            }, {
                headers: {
                    'X-CSRFToken': 'CLEX6jxvuyk7lZGxDmU1oUhuUcYQ63XYdGWoEG9XW4RG56husOlFW8pxNwjhQybT',
                    'Content-Type': 'application/json'
                }
            });

            console.log('Ответ сервера:', response);

            if (response.status === 200) {
                setSuccessMessage('Регистрация прошла успешно!');
                setErrorMessage('');
            } else if (response.status === 400) {
                const errorData = response.data;
                if (errorData.email) {
                    setErrorMessage(errorData.email[0]);
                } else {
                    setErrorMessage('Ошибка при регистрации. Проверьте введённые данные.');
                }
                setSuccessMessage('');
            } else {
                setErrorMessage('Ошибка при регистрации. Попробуйте еще раз.');
                setSuccessMessage('');
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 500) {
                    // Проверка на ошибку, если данные уже существуют
                    setErrorMessage('Такой аккаунт уже существует. Попробуйте использовать другой email или имя пользователя.');
                } else {
                    // Другие ошибки от сервера
                    setErrorMessage('Ошибка при регистрации. Попробуйте еще раз.');
                }
            } else {
                // Ошибка сети
                setErrorMessage('Ошибка сети. Попробуйте еще раз позже.');
            }
            setSuccessMessage('');
        }
    };

    return (
        <div className="container">
            <div className="formReg">
                <h2 className="title">Регистрация</h2>

                {/* Сообщение об ошибке */}
                {errorMessage && <p className="error-message">{errorMessage}</p>}

                {/* Сообщение об успехе */}
                {successMessage && <p className="success-message">{successMessage}</p>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Почта..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Логин..."
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Пароль..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input"
                        required
                    />
                    <button type="submit" className="button">Подтвердить</button>
                </form>
            </div>
        </div>
    );
}

export default RegistrationForm;