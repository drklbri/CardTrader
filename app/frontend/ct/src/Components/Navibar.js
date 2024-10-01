import React, {useState, useContext, useEffect} from 'react';
import './Navibar.css';
import { useNavigate } from "react-router-dom";
import { AuthContext } from './AuthContext';
import axios from "axios";

const Navibar = () => {
    const [avatarUrl, setAvatarUrl] = useState(''); // Состояние для хранения URL аватара
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const { isAuthenticated, logout, currentUser } = useContext(AuthContext); // Доступ к авторизации и функции logout

    const fetchAvatar = async () => {
        try {
            const response = await axios.get('https://card-trader.online/api/profile/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Авторизация через токен
                },
            });
            // Устанавливаем URL аватара, если он существует
            if (response.data && response.data.link) {
                setAvatarUrl(response.data.link);
            } else {
                setAvatarUrl(''); // Устанавливаем пустую строку, если аватар отсутствует
            }
        } catch (error) {
            console.error("Ошибка при получении аватара:", error);
            setAvatarUrl(''); // Устанавливаем пустую строку при ошибке
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchAvatar();

            const intervalId = setInterval(() => {
                fetchAvatar();
            }, 2000);

            return () => clearInterval(intervalId);
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
        handleNavigation('/'); // Перенаправляем на страницу авторизации
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            if (searchQuery.trim()) {
                navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                setSearchQuery("");
            }
        }
    };

    return (
        <div className="navigation-container">
            <input
                type="text"
                className="search-input"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
            />

            <div className="button-container">
                {isAuthenticated && (
                    <button className="create-announcement-button"
                            onClick={() => handleNavigation('/createAnnouncement')}>
                        Создать объявление
                    </button>
                )}

                {isAuthenticated && avatarUrl && (
                    <img
                        src={avatarUrl || 'https://via.placeholder.com/120'}
                        className="avatar"
                        alt="User Avatar"
                    />
                )}

                <div className="menu-toggle" onClick={toggleMenu}>
                    Меню
                </div>
            </div>

            {menuOpen && (
                <div className="menu" onMouseLeave={closeMenu}>
                    <button className="menu-item" onClick={() => handleNavigation('/')}>Главная</button>
                    {isAuthenticated ? (
                        <>
                            <button className="menu-item"
                                    onClick={() => handleNavigation(`/user/${currentUser.username}`)}>Личный кабинет
                            </button>
                            <button className="menu-item" onClick={handleLogout}>Выйти</button>
                        </>
                    ) : (
                        <>
                            <button className="menu-item"
                                    onClick={() => handleNavigation('/authorization')}>Авторизация
                            </button>
                            <button className="menu-item"
                                    onClick={() => handleNavigation('/registration')}>Регистрация
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Navibar;
