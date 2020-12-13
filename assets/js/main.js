import countriesList from "../../postal-codes.js";

const firstStep = document.getElementsByClassName("first-step")[0];
const secondStep = document.getElementsByClassName("second-step")[0];
const thirdStep = document.getElementsByClassName("third-step")[0];

const userData = {
	city: document.getElementsByName("city")[0],
	country: document.getElementsByName("country")[0],
	address: document.getElementsByName("address")[0],
	postalCode: document.getElementsByName("postalCode")[0],
};
const shippingData = {
	shippingCountry: document.getElementsByName("shippingCountry")[0],
	shippingCity: document.getElementsByName("shippingCity")[0],
	shippingAddress: document.getElementsByName("shippingAddress")[0],
	shippingPostalCode: document.getElementsByName("shippingPostalCode")[0],
};

const { city, country, address, postalCode } = userData;
const {
	shippingCountry,
	shippingCity,
	shippingAddress,
	shippingPostalCode,
} = shippingData;

for (let key in userData) {
	userData[key].addEventListener("input", (e) => copyShippingData(e));
}

let shippingCheckbox = document.getElementsByName("shippingCheckbox")[0];
shippingCheckbox.addEventListener("click", handleCheckbox);

document
	.getElementsByClassName("first-step__button")[0]
	.addEventListener("click", firstStepValidation);

const secondStepButtons = document.getElementsByClassName(
	"second-step__buttons"
);
for (let i = 0; i < secondStepButtons.length; i++) {
	secondStepButtons[i].addEventListener("click", (e) =>
		secondStepValidation(e)
	);
}

const thirdStepButtons = document.getElementsByClassName("third-step__buttons");
for (let i = 0; i < thirdStepButtons.length; i++) {
	thirdStepButtons[i].addEventListener("click", (e) => thirdStepValidation(e));
}

const creditCard = document.getElementsByName("credit-card-number")[0];
const expDate = document.getElementsByName("expDate")[0];

creditCard.addEventListener("input", (e) => addCharsToValue(e));
expDate.addEventListener("input", (e) => addCharsToValue(e));

function addCharsToValue(e) {
	let { name, value } = e.target;
	if (name === "credit-card-number") {
		const cardType = detectCardType(value);
		if (cardType) {
			const imgTag = document.createElement("img");
			imgTag.src = `assets/img/${cardType}.png`;
			imgTag.classList.add("card-type-img");
			creditCard.parentNode.appendChild(imgTag);
		} else {
			removeErrorNode("card-type-img");
		}

		creditCard.value = value
			.replace(/[^\dA-Z]/g, "")
			.replace(/(.{4})/g, "$1 ")
			.trim();
	} else if (name === "expDate") {
		expDate.value = value
			.replace(/^(\d\d)(\d)$/g, "$1/$2")
			.replace(/^(\d\d\/\d\d)(\d+)$/g, "$1/$2")
			.replace(/[^\d\/]/g, "");
	}
}

function detectCardType(number) {
	var re = {
		electron: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,
		maestro: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
		visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
		mastercard: /^5[1-5][0-9]{14}$/,
		amex: /^3[47][0-9]{13}$/,
	};
	const trimmed = number.replace(/\s/g, "");

	for (var key in re) {
		if (re[key].test(+trimmed)) {
			return key;
		}
	}
}

function copyShippingData(elm) {
	if (shippingCheckbox.checked) {
		const { name, value } = elm.target;
		shippingData[
			`shipping${name.charAt(0).toUpperCase() + name.slice(1)}`
		].value = value;
	}
}

function handleCheckbox() {
	if (shippingCheckbox.checked) {
		shippingCountry.disabled = true;
		shippingCity.disabled = true;
		shippingAddress.disabled = true;
		shippingPostalCode.disabled = true;

		shippingCountry.value = country.value;
		shippingCity.value = city.value;
		shippingAddress.value = address.value;
		shippingPostalCode.value = postalCode.value;
	} else {
		shippingCountry.disabled = false;
		shippingCity.disabled = false;
		shippingAddress.disabled = false;
		shippingPostalCode.disabled = false;
	}
}

