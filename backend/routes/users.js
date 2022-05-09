const { User, validateLogin, validateUser } = require("../models/user");
const { Post } = require("../models/post");
const fs =require('fs')
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const fileUpload = require("../middleware/file-upload");

const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const defaultRoute = "http://localhost:3008/backend/"

//* POST register a new user and upload image via middleware
router.post("/register",
  // fileUpload.single("image"),
  async (req, res) => {
    try {
      const { error } = validateUser(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      let user = await User.findOne({ email: req.body.email });
      if (user)
        return res.status(400).send(`Email ${req.body.email} already claimed!`);

      const salt = await bcrypt.genSalt(10);
      user = new User({
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, salt),
        isAdmin: req.body.isAdmin,
        // image: req.file.path
      });


      await user.save();
      const token = user.generateAuthToken();
      return res
        .header("x-auth-token", token)
        .header("access-control-expose-headers", "x-auth-token")
        .send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          image: user.image,
        });
    } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
    }
  });


// POST a valid login attempt
// when a user logs in, a new JWT token is generated and sent if their email/password credentials are correct
router.post("/login", async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send(`Invalid email or password.`);

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    user.online = "Online"
    if (!validPassword)
      return res.status(400).send("Invalid email or password.");

    const token = user.generateAuthToken();
    user.save()
    return res.send(token);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.post("/logout", async (req, res) => {
  try {
    console.log(req.body)
    let user = await User.findById(req.body._id);
    if (!user) return res.status(400).send(`Invalid email or password.`);
    user.online = "Offline"
    user.save()
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

// Get all users
router.get("/", [auth], async (req, res) => {
  try {
    // console.log(req.user);
    const users = await User.find();
    return res.send(users);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

// DELETE a single user from the database
router.delete("/:userId", [auth, admin], async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user)
      return res
        .status(400)
        .send(`User with id ${req.params.userId} does not exist!`);
    await user.remove();
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

// GET all friends
router.get("/:userId/friends", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user)
      return res.status(400)
        .send(`User with id ${req.params.userId} does not exist!`);
    return res.send(user.friends);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

// GET all pendingFriends
router.get("/:userId/pendingFriends", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user)
      return res.status(400)
        .send(`User with id ${req.params.userId} does not exist!`);
    return res.send(user.pendingFriends);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});


// GET all pendingFriends Name
router.get("/namefromid", async (req, res) => {
  try {
    let iterate = []
    if (req.body._ids) {
      iterate = req.body._ids
    }
    else if (req.query._ids) {
      iterate = req.query._ids
    }
    const user = await iterate.map(async (id) => {
      let test = await User.findById(id);
      return test
    })
    Promise.all(user).then((userEntry) => {
      return res.send(userEntry.map((entry) => { return entry.name }));
    })
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.get("/onlinecheckfromid", async (req, res) => {
  try {
    let iterate = []
    if (req.body._ids) {
      iterate = req.body._ids
    }
    else if (req.query._ids) {
      iterate = req.query._ids
    }
    const user = await iterate.map(async (id) => {
      let test = await User.findById(id);
      return test
    })
    Promise.all(user).then((userEntry) => {
      return res.send(userEntry.map((entry) => {if(entry.online){return entry.online;}else{return "Offline"}}));
      // return res.send(userEntry.map((entry) => { return entry.online }));
    })
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.get("/picfromid", async (req, res) => {
  try {
    let iterate = []
    if (req.body._ids) {
      iterate = req.body._ids
    }
    else if (req.query._ids) {
      iterate = req.query._ids
    }
    const user = await iterate.map(async (id) => {
      let test = await User.findById(id);
      return test
    })
    Promise.all(user).then((userEntry) => {
      return res.send(userEntry.map((entry) => {if(entry.image.length > 0 && fs.existsSync(entry.image)){return entry.image;}else{return "uploads\\images\\burger.jpg"}}));
    })
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});



router.get("/friendsearch/:searchString", async (req, res) => {
try{
  console.log(req.params.searchString)
  let owner = await User.find({$or:[{name: {$regex: new RegExp(req.params.searchString.trim(), "i")}} , {email: {$regex: new RegExp(req.params.searchString.trim(), "i")}}]})
  // console.log(owner)
  return res.send(owner)

}catch(e){


}
})

// PUT a pending friend
//NOTE: friendId = the requester ID (the person sending the request), 
//NOTE: ownerId = the requestee ID (The person receiving the request)
router.put("/:ownerId/pendfriend/:friendId", async (req, res) => {
  try {
    console.log(req.params)
    let owner = await User.findById(req.params.friendId);
    if (!owner) return res.status(400).send(`User does not exist!`)
    if (!owner.pendingFriends.includes(req.params.ownerId) && !owner.friends.includes(req.params.ownerId)) {
      owner.pendingFriends.push(req.params.ownerId);
      await owner.save();
      return res.status(200).send(owner);
    }
    else if (owner.pendingFriends.includes(req.params.ownerId) || owner.friends.includes(req.params.ownerId)) {
      return res.send(`You are already friends with this user`)
    }
  } catch (error) {
    return res.status(500).send(`Internal Server Error: ${error}`);
  }
});


// PUT a new friend
router.put("/:ownerId/friend/:friendId", async (req, res) => {
  try {
    let owner = await User.findById(req.params.ownerId);
    if (!owner) return res.status(400).send(`Owner does not exist!`)
    let friend = await User.findById(req.params.friendId)
    if (!friend) return res.status(400).send(`Friend does not exist!`)
    if (!owner.friends.includes(req.params.friendId)) {
      owner.friends.push(req.params.friendId);
      friend.friends.push(req.params.ownerId);
      if (owner.pendingFriends.includes(req.params.friendId)){
        owner.pendingFriends.splice(owner.pendingFriends.indexOf(req.params.friendId), 1)
      }
      if (friend.pendingFriends.includes(req.params.ownerId)){
        friend.pendingFriends.splice(friend.pendingFriends.indexOf(req.params.ownerId), 1)
      }
      await owner.save();
      await friend.save();
      return res.status(200).send(owner);
    }
    else if (owner.friends.includes(req.params.friendId)) {
      return res.send(`You are already friends with this user`)
    }
  } catch (error) {
    return res.status(500).send(`Internal Server Error: ${error}`);
  }
});



router.put("/:ownerId/removefriend/:friendId/list/:list", async (req, res) => {
  try {
    let user = await User.findById(req.params.ownerId);
    if (!user) return res.status(400).send(`User does not exist!`)
    let list = req.params.list
    if (list == "pending") {
      // let arr = user.pendingFriends;
      if (user.pendingFriends.includes(req.params.friendId)){
        user.pendingFriends.splice(user.pendingFriends.indexOf(req.params.friendId),1)
      }
    } else if (list == "approved") {
      let friend = await User.findById(req.params.friendId)
      if (!friend) return res.status(400).send(`User does not exist!`)
      if (user.friends.includes(req.params.friendId)){
          user.friends.splice(user.friends.indexOf(req.params.friendId), 1)
          console.log(user.friends)
      }
      if (friend.friends.includes(req.params.ownerId)){
        friend.friends.splice(friend.friends.indexOf(req.params.ownerId),1)
        console.log(friend.friends)
      }
      // for (let 
      await friend.save();
    }
    await user.save();
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send(`Internal Server Error: ${error}`);
  }
});


module.exports = router;
