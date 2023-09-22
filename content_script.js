var loop;

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.greeting === "fetchTerms") {
      var out = [];
      document.querySelectorAll(".SetPageTerm .SetPageTerm-smallSide .TermText").forEach((e, i) => {
        out[i] = e.textContent;
      })
      sendResponse(out);
    }
    if (request.greeting === "fetchDefs") {
      var out = [];
      document.querySelectorAll(".SetPageTerm .SetPageTerm-largeSide .TermText").forEach((e, i) => {
        out[i] = e.textContent;
      })
      sendResponse(out);
    }

    if (request.greeting === "start") {
      if (document.querySelector(request.mcQuery) != null) {
        learnMCQ(request.query, request.mcQuery, request.mcQuery2);
      } else {
        copyLoop(request.query);
      }
    }

    if (request.greeting === "match") {
      match(request.query);
    }

    if (request.greeting === "stopAll") {
      if (loop != null) clearInterval(loop);
    }
  }
);

var data;
function getData() {
  chrome.runtime.sendMessage({greeting: "getData"}, (response) => {
    data = response;
  })
}
getData();

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

function find(search) {
  var text = getTerm(search);
  if (text == null) text = getDef(search);
  if (text == null) text = getTerm(search + " ");
  if (text == null) text = getDef(search + " ");
  if (text.slice(-1) == " ") {
    return text.slice(0, -1);
  }
  return text;
}

function copyLoop(query) {
  getData();

  chrome.runtime.sendMessage({greeting: "copyDelay"}, (response) => {
    loop = setInterval(() => {
      try {
        var text = find(document.querySelector(query).textContent);
        if (navigator.clipboard.readText() != text) {
          navigator.clipboard.writeText(text);
        }
      } catch (e) {}
    }, response);
  })
}

function learnMCQ(query, mcQuery, mcQuery2) {
  getData();

  chrome.runtime.sendMessage({greeting: "copyDelay"}, (response) => {
    loop = setInterval(() => {
      try {
        var text = find(document.querySelector(query).textContent);
        if (document.querySelector(mcQuery) != null) {
          var options = [...document.querySelector(mcQuery).querySelectorAll(mcQuery2)];
          for (let i = 0; i < options.length; i++) {
            if (options[i].textContent == text && !options[i].classList.contains("correctAnswer")) {
              options[i].classList.add("correctAnswer");
              options[i].style.color = "limegreen";
              options[i].click();
              break;
            }
          }
        } else {
          if (navigator.clipboard.readText() != text) {
            navigator.clipboard.writeText(text);
          }
        }
      } catch (e) {}
    }, response);
  })
}

function match(query) {
  getData();

  loop = setInterval(() => {
    if (document.querySelector(query) != null) {
      const cards = [...document.querySelectorAll(query)];
      var color = 0;
      for (let i = 0; i < cards.length; i++) {
        if (!cards[i].classList.contains("quizletHackerColored")) {
          cards[i].style.color = "hsl(" + color + "deg,100%,50%)";
          cards[i].classList.add("quizletHackerColored");
          
          var text = find(cards[i].textContent);
          for (let j = 0; j < cards.length; j++) {
            if (cards[j].textContent === text) {
              cards[j].style.color = "hsl(" + color + "deg,100%,50%)";
              cards[j].classList.add("quizletHackerColored");
              break;
            }
          }
    
          color += 720/cards.length;
        }
      }
      clearInterval(matchLoop);
    }
  }, 100);
}