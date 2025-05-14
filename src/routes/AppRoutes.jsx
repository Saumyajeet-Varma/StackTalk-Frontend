import { BrowserRouter, Route, Routes } from "react-router-dom"
import Homepage from "../pages/Homepage"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Project from "../pages/Project"
import UserAuth from "../auth/UserAuth"

const AppRoutes = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<UserAuth><Homepage /></UserAuth>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/project" element={<UserAuth><Project /></UserAuth>} />
                <Route path="*" element={<div>Error</div>} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes
