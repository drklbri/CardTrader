import React, { useState, useEffect, useContext } from 'react';
import Avatar from '../Components/Avatar';
import Preview from '../Components/Preview';
import ProfileActions from '../Components/ProfileAction'; // Импортируем ProfileActions
import axios from 'axios';
import './Cabinet.css';
import { Link, useParams } from "react-router-dom";
import { AuthContext } from '../Components/AuthContext'; // Импортируем AuthContext
import "./UserProfile.css";
import CommentsContainer from "../Components/CommentsContainer";

const UserProfile = () => {
    const { isAuthenticated, currentUser } = useContext(AuthContext); // Получаем состояние аутентификации
    const [imageUrl, setImageUrl] = useState('');
    const [userData, setUserData] = useState(null);
    const [announcements, setAnnouncements] = useState([]);
    const [visibleAnnouncements, setVisibleAnnouncements] = useState([]);
    const [visibleCount, setVisibleCount] = useState(8);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);

    const { login } = useParams();

    useEffect(() => {
        setUserData(null);
        setImageUrl('');
        setAnnouncements([]);
        setVisibleAnnouncements([]);
        setComments([]);
        setError(null);
    }, [login]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Получаем данные пользователя
                const response = await axios.get(`/auth/user/login/${login}/`);
                console.log("User data response:", response.data); // Логирование ответа

                if (response.data) {
                    setUserData(response.data);
                    setImageUrl(response.data.avatar || '');

                    // Получаем объявления пользователя
                    const announcementsResponse = await axios.get(`https://card-trader.online/announcements/user/${login}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                        },
                    });
                    console.log("Announcements response:", announcementsResponse.data); // Логирование ответа
                    setAnnouncements(announcementsResponse.data);
                    setVisibleAnnouncements(announcementsResponse.data.slice(0, visibleCount));

                    const commentsResponse = await axios.get(`/comments/user/${login}/announcements/`);
                    setComments(commentsResponse.data.slice(0, 3));
                } else {
                    setError('Пользователь не найден.');
                }
            } catch (err) {
                console.error('Ошибка при загрузке данных пользователя:', err); // Логируем ошибку
                if (err.response && err.response.status === 404) {
                    setError('Пользователь не найден.');
                } else {
                    setError('Произошла ошибка при загрузке данных.');
                }
            }
        };

        fetchUserData();
    }, [login]);

    const handleShowMore = () => {
        const nextCount = visibleCount + 8;
        setVisibleCount(nextCount > announcements.length ? announcements.length : nextCount);
        setVisibleAnnouncements(announcements.slice(0, nextCount));
    };

    if (error) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <h1>{error}</h1>
            </div>
        );
    }

    // Отображение сообщения, если данные пользователя еще не загружены
    if (!userData) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }} className="loading-container">
                <h1>Данные пользователя загружаются...</h1>
            </div>
        );
    }


    return (
        <div className="cabinet-container">
            <div className="left-column">
                <Avatar
                    login={login}
                    imageUrl={imageUrl}
                    averageRating={userData.averageRating || 0}
                    reviewCount={userData.reviewCount || 0}
                />
                {isAuthenticated && currentUser.username === login && <ProfileActions />}
                <CommentsContainer comments={comments} />
            </div>

            <div className="right-column">
                <div className="announcements-container">
                    {visibleAnnouncements.map((announcement) => (
                        <Preview
                            key={announcement.id}
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
