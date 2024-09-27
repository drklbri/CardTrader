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

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));
    const [currentUser, setCurrentUser] = useState(null);

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
            if (isAuthenticated) {
                const accessToken = localStorage.getItem('access_token');
                const response = await axios.get('https://card-trader.online/auth/user', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setCurrentUser(response.data);
            }
        };

        fetchCurrentUser();
    }, [isAuthenticated]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, currentUser }}>
            <div className="app-container">
                <BrowserRouter>
                    <Navibar />
                    <Routes>
                        <Route path="/main" element={<MainPage />} />
                        <Route path="/cabinet" element={<Cabinet />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/register" element={<RegistrationPage />} />
                        <Route path="/user/:login" element={<UserProfile/>} />
                        <Route path="/announcement/:id" element={<AnnouncementPage/>} /> {/* Добавляем маршрут для страницы объявления */}
                        <Route path="/createAnnouncement" element={<CreateAnnouncement/>} />
                        <Route path="/deletePage" element={<DeletePage/>} />
                    </Routes>
                </BrowserRouter>
            </div>
        </AuthContext.Provider>
    );
}

export default App;
