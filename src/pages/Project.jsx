import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import axios from "../config/axios.js"

const Project = () => {

    const location = useLocation()

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState(new Set())
    const [users, setUsers] = useState([])
    const [project, setProject] = useState(location.state.project)

    const handleUserClick = (id) => {

        setSelectedUserId(prevSelectedUserId => {

            const newSelectedUserId = new Set(prevSelectedUserId);

            if (newSelectedUserId.has(id)) {
                newSelectedUserId.delete(id);
            }
            else {
                newSelectedUserId.add(id);
            }

            return newSelectedUserId;
        });
    }

    const addCollaborators = () => {

        axios.put("/projects/add-users", { projectId: location.state.project._id, users: Array.from(selectedUserId) })
            .then(res => {
                console.log(res)
                setIsModalOpen(false)
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {

        axios.get(`projects/project/${location.state.project._id}`)
            .then(res => {
                setProject(res.data.data)
            })
            .catch(err => {
                console.log(err)
            })

        axios.get("/users/all")
            .then(res => {
                setUsers(res.data.data)
            })
            .catch(err => {
                console.log(err)
            })

    }, [location.state.project._id])

    return (
        <main className="h-screen w-screen flex">

            <section className="left relative h-full min-w-96 bg-slate-200 w-1/4 flex flex-col">
                <div className="chat-header px-4 py-2 flex justify-between w-full items-center bg-slate-300">
                    <button className='flex gap-2' onClick={() => setIsModalOpen(true)}>
                        <i className="ri-add-fill"></i>
                        <p>Add collaborator</p>
                    </button>
                    <button className='p-2' onClick={() => setIsSidebarOpen(true)}>
                        <i className="ri-group-fill"></i>
                    </button>
                </div>

                <div className="chat-app flex-grow flex flex-col relative">
                    <div className="msg-box flex-grow flex flex-col p-2 gap-1 ">
                        <div className="incoming message max-w-80 flex flex-col bg-slate-50 p-2 w-fit rounded-md">
                            <small className="opacity-65 text-sm">username01</small>
                            <p className="text-ms">Hello world auidcfuiab</p>
                        </div>

                        <div className="outgoing message max-w-80 flex flex-col bg-slate-300 p-2 w-fit rounded-md ml-auto">
                            <small className="opacity-65 text-sm">username00</small>
                            <p className="text-ms">Hello world lorem saiubcuabdb diufv ubasd asiuvf vsodubsdbf9b</p>
                        </div>
                    </div>

                    <div className="input-field w-full flex">
                        <input type="text" placeholder="Enter message" className="py-2 px-4 border-none outline-none w-4/5" />
                        <button className='px-4 bg-slate-300 w-1/5'>
                            <i className="ri-send-plane-fill"></i>
                        </button>
                    </div>
                </div>

                <div className={`sidebar bg-slate-200 h-full w-full absolute transition-all ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} top-0`}>
                    <div className="sidebar-header flex justify-between items-center px-4 py-2 bg-slate-300">
                        <h1 className="font-semibold text-lg">Collaborators</h1>
                        <button className='p-2' onClick={() => setIsSidebarOpen(false)}>
                            <i className="ri-close-fill text-lg"></i>
                        </button>
                    </div>

                    <div className="collaborators flex flex-col gap-1 items-center py-1">
                        {project.users && project.users.map(user => (
                            <div key={user._id} className="collaborator cursor-pointer hover:bg-slate-300 w-full p-2 flex gap-2 items-center">
                                <div className="aspect-square rounded-full w-fit h-fit flex items-center justify-center p-2 text-white bg-slate-600">
                                    <i className="ri-user-fill text-2xl"></i>
                                </div>
                                <h1 className="font-semibold text-lg">{user.username}</h1>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* <section className="right"></section> */}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
                        <header className='flex justify-between items-center mb-4'>
                            <h2 className='text-xl font-semibold'>Select User</h2>
                            <button onClick={() => setIsModalOpen(false)} className='p-2'>
                                <i className="ri-close-fill"></i>
                            </button>
                        </header>
                        <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
                            {users.map(user => (
                                <div key={user._id} className={`user cursor-pointer hover:bg-slate-200  p-2 flex gap-2 items-center ${Array.from(selectedUserId).indexOf(user._id) != -1 ? 'bg-slate-200' : ""}`} onClick={() => handleUserClick(user._id)}>
                                    <div className='aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600'>
                                        <i className="ri-user-fill absolute"></i>
                                    </div>
                                    <h1 className='font-semibold text-lg'>{user.username}</h1>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={addCollaborators}
                            className='absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md'>
                            Add Collaborators
                        </button>
                    </div>
                </div>
            )}

        </main>
    )
}

export default Project
