import { createRef, useContext, useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import Markdown from 'markdown-to-jsx'
import hljs from 'highlight.js';
import axios from "../config/axios.js"
import { initializeSocket, receiveMessageSocket, sendMessageSocket } from "../config/socket.js"
import { getWebContainer } from "../config/webContainer.js";
import { UserContext } from "../context/user.context.jsx"
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';


window.hljs = hljs;

function SyntaxHighlightedCode(props) {

    const ref = useRef(null)

    useEffect(() => {
        // eslint-disable-next-line react/prop-types
        if (ref.current && props.className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current)
            ref.current.removeAttribute('data-highlighted')
        }
        // eslint-disable-next-line react/prop-types
    }, [props.className, props.children])

    return <code {...props} ref={ref} />
}

const Project = () => {

    const location = useLocation()

    const { user } = useContext(UserContext)

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState(new Set())
    const [users, setUsers] = useState([])
    const [searchUser, setSearchUser] = useState("");
    const [project, setProject] = useState(location.state.project)
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [fileTree, setFileTree] = useState({})
    const [currFile, setCurrFile] = useState(null)
    const [openFiles, setOpenFiles] = useState([])
    const [webContainer, setWebContainer] = useState(null)
    const [iFrameUrl, setIFrameUrl] = useState(null)
    // const [runProcess, setRunProcess] = useState(null)

    const messageBox = createRef()

    const filterUsers = users.filter(user => user.username.toLowerCase().includes(searchUser.toLowerCase()) || user.email.toLowerCase().includes(searchUser.toLowerCase()))

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

    const sendMessage = () => {

        if (!message.trim()) return;

        const msgPayload = {
            projectId: project._id,
            sender: {
                _id: user._id,
                username: user.username
            },
            message
        };

        sendMessageSocket('project-message', msgPayload);

        // setMessages(prevMessages => [...prevMessages, msgPayload]);
        setMessage("");

        // axios.post('/project-messages/save', msgPayload)
        //     .then(() => {
        //         console.log('Message saved to DB');
        //     })
        //     .catch(err => {
        //         console.error('Failed to save message:', err);
        //     });
    };


    const WriteAiMessage = (message) => {

        let messageObject = { text: message }

        try {
            messageObject = JSON.parse(message)
        }
        catch (err) {
            console.log(err)
        }

        return (
            <div
                className='overflow-auto bg-slate-950 text-white rounded-sm p-2'
            >
                <Markdown
                    // eslint-disable-next-line react/no-children-prop
                    children={messageObject.text}
                    options={{
                        overrides: {
                            code: SyntaxHighlightedCode,
                        },
                    }}
                />
            </div>)
    }

    useEffect(() => {

        if (!project._id) {
            return;
        }

        const socket = initializeSocket(project._id)

        if (!webContainer) {
            getWebContainer().then(container => setWebContainer(container))
        }

        const messageHandler = (data) => {

            let messageObject = { text: data.message };

            try {
                const parsed = JSON.parse(data.message);

                if (parsed && typeof parsed === 'object') {

                    messageObject = parsed;

                    if (parsed.fileTree) {
                        setFileTree(parsed.fileTree);
                        saveFileTree(parsed.fileTree);
                        webContainer?.mount(parsed.fileTree);
                    }
                }
            }
            catch (err) {
                console.log("No Filetree:", data.message);
            }

            setMessages(prev => [...prev, {
                ...data,
                message: messageObject.text,
                fileTree: messageObject.fileTree || null,
            }]);

        };

        receiveMessageSocket('project-message', messageHandler)

        axios.get(`projects/project/${location.state.project._id}`)
            .then(res => {
                setProject(res.data.data)
                setFileTree(res.data.data.fileTree)
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

        return () => {
            socket.off('project-message', messageHandler);
        };

    }, [project._id, webContainer])

    useEffect(() => {

        axios.get(`/project-messages/${location.state.project._id}`)
            .then(res => {
                setMessages(res.data.data);
            })
            .catch(err => {
                console.log(err)
            });
    }, [location.state.project._id]);

    const saveFileTree = (ft) => {

        axios.put('projects/update-file-tree', { projectId: project._id, fileTree: ft })
            .then(res => {
                console.log(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }

    // ? ScrollToBottom
    // const scrollToBottom = () => {
    //     messageBox.current.scrollTop = messageBox.current.scrollHeight
    // }

    // TODO: ScrollToBottom
    // useEffect(() => {
    //     if (messageBox.current) {
    //         messageBox.current.scrollTop = messageBox.current.scrollHeight;
    //     }
    // }, []);

    return (
        <main className="h-screen w-screen flex">

            <section className="left relative h-screen min-w-96 w-1/4 flex flex-col">
                <div className="chat-header px-4 py-2 flex justify-between w-full items-center bg-slate-300 sticky top-0 z-20">
                    <button className='flex gap-2' onClick={() => setIsModalOpen(true)}>
                        <i className="ri-add-fill"></i>
                        <p>Add collaborator</p>
                    </button>
                    <button className='p-2' onClick={() => setIsSidebarOpen(true)}>
                        <i className="ri-group-fill"></i>
                    </button>
                </div>

                <div className="chat-app flex-grow flex flex-col relative bg-slate-200 overflow-scroll no-scrollbar">
                    <div className="flex flex-col flex-grow w-full h-fit">
                        <div ref={messageBox} className="msg-box flex-grow flex flex-col p-2 gap-1 overflow-auto max-h-full">
                            {messages && messages.map((msg, index) => (
                                <div key={index} className={`${msg.sender._id === 'ai' ? 'max-w-80' : 'max-w-52'} ${msg.sender._id == user._id.toString() && 'ml-auto'}  message flex flex-col p-2 bg-slate-50 w-fit rounded-md`}>
                                    <small className='opacity-65 text-xs'>{msg.sender.username}</small>
                                    {/* <div className={`text-sm`}> */}
                                    <div className={`text-sm ${msg.sender._id === 'ai' ? 'text-white bg-slate-900 py-1 px-3 overflow-x-auto' : ''}`}>
                                        {msg.sender._id === 'ai' ?
                                            WriteAiMessage(msg.message)
                                            : <p>{msg.message}</p>}
                                    </div>
                                </div>
                            ))}

                            {/* <div className="incoming message max-w-80 flex flex-col bg-slate-50 p-2 w-fit rounded-md">
                            <small className="opacity-65 text-sm">username01</small>
                            <p className="text-ms">Hello world auidcfuiab</p>
                        </div>

                        <div className="outgoing message max-w-80 flex flex-col bg-slate-300 p-2 w-fit rounded-md ml-auto">
                            <small className="opacity-65 text-sm">username00</small>
                            <p className="text-ms">Hello world lorem saiubcuabdb diufv ubasd asiuvf vsodubsdbf9b</p>
                        </div> */}
                        </div>
                    </div>
                </div>

                <div className="input-field w-full flex sticky bottom-0 z-20">
                    <input type="text" placeholder="Enter message" value={message} onChange={(e) => setMessage(e.target.value)} className="py-2 px-4 border-none outline-none w-4/5" />
                    <button onClick={sendMessage} className='px-4 bg-slate-300 w-1/5'>
                        <i className="ri-send-plane-fill"></i>
                    </button>
                </div>

                <div className={`sidebar bg-slate-200 h-full w-full absolute transition-all z-30 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} top-0`}>
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

            <section className="right relative h-screen min-w-96 w-3/4 flex">
                <div className="explorer h-full overflow-scroll no-scrollbar w-1/5 bg-slate-500 min-w-48 border-x-2 border-slate-600 sticky top-0">
                    <div className="explorer-header flex justify-start items-center p-1 bg-slate-300">
                        <div className='p-2'>
                            <i className="ri-folder-fill text-lg"></i>
                        </div>
                        <h1 className="font-semibold">Explorer</h1>
                    </div>

                    <div className="file-tree w-full flex flex-col gap-[1px]">
                        {fileTree && Object.keys(fileTree)?.map((file, index) => (
                            <button key={index} onClick={() => {
                                setCurrFile(file)
                                setOpenFiles([...new Set([...openFiles, file])])
                            }} className={`file w-full ${currFile === file ? "bg-slate-600 text-white" : "bg-slate-400"} hover:bg-slate-600 hover:text-white cursor-pointer px-3 py-1`}>
                                <p className="font-semibold text-start">{file}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="code-editor h-full overflow-scroll no-scrollbar w-4/5 min-w-[500px] flex flex-col">
                    <div className="top bg-slate-300 sticky top-0 z-10">
                        <div className="flex justify-between items-center">
                            <div className="flex justify-start items-center p-1">
                                <div className='p-2'>
                                    <i className="ri-file-fill text-lg"></i>
                                </div>
                                <h1 className="font-semibold">{currFile}</h1>
                            </div>

                            {/* <div className="flex gap-2 mr-5">
                                <button onClick={async () => {

                                    const lsProcess = await webContainer?.spawn('ls')

                                    await webContainer?.mount(fileTree)

                                    lsProcess.output.pipeTo(new WritableStream({
                                        write(chunk) {
                                            console.log(chunk)
                                        }
                                    }))

                                }} className="px-3 py-1 bg-slate-400 font-semibold rounded-md hover:bg-slate-600 hover:text-white">ls</button>
                                <button onClick={async () => {

                                    await webContainer?.mount(fileTree)

                                    const installProcess = await webContainer?.spawn("npm", ["install"])

                                    installProcess.output.pipeTo(new WritableStream({
                                        write(chunk) {
                                            console.log(chunk)
                                        }
                                    }))

                                    if (runProcess) {
                                        runProcess.kill()
                                    }

                                    let tempRunProcess = await webContainer?.spawn("npm", ["start"])

                                    tempRunProcess.output.pipeTo(new WritableStream({
                                        write(chunk) {
                                            console.log(chunk)
                                        }
                                    }))

                                    setRunProcess(tempRunProcess)

                                    webContainer.on('server-ready', (port, url) => {
                                        setIFrameUrl(url)
                                    })

                                }} className="px-3 py-1 bg-slate-400 font-semibold rounded-md hover:bg-slate-600 hover:text-white">run</button>
                            </div> */}
                        </div>

                        <div className="tab-bar flex bg-slate-200 overflow-scroll no-scrollbar">
                            {openFiles.map((file, index) => (
                                <button key={index} onClick={() => setCurrFile(file)} className={`text-md font-semibold px-3 py-1 w-fit ${currFile === file ? "bg-slate-600 text-white" : "bg-slate-400"} hover:bg-slate-600 hover:text-white border-x-[1px] border-slate-300`}>{file}</button>
                            ))}
                        </div>
                    </div>

                    <div className="bottom flex-grow flex flex-col no-scollbar">
                        {fileTree && fileTree[currFile] && (
                            <div className="code-editor-area h-full overflow-auto flex-grow bg-slate-50 p-0 no-scollbar">
                                <Editor
                                    value={fileTree[currFile].file.contents}
                                    onValueChange={(updatedContent) => {
                                        const ft = {
                                            ...fileTree,
                                            [currFile]: {
                                                file: {
                                                    contents: updatedContent
                                                }
                                            }
                                        };

                                        setFileTree(ft);
                                        saveFileTree(ft);
                                    }}
                                    highlight={(code) =>
                                        Prism.highlight(code, Prism.languages.javascript, 'javascript')
                                    }
                                    padding={12}
                                    className="h-full font-mono text-sm bg-slate-900 text-white overflow-auto"
                                    style={{
                                        minHeight: '100%',
                                        whiteSpace: 'pre',
                                        outline: 'none',
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {iFrameUrl && webContainer && (
                    <div className="flex flex-col h-full w-full">
                        <div>
                            <input type="text" onChange={(e) => setIFrameUrl(e.target.value)} value={iFrameUrl} className="w-full py-1 px-3 bg-slate-200" />
                        </div>
                        <iframe src={iFrameUrl} className="w-full h-full" id='browser-server'></iframe>
                    </div>
                )}
            </section>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
                        <header className='flex justify-between items-center mb-4'>
                            <h2 className='text-xl font-semibold'>Select User</h2>
                            <button className='p-2' onClick={() => {
                                setIsModalOpen(false);
                                setSearchUser("")
                            }}>
                                <i className="ri-close-fill"></i>
                            </button>
                        </header>
                        <input
                            type="text"
                            value={searchUser}
                            onChange={(e) => setSearchUser(e.target.value)}
                            placeholder="Search by username or email"
                            className="w-full px-3 py-2 border border-slate-300 rounded-md mb-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
                            {filterUsers.map(user => (
                                <div key={user._id} className={`user cursor-pointer hover:bg-slate-200  p-2 flex gap-2 items-center ${Array.from(selectedUserId).indexOf(user._id) != -1 ? 'bg-slate-200' : ""}`} onClick={() => handleUserClick(user._id)}>
                                    <div className='aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600'>
                                        <i className="ri-user-fill absolute"></i>
                                    </div>
                                    <div>
                                        <h1 className='font-semibold text-lg'>{user.username}</h1>
                                        <h1 className='font-normal text-sm text-slate-500 -mt-2'>{user.email}</h1>
                                    </div>
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
