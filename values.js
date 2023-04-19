import { oddEvenSort, estimateOddEvenSortComparisons } from "./sort.js";

const VALUES = document.querySelector("dl");
const HIDE_UNSELECED = document.querySelector("#hide-unselected");
const SELECT_ALL = document.querySelector("#select-all");
const PICK = document.querySelector("#pick");
const COMPARATOR = document.querySelector("#comparator");
const ESTIMATE = document.querySelector("#estimate");
const PROGRESS = document.querySelector("#progress");
const RESULTS = document.querySelector("#results");

SELECT_ALL.addEventListener(
  "change",
  (e) => {
    if (e.target.checked) {
      VALUES.querySelectorAll(".value-definiton").forEach((el) => {
        el.classList.add("selected");
      });
    } else {
      VALUES.querySelectorAll(".value-definiton").forEach((el) => {
        el.classList.delete("selected");
      });
    }
    renderEstimatedComparisons();
  },
  false
);

VALUES.addEventListener(
  "click",
  (e) => {
    let valueDiv;
    if (e.target.tagName == "DIV") {
      valueDiv = e.target;
    } else if (e.target.parentElement.tagName == "DIV") {
      valueDiv = e.target.parentElement;
    } else {
      return;
    }
    valueDiv.classList.toggle("selected");
    renderEstimatedComparisons();
  },
  false
);

const getSelected = () => {
  return VALUES.querySelectorAll(".selected");
};

const renderEstimatedComparisons = () => {
  const selectedCount = getSelected().length;
  const estimate = Math.abs(estimateOddEvenSortComparisons(selectedCount));
  const niceEstimate = new Intl.NumberFormat("en", {
    maximumFractionDigits: 0,
  }).format(estimate);
  const text = `For selected ${selectedCount} values you may need to compare ${niceEstimate} times`;
  ESTIMATE.innerText = text;
};

const renderSorted = (elements) => {
  RESULTS.innerHTML = "";

  const list = document.createElement("ol");
  elements.forEach((el) => {
    const li = document.createElement("li");
    li.appendChild(el.cloneNode(true));
    list.appendChild(li);
  });

  RESULTS.append(list);
};

HIDE_UNSELECED.addEventListener(
  "change",
  (e) => {
    const selected = getSelected();
    if (selected.length) {
      const selected = VALUES.classList.toggle("hide-selected");
    } else {
      e.target.checked = false;
    }
  },
  false
);

async function compareValues(aOrig, bOrig) {
  const cleanUp = () => {
    COMPARATOR.innerHTML = "";
  };
  /*
    compareFn(a, b) return value        sort order
    > 0                                 sort a after b, e.g. [b, a]
    < 0                                 sort a before b, e.g. [a, b]
    === 0                               keep original order of a and b
    */
  return new Promise((resolve, reject) => {
    const a = aOrig.cloneNode(true);
    const b = bOrig.cloneNode(true);
    a.addEventListener("click", () => {
      resolve(-1);
      cleanUp();
    });
    b.addEventListener("click", () => {
      resolve(1);
      cleanUp();
    });

    const instructions = document.createTextNode("Pick more imortant one:");
    const options = document.createElement("h1");
    options.classList.add("comparator__options");

    options.appendChild(a);
    options.appendChild(b);
    COMPARATOR.appendChild(instructions);
    COMPARATOR.appendChild(options);
  });
}

const sort = () => {
  renderSorted([]);

  const selectedEl = getSelected();

  const list = [];
  selectedEl.forEach((el) => {
    list.push(el.cloneNode(true));
  });

  PROGRESS.max = estimateOddEvenSortComparisons(list.length);

  let progress = 0;
  PROGRESS.value = progress;

  const sorted = oddEvenSort(list, async (a, b) => {
    progress++;
    PROGRESS.value = progress;
    return compareValues(a, b);
  });
  PROGRESS.value = 0;
  return sorted.then(renderSorted);
};

PICK.addEventListener(
  "click",
  () => {
    PICK.disabled = true;
    sort().then(() => {
      PICK.disabled = false;
    });
  },
  false
);
