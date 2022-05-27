const characters = {
	letters: [
		"a",
		"b",
		"c",
		"d",
		"e",
		"f",
		"g",
		"h",
		"i",
		"j",
		"k",
		"l",
		"m",
		"n",
		"o",
		"p",
		"q",
		"r",
		"s",
		"t",
		"u",
		"v",
		"w",
		"x",
		"y",
		"z"
	],
	letters_upper: [
		"A",
		"B",
		"C",
		"D",
		"E",
		"F",
		"G",
		"H",
		"I",
		"J",
		"K",
		"L",
		"M",
		"N",
		"O",
		"P",
		"Q",
		"R",
		"S",
		"T",
		"U",
		"V",
		"W",
		"X",
		"Y",
		"Z"
	],
	numbers: [
		1, 2, 3, 4, 5, 6, 7, 8, 9, 0
	],
	symbols: [
		"@",
		"_",
		".",
		"-",
		"!",
		"?",
		"$",
		"&",
		"#",
		"%",
	]
};

if (typeof chrome === "undefined") chrome = browser;

const defaults = {
	settings: {
		length: 10,
		c: ["letters", "letters_upper", "numbers", "symbols"]
	},
	persistance: {
		c: true,
		length: true
	}
};

let options = defaults.settings;
let persistance = defaults.persistance;

function r(max) {
	return Math.floor(Math.random() * max);
}

function getOne(arr) {
	return arr[r(arr.length)];
}

function generate() {
	if (options.c.length === 0) return;
	let string = "";
	let availableCharacters = [];
	for (let i = 0; i < options.c.length; i++) {
		availableCharacters = [...availableCharacters, ...characters[options.c[i]]];
	}
	if ('crypto' in window) {
		string = Array.from(crypto.getRandomValues(new Uint8Array(options.length))).map(x => availableCharacters[x % availableCharacters.length]).join("");
	} else {
		for (let i = 0; i < options.length; i++) {
			string += getOne(availableCharacters)
		};
	}
	document.getElementById("password").innerText = string;

	if (keyboardTimeout < Date.now() - 1000) selectPassword();

	let pushSettings = {};
	for (let prop in persistance) {
		if (persistance[prop]) pushSettings[prop] = options[prop];
	}
	chrome.storage.sync.set({
		key: {
			settings: pushSettings,
			persistance: persistance
		}
	});

}

document.getElementById("generate").addEventListener("click", generate);

document.getElementById("plengthslider").addEventListener("input", sliderHandler);
function sliderHandler() {
	options.length = this.value;
	generate();
	document.getElementById("plengthnumber").value = this.value;
}

document.getElementById("plengthnumber").addEventListener("input", numberHandler);

function numberHandler() {
	if (this.value > 1028) this.value = 1028;
	options.length = this.value;
	document.getElementById("plengthslider").value = this.value;
	generate();
}

document.getElementById("letters").addEventListener("change", checkbox);
document.getElementById("letters_upper").addEventListener("change", checkbox);
document.getElementById("numbers").addEventListener("change", checkbox);
document.getElementById("symbols").addEventListener("change", checkbox);

function checkbox() {
	let index = options.c.indexOf(this.id);

	if (this.checked) {
		if (index < 0) {
			options.c.push(this.id);
		}
	} else {
		if (index >= 0) {
			options.c.splice(index, 1);
		}
	}
	generate();
}

document.getElementById("password").addEventListener("click", selectPassword)

function selectPassword() {
	if (document.selection) {
		let range = document.body.createTextRange();
		range.moveToElementText(document.getElementById("password"));
		range.select();
	} else if (window.getSelection) {
		let range = document.createRange();
		range.selectNode(document.getElementById("password"));
		window.getSelection().removeAllRanges();
		window.getSelection().addRange(range);
	}
}

window.addEventListener("keyup", updateKeyTime);
window.addEventListener("keydown", updateKeyTime);
window.addEventListener("keypress", updateKeyTime);

let keyboardTimeout = 0;
function updateKeyTime() {
	keyboardTimeout = Date.now();
}

chrome.storage.sync.get('key', function (data) {
	if (!data || !data.key) data = { key: defaults }
	if (data && data.key && data.key.persistance && data.key.settings) {
		data = data.key;
		options = data.settings;

		for (let i = 0; i < options.c.length; i++) {
			document.getElementById(options.c[i]).checked = true;
		}

		document.getElementById("plengthslider").value = options.length;
		document.getElementById("plengthnumber").value = options.length;

	}
	settingsLoaded();
});



function settingsLoaded() {
	const eles = document.getElementsByClassName("hide-before-load");
	for (let i = 0; i < eles.length; i++) {
		eles[i].classList.remove("hide-before-load");
	}
	generate();

	selectPassword();
}