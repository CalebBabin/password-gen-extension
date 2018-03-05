var characters = {
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
    1,2,3,4,5,6,7,8,9,0
  ],
  symbols:[
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

var defaults = {
  settings: {
    length: 10,
    c: ["letters", "letters_upper", "numbers", "symbols"]
  },
  persistance: {
    c: true,
    length: true
  }
};

var options = defaults.settings;
var persistance = defaults.persistance;

function r (max) {
  return Math.floor(Math.random()*max);
}

function getOne (arr) {
  return arr[r(arr.length)];
}

function generate () {
  if (options.c.length === 0) return;
  var string = "";
  for (var i = 0; i < options.length; i++) {
    string += getOne(
      characters[options.c[r(options.c.length)]]
    )
  };
  document.getElementById("password").innerHTML = string;

  
  var pushSettings = {};
  for (var prop in persistance) {
    if (persistance[prop]) pushSettings[prop] = options[prop];
  }
  chrome.storage.sync.set({ 
    key: {
      settings: pushSettings,
      persistance: persistance
    }
  }, function () {
    console.log(options);
  });

}

document.getElementById("generate").addEventListener("click", generate);

document.getElementById("plengthslider").addEventListener("input", sliderHandler);
function sliderHandler () {
  options.length = this.value;
  generate();
  document.getElementById("plengthnumber").value = this.value;
}

document.getElementById("plengthnumber").addEventListener("input", numberHandler);

function numberHandler () {
  if (this.value > 1028) this.value = 1028;
  options.length = this.value;
  document.getElementById("plengthslider").value = this.value;
  generate();
}

document.getElementById("letters").addEventListener("change", checkbox);
document.getElementById("letters_upper").addEventListener("change", checkbox);
document.getElementById("numbers").addEventListener("change", checkbox);
document.getElementById("symbols").addEventListener("change", checkbox);

function checkbox () {
  var index = options.c.indexOf(this.id);

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

document.getElementById("password").addEventListener("click", function () {
  if (document.selection) {
    var range = document.body.createTextRange();
    range.moveToElementText(this);
    range.select();
  } else if (window.getSelection) {
    var range = document.createRange();
    range.selectNode(this);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  }
})


chrome.storage.sync.get('key', function (data) {
    console.log(data);
    if (!data || !data.key) data = {key: defaults}
    if (data && data.key && data.key.persistance && data.key.settings) {
      data = data.key;
      options = data.settings;
    
      for (var i = 0; i < options.c.length; i++) {
        document.getElementById(options.c[i]).checked = true;
      }

      document.getElementById("plengthslider").value = options.length;
      document.getElementById("plengthnumber").value = options.length;
    
    }
    settingsLoaded();
  });



function settingsLoaded() {
  var eles = document.getElementsByClassName("hide-before-load");
  for (let i = 0; i < eles.length; i++) {
    eles[i].classList.remove("hide-before-load");
  }
  generate();
}