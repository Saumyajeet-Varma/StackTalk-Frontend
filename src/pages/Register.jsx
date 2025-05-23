import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "../config/axios.js"
import { UserContext } from "../context/user.context.jsx"

const Register = () => {

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const { setUser } = useContext(UserContext)

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()

        axios.post("/users/register", { username, email, password })
            .then(res => {
                localStorage.setItem('token', res.data.data.token)
                setUser(res.data.data.user)

                navigate('/')
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Register</h2>
                <form
                    onSubmit={handleSubmit}
                >
                    <div className="mb-4">
                        {/* <label className="block text-gray-400 mb-2" htmlFor="username">Username</label> */}
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            type="text"
                            id="username"
                            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="mb-4">
                        {/* <label className="block text-gray-400 mb-2" htmlFor="email">Email</label> */}
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-6">
                        {/* <label className="block text-gray-400 mb-2" htmlFor="password">Password</label> */}
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full p-3 rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Register
                    </button>
                </form>
                <p className="text-gray-400 mt-4 text-center">
                    Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    )
}

export default Register
