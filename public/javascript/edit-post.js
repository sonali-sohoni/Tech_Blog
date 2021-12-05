async function editFormHandler(event) {
	event.preventDefault();

	const title = document.querySelector('input[name="post-title"]').value.trim();
	const content = document.querySelector("#content").value.trim();
	const id = window.location.toString().split("/")[
		window.location.toString().split("/").length - 1
	];

	const response = await fetch(`/api/posts/${id}`, {
		method: "PUT",
		body: JSON.stringify({
			title,
			content,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (response.ok) {
		document.location.replace("/dashboard");
	} else {
		alert(response.statusText);
	}
}

async function deletePost(event) {
	event.preventDefault();

	const title = document.querySelector('input[name="post-title"]').value.trim();
	const content = document.querySelector("#content").value.trim();
	const id = window.location.toString().split("/")[
		window.location.toString().split("/").length - 1
	];

	const response = await fetch("/api/posts/" + id, {
		method: "DELETE",
	});
	console.log(response);
	if (response.ok) {
		document.location.replace("/dashboard");
	} else {
		alert(response.statusText);
	}
}
