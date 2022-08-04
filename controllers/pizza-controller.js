const { Pizza } = require('../models');

const pizzaController = {
	// get all pizzas
	getAllPizza(req, res) {
		Pizza.find({})
			.then((dbPizzaData) => res.json(dbPizzaData))
			.catch((err) => {
				console.log(err);
				res.status(400).json(err);
			});
	},

	// get one pizza by id
	getPizzaById({ params }, res) {
		Pizza.findOne({ _id: params.id })
			.then((dbPizzaData) => {
				if (!dbPizzaData) {
					// if pizza with id doesn't exist return 404
					res.status(404).json({ message: 'There is no pizza with the provided id in the database.' });
					return;
				}
				res.json(dbPizzaData);
			})
			.catch((err) => {
				console.log(err);
				res.status(400).json(err);
			});
	},

	// create a new pizza - using the second style for writing object methods
	createPizza: function ({ body }, res) {
		Pizza.create(body)
			.then((dbPizzaData) => res.json(dbPizzaData))
			.catch((err) => res.status(400).json(err));
	},

	// update pizza by id
	updatePizza({ params, body }, res) {
		Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true })
			.then((dbPizzaData) => {
				if (!dbPizzaData) {
					res.status(404).json({ message: 'There is no pizza with the provided id in the database.' });
					return;
				}
				res.json(dbPizzaData);
			})
			.catch((err) => {
				console.log(err);
				res.status(400).json(err);
			});
	},

  // delete a pizza
  deletePizza({ params }, res) {
    Pizza.findOneAndDelete({ _id: params.id })
    .then(dbPizzaData => {
      if (!dbPizzaData) {
        res.status(404).json({ message: 'There is no pizza with the provided id in the database.' });
        return
      }
      res.json(dbPizzaData)
    })
    .catch(err => {
      console.log(err)
      res.status(400).json(err)
    })
  }
};

module.exports = pizzaController;
