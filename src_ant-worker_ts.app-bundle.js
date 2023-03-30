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
            this.updateAnts();
            this.updatePheromones();
            //if(attempt % 50 == 0 || attempt < 100)
            //  this.sendMessage(false, bestTrail, bestLength);
            let currBestTrail = this.getBestTrail();
            let currBestLength = this.getTrailSummaryDistance(currBestTrail);
            if (currBestLength < bestLength) {
                this.sendMessage(false, bestTrail, bestLength);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQSx3QkFBd0Isc0JBQXNCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qiw0QkFBNEI7QUFDcEQsZ0NBQWdDLCtCQUErQjtBQUMvRCxnQ0FBZ0Msc0JBQXNCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hbnRjb2xvbnlvcHRpbWl6YXRpb24vLi9zcmMvbWVzc2FnZS1tb2RlbHMudHMiLCJ3ZWJwYWNrOi8vYW50Y29sb255b3B0aW1pemF0aW9uL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2FudGNvbG9ueW9wdGltaXphdGlvbi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYW50Y29sb255b3B0aW1pemF0aW9uL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYW50Y29sb255b3B0aW1pemF0aW9uL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYW50Y29sb255b3B0aW1pemF0aW9uLy4vc3JjL2FudC13b3JrZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIEFudFdvcmtlclJlc3BvbnNlIHtcbiAgICBjb25zdHJ1Y3RvcihmaW5hbCwgYW50cywgcGhlcm9tb25lcywgYmVzdCwgYmVzdExlbmd0aCkge1xuICAgICAgICB0aGlzLmZpbmFsID0gZmluYWw7XG4gICAgICAgIHRoaXMuYW50cyA9IGFudHM7XG4gICAgICAgIHRoaXMucGhlcm9tb25lcyA9IHBoZXJvbW9uZXM7XG4gICAgICAgIHRoaXMuYmVzdCA9IGJlc3Q7XG4gICAgICAgIHRoaXMuYmVzdExlbmd0aCA9IGJlc3RMZW5ndGg7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIEFudFdvcmtlclJlcXVlc3Qge1xuICAgIGNvbnN0cnVjdG9yKGdyYXBoLCBudW1BbnRzUGVyVmVydGV4LCBhdHRlbXB0cywgcGFyYW1BbHBoYSwgcGFyYW1CZXRhLCBwYXJhbVJobywgcGFyYW1RKSB7XG4gICAgICAgIHRoaXMuZ3JhcGggPSBncmFwaDtcbiAgICAgICAgdGhpcy5udW1BbnRzUGVyVmVydGV4ID0gbnVtQW50c1BlclZlcnRleDtcbiAgICAgICAgdGhpcy5hdHRlbXB0cyA9IGF0dGVtcHRzO1xuICAgICAgICB0aGlzLnBhcmFtQWxwaGEgPSBwYXJhbUFscGhhO1xuICAgICAgICB0aGlzLnBhcmFtQmV0YSA9IHBhcmFtQmV0YTtcbiAgICAgICAgdGhpcy5wYXJhbVJobyA9IHBhcmFtUmhvO1xuICAgICAgICB0aGlzLnBhcmFtUSA9IHBhcmFtUTtcbiAgICB9XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IEFudFdvcmtlclJlc3BvbnNlIH0gZnJvbSBcIi4vbWVzc2FnZS1tb2RlbHNcIjtcbi8qKlxuICogR2V0cyByYW5kb20gaW50XG4gKiBAcGFyYW0gbWluXG4gKiBAcGFyYW0gbWF4XG4gKiBAcmV0dXJucyByYW5kb20gaW50IC0gbWluICYgbWF4IGluY2x1c2l2ZVxuICovXG5mdW5jdGlvbiByYW5kb21JbnQobWluLCBtYXgpIHtcbiAgICBtaW4gPSBNYXRoLmNlaWwobWluKTtcbiAgICBtYXggPSBNYXRoLmZsb29yKG1heCk7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pKSArIG1pbjtcbn1cbmNsYXNzIEFudENvbG9ueU9wdGltaXphdGlvbiB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8qKiDQktC70LjRj9C90LjQtSDRhNC10YDQvtC80L7QvdCwINC90LAg0L3QsNC/0YDQsNCy0LvQtdC90LjQtSAqL1xuICAgICAgICB0aGlzLmFscGhhID0gMztcbiAgICAgICAgLyoqINCS0LvQuNGP0L3QuNC1INGA0LDRgdGB0YLQvtGP0L3QuNGPICovXG4gICAgICAgIHRoaXMuYmV0YSA9IDI7XG4gICAgICAgIC8qKiDQutC+0Y3RhNGE0LjRhtC40LXQvdGCINC40YHQv9Cw0YDQtdC90LjRjyDRhNC10YDQvtC80L7QvdC+0LIgKi9cbiAgICAgICAgdGhpcy5yaG8gPSAwLjAxO1xuICAgICAgICAvKiog0JrQvtGN0YTRhNC40YbQuNC10L3RgiDQstGL0YDQsNCx0L7RgtC60Lgg0YTQtdGA0L7QvNC+0L3QvtCyICovXG4gICAgICAgIHRoaXMuUSA9IDI7XG4gICAgICAgIC8qKiDQoNCw0YHRgdGC0L7Rj9C90LjQtSDQvNC10LbQtNGDINCz0L7RgNC+0LTQsNC80LggKi9cbiAgICAgICAgdGhpcy5kaXN0YW5jZXMgPSBbXTtcbiAgICAgICAgLyoqINCc0YPRgNCw0LLRjNC4ICovXG4gICAgICAgIHRoaXMuYW50cyA9IFtdO1xuICAgICAgICAvKiog0KTQtdGA0L7QvNC+0L3RiyAqL1xuICAgICAgICB0aGlzLnBoZXJvbW9uZXMgPSBbXTtcbiAgICB9XG4gICAgLyoqINCa0L7Qu9C40YfQtdGB0YLQstC+INC80YPRgNCw0LLRjNC10LIg0L3QsCDQutCw0LbQtNGL0Lkg0LPQvtGA0L7QtCAqL1xuICAgIGdldCBudW1BbnRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hbnRzLmxlbmd0aDtcbiAgICB9XG4gICAgLyoqINCa0L7Qu9C40YfQtdGB0YLQstC+INCz0L7RgNC+0LTQvtCyICovXG4gICAgZ2V0IG51bUNpdGllcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlzdGFuY2VzLmxlbmd0aDtcbiAgICB9XG4gICAgLyoqXG4gICAgICog0J7RgtC/0YDQsNCy0LrQsCDRgtC10LrRg9GJ0LXQs9C+INGB0L7RgdGC0L7Rj9C90LjRjyDRgNCw0YHRh9C10YLQsCDQvtGB0L3QvtCy0L3QvtC80YMg0L/RgNC40LvQvtC20LXQvdC40Y5cbiAgICAgKiBAcGFyYW0gZmluYWwg0LLRi9GH0LjRgdC70LXQvdC40Y8g0L7QutC+0L3Rh9C10L3Ri1xuICAgICAqIEBwYXJhbSBiZXN0VHJhaWwg0LvRg9GH0YjQuNC5INC80LDRgNGI0YDRg9GCXG4gICAgICogQHBhcmFtIGJlc3RMZW5ndGgg0LTQuNGB0YLQsNC90YbQuNGPINC70YPRh9GI0LXQs9C+INC80LDRgNGI0YDRg9GC0LBcbiAgICAgKi9cbiAgICBzZW5kTWVzc2FnZShmaW5hbCwgYmVzdFRyYWlsLCBiZXN0TGVuZ3RoKSB7XG4gICAgICAgIHNlbGYucG9zdE1lc3NhZ2UobmV3IEFudFdvcmtlclJlc3BvbnNlKGZpbmFsLCB0aGlzLmFudHMsIHRoaXMucGhlcm9tb25lcywgYmVzdFRyYWlsLCBiZXN0TGVuZ3RoKSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqINCX0LDQv9GD0YHQuiDQvNGD0YDQsNCy0YzQuNC90L7Qs9C+INCw0LvQs9C+0YDQuNGC0LzQsFxuICAgICAqIEBwYXJhbSBjaXRpZXNNYXRyaXgg0YHQv9C40YHQvtC6INGA0LDRgdGB0YLQvtGP0L3QuNC5INC80LXQttC00YMg0LPQvtGA0L7QtNCw0LzQuFxuICAgICAqIEBwYXJhbSBhbnRDb3VudCDQutC+0LvQuNGH0LXRgdGC0LLQviDQvNGD0YDQsNCy0YzQtdCyINCyINC60LDQttC00L7QvCDQuNC3INCz0L7RgNC+0LTQvtCyXG4gICAgICovXG4gICAgcnVuKGRhdGEpIHtcbiAgICAgICAgdGhpcy5kaXN0YW5jZXMgPSBkYXRhLmdyYXBoO1xuICAgICAgICB0aGlzLmFudHMgPSB0aGlzLmluaXRBbnRzKGRhdGEubnVtQW50c1BlclZlcnRleCk7XG4gICAgICAgIGxldCBtYXhBdHRlbXB0cyA9IGRhdGEuYXR0ZW1wdHM7XG4gICAgICAgIHRoaXMuYWxwaGEgPSBkYXRhLnBhcmFtQWxwaGE7XG4gICAgICAgIHRoaXMuYmV0YSA9IGRhdGEucGFyYW1CZXRhO1xuICAgICAgICB0aGlzLnJobyA9IGRhdGEucGFyYW1SaG87XG4gICAgICAgIHRoaXMuUSA9IGRhdGEucGFyYW1RO1xuICAgICAgICB0aGlzLmluaXRQaGVyb21vbmVzKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwi0KfQuNGB0LvQviDQs9C+0YDQvtC00L7QsiA9IFwiICsgdGhpcy5udW1DaXRpZXMpO1xuICAgICAgICBjb25zb2xlLmxvZyhcItCn0LjRgdC70L4g0LzRg9GA0LDQstGM0LXQsiA9IFwiICsgdGhpcy5udW1BbnRzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJBbHBoYSA9IFwiICsgdGhpcy5hbHBoYSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQmV0YSA9IFwiICsgdGhpcy5iZXRhKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJSaG8gPSBcIiArIHRoaXMucmhvKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJRID0gXCIgKyB0aGlzLlEpO1xuICAgICAgICBsZXQgYmVzdFRyYWlsID0gdGhpcy5nZXRCZXN0VHJhaWwoKTtcbiAgICAgICAgbGV0IGJlc3RMZW5ndGggPSB0aGlzLmdldFRyYWlsU3VtbWFyeURpc3RhbmNlKGJlc3RUcmFpbCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwi0JjQt9C90LDRh9Cw0LvRjNC90YvQuSDQu9GD0YfRiNC40Lkg0L/Rg9GC0Yw6IFwiICsgYmVzdExlbmd0aCk7XG4gICAgICAgIGxldCBhdHRlbXB0ID0gMDtcbiAgICAgICAgY29uc29sZS5sb2coXCLQl9Cw0L/Rg9GB0Log0LDQu9Cz0L7RgNC40YLQvNCwXCIpO1xuICAgICAgICB3aGlsZSAoYXR0ZW1wdCA8IG1heEF0dGVtcHRzKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUFudHMoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGhlcm9tb25lcygpO1xuICAgICAgICAgICAgLy9pZihhdHRlbXB0ICUgNTAgPT0gMCB8fCBhdHRlbXB0IDwgMTAwKVxuICAgICAgICAgICAgLy8gIHRoaXMuc2VuZE1lc3NhZ2UoZmFsc2UsIGJlc3RUcmFpbCwgYmVzdExlbmd0aCk7XG4gICAgICAgICAgICBsZXQgY3VyckJlc3RUcmFpbCA9IHRoaXMuZ2V0QmVzdFRyYWlsKCk7XG4gICAgICAgICAgICBsZXQgY3VyckJlc3RMZW5ndGggPSB0aGlzLmdldFRyYWlsU3VtbWFyeURpc3RhbmNlKGN1cnJCZXN0VHJhaWwpO1xuICAgICAgICAgICAgaWYgKGN1cnJCZXN0TGVuZ3RoIDwgYmVzdExlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UoZmFsc2UsIGJlc3RUcmFpbCwgYmVzdExlbmd0aCk7XG4gICAgICAgICAgICAgICAgYmVzdExlbmd0aCA9IGN1cnJCZXN0TGVuZ3RoO1xuICAgICAgICAgICAgICAgIGJlc3RUcmFpbCA9IGN1cnJCZXN0VHJhaWw7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCLQndC+0LLQsNGPINC70YPRh9GI0LDRjyDQtNC70LzQvdCwIFwiICsgYmVzdExlbmd0aCArIFwiINGH0LjRgdC70L4g0L/QvtC/0YvRgtC+0Lo6IFwiICsgYXR0ZW1wdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhdHRlbXB0Kys7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCLQm9GD0YfRiNC40Lkg0L/Rg9GC0Ywg0L3QsNC50LTQtdC9OiBcIik7XG4gICAgICAgIGNvbnNvbGUubG9nKGJlc3RUcmFpbCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwi0JTQu9C40L3QsCDQu9GD0YfRiNC10LPQviDQv9GD0YLQuDogXCIgKyBiZXN0TGVuZ3RoKTtcbiAgICAgICAgdGhpcy5zZW5kTWVzc2FnZSh0cnVlLCBiZXN0VHJhaWwsIGJlc3RMZW5ndGgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDQn9C+0LvRg9GH0LjRgtGMINGA0LDRgdGB0YLQvtGP0L3QuNC1INC80LXQttC00YMg0LPQvtGA0L7QtNCw0LzQuFxuICAgICAqIEBwYXJhbSBjaXR5WCDQs9C+0YDQvtC0XG4gICAgICogQHBhcmFtIGNpdHlZINC00YDRg9Cz0L7QuSDQs9C+0YDQvtC0XG4gICAgICogQHJldHVybnMg0YDQsNGB0YHRgtC+0Y/QtdC90LjQtSDQvNC10LbQtNGDINCz0L7RgNC+0LTQsNC80LhcbiAgICAgKi9cbiAgICBnZXREaXN0YW5jZShjaXR5WCwgY2l0eVkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlzdGFuY2VzW2NpdHlYXVtjaXR5WV07XG4gICAgfVxuICAgIC8qKlxuICAgICAqINCf0L7Qu9GD0YfQuNGC0Ywg0L7QsdGJ0LXQtSDRgNCw0YHRgdGC0L7Rj9C90LjQtSDQvNCw0YDRiNGA0YPRgtCwXG4gICAgICogQHBhcmFtIHRyYWlsINC80LDRgNGI0YDRg9GCXG4gICAgICogQHJldHVybnMg0L7QsdGJ0LXQtSDRgNCw0YHRgdGC0L7Rj9C90LjQtVxuICAgICAqL1xuICAgIGdldFRyYWlsU3VtbWFyeURpc3RhbmNlKHRyYWlsKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyYWlsLmxlbmd0aCAtIDE7ICsraSlcbiAgICAgICAgICAgIHJlc3VsdCArPSB0aGlzLmdldERpc3RhbmNlKHRyYWlsW2ldLCB0cmFpbFtpICsgMV0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDQn9C+0LvRg9GH0LjRgtGMINC70YPRh9GI0LjQuSDQvNCw0YDRiNGA0YPRglxuICAgICAqIEByZXR1cm5zINC70YPRh9GI0LjQuSDQvNCw0YDRiNGA0YPRglxuICAgICAqL1xuICAgIGdldEJlc3RUcmFpbCgpIHtcbiAgICAgICAgbGV0IGJlc3RMZW5ndGggPSB0aGlzLmdldFRyYWlsU3VtbWFyeURpc3RhbmNlKHRoaXMuYW50c1swXSk7XG4gICAgICAgIGxldCBpbmRleEJlc3RMZW5ndGggPSAwO1xuICAgICAgICBmb3IgKGxldCBrID0gMTsgayA8IHRoaXMuYW50cy5sZW5ndGg7ICsraykge1xuICAgICAgICAgICAgbGV0IGxlbiA9IHRoaXMuZ2V0VHJhaWxTdW1tYXJ5RGlzdGFuY2UodGhpcy5hbnRzW2tdKTtcbiAgICAgICAgICAgIGlmIChsZW4gPCBiZXN0TGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgYmVzdExlbmd0aCA9IGxlbjtcbiAgICAgICAgICAgICAgICBpbmRleEJlc3RMZW5ndGggPSBrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbLi4udGhpcy5hbnRzW2luZGV4QmVzdExlbmd0aF1dO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDQodCz0LXQvdC10L3RgNC40YDQvtCy0LDRgtGMINC80YPRgNCw0LLRjNC10LJcbiAgICAgKiBAcmV0dXJucyDRgdC/0LjRgdC+0Log0LzRg9GA0LDQstGM0LXQslxuICAgICAqL1xuICAgIGluaXRBbnRzKGFudENvdW50KSB7XG4gICAgICAgIGxldCBhbnRzID0gQXJyYXkoYW50Q291bnQpO1xuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGFudENvdW50OyBrKyspIHtcbiAgICAgICAgICAgIGxldCBzdGFydCA9IHJhbmRvbUludCgwLCB0aGlzLm51bUNpdGllcyk7XG4gICAgICAgICAgICBhbnRzW2tdID0gdGhpcy5yYW5kb21UcmFpbChzdGFydCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFudHM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqINCh0LPQtdC90LXRgNC40YDQvtCy0LDRgtGMINGB0LvRg9GH0LDQudC90YvQuSDQvNCw0YDRiNGA0YPRglxuICAgICAqIEBwYXJhbSBzdGFydCDQvdCw0YfQsNC70YzQvdGL0Lkg0LPQvtGA0L7QtFxuICAgICAqIEBwYXJhbSBudW1DaXRpZXMg0LrQvtC70LjRh9C10YHRgtCy0L4g0LPQvtGA0L7QtNC+0LJcbiAgICAgKiBAcmV0dXJucyDRgdC70YPRh9Cw0LnQvdGL0Lkg0LzQsNGA0YjRgNGD0YJcbiAgICAgKi9cbiAgICByYW5kb21UcmFpbChzdGFydCkge1xuICAgICAgICAvLyDQk9C10L3QtdGA0LjRgNGD0LXQvCDQvNCw0YDRiNGA0YPRgiDRh9C10YDQtdC3INCy0YHQtSDQs9C+0YDQvtC00LBcbiAgICAgICAgbGV0IHRyYWlsID0gWy4uLkFycmF5KHRoaXMubnVtQ2l0aWVzKS5rZXlzKCldO1xuICAgICAgICAvLyDQn9C10YDQtdC80LXRiNC40LLQsNC10Lwg0LzQsNGA0YjRgNGD0YJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm51bUNpdGllczsgKytpKSB7XG4gICAgICAgICAgICBsZXQgciA9IHJhbmRvbUludChpLCB0aGlzLm51bUNpdGllcyk7XG4gICAgICAgICAgICBsZXQgdG1wID0gdHJhaWxbcl07XG4gICAgICAgICAgICB0cmFpbFtyXSA9IHRyYWlsW2ldO1xuICAgICAgICAgICAgdHJhaWxbaV0gPSB0bXA7XG4gICAgICAgIH1cbiAgICAgICAgLy8g0J/QvtGB0LvQtSDQv9C10YDQtdC80LXRiNC40LLQsNC90LjRjyDQstC+0LfQstGA0LDRidCw0LXQvCDQsiDQvdCw0YfQsNC70L4g0YHRgtCw0YDRgtC+0LLRi9C5INCz0L7RgNC+0LRcbiAgICAgICAgbGV0IGlkeCA9IHRyYWlsLmZpbmRJbmRleCgoY2l0eSkgPT4gY2l0eSA9PSBzdGFydCk7XG4gICAgICAgIGxldCB0ZW1wID0gdHJhaWxbMF07XG4gICAgICAgIHRyYWlsWzBdID0gdHJhaWxbaWR4XTtcbiAgICAgICAgdHJhaWxbaWR4XSA9IHRlbXA7XG4gICAgICAgIHJldHVybiB0cmFpbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICog0JjQvdC40YbQuNCw0LvQuNC30LjRgNC+0LLQsNGC0Ywg0YTQtdGA0L7QvNC+0L3Ri1xuICAgICAqL1xuICAgIGluaXRQaGVyb21vbmVzKCkge1xuICAgICAgICB0aGlzLnBoZXJvbW9uZXMgPSBBcnJheSh0aGlzLm51bUNpdGllcyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5udW1DaXRpZXM7ICsraSlcbiAgICAgICAgICAgIHRoaXMucGhlcm9tb25lc1tpXSA9IEFycmF5KHRoaXMubnVtQ2l0aWVzKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBoZXJvbW9uZXMubGVuZ3RoOyArK2kpXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMucGhlcm9tb25lc1tpXS5sZW5ndGg7ICsrailcbiAgICAgICAgICAgICAgICB0aGlzLnBoZXJvbW9uZXNbaV1bal0gPSAwLjAxO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDQntCx0L3QvtCy0LjRgtGMINC80LDRgNGI0YDRg9GC0Ysg0LzRg9GA0LDQstGM0LXQslxuICAgICAqL1xuICAgIHVwZGF0ZUFudHMoKSB7XG4gICAgICAgIC8vINCS0LXRgNC+0Y/RgtC90L7RgdGC0Ywg0L/QtdGA0LXQvNC10YnQtdC90LjRjyDQvNGD0YDQsNCy0YzRjyDQsiDQu9GO0LHQvtC5INC00YDRg9Cz0L7QuSDQs9C+0YDQvtC0XG4gICAgICAgIGxldCBtb3ZlUHJvYnMgPSAoaywgY2l0eVgsIHZpc2l0ZWQpID0+IHtcbiAgICAgICAgICAgIGxldCB0YXVldGEgPSBBcnJheSh0aGlzLm51bUNpdGllcyk7XG4gICAgICAgICAgICBsZXQgc3VtID0gMC4wO1xuICAgICAgICAgICAgLy8gaSAtINGB0L7RgdC10LTQvdC40Lkg0LPQvtGA0L7QtFxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YXVldGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSBjaXR5WClcbiAgICAgICAgICAgICAgICAgICAgdGF1ZXRhW2ldID0gMC4wOyAvLyDQvdC10LvRjNC30Y8g0L/QtdGA0LXQvNC10YnQsNGC0YzRgdGPINCyINGC0L7Rgi3QttC1INGB0LDQvNGL0Lkg0LPQvtGA0L7QtFxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHZpc2l0ZWRbaV0gPT0gdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgdGF1ZXRhW2ldID0gMC4wOyAvLyDQvdC10LvRjNC30Y8g0L/QtdGA0LXQvNC10YnQsNGC0YzRgdGPINCyINGD0LbQtSDQv9C+0YHQtdGJ0LXQvdC90YvQuSDQs9C+0YDQvtC0XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vINGA0LDRgdGH0LXRgiDQstC10YDQvtGP0YLQvdC+0YHRgtC4INC/0LXRgNC10LzQtdGJ0LXQvdC40Y8g0Lgg0L/QvtC80LXRidC10L3QuNC1INC10ZEg0LIg0LDQtNC10LrQstCw0YLQvdGL0LUg0LPRgNCw0L3QuNGG0YtcbiAgICAgICAgICAgICAgICAgICAgdGF1ZXRhW2ldID1cbiAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgucG93KHRoaXMucGhlcm9tb25lc1tjaXR5WF1baV0sIHRoaXMuYWxwaGEpICpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnBvdygxLjAgLyB0aGlzLmdldERpc3RhbmNlKGNpdHlYLCBpKSwgdGhpcy5iZXRhKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhdWV0YVtpXSA8IDAuMDAwMSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhdWV0YVtpXSA9IDAuMDAwMTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGF1ZXRhW2ldID4gTnVtYmVyLk1BWF9WQUxVRSAvICh0aGlzLm51bUNpdGllcyAqIDEwMCkpXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXVldGFbaV0gPSBOdW1iZXIuTUFYX1ZBTFVFIC8gKHRoaXMubnVtQ2l0aWVzICogMTAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3VtICs9IHRhdWV0YVtpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vINCy0LXRgNC+0Y/RgtC90L7RgdGC0Lgg0L/QtdGA0LXQvNC10YnQtdC90LjRj1xuICAgICAgICAgICAgbGV0IHByb2JzID0gQXJyYXkodGhpcy5udW1DaXRpZXMpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9icy5sZW5ndGg7ICsraSlcbiAgICAgICAgICAgICAgICBwcm9ic1tpXSA9IHRhdWV0YVtpXSAvIHN1bTtcbiAgICAgICAgICAgIHJldHVybiBwcm9icztcbiAgICAgICAgfTtcbiAgICAgICAgLy8g0JDQu9Cz0L7RgNC40YLQvCDQstGL0LHQvtGA0LAg0LPQvtGA0L7QtNCwXG4gICAgICAgIGxldCBuZXh0Q2l0eSA9IChrLCBjaXR5WCwgdmlzaXRlZCkgPT4ge1xuICAgICAgICAgICAgbGV0IHByb2JzID0gbW92ZVByb2JzKGssIGNpdHlYLCB2aXNpdGVkKTtcbiAgICAgICAgICAgIGxldCBjdW11bCA9IEFycmF5KHByb2JzLmxlbmd0aCArIDEpLmZpbGwoMCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2JzLmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgICAgIGN1bXVsW2kgKyAxXSA9IGN1bXVsW2ldICsgcHJvYnNbaV07XG4gICAgICAgICAgICBsZXQgcCA9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN1bXVsLmxlbmd0aCAtIDE7ICsraSlcbiAgICAgICAgICAgICAgICBpZiAocCA+PSBjdW11bFtpXSAmJiBwIDwgY3VtdWxbaSArIDFdKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZhaWx1cmUgdG8gcmV0dXJuIHZhbGlkIGNpdHkgaW4gTmV4dENpdHlcIik7XG4gICAgICAgIH07XG4gICAgICAgIC8vINCf0L7RgdGC0YDQvtC10L3QuNC1INC90L7QstC+0LPQviDQvNCw0YDRiNGA0YPRgtCwINC00LvRjyDQvNGD0YDQsNCy0YzRj1xuICAgICAgICBsZXQgYnVpbGRUcmFpbCA9IChrLCBzdGFydCkgPT4ge1xuICAgICAgICAgICAgbGV0IHRyYWlsID0gQXJyYXkodGhpcy5udW1DaXRpZXMpO1xuICAgICAgICAgICAgbGV0IHZpc2l0ZWQgPSBBcnJheSh0aGlzLm51bUNpdGllcyk7XG4gICAgICAgICAgICB0cmFpbFswXSA9IHN0YXJ0O1xuICAgICAgICAgICAgdmlzaXRlZFtzdGFydF0gPSB0cnVlO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm51bUNpdGllcyAtIDE7ICsraSkge1xuICAgICAgICAgICAgICAgIGxldCBjaXR5WCA9IHRyYWlsW2ldO1xuICAgICAgICAgICAgICAgIGxldCBuZXh0ID0gbmV4dENpdHkoaywgY2l0eVgsIHZpc2l0ZWQpO1xuICAgICAgICAgICAgICAgIHRyYWlsW2kgKyAxXSA9IG5leHQ7XG4gICAgICAgICAgICAgICAgdmlzaXRlZFtuZXh0XSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJhaWw7XG4gICAgICAgIH07XG4gICAgICAgIC8vINC60LDQttC00L7QvNGDINC80YPRgNCw0LLRjNGOINGB0YLRgNC+0LjRgtGB0Y8g0L3QvtCy0YvQuSDQvNCw0YDRiNGA0YPRglxuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHRoaXMuYW50cy5sZW5ndGg7ICsraykge1xuICAgICAgICAgICAgbGV0IHN0YXJ0ID0gcmFuZG9tSW50KDAsIHRoaXMubnVtQ2l0aWVzKTtcbiAgICAgICAgICAgIHRoaXMuYW50c1trXSA9IGJ1aWxkVHJhaWwoaywgc3RhcnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqINCe0LHQvdC+0LLQu9C10L3QuNC1INC60L7Qu9C40YfQtdGB0YLQstCwINGE0LXRgNC+0LzQvtC90L7QslxuICAgICAqL1xuICAgIHVwZGF0ZVBoZXJvbW9uZXMoKSB7XG4gICAgICAgIC8qKiDQndCw0LvQuNGH0LjQtSDQv9C10YDQtdGF0L7QtNCwINC80LXQttC00YMg0LPQvtGA0L7QtNCw0LzQuCDQsiDQvNCw0YDRiNGA0YPRgtC1ICovXG4gICAgICAgIGxldCBFZGdlSW5UcmFpbCA9IChjaXR5WCwgY2l0eVksIHRyYWlsKSA9PiB7XG4gICAgICAgICAgICBsZXQgaWR4ID0gdHJhaWwuZmluZEluZGV4KChjaXR5KSA9PiBjaXR5ID09IGNpdHlYKTtcbiAgICAgICAgICAgIGxldCBpZHkgPSB0cmFpbC5maW5kSW5kZXgoKGNpdHkpID0+IGNpdHkgPT0gY2l0eVkpO1xuICAgICAgICAgICAgaWYgKE1hdGguYWJzKGlkeCAtIGlkeSkgPT0gMSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIGVsc2UgaWYgKGlkeCA9PSAwICYmIGlkeSA9PSB0cmFpbC5sZW5ndGggLSAxKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgZWxzZSBpZiAoaWR4ID09IHRyYWlsLmxlbmd0aCAtIDEgJiYgaWR5ID09IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICAgIC8vINGG0LjQutC7INC+0LHQvdC+0LLQu9C10L3QuNGPINGE0LXRgNC+0LzQvtC90L7QslxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGhlcm9tb25lcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IGkgKyAxOyBqIDwgdGhpcy5waGVyb21vbmVzW2ldLmxlbmd0aDsgKytqKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCB0aGlzLmFudHMubGVuZ3RoOyArK2spIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g0LTQu9C40L3QsCDQv9GD0YLQuCDQvNGD0YDQsNCy0YzRjyBrXG4gICAgICAgICAgICAgICAgICAgIGxldCBsZW5ndGggPSB0aGlzLmdldFRyYWlsU3VtbWFyeURpc3RhbmNlKHRoaXMuYW50c1trXSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkZWNyZWFzZSA9ICgxLjAgLSB0aGlzLnJobykgKiB0aGlzLnBoZXJvbW9uZXNbaV1bal07XG4gICAgICAgICAgICAgICAgICAgIC8vINC10YHQu9C4INC80YPRgNCw0LLQtdC5INC/0LXRgNC10YXQvtC00LjQuyDQuNC3INCz0L7RgNC+0LTQsCBpINCyINCz0L7RgNC+0LQgalxuICAgICAgICAgICAgICAgICAgICBsZXQgaW5jcmVhc2UgPSAwLjA7XG4gICAgICAgICAgICAgICAgICAgIGlmIChFZGdlSW5UcmFpbChpLCBqLCB0aGlzLmFudHNba10pKVxuICAgICAgICAgICAgICAgICAgICAgICAgaW5jcmVhc2UgPSB0aGlzLlEgLyBsZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIC8vINC+0LHQvdC+0LLQu9C10L3QuNC1INGE0LXRgNC+0LzQvtC90L7QslxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBoZXJvbW9uZXNbaV1bal0gPSBkZWNyZWFzZSArIGluY3JlYXNlO1xuICAgICAgICAgICAgICAgICAgICAvLyDQv9C+0LzQtdGJ0LXQvdC40Y8g0LfQvdCw0YfQtdC90LjRjyDRhNC10YDQvtC80L7QvdC+0LIg0LIg0LTQvtC/0YPRgdGC0LjQvNGL0LUg0LPRgNCw0L3QuNGG0YtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGhlcm9tb25lc1tpXVtqXSA8IDAuMDAwMSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGhlcm9tb25lc1tpXVtqXSA9IDAuMDAwMTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5waGVyb21vbmVzW2ldW2pdID4gMTAwMDAwLjApXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBoZXJvbW9uZXNbaV1bal0gPSAxMDAwMDAuMDtcbiAgICAgICAgICAgICAgICAgICAgLy8g0LzQsNGC0YDQuNGG0LAg0YTQtdGA0L7QvNC+0L3QvtCyINGB0LjQvNC80LXRgtGA0LjRh9C90LBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5waGVyb21vbmVzW2pdW2ldID0gdGhpcy5waGVyb21vbmVzW2ldW2pdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbmNvbnN0IGFudENvbG9ueU9wdGltaXphdGlvbiA9IG5ldyBBbnRDb2xvbnlPcHRpbWl6YXRpb24oKTtcbnNlbGYub25tZXNzYWdlID0gKG1lc3NhZ2UpID0+IHtcbiAgICBsZXQgcmVxdWVzdCA9IG1lc3NhZ2UuZGF0YTtcbiAgICBhbnRDb2xvbnlPcHRpbWl6YXRpb24ucnVuKHJlcXVlc3QpO1xufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==