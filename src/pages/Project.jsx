import { useLocation } from "react-router-dom"

const Project = () => {

    const location = useLocation()

    console.log(location.state)

    return (
        <main className="h-screen w-screen flex">

            <section className="left h-full min-w-72 bg-slate-200 w-1/4 flex flex-col">
                <div className="chat-header px-4 py-2 flex justify-between w-full items-center bg-slate-300">
                    <button className='flex gap-2'>
                        <i className="ri-add-fill"></i>
                        <p>Add collaborator</p>
                    </button>
                    <button className='p-2'>
                        <i className="ri-group-fill"></i>
                    </button>
                </div>

                <div className="chat-app flex-grow flex flex-col">
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

                <div className="side-panel"></div>
            </section>

            {/* <section className="right"></section> */}

        </main>
    )
}

export default Project