function firstStepValidation() {
	let isFormValid = true;
	let firstName = document.getElementsByName("firstName")[0];
	let lastName = document.getElementsByName("lastName")[0];

	firstName.style.border = "1px solid #adadad";
	lastName.style.border = "1px solid #adadad";

	const inputNodes = [firstName, lastName];

	for (let key in userData) {
		userData[key].style.border = "1px solid #adadad";
		inputNodes.push(userData[key]);
		if (
			key === "postalCode" &&
			postalCode.value &&
			country.value &&
			!checkPostalCode(userData[key], "postalCode")
		) {
			isFormValid = false;
		}
	}
	for (let key in shippingData) {
		shippingData[key].style.border = "1px solid #adadad";
		inputNodes.push(shippingData[key]);
		if (
			!shippingCheckbox.checked &&
			key === "shippingPostalCode" &&
			shippingCountry.value &&
			shippingPostalCode.value &&
			!checkPostalCode(shippingData[key], "shippingPostalCode")
		) {
			isFormValid = false;
		}
	}

	inputNodes.map((node) => {
		isEmpty(node) ? "" : (isFormValid = false);
	});
	if (isFormValid) {
		firstStep.style.display = "none";
		secondStep.style.display = "block";
		removeErrorNode("postalCode");
		removeErrorNode("shippingPostalCode");
	}
}

function secondStepValidation(elm) {
	if (elm.target.dataset.direction === "previous") {
		firstStep.style.display = "block";
		secondStep.style.display = "none";
	} else {
		let isFormValid = true;
		const inputNodes = [
			document.getElementsByName("email")[0],
			document.getElementsByName("password")[0],
			document.getElementsByName("repeatPassword")[0],
			document.getElementsByName("package"),
		];
		const [email, password, repeatPassword] = inputNodes;

		inputNodes.map((node) => {
			if (node.length) {
				isFormValid = checkRadioInput(node);
			} else {
				node.style.border = "1px solid #adadad";
				isEmpty(node) ? "" : (isFormValid = false);
			}
		});
		if (
			password.value &&
			repeatPassword.value &&
			!checkPasswords(password, repeatPassword)
		) {
			isFormValid = false;
		}
		if (email.value && !checkEmail(email)) {
			isFormValid = false;
		}
		if (isFormValid) {
			secondStep.style.display = "none";
			thirdStep.style.display = "block";
		}
	}
}

function thirdStepValidation(elm) {
	if (elm.target.dataset.direction === "previous") {
		secondStep.style.display = "block";
		thirdStep.style.display = "none";
	} else {
		let isFormValid = true;
		const inputNodes = [
			document.getElementsByName("credit-card-number")[0],
			document.getElementsByName("owner")[0],
			document.getElementsByName("cvc")[0],
			document.getElementsByName("expDate")[0],
		];
		const [card, owner, cvc, expDate] = inputNodes;
		inputNodes.map((node) => {
			node.style.border = "1px solid #adadad";
			isEmpty(node) ? "" : (isFormValid = false);
		});
		if (
			card.value &&
			owner.value &&
			cvc.value &&
			expDate.value &&
			(!checkInputLength(card, 19) ||
				!checkInputLength(owner, 100) ||
				!checkInputLength(cvc, 4) ||
				!checkInputLength(expDate, 5))
		) {
			isFormValid = false;
		}
		if (!checkExpDate(expDate)) {
			isFormValid = false;
		}
		if (isFormValid) {
			thirdStep.style.display = "none";
			document.getElementsByClassName(
				"registration__successful"
			)[0].style.display = "block";
		}
	}
}

function removeErrorNode(className) {
	const errorNode = document.getElementsByClassName(className)[0];
	if (errorNode) {
		errorNode.remove();
	}
}

