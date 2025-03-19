function openTab(evt, tabName) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(tabName).style.display = "block";
	evt.currentTarget.className += " active";
}
function closeTab(tabName) {
	document.getElementById(tabName).style.display = "none";
	var tablinks = document.getElementsByClassName("tablinks");
	for (var i = 0; i < tablinks.length; i++) {
		if (tablinks[i].textContent === tabName) {
			tablinks[i].className = tablinks[i].className.replace(" active", "");
		}
	}
}
/*document.getElementById("sendAPIBtn").addEventListener("click", async function (event) {*/
document.addEventListener("DOMContentLoaded", function () {
	let sendAPIBtn = document.getElementById("sendAPIBtn");

	if (sendAPIBtn) {
		sendAPIBtn.addEventListener("click", async function (event) {
			event.preventDefault();
			let apiUrl = document.getElementById("endpointUrl").value.trim();
			let requestData = document.querySelector(".requestArea").value.trim();
			let selectedMethod = document.getElementById("httpMethods").value;
			let headersTableBody = document.getElementById('responseHeadersTableBody');
			const headers =
			{
				"Content-Type": "application/json",
				...getRequestHeaders(),
				...getAuthDetails()
			}
			console.log("Headers" + headers);
			headersTableBody.innerHTML = '<tr><td colspan="2">Loading...</td></tr>';

			if (!apiUrl.trim()) {
				console.error("Endpoint URL is required");
				document.querySelector(".responseArea").value = "Error: Endpoint URL is required.";
				return;
			}
			try {
				let response = null;
				if (selectedMethod.toLowerCase() === "post") {
					response = await fetch("/Home/CallExternalAPIPost", {
						method: selectedMethod.toUpperCase(),
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							endpointUrl: apiUrl,
							payload: requestData,
							httpMethod: selectedMethod.toUpperCase(),
							headers: headers
						})
					});
					let responseText = await response.text();
					let parts = responseText.split("###BODY###");

					if (parts.length < 2) {
						console.error("Invalid response format");
						return;
					}

					let headersSection = parts[0].replace("###HEADERS###", "").trim();
					let bodySection = parts[1].trim();
					//let responseData = await response.content;
					//console.log("Response received:", responseData);
					JsonFormatting(bodySection);
					RespHeadersLoading(headersSection, headersTableBody);
				}
				else if (selectedMethod.toLowerCase() === "put") {
					response = await fetch("/Home/CallExternalAPIPut", {
						method: selectedMethod.toUpperCase(),
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							endpointUrl: apiUrl,
							payload: requestData,
							httpMethod: selectedMethod.toUpperCase(),
							headers: headers
						})
					});
					// let responseData = await response.text();
					// 	console.log("Response received:", responseData);
					// 	JsonFormatting(responseData);
					let responseText = await response.text();
					let parts = responseText.split("###BODY###");

					if (parts.length < 2) {
						console.error("Invalid response format");
						return;
					}

					let headersSection = parts[0].replace("###HEADERS###", "").trim();
					let bodySection = parts[1].trim();
					//let responseData = await response.content;
					//console.log("Response received:", responseData);
					JsonFormatting(bodySection);
					RespHeadersLoading(headersSection, headersTableBody);
				}
				else if (selectedMethod.toLowerCase() === "patch") {
					response = await fetch("/Home/CallExternalAPIPatch", {
						method: selectedMethod.toUpperCase(),
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							endpointUrl: apiUrl,
							payload: requestData,
							httpMethod: selectedMethod.toUpperCase(),
							headers: headers
						})
					});
					// let responseData = await response.text();
					// 	console.log("Response received:", responseData);
					// 	JsonFormatting(responseData);
					let responseText = await response.text();
					let parts = responseText.split("###BODY###");

					if (parts.length < 2) {
						console.error("Invalid response format");
						return;
					}

					let headersSection = parts[0].replace("###HEADERS###", "").trim();
					let bodySection = parts[1].trim();
					//let responseData = await response.content;
					//console.log("Response received:", responseData);
					JsonFormatting(bodySection);
					RespHeadersLoading(headersSection, headersTableBody);
				}
				else if (selectedMethod.toLowerCase() === "get") {
					response = await fetch(`/Home/CallExternalAPIGet?endpointUrl=${encodeURIComponent(apiUrl)}`,
						{
							method: selectedMethod.toUpperCase()
						});
					//let responseData = await response.text();
					let responseText = await response.text();
					let parts = responseText.split("###BODY###");

					if (parts.length < 2) {
						console.error("Invalid response format");
						return;
					}

					let headersSection = parts[0].replace("###HEADERS###", "").trim();
					let bodySection = parts[1].trim();
					//let responseData = await response.content;
					//console.log("Response received:", responseData);
					console.log("Response received:", bodySection);
					JsonFormatting(bodySection);
					RespHeadersLoading(headersSection, headersTableBody);
				}
				else if (selectedMethod.toLowerCase() === "delete") {
					response = await fetch(`/Home/CallExternalAPIDelete?endpointUrl=${encodeURIComponent(apiUrl)}`,
						{
							method: selectedMethod.toUpperCase()
						});
					let responseText = await response.text();
					let parts = responseText.split("###BODY###");

					if (parts.length < 2) {
						console.error("Invalid response format");
						return;
					}

					let headersSection = parts[0].replace("###HEADERS###", "").trim();
					let bodySection = parts[1].trim();
					//let responseData = await response.content;
					//console.log("Response received:", responseData);
					console.log("Response received:", bodySection);
					JsonFormatting(bodySection);
					RespHeadersLoading(headersSection, headersTableBody);
				}
			} catch (error) {
				document.querySelector(".responseArea").value = "Error: " + error.message;
			}
		});
	} else {
		console.error("Element with ID 'sendAPIBtn' not found!");
	}
});
function JsonFormatting(jsonVal) {
	try {
		let formattedJson = JSON.stringify(JSON.parse(jsonVal), null, 4);
		document.querySelector(".responseArea").value = formattedJson;
	} catch (error) {
		document.querySelector(".responseArea").value = jsonVal;
	}
}
function showTab(tab) {
	// Hide all content
	document.getElementById('responseBody').classList.remove('visible');
	document.getElementById('responseHeaders').classList.remove('visible');
	document.querySelectorAll('.tabButton').forEach(btn => btn.classList.remove('active'));

	// Show selected tab content
	if (tab === 'body') {
		document.getElementById('responseBody').classList.add('visible');
		document.querySelectorAll('.tabButton')[0].classList.add('active');
	} else {
		document.getElementById('responseHeaders').classList.add('visible');
		document.querySelectorAll('.tabButton')[1].classList.add('active');
	}
}
function showTabReq(tab) {
	// Hide all content
	document.getElementById('requestBody').classList.remove('visibleReq');
	document.getElementById('requestHeaders').classList.remove('visibleReq');
	document.querySelectorAll('.ReqtabButton').forEach(btn => btn.classList.remove('Reqactive'));

	// Show selected tab content
	if (tab === 'body') {
		document.getElementById('requestBody').classList.add('visibleReq');
		document.querySelectorAll('.ReqtabButton')[0].classList.add('Reqactive');
	} else {
		document.getElementById('requestHeaders').classList.add('visibleReq');
		document.querySelectorAll('.ReqtabButton')[1].classList.add('Reqactive');
	}
}
function RespHeadersLoading(headersSection, headersTableBody) {
	headersTableBody.innerHTML = ""; // Clear previous headers
	let headers = {};
	headersSection.split("\n").forEach(line => {
		let [key, value] = line.split(": ");
		if (key && value) headers[key.trim()] = value.trim();
	});

	// Iterate over the headers object and add rows to the table
	for (let key in headers) {
		let row = `<tr><td>${key}</td><td>${headers[key]}</td></tr>`;
		headersTableBody.innerHTML += row;
	}

	// If no headers were found, show a message
	if (headersTableBody.innerHTML.trim() === "") {
		headersTableBody.innerHTML = '<tr><td colspan="2">No headers received</td></tr>';
	}
}
document.addEventListener("DOMContentLoaded", function () {
	const headersTableBody = document.getElementById("headersTableBody");

	function addNewRow() {
		let row = document.createElement("tr");

		row.innerHTML = `
				<td><input type="text" class="header-key" placeholder="Key"></td>
				<td><input type="text" class="header-value" placeholder="Value"></td>
				<td><button class="delete-row">🗑️</button></td>
			`;

		headersTableBody.appendChild(row);

		// Add event listeners
		row.querySelector(".header-key").addEventListener("input", checkAndAddRow);
		row.querySelector(".header-value").addEventListener("input", checkAndAddRow);
		row.querySelector(".delete-row").addEventListener("click", function () {
			removeRow(row);
		});
	}

	function checkAndAddRow() {
		let lastRow = headersTableBody.lastElementChild;
		let keyInput = lastRow.querySelector(".header-key").value.trim();
		let valueInput = lastRow.querySelector(".header-value").value.trim();

		if (keyInput !== "" || valueInput !== "") {
			addNewRow();
		}
	}

	function removeRow(row) {
		if (headersTableBody.children.length > 1) {
			row.remove();
		}
	}

	// Initially, add one empty row
	addNewRow();
});
document.addEventListener("DOMContentLoaded", function () {
	const headersTableBody = document.getElementById("paramsTableBody");

	function addNewRow() {
		let row = document.createElement("tr");

		row.innerHTML = `
				<td><input type="text" class="header-key" placeholder="Key"></td>
				<td><input type="text" class="header-value" placeholder="Value"></td>
				<td><button class="delete-row">🗑️</button></td>
			`;

		headersTableBody.appendChild(row);

		// Add event listeners
		row.querySelector(".header-key").addEventListener("input", checkAndAddRow);
		row.querySelector(".header-value").addEventListener("input", checkAndAddRow);
		row.querySelector(".delete-row").addEventListener("click", function () {
			removeRow(row);
		});
	}

	function checkAndAddRow() {
		let lastRow = headersTableBody.lastElementChild;
		let keyInput = lastRow.querySelector(".header-key").value.trim();
		let valueInput = lastRow.querySelector(".header-value").value.trim();

		if (keyInput !== "" || valueInput !== "") {
			addNewRow();
		}
	}

	function removeRow(row) {
		if (headersTableBody.children.length > 1) {
			row.remove();
		}
	}

	// Initially, add one empty row
	addNewRow();
});

