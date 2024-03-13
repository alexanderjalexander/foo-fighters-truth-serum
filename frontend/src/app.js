import {BrowserRouter, redirect, Route, Routes} from "react-router-dom";
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
                        <Route path="/login"
                               element={<Login />}
                               loader ={async () => {
                                    if (!!user) {
                                        return redirect("/");
                                    }
                                    return null;
                               }}
                        />
                        <Route path="/register"
                               element={<Registration />}
                               loader ={async () => {
                                   if (!!user) {
                                       return redirect("/");
                                   }
                                   return null;
                               }}
                        />
                    </Routes>
                </BrowserRouter>
            </UserContext.Provider>
        </QueryClientProvider>
    );
}

export default App;