function isEmpty(elm) {
	if (!elm.value) {
		elm.style.border = "2px solid #ff0000";
		return false;
	}
	return true;
}

function checkPostalCode(postalCode, type) {
	removeErrorNode(type);

	let selectedItem;
	if (type === "postalCode") {
		selectedItem = country.querySelector(`[value=${country.value}]`);
	} else if (type === "shippingPostalCode") {
		selectedItem = shippingCountry.querySelector(
			`[value=${shippingCountry.value}]`
		);
	}
	let result = postalCode.value.match(selectedItem.dataset.regexpression);

	if (!result) {
		let errorMessage = document.createElement("span");
		errorMessage.classList.add("error", type);
		errorMessage.innerText = "Invalid postal code";
		postalCode.parentNode.appendChild(errorMessage);
		postalCode.style.border = "2px solid #ff0000";
		return false;
	}
	return true;
}

function checkRadioInput(radioButtons) {
	let isRadioChecked = false;
	const radioLabels = document.getElementsByClassName("radio-labels");

	for (let i = 0; i < radioButtons.length; i++) {
		if (radioButtons[i].checked) {
			isRadioChecked = true;
		}
	}

	for (let i = 0; i < radioLabels.length; i++) {
		radioLabels[i].style.color = "#000";
		if (!isRadioChecked) {
			radioLabels[i].style.color = "#ff0000";
		}
	}
	return isRadioChecked;
}

function checkPasswords(first, second) {
	removeErrorNode("password-error");
	let errorMessage = document.createElement("span");
	errorMessage.classList.add("error", "password-error");
	if (first.value.length < 6) {
		errorMessage.innerText = "Password must have at least 6 characters";
		first.parentNode.appendChild(errorMessage);
		first.style.border = "2px solid #ff0000";
		return false;
	}
	if (first.value !== second.value) {
		errorMessage.innerText = "Passwords are not equal";
		second.parentNode.appendChild(errorMessage);
		first.style.border = "2px solid #ff0000";
		second.style.border = "2px solid #ff0000";
		return false;
	}
	return true;
}

function checkEmail(email) {
	removeErrorNode("email-error");
	let errorMessage = document.createElement("span");
	errorMessage.classList.add("error", "email-error");
	var mailFormat = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
	if (!email.value.match(mailFormat)) {
		errorMessage.innerText = "Invalid Email type";
		email.parentNode.appendChild(errorMessage);
		email.style.border = "2px solid #ff0000";
		return false;
	}
	return true;
}

function checkInputLength(elm, length) {
	removeErrorNode("length-error");
	if (elm.value.length > length) {
		let errorMessage = document.createElement("span");
		errorMessage.classList.add("error", "length-error");
		errorMessage.innerText = `Maximum length is ${length} characters`;
		elm.parentNode.appendChild(errorMessage);
		elm.style.border = "2px solid #ff0000";
		return false;
	}
	return true;
}

function checkExpDate(exp) {
	removeErrorNode("expDate-error");

	let currentMonth = new Date().getMonth() + 1;
	let currentYear = new Date().getFullYear().toString().slice(2);
	const dates = exp.value.split("/");

	if (
		+dates[0] > 12 ||
		+dates[0] < 1 ||
		+dates[1] < +currentYear ||
		(+dates[1] === +currentYear && +dates[0] < +currentMonth)
	) {
		let errorMessage = document.createElement("span");
		errorMessage.classList.add("error", "expDate-error");
		errorMessage.innerText = `Invalid Date`;
		exp.parentNode.appendChild(errorMessage);
		return false;
	}
	return true;
}

function addCountries() {
	const selectsOptions = countriesList.map(
		(country) =>
			`<option value=${country.Country} data-format=${country.Format} data-regexpression=${country.Regex}>${country.Country}</option>`
	);

	country.innerHTML += selectsOptions;
	shippingCountry.innerHTML += selectsOptions;
}

addCountries();
