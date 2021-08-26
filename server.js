const express = require("express");
const app = express();
const cors = require("cors");
const { json, urlencoded } = require("body-parser");
const { secret } = require("./config.json");

app.set("superSecret", secret);
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cors());

// sync stuff
const db = require("./models");

// force: true will drop the table if it already exists
db.sequelize.sync({ force: false }).then(() => {
	console.log("Drop and Resync with { force: true }");
});

// api routes
app.use("/api", require("./routes/routes"));

// Create a Server
const server = app.listen(3001, () => {
	const host = server.address().address;
	const port = server.address().port;

	console.log(`App listening on ${port}`);
});
