import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/home"
import Login from "./pages/login"
import Registration from "./pages/registration"

function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Registration />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
