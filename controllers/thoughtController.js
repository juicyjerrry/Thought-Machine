const { User, Thought } = require('../models');

// /api/thoughts
const thoughtController = {
// GET to get all thoughts
    getAllThought(req, res) {
        Thought.find({})
            .select('-__v')
            .sort({ createdAt: -1 }) // most recent
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

// GET to get a single thought by its _id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.thoughtId })
            .select('-__v')
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

// POST to create a new thought (don't forget to push the created thought's _id to the associated user's thoughts array field)
    addThought({ params, body }, res) {
        console.log(params);
        Thought.create(body)
            .then(dbThoughtData => {
                User.findOneAndUpdate(
                    { _id: params.userId },
                    { $push: { thoughts: dbThoughtData._id } },
                    { new: true, runValidators: true }
                )
                console.log(dbThoughtData);
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },

// PUT to update a thought by its _id
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $set: body },
            { new: true, runValidators: true }
        )
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },

// DELETE to remove a thought by its _id
    removeThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
            .then(deletedThought => {
                if (!deletedThought) {
                    return res.status(404).json({ message: 'No thought with this id!' });
                }
            })
            .catch(err => res.json(err));
    },

// POST to create a reaction stored in a single thought's reactions array field
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },

// DELETE to pull and remove a reaction by the reaction's reactionId value
    removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => res.json(err));
    }
}

module.exports = thoughtController;