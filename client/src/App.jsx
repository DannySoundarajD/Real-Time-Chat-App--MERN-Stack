import { Routes, Route, Navigate } from "react-router-dom";
import Chat from "./Pages/Chat";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Components/navbar"; // Correct if the file is named navbar.jsx
import { Container } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";
function App() {
    const { user } = useContext(AuthContext)
  return (
    <ChatContextProvider user = {user}>
      <Navbar />
      <Container >
        <Routes>
          <Route path="/" element={user ? <Chat /> : <Login />} />
          <Route path="/register" element={user ? <Chat /> : <Register />} />
          <Route path="/login" element={user ? <Chat /> : <Login />} />
          <Route path="*" element={<Navigate to = "/" />} />
        </Routes>
      </Container>
    </ChatContextProvider>
  );
}

export default App;
