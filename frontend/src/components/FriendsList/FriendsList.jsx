import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import SearchFriend from "./SearchFriend/SearchFriend"
import "./FriendsList.css"
import { RiDeleteBin6Line } from 'react-icons/ri';
import { RiAddCircleLine } from 'react-icons/ri'

const FriendsList = (props) => {
  const { user } = useContext(AuthContext);
  const [friendsNames, setFriendsNames] = useState([]);
  const [friends, setFriends] = useState([]);
  const [pendingFriends, setPendingFriends] = useState([]);
  const [pendingFriendsNames, setPendingFriendsNames] = useState([]);
  const [friendsPicture, setFriendsPictures] = useState([`uploads\\images\\burger.jpg`, `uploads\\images\\burger.jpg`]);
  const [pendingFriendsPictures, setPendingFriendsPictures] = useState([`uploads\\images\\burger.jpg`]);
  const [friendOnline, setFrendOnline] = useState([]);


  const getFriends = async () => {
    try {
      await axios.get(
        `http://localhost:3008/api/users/${user._id}/friends`
      ).then( async (friendList) => {
        props.setMFriends(friendList.data)
        setFriends(friendList.data)
        const friendListNames = await axios.get(`http://localhost:3008/api/users/namefromid`, {params: {"_ids" : friendList.data}})
        setFriendsNames(friendListNames.data)
        const pictureFrames = await axios.get(`http://localhost:3008/api/users/picfromid`, {params: {"_ids" : friendList.data}})
        setFriendsPictures(pictureFrames.data)
        const onlineCheck = await axios.get(`http://localhost:3008/api/users/onlinecheckfromid`, {params: {"_ids" : friendList.data}})
        setFrendOnline(onlineCheck.data)
      })
    } catch (err) {
      console.log(err);
    }
  };

  const getPendingFriends = async () => {
    try {
      await axios.get(
        `http://localhost:3008/api/users/${user._id}/pendingFriends`
      ).then( async (pendingFriendList) => {
      setPendingFriends(pendingFriendList.data);
      const pendingfriendListNames = await axios.get(`http://localhost:3008/api/users/namefromid`,  {params: {"_ids":pendingFriendList.data}})
      setPendingFriendsNames(pendingfriendListNames.data)
      const pendingPictureFrames = await axios.get(`http://localhost:3008/api/users/picfromid`, {params: {"_ids" : pendingFriendList.data}})
      // console.log(pendingPictureFrames.data)
      setPendingFriendsPictures(pendingPictureFrames.data)
      // console.log(pendingfriendListNames);
      })
    } catch (err) {
      console.log(err);
    }
  };

  const acceptFriend = async (e,index) => {
    // console.log(`http://localhost:3008/api/users/${user._id}/friend/${pendingFriends[index]}`)
    await axios.put(`http://localhost:3008/api/users/${user._id}/friend/${pendingFriends[index]}`)
    getFriends()
    getPendingFriends()
  }

  const denyFriend = async (e,index) => {
    // console.log(`http://localhost:3008/api/users/${user._id}/removefriend/${pendingFriends[index]}/list/pending`)
    await axios.put(`http://localhost:3008/api/users/${user._id}/removefriend/${pendingFriends[index]}/list/pending`)
    getFriends()
    getPendingFriends()
  }   

  const removeFriend = async (e,index) => {
    // console.log(`http://localhost:3008/api/users/${user._id}/removefriend/${pendingFriends[index]}/list/pending`)
    console.log(friends)
    await axios.put(`http://localhost:3008/api/users/${user._id}/removefriend/${friends[index]}/list/approved`)
    getFriends()
    getPendingFriends()
  }   

  useEffect(() => {
      getFriends();
      getPendingFriends();
  }, []);



return (
  <div>
  <div className="">
    <SearchFriend userId={user._id} getPendingFriends={getPendingFriends}/>
  </div>
  <div className="friendslist-placement">
    <div className="mb-3 border-bottom border-danger mt-4">
      <h3>Pending Friends</h3>
      <ul className="list-group list-group-flush text-start border">
        {pendingFriendsNames.map((pendingFriend, index) => {
          return (
            <li className="list-group-item p-0" key={index}>
              <div className="d-flex">
                <div className="friends w-75">
                  <div className="pt-2"><em>{pendingFriend}</em></div>
                </div>
                <div className="align-middle w-25 d-flex">
                  <button className="btn btn-add m-0 pb-1" onClick={((e) => {acceptFriend(e, index)})}><RiAddCircleLine /></button>
                  <button className="btn btn-del m-0 pb-1" onClick={((e) => {denyFriend(e, index)})}><RiDeleteBin6Line /></button>
                </div>
              </div>
            </li>
          )
        })
        }
      </ul>
    </div>
    <div className="mb-3 border-bottom border-danger">
      <h3>Friends List</h3>
      <div>
        <ul className="list-group list-group-flush text-start border">
          {friendsNames.map((friend, index) => {
            return (
              <li className="list-group-item fl-avatar" key={index}>
              <div className="d-flex">
                <div className="friends w-75">
                  {console.log(`http://localhost:3008/backend/${friendsPicture[index]}`)}
                  <img src={`http://localhost:3008/backend/${friendsPicture[index]}`} className={`rounded-circle me-2 ${function(){
                    if(friendOnline[index] == "Online"){
                      console.log("OnlineBorder")
                      return "onlineborder"
                    }
                    else if(friendOnline[index] != "Online"){
                      console.log("OfflineBorder")
                      return "offlineborder"
                    }
                  }()}`} align="left" />  
                  <div className="pt-2">{friend}</div>
                </div>
                <div className="align-middle w-25">
                  <button className="btn btn-del m-0 pb-1" onClick={((e) => {removeFriend(e, index)})}><RiDeleteBin6Line /></button>
                </div>
              </div>  
              </li>
            );
          })}
        </ul>
        <div></div>
        </div>
    </div>
  </div>
  </div>
);
};
export default FriendsList;