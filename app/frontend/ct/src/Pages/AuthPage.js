import React, {useEffect} from 'react';
import Auth from "../Components/Auth";
import YandexMetrika from "../Components/YandexMetrika";
/* global ym */


function RegistrationPage() {
    return (
        <div>
            <YandexMetrika />
            <Auth />
        </div>
    );
}

export default RegistrationPage;
