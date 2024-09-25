import React, { useState } from 'react';
import './Navibar.css'; // Подключаем стили для темного дизайна
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        // Закрываем меню, только если оно открыто
        if (menuOpen) {
            setMenuOpen(false);
        }
    };

    const handleNavigation = (path) => {
        navigate(path);
        closeMenu();
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
                    <button className="menu-item" onClick={() => handleNavigation('/register')}>Регистрация</button>
                    <button className="menu-item" onClick={() => handleNavigation('/auth')}>Войти</button>
                </div>
            )}
        </div>
    );
}

export default Navigation
