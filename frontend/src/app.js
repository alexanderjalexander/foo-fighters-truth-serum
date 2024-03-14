import {BrowserRouter, redirect, Route, Routes} from "react-router-dom";
import Home from "./pages/home"
import Login from "./pages/login"
import Registration from "./pages/registration"
import {AuthWrapper} from "./components/UserContext";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

function App() {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <AuthWrapper>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login"
                               element={<Login />}
                        />
                        <Route path="/register"
                               element={<Registration />}
                        />
                    </Routes>
                </BrowserRouter>
            </AuthWrapper>
        </QueryClientProvider>
    );
}

export default App;
