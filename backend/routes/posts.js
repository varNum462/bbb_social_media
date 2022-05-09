const { Post, postSchema, validatePost } = require("../models/post");
const { User } = require("../models/user")
const express = require("express");
const router = express.Router();

// POST new post
router.post("/", async (req, res) => {
    try {
        const { error } = validatePost(req.body);       
        if (error) return res.status(400).send(error);           
        let newPost = await new Post(req.body); 
        await newPost.save();        
        return res.status(201).send(newPost);        
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});


//GET posts by ID sent in block
router.get("/postsfromid", async (req, res) => {
    // console.log(req.query)
    try {
      let iterate = []
      if (req.body._ids) {
        iterate = req.body._ids
      }
      else if (req.query._ids) {
        iterate = req.query._ids
      }
      const user = await iterate.map(async (id) => {
        let post = await Post.find({ownerId:id});
        let user = await User.findById(id);
        return {"name":user.name,"post":post}
      })
      Promise.all(user).then((userEntry) => {
        return res.send(userEntry.map((entry) => { return entry}));
      })
    } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
    }
  });


//GET all owner's posts
router.get("/:ownerId", async (req, res) => {
    try {
        let ownerPosts = await Post.find({ownerId:req.params.ownerId});
        if (!ownerPosts) return res.status(400).send("No posts yet! Why don't you add one?");
        return res.status(200).send(ownerPosts);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});



//GET all friends' posts
router.get("/", async (req, res) => {
    try {
        let friendPosts = await Post.find({ownerId:req.params.ownerId});
        if (!friendPosts) return res.status(400).send("No posts yet! Why don't you add one?");
        return res.status(200).send(friendPosts);
        }catch (error) {
            return res.status(500).send(`Internal Server Error: ${error}`);
            }    
        }
    );
router.get("/:ownerId/friends", async (req, res) => {
    try{
      const user = await User.findById(req.params.ownerId);
      if (!user)
      return res.status(400)
      .send(`User with id ${req.params.userId} does not exist!`);
      return res.send(user.friends);
    } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
    }
  });

//PUT STAR rating


// router.put("/:postId/stars/:stars", async (req, res) => {
//     try {       
//         let post = await Post.findById(req.params.postId);        
//         if (!post) return res.status(400).send(`Post does not exist!`) 
//         if (req.params.stars == "1"){
//             post.star1++;
//         } else if (req.params.stars == "2"){
//             post.star2++;
//         } else if (req.params.stars == "3"){
//             post.star3++;
//         } else if (req.params.stars == "4"){
//             post.star4++;
//         } else if (req.params.stars == "5"){
//             post.star5++;
//         }        
//         await post.save();        
//         return res.status(200).send(post);        
//     } catch (error) {
//         return res.status(500).send(`Internal Server Error: ${error}`);
//     }
// });



router.put("/:postId/stars/", async (req, res) => {
  try {
      let post = await Post.findById(req.params.postId);
      if (!post) return res.status(400).send(`Post does not exist!`)
      if (!post.stars.find(item => item.likerId === req.body.likerId)){
        post.stars.push({likerId:req.body.likerId, starRating:req.body.starRating})
      }
      else{
        post.stars.find(item => {if (item.likerId === req.body.likerId) return item.starRating = req.body.starRating
        })
      }
      await post.save()
      console.log(post.stars)   
      return res.status(200).send(post);        
  } catch (error) {
      return res.status(500).send(`${error}`);
  }
});

//PUT post (Add likes, dislikes, star rating)
router.put("/:postId/likes", async (req, res) => {
    try {       
        let post = await Post.findById(req.params.postId);        
        if (!post) return res.status(400).send(`Post does not exist!`)        
        post.likes++;        
        await post.save();        
        return res.status(200).send(post);        
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

//PUT Dislikes
router.put("/:postId/dislikes", async (req, res) => {
    try {       
        let post = await Post.findById(req.params.postId);        
        if (!comment) return res.status(400).send(`Post does not exist!`)        
        post.dislikes++;        
        await post.save();        
        return res.status(200).send(post);        
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

// DELETE User Post
router.delete("/:userId/deletePost/:postId", async (req, res) => {
    try {
        await Post.deleteOne({ _id: req.params.postId }); 
        
      res.send("Deleted Post")
      
    } catch (err) {
      res.status(500).send(err);
    }
  });
    
       
        


module.exports = router;



