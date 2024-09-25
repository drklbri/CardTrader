import React, { useState, useEffect, useContext } from 'react';
import Avatar from '../Components/Avatar';
import Preview from '../Components/Preview';
import ProfileActions from '../Components/ProfileAction'; // Импортируем ProfileActions
import axios from 'axios';
import './Cabinet.css';
import {Link, useParams} from "react-router-dom";
import { AuthContext } from '../Components/AuthContext';// Импортируем AuthContext
import "./UserProfile.css"


const UserProfile = () => {
    const { isAuthenticated, currentUser } = useContext(AuthContext); // Получаем состояние аутентификации
    const [imageUrl, setImageUrl] = useState('');
    const [userData, setUserData] = useState(null);
    const [announcements, setAnnouncements] = useState([]);
    const [visibleAnnouncements, setVisibleAnnouncements] = useState([]);
    const [visibleCount, setVisibleCount] = useState(8);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { login } = useParams();

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/auth/user/login/${login}/`);
                if (response.data) {
                    setUserData(response.data);
                    setImageUrl(response.data.avatar || '');

                    const announcementsResponse = await axios.get(`https://card-trader.online/announcements/user/${login}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                        },
                    });
                    setAnnouncements(announcementsResponse.data);
                    setVisibleAnnouncements(announcementsResponse.data.slice(0, visibleCount));
                } else if (response.data.detail === "No User matches the given query.") {
                    setError('Пользователь не найден.');
                }
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setError('Пользователь не найден.');
                } else {
                    console.error('Ошибка при загрузке данных пользователя:', err);
                    setError('Произошла ошибка при загрузке данных.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [login, visibleCount]);

    const handleShowMore = () => {
        const nextCount = visibleCount + 8;
        setVisibleCount(nextCount > announcements.length ? announcements.length : nextCount);
        setVisibleAnnouncements(announcements.slice(0, nextCount));
    };

    if (loading) {
        return (
            <div className="loading-container">
                <h2>Загрузка...</h2> {/* Отображение сообщения загрузки */}
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <h1>{error}</h1>
            </div>
        );
    }

    return (
        <div className="cabinet-container">
            <div className="left-column">
                <Avatar login={login}
                    imageUrl={imageUrl}
                    averageRating={userData.averageRating || 0}
                    reviewCount={userData.reviewCount || 0}
                />
                {/* Если пользователь аутентифицирован, отображаем ProfileActions */}

                {isAuthenticated && currentUser.username === login && <ProfileActions />}
            </div>

            <div className="right-column">
                <div className="announcements-container">
                    {visibleAnnouncements.map((announcement) => (
                        <Preview
                            key={announcement.id}
                            name={announcement.name}
                            user={
                                <Link to={`/user/${announcement.user_login}`} className="link">
                                    {announcement.user_login}
                                </Link>
                            }
                            images={announcement.card_images || ['https://via.placeholder.com/150']}
                            tags={announcement.tags || ['No tags']}
                        />
                    ))}
                </div>

                {visibleAnnouncements.length < announcements.length && (
                    <button className="show-more-button" onClick={handleShowMore}>
                        Показать больше
                    </button>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
