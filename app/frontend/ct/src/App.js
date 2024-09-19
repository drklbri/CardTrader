import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavibarUnauth from "./Components/NavibarUnauth"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainPage from "./Pages/MainPage";
import Cabinet from "./Pages/Cabinet";
import Navibar from "./Components/Navibar";

function App() {
    return (
        <div className="app-container">

            <BrowserRouter>
                <NavibarUnauth />
                <Routes>
                    <Route path="/main" element={<MainPage />} />
                    <Route path="/cabinet" element={<Cabinet />} />
                    {/* Дополнительные маршруты здесь */}
                </Routes>
            </BrowserRouter>
        </div>


    );
}

export default App;
