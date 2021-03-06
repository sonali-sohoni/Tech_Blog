async function commentFormHandler(event) {
	event.preventDefault();

	const comment_text = document
		.querySelector('textarea[name="comment-body"]')
		.value.trim();
	const post_id = window.location.toString().split("/")[
		window.location.toString().split("/").length - 1
	];

	const user_id = document.querySelector("#user_id").value;
	console.log(post_id);

	if (comment_text) {
		const response = await fetch("/api/comments", {
			method: "POST",
			body: JSON.stringify({
				post_id,
				comment_text,
				user_id,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (response.ok) {
			if (response.url.indexOf("login") > -1) {
				document.location.replace("/login");
			} else document.location.reload();
		} else {
			alert(response.statusText);
		}
	}
}

document
	.querySelector(".comment-form")
	.addEventListener("submit", commentFormHandler);
