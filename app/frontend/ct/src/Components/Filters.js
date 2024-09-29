import React, { useState, useEffect } from 'react';
import './Filters.css';

const CONDITION = [
    { value: "perfect", label: "Идеальная" },
    { value: "pack_fresh", label: "Только открытая" },
    { value: "minor_wear", label: "Немного поигранная" },
    { value: "visible_wear", label: "Умеренно поигранная" },
    { value: "severe_wear", label: "Поигранная" },
    { value: "damaged", label: "Сильно поигранная" },
    { value: "destroyed", label: "Уничтоженная" }
];

const RARITY = [
    { value: "common", label: "Обычная" },
    { value: "uncommon", label: "Необычная" },
    { value: "rare", label: "Редкая" },
    { value: "mythic", label: "Мифическая" },
    { value: "epic", label: "Эпическая" },
    { value: "legendary", label: "Легендарная" }
];

const Filters = ({ applyFilters, onToggle }) => {
    const [searchText, setSearchText] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('');
    const [selectedRarity, setSelectedRarity] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [tags, setTags] = useState([]);
    const [filteredTags, setFilteredTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        const fetchTags = async () => {
            const response = await fetch('/announcements');
            const data = await response.json();
            const allTags = [...new Set(data.map(announcement => announcement.tags).flat())];
            setTags(allTags);
        };

        fetchTags();
    }, []);

    useEffect(() => {
        if (searchText.length >= 3) {
            const lowerCasedSearchText = searchText.toLowerCase();
            const filtered = tags.filter(tag => tag.toLowerCase().includes(lowerCasedSearchText));
            setFilteredTags(filtered);
        } else {
            setFilteredTags([]);
        }
    }, [searchText, tags]);

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const handleConditionChange = (condition) => {
        setSelectedCondition(condition === selectedCondition ? '' : condition);
    };

    const handleRarityChange = (rarity) => {
        setSelectedRarity(rarity === selectedRarity ? '' : rarity);
    };

    const handleTagClick = (tag) => {
        setSelectedTags((prevSelected) =>
            prevSelected.includes(tag) ? prevSelected.filter(t => t !== tag) : [...prevSelected, tag]
        );
    };

    const handleTagRemove = (tag) => {
        setSelectedTags(prevSelected => prevSelected.filter(t => t !== tag));
    };

    const handleApplyFilters = () => {
        applyFilters({ searchText, condition: selectedCondition, rarity: selectedRarity, tags: selectedTags });
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        onToggle(!isMenuOpen); // Передаем состояние открытого/закрытого фильтра в MainPage
    };

    return (
        <div className={`filters-sidebar ${isMenuOpen ? 'open' : ''}`}>
            <div className="menu-toggleF" onClick={toggleMenu}>
                <div className="menu-icon"></div>
                <div className="menu-icon"></div>
                <div className="menu-icon"></div>
            </div>
            <div className="filters-content">
                <div className="filter">
                    <div className="condition-filter">
                        <div className="condition-title">Состояние</div>
                        <div className="condition-options">
                            {CONDITION.map((option) => (
                                <button
                                    key={option.label}
                                    className={`condition-button ${selectedCondition === option.label ? 'active' : ''}`}
                                    onClick={() => handleConditionChange(option.label)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="filter">
                    <div className="rarity-filter">
                        <div className="rarity-title">Редкость</div>
                        <div className="rarity-options">
                            {RARITY.map((option) => (
                                <button
                                    key={option.label}
                                    className={`rarity-button ${selectedRarity === option.label ? 'active' : ''}`}
                                    onClick={() => handleRarityChange(option.label)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="filter">
                    <input
                        className="search-input-filter"
                        type="text"
                        placeholder="Поиск тегов"
                        value={searchText}
                        onChange={handleSearchChange}
                    />
                    {isMenuOpen && filteredTags.length > 0 && (
                        <ul className="tags-suggestions">
                            {filteredTags.map((tag, index) => (
                                <li
                                    key={index}
                                    className={`tag-item ${selectedTags.includes(tag) ? 'selected' : ''}`}
                                    onClick={() => handleTagClick(tag)}
                                >
                                    {tag}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="selected-tags">
                    {selectedTags.map((tag, index) => (
                        <span key={index} className="selected-tag">
                            {tag}
                            <button className="remove-tag" onClick={() => handleTagRemove(tag)}>x</button>
                        </span>
                    ))}
                </div>
                <div className="filter">
                    <button className="apply-button" onClick={handleApplyFilters}>
                        Применить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Filters;
