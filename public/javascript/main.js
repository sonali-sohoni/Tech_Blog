async function signupHandler(event) {
	event.preventDefault();
	const username = $("#username").val().trim();
	const password = $("#inputPassword").val().trim();
	var msg = "";
	if (username === "") {
		$("#username").addClass("bg-danger");
		msg = "Please correct the errors and try again";
	} else $("#username").removeClass("bg-danger");
	if (password === "") {
		$("#inputPassword").addClass("bg-danger");
		msg = "Please correct the errors and try again";
	} else $("#username").removeClass("bg-danger");

	$("#msg").val(msg);
	if (msg) return false;

	const response = await fetch("/api/users", {
		method: "POST",
		body: JSON.stringify({
			username,
			password,
		}),
		headers: { "Content-Type": "application/json" },
	});
	if (response.ok) {
		console.log("success");
		document.location.replace("/");
	} else {
		alert(response.statusText);
		printErrorMsg(response.statusText);
	}
}

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
			document.querySelector("#errMsg").innerHTML =
				"Wrong username OR password";
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
