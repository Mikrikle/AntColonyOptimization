const antColony = new Worker(new URL("./ant-worker.ts", import.meta.url));
const output = document.getElementById("output") as HTMLDivElement;
const state = document.getElementById("state") as HTMLInputElement;
state.disabled = true;

const messages: any = [];
antColony.onmessage = (message) => {
  messages.push(message.data);
  output.innerText = `best ${message.data.best}  length:  ${message.data.bestLength}`;
  if(message.data.final == true){
    state.max = `${messages.length - 1}`;
    state.value = `${messages.length - 1}`;
    state.disabled = false;
  }
};

state.onchange = (event) => {
  output.innerText = `best ${messages[state.value].best}  length:  ${messages[state.value].bestLength}`;
}

antColony.postMessage("start");
