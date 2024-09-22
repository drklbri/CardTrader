import React, {useState, useContext, useEffect} from 'react';
import './Navibar.css';
import { useNavigate } from "react-router-dom";
import { AuthContext } from './AuthContext';
import axios from "axios";


const Navibar = () => {
    const [avatarUrl, setAvatarUrl] = useState(''); // Состояние для хранения URL аватара
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useContext(AuthContext); // Доступ к авторизации и функции logout

    const fetchAvatar = async () => {
        try {
            const response = await axios.get('https://card-trader.online/profile/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}` // Авторизация через токен
                }
            });
            setAvatarUrl(response.data.link); // Сохраняем URL аватара из ответа
        } catch (error) {
            console.error("Ошибка при получении аватара:", error);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchAvatar(); // Запрос аватара только если пользователь авторизован
        }
    }, [isAuthenticated]);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        if (menuOpen) {
            setMenuOpen(false);
        }
    };

    const handleNavigation = (path) => {
        navigate(path);
        closeMenu();
    };

    const handleLogout = () => {
        logout(); // Вызываем функцию logout из контекста
        handleNavigation('/auth'); // Перенаправляем на страницу авторизации
    };

    return (
        <div className="navigation-container">
            <input type="text" className="search-input" placeholder="Поиск..." />
            {isAuthenticated && avatarUrl && ( // Отображаем аватар только если пользователь авторизован и аватар получен
                <img
                    src={avatarUrl}
                    className="avatar"
                 />
            )}
            <div className="menu-toggle" onClick={toggleMenu}>
                Меню
            </div>
            {menuOpen && (
                <div className="menu" onMouseLeave={closeMenu}>
                    <button className="menu-item" onClick={() => handleNavigation('/main')}>Главная</button>
                    {isAuthenticated ? (
                        <>
                            <button className="menu-item" onClick={() => handleNavigation('/cabinet')}>Личный кабинет</button>
                            <button className="menu-item" onClick={handleLogout}>Выйти</button>
                        </>
                    ) : (
                        <>
                            <button className="menu-item" onClick={() => handleNavigation('/auth')}>Авторизация</button>
                            <button className="menu-item" onClick={() => handleNavigation('/register')}>Регистрация</button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Navibar;