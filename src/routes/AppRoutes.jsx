import { BrowserRouter, Route, Routes } from "react-router-dom"

const AppRoutes = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<div>Home</div>} />
                <Route path="/login" element={<div>Login</div>} />
                <Route path="/register" element={<div>Register</div>} />
                <Route path="*" element={<div>Error</div>} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes
