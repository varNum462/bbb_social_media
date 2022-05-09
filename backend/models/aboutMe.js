const mongoose = require("mongoose");
const Joi = require("joi");

const aboutSchema = new mongoose.Schema({
    text: {type:String, minLength: 2, maxLength: 1028, default:"About Me..."},

});

const About = mongoose.model("About", aboutSchema);


function validateAbout(about){
    const schema = Joi.object({
        text: Joi.string().min(2).max(1028),
    });
    return schema.validate(about);
    };
    module.exports = {
        aboutSchema, 
        About,
        validateAbout
    }
















    