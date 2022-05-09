import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import FriendsList from "../../components/FriendsList/FriendsList";
import AddAbouts from "../../components/AboutMe/AboutMe";
import { Link } from "react-router-dom";
import { FaHome } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import { RiImageEditFill } from 'react-icons/ri';
import "./ProfilePage.css"
import { useLocation } from "react-router-dom";
import axios from "axios";
import FormData from 'form-data'
// import burgerbackground from './assets/burgerbackground.mp4'

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [mFriends, setMFriends] = useState();
  let location = useLocation()
  const [userImage, setUserImage] = useState(`uploads\\images\\burger.jpg`);
  // const [userImage, setUserImage] = useState(`uploads\\images\\burger.jpg`);
  // const { userImage } = location.state

  const getUserImage = async () => {
    console.log(user._id)
    let img = await axios.get(`http://localhost:3008/api/abouts/profilepic/${user._id}`)
    // console.log(`/backend/${img.data}`)
    if (img.data.length > 0){
      setUserImage(img.data)
    }
  }


  function handleSubmit(e){
    e.preventDefault()
    // var testBody = {'myImage':document.getElementById("imageUpload").value}
    var bodyFormData = new FormData();
    bodyFormData.append('image', document.getElementById("imageUpload").files[0])
    console.log(bodyFormData.get('image'))
    pushUserImage(bodyFormData)
  }
  const pushUserImage = async (bodyFormData) => {
    await axios({
    method: "post",
    url: `http://localhost:3008/api/abouts/profilepic/${user._id}`,
    data: bodyFormData,
    headers: { "encType": "multipart/form-data" },
  })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (response) {
      console.log(response);
    });

    // await axios.post(`http://localhost:3008/api/abouts/profilepic/${user._id}`, {data:bodyFormData, headers: { "encType": "multipart/form-data" }, method:"post"})
    getUserImage()


  }

  useEffect(() => {
    getUserImage()
  },[])


  return (
    <div className="container">
      {/* <video src={burgerbackground} /> */}
      <h1 className="text-left">Home Page for {user.name}</h1>
      <div className="container d-flex">
        <div className="w-75 m-2 border border-start">
          <div className="container">
            <div className="d-flex">
              <div className="lg-avatar">
                <button>
                  <img src={`http://localhost:3008/backend/${userImage}`} alt={`image-${user._id}`} onClick={() => {
                    if (document.getElementById('changeProfilePic').className == 'z-i100 visible') {
                      document.getElementById('changeProfilePic').className = 'z-i100 invisible';
                    } else if (document.getElementById('changeProfilePic').className == 'z-i100 invisible') { document.getElementById('changeProfilePic').className = 'z-i100 visible' }
                  }} />
                </button>
                <div className="editIcon"><RiImageEditFill /></div>
                <div className="z-i100 invisible" id='changeProfilePic'>
                    <h1> Upload Image </h1>
                    <form onSubmit={(e) => {handleSubmit(e)
                  document.getElementById('changeProfilePic').className = 'z-i100 invisible'
                  }}>
                      <input type="file" name="myImage"  id="imageUpload" accept="image/png, image/jpeg, image/jpg"/>
                      <input type="submit" value="Upload Photo"/>
                    </form>
                </div>
              </div>
              <div className="mt-2 ms-3 editInfo">
                <div className="p-info-icon"><FaEdit /></div>
                <div className="d-flex">
                  <div className="label">Name: </div><div className="profileinfo">{user.name}</div>
                </div>
                <div className="d-flex">
                  <div className="label">Edit: </div><div className="profileinfo">{user.email}</div>
                </div>
              </div>
            </div>
            <AddAbouts userId={user._id} />
            <p className="editProfile-text">{user.name}</p>
          </div>
        </div>
        <div>
          <Link type="button" className="home-btn" to="/"><FaHome /></Link>
          <FriendsList userId={user._id} setMFriends={setMFriends} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
