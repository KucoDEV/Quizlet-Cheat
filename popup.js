const scanBtn = document.querySelector(".scan-btn");
const scanTxt = document.querySelector(".scan-txt");

var data = {terms: [], defs: []};

function setUp() {
  chrome.storage.sync.get(["terms"], (result) => {
    data.terms = result.terms;
    console.log("Termes chargées ! (" + data.terms.length + ")");
    scanTxt.textContent = "Données chargées ! (" + data.terms.length + " termes)";
  });
  chrome.storage.sync.get(["defs"], (result) => {
    data.defs = result.defs;
    console.log("Définitions chargées ! (" + data.defs.length + ")");
  });
}

setUp();

scanBtn.onclick = () => {
  scanTxt.textContent = "Scan...";

  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "fetchTerms"}, (response) => {
      setTerms(response);
      console.log("TERMS: " + response);
      if (data.terms) {
        scanTxt.textContent = "Scan terminé ! (" + data.terms.length + " termes)";
      } else scanTxt.textContent = "Erreur! Échec de l'analyse";
    });
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "fetchDefs"}, (response) => {
      setDefs(response);
      console.log("DÉFINITIONS: " + response);
    });
  });
}

function setTerms(terms) {
  data.terms = terms;
  chrome.storage.sync.set({terms: terms}, () => {
    console.log("Terms saved in sync storage!");
  });
}

function setDefs(defs) {
  data.defs = defs;
  chrome.storage.sync.set({defs: defs}, () => {
    console.log("Definitions saved in sync storage!");
  });
}

function getTerm(search) {
  for (let i = 0; i < data.defs.length; i++) {
    if (data.defs[i] == search) {
      return data.terms[i];
    }
  }
  return null;
}

function getDef(search) {
  for (let i = 0; i < data.terms.length; i++) {
    if (data.terms[i] == search) {
      return data.defs[i];
    }
  }
  return null;
}

/* QUIZLET ACTIVITIES */
const btnStop = document.getElementById("btn-stop");
const btnStart = document.getElementById("btn-start");

const btnMatch = document.getElementById("btn-match");

function sendMessage(message) {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: message});
  });
}

btnStop.onclick = () => { sendMessage("stopAll") };
btnStart.onclick = () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "start", query: document.getElementById("querySelector").value, mcQuery: document.getElementById("mcQuery").value, mcQuery2: document.getElementById("mcQuery2").value});
  });
};

btnMatch.onclick = () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "match", query: document.getElementById("querySelector").value});
  });
};

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.greeting === "getTerm") {
      sendResponse(getTerm(request.term));
    }
    if (request.greeting === "getData") {
      sendResponse(data);
    }
    if (request.greeting === "copyDelay") {
      sendResponse(document.getElementById("slider-copy-time").value);
    }
  }
);