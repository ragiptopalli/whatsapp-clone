import { Route, Routes } from "react-router-dom";
import "./App.css";
import Chat from "./pages/Chat";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} exact />
        <Route path="/chats" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
