import React, { useState, useEffect } from 'react';
import Filters from '../Components/Filters';
import axios from 'axios';
import Preview from '../Components/Preview';
import './MainPage.css';
import { Link } from 'react-router-dom';

const MainPage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const announcementsPerPage = 18; // Number of announcements per page
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({});
    const [hasMoreAnnouncements, setHasMoreAnnouncements] = useState(true); // To track if more announcements are available
    const [isLoading, setIsLoading] = useState(true); // State to track loading status

    // Function to load announcements from the server
    const fetchPaginatedAnnouncements = async (page, appliedFilters = {}) => {
        try {
            const { condition, rarity, tags } = appliedFilters;

            // Формируем параметры запроса, добавляем только те, которые заданы
            const params = {
                page,
                condition: condition || undefined,
                rarity: rarity || undefined,
                tags: tags && tags.length > 0 ? tags.join(',') : undefined
            };

            const response = await axios.get('https://card-trader.online/api/announcements/paginated', { params });
            return response.data.results;
        } catch (error) {
            console.error('Error loading announcements:', error);
            return [];
        }
    };

    // Initial load of the first page
    useEffect(() => {
        const loadInitialAnnouncements = async () => {
            setIsLoading(true); // Start loading
            const initialAnnouncements = await fetchPaginatedAnnouncements(1);
            setAnnouncements(initialAnnouncements);
            setFilteredAnnouncements(initialAnnouncements); // Display all initially
            setCurrentPage(1); // Set current page to 1
            setIsLoading(false); // Stop loading
        };

        loadInitialAnnouncements();
    }, []);

    const showMoreAnnouncements = async () => {
        const nextPage = currentPage + 1;
        setIsLoading(true); // Start loading for more announcements
        const moreAnnouncements = await fetchPaginatedAnnouncements(nextPage, filters);

        // If new announcements were fetched, update filtered announcements
        if (moreAnnouncements.length > 0) {
            setFilteredAnnouncements(moreAnnouncements); // Update to show only new announcements
            setAnnouncements(moreAnnouncements); // Keep track of all announcements
            setCurrentPage(nextPage); // Increment current page
        } else {
            setHasMoreAnnouncements(false); // Disable button if no more data
        }
        setIsLoading(false); // Stop loading
    };

    const showPreviousAnnouncements = async () => {
        const previousPage = currentPage - 1;
        if (previousPage < 1) return; // Don't allow going below page 1

        setIsLoading(true); // Start loading for previous announcements
        const previousAnnouncements = await fetchPaginatedAnnouncements(previousPage, filters);
        if (previousAnnouncements.length > 0) {
            setAnnouncements(previousAnnouncements); // Replace current announcements
            setFilteredAnnouncements(previousAnnouncements); // Similarly filter
            setCurrentPage(previousPage); // Update current page
            setHasMoreAnnouncements(true); // Re-enable the possibility to show more
        }
        setIsLoading(false); // Stop loading
    };

    const handleFilterToggle = (isOpen) => {
        setIsFilterOpen(isOpen);
    };

    const applyFilters = async (filterData) => {
        setFilters(filterData);
        const filtered = await fetchPaginatedAnnouncements(1, filterData);
        setFilteredAnnouncements(filtered);
        setCurrentPage(1); // Reset to first page on filter change
    };

    /*const filterAnnouncements = async (filterData) => {
        const { tags, condition, rarity } = filterData;
        let filtered = announcements;

        if (tags && tags.length > 0) {
            filtered = filtered.filter(announcement =>
                tags.every(tag => announcement.tags.includes(tag))
            );
        }

        if (condition || rarity) {
            const filteredWithCards = [];
            const fetchPromises = filtered.map(async (announcement) => {
                if (announcement.cards.length === 0) return null;
                const cardId = announcement.cards[0]; // Take the first card
                const cardResponse = await axios.get(`https://card-trader.online/api/cards/${cardId}`);
                const card = cardResponse.data;
                const isConditionMatch = !condition || card.condition === condition;
                const isRarityMatch = !rarity || card.rarity === rarity;

                return isConditionMatch && isRarityMatch ? announcement : null;
            });

            // Wait for all fetches to complete
            const results = await Promise.all(fetchPromises);
            filtered = results.filter(announcement => announcement !== null);
        }

        return filtered;
    };*/

    return (
        <div>
            <Filters applyFilters={applyFilters} onToggle={handleFilterToggle} />

            {currentPage > 1 && (
                <button className="show-previous-button" onClick={showPreviousAnnouncements}>
                    Вернуться
                </button>
            )}

            {/* Container for announcements */}
            <div className={`announcements-grid ${isFilterOpen ? 'filter-open' : ''} ${currentPage > 1 ? 'with-back-button' : ''}`}>
                {filteredAnnouncements.map((announcement) => (
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

            {!isLoading && hasMoreAnnouncements && (
                <button className="show-more-button" onClick={showMoreAnnouncements}>
                    Показать больше
                </button>
            )}
        </div>
    );
};

export default MainPage;