document.addEventListener("DOMContentLoaded", function () {
	const headersTableBody = document.getElementById("formDataTableBody");

	function addNewRow() {
		let row = document.createElement("tr");

		row.innerHTML = `
				<td><input type="text" class="header-key" placeholder="Key"></td>
				<td><input type="text" class="header-value" placeholder="Value"></td>
				<td><button class="delete-row">🗑️</button></td>
			`;

		headersTableBody.appendChild(row);

		// Add event listeners
		row.querySelector(".header-key").addEventListener("input", checkAndAddRow);
		row.querySelector(".header-value").addEventListener("input", checkAndAddRow);
		row.querySelector(".delete-row").addEventListener("click", function () {
			removeRow(row);
		});
	}

	function checkAndAddRow() {
		let lastRow = headersTableBody.lastElementChild;
		let keyInput = lastRow.querySelector(".header-key").value.trim();
		let valueInput = lastRow.querySelector(".header-value").value.trim();

		if (keyInput !== "" || valueInput !== "") {
			addNewRow();
		}
	}

	function removeRow(row) {
		if (headersTableBody.children.length > 1) {
			row.remove();
		}
	}

	// Initially, add one empty row
	addNewRow();
});
function getRequestHeaders() {
	const headers = {};
	document.querySelectorAll("#headersTableBody tr").forEach(row => {
		const key = row.querySelector(".header-key")?.value.trim();
		const value = row.querySelector(".header-value")?.value.trim();
		if (key && value) { // Only add non-empty keys and values
			headers[key] = value;
		}
	});
	console.log("Extracted Headers:", headers);
	return headers;
}
function getAuthDetails() {
	let authType = $('#authType').val();

	if (authType === 'basicAuth') {
		let username = $('#username').val();
		let password = $('#password').val();

		if (username && password) {
			return {
				"Authorization": "Basic " + btoa(username + ":" + password)
			};
		}
	} else if (authType === 'bearerToken') {
		let token = $('#token').val();

		if (token) {
			return {
				"Authorization": "Bearer " + token
			};
		}
	}
	return {}; // Return an empty object if no authentication is selected
}


