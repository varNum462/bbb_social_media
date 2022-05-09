import React, { useState, useEffect } from "react";
import axios from 'axios';
import './AddPost.css';
import { MdAddAPhoto } from 'react-icons/md';

function AddPost(props) {
    const [Comment, setComment] = useState("")    
      async function handleSubmit (event) {
          event.preventDefault();          
        let newComment = await axios.post(`http://localhost:3008/api/posts/`, { 
            "dateAdded": Date.now(),
              "message": Comment,
              "image": "images/burger.jpg",
              "ownerId": props.userId
          })
          props.getPosts();
          setComment("");
          props.getPosts()
        }
   
    return (
        <div id="addComment">            
            <form id="commentform" onSubmit = {handleSubmit} >
                <div className="text-start">
                    <label><h4 className="text-dark">Add a Post:</h4></label>
                    <textarea className="form-control m-2 mb-3 border border-success" name = 'comment' id = 'comment' value = {Comment} onChange = {(event) => setComment(event.target.value)}></textarea>
                    <div><button className="btn addImg"><MdAddAPhoto /></button></div>
                </div>
                <div>
                    <input className="btn btn-success" type = 'submit' value = 'Add Comment'/>
                </div>        
            </form> 
        </div>  
    )
}    

export default AddPost; 