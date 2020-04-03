(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["React"], factory);
	else if(typeof exports === 'object')
		exports["hookStore"] = factory(require("react"));
	else
		root["hookStore"] = factory(root["React"]);
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE__0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__0__;

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createStore", function() { return createStore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getStoreByName", function() { return getStoreByName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useStore", function() { return useStore; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


var stores = {};
var subscriptions = {};

var defaultReducer = function defaultReducer(state, payload) {
  return payload;
};

var defaultMemoFn = function defaultMemoFn(state) {
  return state;
};
/** The public interface of a store */


var StoreInterface =
/*#__PURE__*/
function () {
  function StoreInterface(name, store, useReducer) {
    _classCallCheck(this, StoreInterface);

    this.name = name;
    useReducer ? this.dispatch = store.setState : this.setState = store.setState;

    this.getState = function () {
      return store.state;
    };

    this.subscribe = this.subscribe.bind(this);
  }
  /**
   * Subscribe to store changes
   * @param {(state:any, data:any) => void} callback - The function to be invoked everytime the store is updated
   * @return {Function} - Call the function returned by the method to cancel the subscription
   */


  _createClass(StoreInterface, [{
    key: "subscribe",
    value: function subscribe(callback) {
      var _this = this;

      if (!callback || typeof callback !== 'function') {
        throw "store.subscribe callback argument must be a function. got '".concat(_typeof(callback), "' instead.");
      }

      if (subscriptions[this.name].find(function (c) {
        return c === callback;
      })) {
        console.warn('This callback is already subscribed to this store. skipping subscription');
        return;
      }

      subscriptions[this.name].push(callback);
      return function () {
        subscriptions[_this.name] = subscriptions[_this.name].filter(function (c) {
          return c !== callback;
        });
      };
    }
    /**
     * Set the store state
     * @param {any} data - The new state value.
     */

  }, {
    key: "setState",
    value: function setState(data) {
      console.warn("[React Hookstore] Store ".concat(this.name, " uses a reducer to handle its state updates. use dispatch instead of setState"));
    }
    /**
     * Dispatch data to the store reducer
     * @param {any} data - The data payload the reducer receives
     */

  }, {
    key: "dispatch",
    value: function dispatch(data) {
      console.warn("[React Hookstore] Store ".concat(this.name, " does not use a reducer to handle state updates. use setState instead of dispatch"));
    }
  }]);

  return StoreInterface;
}();

function getStoreByIdentifier(identifier) {
  var name = identifier instanceof StoreInterface ? identifier.name : identifier;

  if (!stores[name]) {
    throw "Store with name ".concat(name, " does not exist");
  }

  return stores[name];
}
/**
 * Creates a new store
 * @param {String} name - The store namespace.
 * @param {*} state [{}] - The store initial state. It can be of any type.
 * @param {(state:any, data:any) => any} reducer [null] - The reducer handler. Optional
 * @returns {StoreInterface} The store instance.
 */


function createStore(name) {
  var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var reducer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultReducer;

  if (typeof name !== 'string') {
    throw 'Store name must be a string';
  }

  if (stores[name]) {
    throw "Store with name ".concat(name, " already exists");
  }

  var store = {
    state: state,
    reducer: reducer,
    setState: function setState(data, callback) {
      var _this2 = this;

      var isPrimitiveStateWithoutReducerAndIsPreviousState = this.reducer === defaultReducer && data === this.state && _typeof(data) !== 'object';

      if (isPrimitiveStateWithoutReducerAndIsPreviousState) {
        if (typeof callback === 'function') callback(this.state);
        return;
      }

      var currentState = this.state;
      var newState = this.reducer(this.state, data);
      this.state = newState;
      this.updatersPerMemoFunction.forEach(function (updaters, memoFn) {
        var prevResult = memoFn(currentState);
        var newResult = memoFn(newState);

        if (prevResult === newResult) {
          return;
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = updaters[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var updateComponent = _step.value;
            updateComponent(_this2.state);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      });

      if (subscriptions[name].length) {
        subscriptions[name].forEach(function (c) {
          return c(_this2.state, data);
        });
      }

      if (typeof callback === 'function') callback(this.state);
    },
    updatersPerMemoFunction: new Map()
  };
  store.setState = store.setState.bind(store);
  store.updatersPerMemoFunction.set(defaultMemoFn, new Set());
  stores = Object.assign({}, stores, _defineProperty({}, name, store));
  subscriptions[name] = [];
  store.public = new StoreInterface(name, store, reducer !== defaultReducer);
  return store.public;
}
/**
 * Returns a store instance based on its name
 * @name {String} name - The name of the wanted store
 * @returns {StoreInterface} the store instance
 */

function getStoreByName(name) {
  try {
    return stores[name].public;
  } catch (e) {
    throw "Store with name ".concat(name, " does not exist");
  }
}
/**
 * Returns a [ state, setState ] pair for the selected store. Can only be called within React Components
 * @param {String|StoreInterface} identifier - The identifier for the wanted store
 * @param {(state:any) => any} memoFn [state => state] - A memoization function to optimize component rerender. Receive the store state and return a subset of it. The component will only rerender when the subset changes.
 * @returns {Array} the [state, setState] pair.
 */

function useStore(identifier) {
  var memoFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultMemoFn;
  var store = getStoreByIdentifier(identifier);

  if (!store) {
    throw 'store does not exist';
  }

  if (typeof memoFn !== 'function') {
    throw 'memoFn must be a function';
  }

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(store.state),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      set = _useState2[1];

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    if (!store.updatersPerMemoFunction.has(memoFn)) {
      store.updatersPerMemoFunction.set(memoFn, new Set());
    }

    var updatersPerMemoFunction = store.updatersPerMemoFunction.get(memoFn);

    if (!updatersPerMemoFunction.has(set)) {
      updatersPerMemoFunction.add(set);
    }

    return function () {
      updatersPerMemoFunction.delete(set);

      if (!updatersPerMemoFunction.size) {
        store.updatersPerMemoFunction.delete(memoFn);
      }
    };
  }, []);
  return [state, store.setState];
}

/***/ })
/******/ ]);
});
//# sourceMappingURL=react-hookstore.js.map