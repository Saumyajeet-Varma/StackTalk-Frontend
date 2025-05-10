import { useState } from "react"
import axios from "../config/axios.js"

const Homepage = () => {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [projectName, setProjectName] = useState(null)

    const createProject = (e) => {
        e.preventDefault()

        console.log({ projectName })

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

    const check = async () => {
        console.log(localStorage.getItem("token"))
    }

    return (
        <main className="p-4">

            <div className="projects">
                <button className="project p-4 border border-slate-300 rounded-md flex gap-2" onClick={() => setIsModalOpen(true)}>
                    <i className="ri-folder-add-line"></i>
                    <p>New project</p>
                </button>

                <button className="project p-4 border border-slate-300 rounded-md flex gap-2" onClick={() => check()}>
                    <i className="ri-folder-add-line"></i>
                    <p>New project</p>
                </button>
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
