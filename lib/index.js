"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Injector_1 = require("./Injector");
exports.Injector = Injector_1.Injector;
exports.extractArgumentsFromFunction = Injector_1.extractArgumentsFromFunction;
var InjectableMiddleware_1 = require("./InjectableMiddleware");
exports.Injectable = InjectableMiddleware_1.Injectable;
var Pool_1 = require("./Pool");
exports.createPool = Pool_1.createPool;
var ManagedState_1 = require("./ManagedState");
exports.createManagedState = ManagedState_1.createManagedState;
var WorkerMiddleware_1 = require("./WorkerMiddleware");
exports.WorkerMiddleware = WorkerMiddleware_1.WorkerMiddleware;
exports.MultiWorkerMiddleware = WorkerMiddleware_1.MultiWorkerMiddleware;
var PromisifyMiddleware_1 = require("./PromisifyMiddleware");
exports.PromisifyMiddleware = PromisifyMiddleware_1.PromisifyMiddleware;
var ControllerView_1 = require("./ControllerView");
exports.createControllerView = ControllerView_1.createControllerView;
var Store_1 = require("./Store");
exports.createStore = Store_1.createStore;
var WebsocketMiddleware_1 = require("./WebsocketMiddleware");
exports.WebSocketMiddleware = WebsocketMiddleware_1.WebSocketMiddleware;
var LocalStoragePersistentStrategy_1 = require("./LocalStoragePersistentStrategy");
exports.localStorageStrategy = LocalStoragePersistentStrategy_1.localStorageStrategy;
(function (StrikeJS) {
    StrikeJS.localStorageStrategy = LocalStoragePersistentStrategy_1.localStorageStrategy;
    StrikeJS.createStore = Store_1.createStore;
    StrikeJS.createControllerView = ControllerView_1.createControllerView;
    StrikeJS.PromisifyMiddleware = PromisifyMiddleware_1.PromisifyMiddleware;
    StrikeJS.extractArgumentsFromFunction = Injector_1.extractArgumentsFromFunction;
    StrikeJS.WorkerMiddleware = WorkerMiddleware_1.WorkerMiddleware;
    StrikeJS.createPool = Pool_1.createPool;
    StrikeJS.createManagedState = ManagedState_1.createManagedState;
    StrikeJS.Injectable = InjectableMiddleware_1.Injectable;
    StrikeJS.Injector = Injector_1.Injector;
    StrikeJS.MultiWorkerMiddleware = WorkerMiddleware_1.MultiWorkerMiddleware;
    StrikeJS.WebSocketMiddleware = WebsocketMiddleware_1.WebSocketMiddleware;
}(window.StrikeJS = window.StrikeJS || {}));