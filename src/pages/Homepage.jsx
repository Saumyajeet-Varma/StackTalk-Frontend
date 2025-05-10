import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../config/axios.js"

const Homepage = () => {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [projectName, setProjectName] = useState(null)
    const [projects, setProjects] = useState([])

    const navigate = useNavigate()

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
                setIsModalOpen(false)
                setProjectName(null)
            })
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
        <main className="p-4">

            <div className="projects">
                <button className="p-4 border border-slate-300 rounded-md flex gap-2 mb-4" onClick={() => setIsModalOpen(true)}>
                    <i className="ri-folder-add-line"></i>
                    <p>New project</p>
                </button>

                <div className="flex flex-row flex-wrap gap-4 w-full">
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

            {isModalOpen && (
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
                                <button type="button" className="mr-2 px-4 py-2 bg-gray-300 rounded-md" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </main>
    )
}

export default Homepage
