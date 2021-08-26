const express = require("express");
const router = express.Router();
const db = require("../models");
const users = require("../controllers/user-controller");
const jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens
const app = express();
const config = require("../config.json"); // get our config file
app.set("superSecret", config.secret); // secret variable

const tokencheck = (req, res, next) => {
	// check header or url parameters or post parameters for token
	const token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers.authorization;

	// decode token
	if (token) {
		// verifies secret and checks exp
		jwt.verify(token, app.get("superSecret"), (err, decoded) => {
			if (err) {
				return res.json({ success: false, message: "Failed to authenticate token." });
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});
	} else {
		// if there is no token
		// return an error
		return res.status(403).send({
			success: false,
			message: "No token provided.",
		});
	}
};

// Get all recipes
router.get("/", (req, res) => {
	db.Recipe.findAll().then((recipes) => {
		res.send(recipes);
	});
});

// Get recipe by id
router.get("/:id", (req, res) => {
	db.Recipe.findAll({
		where: {
			id: req.params.id,
		},
		include: [db.User],
	}).then((recipe) => {
		res.send(recipe);
	});
});

// Post new recipe
router.post("/", tokencheck, (req, res) => {
	db.Recipe.create({
		title: req.body.title,
		description: req.body.description,
		UserUserId: req.body.UserUserId,
	}).then((submittedRecipe) => {
		res.send(submittedRecipe);
	});
});

// Delete a recipe
router.delete("/:id", tokencheck, (req, res) => {
	db.Recipe.destroy({
		where: {
			id: req.params.id,
		},
	}).then(() => {
		res.send("Success");
	});
});

// Update a recipe
router.put("/:id", tokencheck, (req, res) => {
	db.Recipe.update(
		{
			title: req.body.title,
			description: req.body.description,
		},
		{
			where: {
				id: req.params.id,
			},
		}
	).then(() => {
		res.send("Updated");
	});
});

//Users
router.post("/signup", users.create);
router.post("/login", users.logincheck);
router.get("/users", tokencheck, users.findAll);
router.get("/users/:id", tokencheck, users.findOne);
router.delete("/users/:id", users._delete);

module.exports = router;
