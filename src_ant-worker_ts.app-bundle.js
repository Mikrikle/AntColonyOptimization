/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!***************************!*\
  !*** ./src/ant-worker.ts ***!
  \***************************/

/**
 * Gets random int
 * @param min
 * @param max
 * @returns random int - min & max inclusive
 */
function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
// тестовый граф
function makeGraphDistances(size) {
    let dists = Array(size);
    for (let i = 0; i < size; ++i)
        dists[i] = Array(size).fill(0);
    for (let i = 0; i < size; i++)
        for (let j = i + 1; j < size; j++) {
            if (i == j)
                continue;
            let d = i * 1;
            dists[i][j] = d;
            dists[j][i] = d;
        }
    return dists;
}
class AntColonyOptimizationSettings {
}
class AntColonyOptimization {
    constructor() {
        /** Влияние феромона на направление */
        this.alpha = 3;
        /** Влияние расстояния */
        this.beta = 2;
        /** коэффициент испарения феромонов */
        this.rho = 0.01;
        /** Коэффициент выработки феромонов */
        this.Q = 2;
        /** Расстояние между городами */
        this.distances = [];
        /** Муравьи */
        this.ants = [];
        /** Феромоны */
        this.pheromones = [];
    }
    /** Количество муравьев на каждый город */
    get numAnts() {
        return this.ants.length;
    }
    /** Количество городов */
    get numCities() {
        return this.distances.length;
    }
    /**
     * Запуск муравьиного алгоритма
     * @param citiesMatrix список расстояний между городами
     * @param antCount количество муравьев в каждом из городов
     */
    run(citiesMatrix, antCount, maxTime = 1000) {
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
        let time = 0;
        console.log("Запуск алгоритма");
        while (time < maxTime) {
            this.updateAnts();
            this.updatePheromones();
            let currBestTrail = this.getBestTrail();
            let currBestLength = this.getTrailSummaryDistance(currBestTrail);
            if (currBestLength < bestLength) {
                bestLength = currBestLength;
                bestTrail = currBestTrail;
                console.log("Новая лучшая длмна " + bestLength + " число попыток: " + time);
            }
            time++;
        }
        console.log("Лучший путь найден: ");
        console.log(bestTrail);
        console.log("Длина лучшего пути: " + bestLength);
    }
    /**
     * Получить расстояние между городами
     * @param cityX город
     * @param cityY другой город
     * @returns расстояение между городами
     */
    getDistance(cityX, cityY) {
        return this.distances[cityX][cityY];
    }
    /**
     * Получить общее расстояние маршрута
     * @param trail маршрут
     * @returns общее расстояние
     */
    getTrailSummaryDistance(trail) {
        let result = 0;
        for (let i = 0; i < trail.length - 1; ++i)
            result += this.getDistance(trail[i], trail[i + 1]);
        return result;
    }
    /**
     * Получить лучший маршрут
     * @returns лучший маршрут
     */
    getBestTrail() {
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
    initAnts(antCount) {
        let ants = Array(antCount);
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
    randomTrail(start) {
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
    initPheromones() {
        this.pheromones = Array(this.numCities);
        for (let i = 0; i < this.numCities; ++i)
            this.pheromones[i] = Array(this.numCities);
        for (let i = 0; i < this.pheromones.length; ++i)
            for (let j = 0; j < this.pheromones[i].length; ++j)
                this.pheromones[i][j] = 0.01;
    }
    /**
     * Обновить маршруты муравьев
     */
    updateAnts() {
        // Вероятность перемещения муравья в любой другой город
        let moveProbs = (k, cityX, visited) => {
            let taueta = Array(this.numCities);
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
                    if (taueta[i] < 0.0001)
                        taueta[i] = 0.0001;
                    else if (taueta[i] > Number.MAX_VALUE / (this.numCities * 100))
                        taueta[i] = Number.MAX_VALUE / (this.numCities * 100);
                }
                sum += taueta[i];
            }
            // вероятности перемещения
            let probs = Array(this.numCities);
            for (let i = 0; i < probs.length; ++i)
                probs[i] = taueta[i] / sum;
            return probs;
        };
        // Алгоритм выбора города
        let nextCity = (k, cityX, visited) => {
            let probs = moveProbs(k, cityX, visited);
            let cumul = Array(probs.length + 1).fill(0);
            for (let i = 0; i < probs.length; i++)
                cumul[i + 1] = cumul[i] + probs[i];
            let p = Math.random();
            for (let i = 0; i < cumul.length - 1; ++i)
                if (p >= cumul[i] && p < cumul[i + 1])
                    return i;
            throw new Error("Failure to return valid city in NextCity");
        };
        // Построение нового маршрута для муравья
        let buildTrail = (k, start) => {
            let trail = Array(this.numCities);
            let visited = Array(this.numCities);
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
    updatePheromones() {
        /** Наличие перехода между городами в маршруте */
        let EdgeInTrail = (cityX, cityY, trail) => {
            //let lastIndex = trail.length - 1;
            let idx = trail.findIndex((city) => city == cityX);
            let idy = trail.findIndex((city) => city == cityY);
            if (Math.abs(idx - idy) == 1)
                return true;
            else if (idx == 0 && idy == trail.length - 1)
                return true;
            else if (idx == trail.length - 1 && idy == 0)
                return true;
            return false;
            /*if (idx == 0 && trail[1] == cityY) return true;
            else if (idx == 0 && trail[lastIndex] == cityY) return true;
            else if (idx == 0) return false;
            else if (idx == lastIndex && trail[lastIndex - 1] == cityY) return true;
            else if (idx == lastIndex && trail[0] == cityY) return true;
            else if (idx == lastIndex) return false;
            else if (trail[idx - 1] == cityY) return true;
            else if (trail[idx + 1] == cityY) return true;
            else return false;*/
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
                    if (EdgeInTrail(i, j, this.ants[k]))
                        increase = this.Q / length;
                    // обновление феромонов
                    this.pheromones[i][j] = decrease + increase;
                    // помещения значения феромонов в допустимые границы
                    if (this.pheromones[i][j] < 0.0001)
                        this.pheromones[i][j] = 0.0001;
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
self.onmessage = (message) => {
    // run ant
    let graph = [
        [0, 1, 2, 3],
        [1, 0, 5, 6],
        [2, 5, 0, 2],
        [3, 6, 2, 0],
    ];
    //antColonyOptimization.run(graph, 4, 1000);
    antColonyOptimization.run(makeGraphDistances(10), 4, 1000);
    self.postMessage({
        result: "ant colony service works",
    });
};

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYW50Y29sb255b3B0aW1pemF0aW9uLy4vc3JjL2FudC13b3JrZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIEdldHMgcmFuZG9tIGludFxuICogQHBhcmFtIG1pblxuICogQHBhcmFtIG1heFxuICogQHJldHVybnMgcmFuZG9tIGludCAtIG1pbiAmIG1heCBpbmNsdXNpdmVcbiAqL1xuZnVuY3Rpb24gcmFuZG9tSW50KG1pbiwgbWF4KSB7XG4gICAgbWluID0gTWF0aC5jZWlsKG1pbik7XG4gICAgbWF4ID0gTWF0aC5mbG9vcihtYXgpO1xuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSkgKyBtaW47XG59XG4vLyDRgtC10YHRgtC+0LLRi9C5INCz0YDQsNGEXG5mdW5jdGlvbiBtYWtlR3JhcGhEaXN0YW5jZXMoc2l6ZSkge1xuICAgIGxldCBkaXN0cyA9IEFycmF5KHNpemUpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgKytpKVxuICAgICAgICBkaXN0c1tpXSA9IEFycmF5KHNpemUpLmZpbGwoMCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspXG4gICAgICAgIGZvciAobGV0IGogPSBpICsgMTsgaiA8IHNpemU7IGorKykge1xuICAgICAgICAgICAgaWYgKGkgPT0gailcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIGxldCBkID0gaSAqIDE7XG4gICAgICAgICAgICBkaXN0c1tpXVtqXSA9IGQ7XG4gICAgICAgICAgICBkaXN0c1tqXVtpXSA9IGQ7XG4gICAgICAgIH1cbiAgICByZXR1cm4gZGlzdHM7XG59XG5jbGFzcyBBbnRDb2xvbnlPcHRpbWl6YXRpb25TZXR0aW5ncyB7XG59XG5jbGFzcyBBbnRDb2xvbnlPcHRpbWl6YXRpb24ge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvKiog0JLQu9C40Y/QvdC40LUg0YTQtdGA0L7QvNC+0L3QsCDQvdCwINC90LDQv9GA0LDQstC70LXQvdC40LUgKi9cbiAgICAgICAgdGhpcy5hbHBoYSA9IDM7XG4gICAgICAgIC8qKiDQktC70LjRj9C90LjQtSDRgNCw0YHRgdGC0L7Rj9C90LjRjyAqL1xuICAgICAgICB0aGlzLmJldGEgPSAyO1xuICAgICAgICAvKiog0LrQvtGN0YTRhNC40YbQuNC10L3RgiDQuNGB0L/QsNGA0LXQvdC40Y8g0YTQtdGA0L7QvNC+0L3QvtCyICovXG4gICAgICAgIHRoaXMucmhvID0gMC4wMTtcbiAgICAgICAgLyoqINCa0L7RjdGE0YTQuNGG0LjQtdC90YIg0LLRi9GA0LDQsdC+0YLQutC4INGE0LXRgNC+0LzQvtC90L7QsiAqL1xuICAgICAgICB0aGlzLlEgPSAyO1xuICAgICAgICAvKiog0KDQsNGB0YHRgtC+0Y/QvdC40LUg0LzQtdC20LTRgyDQs9C+0YDQvtC00LDQvNC4ICovXG4gICAgICAgIHRoaXMuZGlzdGFuY2VzID0gW107XG4gICAgICAgIC8qKiDQnNGD0YDQsNCy0YzQuCAqL1xuICAgICAgICB0aGlzLmFudHMgPSBbXTtcbiAgICAgICAgLyoqINCk0LXRgNC+0LzQvtC90YsgKi9cbiAgICAgICAgdGhpcy5waGVyb21vbmVzID0gW107XG4gICAgfVxuICAgIC8qKiDQmtC+0LvQuNGH0LXRgdGC0LLQviDQvNGD0YDQsNCy0YzQtdCyINC90LAg0LrQsNC20LTRi9C5INCz0L7RgNC+0LQgKi9cbiAgICBnZXQgbnVtQW50cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYW50cy5sZW5ndGg7XG4gICAgfVxuICAgIC8qKiDQmtC+0LvQuNGH0LXRgdGC0LLQviDQs9C+0YDQvtC00L7QsiAqL1xuICAgIGdldCBudW1DaXRpZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpc3RhbmNlcy5sZW5ndGg7XG4gICAgfVxuICAgIC8qKlxuICAgICAqINCX0LDQv9GD0YHQuiDQvNGD0YDQsNCy0YzQuNC90L7Qs9C+INCw0LvQs9C+0YDQuNGC0LzQsFxuICAgICAqIEBwYXJhbSBjaXRpZXNNYXRyaXgg0YHQv9C40YHQvtC6INGA0LDRgdGB0YLQvtGP0L3QuNC5INC80LXQttC00YMg0LPQvtGA0L7QtNCw0LzQuFxuICAgICAqIEBwYXJhbSBhbnRDb3VudCDQutC+0LvQuNGH0LXRgdGC0LLQviDQvNGD0YDQsNCy0YzQtdCyINCyINC60LDQttC00L7QvCDQuNC3INCz0L7RgNC+0LTQvtCyXG4gICAgICovXG4gICAgcnVuKGNpdGllc01hdHJpeCwgYW50Q291bnQsIG1heFRpbWUgPSAxMDAwKSB7XG4gICAgICAgIHRoaXMuZGlzdGFuY2VzID0gY2l0aWVzTWF0cml4O1xuICAgICAgICB0aGlzLmFudHMgPSB0aGlzLmluaXRBbnRzKGFudENvdW50KTtcbiAgICAgICAgdGhpcy5pbml0UGhlcm9tb25lcygpO1xuICAgICAgICBjb25zb2xlLmxvZyhcItCn0LjRgdC70L4g0LPQvtGA0L7QtNC+0LIgPSBcIiArIHRoaXMubnVtQ2l0aWVzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCLQp9C40YHQu9C+INC80YPRgNCw0LLRjNC10LIgPSBcIiArIHRoaXMubnVtQW50cyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQWxwaGEgPSBcIiArIHRoaXMuYWxwaGEpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkJldGEgPSBcIiArIHRoaXMuYmV0YSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmhvID0gXCIgKyB0aGlzLnJobyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUSA9IFwiICsgdGhpcy5RKTtcbiAgICAgICAgbGV0IGJlc3RUcmFpbCA9IHRoaXMuZ2V0QmVzdFRyYWlsKCk7XG4gICAgICAgIGxldCBiZXN0TGVuZ3RoID0gdGhpcy5nZXRUcmFpbFN1bW1hcnlEaXN0YW5jZShiZXN0VHJhaWwpO1xuICAgICAgICBjb25zb2xlLmxvZyhcItCY0LfQvdCw0YfQsNC70YzQvdGL0Lkg0LvRg9GH0YjQuNC5INC/0YPRgtGMOiBcIiArIGJlc3RMZW5ndGgpO1xuICAgICAgICBsZXQgdGltZSA9IDA7XG4gICAgICAgIGNvbnNvbGUubG9nKFwi0JfQsNC/0YPRgdC6INCw0LvQs9C+0YDQuNGC0LzQsFwiKTtcbiAgICAgICAgd2hpbGUgKHRpbWUgPCBtYXhUaW1lKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUFudHMoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGhlcm9tb25lcygpO1xuICAgICAgICAgICAgbGV0IGN1cnJCZXN0VHJhaWwgPSB0aGlzLmdldEJlc3RUcmFpbCgpO1xuICAgICAgICAgICAgbGV0IGN1cnJCZXN0TGVuZ3RoID0gdGhpcy5nZXRUcmFpbFN1bW1hcnlEaXN0YW5jZShjdXJyQmVzdFRyYWlsKTtcbiAgICAgICAgICAgIGlmIChjdXJyQmVzdExlbmd0aCA8IGJlc3RMZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBiZXN0TGVuZ3RoID0gY3VyckJlc3RMZW5ndGg7XG4gICAgICAgICAgICAgICAgYmVzdFRyYWlsID0gY3VyckJlc3RUcmFpbDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcItCd0L7QstCw0Y8g0LvRg9GH0YjQsNGPINC00LvQvNC90LAgXCIgKyBiZXN0TGVuZ3RoICsgXCIg0YfQuNGB0LvQviDQv9C+0L/Ri9GC0L7QujogXCIgKyB0aW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRpbWUrKztcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcItCb0YPRh9GI0LjQuSDQv9GD0YLRjCDQvdCw0LnQtNC10L06IFwiKTtcbiAgICAgICAgY29uc29sZS5sb2coYmVzdFRyYWlsKTtcbiAgICAgICAgY29uc29sZS5sb2coXCLQlNC70LjQvdCwINC70YPRh9GI0LXQs9C+INC/0YPRgtC4OiBcIiArIGJlc3RMZW5ndGgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDQn9C+0LvRg9GH0LjRgtGMINGA0LDRgdGB0YLQvtGP0L3QuNC1INC80LXQttC00YMg0LPQvtGA0L7QtNCw0LzQuFxuICAgICAqIEBwYXJhbSBjaXR5WCDQs9C+0YDQvtC0XG4gICAgICogQHBhcmFtIGNpdHlZINC00YDRg9Cz0L7QuSDQs9C+0YDQvtC0XG4gICAgICogQHJldHVybnMg0YDQsNGB0YHRgtC+0Y/QtdC90LjQtSDQvNC10LbQtNGDINCz0L7RgNC+0LTQsNC80LhcbiAgICAgKi9cbiAgICBnZXREaXN0YW5jZShjaXR5WCwgY2l0eVkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlzdGFuY2VzW2NpdHlYXVtjaXR5WV07XG4gICAgfVxuICAgIC8qKlxuICAgICAqINCf0L7Qu9GD0YfQuNGC0Ywg0L7QsdGJ0LXQtSDRgNCw0YHRgdGC0L7Rj9C90LjQtSDQvNCw0YDRiNGA0YPRgtCwXG4gICAgICogQHBhcmFtIHRyYWlsINC80LDRgNGI0YDRg9GCXG4gICAgICogQHJldHVybnMg0L7QsdGJ0LXQtSDRgNCw0YHRgdGC0L7Rj9C90LjQtVxuICAgICAqL1xuICAgIGdldFRyYWlsU3VtbWFyeURpc3RhbmNlKHRyYWlsKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyYWlsLmxlbmd0aCAtIDE7ICsraSlcbiAgICAgICAgICAgIHJlc3VsdCArPSB0aGlzLmdldERpc3RhbmNlKHRyYWlsW2ldLCB0cmFpbFtpICsgMV0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDQn9C+0LvRg9GH0LjRgtGMINC70YPRh9GI0LjQuSDQvNCw0YDRiNGA0YPRglxuICAgICAqIEByZXR1cm5zINC70YPRh9GI0LjQuSDQvNCw0YDRiNGA0YPRglxuICAgICAqL1xuICAgIGdldEJlc3RUcmFpbCgpIHtcbiAgICAgICAgbGV0IGJlc3RMZW5ndGggPSB0aGlzLmdldFRyYWlsU3VtbWFyeURpc3RhbmNlKHRoaXMuYW50c1swXSk7XG4gICAgICAgIGxldCBpbmRleEJlc3RMZW5ndGggPSAwO1xuICAgICAgICBmb3IgKGxldCBrID0gMTsgayA8IHRoaXMuYW50cy5sZW5ndGg7ICsraykge1xuICAgICAgICAgICAgbGV0IGxlbiA9IHRoaXMuZ2V0VHJhaWxTdW1tYXJ5RGlzdGFuY2UodGhpcy5hbnRzW2tdKTtcbiAgICAgICAgICAgIGlmIChsZW4gPCBiZXN0TGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgYmVzdExlbmd0aCA9IGxlbjtcbiAgICAgICAgICAgICAgICBpbmRleEJlc3RMZW5ndGggPSBrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbLi4udGhpcy5hbnRzW2luZGV4QmVzdExlbmd0aF1dO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDQodCz0LXQvdC10L3RgNC40YDQvtCy0LDRgtGMINC80YPRgNCw0LLRjNC10LJcbiAgICAgKiBAcmV0dXJucyDRgdC/0LjRgdC+0Log0LzRg9GA0LDQstGM0LXQslxuICAgICAqL1xuICAgIGluaXRBbnRzKGFudENvdW50KSB7XG4gICAgICAgIGxldCBhbnRzID0gQXJyYXkoYW50Q291bnQpO1xuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGFudENvdW50OyBrKyspIHtcbiAgICAgICAgICAgIGxldCBzdGFydCA9IHJhbmRvbUludCgwLCB0aGlzLm51bUNpdGllcyk7XG4gICAgICAgICAgICBhbnRzW2tdID0gdGhpcy5yYW5kb21UcmFpbChzdGFydCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFudHM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqINCh0LPQtdC90LXRgNC40YDQvtCy0LDRgtGMINGB0LvRg9GH0LDQudC90YvQuSDQvNCw0YDRiNGA0YPRglxuICAgICAqIEBwYXJhbSBzdGFydCDQvdCw0YfQsNC70YzQvdGL0Lkg0LPQvtGA0L7QtFxuICAgICAqIEBwYXJhbSBudW1DaXRpZXMg0LrQvtC70LjRh9C10YHRgtCy0L4g0LPQvtGA0L7QtNC+0LJcbiAgICAgKiBAcmV0dXJucyDRgdC70YPRh9Cw0LnQvdGL0Lkg0LzQsNGA0YjRgNGD0YJcbiAgICAgKi9cbiAgICByYW5kb21UcmFpbChzdGFydCkge1xuICAgICAgICAvLyDQk9C10L3QtdGA0LjRgNGD0LXQvCDQvNCw0YDRiNGA0YPRgiDRh9C10YDQtdC3INCy0YHQtSDQs9C+0YDQvtC00LBcbiAgICAgICAgbGV0IHRyYWlsID0gWy4uLkFycmF5KHRoaXMubnVtQ2l0aWVzKS5rZXlzKCldO1xuICAgICAgICAvLyDQn9C10YDQtdC80LXRiNC40LLQsNC10Lwg0LzQsNGA0YjRgNGD0YJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm51bUNpdGllczsgKytpKSB7XG4gICAgICAgICAgICBsZXQgciA9IHJhbmRvbUludChpLCB0aGlzLm51bUNpdGllcyk7XG4gICAgICAgICAgICBsZXQgdG1wID0gdHJhaWxbcl07XG4gICAgICAgICAgICB0cmFpbFtyXSA9IHRyYWlsW2ldO1xuICAgICAgICAgICAgdHJhaWxbaV0gPSB0bXA7XG4gICAgICAgIH1cbiAgICAgICAgLy8g0J/QvtGB0LvQtSDQv9C10YDQtdC80LXRiNC40LLQsNC90LjRjyDQstC+0LfQstGA0LDRidCw0LXQvCDQsiDQvdCw0YfQsNC70L4g0YHRgtCw0YDRgtC+0LLRi9C5INCz0L7RgNC+0LRcbiAgICAgICAgbGV0IGlkeCA9IHRyYWlsLmZpbmRJbmRleCgoY2l0eSkgPT4gY2l0eSA9PSBzdGFydCk7XG4gICAgICAgIGxldCB0ZW1wID0gdHJhaWxbMF07XG4gICAgICAgIHRyYWlsWzBdID0gdHJhaWxbaWR4XTtcbiAgICAgICAgdHJhaWxbaWR4XSA9IHRlbXA7XG4gICAgICAgIHJldHVybiB0cmFpbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICog0JjQvdC40YbQuNCw0LvQuNC30LjRgNC+0LLQsNGC0Ywg0YTQtdGA0L7QvNC+0L3Ri1xuICAgICAqL1xuICAgIGluaXRQaGVyb21vbmVzKCkge1xuICAgICAgICB0aGlzLnBoZXJvbW9uZXMgPSBBcnJheSh0aGlzLm51bUNpdGllcyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5udW1DaXRpZXM7ICsraSlcbiAgICAgICAgICAgIHRoaXMucGhlcm9tb25lc1tpXSA9IEFycmF5KHRoaXMubnVtQ2l0aWVzKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBoZXJvbW9uZXMubGVuZ3RoOyArK2kpXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMucGhlcm9tb25lc1tpXS5sZW5ndGg7ICsrailcbiAgICAgICAgICAgICAgICB0aGlzLnBoZXJvbW9uZXNbaV1bal0gPSAwLjAxO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDQntCx0L3QvtCy0LjRgtGMINC80LDRgNGI0YDRg9GC0Ysg0LzRg9GA0LDQstGM0LXQslxuICAgICAqL1xuICAgIHVwZGF0ZUFudHMoKSB7XG4gICAgICAgIC8vINCS0LXRgNC+0Y/RgtC90L7RgdGC0Ywg0L/QtdGA0LXQvNC10YnQtdC90LjRjyDQvNGD0YDQsNCy0YzRjyDQsiDQu9GO0LHQvtC5INC00YDRg9Cz0L7QuSDQs9C+0YDQvtC0XG4gICAgICAgIGxldCBtb3ZlUHJvYnMgPSAoaywgY2l0eVgsIHZpc2l0ZWQpID0+IHtcbiAgICAgICAgICAgIGxldCB0YXVldGEgPSBBcnJheSh0aGlzLm51bUNpdGllcyk7XG4gICAgICAgICAgICBsZXQgc3VtID0gMC4wO1xuICAgICAgICAgICAgLy8gaSAtINGB0L7RgdC10LTQvdC40Lkg0LPQvtGA0L7QtFxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YXVldGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSBjaXR5WClcbiAgICAgICAgICAgICAgICAgICAgdGF1ZXRhW2ldID0gMC4wOyAvLyDQvdC10LvRjNC30Y8g0L/QtdGA0LXQvNC10YnQsNGC0YzRgdGPINCyINGC0L7Rgi3QttC1INGB0LDQvNGL0Lkg0LPQvtGA0L7QtFxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHZpc2l0ZWRbaV0gPT0gdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgdGF1ZXRhW2ldID0gMC4wOyAvLyDQvdC10LvRjNC30Y8g0L/QtdGA0LXQvNC10YnQsNGC0YzRgdGPINCyINGD0LbQtSDQv9C+0YHQtdGJ0LXQvdC90YvQuSDQs9C+0YDQvtC0XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vINGA0LDRgdGH0LXRgiDQstC10YDQvtGP0YLQvdC+0YHRgtC4INC/0LXRgNC10LzQtdGJ0LXQvdC40Y8g0Lgg0L/QvtC80LXRidC10L3QuNC1INC10ZEg0LIg0LDQtNC10LrQstCw0YLQvdGL0LUg0LPRgNCw0L3QuNGG0YtcbiAgICAgICAgICAgICAgICAgICAgdGF1ZXRhW2ldID1cbiAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgucG93KHRoaXMucGhlcm9tb25lc1tjaXR5WF1baV0sIHRoaXMuYWxwaGEpICpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnBvdygxLjAgLyB0aGlzLmdldERpc3RhbmNlKGNpdHlYLCBpKSwgdGhpcy5iZXRhKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhdWV0YVtpXSA8IDAuMDAwMSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhdWV0YVtpXSA9IDAuMDAwMTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGF1ZXRhW2ldID4gTnVtYmVyLk1BWF9WQUxVRSAvICh0aGlzLm51bUNpdGllcyAqIDEwMCkpXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXVldGFbaV0gPSBOdW1iZXIuTUFYX1ZBTFVFIC8gKHRoaXMubnVtQ2l0aWVzICogMTAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3VtICs9IHRhdWV0YVtpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vINCy0LXRgNC+0Y/RgtC90L7RgdGC0Lgg0L/QtdGA0LXQvNC10YnQtdC90LjRj1xuICAgICAgICAgICAgbGV0IHByb2JzID0gQXJyYXkodGhpcy5udW1DaXRpZXMpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9icy5sZW5ndGg7ICsraSlcbiAgICAgICAgICAgICAgICBwcm9ic1tpXSA9IHRhdWV0YVtpXSAvIHN1bTtcbiAgICAgICAgICAgIHJldHVybiBwcm9icztcbiAgICAgICAgfTtcbiAgICAgICAgLy8g0JDQu9Cz0L7RgNC40YLQvCDQstGL0LHQvtGA0LAg0LPQvtGA0L7QtNCwXG4gICAgICAgIGxldCBuZXh0Q2l0eSA9IChrLCBjaXR5WCwgdmlzaXRlZCkgPT4ge1xuICAgICAgICAgICAgbGV0IHByb2JzID0gbW92ZVByb2JzKGssIGNpdHlYLCB2aXNpdGVkKTtcbiAgICAgICAgICAgIGxldCBjdW11bCA9IEFycmF5KHByb2JzLmxlbmd0aCArIDEpLmZpbGwoMCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2JzLmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgICAgIGN1bXVsW2kgKyAxXSA9IGN1bXVsW2ldICsgcHJvYnNbaV07XG4gICAgICAgICAgICBsZXQgcCA9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN1bXVsLmxlbmd0aCAtIDE7ICsraSlcbiAgICAgICAgICAgICAgICBpZiAocCA+PSBjdW11bFtpXSAmJiBwIDwgY3VtdWxbaSArIDFdKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWx1cmUgdG8gcmV0dXJuIHZhbGlkIGNpdHkgaW4gTmV4dENpdHlcIik7XG4gICAgICAgIH07XG4gICAgICAgIC8vINCf0L7RgdGC0YDQvtC10L3QuNC1INC90L7QstC+0LPQviDQvNCw0YDRiNGA0YPRgtCwINC00LvRjyDQvNGD0YDQsNCy0YzRj1xuICAgICAgICBsZXQgYnVpbGRUcmFpbCA9IChrLCBzdGFydCkgPT4ge1xuICAgICAgICAgICAgbGV0IHRyYWlsID0gQXJyYXkodGhpcy5udW1DaXRpZXMpO1xuICAgICAgICAgICAgbGV0IHZpc2l0ZWQgPSBBcnJheSh0aGlzLm51bUNpdGllcyk7XG4gICAgICAgICAgICB0cmFpbFswXSA9IHN0YXJ0O1xuICAgICAgICAgICAgdmlzaXRlZFtzdGFydF0gPSB0cnVlO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm51bUNpdGllcyAtIDE7ICsraSkge1xuICAgICAgICAgICAgICAgIGxldCBjaXR5WCA9IHRyYWlsW2ldO1xuICAgICAgICAgICAgICAgIGxldCBuZXh0ID0gbmV4dENpdHkoaywgY2l0eVgsIHZpc2l0ZWQpO1xuICAgICAgICAgICAgICAgIHRyYWlsW2kgKyAxXSA9IG5leHQ7XG4gICAgICAgICAgICAgICAgdmlzaXRlZFtuZXh0XSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJhaWw7XG4gICAgICAgIH07XG4gICAgICAgIC8vINC60LDQttC00L7QvNGDINC80YPRgNCw0LLRjNGOINGB0YLRgNC+0LjRgtGB0Y8g0L3QvtCy0YvQuSDQvNCw0YDRiNGA0YPRglxuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHRoaXMuYW50cy5sZW5ndGg7ICsraykge1xuICAgICAgICAgICAgbGV0IHN0YXJ0ID0gcmFuZG9tSW50KDAsIHRoaXMubnVtQ2l0aWVzKTtcbiAgICAgICAgICAgIHRoaXMuYW50c1trXSA9IGJ1aWxkVHJhaWwoaywgc3RhcnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqINCe0LHQvdC+0LLQu9C10L3QuNC1INC60L7Qu9C40YfQtdGB0YLQstCwINGE0LXRgNC+0LzQvtC90L7QslxuICAgICAqL1xuICAgIHVwZGF0ZVBoZXJvbW9uZXMoKSB7XG4gICAgICAgIC8qKiDQndCw0LvQuNGH0LjQtSDQv9C10YDQtdGF0L7QtNCwINC80LXQttC00YMg0LPQvtGA0L7QtNCw0LzQuCDQsiDQvNCw0YDRiNGA0YPRgtC1ICovXG4gICAgICAgIGxldCBFZGdlSW5UcmFpbCA9IChjaXR5WCwgY2l0eVksIHRyYWlsKSA9PiB7XG4gICAgICAgICAgICAvL2xldCBsYXN0SW5kZXggPSB0cmFpbC5sZW5ndGggLSAxO1xuICAgICAgICAgICAgbGV0IGlkeCA9IHRyYWlsLmZpbmRJbmRleCgoY2l0eSkgPT4gY2l0eSA9PSBjaXR5WCk7XG4gICAgICAgICAgICBsZXQgaWR5ID0gdHJhaWwuZmluZEluZGV4KChjaXR5KSA9PiBjaXR5ID09IGNpdHlZKTtcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhpZHggLSBpZHkpID09IDEpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICBlbHNlIGlmIChpZHggPT0gMCAmJiBpZHkgPT0gdHJhaWwubGVuZ3RoIC0gMSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIGVsc2UgaWYgKGlkeCA9PSB0cmFpbC5sZW5ndGggLSAxICYmIGlkeSA9PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgLyppZiAoaWR4ID09IDAgJiYgdHJhaWxbMV0gPT0gY2l0eVkpIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgZWxzZSBpZiAoaWR4ID09IDAgJiYgdHJhaWxbbGFzdEluZGV4XSA9PSBjaXR5WSkgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICBlbHNlIGlmIChpZHggPT0gMCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgZWxzZSBpZiAoaWR4ID09IGxhc3RJbmRleCAmJiB0cmFpbFtsYXN0SW5kZXggLSAxXSA9PSBjaXR5WSkgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICBlbHNlIGlmIChpZHggPT0gbGFzdEluZGV4ICYmIHRyYWlsWzBdID09IGNpdHlZKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIGVsc2UgaWYgKGlkeCA9PSBsYXN0SW5kZXgpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIGVsc2UgaWYgKHRyYWlsW2lkeCAtIDFdID09IGNpdHlZKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIGVsc2UgaWYgKHRyYWlsW2lkeCArIDFdID09IGNpdHlZKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIGVsc2UgcmV0dXJuIGZhbHNlOyovXG4gICAgICAgIH07XG4gICAgICAgIC8vINGG0LjQutC7INC+0LHQvdC+0LLQu9C10L3QuNGPINGE0LXRgNC+0LzQvtC90L7QslxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGhlcm9tb25lcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IGkgKyAxOyBqIDwgdGhpcy5waGVyb21vbmVzW2ldLmxlbmd0aDsgKytqKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCB0aGlzLmFudHMubGVuZ3RoOyArK2spIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g0LTQu9C40L3QsCDQv9GD0YLQuCDQvNGD0YDQsNCy0YzRjyBrXG4gICAgICAgICAgICAgICAgICAgIGxldCBsZW5ndGggPSB0aGlzLmdldFRyYWlsU3VtbWFyeURpc3RhbmNlKHRoaXMuYW50c1trXSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkZWNyZWFzZSA9ICgxLjAgLSB0aGlzLnJobykgKiB0aGlzLnBoZXJvbW9uZXNbaV1bal07XG4gICAgICAgICAgICAgICAgICAgIC8vINC10YHQu9C4INC80YPRgNCw0LLQtdC5INC/0LXRgNC10YXQvtC00LjQuyDQuNC3INCz0L7RgNC+0LTQsCBpINCyINCz0L7RgNC+0LQgalxuICAgICAgICAgICAgICAgICAgICBsZXQgaW5jcmVhc2UgPSAwLjA7XG4gICAgICAgICAgICAgICAgICAgIGlmIChFZGdlSW5UcmFpbChpLCBqLCB0aGlzLmFudHNba10pKVxuICAgICAgICAgICAgICAgICAgICAgICAgaW5jcmVhc2UgPSB0aGlzLlEgLyBsZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIC8vINC+0LHQvdC+0LLQu9C10L3QuNC1INGE0LXRgNC+0LzQvtC90L7QslxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBoZXJvbW9uZXNbaV1bal0gPSBkZWNyZWFzZSArIGluY3JlYXNlO1xuICAgICAgICAgICAgICAgICAgICAvLyDQv9C+0LzQtdGJ0LXQvdC40Y8g0LfQvdCw0YfQtdC90LjRjyDRhNC10YDQvtC80L7QvdC+0LIg0LIg0LTQvtC/0YPRgdGC0LjQvNGL0LUg0LPRgNCw0L3QuNGG0YtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGhlcm9tb25lc1tpXVtqXSA8IDAuMDAwMSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGhlcm9tb25lc1tpXVtqXSA9IDAuMDAwMTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5waGVyb21vbmVzW2ldW2pdID4gMTAwMDAwLjApXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBoZXJvbW9uZXNbaV1bal0gPSAxMDAwMDAuMDtcbiAgICAgICAgICAgICAgICAgICAgLy8g0LzQsNGC0YDQuNGG0LAg0YTQtdGA0L7QvNC+0L3QvtCyINGB0LjQvNC80LXRgtGA0LjRh9C90LBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5waGVyb21vbmVzW2pdW2ldID0gdGhpcy5waGVyb21vbmVzW2ldW2pdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbmNvbnN0IGFudENvbG9ueU9wdGltaXphdGlvbiA9IG5ldyBBbnRDb2xvbnlPcHRpbWl6YXRpb24oKTtcbnNlbGYub25tZXNzYWdlID0gKG1lc3NhZ2UpID0+IHtcbiAgICAvLyBydW4gYW50XG4gICAgbGV0IGdyYXBoID0gW1xuICAgICAgICBbMCwgMSwgMiwgM10sXG4gICAgICAgIFsxLCAwLCA1LCA2XSxcbiAgICAgICAgWzIsIDUsIDAsIDJdLFxuICAgICAgICBbMywgNiwgMiwgMF0sXG4gICAgXTtcbiAgICAvL2FudENvbG9ueU9wdGltaXphdGlvbi5ydW4oZ3JhcGgsIDQsIDEwMDApO1xuICAgIGFudENvbG9ueU9wdGltaXphdGlvbi5ydW4obWFrZUdyYXBoRGlzdGFuY2VzKDEwKSwgNCwgMTAwMCk7XG4gICAgc2VsZi5wb3N0TWVzc2FnZSh7XG4gICAgICAgIHJlc3VsdDogXCJhbnQgY29sb255IHNlcnZpY2Ugd29ya3NcIixcbiAgICB9KTtcbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=