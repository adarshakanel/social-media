const router = require("express").Router();
const Post = require("../models/Post.js");
const User = require("../models/User.js");
// create a post

router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savePost = await newPost.save();
        res.status(200).json(savePost);
    } catch (err) {
        res.status(500).json("err");
    }
});

// update a post
router.put("/:id", async (req, res) => {
    try {
        const { userId } = req.body;
        const { id } = req.params;
        const post = await Post.findById(id);
        if (post.userId === userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("post has been successfully updated");
        } else {
            res.status(403).json("you can only update your post");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// delete a post
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        if (userId === post.userId) {
            await Post.findByIdAndDelete(id);
            res.status(200).json("post has been deleted");
        } else {
            res.status(500).json("you can only delete your own posts");
        }
    } catch (err) {
        res.status(500).json(err);
    }
})

// like a post
router.put("/:id/like", async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        if (!post.likes.includes(userId)) {
            await post.updateOne({ $push: { likes: userId } });
            res.status(200).json("the post has been liked")
        } else {
            await post.updateOne({ $pull: { likes: userId } });
            res.status(200).json("the post has been unliked")
        }
    } catch (err) {
        res.status(500).json(err);
    }

});

// get a post
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});

// get timeline posts
router.get("/timeline/all", async (req, res) => {
    try {
        const { userId } = req.body;
        const currentUser = await User.findById(userId);
        const userPost = await Post.find({ userId: currentUser._id });
        const friendPosts = await currentUser.following.map((friendId) => {
            return Post.find({ userId: friendId });
        })

        res.json(userPost.concat(...friendPosts));

    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;