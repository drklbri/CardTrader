import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainPage from "./Pages/MainPage";
import Cabinet from "./Pages/Cabinet";
import AuthPage from "./Pages/AuthPage";
import RegistrationPage from "./Pages/RegistrationPage";
import Navibar from "./Components/Navibar";
import {useState} from "react";
import { AuthContext } from './Components/AuthContext';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));

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

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            <div className="app-container">
                <BrowserRouter>
                    <Navibar /> {/* Заменяем Navibar на компонент Navigation */}
                    <Routes>
                        <Route path="/main" element={<MainPage />} />
                        <Route path="/cabinet" element={<Cabinet />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/register" element={<RegistrationPage />} />
                        {/* Дополнительные маршруты */}
                    </Routes>
                </BrowserRouter>
            </div>
        </AuthContext.Provider>
    );
}

export default App;
