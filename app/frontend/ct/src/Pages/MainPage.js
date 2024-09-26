import React, { useState, useEffect } from 'react';
import Filters from '../Components/Filters';
import axios from 'axios';
import Preview from '../Components/Preview';
import "./MainPage.css";
import { Link } from 'react-router-dom';

const MainPage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [visibleAnnouncements, setVisibleAnnouncements] = useState(21);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

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

    const showMoreAnnouncements = () => {
        setVisibleAnnouncements((prev) => prev + 21);
    };

    const handleFilterToggle = (isOpen) => {
        setIsFilterOpen(isOpen);
    };

    return (
        <div>
            <Filters applyFilters={() => {}} onToggle={handleFilterToggle} />

            {/* Контейнер с объявлениями */}
            <div className={`announcements-grid ${isFilterOpen ? 'filter-open' : ''}`}>
                {announcements.slice(0, visibleAnnouncements).map((announcement) => (
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

            {visibleAnnouncements < announcements.length && (
                <button className="show-more-button" onClick={showMoreAnnouncements}>
                    Показать больше
                </button>
            )}
        </div>
    );
};

export default MainPage;
