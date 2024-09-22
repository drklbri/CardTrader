import React, { useState, useContext } from 'react';
import './Navibar.css';
import { useNavigate } from "react-router-dom";
import { AuthContext } from './AuthContext';


const Navibar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useContext(AuthContext); // Доступ к авторизации и функции logout

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
            <div className="menu-toggle" onClick={toggleMenu}>
                Меню
            </div>
            {menuOpen && (
                <div className="menu" onMouseLeave={closeMenu}>
                    <button className="menu-item" onClick={() => handleNavigation('/main')}>Главная</button>
                    {isAuthenticated ? (
                        <>
                            <button className="menu-item" onClick={() => handleNavigation('/cabinet')}>Личный кабинет</button>
                            <button className="menu-item" onClick={handleLogout}>Выйти</button> {/* Добавлена кнопка выхода */}
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
