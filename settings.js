const writeSlider = document.getElementById("slider-copy-time");
const writeSliderLabel = document.getElementById("slider-copy-time-label");

var writeCopyDelay;

writeSlider.oninput = () => {
  writeCopyDelay = writeSlider.value;
  updateSlider();
  chrome.storage.sync.set({writeCopyDelay: writeCopyDelay}, () => {
    console.log("Saved write copy delay in sync storage: " + writeCopyDelay);
  });
};

function updateSlider() {
  writeSliderLabel.innerText = writeCopyDelay + "ms";
}

chrome.storage.sync.get(["writeCopyDelay"], (result) => {
  if (result.writeCopyDelay) {
    writeCopyDelay = result.writeCopyDelay;
    writeSlider.value = writeCopyDelay;
    updateSlider();
  }
});

/* ADVANCED SETTINGS */

const textAreaQuerySelector = document.getElementById("querySelector");
const mcq1 = document.getElementById("mcQuery");
const mcq2 = document.getElementById("mcQuery2");

document.querySelectorAll(".btn-load").forEach(item => {
  item.onclick = () => {
    textAreaQuerySelector.textContent = loadQuery(item.dataset.load);
    textAreaQuerySelector.value = loadQuery(item.dataset.load);
    updateQuery();

    if (item.dataset.load == "learn") {
      mcq1.textContent = ".ajefojz";
      mcq1.value = ".ajefojz";
      mcq2.textContent = "section .FormattedText";
      mcq2.value = "section .FormattedText";
      updateMCQ();
    } else if (item.dataset.load == "live") {
      mcq1.textContent = ".StudentAnswerOptions";
      mcq1.value = ".StudentAnswerOptions";
      mcq2.textContent = ".UIButton";
      mcq2.value = ".UIButton";
      updateMCQ();
    }
  }
});

function loadQuery(activity) {
  switch (activity) {
    case "learn":
      return ".FormattedText > *";
    case "write":
      return ".WriteTextAttribute > * > *";
    case "spell":
      return ".SpellQuestionView-inputPrompt--plain";
    case "match":
      return ".FormattedText";
    case "live":
      return ".StudentPrompt-text";
  }
}

textAreaQuerySelector.onchange = updateQuery;
mcq1.onchange = updateMCQ;
mcq2.onchange = updateMCQ;

chrome.storage.sync.get(["querySelector"], (result) => {
  if (result == null) return;
  textAreaQuerySelector.value = result.querySelector;
});

chrome.storage.sync.get(["mcq1"], (result) => {
  if (result == null) return;
  mcq1.value = result.mcq1;
});

chrome.storage.sync.get(["mcq2"], (result) => {
  if (result == null) return;
  mcq2.value = result.mcq2;
});

function updateQuery() {
  chrome.storage.sync.set({querySelector: textAreaQuerySelector.value});
}

function updateMCQ() {
  chrome.storage.sync.set({mcq1: mcq1.value});
  chrome.storage.sync.set({mcq2: mcq2.value});
}