async function loginForm(event) {
	event.preventDefault();
	const username = document.querySelector("#username").value.trim();
	const password = document.querySelector("#inputPassword").value.trim();
	if (username === "") {
		document.querySelector("#username").style.background = "red";
		document.querySelector("#errMsg").innerHTML = "Please enter your email";
	} else if (password === "") {
		document.querySelector("#inputPassword").style.background = "red";
		document.querySelector("#errMsg").innerHTML = "Please enter your password";
	}
	if (username === "" && password === "") {
		document.querySelector("#inputPassword").style.background = "red";
		document.querySelector("#username").style.background = "red";
		document.querySelector("#errMsg").innerHTML =
			"Please enter the required information";
	}

	if (username && password) {
		const response = await fetch("/api/users/login", {
			method: "post",
			body: JSON.stringify({
				username,
				password,
			}),
			headers: { "Content-Type": "application/json" },
		});
		if (response.ok) {
			console.log("ok");
			document.location.replace("/");
		} else
			document.querySelector("#errMsg").innerHTML = "Wrong email OR password";
	}
}

async function logout() {
	const response = await fetch("/api/users/logout", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (response.ok) {
		console.log("Logged out");
		document.location.replace("/");
	} else {
		alert(response.statusText);
	}
}

function viewPostsByDateRange() {
	let from_post_date = $("#from_post_date").val();
	let to_post_date = $("#to_post_date").val();
	let _from_post_date = moment(from_post_date, dtpickerFormat).subtract(
		1,
		"days"
	);
	let _to_post_date = moment(to_post_date, dtpickerFormat).add(1, "days");

	let from_post_date_seq = _from_post_date.format(format1);
	let to_post_date_seq = _to_post_date.format(format1);
	console.log(from_post_date_seq, to_post_date_seq);
	fetch("/api/posts/daterange", {
		method: "POST",
		body: JSON.stringify({
			to_post_date: to_post_date_seq,
			from_post_date: from_post_date_seq,
		}),
		headers: { "Content-Type": "application/json" },
	})
		.then((response) => {
			console.log(response);
			return response.json();
		})
		.then((data) => {
			console.log(data);
			buildPostsSection(data);
		})
		.catch((err) => {
			console.log(err);
		});
}

function buildPostsSection(posts) {
	$("#postsContainer").empty();
	for (let i = 0; i < posts.length; i++) {
		let thisPost = posts[i];
		let post_date_seq = moment(thisPost.created_at, format1);
		let post_date = post_date_seq.format(dtpickerFormat);

		let div1 = $("<div>").addClass("d-flex text-muted pt-3");

		div1.html(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#dcae1d" class="bi bi-signpost-2-fill flex-shrink-0 me-2 rounded " viewBox="0 0 16 16">
  <path d="M7.293.707A1 1 0 0 0 7 1.414V2H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h5v1H2.5a1 1 0 0 0-.8.4L.725 8.7a.5.5 0 0 0 0 .6l.975 1.3a1 1 0 0 0 .8.4H7v5h2v-5h5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H9V6h4.5a1 1 0 0 0 .8-.4l.975-1.3a.5.5 0 0 0 0-.6L14.3 2.4a1 1 0 0 0-.8-.4H9v-.586A1 1 0 0 0 7.293.707z"/>
</svg>`);

		let atag = $("<a>").attr("href", "/post/" + thisPost.id);
		atag.attr("style", "text-decoration: none");

		let div_post_holder = $("<div>").addClass(
			"pb-3 mb-0 small lh-sm border-bottom w-100"
		);
		let div_title = $("<div>")
			.addClass("d-flex justify-content-between align-items-center")
			.append(
				$("<p>").html(
					`<strong class="text-dark fw-bold">${thisPost.title}</strong>`
				)
			);
		let div_details = $("<div>")
			.addClass("text-dark-gray fw-bold")
			.html(thisPost.post_details);
		let div_blank = $("<div>");
		let div_user = $("<div>")
			.addClass("d-block text-primary fw-bold")
			.html(
				`By ${thisPost.user.first_name} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${post_date};&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${thisPost.comment_count} comment(s)`
			);
		div_post_holder.append(div_title, div_details, div_blank, div_user);
		atag.append(div_post_holder);
		div1.append(atag);
		$("#postsContainer").append(div1);
	}
}

async function logout() {
	const response = await fetch("/api/users/logout", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (response.ok) {
		console.log("Logged out");
		document.location.replace("/");
	} else {
		alert(response.statusText);
	}
}

window.onload = function () {
	if ($("#signupBtn")) {
		$("#signupBtn").on("click", signupHandler);
	}
	if ($("#loginBtn")) $("#loginBtn").on("click", loginForm);
	if ($("#logout")) {
		$("#logout").on("click", logout);
	}
};
