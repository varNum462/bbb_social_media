import React, { useEffect } from "react";
import axios from 'axios';
import './Rating.css';
import { FaStar } from 'react-icons/fa';

const Rating = (props) => {

  const alterStarRating = async (rating) => {
      await axios.put(`http://localhost:3008/api/posts/${props.postId}/stars/`, {"likerId":props.userId, "starRating":rating})
      props.getPosts();
  }

    function handleRating(event, rating){
      event.preventDefault();
      alterStarRating(rating)
      }          
    return ( 
        <div>        
          <div className="stars text-center">Rate this burger:</div>
          <div className="starholder">
              <form id={`stars${props.postId}`}>
                <label htmlFor={`star-1${props.postId}`} id={`starL-1${props.postId}`} className="starlabel"><FaStar /></label>
                  <input id={`star-1${props.postId}`} className="star" name={`stars-${props.postId}`} type="radio" value={`${props.postId}`} onChange={(event) => handleRating(event,1)} />
                <label htmlFor={`star-2${props.postId}`} id={`starL-2${props.postId}`} className="starlabel"><FaStar /></label>
                  <input id={`star-2${props.postId}`} className="star" name={`stars-${props.postId}`} type="radio" value={`${props.postId}`} onChange={(event) => handleRating(event,2)} />
                <label htmlFor={`star-3${props.postId}`} id={`starL-3${props.postId}`} className="starlabel"><FaStar /></label>
                  <input id={`star-3${props.postId}`} className="star" name={`stars-${props.postId}`} type="radio" value={`${props.postId}`} onChange={(event) => handleRating(event,3)} />
                <label htmlFor={`star-4${props.postId}`} id={`starL-4${props.postId}`} className="starlabel"><FaStar /></label>
                  <input id={`star-4${props.postId}`} className="star" name={`stars-${props.postId}`} type="radio" value={`${props.postId}`} onChange={(event) => handleRating(event,4)} />
                <label htmlFor={`star-5${props.postId}`} id={`starL-5${props.postId}`} className="starlabel"><FaStar /></label>
                  <input id={`star-5${props.postId}`} className="star" name={`stars-${props.postId}`} type="radio" value={`${props.postId}`} onChange={(event) => handleRating(event,5)} />                            
              </form>
          </div>
        </div>
      );
  }
   
export default Rating;