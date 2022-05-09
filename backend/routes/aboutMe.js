const { User, validateLogin, validateUser } = require("../models/user");
const { About, validateAbout } = require("../models/aboutMe")

const fileUpload = require("../middleware/file-upload");

const fs = require('fs');
const path = require('path');
const express = require("express");
const router = express.Router();

const { commentSchema } = require("../models/post");
const { aboutMeSchema } = require("../models/aboutMe");



router.post("/profilepic/:userId",fileUpload.single("image"), async(req, res) => {
try{
    console.log(req.file)
    let user = await User.findById(req.params.userId);
    let oldImage = user.image
    if (oldImage != ""){
        fs.unlink(oldImage, (err) => {
            console.log(err)
        })
    }
    user.image = req.file.path
    await user.save()
    return res.send(user)
}catch(err){
    return res.status(500).send(`Internal Server Error: ${err}`);
}
})


router.get("/profilepic/:userId", async (req,res) => {
try{
    let user = await User.findById(req.params.userId);
    console.log(user.image)
    return res.send(user.image)    
}catch(err){
    return res.status(500).send(`Internal Server Error: ${err}`);

}
})

// POST about me
router.post("/:userId", async (req, res) => {
    try {
        let {error} = validateAbout(req.body);
        if (error) return res.status(400).send(`Your About Me status had the following errors: ${error}`)

        const user = await User.findById(req.params.userId);
        if (!user)
        return res
        .status(400)
        .send(`User with id ${req.params.userId} does not exist!`);

        const newAboutMe = await About(req.body);
        user.about = newAboutMe

        await user.save()
            return res.status(201).send(user);
        
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});


// GET about me 
router.get("/:userId", async (req, res) => {
    try {
        let ownerAboutMe = await User.findById(req.params.userId);
        if (!ownerAboutMe) return res.status(400).send("No about me!");
        return res.status(200).send(ownerAboutMe);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});


module.exports = router;
      
        
          
          
    
   