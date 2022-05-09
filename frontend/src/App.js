// General Imports
import { Routes, Route } from "react-router-dom";
import "./App.css";

// Pages Imports
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
// Component Imports
import Navbar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import FriendsList from "./components/FriendsList/FriendsList";

// Util Imports
import PrivateRoute from "./utils/PrivateRoute";
import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";

function App() {
  const [user, setUser] = useState({});
  const [file, setFile] = useState();

  const registerUser = async () => {
    const form = new FormData()
      form.append('name', "Dustin")
      form.append('email', "barkerd85@yahoo.com")
      form.append('password', "2Bearcats")
      form.append('image', file)
      await axios
        .post("http://localhost:3008/api/users/register", form)
        .then((res) => {
          localStorage.setItem("token", res.headers["x-auth-token"]);
          const user = jwtDecode(localStorage.getItem("token"));
          setUser(user);
          console.log(res.headers["x-auth-token"]);
        })
        .catch((error) => console.log(error));
        console.log(user);
      };

const loginUser = async () => {
  await axios
    .post("http://localhost:3008/api/users/register", {
      email: "barkerd85@yahoo.com",
      password: "2Bearcats",
    })
    .then((res) => {
    console.log(res.data);
    localStorage.setItem("token", res.data);
    const user = jwtDecode(localStorage.getItem("token"));
    setUser(user);
    })
    .catch((error) => console.log(error));
};


const logoutuser = async () => {

};

useEffect(() => {
}, []);
    
  return (
    <div>
      <Navbar />
      
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
         <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      
      <Footer />
    </div>
  );
}

export default App;
