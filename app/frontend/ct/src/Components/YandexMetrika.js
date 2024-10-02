import React, { useEffect } from 'react';
/* global ym */
const YandexMetrika = () => {
    useEffect(() => {
        // Инициализация Яндекс.Метрики
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t);a=e.getElementsByTagName(t)[0];k.async=1;k.src=r;a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

        ym(98526521, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            webvisor:true
        });
    }, []); // Пустой массив зависимостей означает, что этот эффект выполнится один раз при монтировании компонента

    return (
        <noscript>
            <div>
                <img
                    src="https://mc.yandex.ru/watch/98526521"
                    style={{ position: 'absolute', left: '-9999px' }}
                    alt=""
                />
            </div>
        </noscript>
    );
};

export default YandexMetrika;
