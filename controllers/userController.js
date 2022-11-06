const { User, Thought } = require('../models');

// /api/users
const userController = {
// GET all users
    getAllUser(req, res) {
        User.find({})
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

// GET a single user by its _id and populated thought and friend data
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },

// POST a new user:
    addUser({ params, body }, res) {
        console.log(params);
        User.create(body)
            .then(dbUserData => {
                console.log(dbUserData);
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },


// PUT to update a user by its _id
    updateUser({ params, body }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $set: body },
            { new: true, runValidators: true }
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

// DELETE to remove user by its _id
    removeUser({ params }, res) {
        User.findOneAndDelete({ _id: params.userId })
            .then(deletedUser => {
                if (!deletedUser) {
                    return res.status(404).json({ message: 'No user with this id!' });
                }
                // BONUS Remove a user's associated thoughts when deleted.
                return Thought.deleteMany({ _id: { $in: deletedUser.thoughts } })
            }).then(() => {
                res.json({ message: "User and associated thoughts have been deleted!" })
            })
            .catch(err => res.json(err));
    },

//'/:userId/friends/:friendId'
// POST to add a new friend to a user's friend list
    addFriend({ params, body }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $push: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
            .then(dbFriendData => {
                if (!dbFriendData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbFriendData);
            })
            .catch(err => res.json(err));
    },

// DELETE to remove a friend from a user's friend list
    removeFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true }
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    return res.status(404).json({ message: 'No user with this id!' });
                }
                res.json(dbUserData)
            })
            .catch(err => res.json(err));
    }
};

// export userController to be used
module.exports = userController;