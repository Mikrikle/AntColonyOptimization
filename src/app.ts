import { AntWorkerRequest, AntWorkerResponse } from "./message-models";

const antColony = new Worker(new URL("./ant-worker.ts", import.meta.url));
const output = document.getElementById("output") as HTMLDivElement;
const state = document.getElementById("state") as HTMLInputElement;
state.disabled = true;

const messages: AntWorkerResponse[] = [];
antColony.onmessage = (message) => {
  let response = message.data as AntWorkerResponse;
  messages.push(response);
  output.innerText = `best ${response.best}  length:  ${response.bestLength}`;
  if (response.final == true) {
    state.max = `${messages.length - 1}`;
    state.value = `${messages.length - 1}`;
    state.disabled = false;
  }
};

state.onchange = (event) => {
  output.innerText = `best ${messages[+state.value].best}  length:  ${
    messages[+state.value].bestLength
  }`;
};

antColony.postMessage(new AntWorkerRequest(makeGraphDistances(20), 4, 2000));

// тестовый граф
function makeGraphDistances(size: number) {
  let dists: number[][] = Array<number[]>(size);
  for (let i = 0; i < size; ++i) dists[i] = Array<number>(size).fill(0);

  for (let i = 0; i < size; i++)
    for (let j = i + 1; j < size; j++) {
      if (i == j) continue;
      let d = i * 1;
      dists[i][j] = d;
      dists[j][i] = d;
    }
  return dists;
}
