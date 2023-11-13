/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react"
import "./room.css"
import axiosInstance from "../../service/api"
import { io, Socket } from 'socket.io-client';

const AdminRoom = () => {
    const [showMessage, setShowMessage]: any = useState([])
    const [conversation, setConversation] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const chatContainerRef: any = useRef();
    const socketRef: any = useRef<Socket | null>(null);
    const [showContentMessage, setShowContentMessage] = useState(false)

    useEffect(() => {
        socketRef.current = io("http://localhost:8080/api/v1/socket");
        console.log(socketRef)

        return () => {
            socketRef.current?.disconnect();
        };
    }, [])

    useEffect(() => {
        socketRef.current?.on('message', (message: any) => {
            setShowMessage([...showMessage, message]);
            chatContainerRef.current?.scrollIntoView({ behavior: "smooth" });
        });

        return () => {
            socketRef.current?.off('message');
        };
    }, [showMessage])

    useEffect(() => {
        axiosInstance.get('/conversations/3')
            .then((response) => {
                setConversation(response.data.data)
            })
            .catch((error) => {
                alert(`Error fetching booking data: ${error}`)
            });
    }, [])


    const handleSendMessage = (e: any) => {
        e.preventDefault()

        socketRef.current?.emit('admin_message', JSON.stringify({
            sender_id: "3",
            conversation_id: "44963cbc-8a8d-4bce-8f95-aa4b38e1b555",
            text: newMessage
        }));

        axiosInstance.post('messages', {
            sender_id: "3",
            conversation_id: "44963cbc-8a8d-4bce-8f95-aa4b38e1b555",
            text: newMessage
        })
            .then((response: any) => {
                setShowMessage([...showMessage, response.data]);
                setNewMessage("")
            })
            .catch((error) => {
                alert(`Error send message  data: ${error}`)
            });
    }

    const showConversation = (conv_id: any) => {
        axiosInstance.get(`messages/${conv_id}`)
        .then((response) => {
            setShowMessage(response.data.data)
        })
        .catch((error) => {
            alert(`Error fetching message data: ${error}`)
        });
        setShowContentMessage(true)
    }

    // useEffect(()=>{})


    return (
        <>
            <section style={{ backgroundColor: "GrayText", height: "100vh" }}>
                <div className="container pt-5 ">
                    <div className="card" style={{ maxHeight: "20%" }}>
                        <div className="card-header" style={{ border: "none", width: "100%" }}>
                            Admin Room
                        </div>
                        <div className="card-body" >
                            <div className="room d-flex gap-4">

                                <div className="col-md-4">
                                    {
                                        conversation.map((val: any, index) => {
                                            const isMemberEqualTo3 = val.member.includes("3");
                                            return (
                                                isMemberEqualTo3 && (
                                                    <ul key={index} className="list-unstyled mb-0">
                                                        <li className="p-2 border-bottom">
                                                            <div style={{ cursor: "pointer" }} onClick={() => showConversation(val.conversation_id)} className="d-flex justify-content-between">
                                                                <div className="d-flex flex-row">
                                                                    <div>
                                                                        <img
                                                                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                                                            alt="avatar" className="d-flex align-self-center me-3" width="60" />
                                                                        <span className="badge bg-success badge-dot"></span>
                                                                    </div>
                                                                    <div className="pt-1">
                                                                        <p className="fw-bold mb-0">Member {val.member[0]}</p>
                                                                        {/* <p className="small text-muted">Hello, Are you there?</p> */}
                                                                    </div>
                                                                </div>
                                                                {/* <div className="pt-1">
                                                                <p className="small text-muted mb-1">Just now</p>
                                                                <span className="badge bg-danger rounded-pill float-end">3</span>
                                                            </div> */}
                                                            </div>
                                                        </li>
                                                    </ul>
                                                )
                                            )
                                        })
                                    }
                                </div>
                                {
                                    showContentMessage && (
                                        <div ref={chatContainerRef} className="col-md-8" style={{ maxHeight: "350px", overflowY: "scroll", paddingRight: "20px" }}>
                                            {
                                                showMessage.map((val: any, index: any) => {
                                                    const isAdmin = val.sender_id !== "3"
                                                    return (
                                                        isAdmin ? (
                                                            <div key={index} className="d-flex flex-row justify-content-start">
                                                                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                                                                    alt="avatar 1" style={{ width: "5%", height: "100%" }} />
                                                                <div>
                                                                    <p className="small p-2 ms-3 mb-1 rounded-3" style={{ backgroundColor: "#f5f6f7" }}>{val.text}</p>
                                                                    <p className="small ms-3 mb-3 rounded-3 text-muted float-end">member {val.sender_id} | Aug 13</p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div key={index} className="d-flex flex-row justify-content-end">
                                                                <div>
                                                                    <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">{val.text}</p>
                                                                    <p className="small me-3 mb-3 rounded-3 text-muted">member {val.sender_id} | Aug 13</p>
                                                                </div>
                                                                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                                                    alt="avatar 1" style={{ width: "5%", height: "100%" }} />
                                                            </div>
                                                        )
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                }

                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="d-flex justify-content-start align-items-center pe-3 mt-2 fixed">
                                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                                    alt="avatar 3" style={{ width: "5%", height: "100%" }} />
                                <input
                                    value={newMessage}
                                    onChange={(e: any) => setNewMessage(e.target.value)}
                                    type="text" className="form-control form-control-lg" style={{ fontSize: "15px" }} id="exampleFormControlInput2"
                                    placeholder="Type message" />
                                <i className="fas fa-paper-plane ms-3" onClick={handleSendMessage} style={{ cursor: "pointer" }}></i>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AdminRoom



