import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Avatar from '../Components/Avatar'; // Import the Avatar component
import './AnnouncementPage.css';
import { AuthContext } from "../Components/AuthContext";

const AnnouncementPage = () => {
    const { id } = useParams(); // Get the announcement id from the URL
    const [announcement, setAnnouncement] = useState(null);
    const [selectedImage, setSelectedImage] = useState(''); // State for the selected image
    const [showContactInfo, setShowContactInfo] = useState(false);
    const [comments, setComments] = useState([]); // State for comments
    const [newComment, setNewComment] = useState(''); // State for new comment
    const [user, setUser] = useState(null); // State for user
    const { currentUser } = useContext(AuthContext);
    const [avatars, setAvatars] = useState({}); // State for user avatars
    const [cardDetails, setCardDetails] = useState(null); // State for card details

    useEffect(() => {
        const fetchUser = async () => {
            if (!currentUser) {
                return; // If no currentUser, just return
            }

            // If no user is found, try to fetch from server using currentUser.username
            if (currentUser && currentUser.username) {
                try {
                    const userResponse = await axios.get(`https://card-trader.online/auth/user/login/${currentUser.username}`);
                    setUser(userResponse.data);
                    localStorage.setItem('currentUser', JSON.stringify(userResponse.data)); // Save user to local storage
                } catch (error) {
                    console.error('Error loading user data:', error);
                }
            }
        };

        fetchUser();
    }, [currentUser]);

    useEffect(() => {
        // Fetch announcement information
        const fetchAnnouncement = async () => {
            try {
                const response = await axios.get(`https://card-trader.online/announcements/${id}`);
                setAnnouncement(response.data);
                setSelectedImage(response.data.card_images[0]); // Set first image as selected

                // Fetch card details using the first card ID
                const cardId = response.data.cards[0]; // Берем первый ID карты из массива
                const cardResponse = await axios.get(`https://card-trader.online/cards/${cardId}`);
                setCardDetails(cardResponse.data); // Сохраняем детали карты
            } catch (error) {
                console.error('Error loading announcement or card details:', error);
            }
        };

        // Fetch comments for the announcement
        const fetchComments = async () => {
            try {
                const response = await axios.get(`https://card-trader.online/comments/announcement/${id}`);
                setComments(response.data); // Save the list of comments

                // Fetch avatars for each comment author
                const avatarPromises = response.data.map(async (comment) => {
                    if (comment.name) {
                        try {
                            const avatarResponse = await axios.get(`https://card-trader.online/auth/user/login/${comment.name}`);
                            return { name: comment.name, avatar: avatarResponse.data.avatar_url }; // Получаем аватар
                        } catch (error) {
                            console.error(`Error loading avatar for ${comment.name}:`, error);
                            return { name: comment.name, avatar: 'default-avatar-url' }; // Стандартный аватар в случае ошибки
                        }
                    }
                });

                // Получаем все аватары
                const avatarsList = await Promise.all(avatarPromises);
                const avatarMap = avatarsList.reduce((acc, item) => {
                    acc[item.name] = item.avatar; // Создаем объект для хранения аватаров
                    return acc;
                }, {});

                setAvatars(avatarMap); // Сохраняем аватары в состоянии
            } catch (error) {
                console.error('Error loading comments:', error);
            }
        };

        fetchAnnouncement();
        fetchComments();
    }, [id]);

    if (!announcement || !cardDetails) {
        return <div>Loading...</div>; // Show loading indicator until data is fetched
    }

    // Handler for submitting a comment
    const handleSubmitComment = async () => {
        if (newComment.trim() === '') {
            alert('Комментарий не может быть пустым');
            return;
        }

        try {
            const currentDate = new Date().toISOString(); // Получаем текущую дату в формате ISO
            const commentData = {
                name: currentUser.username || 'Гость', // Если пользователь не авторизован, используем "Гость"
                comment: newComment,
                creation_date: currentDate.split('T')[0],
                announcement: id, // ID объявления
            };

            // Отправляем POST запрос для создания нового комментария с токеном авторизации
            await axios.post('https://card-trader.online/comments', commentData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`, // Замените 'token' на реальное имя поля, если нужно
                },
            });

            // После успешной отправки обновляем список комментариев
            setComments([...comments, commentData]);
            setNewComment(''); // Очищаем поле для нового комментария
        } catch (error) {
            console.error('Ошибка при отправке комментария:', error);
            alert('Не удалось отправить комментарий. Пожалуйста, войдите в систему.');
        }
    };

    const handleShowContactInfo = () => {
        if (!currentUser) {
            alert('Пожалуйста, войдите в систему для доступа к контактной информации.');
            return; // Показываем сообщение, если пользователь не авторизован
        }
        setShowContactInfo(true); // Show contact info modal
    };

    const handleCloseContactInfo = () => {
        setShowContactInfo(false); // Close contact info modal
    };

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    return (
        <div className="announcement-page-container">
            <div className="image-gallery">
                <div className="image-preview">
                    <img src={selectedImage} alt="Selected card" className="selected-image" />
                </div>

                <div className="thumbnail-gallery">
                    {announcement.card_images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className={`thumbnail ${image === selectedImage ? 'active' : ''}`}
                            onClick={() => handleImageClick(image)}
                        />
                    ))}
                </div>
            </div>

            <div className="announcement-details">
                <div className="announcement-info-container">
                    <h1 className="announcement-title">{announcement.name}</h1>
                    <div className="announcement-description">
                        <p><strong>Описание:</strong> {announcement.description}</p>
                    </div>

                    <div className="announcement-tags-container">
                        <p><strong>Тэги:</strong> {announcement.tags.join(', ')}</p>
                    </div>

                    <div className="announcement-characteristics-container">
                        <p><strong>Характеристики:</strong></p>
                        <p>Состояние: {cardDetails.condition}</p> {/* Используем данные карты */}
                        <p>Редкость: {cardDetails.rarity}</p> {/* Используем данные карты */}
                    </div>
                </div>
            </div>

            {/* Right column with avatar and button */}
            <div className="announcement-sidebar">
                <Avatar login={announcement.user_login} />
                <button className="contact-button" onClick={handleShowContactInfo}>
                    Узнать контактные данные
                </button>
            </div>

            {/* Modal for contact information */}
            {showContactInfo && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Контактная информация</h3>
                        <p>{announcement.contact_info}</p>
                        <button className="close-modal-button" onClick={handleCloseContactInfo}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            <div className="comments-section">
                <h2>Комментарии</h2>

                {/* Comment input block */}
                {currentUser ? ( // Показываем только если пользователь авторизован
                    <div className="add-comment">
                        <div className="user-avatar">
                            <img src={user?.avatar_url || 'default-avatar-url'} alt="User Avatar" />
                        </div>
                        <div className="comment-input">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Оставьте комментарий..."
                            />
                            <button onClick={handleSubmitComment}>Отправить</button>
                        </div>
                    </div>
                ) : (
                    <p>Пожалуйста, войдите в систему, чтобы оставить комментарий.</p> // Сообщение для неавторизованных пользователей
                )}

                {/* List of comments */}
                <div className="comments-list">
                    {comments.map((comment, index) => (
                        <div key={index} className="comment">
                            <div className="comment-avatar">
                                <img src={avatars[comment.name] || 'default-avatar-url'} alt="Avatar" />
                            </div>
                            <div className="comment-content">
                                <div className="comment-meta">
                                    <Link to={`/user/${comment.name}`} className="comment-author link">
                                        {comment.name}
                                    </Link>
                                    <span className="comment-date">{new Date(comment.creation_date).toLocaleDateString()}</span>
                                </div>
                                <div className="comment-text">
                                    {comment.comment}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnnouncementPage;
