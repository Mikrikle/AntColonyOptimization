import { AntWorkerRequest, AntWorkerResponse } from "./message-models";

/**
 * Gets random int
 * @param min
 * @param max
 * @returns random int - min & max inclusive
 */
function randomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

class AntColonyOptimization {
  /** Влияние феромона на направление */
  private alpha: number = 3;
  /** Влияние расстояния */
  private beta: number = 2;
  /** коэффициент испарения феромонов */
  private rho: number = 0.01;
  /** Коэффициент выработки феромонов */
  private Q: number = 2;

  /** Расстояние между городами */
  private distances: number[][] = [];
  /** Муравьи */
  private ants: number[][] = [];
  /** Феромоны */
  private pheromones: number[][] = [];

  /** Количество муравьев на каждый город */
  public get numAnts() {
    return this.ants.length;
  }
  /** Количество городов */
  public get numCities() {
    return this.distances.length;
  }

  /**
   * Отправка текущего состояния расчета основному приложению
   * @param final вычисления окончены
   * @param bestTrail лучший маршрут
   * @param bestLength дистанция лучшего маршрута
   */
  sendMessage(final: boolean, bestTrail: number[], bestLength: number): void {
    self.postMessage(
      new AntWorkerResponse(
        final,
        this.ants,
        this.pheromones,
        bestTrail,
        bestLength
      )
    );
  }

  /**
   * Запуск муравьиного алгоритма
   * @param citiesMatrix список расстояний между городами
   * @param antCount количество муравьев в каждом из городов
   */
  run(citiesMatrix: number[][], antCount: number, maxAttempts = 1000): void {
    this.distances = citiesMatrix;
    this.ants = this.initAnts(antCount);
    this.initPheromones();

    console.log("Число городов = " + this.numCities);
    console.log("Число муравьев = " + this.numAnts);

    console.log("Alpha = " + this.alpha);
    console.log("Beta = " + this.beta);
    console.log("Rho = " + this.rho);
    console.log("Q = " + this.Q);

    let bestTrail = this.getBestTrail();
    let bestLength = this.getTrailSummaryDistance(bestTrail);

    console.log("Изначальный лучший путь: " + bestLength);

    let attempt = 0;
    console.log("Запуск алгоритма");
    while (attempt < maxAttempts) {
      this.sendMessage(false, bestTrail, bestLength);

      this.updateAnts();
      this.updatePheromones();

      let currBestTrail = this.getBestTrail();
      let currBestLength = this.getTrailSummaryDistance(currBestTrail);
      if (currBestLength < bestLength) {
        bestLength = currBestLength;
        bestTrail = currBestTrail;
        console.log(
          "Новая лучшая длмна " + bestLength + " число попыток: " + attempt
        );
      }
      attempt++;
    }

    console.log("Лучший путь найден: ");
    console.log(bestTrail);
    console.log("Длина лучшего пути: " + bestLength);

    this.sendMessage(true, bestTrail, bestLength);
  }

  /**
   * Получить расстояние между городами
   * @param cityX город
   * @param cityY другой город
   * @returns расстояение между городами
   */
  public getDistance(cityX: number, cityY: number) {
    return this.distances[cityX][cityY];
  }

  /**
   * Получить общее расстояние маршрута
   * @param trail маршрут
   * @returns общее расстояние
   */
  getTrailSummaryDistance(trail: number[]): number {
    let result = 0;
    for (let i = 0; i < trail.length - 1; ++i)
      result += this.getDistance(trail[i], trail[i + 1]);
    return result;
  }

  /**
   * Получить лучший маршрут
   * @returns лучший маршрут
   */
  getBestTrail(): number[] {
    let bestLength = this.getTrailSummaryDistance(this.ants[0]);
    let indexBestLength = 0;
    for (let k = 1; k < this.ants.length; ++k) {
      let len = this.getTrailSummaryDistance(this.ants[k]);
      if (len < bestLength) {
        bestLength = len;
        indexBestLength = k;
      }
    }
    return [...this.ants[indexBestLength]];
  }

  /**
   * Сгененрировать муравьев
   * @returns список муравьев
   */
  initAnts(antCount: number): number[][] {
    let ants: number[][] = Array<number[]>(antCount);
    for (let k = 0; k < antCount; k++) {
      let start = randomInt(0, this.numCities);
      ants[k] = this.randomTrail(start);
    }
    return ants;
  }

  /**
   * Сгенерировать случайный маршрут
   * @param start начальный город
   * @param numCities количество городов
   * @returns случайный маршрут
   */
  randomTrail(start: number): number[] {
    // Генерируем маршрут через все города
    let trail = [...Array(this.numCities).keys()];

    // Перемешиваем маршрут
    for (let i = 0; i < this.numCities; ++i) {
      let r = randomInt(i, this.numCities);
      let tmp = trail[r];
      trail[r] = trail[i];
      trail[i] = tmp;
    }

    // После перемешивания возвращаем в начало стартовый город
    let idx = trail.findIndex((city) => city == start);
    let temp = trail[0];
    trail[0] = trail[idx];
    trail[idx] = temp;

    return trail;
  }

