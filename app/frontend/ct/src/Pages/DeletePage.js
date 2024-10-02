import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Preview from '../Components/Preview';
import { Link } from 'react-router-dom';
import "./DeletePage.css";
import { AuthContext } from "../Components/AuthContext";
import Filters from '../Components/Filters'; // Import Filters from MainPage

const DeletePage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const announcementsPerPage = 18; // Number of announcements per page
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({});
    const [hasMoreAnnouncements, setHasMoreAnnouncements] = useState(true); // To track if more announcements are available
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [isLoadingUser, setIsLoadingUser] = useState(true); // To track loading of currentUser

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await axios.get('https://card-trader.online/api/announcements/paginated');
                setAnnouncements(response.data.results);
                setFilteredAnnouncements(response.data.results); // Display all initially
                setCurrentPage(1); // Set current page to 1
                setLoading(false); // Stop loading
            } catch (error) {
                console.error('Error loading announcements:', error);
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    useEffect(() => {
        if (currentUser !== null) {
            setIsLoadingUser(false); // Hide loading indicator after getting user
        }
    }, [currentUser]);

    const deleteAnnouncement = async (id) => {
        try {
            await axios.delete(`https://card-trader.online/api/announcements/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                }
            });
            setAnnouncements((prev) => prev.filter((announcement) => announcement.id !== id));
            setFilteredAnnouncements((prev) => prev.filter((announcement) => announcement.id !== id)); // Update filtered announcements
        } catch (error) {
            console.error('Error deleting announcement:', error);
        }
    };

    const showMoreAnnouncements = async () => {
        const nextPage = currentPage + 1;
        try {
            const response = await axios.get('https://card-trader.online/api/announcements/paginated', {
                params: {
                    page: nextPage,
                    ...filters
                }
            });
            const moreAnnouncements = response.data.results;

            if (moreAnnouncements.length > 0) {
                setFilteredAnnouncements((prev) => [...prev, ...moreAnnouncements]);
                setAnnouncements((prev) => [...prev, ...moreAnnouncements]); // Keep track of all announcements
                setCurrentPage(nextPage); // Increment current page
            } else {
                setHasMoreAnnouncements(false); // Disable button if no more data
            }
        } catch (error) {
            console.error('Error loading more announcements:', error);
        }
    };

    const handleFilterToggle = (isOpen) => {
        setIsFilterOpen(isOpen);
    };

    const applyFilters = async (filterData) => {
        setFilters(filterData);
        try {
            const response = await axios.get('https://card-trader.online/api/announcements/paginated', {
                params: {
                    page: 1,
                    ...filterData
                }
            });
            setFilteredAnnouncements(response.data.results);
            setCurrentPage(1); // Reset to first page on filter change
            setHasMoreAnnouncements(true); // Reset more announcements state
        } catch (error) {
            console.error('Error applying filters:', error);
        }
    };

    // Show loading indicator if user data is still being fetched
    if (isLoadingUser) {
        return <div className="loading-screen">Загрузка...</div>;
    }

    // Show loading indicator if announcements are still being fetched
    if (loading) {
        return <div className="loading-screen">Загрузка объявлений...</div>;
    }

    return (
        <div>
            {currentUser.role === "admin" ? (
                <>
                    <Filters applyFilters={applyFilters} onToggle={handleFilterToggle} />

                    <div className={`announcements-grid ${isFilterOpen ? 'filter-open' : ''}`}>
                        {filteredAnnouncements.map((announcement) => (
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

                    {!loading && hasMoreAnnouncements && (
                        <button className="show-more-button" onClick={showMoreAnnouncements}>
                            Показать больше
                        </button>
                    )}
                </>
            ) : (
                <div className="no-access-message">Извините, у вас нет доступа к этой странице.</div>
            )}
        </div>
    );
};

export default DeletePage;
