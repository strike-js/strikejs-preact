import {createPool,Pool} from './Pool'; 
import {Reducer} from './Reducer';
import {IMiddleware} from './Middleware';
import {IManagedState,createManagedState} from './ManagedState'; 
import {StatefulComponent} from './StatefulComponent';
import {Action} from './Action';

/**
 * A function that consumes an {@link Action}
 */
export interface ActionConsumer {
	(action:Action):void; 
}

/**
 * A function that receives an action consumer {@link ActionConsume} which is 
 * then called with an action. 
 */
export interface ActionReceiver{
	(fn:ActionConsumer):void;
}

/**
 * Represents store configuration options 
 */
export interface StoreCfg {
	/**
	 * @type {boolean} 
	 * @description whether the store is ready to execute actions. 
	 */
	ready?:boolean; 
	/**
	 * @type {boolean}
	 * @description whether the store to track changes.
	 */
	trackChanges?:boolean; 
	/**
	 * @type {Array<Middleware>} 
	 * @description an array of middlewares to add to the store. 
	 */
	middlewares?:IMiddleware[];
}

/**
 * An action handler interface 
 */
export interface ActionHandler<T> {
	(data:T):Action|ActionReceiver|Promise<Action>;
}

/**
 * A state container store 
 */
export interface IStore {
	/**
	 * Connects a component to the store. 
	 * @param {StatefulComponent<T>} el the component to connect to the store. 
	 * @returns {IStore} the store instance. 
	 */
	connect<T,V>(el:StatefulComponent<T,V>):this;
	/**
	 * Disconnects a component from the store. 
	 * @param {StatefulComponent<T>} el the component to disconnect. 
	 * @returns {IStore} the store instance. 
	 */ 
	disconnect<T,V>(el:StatefulComponent<T,V>):this; 
	/**
	 * Set the state of a specific component within the state. 
	 * @param {string} key the component's key. 
	 * @param {T} val the updated state. 
	 * @returns {IStore} the store instance; 
	 */
	setStateAt<T>(key:string,val:T):this; 
	/**
	 * Get the state of a specific component. 
	 * @param {string} key the component's key. 
	 * @returns {T} the state of the component. 
	 */
	getStateAt<T>(key:string):T; 
	/**
	 * Dispatches an action within the store. 
	 * @param {Action} action the action to dispatch. 
	 * @throws {Error} if no action is provided 
	 */
	dispatch(action:Action|Promise<Action>|ActionReceiver):void;  
	/**
	 * Dispatches an action within the store. 
	 * @param {string} key the key to the specific state to be passed to the consumer
	 * @param {ActionHandler} handler a higher-order function that receives the specific part of the state. 
	 */
	dispatch<T>(key:string,action:ActionHandler<T>):void; 
	/**
	 * Sets the store to be ready to execute actions. 
	 */
	ready():void;
}

/**
 * Creates a state container instance with the provided configurations
 * @param {StoreCfg} cfg the store configurations. 
 * @returns {IStore} 
 */
export function createStore(cfg:StoreCfg):IStore{
	let components:Dictionary<StatefulComponent<any,any>> = {}; 
	let actions:Dictionary<Action> = {}; 
	let backlog:Action[] = [];
	let middlewares:IMiddleware[] = cfg.middlewares || [];
	let isReady = typeof cfg.ready === "undefined"?true:cfg.ready; 
	let trackChanges = typeof cfg.trackChanges === "undefined"?false:cfg.trackChanges; 
	let o:IStore = null;
	let queue:Action[] = [];
	let pool = createPool(createManagedState); 

	function connect<T,V>(el:StatefulComponent<T,V>):IStore{
		components[el.getStateKey()] = el; 
		return o; 
	} 

	function disconnect<T,V>(el:StatefulComponent<T,V>):IStore{
		delete components[el.getStateKey()]; 
		return o;
	}

	function getStateAt<T>(key:string){
		return components[key].state; 
	}

	function setStateAt<T>(key:string,val:T):IStore{
		if (components[key]){
			components[key].setState(val);
			return o; 
		}
		throw new Error(`Component with key ${key} could not be found`); 
	}

	function applyMiddleware(action:Action,done:(action:Action|null|undefined)=>void):void{
		let idx = 0; 
		let m:IMiddleware = null;

		function next(action?:Action){
			if (!action || idx >= middlewares.length){
				return done(action); 
			}
			m = middlewares[idx]; 
			idx++; 
			return m(action,o,next);
		}

		next(action); 
	}

	function execute(action){
		if (action){
			if (trackChanges){
				backlog.push(action);
			}
			let managedState = pool.get();
			for(var key in components){
				managedState.setState(components[key].state); 
				let rd = components[key].getReducer();
				if (rd){
					rd(managedState,action);
					if (managedState.hasChanges){
						components[key].setState(managedState.changes());
					}
				}
			}
			pool.put(managedState);
		}
	}

	function ready(){
		isReady = true; 
		let action:Action = null;
		while((action = queue.shift())){
			dispatch.apply(null,action);
		}
	}

	function onAction(action:Action){
		let act = applyMiddleware(action,(finalAction)=>{
			finalAction && execute(finalAction); 
		}); 
	}

	function onActionFail(err:Error){
		console.log(err,err.message,err.stack);
	}

	function dispatch(action:ActionReceiver|Action|Promise<Action>):void;
	function dispatch<T>(key:string,action:ActionHandler<T>):void;
	function dispatch(...args:any[]){
		if (!isReady){
			queue.push(Array.prototype.slice.call(args,0));
			return;
		}
		if (args.length === 0){
			throw new Error(`No action provided`); 
		}else if (args.length === 1){
			if (typeof args[0] === "function"){
				args[0](onAction);
			}else if (typeof args[0] === "object"){
				if (args[0].type){
					onAction(args[0]);
				}else if (args[0].then && typeof args[0].then === "function"){
					args[0].then(onAction,onActionFail);
				}
			}
		}else if (args.length === 2){
			if ((typeof args[0] === "string" || 
				typeof args[0] === "number") && 
				typeof args[1] !== "object") {
				onAction({
					type:args[0],
					data:args[1]
				});
			} else if (typeof args[0] === "string" && 
				typeof args[1] === "function"){
				let st = components[args[0]] && components[args[0]].state; 
				let a = args[1](st,onAction);
				if (a && a.type){
					onAction(a);
				}else if (typeof a === "object" && 
					typeof a.then === "function"){
					a.then(onAction,onActionFail); 
				}
			}
		}
	}


	o = {
		connect,
		disconnect,
		getStateAt,
		setStateAt,
		dispatch,
		ready,
	}; 

	return o; 
}