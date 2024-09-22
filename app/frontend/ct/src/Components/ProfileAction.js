import React from 'react';
import './ProfileAction.css';

const ProfileActions = ({ onChangeAvatar }) => {
    return (
        <div className="profile-actions-container">
            <button className="profile-button" onClick={onChangeAvatar}>
                Change Avatar
            </button>
            <button className="profile-button">
                Change Password
            </button>
            <button className="profile-button">
                Update Contact Info
            </button>
        </div>
    );
};

export default ProfileActions;
