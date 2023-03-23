import { CytoscapeService } from "./cytoscape-service";
import { AntWorkerRequest, AntWorkerResponse } from "./message-models";

const antColony = new Worker(new URL("./ant-worker.ts", import.meta.url));
const output = document.getElementById("output") as HTMLDivElement;
const attemptsRange = document.getElementById("attempts-range") as HTMLInputElement;
attemptsRange.disabled = true;

const antData: AntWorkerResponse[] = [];
antColony.onmessage = (message) => {
  let response = message.data as AntWorkerResponse;
  antData.push(response);
  output.innerText = `best ${response.best}  length:  ${response.bestLength}`;
  cy.colorizedGraph(response.pheromones);
  if (response.final == true) {
    attemptsRange.max = `${antData.length - 1}`;
    attemptsRange.value = `${antData.length - 1}`;
    attemptsRange.disabled = false;
  }
};

attemptsRange.onchange = (event) => {
  output.innerText = `best ${antData[+attemptsRange.value].best}  length:  ${
    antData[+attemptsRange.value].bestLength
  }`;

  cy.colorizedGraph(antData[+attemptsRange.value].pheromones);
};

let graph = makeGraphDistances(14);
antColony.postMessage(new AntWorkerRequest(graph, 4, 1000));

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

let cy = new CytoscapeService();
cy.drawGraph(graph);

document.onclick = () => {
  let i = 0;
  let interval = setInterval(() => {
    i += 1;
    if(i >= antData.length){
      clearInterval(interval);
      return;
    }
    attemptsRange.value = `${i}`;
    output.innerText = `best ${antData[i].best}  length:  ${antData[i].bestLength}`;
    cy.colorizedGraph(antData[i].pheromones);
  }, antData.length / 100);
}