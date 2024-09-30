import React, { useState } from 'react';
import axios from 'axios';
import './ProfileAction.css';

const ProfileActions = () => {
    const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для отображения модального окна

    // Обработчик загрузки файла
    const handleFileChange = async (event) => {
        const file = event.target.files[0]; // Получаем выбранный файл
        if (!file) return; // Если файл не выбран, выходим

        const formData = new FormData(); // Создаём объект FormData для отправки файла
        formData.append('avatar', file); // Добавляем файл в форму данных

        try {
            console.log(formData)
            const response = await axios.post('api/profile/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Токен для авторизации
                },
            });

            if (response.status === 200) {
                console.log('Аватар успешно обновлён');
            } else {
                console.error('Ошибка при обновлении аватара:', response);
            }
        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
        }
    };

    // Открытие модального окна для подтверждения удаления аватара
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Закрытие модального окна
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Обработчик удаления аватара после подтверждения
    const handleDeleteAvatar = async () => {
        try {
            const response = await axios.delete('api/profile/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Токен для авторизации
                },
            });

            if (response.status === 204) {
                console.log('Аватар успешно удалён');
                closeModal(); // Закрываем модальное окно после удаления
            } else {
                console.error('Ошибка при удалении аватара:', response);
            }
        } catch (error) {
            console.error('Ошибка при удалении аватара:', error);
        }
    };

    return (
        <div className="profile-actions-container">
            {/* Элемент input для загрузки аватара */}
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

            {/* Модальное окно для подтверждения удаления */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-button" onClick={closeModal}>
                            &times; {/* Иконка крестика */}
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
