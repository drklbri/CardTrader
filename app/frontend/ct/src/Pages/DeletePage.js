import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import Preview from '../Components/Preview';
import { Link } from 'react-router-dom';
import "./DeletePage.css";
import {AuthContext} from "../Components/AuthContext";

const DeletePage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [visibleAnnouncements, setVisibleAnnouncements] = useState(21);
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [isLoadingUser, setIsLoadingUser] = useState(true); // Для отслеживания загрузки currentUser

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await axios.get('https://card-trader.online/announcements');
                setAnnouncements(response.data);
                setLoading(false); // Скрываем индикатор загрузки после получения данных
            } catch (error) {
                console.error('Ошибка при загрузке объявлений:', error);
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    useEffect(() => {
        if (currentUser !== null) {
            setIsLoadingUser(false); // Скрываем индикатор загрузки после получения пользователя
        }
    }, [currentUser]);

    const deleteAnnouncement = async (id) => {
        try {
            // Отправляем DELETE запрос
            await axios.delete(`https://card-trader.online/announcements/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                }
            });

            // Обновляем состояние объявлений, исключая удаленное
            setAnnouncements((prev) => prev.filter((announcement) => announcement.id !== id));

            // Можно добавить уведомление или сообщение о успешном удалении
        } catch (error) {
            console.error('Ошибка при удалении объявления:', error);
        }
    };

    const showMoreAnnouncements = () => {
        setVisibleAnnouncements((prev) => prev + 21);
    };

    // Если пользователь все еще загружается, показываем индикатор загрузки
    if (isLoadingUser) {
        return (
            <div className="loading-screen">
                Загрузка...
            </div>
        );
    }

    // Если объявления загружаются
    if (loading) {
        return (
            <div className="loading-screen">
                Загрузка объявлений...
            </div>
        );
    }

    return (
        <div>
            {currentUser.role === "admin" ? (
                <div className="announcements-grid">
                    {announcements.slice(0, visibleAnnouncements).map((announcement) => (
                        <div key={announcement.id} className="announcement-item">
                            <Preview
                                name={
                                    <Link to={`/announcement/${announcement.id}`} className="link">
                                        {announcement.name}
                                    </Link>
                                }
                                user={
                                    <Link to={`/user/${announcement.user_login}`} className="link">
                                        {announcement.user_login}
                                    </Link>
                                }
                                images={announcement.card_images || ['https://via.placeholder.com/150']}
                                tags={announcement.tags || ['No tags']}
                            />
                            <button className="delete-button" onClick={() => deleteAnnouncement(announcement.id)}>
                                Удалить
                            </button>
                        </div>
                    ))}

                    {visibleAnnouncements < announcements.length && (
                        <button className="show-more-button" onClick={showMoreAnnouncements}>
                            Показать больше
                        </button>
                    )}
                </div>
            ) : (
                <div className="no-access-message">fok u</div>
            )}
        </div>
    );
};

export default DeletePage;
