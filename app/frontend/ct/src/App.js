import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavibarUnauth from "./Components/NavibarUnauth"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainPage from "./Pages/MainPage";

function App() {
    return (
        <div className="app-container">

            <BrowserRouter>
                <NavibarUnauth />
                <Routes>
                    <Route path="/main" element={<MainPage />} />
                    {/* Дополнительные маршруты здесь */}
                </Routes>
            </BrowserRouter>
        </div>


    );
}

export default App;
