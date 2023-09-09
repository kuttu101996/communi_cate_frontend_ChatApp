// rafce
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Chat from "./Components/chatCompo/Chat";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ChatState } from "./context/ChatProvider";

function App() {
  const { setUser } = ChatState();
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) {
      setUser(userInfo)
      navigate("/chat");
    } else navigate("/");
  }, [navigate]);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
