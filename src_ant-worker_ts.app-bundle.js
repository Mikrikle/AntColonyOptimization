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
            if (attempt % 50 == 0)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0Esd0JBQXdCLHNCQUFzQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsNEJBQTRCO0FBQ3BELGdDQUFnQywrQkFBK0I7QUFDL0QsZ0NBQWdDLHNCQUFzQjtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYW50Y29sb255b3B0aW1pemF0aW9uLy4vc3JjL21lc3NhZ2UtbW9kZWxzLnRzIiwid2VicGFjazovL2FudGNvbG9ueW9wdGltaXphdGlvbi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9hbnRjb2xvbnlvcHRpbWl6YXRpb24vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2FudGNvbG9ueW9wdGltaXphdGlvbi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2FudGNvbG9ueW9wdGltaXphdGlvbi93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2FudGNvbG9ueW9wdGltaXphdGlvbi8uL3NyYy9hbnQtd29ya2VyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBBbnRXb3JrZXJSZXNwb25zZSB7XG4gICAgY29uc3RydWN0b3IoZmluYWwsIGFudHMsIHBoZXJvbW9uZXMsIGJlc3QsIGJlc3RMZW5ndGgpIHtcbiAgICAgICAgdGhpcy5maW5hbCA9IGZpbmFsO1xuICAgICAgICB0aGlzLmFudHMgPSBhbnRzO1xuICAgICAgICB0aGlzLnBoZXJvbW9uZXMgPSBwaGVyb21vbmVzO1xuICAgICAgICB0aGlzLmJlc3QgPSBiZXN0O1xuICAgICAgICB0aGlzLmJlc3RMZW5ndGggPSBiZXN0TGVuZ3RoO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBBbnRXb3JrZXJSZXF1ZXN0IHtcbiAgICBjb25zdHJ1Y3RvcihncmFwaCwgbnVtQW50c1BlclZlcnRleCwgYXR0ZW1wdHMsIHBhcmFtQWxwaGEsIHBhcmFtQmV0YSwgcGFyYW1SaG8sIHBhcmFtUSkge1xuICAgICAgICB0aGlzLmdyYXBoID0gZ3JhcGg7XG4gICAgICAgIHRoaXMubnVtQW50c1BlclZlcnRleCA9IG51bUFudHNQZXJWZXJ0ZXg7XG4gICAgICAgIHRoaXMuYXR0ZW1wdHMgPSBhdHRlbXB0cztcbiAgICAgICAgdGhpcy5wYXJhbUFscGhhID0gcGFyYW1BbHBoYTtcbiAgICAgICAgdGhpcy5wYXJhbUJldGEgPSBwYXJhbUJldGE7XG4gICAgICAgIHRoaXMucGFyYW1SaG8gPSBwYXJhbVJobztcbiAgICAgICAgdGhpcy5wYXJhbVEgPSBwYXJhbVE7XG4gICAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBBbnRXb3JrZXJSZXNwb25zZSB9IGZyb20gXCIuL21lc3NhZ2UtbW9kZWxzXCI7XG4vKipcbiAqIEdldHMgcmFuZG9tIGludFxuICogQHBhcmFtIG1pblxuICogQHBhcmFtIG1heFxuICogQHJldHVybnMgcmFuZG9tIGludCAtIG1pbiAmIG1heCBpbmNsdXNpdmVcbiAqL1xuZnVuY3Rpb24gcmFuZG9tSW50KG1pbiwgbWF4KSB7XG4gICAgbWluID0gTWF0aC5jZWlsKG1pbik7XG4gICAgbWF4ID0gTWF0aC5mbG9vcihtYXgpO1xuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSkgKyBtaW47XG59XG5jbGFzcyBBbnRDb2xvbnlPcHRpbWl6YXRpb24ge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvKiog0JLQu9C40Y/QvdC40LUg0YTQtdGA0L7QvNC+0L3QsCDQvdCwINC90LDQv9GA0LDQstC70LXQvdC40LUgKi9cbiAgICAgICAgdGhpcy5hbHBoYSA9IDM7XG4gICAgICAgIC8qKiDQktC70LjRj9C90LjQtSDRgNCw0YHRgdGC0L7Rj9C90LjRjyAqL1xuICAgICAgICB0aGlzLmJldGEgPSAyO1xuICAgICAgICAvKiog0LrQvtGN0YTRhNC40YbQuNC10L3RgiDQuNGB0L/QsNGA0LXQvdC40Y8g0YTQtdGA0L7QvNC+0L3QvtCyICovXG4gICAgICAgIHRoaXMucmhvID0gMC4wMTtcbiAgICAgICAgLyoqINCa0L7RjdGE0YTQuNGG0LjQtdC90YIg0LLRi9GA0LDQsdC+0YLQutC4INGE0LXRgNC+0LzQvtC90L7QsiAqL1xuICAgICAgICB0aGlzLlEgPSAyO1xuICAgICAgICAvKiog0KDQsNGB0YHRgtC+0Y/QvdC40LUg0LzQtdC20LTRgyDQs9C+0YDQvtC00LDQvNC4ICovXG4gICAgICAgIHRoaXMuZGlzdGFuY2VzID0gW107XG4gICAgICAgIC8qKiDQnNGD0YDQsNCy0YzQuCAqL1xuICAgICAgICB0aGlzLmFudHMgPSBbXTtcbiAgICAgICAgLyoqINCk0LXRgNC+0LzQvtC90YsgKi9cbiAgICAgICAgdGhpcy5waGVyb21vbmVzID0gW107XG4gICAgfVxuICAgIC8qKiDQmtC+0LvQuNGH0LXRgdGC0LLQviDQvNGD0YDQsNCy0YzQtdCyINC90LAg0LrQsNC20LTRi9C5INCz0L7RgNC+0LQgKi9cbiAgICBnZXQgbnVtQW50cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYW50cy5sZW5ndGg7XG4gICAgfVxuICAgIC8qKiDQmtC+0LvQuNGH0LXRgdGC0LLQviDQs9C+0YDQvtC00L7QsiAqL1xuICAgIGdldCBudW1DaXRpZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpc3RhbmNlcy5sZW5ndGg7XG4gICAgfVxuICAgIC8qKlxuICAgICAqINCe0YLQv9GA0LDQstC60LAg0YLQtdC60YPRidC10LPQviDRgdC+0YHRgtC+0Y/QvdC40Y8g0YDQsNGB0YfQtdGC0LAg0L7RgdC90L7QstC90L7QvNGDINC/0YDQuNC70L7QttC10L3QuNGOXG4gICAgICogQHBhcmFtIGZpbmFsINCy0YvRh9C40YHQu9C10L3QuNGPINC+0LrQvtC90YfQtdC90YtcbiAgICAgKiBAcGFyYW0gYmVzdFRyYWlsINC70YPRh9GI0LjQuSDQvNCw0YDRiNGA0YPRglxuICAgICAqIEBwYXJhbSBiZXN0TGVuZ3RoINC00LjRgdGC0LDQvdGG0LjRjyDQu9GD0YfRiNC10LPQviDQvNCw0YDRiNGA0YPRgtCwXG4gICAgICovXG4gICAgc2VuZE1lc3NhZ2UoZmluYWwsIGJlc3RUcmFpbCwgYmVzdExlbmd0aCkge1xuICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKG5ldyBBbnRXb3JrZXJSZXNwb25zZShmaW5hbCwgdGhpcy5hbnRzLCB0aGlzLnBoZXJvbW9uZXMsIGJlc3RUcmFpbCwgYmVzdExlbmd0aCkpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDQl9Cw0L/Rg9GB0Log0LzRg9GA0LDQstGM0LjQvdC+0LPQviDQsNC70LPQvtGA0LjRgtC80LBcbiAgICAgKiBAcGFyYW0gY2l0aWVzTWF0cml4INGB0L/QuNGB0L7QuiDRgNCw0YHRgdGC0L7Rj9C90LjQuSDQvNC10LbQtNGDINCz0L7RgNC+0LTQsNC80LhcbiAgICAgKiBAcGFyYW0gYW50Q291bnQg0LrQvtC70LjRh9C10YHRgtCy0L4g0LzRg9GA0LDQstGM0LXQsiDQsiDQutCw0LbQtNC+0Lwg0LjQtyDQs9C+0YDQvtC00L7QslxuICAgICAqL1xuICAgIHJ1bihkYXRhKSB7XG4gICAgICAgIHRoaXMuZGlzdGFuY2VzID0gZGF0YS5ncmFwaDtcbiAgICAgICAgdGhpcy5hbnRzID0gdGhpcy5pbml0QW50cyhkYXRhLm51bUFudHNQZXJWZXJ0ZXgpO1xuICAgICAgICBsZXQgbWF4QXR0ZW1wdHMgPSBkYXRhLmF0dGVtcHRzO1xuICAgICAgICB0aGlzLmFscGhhID0gZGF0YS5wYXJhbUFscGhhO1xuICAgICAgICB0aGlzLmJldGEgPSBkYXRhLnBhcmFtQmV0YTtcbiAgICAgICAgdGhpcy5yaG8gPSBkYXRhLnBhcmFtUmhvO1xuICAgICAgICB0aGlzLlEgPSBkYXRhLnBhcmFtUTtcbiAgICAgICAgdGhpcy5pbml0UGhlcm9tb25lcygpO1xuICAgICAgICBjb25zb2xlLmxvZyhcItCn0LjRgdC70L4g0LPQvtGA0L7QtNC+0LIgPSBcIiArIHRoaXMubnVtQ2l0aWVzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCLQp9C40YHQu9C+INC80YPRgNCw0LLRjNC10LIgPSBcIiArIHRoaXMubnVtQW50cyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQWxwaGEgPSBcIiArIHRoaXMuYWxwaGEpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkJldGEgPSBcIiArIHRoaXMuYmV0YSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmhvID0gXCIgKyB0aGlzLnJobyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUSA9IFwiICsgdGhpcy5RKTtcbiAgICAgICAgbGV0IGJlc3RUcmFpbCA9IHRoaXMuZ2V0QmVzdFRyYWlsKCk7XG4gICAgICAgIGxldCBiZXN0TGVuZ3RoID0gdGhpcy5nZXRUcmFpbFN1bW1hcnlEaXN0YW5jZShiZXN0VHJhaWwpO1xuICAgICAgICBjb25zb2xlLmxvZyhcItCY0LfQvdCw0YfQsNC70YzQvdGL0Lkg0LvRg9GH0YjQuNC5INC/0YPRgtGMOiBcIiArIGJlc3RMZW5ndGgpO1xuICAgICAgICBsZXQgYXR0ZW1wdCA9IDA7XG4gICAgICAgIGNvbnNvbGUubG9nKFwi0JfQsNC/0YPRgdC6INCw0LvQs9C+0YDQuNGC0LzQsFwiKTtcbiAgICAgICAgd2hpbGUgKGF0dGVtcHQgPCBtYXhBdHRlbXB0cykge1xuICAgICAgICAgICAgaWYgKGF0dGVtcHQgJSA1MCA9PSAwKVxuICAgICAgICAgICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UoZmFsc2UsIGJlc3RUcmFpbCwgYmVzdExlbmd0aCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUFudHMoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGhlcm9tb25lcygpO1xuICAgICAgICAgICAgbGV0IGN1cnJCZXN0VHJhaWwgPSB0aGlzLmdldEJlc3RUcmFpbCgpO1xuICAgICAgICAgICAgbGV0IGN1cnJCZXN0TGVuZ3RoID0gdGhpcy5nZXRUcmFpbFN1bW1hcnlEaXN0YW5jZShjdXJyQmVzdFRyYWlsKTtcbiAgICAgICAgICAgIGlmIChjdXJyQmVzdExlbmd0aCA8IGJlc3RMZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBiZXN0TGVuZ3RoID0gY3VyckJlc3RMZW5ndGg7XG4gICAgICAgICAgICAgICAgYmVzdFRyYWlsID0gY3VyckJlc3RUcmFpbDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcItCd0L7QstCw0Y8g0LvRg9GH0YjQsNGPINC00LvQvNC90LAgXCIgKyBiZXN0TGVuZ3RoICsgXCIg0YfQuNGB0LvQviDQv9C+0L/Ri9GC0L7QujogXCIgKyBhdHRlbXB0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGF0dGVtcHQrKztcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcItCb0YPRh9GI0LjQuSDQv9GD0YLRjCDQvdCw0LnQtNC10L06IFwiKTtcbiAgICAgICAgY29uc29sZS5sb2coYmVzdFRyYWlsKTtcbiAgICAgICAgY29uc29sZS5sb2coXCLQlNC70LjQvdCwINC70YPRh9GI0LXQs9C+INC/0YPRgtC4OiBcIiArIGJlc3RMZW5ndGgpO1xuICAgICAgICB0aGlzLnNlbmRNZXNzYWdlKHRydWUsIGJlc3RUcmFpbCwgYmVzdExlbmd0aCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqINCf0L7Qu9GD0YfQuNGC0Ywg0YDQsNGB0YHRgtC+0Y/QvdC40LUg0LzQtdC20LTRgyDQs9C+0YDQvtC00LDQvNC4XG4gICAgICogQHBhcmFtIGNpdHlYINCz0L7RgNC+0LRcbiAgICAgKiBAcGFyYW0gY2l0eVkg0LTRgNGD0LPQvtC5INCz0L7RgNC+0LRcbiAgICAgKiBAcmV0dXJucyDRgNCw0YHRgdGC0L7Rj9C10L3QuNC1INC80LXQttC00YMg0LPQvtGA0L7QtNCw0LzQuFxuICAgICAqL1xuICAgIGdldERpc3RhbmNlKGNpdHlYLCBjaXR5WSkge1xuICAgICAgICByZXR1cm4gdGhpcy5kaXN0YW5jZXNbY2l0eVhdW2NpdHlZXTtcbiAgICB9XG4gICAgLyoqXG4gICAgICog0J/QvtC70YPRh9C40YLRjCDQvtCx0YnQtdC1INGA0LDRgdGB0YLQvtGP0L3QuNC1INC80LDRgNGI0YDRg9GC0LBcbiAgICAgKiBAcGFyYW0gdHJhaWwg0LzQsNGA0YjRgNGD0YJcbiAgICAgKiBAcmV0dXJucyDQvtCx0YnQtdC1INGA0LDRgdGB0YLQvtGP0L3QuNC1XG4gICAgICovXG4gICAgZ2V0VHJhaWxTdW1tYXJ5RGlzdGFuY2UodHJhaWwpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHJhaWwubGVuZ3RoIC0gMTsgKytpKVxuICAgICAgICAgICAgcmVzdWx0ICs9IHRoaXMuZ2V0RGlzdGFuY2UodHJhaWxbaV0sIHRyYWlsW2kgKyAxXSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqINCf0L7Qu9GD0YfQuNGC0Ywg0LvRg9GH0YjQuNC5INC80LDRgNGI0YDRg9GCXG4gICAgICogQHJldHVybnMg0LvRg9GH0YjQuNC5INC80LDRgNGI0YDRg9GCXG4gICAgICovXG4gICAgZ2V0QmVzdFRyYWlsKCkge1xuICAgICAgICBsZXQgYmVzdExlbmd0aCA9IHRoaXMuZ2V0VHJhaWxTdW1tYXJ5RGlzdGFuY2UodGhpcy5hbnRzWzBdKTtcbiAgICAgICAgbGV0IGluZGV4QmVzdExlbmd0aCA9IDA7XG4gICAgICAgIGZvciAobGV0IGsgPSAxOyBrIDwgdGhpcy5hbnRzLmxlbmd0aDsgKytrKSB7XG4gICAgICAgICAgICBsZXQgbGVuID0gdGhpcy5nZXRUcmFpbFN1bW1hcnlEaXN0YW5jZSh0aGlzLmFudHNba10pO1xuICAgICAgICAgICAgaWYgKGxlbiA8IGJlc3RMZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBiZXN0TGVuZ3RoID0gbGVuO1xuICAgICAgICAgICAgICAgIGluZGV4QmVzdExlbmd0aCA9IGs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFsuLi50aGlzLmFudHNbaW5kZXhCZXN0TGVuZ3RoXV07XG4gICAgfVxuICAgIC8qKlxuICAgICAqINCh0LPQtdC90LXQvdGA0LjRgNC+0LLQsNGC0Ywg0LzRg9GA0LDQstGM0LXQslxuICAgICAqIEByZXR1cm5zINGB0L/QuNGB0L7QuiDQvNGD0YDQsNCy0YzQtdCyXG4gICAgICovXG4gICAgaW5pdEFudHMoYW50Q291bnQpIHtcbiAgICAgICAgbGV0IGFudHMgPSBBcnJheShhbnRDb3VudCk7XG4gICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgYW50Q291bnQ7IGsrKykge1xuICAgICAgICAgICAgbGV0IHN0YXJ0ID0gcmFuZG9tSW50KDAsIHRoaXMubnVtQ2l0aWVzKTtcbiAgICAgICAgICAgIGFudHNba10gPSB0aGlzLnJhbmRvbVRyYWlsKHN0YXJ0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYW50cztcbiAgICB9XG4gICAgLyoqXG4gICAgICog0KHQs9C10L3QtdGA0LjRgNC+0LLQsNGC0Ywg0YHQu9GD0YfQsNC50L3Ri9C5INC80LDRgNGI0YDRg9GCXG4gICAgICogQHBhcmFtIHN0YXJ0INC90LDRh9Cw0LvRjNC90YvQuSDQs9C+0YDQvtC0XG4gICAgICogQHBhcmFtIG51bUNpdGllcyDQutC+0LvQuNGH0LXRgdGC0LLQviDQs9C+0YDQvtC00L7QslxuICAgICAqIEByZXR1cm5zINGB0LvRg9GH0LDQudC90YvQuSDQvNCw0YDRiNGA0YPRglxuICAgICAqL1xuICAgIHJhbmRvbVRyYWlsKHN0YXJ0KSB7XG4gICAgICAgIC8vINCT0LXQvdC10YDQuNGA0YPQtdC8INC80LDRgNGI0YDRg9GCINGH0LXRgNC10Lcg0LLRgdC1INCz0L7RgNC+0LTQsFxuICAgICAgICBsZXQgdHJhaWwgPSBbLi4uQXJyYXkodGhpcy5udW1DaXRpZXMpLmtleXMoKV07XG4gICAgICAgIC8vINCf0LXRgNC10LzQtdGI0LjQstCw0LXQvCDQvNCw0YDRiNGA0YPRglxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubnVtQ2l0aWVzOyArK2kpIHtcbiAgICAgICAgICAgIGxldCByID0gcmFuZG9tSW50KGksIHRoaXMubnVtQ2l0aWVzKTtcbiAgICAgICAgICAgIGxldCB0bXAgPSB0cmFpbFtyXTtcbiAgICAgICAgICAgIHRyYWlsW3JdID0gdHJhaWxbaV07XG4gICAgICAgICAgICB0cmFpbFtpXSA9IHRtcDtcbiAgICAgICAgfVxuICAgICAgICAvLyDQn9C+0YHQu9C1INC/0LXRgNC10LzQtdGI0LjQstCw0L3QuNGPINCy0L7Qt9Cy0YDQsNGJ0LDQtdC8INCyINC90LDRh9Cw0LvQviDRgdGC0LDRgNGC0L7QstGL0Lkg0LPQvtGA0L7QtFxuICAgICAgICBsZXQgaWR4ID0gdHJhaWwuZmluZEluZGV4KChjaXR5KSA9PiBjaXR5ID09IHN0YXJ0KTtcbiAgICAgICAgbGV0IHRlbXAgPSB0cmFpbFswXTtcbiAgICAgICAgdHJhaWxbMF0gPSB0cmFpbFtpZHhdO1xuICAgICAgICB0cmFpbFtpZHhdID0gdGVtcDtcbiAgICAgICAgcmV0dXJuIHRyYWlsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDQmNC90LjRhtC40LDQu9C40LfQuNGA0L7QstCw0YLRjCDRhNC10YDQvtC80L7QvdGLXG4gICAgICovXG4gICAgaW5pdFBoZXJvbW9uZXMoKSB7XG4gICAgICAgIHRoaXMucGhlcm9tb25lcyA9IEFycmF5KHRoaXMubnVtQ2l0aWVzKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm51bUNpdGllczsgKytpKVxuICAgICAgICAgICAgdGhpcy5waGVyb21vbmVzW2ldID0gQXJyYXkodGhpcy5udW1DaXRpZXMpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGhlcm9tb25lcy5sZW5ndGg7ICsraSlcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5waGVyb21vbmVzW2ldLmxlbmd0aDsgKytqKVxuICAgICAgICAgICAgICAgIHRoaXMucGhlcm9tb25lc1tpXVtqXSA9IDAuMDE7XG4gICAgfVxuICAgIC8qKlxuICAgICAqINCe0LHQvdC+0LLQuNGC0Ywg0LzQsNGA0YjRgNGD0YLRiyDQvNGD0YDQsNCy0YzQtdCyXG4gICAgICovXG4gICAgdXBkYXRlQW50cygpIHtcbiAgICAgICAgLy8g0JLQtdGA0L7Rj9GC0L3QvtGB0YLRjCDQv9C10YDQtdC80LXRidC10L3QuNGPINC80YPRgNCw0LLRjNGPINCyINC70Y7QsdC+0Lkg0LTRgNGD0LPQvtC5INCz0L7RgNC+0LRcbiAgICAgICAgbGV0IG1vdmVQcm9icyA9IChrLCBjaXR5WCwgdmlzaXRlZCkgPT4ge1xuICAgICAgICAgICAgbGV0IHRhdWV0YSA9IEFycmF5KHRoaXMubnVtQ2l0aWVzKTtcbiAgICAgICAgICAgIGxldCBzdW0gPSAwLjA7XG4gICAgICAgICAgICAvLyBpIC0g0YHQvtGB0LXQtNC90LjQuSDQs9C+0YDQvtC0XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhdWV0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChpID09IGNpdHlYKVxuICAgICAgICAgICAgICAgICAgICB0YXVldGFbaV0gPSAwLjA7IC8vINC90LXQu9GM0LfRjyDQv9C10YDQtdC80LXRidCw0YLRjNGB0Y8g0LIg0YLQvtGCLdC20LUg0YHQsNC80YvQuSDQs9C+0YDQvtC0XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodmlzaXRlZFtpXSA9PSB0cnVlKVxuICAgICAgICAgICAgICAgICAgICB0YXVldGFbaV0gPSAwLjA7IC8vINC90LXQu9GM0LfRjyDQv9C10YDQtdC80LXRidCw0YLRjNGB0Y8g0LIg0YPQttC1INC/0L7RgdC10YnQtdC90L3Ri9C5INCz0L7RgNC+0LRcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g0YDQsNGB0YfQtdGCINCy0LXRgNC+0Y/RgtC90L7RgdGC0Lgg0L/QtdGA0LXQvNC10YnQtdC90LjRjyDQuCDQv9C+0LzQtdGJ0LXQvdC40LUg0LXRkSDQsiDQsNC00LXQutCy0LDRgtC90YvQtSDQs9GA0LDQvdC40YbRi1xuICAgICAgICAgICAgICAgICAgICB0YXVldGFbaV0gPVxuICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5wb3codGhpcy5waGVyb21vbmVzW2NpdHlYXVtpXSwgdGhpcy5hbHBoYSkgKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgucG93KDEuMCAvIHRoaXMuZ2V0RGlzdGFuY2UoY2l0eVgsIGkpLCB0aGlzLmJldGEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGF1ZXRhW2ldIDwgMC4wMDAxKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGF1ZXRhW2ldID0gMC4wMDAxO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0YXVldGFbaV0gPiBOdW1iZXIuTUFYX1ZBTFVFIC8gKHRoaXMubnVtQ2l0aWVzICogMTAwKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhdWV0YVtpXSA9IE51bWJlci5NQVhfVkFMVUUgLyAodGhpcy5udW1DaXRpZXMgKiAxMDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdW0gKz0gdGF1ZXRhW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8g0LLQtdGA0L7Rj9GC0L3QvtGB0YLQuCDQv9C10YDQtdC80LXRidC10L3QuNGPXG4gICAgICAgICAgICBsZXQgcHJvYnMgPSBBcnJheSh0aGlzLm51bUNpdGllcyk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2JzLmxlbmd0aDsgKytpKVxuICAgICAgICAgICAgICAgIHByb2JzW2ldID0gdGF1ZXRhW2ldIC8gc3VtO1xuICAgICAgICAgICAgcmV0dXJuIHByb2JzO1xuICAgICAgICB9O1xuICAgICAgICAvLyDQkNC70LPQvtGA0LjRgtC8INCy0YvQsdC+0YDQsCDQs9C+0YDQvtC00LBcbiAgICAgICAgbGV0IG5leHRDaXR5ID0gKGssIGNpdHlYLCB2aXNpdGVkKSA9PiB7XG4gICAgICAgICAgICBsZXQgcHJvYnMgPSBtb3ZlUHJvYnMoaywgY2l0eVgsIHZpc2l0ZWQpO1xuICAgICAgICAgICAgbGV0IGN1bXVsID0gQXJyYXkocHJvYnMubGVuZ3RoICsgMSkuZmlsbCgwKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvYnMubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICAgICAgY3VtdWxbaSArIDFdID0gY3VtdWxbaV0gKyBwcm9ic1tpXTtcbiAgICAgICAgICAgIGxldCBwID0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3VtdWwubGVuZ3RoIC0gMTsgKytpKVxuICAgICAgICAgICAgICAgIGlmIChwID49IGN1bXVsW2ldICYmIHAgPCBjdW11bFtpICsgMV0pXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbHVyZSB0byByZXR1cm4gdmFsaWQgY2l0eSBpbiBOZXh0Q2l0eVwiKTtcbiAgICAgICAgfTtcbiAgICAgICAgLy8g0J/QvtGB0YLRgNC+0LXQvdC40LUg0L3QvtCy0L7Qs9C+INC80LDRgNGI0YDRg9GC0LAg0LTQu9GPINC80YPRgNCw0LLRjNGPXG4gICAgICAgIGxldCBidWlsZFRyYWlsID0gKGssIHN0YXJ0KSA9PiB7XG4gICAgICAgICAgICBsZXQgdHJhaWwgPSBBcnJheSh0aGlzLm51bUNpdGllcyk7XG4gICAgICAgICAgICBsZXQgdmlzaXRlZCA9IEFycmF5KHRoaXMubnVtQ2l0aWVzKTtcbiAgICAgICAgICAgIHRyYWlsWzBdID0gc3RhcnQ7XG4gICAgICAgICAgICB2aXNpdGVkW3N0YXJ0XSA9IHRydWU7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubnVtQ2l0aWVzIC0gMTsgKytpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNpdHlYID0gdHJhaWxbaV07XG4gICAgICAgICAgICAgICAgbGV0IG5leHQgPSBuZXh0Q2l0eShrLCBjaXR5WCwgdmlzaXRlZCk7XG4gICAgICAgICAgICAgICAgdHJhaWxbaSArIDFdID0gbmV4dDtcbiAgICAgICAgICAgICAgICB2aXNpdGVkW25leHRdID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cmFpbDtcbiAgICAgICAgfTtcbiAgICAgICAgLy8g0LrQsNC20LTQvtC80YMg0LzRg9GA0LDQstGM0Y4g0YHRgtGA0L7QuNGC0YHRjyDQvdC+0LLRi9C5INC80LDRgNGI0YDRg9GCXG4gICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgdGhpcy5hbnRzLmxlbmd0aDsgKytrKSB7XG4gICAgICAgICAgICBsZXQgc3RhcnQgPSByYW5kb21JbnQoMCwgdGhpcy5udW1DaXRpZXMpO1xuICAgICAgICAgICAgdGhpcy5hbnRzW2tdID0gYnVpbGRUcmFpbChrLCBzdGFydCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICog0J7QsdC90L7QstC70LXQvdC40LUg0LrQvtC70LjRh9C10YHRgtCy0LAg0YTQtdGA0L7QvNC+0L3QvtCyXG4gICAgICovXG4gICAgdXBkYXRlUGhlcm9tb25lcygpIHtcbiAgICAgICAgLyoqINCd0LDQu9C40YfQuNC1INC/0LXRgNC10YXQvtC00LAg0LzQtdC20LTRgyDQs9C+0YDQvtC00LDQvNC4INCyINC80LDRgNGI0YDRg9GC0LUgKi9cbiAgICAgICAgbGV0IEVkZ2VJblRyYWlsID0gKGNpdHlYLCBjaXR5WSwgdHJhaWwpID0+IHtcbiAgICAgICAgICAgIGxldCBpZHggPSB0cmFpbC5maW5kSW5kZXgoKGNpdHkpID0+IGNpdHkgPT0gY2l0eVgpO1xuICAgICAgICAgICAgbGV0IGlkeSA9IHRyYWlsLmZpbmRJbmRleCgoY2l0eSkgPT4gY2l0eSA9PSBjaXR5WSk7XG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoaWR4IC0gaWR5KSA9PSAxKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgZWxzZSBpZiAoaWR4ID09IDAgJiYgaWR5ID09IHRyYWlsLmxlbmd0aCAtIDEpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICBlbHNlIGlmIChpZHggPT0gdHJhaWwubGVuZ3RoIC0gMSAmJiBpZHkgPT0gMClcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgLy8g0YbQuNC60Lsg0L7QsdC90L7QstC70LXQvdC40Y8g0YTQtdGA0L7QvNC+0L3QvtCyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5waGVyb21vbmVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gaSArIDE7IGogPCB0aGlzLnBoZXJvbW9uZXNbaV0ubGVuZ3RoOyArK2opIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHRoaXMuYW50cy5sZW5ndGg7ICsraykge1xuICAgICAgICAgICAgICAgICAgICAvLyDQtNC70LjQvdCwINC/0YPRgtC4INC80YPRgNCw0LLRjNGPIGtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxlbmd0aCA9IHRoaXMuZ2V0VHJhaWxTdW1tYXJ5RGlzdGFuY2UodGhpcy5hbnRzW2tdKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRlY3JlYXNlID0gKDEuMCAtIHRoaXMucmhvKSAqIHRoaXMucGhlcm9tb25lc1tpXVtqXTtcbiAgICAgICAgICAgICAgICAgICAgLy8g0LXRgdC70Lgg0LzRg9GA0LDQstC10Lkg0L/QtdGA0LXRhdC+0LTQuNC7INC40Lcg0LPQvtGA0L7QtNCwIGkg0LIg0LPQvtGA0L7QtCBqXG4gICAgICAgICAgICAgICAgICAgIGxldCBpbmNyZWFzZSA9IDAuMDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKEVkZ2VJblRyYWlsKGksIGosIHRoaXMuYW50c1trXSkpXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmNyZWFzZSA9IHRoaXMuUSAvIGxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgLy8g0L7QsdC90L7QstC70LXQvdC40LUg0YTQtdGA0L7QvNC+0L3QvtCyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGhlcm9tb25lc1tpXVtqXSA9IGRlY3JlYXNlICsgaW5jcmVhc2U7XG4gICAgICAgICAgICAgICAgICAgIC8vINC/0L7QvNC10YnQtdC90LjRjyDQt9C90LDRh9C10L3QuNGPINGE0LXRgNC+0LzQvtC90L7QsiDQsiDQtNC+0L/Rg9GB0YLQuNC80YvQtSDQs9GA0LDQvdC40YbRi1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5waGVyb21vbmVzW2ldW2pdIDwgMC4wMDAxKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5waGVyb21vbmVzW2ldW2pdID0gMC4wMDAxO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLnBoZXJvbW9uZXNbaV1bal0gPiAxMDAwMDAuMClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGhlcm9tb25lc1tpXVtqXSA9IDEwMDAwMC4wO1xuICAgICAgICAgICAgICAgICAgICAvLyDQvNCw0YLRgNC40YbQsCDRhNC10YDQvtC80L7QvdC+0LIg0YHQuNC80LzQtdGC0YDQuNGH0L3QsFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBoZXJvbW9uZXNbal1baV0gPSB0aGlzLnBoZXJvbW9uZXNbaV1bal07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuY29uc3QgYW50Q29sb255T3B0aW1pemF0aW9uID0gbmV3IEFudENvbG9ueU9wdGltaXphdGlvbigpO1xuc2VsZi5vbm1lc3NhZ2UgPSAobWVzc2FnZSkgPT4ge1xuICAgIGxldCByZXF1ZXN0ID0gbWVzc2FnZS5kYXRhO1xuICAgIGFudENvbG9ueU9wdGltaXphdGlvbi5ydW4ocmVxdWVzdCk7XG59O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9