import './App.css';
import MainPage from "./components/main/MainPage";
import {HashRouter, Route, Routes} from "react-router-dom";
import SettingPage from "./components/preference/SettingPage.jsx";

function App() {
    return (
        // <div className="App">
        //     <MainPage />
        // </div>
        <HashRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<MainPage/>}/>
                    <Route path="/setting" element={<SettingPage/>}/>
                </Routes>
            </div>
        </HashRouter>
    );
}

export default App;