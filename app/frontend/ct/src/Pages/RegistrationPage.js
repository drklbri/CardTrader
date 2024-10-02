import React, {useEffect} from 'react';
import Registration from "../Components/Registration";
import YandexMetrika from "../Components/YandexMetrika";
/* global ym */

function RegistrationPage() {
    return (
        <div>
            <YandexMetrika />
            <Registration />
        </div>
    );
}

export default RegistrationPage;
