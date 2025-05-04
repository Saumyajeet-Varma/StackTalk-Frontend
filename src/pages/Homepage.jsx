import { useContext } from "react"
import { UserContext } from "../context/user.context"

const Homepage = () => {

    const { user } = useContext(UserContext)

    return (
        <div>
            {JSON.stringify(user)}
        </div>
    )
}

export default Homepage
