const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");
//LANDING PAGE
router.get("/", (req, res) => {
	console.log(req.session);
	Post.findAll({
		attributes: [
			"id",
			"content",
			"title",
			"created_at",
			// [
			// 	sequelize.literal(
			// 		"(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"
			// 	),
			// 	"vote_count",
			// ],
		],
		order: [["created_at", "DESC"]],
		include: [
			{
				model: Comment,
				attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
				include: {
					model: User,
					attributes: ["username"],
				},
			},
			{
				model: User,
				attributes: ["username"],
			},
		],
	})
		.then((dbPostData) => {
			//console.log(dbPostData[0]);
			const posts = dbPostData.map((post) => post.get({ plain: true }));
			res.render("homepage", {
				posts,
				loggedIn: req.session.loggedIn,
				username: req.session.username,
			}); //send the webpage with template data/
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

//LOGIN
router.get("/login", (req, res) => {
	if (req.session.loggedIn) {
		res.redirect("/");
		return;
	}
	res.render("login");
});

//SIGN UP
router.get("/signup", (req, res) => {
	if (req.session.loggedIn) {
		res.redirect("/");
		return;
	}
	res.render("signup");
});

//loging out
router.post("/logout", (req, res) => {
	if (req.session.loggedIn) {
		req.session.destroy(() => {
			res.status(204).end();
		});
	} else {
		res.status(404).end();
	}
});

//GET SINGLE POST
router.get("/post/:id", (req, res) => {
	console.log("GET SINGLE POST");
	Post.findOne({
		where: {
			id: req.params.id,
		},
		attributes: [
			"id",
			"content",
			"title",
			"created_at",
			// [
			// 	sequelize.literal(
			// 		"(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"
			// 	),
			// 	"vote_count",
			// ],
		],
		include: [
			// {
			// 	model: Comment,
			// 	attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
			// 	include: {
			// 		model: User,
			// 		attributes: ["username"],
			// 	},
			// },
			{
				model: User,
				attributes: ["username"],
			},
		],
	})
		.then((dbPostData) => {
			if (!dbPostData) {
				res.status(404).json({ message: "No post found with this id" });
				return;
			}
			const post = dbPostData.get({ plain: true });
			if (req.session.loggedIn) console.log("LOGGED IN");
			res.render("single-post", { post, loggedIn: req.session.loggedIn });
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

module.exports = router;
