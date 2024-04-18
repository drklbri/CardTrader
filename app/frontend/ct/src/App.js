import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from "react-bootstrap";
import Navibar from "./Components/Navibar";
import Filters from "./Components/Filters";


function App() {
  return (
      <div className="app-container">
          <Navibar />
          <Filters />{/* Рендерим компонент Navigation */}
          {/* Дополнительный контент вашего приложения */}
      </div>
  );
}

export default App;
