import React, { useState, useContext, useEffect } from "react";
// import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import MainFeed from "../../components/HomePage/MainFeed/MainFeed";
import FriendsList from "../../components/FriendsList/FriendsList";
import "./HomePage.css"
import { Link, useLocation} from "react-router-dom";
import axios from "axios";

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const [mFriends, setMFriends] = useState();
  const [userImage, setUserImage] = useState(`uploads\\images\\burger.jpg`);


  const getUserImage = async () => {
    // console.log(user._id)
    let img = await axios.get(`http://localhost:3008/api/abouts/profilepic/${user._id}`)
    // console.log(`/backend/${img.data}`)
    if (img.data.length > 0){
      setUserImage(img.data)
    }
    return (img.data)
  }

  useEffect(() => {
    getUserImage()
  },[])
  
  return (
    <div className="container">
      <h1 className="text-left"></h1>
      <div className="container d-flex">
        <MainFeed userId={user._id} mFriends={mFriends} />
        <div className="m-5 ps-3 border-start border-dark pos-sticky">
          <Link type="button" to="/profile" className="editProfile" state={{userImage : userImage}}> 
            <img src={`http://localhost:3008/backend/${userImage}`} className="sm-avatar m-0" alt={`image-${user._id}`} state={{userImage : userImage}}/>   
            <p className="editProfile-text m-0 p-0 text-center ps-2">{user.name}</p>
            <div className="text-center w-100 m-0 p-0"><small>view profile</small></div>
          </Link>       
          <FriendsList userId={user._id} setMFriends={setMFriends} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
