import React, { useState } from 'react';

const CardForm = ({ card, onImageChange, onTagAdd }) => {
    const [tagInput, setTagInput] = useState('');

    const handleTagInputChange = (e) => setTagInput(e.target.value);

    const handleTagSubmit = (e) => {
        e.preventDefault();
        if (tagInput.trim()) {
            onTagAdd(tagInput.trim());
            setTagInput(''); // Очищаем поле
        }
    };

    return (
        <div className="card-form">
            <div className="image-upload">
                {card.image ? (
                    <div className="image-preview">
                        <img src={card.image} alt="Preview" />
                        <button onClick={() => onImageChange(null)}>Удалить</button>
                    </div>
                ) : (
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onImageChange(e.target.files[0])}
                    />
                )}
            </div>

            <div className="tags-section">
                <form onSubmit={handleTagSubmit}>
                    <input
                        type="text"
                        value={tagInput}
                        onChange={handleTagInputChange}
                        placeholder="Введите тэг"
                    />
                    <button type="submit">Добавить тэг</button>
                </form>
                <div className="tags-container">
                    {card.tags.map((tag, index) => (
                        <span key={index} className="tag-item">{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CardForm;
