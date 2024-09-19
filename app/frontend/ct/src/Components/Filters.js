import React, { useState } from 'react';
import './Filters.css';

const Filters = ({ applyFilters }) => {
    const [searchText, setSearchText] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const handleConditionChange = (condition) => {
        setSelectedCondition(condition === selectedCondition ? '' : condition);
    };

    const handleApplyFilters = () => {
        applyFilters({ searchText, condition: selectedCondition });
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
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
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Поиск"
                        value={searchText}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="filter">
                    <div className="condition-filter">
                        <div className="condition-title">Состояние</div>
                        <div className="condition-options">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={selectedCondition === 'Отличное'}
                                    onChange={() => handleConditionChange('Отличное')}
                                />
                                <span className="checkbox-custom"></span>
                                Отличное
                            </label>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={selectedCondition === 'Хорошее'}
                                    onChange={() => handleConditionChange('Хорошее')}
                                />
                                <span className="checkbox-custom"></span>
                                Хорошее
                            </label>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={selectedCondition === 'Плохое'}
                                    onChange={() => handleConditionChange('Плохое')}
                                />
                                <span className="checkbox-custom"></span>
                                Плохое
                            </label>
                        </div>
                    </div>
                </div>
                <div className="filter">
                    <button className="apply-button">Применить</button>
                </div>
            </div>
        </div>
    );
};

export default Filters;
