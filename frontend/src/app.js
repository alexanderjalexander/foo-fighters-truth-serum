import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/home"
import Login from "./pages/login"
import Registration from "./pages/registration"
import {UserContext} from "./components/UserContext";
import {useState} from "react";

function App() {
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{user, setUser}}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Registration />} />
                </Routes>
            </BrowserRouter>
        </UserContext.Provider>
    );
}

export default App;
