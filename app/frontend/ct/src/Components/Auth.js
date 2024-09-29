import React, {useContext, useState} from 'react';
import './Registration.css'; // Импорт CSS файла
import axios from 'axios'; // Импорт axios для отправки запросов
import { AuthContext } from './AuthContext';
import {useNavigate} from "react-router-dom";

function AuthForm() {
    const [email, setEmail] = useState(''); // Состояние для email
    const [password, setPassword] = useState(''); // Состояние для пароля
    const [errorMessage, setErrorMessage] = useState(''); // Состояние для ошибок
    const [successMessage, setSuccessMessage] = useState(''); // Состояние для успешных сообщений
    const { login } = useContext(AuthContext); // Получаем функцию login из контекста
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://card-trader.online/auth/login', {
                email,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Ответ сервера:', response);

            if (response.status === 200) {
                const { access_token, refresh_token } = response.data;

                // Сохраняем токены и обновляем состояние авторизации
                login(access_token, refresh_token);

                setSuccessMessage('Авторизация прошла успешно!');
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setErrorMessage('Ошибка при авторизации. Попробуйте еще раз.');
                setSuccessMessage('');
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    setErrorMessage('Неверные учетные данные. Проверьте email и пароль.');
                } else if (error.response.status === 500) {
                    setErrorMessage('Ошибка сервера. Попробуйте позже.');
                } else {
                    setErrorMessage('Ошибка при авторизации. Попробуйте еще раз.');
                }
            } else {
                setErrorMessage('Ошибка сети. Попробуйте еще раз позже.');
            }
            setSuccessMessage('');
        }
    };

    return (
        <div className="container">
            <div className="formAuth">
                <h2 className="title">Авторизация</h2>

                {errorMessage && <p className="error-message">{errorMessage}</p>}
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

export default AuthForm;
