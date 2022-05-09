import React, { useState, useEffect } from "react";
import axios from 'axios';
import './DeletePost.css';

function DeletePost(props) {
   
    //const [Comment, setComment] = useState("")    
        function handleSubmit(event){
            event.preventDefault();          
            handleDeletion(event)
        }


      const handleDeletion = async (event) => {
        await axios.delete(`http://localhost:3008/api/posts/${props.userId}/deletePost/${props.postId}`)
        props.getPosts();
        }

    if(props.userId == props.ownerId){        
    return (
        <div>            
            <form onSubmit={(event) => {handleSubmit(event)}}>
                <div>
                    <input className="btn btn-light m-0" type = 'submit' value = 'Delete Comment'  />
                </div>        
            </form> 
        </div>  
    )
    }else{
        return(<div className="d-none"></div>)
    }
}    

export default DeletePost; 