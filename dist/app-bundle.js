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
    constructor(graph, numAntsPerVertex, attempts) {
        this.graph = graph;
        this.numAntsPerVertex = numAntsPerVertex;
        this.attempts = attempts;
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
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
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
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".app-bundle.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
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
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _message_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./message-models */ "./src/message-models.ts");

const antColony = new Worker(new URL(/* worker import */ __webpack_require__.p + __webpack_require__.u("src_ant-worker_ts"), __webpack_require__.b));
const output = document.getElementById("output");
const state = document.getElementById("state");
state.disabled = true;
const messages = [];
antColony.onmessage = (message) => {
    let response = message.data;
    messages.push(response);
    output.innerText = `best ${response.best}  length:  ${response.bestLength}`;
    if (response.final == true) {
        state.max = `${messages.length - 1}`;
        state.value = `${messages.length - 1}`;
        state.disabled = false;
    }
};
state.onchange = (event) => {
    output.innerText = `best ${messages[+state.value].best}  length:  ${messages[+state.value].bestLength}`;
};
antColony.postMessage(new _message_models__WEBPACK_IMPORTED_MODULE_0__.AntWorkerRequest(makeGraphDistances(20), 4, 2000));
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

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLWJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztVQ2ZBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7Ozs7V0N6QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQ0pBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsR0FBRztXQUNIO1dBQ0E7V0FDQSxDQUFDOzs7OztXQ1BEOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0NmQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7Ozs7Ozs7Ozs7OztBQ3JCb0Q7QUFDcEQscUNBQXFDLDZHQUFrQztBQUN2RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixnQkFBZ0IsV0FBVyxvQkFBb0I7QUFDOUU7QUFDQSx1QkFBdUIsb0JBQW9CO0FBQzNDLHlCQUF5QixvQkFBb0I7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsOEJBQThCLFdBQVcsa0NBQWtDO0FBQzFHO0FBQ0EsMEJBQTBCLDZEQUFnQjtBQUMxQztBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsVUFBVTtBQUM5QjtBQUNBLG9CQUFvQixVQUFVO0FBQzlCLDRCQUE0QixVQUFVO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hbnRjb2xvbnlvcHRpbWl6YXRpb24vLi9zcmMvbWVzc2FnZS1tb2RlbHMudHMiLCJ3ZWJwYWNrOi8vYW50Y29sb255b3B0aW1pemF0aW9uL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2FudGNvbG9ueW9wdGltaXphdGlvbi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYW50Y29sb255b3B0aW1pemF0aW9uL3dlYnBhY2svcnVudGltZS9nZXQgamF2YXNjcmlwdCBjaHVuayBmaWxlbmFtZSIsIndlYnBhY2s6Ly9hbnRjb2xvbnlvcHRpbWl6YXRpb24vd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9hbnRjb2xvbnlvcHRpbWl6YXRpb24vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9hbnRjb2xvbnlvcHRpbWl6YXRpb24vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9hbnRjb2xvbnlvcHRpbWl6YXRpb24vd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vYW50Y29sb255b3B0aW1pemF0aW9uL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2FudGNvbG9ueW9wdGltaXphdGlvbi8uL3NyYy9hcHAudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIEFudFdvcmtlclJlc3BvbnNlIHtcbiAgICBjb25zdHJ1Y3RvcihmaW5hbCwgYW50cywgcGhlcm9tb25lcywgYmVzdCwgYmVzdExlbmd0aCkge1xuICAgICAgICB0aGlzLmZpbmFsID0gZmluYWw7XG4gICAgICAgIHRoaXMuYW50cyA9IGFudHM7XG4gICAgICAgIHRoaXMucGhlcm9tb25lcyA9IHBoZXJvbW9uZXM7XG4gICAgICAgIHRoaXMuYmVzdCA9IGJlc3Q7XG4gICAgICAgIHRoaXMuYmVzdExlbmd0aCA9IGJlc3RMZW5ndGg7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIEFudFdvcmtlclJlcXVlc3Qge1xuICAgIGNvbnN0cnVjdG9yKGdyYXBoLCBudW1BbnRzUGVyVmVydGV4LCBhdHRlbXB0cykge1xuICAgICAgICB0aGlzLmdyYXBoID0gZ3JhcGg7XG4gICAgICAgIHRoaXMubnVtQW50c1BlclZlcnRleCA9IG51bUFudHNQZXJWZXJ0ZXg7XG4gICAgICAgIHRoaXMuYXR0ZW1wdHMgPSBhdHRlbXB0cztcbiAgICB9XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIi8vIFRoaXMgZnVuY3Rpb24gYWxsb3cgdG8gcmVmZXJlbmNlIGFzeW5jIGNodW5rc1xuX193ZWJwYWNrX3JlcXVpcmVfXy51ID0gKGNodW5rSWQpID0+IHtcblx0Ly8gcmV0dXJuIHVybCBmb3IgZmlsZW5hbWVzIGJhc2VkIG9uIHRlbXBsYXRlXG5cdHJldHVybiBcIlwiICsgY2h1bmtJZCArIFwiLmFwcC1idW5kbGUuanNcIjtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIHNjcmlwdFVybDtcbmlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmcuaW1wb3J0U2NyaXB0cykgc2NyaXB0VXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmxvY2F0aW9uICsgXCJcIjtcbnZhciBkb2N1bWVudCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5kb2N1bWVudDtcbmlmICghc2NyaXB0VXJsICYmIGRvY3VtZW50KSB7XG5cdGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0KVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjO1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHNjcmlwdFVybCA9IHNjcmlwdHNbc2NyaXB0cy5sZW5ndGggLSAxXS5zcmNcblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5iID0gZG9jdW1lbnQuYmFzZVVSSSB8fCBzZWxmLmxvY2F0aW9uLmhyZWY7XG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbi8vIG5vIG9uIGNodW5rcyBsb2FkZWRcblxuLy8gbm8ganNvbnAgZnVuY3Rpb24iLCJpbXBvcnQgeyBBbnRXb3JrZXJSZXF1ZXN0IH0gZnJvbSBcIi4vbWVzc2FnZS1tb2RlbHNcIjtcbmNvbnN0IGFudENvbG9ueSA9IG5ldyBXb3JrZXIobmV3IFVSTChcIi4vYW50LXdvcmtlci50c1wiLCBpbXBvcnQubWV0YS51cmwpKTtcbmNvbnN0IG91dHB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3V0cHV0XCIpO1xuY29uc3Qgc3RhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0YXRlXCIpO1xuc3RhdGUuZGlzYWJsZWQgPSB0cnVlO1xuY29uc3QgbWVzc2FnZXMgPSBbXTtcbmFudENvbG9ueS5vbm1lc3NhZ2UgPSAobWVzc2FnZSkgPT4ge1xuICAgIGxldCByZXNwb25zZSA9IG1lc3NhZ2UuZGF0YTtcbiAgICBtZXNzYWdlcy5wdXNoKHJlc3BvbnNlKTtcbiAgICBvdXRwdXQuaW5uZXJUZXh0ID0gYGJlc3QgJHtyZXNwb25zZS5iZXN0fSAgbGVuZ3RoOiAgJHtyZXNwb25zZS5iZXN0TGVuZ3RofWA7XG4gICAgaWYgKHJlc3BvbnNlLmZpbmFsID09IHRydWUpIHtcbiAgICAgICAgc3RhdGUubWF4ID0gYCR7bWVzc2FnZXMubGVuZ3RoIC0gMX1gO1xuICAgICAgICBzdGF0ZS52YWx1ZSA9IGAke21lc3NhZ2VzLmxlbmd0aCAtIDF9YDtcbiAgICAgICAgc3RhdGUuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9XG59O1xuc3RhdGUub25jaGFuZ2UgPSAoZXZlbnQpID0+IHtcbiAgICBvdXRwdXQuaW5uZXJUZXh0ID0gYGJlc3QgJHttZXNzYWdlc1src3RhdGUudmFsdWVdLmJlc3R9ICBsZW5ndGg6ICAke21lc3NhZ2VzWytzdGF0ZS52YWx1ZV0uYmVzdExlbmd0aH1gO1xufTtcbmFudENvbG9ueS5wb3N0TWVzc2FnZShuZXcgQW50V29ya2VyUmVxdWVzdChtYWtlR3JhcGhEaXN0YW5jZXMoMjApLCA0LCAyMDAwKSk7XG4vLyDRgtC10YHRgtC+0LLRi9C5INCz0YDQsNGEXG5mdW5jdGlvbiBtYWtlR3JhcGhEaXN0YW5jZXMoc2l6ZSkge1xuICAgIGxldCBkaXN0cyA9IEFycmF5KHNpemUpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgKytpKVxuICAgICAgICBkaXN0c1tpXSA9IEFycmF5KHNpemUpLmZpbGwoMCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspXG4gICAgICAgIGZvciAobGV0IGogPSBpICsgMTsgaiA8IHNpemU7IGorKykge1xuICAgICAgICAgICAgaWYgKGkgPT0gailcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIGxldCBkID0gaSAqIDE7XG4gICAgICAgICAgICBkaXN0c1tpXVtqXSA9IGQ7XG4gICAgICAgICAgICBkaXN0c1tqXVtpXSA9IGQ7XG4gICAgICAgIH1cbiAgICByZXR1cm4gZGlzdHM7XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=