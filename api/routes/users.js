const User = require("../models/User");
const router = require('express').Router();
const bcrypt = require("bcrypt");

router.get('/', (req, res) => {
    res.send("hey its user root")
})

// update user
router.put("/:id", async (req, res) => {
    const { userId, password, isAdmin } = req.body;
    const { id } = req.params;
    if (userId === id || isAdmin) {
        // if the updated information is a password, ie password is selected in the req.body, then salt and rehash the new password
        if (password) {
            try {
                const salt = await bcrypt.genSalt(10);
                // the password of the body has to be updated, not just the password variable
                req.body.password = await bcrypt.hash(password, salt);
            } catch (err) {
                return res.status(500).json(err);
            }
        }
        // any other information is to be updated directly from body
        try {
            const user = await User.findByIdAndUpdate(id,
                { $set: req.body, });   // automatically set all inputs in the body
            res.status(200).json("Account has been updated")
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        return res.status(403).json("you can only update on your account");
    }
});

// delete user
router.delete("/:id", async (req, res) => {
    const { userId, isAdmin } = req.body;
    const { id } = req.params;
    if (userId === id || isAdmin) {
        try {
            await User.findByIdAndDelete(id);   // can also do deleteOne as as arg do {_id:id}
            res.status(200).json("Account has been deleted")
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        return res.status(403).json("you can only delete on your account");
    }
});

// get a user
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        const { password, updatedAt, ...other } = user._doc;    // doc has all the information of user
        // send everything but password and updateAt
        res.status(200).json(other);
    } catch (err) {
        res.status(500).json(err);
    }
});

// follow a user
router.put("/:id/follow", async (req, res) => {
    const { userId } = req.body;
    const { id } = req.params;
    if (id !== userId) {
        try {
            const user = await User.findById(id);
            const currentUser = await User.findById(userId);
            if (!user.followers.includes(userId)) {
                await user.updateOne({ $push: { followers: userId } });
                await currentUser.updateOne({ $push: { following: id } });
                res.status(200).json("you have successfully followed the user")
            } else {
                res.status(403).json("you have already followed this user");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("you cannot follow yourself");
    }
})

// unfollow a user
router.put("/:id/unfollow", async (req, res) => {
    const { userId } = req.body;
    const { id } = req.params;
    if (id !== userId) {
        try {
            const user = await User.findById(id);
            const currentUser = await User.findById(userId);
            if (user.followers.includes(userId)) {
                await user.updateOne({ $pull: { followers: userId } });
                await currentUser.updateOne({ $pull: { following: id } });
                res.status(200).json("you have successfully unfollowed the user")
            } else {
                res.status(403).json("you do not follow this user");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("you cannot unfollow yourself");
    }
})
module.exports = router