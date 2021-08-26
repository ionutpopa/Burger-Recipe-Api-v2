const db = require("../models/index.js");
const User = db.User;
const jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens
const express = require("express");
const app = express();
const config = require("../config.json"); // get our config file
app.set("superSecret", config.secret); // secret variable

const create = (req, res) => {
	const { email, password } = req.body;
	User.create({
		email: email,
		password: password,
	})
		.then((user) => res.status(201).send(user))
		.catch((error) =>
			res.json({
				error: true,
				data: [],
				error: error,
			})
		);
};

// Retrieve and return all Users from the database.
const findAll = (req, res) => {
	User.findAll({
		include: [db.Recipe],
	})
		.then((user) =>
			res.json({
				data: user,
			})
		)
		.catch((error) =>
			res.json({
				error: true,
				data: [],
				error: error,
			})
		);
};

// Find a single User with a userId
const findOne = (req, res) => {
	//Get One User using ID
	const user_id = req.params.id;
	User.findOne({
		where: {
			user_id: user_id,
		},
		include: [db.Recipe],
	})
		.then((user) => res.status(201).json({ user }))
		.catch((error) =>
			res.json({
				error: true,
				message: error,
			})
		);
};

// delete user
const _delete = (req, res) => {

	User.destroy({
		where: {
			user_id: req.params.id,
		},
	})
		.then((status) =>
			res.status(201).json({
				message: "User has been delete.",
			})
		)
		.catch((error) =>
			res.json({
				error: true,
				error: error,
			})
		);
};

// login
const logincheck = (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	User.findOne({
		where: {
			email: email,
		},
	})
		.then((user) => {
			if (user) {
				user.comparePassword(password, (error, response) => {
					if (error) return res.status(401).json(handleUnAuthorizedError);

					if (response) {
						const payload = {
							email: email,
						};
						var token = jwt.sign(payload, app.get("superSecret"), {
							expiresIn: "24h", // expires in 24 hours
						});

						// return the token
						res.status(200).send({ token: token, user_id: user.user_id });
					} else {
						return res.status(401).json(handleUnAuthorizedError);
					}
				});
			} else {
				res.status(401).send({message: "Wrong email or password"});
			}
		})
		.catch((error) => res.status(401).send({message: "Wrong email or password"}));
};

let handleUnAuthorizedError = {
	success: false,
	message: "UnAuthorized",
	token: null,
};

module.exports = {
	create,
	findAll,
	findOne,
	_delete,
	logincheck,
};
