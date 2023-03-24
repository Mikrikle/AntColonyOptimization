/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/message-models.ts":
/*!*******************************!*\
  !*** ./src/message-models.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AntWorkerRequest": () => (/* binding */ AntWorkerRequest),
/* harmony export */   "AntWorkerResponse": () => (/* binding */ AntWorkerResponse)
/* harmony export */ });
class AntWorkerResponse {
    constructor(final, ants, pheromones, best, bestLength) {
        this.final = final;
        this.ants = ants;
        this.pheromones = pheromones;
        this.best = best;
        this.bestLength = bestLength;
    }
}
class AntWorkerRequest {
    constructor(graph, numAntsPerVertex, attempts, paramAlpha, paramBeta, paramRho, paramQ) {
        this.graph = graph;
        this.numAntsPerVertex = numAntsPerVertex;
        this.attempts = attempts;
        this.paramAlpha = paramAlpha;
        this.paramBeta = paramBeta;
        this.paramRho = paramRho;
        this.paramQ = paramQ;
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***************************!*\
  !*** ./src/ant-worker.ts ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _message_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./message-models */ "./src/message-models.ts");

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
     * Отправка текущего состояния расчета основному приложению
     * @param final вычисления окончены
     * @param bestTrail лучший маршрут
     * @param bestLength дистанция лучшего маршрута
     */
    sendMessage(final, bestTrail, bestLength) {
        self.postMessage(new _message_models__WEBPACK_IMPORTED_MODULE_0__.AntWorkerResponse(final, this.ants, this.pheromones, bestTrail, bestLength));
    }
    /**
     * Запуск муравьиного алгоритма
     * @param citiesMatrix список расстояний между городами
     * @param antCount количество муравьев в каждом из городов
     */
    run(data) {
        this.distances = data.graph;
        this.ants = this.initAnts(data.numAntsPerVertex);
        let maxAttempts = data.attempts;
        this.alpha = data.paramAlpha;
        this.beta = data.paramBeta;
        this.rho = data.paramRho;
        this.Q = data.paramQ;
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
                console.log("Новая лучшая длмна " + bestLength + " число попыток: " + attempt);
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
            let idx = trail.findIndex((city) => city == cityX);
            let idy = trail.findIndex((city) => city == cityY);
            if (Math.abs(idx - idy) == 1)
                return true;
            else if (idx == 0 && idy == trail.length - 1)
                return true;
            else if (idx == trail.length - 1 && idy == 0)
                return true;
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
    let request = message.data;
    antColonyOptimization.run(request);
};

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBLHdCQUF3QixzQkFBc0I7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDRCQUE0QjtBQUNwRCxnQ0FBZ0MsK0JBQStCO0FBQy9ELGdDQUFnQyxzQkFBc0I7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2FudGNvbG9ueW9wdGltaXphdGlvbi8uL3NyYy9tZXNzYWdlLW1vZGVscy50cyIsIndlYnBhY2s6Ly9hbnRjb2xvbnlvcHRpbWl6YXRpb24vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYW50Y29sb255b3B0aW1pemF0aW9uL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9hbnRjb2xvbnlvcHRpbWl6YXRpb24vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9hbnRjb2xvbnlvcHRpbWl6YXRpb24vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9hbnRjb2xvbnlvcHRpbWl6YXRpb24vLi9zcmMvYW50LXdvcmtlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgQW50V29ya2VyUmVzcG9uc2Uge1xuICAgIGNvbnN0cnVjdG9yKGZpbmFsLCBhbnRzLCBwaGVyb21vbmVzLCBiZXN0LCBiZXN0TGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuZmluYWwgPSBmaW5hbDtcbiAgICAgICAgdGhpcy5hbnRzID0gYW50cztcbiAgICAgICAgdGhpcy5waGVyb21vbmVzID0gcGhlcm9tb25lcztcbiAgICAgICAgdGhpcy5iZXN0ID0gYmVzdDtcbiAgICAgICAgdGhpcy5iZXN0TGVuZ3RoID0gYmVzdExlbmd0aDtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgQW50V29ya2VyUmVxdWVzdCB7XG4gICAgY29uc3RydWN0b3IoZ3JhcGgsIG51bUFudHNQZXJWZXJ0ZXgsIGF0dGVtcHRzLCBwYXJhbUFscGhhLCBwYXJhbUJldGEsIHBhcmFtUmhvLCBwYXJhbVEpIHtcbiAgICAgICAgdGhpcy5ncmFwaCA9IGdyYXBoO1xuICAgICAgICB0aGlzLm51bUFudHNQZXJWZXJ0ZXggPSBudW1BbnRzUGVyVmVydGV4O1xuICAgICAgICB0aGlzLmF0dGVtcHRzID0gYXR0ZW1wdHM7XG4gICAgICAgIHRoaXMucGFyYW1BbHBoYSA9IHBhcmFtQWxwaGE7XG4gICAgICAgIHRoaXMucGFyYW1CZXRhID0gcGFyYW1CZXRhO1xuICAgICAgICB0aGlzLnBhcmFtUmhvID0gcGFyYW1SaG87XG4gICAgICAgIHRoaXMucGFyYW1RID0gcGFyYW1RO1xuICAgIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgQW50V29ya2VyUmVzcG9uc2UgfSBmcm9tIFwiLi9tZXNzYWdlLW1vZGVsc1wiO1xuLyoqXG4gKiBHZXRzIHJhbmRvbSBpbnRcbiAqIEBwYXJhbSBtaW5cbiAqIEBwYXJhbSBtYXhcbiAqIEByZXR1cm5zIHJhbmRvbSBpbnQgLSBtaW4gJiBtYXggaW5jbHVzaXZlXG4gKi9cbmZ1bmN0aW9uIHJhbmRvbUludChtaW4sIG1heCkge1xuICAgIG1pbiA9IE1hdGguY2VpbChtaW4pO1xuICAgIG1heCA9IE1hdGguZmxvb3IobWF4KTtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikpICsgbWluO1xufVxuY2xhc3MgQW50Q29sb255T3B0aW1pemF0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLyoqINCS0LvQuNGP0L3QuNC1INGE0LXRgNC+0LzQvtC90LAg0L3QsCDQvdCw0L/RgNCw0LLQu9C10L3QuNC1ICovXG4gICAgICAgIHRoaXMuYWxwaGEgPSAzO1xuICAgICAgICAvKiog0JLQu9C40Y/QvdC40LUg0YDQsNGB0YHRgtC+0Y/QvdC40Y8gKi9cbiAgICAgICAgdGhpcy5iZXRhID0gMjtcbiAgICAgICAgLyoqINC60L7RjdGE0YTQuNGG0LjQtdC90YIg0LjRgdC/0LDRgNC10L3QuNGPINGE0LXRgNC+0LzQvtC90L7QsiAqL1xuICAgICAgICB0aGlzLnJobyA9IDAuMDE7XG4gICAgICAgIC8qKiDQmtC+0Y3RhNGE0LjRhtC40LXQvdGCINCy0YvRgNCw0LHQvtGC0LrQuCDRhNC10YDQvtC80L7QvdC+0LIgKi9cbiAgICAgICAgdGhpcy5RID0gMjtcbiAgICAgICAgLyoqINCg0LDRgdGB0YLQvtGP0L3QuNC1INC80LXQttC00YMg0LPQvtGA0L7QtNCw0LzQuCAqL1xuICAgICAgICB0aGlzLmRpc3RhbmNlcyA9IFtdO1xuICAgICAgICAvKiog0JzRg9GA0LDQstGM0LggKi9cbiAgICAgICAgdGhpcy5hbnRzID0gW107XG4gICAgICAgIC8qKiDQpNC10YDQvtC80L7QvdGLICovXG4gICAgICAgIHRoaXMucGhlcm9tb25lcyA9IFtdO1xuICAgIH1cbiAgICAvKiog0JrQvtC70LjRh9C10YHRgtCy0L4g0LzRg9GA0LDQstGM0LXQsiDQvdCwINC60LDQttC00YvQuSDQs9C+0YDQvtC0ICovXG4gICAgZ2V0IG51bUFudHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFudHMubGVuZ3RoO1xuICAgIH1cbiAgICAvKiog0JrQvtC70LjRh9C10YHRgtCy0L4g0LPQvtGA0L7QtNC+0LIgKi9cbiAgICBnZXQgbnVtQ2l0aWVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kaXN0YW5jZXMubGVuZ3RoO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDQntGC0L/RgNCw0LLQutCwINGC0LXQutGD0YnQtdCz0L4g0YHQvtGB0YLQvtGP0L3QuNGPINGA0LDRgdGH0LXRgtCwINC+0YHQvdC+0LLQvdC+0LzRgyDQv9GA0LjQu9C+0LbQtdC90LjRjlxuICAgICAqIEBwYXJhbSBmaW5hbCDQstGL0YfQuNGB0LvQtdC90LjRjyDQvtC60L7QvdGH0LXQvdGLXG4gICAgICogQHBhcmFtIGJlc3RUcmFpbCDQu9GD0YfRiNC40Lkg0LzQsNGA0YjRgNGD0YJcbiAgICAgKiBAcGFyYW0gYmVzdExlbmd0aCDQtNC40YHRgtCw0L3RhtC40Y8g0LvRg9GH0YjQtdCz0L4g0LzQsNGA0YjRgNGD0YLQsFxuICAgICAqL1xuICAgIHNlbmRNZXNzYWdlKGZpbmFsLCBiZXN0VHJhaWwsIGJlc3RMZW5ndGgpIHtcbiAgICAgICAgc2VsZi5wb3N0TWVzc2FnZShuZXcgQW50V29ya2VyUmVzcG9uc2UoZmluYWwsIHRoaXMuYW50cywgdGhpcy5waGVyb21vbmVzLCBiZXN0VHJhaWwsIGJlc3RMZW5ndGgpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICog0JfQsNC/0YPRgdC6INC80YPRgNCw0LLRjNC40L3QvtCz0L4g0LDQu9Cz0L7RgNC40YLQvNCwXG4gICAgICogQHBhcmFtIGNpdGllc01hdHJpeCDRgdC/0LjRgdC+0Log0YDQsNGB0YHRgtC+0Y/QvdC40Lkg0LzQtdC20LTRgyDQs9C+0YDQvtC00LDQvNC4XG4gICAgICogQHBhcmFtIGFudENvdW50INC60L7Qu9C40YfQtdGB0YLQstC+INC80YPRgNCw0LLRjNC10LIg0LIg0LrQsNC20LTQvtC8INC40Lcg0LPQvtGA0L7QtNC+0LJcbiAgICAgKi9cbiAgICBydW4oZGF0YSkge1xuICAgICAgICB0aGlzLmRpc3RhbmNlcyA9IGRhdGEuZ3JhcGg7XG4gICAgICAgIHRoaXMuYW50cyA9IHRoaXMuaW5pdEFudHMoZGF0YS5udW1BbnRzUGVyVmVydGV4KTtcbiAgICAgICAgbGV0IG1heEF0dGVtcHRzID0gZGF0YS5hdHRlbXB0cztcbiAgICAgICAgdGhpcy5hbHBoYSA9IGRhdGEucGFyYW1BbHBoYTtcbiAgICAgICAgdGhpcy5iZXRhID0gZGF0YS5wYXJhbUJldGE7XG4gICAgICAgIHRoaXMucmhvID0gZGF0YS5wYXJhbVJobztcbiAgICAgICAgdGhpcy5RID0gZGF0YS5wYXJhbVE7XG4gICAgICAgIHRoaXMuaW5pdFBoZXJvbW9uZXMoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCLQp9C40YHQu9C+INCz0L7RgNC+0LTQvtCyID0gXCIgKyB0aGlzLm51bUNpdGllcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwi0KfQuNGB0LvQviDQvNGD0YDQsNCy0YzQtdCyID0gXCIgKyB0aGlzLm51bUFudHMpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkFscGhhID0gXCIgKyB0aGlzLmFscGhhKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJCZXRhID0gXCIgKyB0aGlzLmJldGEpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlJobyA9IFwiICsgdGhpcy5yaG8pO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlEgPSBcIiArIHRoaXMuUSk7XG4gICAgICAgIGxldCBiZXN0VHJhaWwgPSB0aGlzLmdldEJlc3RUcmFpbCgpO1xuICAgICAgICBsZXQgYmVzdExlbmd0aCA9IHRoaXMuZ2V0VHJhaWxTdW1tYXJ5RGlzdGFuY2UoYmVzdFRyYWlsKTtcbiAgICAgICAgY29uc29sZS5sb2coXCLQmNC30L3QsNGH0LDQu9GM0L3Ri9C5INC70YPRh9GI0LjQuSDQv9GD0YLRjDogXCIgKyBiZXN0TGVuZ3RoKTtcbiAgICAgICAgbGV0IGF0dGVtcHQgPSAwO1xuICAgICAgICBjb25zb2xlLmxvZyhcItCX0LDQv9GD0YHQuiDQsNC70LPQvtGA0LjRgtC80LBcIik7XG4gICAgICAgIHdoaWxlIChhdHRlbXB0IDwgbWF4QXR0ZW1wdHMpIHtcbiAgICAgICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UoZmFsc2UsIGJlc3RUcmFpbCwgYmVzdExlbmd0aCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUFudHMoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGhlcm9tb25lcygpO1xuICAgICAgICAgICAgbGV0IGN1cnJCZXN0VHJhaWwgPSB0aGlzLmdldEJlc3RUcmFpbCgpO1xuICAgICAgICAgICAgbGV0IGN1cnJCZXN0TGVuZ3RoID0gdGhpcy5nZXRUcmFpbFN1bW1hcnlEaXN0YW5jZShjdXJyQmVzdFRyYWlsKTtcbiAgICAgICAgICAgIGlmIChjdXJyQmVzdExlbmd0aCA8IGJlc3RMZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBiZXN0TGVuZ3RoID0gY3VyckJlc3RMZW5ndGg7XG4gICAgICAgICAgICAgICAgYmVzdFRyYWlsID0gY3VyckJlc3RUcmFpbDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcItCd0L7QstCw0Y8g0LvRg9GH0YjQsNGPINC00LvQvNC90LAgXCIgKyBiZXN0TGVuZ3RoICsgXCIg0YfQuNGB0LvQviDQv9C+0L/Ri9GC0L7QujogXCIgKyBhdHRlbXB0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGF0dGVtcHQrKztcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcItCb0YPRh9GI0LjQuSDQv9GD0YLRjCDQvdCw0LnQtNC10L06IFwiKTtcbiAgICAgICAgY29uc29sZS5sb2coYmVzdFRyYWlsKTtcbiAgICAgICAgY29uc29sZS5sb2coXCLQlNC70LjQvdCwINC70YPRh9GI0LXQs9C+INC/0YPRgtC4OiBcIiArIGJlc3RMZW5ndGgpO1xuICAgICAgICB0aGlzLnNlbmRNZXNzYWdlKHRydWUsIGJlc3RUcmFpbCwgYmVzdExlbmd0aCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqINCf0L7Qu9GD0YfQuNGC0Ywg0YDQsNGB0YHRgtC+0Y/QvdC40LUg0LzQtdC20LTRgyDQs9C+0YDQvtC00LDQvNC4XG4gICAgICogQHBhcmFtIGNpdHlYINCz0L7RgNC+0LRcbiAgICAgKiBAcGFyYW0gY2l0eVkg0LTRgNGD0LPQvtC5INCz0L7RgNC+0LRcbiAgICAgKiBAcmV0dXJucyDRgNCw0YHRgdGC0L7Rj9C10L3QuNC1INC80LXQttC00YMg0LPQvtGA0L7QtNCw0LzQuFxuICAgICAqL1xuICAgIGdldERpc3RhbmNlKGNpdHlYLCBjaXR5WSkge1xuICAgICAgICByZXR1cm4gdGhpcy5kaXN0YW5jZXNbY2l0eVhdW2NpdHlZXTtcbiAgICB9XG4gICAgLyoqXG4gICAgICog0J/QvtC70YPRh9C40YLRjCDQvtCx0YnQtdC1INGA0LDRgdGB0YLQvtGP0L3QuNC1INC80LDRgNGI0YDRg9GC0LBcbiAgICAgKiBAcGFyYW0gdHJhaWwg0LzQsNGA0YjRgNGD0YJcbiAgICAgKiBAcmV0dXJucyDQvtCx0YnQtdC1INGA0LDRgdGB0YLQvtGP0L3QuNC1XG4gICAgICovXG4gICAgZ2V0VHJhaWxTdW1tYXJ5RGlzdGFuY2UodHJhaWwpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHJhaWwubGVuZ3RoIC0gMTsgKytpKVxuICAgICAgICAgICAgcmVzdWx0ICs9IHRoaXMuZ2V0RGlzdGFuY2UodHJhaWxbaV0sIHRyYWlsW2kgKyAxXSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqINCf0L7Qu9GD0YfQuNGC0Ywg0LvRg9GH0YjQuNC5INC80LDRgNGI0YDRg9GCXG4gICAgICogQHJldHVybnMg0LvRg9GH0YjQuNC5INC80LDRgNGI0YDRg9GCXG4gICAgICovXG4gICAgZ2V0QmVzdFRyYWlsKCkge1xuICAgICAgICBsZXQgYmVzdExlbmd0aCA9IHRoaXMuZ2V0VHJhaWxTdW1tYXJ5RGlzdGFuY2UodGhpcy5hbnRzWzBdKTtcbiAgICAgICAgbGV0IGluZGV4QmVzdExlbmd0aCA9IDA7XG4gICAgICAgIGZvciAobGV0IGsgPSAxOyBrIDwgdGhpcy5hbnRzLmxlbmd0aDsgKytrKSB7XG4gICAgICAgICAgICBsZXQgbGVuID0gdGhpcy5nZXRUcmFpbFN1bW1hcnlEaXN0YW5jZSh0aGlzLmFudHNba10pO1xuICAgICAgICAgICAgaWYgKGxlbiA8IGJlc3RMZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBiZXN0TGVuZ3RoID0gbGVuO1xuICAgICAgICAgICAgICAgIGluZGV4QmVzdExlbmd0aCA9IGs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFsuLi50aGlzLmFudHNbaW5kZXhCZXN0TGVuZ3RoXV07XG4gICAgfVxuICAgIC8qKlxuICAgICAqINCh0LPQtdC90LXQvdGA0LjRgNC+0LLQsNGC0Ywg0LzRg9GA0LDQstGM0LXQslxuICAgICAqIEByZXR1cm5zINGB0L/QuNGB0L7QuiDQvNGD0YDQsNCy0YzQtdCyXG4gICAgICovXG4gICAgaW5pdEFudHMoYW50Q291bnQpIHtcbiAgICAgICAgbGV0IGFudHMgPSBBcnJheShhbnRDb3VudCk7XG4gICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgYW50Q291bnQ7IGsrKykge1xuICAgICAgICAgICAgbGV0IHN0YXJ0ID0gcmFuZG9tSW50KDAsIHRoaXMubnVtQ2l0aWVzKTtcbiAgICAgICAgICAgIGFudHNba10gPSB0aGlzLnJhbmRvbVRyYWlsKHN0YXJ0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYW50cztcbiAgICB9XG4gICAgLyoqXG4gICAgICog0KHQs9C10L3QtdGA0LjRgNC+0LLQsNGC0Ywg0YHQu9GD0YfQsNC50L3Ri9C5INC80LDRgNGI0YDRg9GCXG4gICAgICogQHBhcmFtIHN0YXJ0INC90LDRh9Cw0LvRjNC90YvQuSDQs9C+0YDQvtC0XG4gICAgICogQHBhcmFtIG51bUNpdGllcyDQutC+0LvQuNGH0LXRgdGC0LLQviDQs9C+0YDQvtC00L7QslxuICAgICAqIEByZXR1cm5zINGB0LvRg9GH0LDQudC90YvQuSDQvNCw0YDRiNGA0YPRglxuICAgICAqL1xuICAgIHJhbmRvbVRyYWlsKHN0YXJ0KSB7XG4gICAgICAgIC8vINCT0LXQvdC10YDQuNGA0YPQtdC8INC80LDRgNGI0YDRg9GCINGH0LXRgNC10Lcg0LLRgdC1INCz0L7RgNC+0LTQsFxuICAgICAgICBsZXQgdHJhaWwgPSBbLi4uQXJyYXkodGhpcy5udW1DaXRpZXMpLmtleXMoKV07XG4gICAgICAgIC8vINCf0LXRgNC10LzQtdGI0LjQstCw0LXQvCDQvNCw0YDRiNGA0YPRglxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubnVtQ2l0aWVzOyArK2kpIHtcbiAgICAgICAgICAgIGxldCByID0gcmFuZG9tSW50KGksIHRoaXMubnVtQ2l0aWVzKTtcbiAgICAgICAgICAgIGxldCB0bXAgPSB0cmFpbFtyXTtcbiAgICAgICAgICAgIHRyYWlsW3JdID0gdHJhaWxbaV07XG4gICAgICAgICAgICB0cmFpbFtpXSA9IHRtcDtcbiAgICAgICAgfVxuICAgICAgICAvLyDQn9C+0YHQu9C1INC/0LXRgNC10LzQtdGI0LjQstCw0L3QuNGPINCy0L7Qt9Cy0YDQsNGJ0LDQtdC8INCyINC90LDRh9Cw0LvQviDRgdGC0LDRgNGC0L7QstGL0Lkg0LPQvtGA0L7QtFxuICAgICAgICBsZXQgaWR4ID0gdHJhaWwuZmluZEluZGV4KChjaXR5KSA9PiBjaXR5ID09IHN0YXJ0KTtcbiAgICAgICAgbGV0IHRlbXAgPSB0cmFpbFswXTtcbiAgICAgICAgdHJhaWxbMF0gPSB0cmFpbFtpZHhdO1xuICAgICAgICB0cmFpbFtpZHhdID0gdGVtcDtcbiAgICAgICAgcmV0dXJuIHRyYWlsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDQmNC90LjRhtC40LDQu9C40LfQuNGA0L7QstCw0YLRjCDRhNC10YDQvtC80L7QvdGLXG4gICAgICovXG4gICAgaW5pdFBoZXJvbW9uZXMoKSB7XG4gICAgICAgIHRoaXMucGhlcm9tb25lcyA9IEFycmF5KHRoaXMubnVtQ2l0aWVzKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm51bUNpdGllczsgKytpKVxuICAgICAgICAgICAgdGhpcy5waGVyb21vbmVzW2ldID0gQXJyYXkodGhpcy5udW1DaXRpZXMpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGhlcm9tb25lcy5sZW5ndGg7ICsraSlcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5waGVyb21vbmVzW2ldLmxlbmd0aDsgKytqKVxuICAgICAgICAgICAgICAgIHRoaXMucGhlcm9tb25lc1tpXVtqXSA9IDAuMDE7XG4gICAgfVxuICAgIC8qKlxuICAgICAqINCe0LHQvdC+0LLQuNGC0Ywg0LzQsNGA0YjRgNGD0YLRiyDQvNGD0YDQsNCy0YzQtdCyXG4gICAgICovXG4gICAgdXBkYXRlQW50cygpIHtcbiAgICAgICAgLy8g0JLQtdGA0L7Rj9GC0L3QvtGB0YLRjCDQv9C10YDQtdC80LXRidC10L3QuNGPINC80YPRgNCw0LLRjNGPINCyINC70Y7QsdC+0Lkg0LTRgNGD0LPQvtC5INCz0L7RgNC+0LRcbiAgICAgICAgbGV0IG1vdmVQcm9icyA9IChrLCBjaXR5WCwgdmlzaXRlZCkgPT4ge1xuICAgICAgICAgICAgbGV0IHRhdWV0YSA9IEFycmF5KHRoaXMubnVtQ2l0aWVzKTtcbiAgICAgICAgICAgIGxldCBzdW0gPSAwLjA7XG4gICAgICAgICAgICAvLyBpIC0g0YHQvtGB0LXQtNC90LjQuSDQs9C+0YDQvtC0XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhdWV0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChpID09IGNpdHlYKVxuICAgICAgICAgICAgICAgICAgICB0YXVldGFbaV0gPSAwLjA7IC8vINC90LXQu9GM0LfRjyDQv9C10YDQtdC80LXRidCw0YLRjNGB0Y8g0LIg0YLQvtGCLdC20LUg0YHQsNC80YvQuSDQs9C+0YDQvtC0XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodmlzaXRlZFtpXSA9PSB0cnVlKVxuICAgICAgICAgICAgICAgICAgICB0YXVldGFbaV0gPSAwLjA7IC8vINC90LXQu9GM0LfRjyDQv9C10YDQtdC80LXRidCw0YLRjNGB0Y8g0LIg0YPQttC1INC/0L7RgdC10YnQtdC90L3Ri9C5INCz0L7RgNC+0LRcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g0YDQsNGB0YfQtdGCINCy0LXRgNC+0Y/RgtC90L7RgdGC0Lgg0L/QtdGA0LXQvNC10YnQtdC90LjRjyDQuCDQv9C+0LzQtdGJ0LXQvdC40LUg0LXRkSDQsiDQsNC00LXQutCy0LDRgtC90YvQtSDQs9GA0LDQvdC40YbRi1xuICAgICAgICAgICAgICAgICAgICB0YXVldGFbaV0gPVxuICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5wb3codGhpcy5waGVyb21vbmVzW2NpdHlYXVtpXSwgdGhpcy5hbHBoYSkgKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgucG93KDEuMCAvIHRoaXMuZ2V0RGlzdGFuY2UoY2l0eVgsIGkpLCB0aGlzLmJldGEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGF1ZXRhW2ldIDwgMC4wMDAxKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGF1ZXRhW2ldID0gMC4wMDAxO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0YXVldGFbaV0gPiBOdW1iZXIuTUFYX1ZBTFVFIC8gKHRoaXMubnVtQ2l0aWVzICogMTAwKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhdWV0YVtpXSA9IE51bWJlci5NQVhfVkFMVUUgLyAodGhpcy5udW1DaXRpZXMgKiAxMDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdW0gKz0gdGF1ZXRhW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8g0LLQtdGA0L7Rj9GC0L3QvtGB0YLQuCDQv9C10YDQtdC80LXRidC10L3QuNGPXG4gICAgICAgICAgICBsZXQgcHJvYnMgPSBBcnJheSh0aGlzLm51bUNpdGllcyk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2JzLmxlbmd0aDsgKytpKVxuICAgICAgICAgICAgICAgIHByb2JzW2ldID0gdGF1ZXRhW2ldIC8gc3VtO1xuICAgICAgICAgICAgcmV0dXJuIHByb2JzO1xuICAgICAgICB9O1xuICAgICAgICAvLyDQkNC70LPQvtGA0LjRgtC8INCy0YvQsdC+0YDQsCDQs9C+0YDQvtC00LBcbiAgICAgICAgbGV0IG5leHRDaXR5ID0gKGssIGNpdHlYLCB2aXNpdGVkKSA9PiB7XG4gICAgICAgICAgICBsZXQgcHJvYnMgPSBtb3ZlUHJvYnMoaywgY2l0eVgsIHZpc2l0ZWQpO1xuICAgICAgICAgICAgbGV0IGN1bXVsID0gQXJyYXkocHJvYnMubGVuZ3RoICsgMSkuZmlsbCgwKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvYnMubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICAgICAgY3VtdWxbaSArIDFdID0gY3VtdWxbaV0gKyBwcm9ic1tpXTtcbiAgICAgICAgICAgIGxldCBwID0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3VtdWwubGVuZ3RoIC0gMTsgKytpKVxuICAgICAgICAgICAgICAgIGlmIChwID49IGN1bXVsW2ldICYmIHAgPCBjdW11bFtpICsgMV0pXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbHVyZSB0byByZXR1cm4gdmFsaWQgY2l0eSBpbiBOZXh0Q2l0eVwiKTtcbiAgICAgICAgfTtcbiAgICAgICAgLy8g0J/QvtGB0YLRgNC+0LXQvdC40LUg0L3QvtCy0L7Qs9C+INC80LDRgNGI0YDRg9GC0LAg0LTQu9GPINC80YPRgNCw0LLRjNGPXG4gICAgICAgIGxldCBidWlsZFRyYWlsID0gKGssIHN0YXJ0KSA9PiB7XG4gICAgICAgICAgICBsZXQgdHJhaWwgPSBBcnJheSh0aGlzLm51bUNpdGllcyk7XG4gICAgICAgICAgICBsZXQgdmlzaXRlZCA9IEFycmF5KHRoaXMubnVtQ2l0aWVzKTtcbiAgICAgICAgICAgIHRyYWlsWzBdID0gc3RhcnQ7XG4gICAgICAgICAgICB2aXNpdGVkW3N0YXJ0XSA9IHRydWU7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubnVtQ2l0aWVzIC0gMTsgKytpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNpdHlYID0gdHJhaWxbaV07XG4gICAgICAgICAgICAgICAgbGV0IG5leHQgPSBuZXh0Q2l0eShrLCBjaXR5WCwgdmlzaXRlZCk7XG4gICAgICAgICAgICAgICAgdHJhaWxbaSArIDFdID0gbmV4dDtcbiAgICAgICAgICAgICAgICB2aXNpdGVkW25leHRdID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cmFpbDtcbiAgICAgICAgfTtcbiAgICAgICAgLy8g0LrQsNC20LTQvtC80YMg0LzRg9GA0LDQstGM0Y4g0YHRgtGA0L7QuNGC0YHRjyDQvdC+0LLRi9C5INC80LDRgNGI0YDRg9GCXG4gICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgdGhpcy5hbnRzLmxlbmd0aDsgKytrKSB7XG4gICAgICAgICAgICBsZXQgc3RhcnQgPSByYW5kb21JbnQoMCwgdGhpcy5udW1DaXRpZXMpO1xuICAgICAgICAgICAgdGhpcy5hbnRzW2tdID0gYnVpbGRUcmFpbChrLCBzdGFydCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICog0J7QsdC90L7QstC70LXQvdC40LUg0LrQvtC70LjRh9C10YHRgtCy0LAg0YTQtdGA0L7QvNC+0L3QvtCyXG4gICAgICovXG4gICAgdXBkYXRlUGhlcm9tb25lcygpIHtcbiAgICAgICAgLyoqINCd0LDQu9C40YfQuNC1INC/0LXRgNC10YXQvtC00LAg0LzQtdC20LTRgyDQs9C+0YDQvtC00LDQvNC4INCyINC80LDRgNGI0YDRg9GC0LUgKi9cbiAgICAgICAgbGV0IEVkZ2VJblRyYWlsID0gKGNpdHlYLCBjaXR5WSwgdHJhaWwpID0+IHtcbiAgICAgICAgICAgIGxldCBpZHggPSB0cmFpbC5maW5kSW5kZXgoKGNpdHkpID0+IGNpdHkgPT0gY2l0eVgpO1xuICAgICAgICAgICAgbGV0IGlkeSA9IHRyYWlsLmZpbmRJbmRleCgoY2l0eSkgPT4gY2l0eSA9PSBjaXR5WSk7XG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoaWR4IC0gaWR5KSA9PSAxKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgZWxzZSBpZiAoaWR4ID09IDAgJiYgaWR5ID09IHRyYWlsLmxlbmd0aCAtIDEpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICBlbHNlIGlmIChpZHggPT0gdHJhaWwubGVuZ3RoIC0gMSAmJiBpZHkgPT0gMClcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgLy8g0YbQuNC60Lsg0L7QsdC90L7QstC70LXQvdC40Y8g0YTQtdGA0L7QvNC+0L3QvtCyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5waGVyb21vbmVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gaSArIDE7IGogPCB0aGlzLnBoZXJvbW9uZXNbaV0ubGVuZ3RoOyArK2opIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHRoaXMuYW50cy5sZW5ndGg7ICsraykge1xuICAgICAgICAgICAgICAgICAgICAvLyDQtNC70LjQvdCwINC/0YPRgtC4INC80YPRgNCw0LLRjNGPIGtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxlbmd0aCA9IHRoaXMuZ2V0VHJhaWxTdW1tYXJ5RGlzdGFuY2UodGhpcy5hbnRzW2tdKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRlY3JlYXNlID0gKDEuMCAtIHRoaXMucmhvKSAqIHRoaXMucGhlcm9tb25lc1tpXVtqXTtcbiAgICAgICAgICAgICAgICAgICAgLy8g0LXRgdC70Lgg0LzRg9GA0LDQstC10Lkg0L/QtdGA0LXRhdC+0LTQuNC7INC40Lcg0LPQvtGA0L7QtNCwIGkg0LIg0LPQvtGA0L7QtCBqXG4gICAgICAgICAgICAgICAgICAgIGxldCBpbmNyZWFzZSA9IDAuMDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKEVkZ2VJblRyYWlsKGksIGosIHRoaXMuYW50c1trXSkpXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmNyZWFzZSA9IHRoaXMuUSAvIGxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgLy8g0L7QsdC90L7QstC70LXQvdC40LUg0YTQtdGA0L7QvNC+0L3QvtCyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGhlcm9tb25lc1tpXVtqXSA9IGRlY3JlYXNlICsgaW5jcmVhc2U7XG4gICAgICAgICAgICAgICAgICAgIC8vINC/0L7QvNC10YnQtdC90LjRjyDQt9C90LDRh9C10L3QuNGPINGE0LXRgNC+0LzQvtC90L7QsiDQsiDQtNC+0L/Rg9GB0YLQuNC80YvQtSDQs9GA0LDQvdC40YbRi1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5waGVyb21vbmVzW2ldW2pdIDwgMC4wMDAxKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5waGVyb21vbmVzW2ldW2pdID0gMC4wMDAxO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLnBoZXJvbW9uZXNbaV1bal0gPiAxMDAwMDAuMClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGhlcm9tb25lc1tpXVtqXSA9IDEwMDAwMC4wO1xuICAgICAgICAgICAgICAgICAgICAvLyDQvNCw0YLRgNC40YbQsCDRhNC10YDQvtC80L7QvdC+0LIg0YHQuNC80LzQtdGC0YDQuNGH0L3QsFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBoZXJvbW9uZXNbal1baV0gPSB0aGlzLnBoZXJvbW9uZXNbaV1bal07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuY29uc3QgYW50Q29sb255T3B0aW1pemF0aW9uID0gbmV3IEFudENvbG9ueU9wdGltaXphdGlvbigpO1xuc2VsZi5vbm1lc3NhZ2UgPSAobWVzc2FnZSkgPT4ge1xuICAgIGxldCByZXF1ZXN0ID0gbWVzc2FnZS5kYXRhO1xuICAgIGFudENvbG9ueU9wdGltaXphdGlvbi5ydW4ocmVxdWVzdCk7XG59O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9