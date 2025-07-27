import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../config/axios.js"
import { UserContext } from "../context/user.context.jsx"

const Homepage = () => {

    const { user, setUser } = useContext(UserContext)

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
    const [projectName, setProjectName] = useState(null)
    const [projects, setProjects] = useState([])

    const navigate = useNavigate()

    const capitalizeString = (word) => {

        if (!word) {
            return ''
        }

        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }

    const createProject = (e) => {
        e.preventDefault()

        axios.post('/projects/create', { projectName })
            .then(res => {
                console.log(res)
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => {
                setIsCreateModalOpen(false)
                setProjectName(null)
            })
    }

    const handleLogout = (e) => {
        e.preventDefault()

        axios.get('/users/logout')
            .then(res => {
                console.log(res.message)
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                setUser(null);

                setIsCreateModalOpen(false);

                navigate("/login");
            });
    }

    useEffect(() => {

        axios.get('/projects/all')
            .then(res => {
                setProjects(res.data.data)
            })
            .catch(error => {
                console.log(error)
            })

    }, [])

    return (
        <main>

            <div className="projects">
                <div className="flex justify-between items-center p-4 bg-zinc-800">
                    <div className="flex gap-4 items-end">
                        <p className="text-3xl font-semibold text-white">{capitalizeString(user.username)}</p>
                        <p className="text-lg text-zinc-400">{projects.length < 10 ? `Projects: 0${projects.length}` : `Projects: ${projects.length}`}</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="p-4 pl-3 rounded-md flex gap-2 font-semibold hover:text-slate-300 text-white" onClick={() => setIsCreateModalOpen(true)}>
                            <i className="ri-folder-add-line font-semibold"></i>
                            <p>New project</p>
                        </button>
                        <button className="p-4 pl-3 rounded-md flex gap-2 font-semibold hover:text-red-700 text-red-600" onClick={() => setIsLogoutModalOpen(true)}>
                            <i className="ri-logout-box-line font-semibold"></i>
                            <p>Logout</p>
                        </button>
                    </div>
                </div>

                <div className="flex flex-row flex-wrap gap-4 w-full p-4">
                    {projects.map((project) => (
                        <div key={project._id} className="project flex flex-col gap-2 cursor-pointer p-4 border border-slate-300 rounded-md w-52 hover:bg-slate-200"
                            onClick={() => {
                                navigate(`/project`, {
                                    state: { project }
                                })
                            }}
                        >
                            <h2 className='font-semibold'>{project.projectName}</h2>
                            <div className="flex gap-2">
                                <p><small><i className="ri-user-line"></i> Collaborators</small> :</p>
                                {project.users.length < 10 ? `0${project.users.length}` : project.users.length}
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {isCreateModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-md w-1/3">
                        <h2 className="text-xl mb-4">Create New Project</h2>
                        <form onSubmit={createProject}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                                <input
                                    onChange={(e) => setProjectName(e.target.value)}
                                    value={projectName}
                                    type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
                            </div>
                            <div className="flex justify-end">
                                <button type="button" className="mr-2 px-4 py-2 bg-gray-300 rounded-md" onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isLogoutModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-md w-1/3">
                        <h2 className="text-xl mb-4">Confirm logout ?</h2>
                        <form onSubmit={handleLogout}>
                            <div className="flex justify-end">
                                <button type="button" className="mr-2 px-4 py-2 bg-gray-300 rounded-md" onClick={() => setIsLogoutModalOpen(false)}>Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md">Logout</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </main>
    )
}

export default Homepage
