//--------------------------------------------------------------------

//--------------------------------------------------------

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

