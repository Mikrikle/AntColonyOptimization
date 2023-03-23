const antColony = new Worker(new URL("./ant-worker.ts", import.meta.url));
antColony.onmessage = (message) => {
  console.log(message.data.result);
};

antColony.postMessage("message");
