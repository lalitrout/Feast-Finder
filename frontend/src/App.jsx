import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./Navbar";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import AboutUs from "./components/AboutUs";
import EventsList from "./components/EventsList";
import Notfound from "./NotFound";
import Footer from "./Footer";
import Logout from "./components/Logout";
import "./App.css";
import EditEvent from "./components/EditEvent";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <ToastContainer />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/eventslist" element={<EventsList />} />
          <Route path="/edit/:id" element={<EditEvent />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
