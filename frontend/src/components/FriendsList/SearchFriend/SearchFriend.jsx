import React, { useState } from 'react';
import "./SearchFriend.css"
import {FaSearch} from "react-icons/fa"
import axios from 'axios';
const SearchFriend = (props) => {
   const [searchedFriends, setSearchedFriends] = useState([])
    const getSearchedString = async (strSearch) => {

        let testVal = await axios.get(`http://localhost:3008/api/users/friendsearch/${strSearch}`)
        if (testVal.data != ''){
            setSearchedFriends(testVal.data)
        }
        return 
    }
   function handleSearchSubmission(e){
       if (e.code == 'Enter'){
        e.preventDefault()
        if (e.target.value != ''){
            getSearchedString(e.target.value)
        }
        setSearchedFriends([])
        e.target.value = ''
       }
   }

   async function buttonHandler(e){
    e.preventDefault()
    await sendPendFriendRequest(e)
    setSearchedFriends([])
    props.getPendingFriends()
   }

   const sendPendFriendRequest = async (e) => {
    let test = await axios.put(`http://localhost:3008/api/users/${props.userId}/pendfriend/${e.target.value}`)
    // console.log(test.data)
    return (test.data)
   }   
   
   return ( 
    <div>
        <div className="input-group w-100 mt-3"> 
            <span className="input-group-text shad-o"><FaSearch /></span>       
            <input type="text" className="form-control shad-o " placeholder='Search for Friends' onKeyDown={(e) => {handleSearchSubmission(e)}}/>       
        </div>
        <div className='placement'>
            {searchedFriends.map((entry, index) => {
                return(
                    <div key={index}>
                    <button className='buttonWidth' value={entry._id} onClick={(e) => buttonHandler(e)}> {entry.name}</button>
                    </div>
                )
            })         
            }
        </div> 
    </div> );
}
 
export default SearchFriend;