$(document).ready(function () {
	console.log("jQuery Loaded - Ready Function Called");

	$('#authType').on('change', function () {
		console.log("Dropdown Changed: " + $(this).val());

		if ($(this).val() === 'basicAuth') {
			$('#authCredentials').fadeIn();
			$('#bearerToken').fadeOut();
			console.log("Showing Username & Password Fields");
		} else if ($(this).val() === 'bearerToken') {
			$('#bearerToken').fadeIn();
			$('#authCredentials').fadeOut();
			console.log("Showing Bearer Token Fields");
		}
		else {
			$('#authCredentials').fadeOut();
			$('#bearerToken').fadeOut();
			console.log("Hiding Username & Password Fields");
		}
	});
});

//code for splitter
document.addEventListener("DOMContentLoaded", () => {
	const splitter = document.querySelector(".splitter");
	let isResizing = false;

	splitter.addEventListener("mousedown", (e) => {
		isResizing = true;
		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", () => {
			isResizing = false;
			document.removeEventListener("mousemove", onMouseMove);
		});
	});

	function onMouseMove(e) {
		if (!isResizing) return;
		const container = document.querySelector(".secondPanel");
		const topTextarea = document.querySelectorAll(".requestContainer")[0];

		const containerRect = container.getBoundingClientRect();
		const newHeight = e.clientY - containerRect.top;
		topTextarea.style.height = `${newHeight}px`;
	}
});
