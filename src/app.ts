import { CytoscapeService } from "./cytoscape-service";
import { AntWorkerRequest, AntWorkerResponse } from "./message-models";
import "./main.css";

const graphRandomUse = document.getElementById(
  "graph-random-use"
) as HTMLInputElement;
const graphRandomSize = document.getElementById(
  "graph-random-size"
) as HTMLInputElement;
const graphInput = document.getElementById("graph-input") as HTMLInputElement;
const numAnts = document.getElementById("num-ants") as HTMLInputElement;
const numAttempts = document.getElementById("num-attempts") as HTMLInputElement;
const settingsSubmit = document.getElementById(
  "settings-submit"
) as HTMLButtonElement;

const paramAlpha = document.getElementById("param-alpha") as HTMLButtonElement;
const paramBeta = document.getElementById("param-beta") as HTMLButtonElement;
const paramRho = document.getElementById("param-rho") as HTMLButtonElement;
const paramQ = document.getElementById("param-q") as HTMLInputElement;

const cy = new CytoscapeService();
const antColony = new Worker(new URL("./ant-worker.ts", import.meta.url));
const outputLength = document.getElementById("output-length") as HTMLDivElement;
const outputPath = document.getElementById("output-path") as HTMLDivElement;
const attemptsRange = document.getElementById(
  "attempts-range"
) as HTMLInputElement;
const attemptsRangeLabel = document.getElementById(
  "attempts-range-label"
) as HTMLLabelElement;
attemptsRange.disabled = true;

let antData: AntWorkerResponse[] = [];

graphRandomUse.onchange = (e) => {
  graphRandomSize.disabled = !graphRandomUse.checked;
  graphInput.disabled = graphRandomUse.checked;
};

settingsSubmit.onclick = (e) => {
  attemptsRange.disabled = true;
  let graph = graphRandomUse.checked
    ? makeGraphDistances(+graphRandomSize.value)
    : parseGraph();

  antData = [];
  antColony.postMessage(
    new AntWorkerRequest(
      graph,
      +numAnts.value,
      +numAttempts.value,
      +paramAlpha.value,
      +paramBeta.value,
      +paramRho.value,
      +paramQ.value
    )
  );
  cy.drawGraph(graph);
};

antColony.onmessage = (message) => {
  let response = message.data as AntWorkerResponse;
  antData.push(response);
  outputLength.innerText = `${response.bestLength}`;
  outputPath.innerText = `${response.best}`;
  cy.colorizedPath(response.best);
  if (response.final == true) {
    attemptsRangeLabel.textContent = `[ ${antData.length} / ${antData.length} ]`;
    attemptsRange.max = `${antData.length - 1}`;
    attemptsRange.value = `${antData.length - 1}`;
    attemptsRange.disabled = false;
  }
};

attemptsRange.onchange = (event) => {
  attemptsRangeLabel.textContent = `[ ${attemptsRange.value} / ${antData.length} ]`;

  outputLength.innerText = `${antData[+attemptsRange.value].bestLength}`;
  outputPath.innerText = `${antData[+attemptsRange.value].best}`;

  cy.colorizedPath(antData[+attemptsRange.value].best);
};

// тестовый граф
function makeGraphDistances(size: number) {
  let dists: number[][] = Array<number[]>(size);
  for (let i = 0; i < size; ++i) dists[i] = Array<number>(size).fill(0);

  for (let i = 0; i < size; i++)
    for (let j = i + 1; j < size; j++) {
      if (i == j) continue;
      let d = Math.floor(Math.random() * 10 + 1) + 5;
      dists[i][j] = d;
      dists[j][i] = d;
    }
  return dists;
}

function parseGraph() {
  let text = graphInput.value;
  let dists: number[][] = [];

  for (let line of text.split("\n")) {
    dists.push(line.split(" ").map((v) => +v));
  }

  return dists;
}

settingsSubmit.click();
