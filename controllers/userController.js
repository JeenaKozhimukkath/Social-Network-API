const { User, Thought } = require('../models');

const userController = {
    getAllUsers(req, res) {
        User.find()
          .then((users) => res.json(users))
          .catch((err) => res.status(500).json(err));
      },
    getUserbyId(req, res) {
        User.findOne({ _id: req.params.userId })
          .populate('thoughts')
          .populate('friends')
          .select('-__v')
          .then((userData) =>
            !userData
              ? res.status(404).json({ message: 'No user with this ID' })
              : res.json(userData)
          )
          .catch((err) => res.status(500).json(err));
      },
      createUser(req, res) {
        User.create(req.body)
          .then((userData) => res.json(userData))
          .catch((err) => res.status(500).json(err));
      },
      updateUser(req, res) {
        User.findOneAndUpdate(
          { _id: req.params.userId },
          { $set: req.body },
          { runValidators: true, new: true }
        )
          .then((userData) =>
            !userData
              ? res.status(404).json({ message: 'No user found with this Id' })
              : res.json(userData)
          )
          .catch((err) => res.status(500).json(err));
      },
      deleteUser(req, res) {
        User.findOneAndRemove({ _id: req.params.userId })
          .then((userData) =>
            !userData
              ? res.status(404).json({ message: 'No user with that ID' })
              : Thought.deleteMany({ _id: { $in: userData.thoughts } })
          )
          .then(() => res.json({ message: 'User and associated thoughts deleted!' }))
          .catch((err) => res.status(500).json(err));
      },
      addFriend(req, res) {
        User.findOneAndUpdate(
          { _id: req.params.userId },
          { $addToSet: { friends: req.params.friendId } }, 
          { runValidators: true, new: true }
        )
          .select('-__v')
          .then((userData) =>
            !userData
              ? res.status(404).json({ message: 'No user found with this Id' })
              : res.json(userData)
          )
          .catch((err) => res.status(500).json(err));
      },
      removeFriend(req, res) {
        User.findOneAndUpdate(
          { _id: req.params.userId },
          { $pull: { friends: { friendId: req.params.friendId } } },
          { runValidators: true, new: true }
        )
          .then((userData) =>
            !userData
              ? res.status(404).json({ message: 'No user found with this Id' })
              : res.json(userData)
          )
          .catch((err) => res.status(500).json(err));
      },
}

module.exports = userController;