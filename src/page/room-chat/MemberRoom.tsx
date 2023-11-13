/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect, useState } from 'react';
import axiosInstance from '../../service/api';
import { io, Socket } from 'socket.io-client';


const MemberRoom = () => {

    const chatContainerRef: any = useRef();
    const socketRef: any = useRef<Socket | null>(null);
    const [showMessage, setShowMessage]: any = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [isConnected, setIsConnected] = useState(true);

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
        axiosInstance.get('messages/44963cbc-8a8d-4bce-8f95-aa4b38e1b555')
            .then((response) => {
                setShowMessage(response.data.data)
            })
            .catch((error) => {
                alert(`Error fetching message data: ${error}`)
            });
    }, [showMessage])

    const handleSendMessage = (e: any) => {
        e.preventDefault()

        if (!isConnected) {
            alert("Connection is disconnected. Cannot send messages.");
            return;
        }

        socketRef.current?.emit('member_message', JSON.stringify({
            sender_id: "2",
            conversation_id: "44963cbc-8a8d-4bce-8f95-aa4b38e1b555",
            text: newMessage
        }));

        axiosInstance.post('messages', {
            sender_id: "2",
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

    const handleDisconectMessage = () => {
        socketRef.current?.emit('disconnect_message', JSON.stringify({
            sender_id: "2",
            conversation_id: "44963cbc-8a8d-4bce-8f95-aa4b38e1b555",
            text: "koneksi_terputus",
        }));

        setIsConnected(false);
    }

    return (
        <>
            <section style={{ backgroundColor: "GrayText", height: "100vh" }}>
                <div className="container pt-5 ">
                    <div className="card" style={{ maxHeight: "20%" }}>
                        <div className="card-header d-flex justify-content-between" style={{ border: "none", width: "100%" }}>
                            <div className="mb-0">Room Member</div>
                            <button onClick={handleDisconectMessage} type="button" className="btn btn-primary btn-sm" data-mdb-ripple-color="dark">Selesai</button>
                        </div>
                        <div className="card-body">
                            <div className="room" style={{ maxHeight: "350px", overflowY: "scroll" }}>
                                {
                                    showMessage.map((val: any, index: any) => {
                                        const isMember = val.sender_id !== "2"
                                        return (
                                            isMember ?
                                                (<div key={index} className="d-flex flex-row justify-content-start">
                                                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                                                        alt="avatar 1" style={{ width: "45px", height: "100%" }} />
                                                    <div>
                                                        <p className="small p-2 ms-3 mb-1 rounded-3" style={{ backgroundColor: "#f5f6f7" }}>{val.text}</p>
                                                        <p className="small ms-3 mb-3 rounded-3 text-muted">{val.created_at}</p>
                                                    </div>
                                                </div>)
                                                : (<div key={index} className="d-flex flex-row justify-content-end mb-4 pt-1">
                                                    <div>
                                                        <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">{val.text}</p>
                                                        <p className="small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end">{val.created_at}</p>
                                                    </div>
                                                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
                                                        alt="avatar 1" style={{ width: "45px", height: "100%" }} />
                                                </div>)
                                        )
                                    })
                                }
                            </div>

                        </div>
                        <div className="card-footer">
                            <div className="d-flex justify-content-start align-items-center pe-3 mt-2 fixed">
                                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                                    alt="avatar 3" style={{ width: "5%", height: "100%" }} />
                                <input
                                    disabled={!isConnected}
                                    value={newMessage}
                                    onChange={(e: any) => setNewMessage(e.target.value)}
                                    type="text" className="form-control form-control-lg" style={{ fontSize: "15px" }} id="exampleFormControlInput2"
                                    placeholder="Type message" />
                                <i onClick={handleSendMessage} className="fas fa-paper-plane ms-3" style={{ cursor: "pointer" }}></i>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default MemberRoom