const { postSchema } = require("../models/post"); 
const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { aboutSchema } = require("./aboutMe");
const { string } = require("joi");

const userSchema = mongoose.Schema({
  name: { type: String, required: true, minLength: 5, maxLength: 50 },
  email: {
    type: String,
    unique: true,
    required: true,
    minLength: 2,
    maxLength: 255,
  },
  password: { type: String, required: true, minLength: 8, maxLength: 1024 },
  isAdmin: { type: Boolean, required: true },
  about: { type: aboutSchema },
  posts: {type:[postSchema]},
  friends:{type:[]},
  pendingFriends:{type:[]},
  image:{ type: String, default: "" },
  online:{type:String, default:"Offline"}
});
  

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      isAdmin: this.isAdmin,
      friends: this.friends,
      pendingFriends: this.pendingFriends,
      image: this.image,
},
    process.env.JWT_SECRET
  );
};
    
      
 
const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
    isAdmin: Joi.bool().required(),
    image: Joi.string(),
    online: Joi.string(),
  });
  return schema.validate(user);
};
    

const validateLogin = (req) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  });
  return schema.validate(req);
};

const User = mongoose.model("User", userSchema);
module.exports.User = User;
module.exports.userSchema = userSchema;
module.exports.validateUser = validateUser;
module.exports.validateLogin = validateLogin;

