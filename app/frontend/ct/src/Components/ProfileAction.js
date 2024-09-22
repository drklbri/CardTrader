import React from 'react';
import axios from 'axios';
import './ProfileAction.css';

const ProfileActions = ({ onChangeAvatar }) => {
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
                onChangeAvatar(); // Вызываем коллбэк для обновления аватара на странице
            } else {
                console.error('Ошибка при обновлении аватара:', response);
            }
        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
        }
    };

    const handleDeleteAvatar = async () => {
        try {
            // Отправляем DELETE запрос на сервер для удаления аватара
            const response = await axios.delete('https://card-trader.online/profile/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Токен для авторизации
                },
            });

            if (response.status === 200) {
                console.log('Аватар успешно удалён');
                onChangeAvatar(); // Вызываем коллбэк для обновления аватара на странице
            } else {
                console.error('Ошибка при удалении аватара:', response);
            }
        } catch (error) {
            console.error('Ошибка при удалении аватара:', error);
        }
    };

    return (
        <div className="profile-actions-container">
            <label htmlFor="avatar-upload" className="profile-button">
                Change Avatar
            </label>
            <input
                type="file"
                id="avatar-upload"
                style={{ display: 'none' }} // Прячем input, чтобы пользователь видел только кнопку
                onChange={handleFileChange} // Обработчик выбора файла
            />
            <button onClick={handleDeleteAvatar} className="profile-button">
                Delete Avatar
            </button>
        </div>
    );
};

export default ProfileActions;
{/* <button className="profile-button">
                Change Password
            </button>
            <button className="profile-button">
                Update Contact Info
            </button>*/}