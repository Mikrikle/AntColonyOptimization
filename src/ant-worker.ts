class AntColonyOptimization {}

const antColonyOptimization = new AntColonyOptimization();

self.onmessage = (message: any) => {
  // run ant
  self.postMessage({
    result: "ant colony service works",
  });
};
