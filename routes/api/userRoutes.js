const router = require('express').Router();

const {
    getAllUser,
    getSingleUser,
    addUser,
    addFriend,
    updateUser,
    removeUser,
    removeFriend
} = require('../../controllers/userController');

// /api/users
router
    .route('/')
    .get(getAllUser)
    .post(addUser);

// /api/users/:userId
router
    .route('/:userId')
    .get(getSingleUser)
    .put(updateUser)
    .delete(removeUser);

// /api/users/:userId/friends/:friendId
router
    .route('/:userId/friends/:friendId')
    .post(addFriend)
    .delete(removeFriend)

module.exports = router;
