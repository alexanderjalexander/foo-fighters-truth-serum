import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/home"
import Login from "./pages/login"
import Registration from "./pages/registration"
import {AuthWrapper} from "./components/UserContext";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import RouterWrapper from "./components/RouterWrapper";

function App() {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <AuthWrapper>
                <RouterWrapper />
            </AuthWrapper>
        </QueryClientProvider>
    );
}

export default App;
