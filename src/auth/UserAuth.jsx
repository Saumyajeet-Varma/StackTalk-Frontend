import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../context/user.context"

// eslint-disable-next-line react/prop-types
const UserAuth = ({ children }) => {

    const { user } = useContext(UserContext)

    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    const token = localStorage.getItem("token")

    useEffect(() => {

        if (user) {
            setLoading(false)
        }

        if (!user || !token) {
            navigate('/login')
        }

    }, [navigate, token, user])

    if (loading) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <>
            {children}
        </>
    )
}

export default UserAuth
