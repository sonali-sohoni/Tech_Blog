const withAuth = (req, res, next) => {
	if (!req.session.user_id) {
		console.log("GO to login");
		res.redirect("/login");
	} else {
		next();
	}
};

module.exports = withAuth;
