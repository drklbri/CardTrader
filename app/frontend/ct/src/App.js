import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainPage from "./Pages/MainPage";
import Cabinet from "./Pages/Cabinet";
import AuthPage from "./Pages/AuthPage";
import RegistrationPage from "./Pages/RegistrationPage";
import Navibar from "./Components/Navibar";
import UserProfile from "./Pages/UserProfile";
import AnnouncementPage from './Pages/AnnouncementPage'; // Импортируем компонент страницы объявления
import {useEffect, useState} from "react";
import { AuthContext } from './Components/AuthContext';
import axios from "axios";
import CreateAnnouncement from "./Pages/CreateAnnouncement";
import DeletePage from "./Pages/DeletePage";
import SearchResultPage from "./Pages/SearchResultPage"

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = (accessToken, refreshToken) => {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsAuthenticated(false);
    };

    useEffect(() => {
        const fetchCurrentUser = async () => {
            setIsLoading(true); // Устанавливаем состояние загрузки в true
            if (isAuthenticated) {
                const accessToken = localStorage.getItem('access_token');
                try {
                    const response = await axios.get('https://card-trader.online/api/auth/user', {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                    setCurrentUser(response.data);
                } catch (error) {
                    console.error("Ошибка при получении текущего пользователя:", error);
                    setCurrentUser(null);
                }
            }
            setIsLoading(false); // Устанавливаем состояние загрузки в false после завершения
        };

        fetchCurrentUser();
    }, [isAuthenticated]);


    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, currentUser, isLoading }}>
            <div className="app-container">
                <BrowserRouter>
                    <Navibar />
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/cabinet" element={<Cabinet />} />
                        <Route path="/authorization" element={<AuthPage />} />
                        <Route path="/registration" element={<RegistrationPage />} />
                        <Route path="/user/:login" element={<UserProfile/>} />
                        <Route path="/announcement/:id" element={<AnnouncementPage/>} /> {/* Добавляем маршрут для страницы объявления */}
                        <Route path="/createAnnouncement" element={<CreateAnnouncement/>} />
                        <Route path="/deletePage" element={<DeletePage/>} />
                        <Route path="/search" element={<SearchResultPage />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </AuthContext.Provider>
    );
}

export default App;
