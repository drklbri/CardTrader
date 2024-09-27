import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Preview from '../Components/Preview';
import { Link } from 'react-router-dom';
import "./DeletePage.css";

const DeletePage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [visibleAnnouncements, setVisibleAnnouncements] = useState(21);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await axios.get('https://card-trader.online/announcements');
                setAnnouncements(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке объявлений:', error);
            }
        };

        fetchAnnouncements();
    }, []);

    const deleteAnnouncement = async (id) => {
        try {
            // Send DELETE request
            await axios.delete(`https://card-trader.online/announcements/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                }
            });

            // Update announcements state by filtering out the deleted one
            setAnnouncements((prev) => prev.filter((announcement) => announcement.id !== id));

            // Optional: Show a confirmation message or notification here
        } catch (error) {
            console.error('Ошибка при удалении объявления:', error);
        }
    };

    const showMoreAnnouncements = () => {
        setVisibleAnnouncements((prev) => prev + 21);
    };

    return (
        <div>
            {/* Контейнер с объявлениями */}
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
            </div>

            {visibleAnnouncements < announcements.length && (
                <button className="show-more-button" onClick={showMoreAnnouncements}>
                    Показать больше
                </button>
            )}
        </div>
    );
};

export default DeletePage;
