const mongoose = require("mongoose");
const Joi = require("joi");

const postSchema = mongoose.Schema({
  message: { type: String, required: true, minLength:5, maxlength:1028 },
  ownerId: { type: String, required: true},
  image: {type: String},
  stars:{type:[{likerId:{type: String}, starRating:{type: Number}}]},
  dislikes: {type: Number,default: 0}, 
  dateAdded: {type:Date, default: Date.now()},
  });


function validatePost(post){
  const schema = Joi.object({
      dateAdded: Joi.date(),
      stars:Joi.object(),
      message: Joi.string().min(5).max(1028).required(),
      image: Joi.string(),
      ownerId: Joi.string()                
  });
  return schema.validate(post);
};


const Post = mongoose.model("Post", postSchema);

module.exports = {
    Post,
    postSchema,
    validatePost,
};