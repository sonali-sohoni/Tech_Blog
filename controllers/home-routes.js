const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");
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
router.get("/post/:id",  (req, res) => {
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
			if (!dbPostData) {
				res.status(404).json({ message: "No post found with this id" });
				return;
			}
			const post = dbPostData.get({ plain: true });
			if (req.session.loggedIn) console.log("LOGGED IN");
			res.render("single-post", {
				post,
				loggedIn: req.session.loggedIn,
				username: req.session.username,
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

//GET USER POSTS
router.get("/dashboard", withAuth, (req, res) => {
	console.log("GETTING USER'S POST");
	Post.findAll({
		where: {
			// use the ID from the session
			user_id: req.session.user_id,
		},
		attributes: [
			"id",
			"content",
			"title",
			"created_at",

			[
				sequelize.literal(
					"(SELECT COUNT(*) FROM comment WHERE post.id = comment.post_id)"
				),
				"comment_count",
			],
		],
		include: [
			{
				model: Comment,
				attributes: ["id", "comment_text", "post_id", "user_id"],
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
			// serialize data before passing to template
			const posts = dbPostData.map((post) => post.get({ plain: true }));
			res.render("dashboard", {
				posts,
				loggedIn: req.session.loggedIn,
				user_id: req.session.user_id,
				username: req.session.username,
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

router.get("/createpost", (req, res) => {
	Post.findAll({
		where: {
			// use the ID from the session
			user_id: req.session.user_id,
		},
		attributes: [
			"id",
			"content",
			"title",
			"created_at",

			[
				sequelize.literal(
					"(SELECT COUNT(*) FROM comment WHERE post.id = comment.post_id)"
				),
				"comment_count",
			],
		],
		include: [
			{
				model: Comment,
				attributes: ["id", "comment_text", "post_id", "user_id"],
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
			// serialize data before passing to template
			const posts = dbPostData.map((post) => post.get({ plain: true }));
			res.render("createpost", {
				posts,
				loggedIn: req.session.loggedIn,
				user_id: req.session.user_id,
				username: req.session.username,
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

//EDIT POST

//Edit Post route!
router.get("/editpost/:id", (req, res) => {
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
			// 		"(SELECT COUNT(*) FROM comment WHERE post.id = comment.post_id)"
			// 	),
			// 	"comment_count",
			// ],
		],
		include: [
			// {
			// 	model: Comment,
			// 	attributes: ["id", "comment_text", "post_id", "user_id"],
			// 	include: {
			// 		model: User,
			// 		attributes: ["first_name", "last_name"],
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
			console.log(post);
			res.render("editpost", {
				post,
				loggedIn: req.session.loggedIn,
				user_id: req.session.user_id,
				username: req.session.username,
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

module.exports = router;
