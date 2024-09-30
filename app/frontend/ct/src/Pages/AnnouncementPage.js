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
    const [isEditing, setIsEditing] = useState(false); // State for editing mode
    const [editedAnnouncement, setEditedAnnouncement] = useState({}); // State for edited fields
    const [editedCardDetails, setEditedCardDetails] = useState({}); // State for edited card details
    const [editedTags, setEditedTags] = useState([]); // State for edited tags
    const [showConfirmation, setShowConfirmation] = useState(false);

    const canEdit = currentUser && currentUser.username === announcement?.user_login;

    useEffect(() => {
        const fetchUser = async () => {
            if (!currentUser) {
                return; // If no currentUser, just return
            }

            // If no user is found, try to fetch from server using currentUser.username
            if (currentUser && currentUser.username) {
                try {
                    const userResponse = await axios.get(`api/auth/user/login/${currentUser.username}`);
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
                const response = await axios.get(`api/announcements/${id}`);
                setAnnouncement(response.data);
                setSelectedImage(response.data.card_images[0]); // Set first image as selected

                // Fetch card details using the first card ID
                const cardId = response.data.cards[0]; // Берем первый ID карты из массива
                const cardResponse = await axios.get(`api/cards/${cardId}`);
                setCardDetails(cardResponse.data); // Сохраняем детали карты
            } catch (error) {
                console.error('Error loading announcement or card details:', error);
            }
        };

        // Fetch comments for the announcement
        const fetchComments = async () => {
            try {
                const response = await axios.get(`api/comments/announcement/${id}`);
                setComments(response.data); // Save the list of comments

                // Fetch avatars for each comment author
                const avatarPromises = response.data.map(async (comment) => {
                    if (comment.name) {
                        try {
                            const avatarResponse = await axios.get(`api/auth/user/login/${comment.name}`);
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
            await axios.post('api/comments', commentData, {
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

    const handleEditClick = () => {
        setEditedAnnouncement(announcement);
        setEditedCardDetails(cardDetails);
        if (editedTags.length === 0) {
            for (let i = 0; i < cardDetails.tags.length; i++) {
                console.log(cardDetails.tags[i].name)
                handleTagAdd(cardDetails.tags[i].name);
            }
        } else {
            setEditedTags([])
        }
        setIsEditing(!isEditing); // Toggle editing mode
    };

    const handleTagRemove = (index) => {
        setEditedTags(editedTags.filter((_, i) => i !== index));
    };

    const handleTagAdd = (newTag) => {
        if (newTag && newTag.trim() !== '') {
            setEditedTags([...editedTags, newTag]);
        }
    }

    const conditionMapping = {
        "Идеальная": "perfect",
        "Только открытая": "pack_fresh",
        "Немного поигранная": "minor_wear",
        "Умеренно поигранная": "visible_wear",
        "Поигранная": "severe_wear",
        "Сильно поигранная": "damaged",
        "Уничтоженная": "destroyed",
        "perfect": "perfect",
        "pack_fresh": "pack_fresh",
        "minor_wear": "minor_wear",
        "visible_wear": "visible_wear",
        "severe_wear": "severe_wear",
        "damaged": "damaged",
        "destroyed": "destroyed"
    };

    const rarityMapping = {
        "Обычная": "common",
        "Необычная": "uncommon",
        "Редкая": "rare",
        "Мифическая": "mythic",
        "Эпическая": "epic",
        "Легендарная": "legendary",
        "common": "common",
        "uncommon": "uncommon",
        "rare": "rare",
        "mythic": "mythic",
        "epic": "epic",
        "legendary": "legendary"
    };

    const handleSubmitChanges = async () => {
        try {
            // PUT request for the announcement
            await axios.put(`api/announcements/${id}/`, {
                name: editedAnnouncement.name,
                description: editedAnnouncement.description,
                contact_info: editedAnnouncement.contact_info,
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            // PUT request for each card
            for (const cardId of announcement.cards) {
                await axios.put(`api/cards/${cardId}/`, {
                    announcement: announcement.id,
                    condition: conditionMapping[editedCardDetails.condition],
                    rarity: rarityMapping[editedCardDetails.rarity],
                    tag_names: editedTags,
                },{
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                });
            }

            alert('Объявление успешно обновлено!');
            setShowConfirmation(false); // Reset confirmation state
            setIsEditing(false); // Exit editing mode
            window.location.reload();
        } catch (error) {
            console.error('Error updating announcement or card:', error);
            alert('Ошибка при обновлении объявления. Попробуйте снова.');
        }
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
                    {isEditing ? (
                        <>
                            <label>
                                Название:
                                <input
                                    type="text"
                                    value={editedAnnouncement.name}
                                    onChange={(e) => setEditedAnnouncement({
                                        ...editedAnnouncement,
                                        name: e.target.value
                                    })}
                                />
                            </label>
                            <label>
                                Описание:
                                <textarea
                                    value={editedAnnouncement.description}
                                    onChange={(e) => setEditedAnnouncement({
                                        ...editedAnnouncement,
                                        description: e.target.value
                                    })}
                                />
                            </label>
                            <label>
                                Контакты:
                                <input
                                    type="text"
                                    value={editedAnnouncement.contact_info}
                                    onChange={(e) => setEditedAnnouncement({
                                        ...editedAnnouncement,
                                        contact_info: e.target.value
                                    })}
                                />
                            </label>
                        </>
                    ) : (
                        <>
                            <h1 className="announcement-title">{announcement.name}</h1>
                            <p><strong>Описание:</strong> {announcement.description}</p>
                            {/* Скрываем блок контактов, если не в режиме редактирования */}
                        </>
                    )}


                    <div className="announcement-tags-container">
                        <p><strong>Тэги: </strong>{announcement.tags.join(', ')}</p>
                        <div className="tags-container" style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                            {editedTags.map((tag, index) => (
                                <div key={index} className="selected-tag">
                                    {tag}
                                    {isEditing && (
                                        <button className="remove-tag" onClick={() => handleTagRemove(index)}>✖</button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {isEditing && (
                            <button className="add-tag-button"
                                    onClick={() => handleTagAdd(prompt('Введите новый тег:'))}>
                                Добавить тег
                            </button>
                        )}
                    </div>


                    <div className="announcement-characteristics-container">
                        <p><strong>Характеристики:</strong></p>
                        {isEditing ? (
                            <>
                                <div className="filters-section">
                                    <label>Состояние:</label>
                                    <select
                                        value={editedCardDetails.condition}
                                        onChange={(e) => setEditedCardDetails({
                                            ...editedCardDetails,
                                            condition: e.target.value
                                        })}
                                    >
                                        <option value="perfect">Идеальная</option>
                                        <option value="pack_fresh">Только открытая</option>
                                        <option value="minor_wear">Немного поигранная</option>
                                        <option value="visible_wear">Умеренно поигранная</option>
                                        <option value="severe_wear">Поигранная</option>
                                        <option value="damaged">Сильно поигранная</option>
                                        <option value="destroyed">Уничтоженная</option>
                                    </select>

                                    <label>Редкость:</label>
                                    <select
                                        value={editedCardDetails.rarity}
                                        onChange={(e) => setEditedCardDetails({
                                            ...editedCardDetails,
                                            rarity: e.target.value
                                        })}
                                    >
                                        <option value="common">Обычная</option>
                                        <option value="uncommon">Необычная</option>
                                        <option value="rare">Редкая</option>
                                        <option value="mythic">Мифическая</option>
                                        <option value="epic">Эпическая</option>
                                        <option value="legendary">Легендарная</option>
                                    </select>
                                </div>
                            </>
                        ) : (
                            <>
                                <p>Состояние: {cardDetails.condition}</p>
                                <p>Редкость: {cardDetails.rarity}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>


            {/* Right column with avatar and button */}
            <div className="announcement-sidebar">
                <Avatar login={announcement.user_login}/>
                <button className="contact-button" onClick={handleShowContactInfo}>
                    Узнать контактные данные
                </button>
                {canEdit && (
                    <div className="edit-controls">
                        <button onClick={handleEditClick}>
                            {isEditing ? 'Отменить' : 'Редактировать объявление'}
                        </button>
                        {isEditing && (
                            <>
                                <button onClick={() => setShowConfirmation(true)}>Закончить редактирование</button>
                                {showConfirmation && (
                                    <div className="confirmation-modal">
                                        <p>Вы уверены, что хотите сохранить изменения?</p>
                                        <button onClick={handleSubmitChanges}>Да</button>
                                        <button onClick={() => setShowConfirmation(false)}>Нет</button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
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
                            <img src={user?.avatar_url || 'default-avatar-url'} alt="User Avatar"/>
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
                                <img src={avatars[comment.name] || 'default-avatar-url'} alt="Avatar"/>
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
