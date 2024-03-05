import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/home"
import Login from "./pages/login"
import Registration from "./pages/registration"
import {UserContext} from "./components/UserContext";
import {useState} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

function App() {
    const [user, setUser] = useState(false);
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <UserContext.Provider value={{user, setUser}}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Registration />} />
                    </Routes>
                </BrowserRouter>
            </UserContext.Provider>
        </QueryClientProvider>
    );
}

export default App;
