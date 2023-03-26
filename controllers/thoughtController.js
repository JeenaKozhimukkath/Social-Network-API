const { Thought,User } = require("../models");

const thoughtController = {
    getAllThoughts(req , res) {
        Thought.find()
        .then(thoughtData => res.json(thoughtData))
        .catch(err => res.status(500).json(err))
    },

    getThoughtbyId(req,res) {
        Thought.findOne({ _id: req.params.thoughtId })
        .then(thought => 
            !thought ? res.status(404).json({ message: 'No thought Id found'})
            : res.json(thought)
        )
        .catch(err => res.status(500).json(err));
    },
    createThought(req, res) {
        Thought.create(req.body)
            .then((thoughts) => {
                return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $push: { thoughts: thoughts._id } },
                    { new: true }
                );
            })
            .then((userData) =>
                !userData
                    ? res.status(404).json({ message: 'No user found with that ID' })
                    : res.json({ message: 'Thought created!' })
            )
            .catch((err) => res.status(500).json(err));
    },
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((thoughtData) =>
                !thoughtData
                    ? res.status(404).json({ message: 'No thought Id found' })
                    : res.json({ message: 'Updated thought!' })
            )
            .catch((err) => res.status(500).json(err));
    },
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
            .then((thoughtData) =>
                !thoughtData
                    ? res.status(404).json({ message: 'No thought with this id exists' })
                    : User.findOneAndUpdate(
                        { _id: req.params.thoughtId },
                        { $pull: { thoughts: req.params.thoughtId } },
                        { new: true }
                    )
            )
            .then((userData) =>
                !userData
                    ? res.status(404).json({ message: 'No user found with this Id' })
                    : res.json({ message: 'Thought deleted successfully' })
            )
            .catch((err) => res.status(500).json(err));
    },
    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { new: true, runValidators: true }
        )
            .then(thoughtData => 
                !thoughtData
                    ? res.status(404).json({ message: 'No thought found with this Id!' })
                    : res.json(thoughtData)
            )
            .catch(err => res.json(err));
    },
    removeReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        )
            .then((thoughtData) =>
                !thoughtData
                    ? res.status(404).json({ message: 'No thought found with this Id' })
                    : res.json(thoughtData)
            )
            .catch((err) => res.status(500).json(err));
    },

};

module.exports = thoughtController;
