const { Comment, Pizza } = require('../models');

const commentController = {
	// add comment to pizza
	addComment({ params, body }, res) {
		console.log('addComment body >>> ', body);
		Comment.create(body)
			.then(({ _id }) => {
				console.log('addComment _id >>> ', _id);
				return Pizza.findOneAndUpdate({ _id: params.pizzaId }, { $push: { comments: _id } }, { new: true });
			})
			.then((dbPizzaData) => {
				if (!dbPizzaData) {
					res.statis(404).json({ message: 'There is no pizza with the provided id in the database.' });
					return;
				}
				res.json(dbPizzaData);
			})
			.catch((err) => res.json(err));
	},

	addReply({ params, body }, res) {
		Comment.findOneAndUpdate({ _id: params.commentId }, { $push: { replies: body } }, { new: true })
			.then((dbPizzaData) => {
				if (!dbPizzaData) {
					res.status(404).json({ message: 'No pizza found with this id!' });
					return;
				}
				res.json(dbPizzaData);
			})
			.catch((err) => {
				res.json(err);
			});
	},

	// remove comment
	removeComment({ params }, res) {
		Comment.findOneAndDelete({ _id: params.commentId })
			.then((deletedComment) => {
				if (!deletedComment) {
					return res.status(404).json({ message: 'There is no comment with the provided id in the database.' });
				}
				return Pizza.findOneAndUpdate({ _id: params.pizzaId }, { $pull: { comments: params.commentId } }, { new: true });
			})
			.then((dbPizzaData) => {
				if (!dbPizzaData) {
					res.status(404).json({ message: 'There is no pizza with the provided id in the database.' });
					return;
				}
				res.json(dbPizzaData);
			})
			.catch((err) => res.json(err));
	},

	removeReply({ params }, res) {
		Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $pull: { replies: { replyId: params.replyId } } },
      { new: true })
			.then((dbPizzaData) => res.json(dbPizzaData))
			.catch((err) => res.json(err));
	},
};

module.exports = commentController;
