import React, { useState } from 'react';
import './Registration.css'; // Импорт CSS файла
import axios from 'axios';

function RegistrationForm() {
    const [email, setEmail] = useState(''); // Email для регистрации и подтверждения
    const [username, setUsername] = useState(''); // Логин для регистрации
    const [password, setPassword] = useState(''); // Пароль для регистрации
    const [errorMessage, setErrorMessage] = useState(''); // Сообщения об ошибке
    const [successMessage, setSuccessMessage] = useState(''); // Сообщения об успешной регистрации
    const [emailSent, setEmailSent] = useState(false); // Флаг для отображения сообщения о подтверждении

    // Обработчик отправки формы регистрации
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Запрос на регистрацию пользователя
            const response = await axios.post('api/auth/register', {
                email: email,
                username: username,
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Ответ сервера:', response);

            if (response.status === 200) {
                // Регистрация прошла успешно
                setSuccessMessage('Регистрация прошла успешно!');
                setErrorMessage('');

                // Отправляем запрос на отправку email с подтверждением
                await sendConfirmationEmail();

                // Через несколько секунд заменяем форму на сообщение о подтверждении
                setTimeout(() => {
                    setEmailSent(true);
                }, 2000);
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
                    // Ошибка, если данные уже существуют
                    setErrorMessage('Такой аккаунт уже существует. Попробуйте использовать другой email или имя пользователя.');
                } else {
                    setErrorMessage('Ошибка при регистрации. Попробуйте еще раз.');
                }
            } else {
                setErrorMessage('Ошибка сети. Попробуйте еще раз позже.');
            }
            setSuccessMessage('');
        }
    };

    // Функция отправки email для подтверждения
    const sendConfirmationEmail = async () => {
        try {
            const emailResponse = await axios.post('api/auth/email/send', {
                email: email // Используем email, введенный пользователем
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (emailResponse.status === 200) {
                console.log('Email с подтверждением отправлен.');
            } else {
                console.error('Ошибка при отправке подтверждающего email:', emailResponse);
            }
        } catch (error) {
            console.error('Ошибка при отправке email для подтверждения:', error);
        }
    };

    return (
        <div className="container">
            {/* Если email отправлен, показываем сообщение о необходимости подтверждения */}
            {emailSent ? (
                <div className="email-sent-container">
                    <h2 className="title">Подтверждение регистрации</h2>
                    <p className="success-message">
                        На вашу почту {email} было отправлено письмо. Пожалуйста, перейдите по ссылке в письме, чтобы подтвердить свой аккаунт.
                    </p>
                </div>
            ) : (
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
            )}
        </div>
    );
}

export default RegistrationForm;
