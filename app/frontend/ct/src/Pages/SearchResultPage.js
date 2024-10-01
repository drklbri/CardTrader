import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Preview from '../Components/Preview';
import "./SearchResultPage.css";
import { Link } from 'react-router-dom';

const SearchResultsPage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
    const [visibleAnnouncements, setVisibleAnnouncements] = useState(18);
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('q') || ''; // Извлекаем поисковый запрос из URL

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await axios.get('https://card-trader.online/api/announcements');
                setAnnouncements(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке объявлений:', error);
            }
        };

        fetchAnnouncements();
    }, []);

    useEffect(() => {
        const filtered = announcements.filter((announcement) =>
            announcement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            announcement.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (announcement.tags && announcement.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
        );
        setFilteredAnnouncements(filtered);
    }, [searchQuery, announcements]);

    const showMoreAnnouncements = () => {
        setVisibleAnnouncements((prev) => prev + 21);
    };

    return (
        <div>
            <h1 className="search-result-query-title">
                Результаты поиска для: "{searchQuery}"
            </h1>

            <div className="announcements-grid">
                {filteredAnnouncements.slice(0, visibleAnnouncements).map((announcement) => (
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

            {visibleAnnouncements < filteredAnnouncements.length && (
                <button className="show-more-button" onClick={showMoreAnnouncements}>
                    Показать больше
                </button>
            )}
        </div>
    );
};

export default SearchResultsPage;
