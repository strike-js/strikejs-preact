"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ControllerView_1 = require("../ControllerView");
var LocalStoragePersistentStrategy_1 = require("../LocalStoragePersistentStrategy");
var Store_1 = require("../Store");
var preact_1 = require("preact");
var Dino = (function (_super) {
    __extends(Dino, _super);
    function Dino(p) {
        var _this = _super.call(this, p) || this;
        _this.onChange = _this.onChange.bind(_this);
        return _this;
    }
    Dino.prototype.onChange = function (e) {
        var el = e.currentTarget;
        this.props.onChange(el.value);
    };
    Dino.prototype.render = function (_a) {
        var value = _a.value;
        return (preact_1.h('div', { 'class': 'bit' }, [
            preact_1.h('div', { 'class': 'input' }, preact_1.h('input', { type: 'number',
                onChange: this.onChange,
                value: value }))
        ]));
    };
    return Dino;
}(preact_1.Component));
function onChange(e) {
}
var Basic = (function (_super) {
    __extends(Basic, _super);
    function Basic(props) {
        var _this = _super.call(this, props) || this;
        _this.onChange = _this.onChange.bind(_this);
        _this.onClick = _this.onClick.bind(_this);
        return _this;
    }
    Basic.prototype.componentDidMount = function () {
        // console.log(this.props);
    };
    Basic.prototype.onClick = function () {
        this.props.store.dispatch({
            type: 1,
            data: 2222
        });
    };
    Basic.prototype.onChange = function (txt) {
        this.props.store.dispatch({
            type: 1,
            data: txt
        });
    };
    Basic.prototype.render = function () {
        var data = this.props.data;
        return (preact_1.h('div', { 'class': 'container' }, [
            preact_1.h('div', {
                onClick: this.onClick
            }, 'Click me'),
            preact_1.h(Dino, {
                onChange: this.onChange,
                value: data.input
            })
        ]));
    };
    return Basic;
}(preact_1.Component));
var cx = LocalStoragePersistentStrategy_1.localStorageStrategy();
var div = document.createElement('div');
document.body.appendChild(div);
var store = Store_1.createStore({
    ready: true,
    trackChanges: false,
    middlewares: []
});
var CV = ControllerView_1.createControllerView({
    component: Basic,
    initialState: {
        name: 'Borqa',
        input: 0,
    },
    reducer: function (state, action) {
        state.$set('input', action.data);
    },
    stateKey: 'basic'
});
var root = preact_1.render(preact_1.h(CV, { store: store, injector: null, persistenceStrategy: cx }), div);
var i = 0;
var count = 0;
function tick() {
    count++;
    if (count === 2) {
        i++;
        store.dispatch({
            type: 1,
            data: i
        });
        count = 0;
    }
    requestAnimationFrame(tick);
}
// requestAnimationFrame(tick);
var TX = function () { return preact_1.h('h1', {}, 'Suhail'); };
setTimeout(function () {
    console.log('blah');
    console.log(div);
    preact_1.render(preact_1.h(TX, {}), div, root);
}, 2000);