  /**
   * Инициализировать феромоны
   */
  initPheromones(): void {
    this.pheromones = Array<number[]>(this.numCities);
    for (let i = 0; i < this.numCities; ++i)
      this.pheromones[i] = Array<number>(this.numCities);
    for (let i = 0; i < this.pheromones.length; ++i)
      for (let j = 0; j < this.pheromones[i].length; ++j)
        this.pheromones[i][j] = 0.01;
  }

  /**
   * Обновить маршруты муравьев
   */
  updateAnts(): void {
    // Вероятность перемещения муравья в любой другой город
    let moveProbs = (
      k: number,
      cityX: number,
      visited: boolean[]
    ): number[] => {
      let taueta = Array<number>(this.numCities);
      let sum = 0.0;
      // i - соседний город
      for (let i = 0; i < taueta.length; i++) {
        if (i == cityX)
          taueta[i] = 0.0; // нельзя перемещаться в тот-же самый город
        else if (visited[i] == true)
          taueta[i] = 0.0; // нельзя перемещаться в уже посещенный город
        else {
          // расчет вероятности перемещения и помещение её в адекватные границы
          taueta[i] =
            Math.pow(this.pheromones[cityX][i], this.alpha) *
            Math.pow(1.0 / this.getDistance(cityX, i), this.beta);
          if (taueta[i] < 0.0001) taueta[i] = 0.0001;
          else if (taueta[i] > Number.MAX_VALUE / (this.numCities * 100))
            taueta[i] = Number.MAX_VALUE / (this.numCities * 100);
        }
        sum += taueta[i];
      }

      // вероятности перемещения
      let probs = Array<number>(this.numCities);
      for (let i = 0; i < probs.length; ++i) probs[i] = taueta[i] / sum;
      return probs;
    };

    // Алгоритм выбора города
    let nextCity = (k: number, cityX: number, visited: boolean[]): number => {
      let probs = moveProbs(k, cityX, visited);
      let cumul = Array<number>(probs.length + 1).fill(0);
      for (let i = 0; i < probs.length; i++) cumul[i + 1] = cumul[i] + probs[i];

      let p = Math.random();
      for (let i = 0; i < cumul.length - 1; ++i)
        if (p >= cumul[i] && p < cumul[i + 1]) return i;
      throw new Error("Failure to return valid city in NextCity");
    };

    // Построение нового маршрута для муравья
    let buildTrail = (k: number, start: number): number[] => {
      let trail = Array<number>(this.numCities);
      let visited = Array<boolean>(this.numCities);
      trail[0] = start;
      visited[start] = true;

      for (let i = 0; i < this.numCities - 1; ++i) {
        let cityX = trail[i];
        let next = nextCity(k, cityX, visited);
        trail[i + 1] = next;
        visited[next] = true;
      }
      return trail;
    };

    // каждому муравью строится новый маршрут
    for (let k = 0; k < this.ants.length; ++k) {
      let start = randomInt(0, this.numCities);
      this.ants[k] = buildTrail(k, start);
    }
  }

  /**
   * Обновление количества феромонов
   */
  updatePheromones(): void {
    /** Наличие перехода между городами в маршруте */
    let EdgeInTrail = (
      cityX: number,
      cityY: number,
      trail: number[]
    ): boolean => {
      let idx = trail.findIndex((city) => city == cityX);
      let idy = trail.findIndex((city) => city == cityY);

      if (Math.abs(idx - idy) == 1) return true;
      else if (idx == 0 && idy == trail.length - 1) return true;
      else if (idx == trail.length - 1 && idy == 0) return true;
      return false;
    };

    // цикл обновления феромонов
    for (let i = 0; i < this.pheromones.length; ++i) {
      for (let j = i + 1; j < this.pheromones[i].length; ++j) {
        for (let k = 0; k < this.ants.length; ++k) {
          // длина пути муравья k
          let length = this.getTrailSummaryDistance(this.ants[k]);
          let decrease = (1.0 - this.rho) * this.pheromones[i][j];
          // если муравей переходил из города i в город j
          let increase = 0.0;
          if (EdgeInTrail(i, j, this.ants[k])) increase = this.Q / length;

          // обновление феромонов
          this.pheromones[i][j] = decrease + increase;

          // помещения значения феромонов в допустимые границы
          if (this.pheromones[i][j] < 0.0001) this.pheromones[i][j] = 0.0001;
          else if (this.pheromones[i][j] > 100000.0)
            this.pheromones[i][j] = 100000.0;

          // матрица феромонов симметрична
          this.pheromones[j][i] = this.pheromones[i][j];
        }
      }
    }
  }
}

const antColonyOptimization = new AntColonyOptimization();

self.onmessage = (message: any) => {
  let request = message.data as AntWorkerRequest;
  
  antColonyOptimization.run(
    request.graph,
    request.numAntsPerVertex,
    request.attempts
  );
};
