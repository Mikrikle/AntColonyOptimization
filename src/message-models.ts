export class AntWorkerResponse {
  constructor(
    public final: boolean,
    public ants: number[][],
    public pheromones: number[][],
    public best: number[],
    public bestLength: number
  ) {}
}

export class AntWorkerRequest {
    constructor(
      public graph: number[][],
      public numAntsPerVertex: number,
      public attempts: number,

      public paramAlpha: number,
      public paramBeta: number,
      public paramRho: number,
      public paramQ : number
    ) {}
  }
