import React from 'react';
import axios from 'axios';
import './ProfileAction.css';

const ProfileActions = () => {
    // Обработчик загрузки файла
    const handleFileChange = async (event) => {
        const file = event.target.files[0]; // Получаем выбранный файл
        if (!file) return; // Если файл не выбран, выходим

        const formData = new FormData(); // Создаём объект FormData для отправки файла
        formData.append('avatar', file); // Добавляем файл в форму данных

        try {
            // Отправляем POST запрос на сервер для изменения аватара
            const response = await axios.post('https://card-trader.online/profile/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Обязательно указываем этот тип контента
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

    // Обработчик удаления аватара
    const handleDeleteAvatar = async () => {
        try {
            // Отправляем DELETE запрос на сервер для удаления аватара
            const response = await axios.delete('https://card-trader.online/profile/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Токен для авторизации
                },
            });

            if (response.status === 204) {
                console.log('Аватар успешно удалён');
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
                style={{ display: 'none' }} // Скрываем input, чтобы он не отображался
                onChange={handleFileChange}
            />
            <label htmlFor="avatar-upload" className="profile-button">
                Сменить аватар
            </label>
            <button onClick={handleDeleteAvatar} className="profile-button">
                Удалить аватар
            </button>
        </div>
    );
};

export default ProfileActions;
