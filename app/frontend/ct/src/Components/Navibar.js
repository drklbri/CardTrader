import React, { useState } from 'react';
import './Navibar.css'; // Подключаем стили для темного дизайна

const Navigation = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        // Закрываем меню, только если оно открыто
        if (menuOpen) {
            setMenuOpen(false);
        }
    };

    return (
        <div className="navigation-container">
            <input type="text" className="search-input" placeholder="Поиск..." />
            <div className="menu-toggle" onClick={toggleMenu}>
                Меню
            </div>
            {menuOpen && (
                <div className="menu" onMouseLeave={closeMenu}>
                    <button className="menu-item">Главная</button>
                    <button className="menu-item">Личный кабинет</button>
                    <button className="menu-item">Выйти</button>
                </div>
            )}
        </div>
    );
};

export default Navigation;