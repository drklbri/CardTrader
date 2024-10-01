import React, { useState } from 'react';
import axios from 'axios';
import './ProfileAction.css';

const ProfileActions = ({ onAvatarUpdate }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const response = await axios.post('https://card-trader.online/api/profile/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            if (response.status === 200 && response.data.avatarUrl) {
                console.log('Аватар успешно обновлён');
                onAvatarUpdate(response.data.avatarUrl); // Передаем новый URL аватара
            } else {
                console.error('Ошибка при обновлении аватара:', response);
            }
        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleDeleteAvatar = async () => {
        try {
            const response = await axios.delete('https://card-trader.online/api/profile/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            if (response.status === 204) {
                console.log('Аватар успешно удалён');
                onAvatarUpdate(''); // Очищаем аватар после удаления
                closeModal();
            } else {
                console.error('Ошибка при удалении аватара:', response);
            }
        } catch (error) {
            console.error('Ошибка при удалении аватара:', error);
        }
    };

    return (
        <div className="profile-actions-container">
            <input
                type="file"
                id="avatar-upload"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            <label htmlFor="avatar-upload" className="profile-button">
                Сменить аватар
            </label>
            <button onClick={openModal} className="profile-button">
                Удалить аватар
            </button>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-button" onClick={closeModal}>
                            &times;
                        </button>
                        <h2>Удалить аватар</h2>
                        <p>Вы уверены, что хотите удалить аватар?</p>
                        <div className="modal-actions">
                            <button onClick={handleDeleteAvatar} className="confirm-button">
                                Да, я уверен
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileActions;
