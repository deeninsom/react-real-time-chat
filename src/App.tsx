import { BrowserRouter, Route, Routes } from "react-router-dom"
import AdminRoom from "./page/room-chat/AdminRoom"
import Auth from "./page/auth/Auth"
import MemberRoom from "./page/room-chat/MemberRoom"

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route path="/admin_room" element={<AdminRoom />} />
          <Route path="/member_room" element={<MemberRoom />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App