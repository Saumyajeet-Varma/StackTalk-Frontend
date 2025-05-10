import { BrowserRouter, Route, Routes } from "react-router-dom"
import Homepage from "../pages/Homepage"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Project from "../pages/Project"

const AppRoutes = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/project" element={<Project />} />
                <Route path="*" element={<div>Error</div>} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes
