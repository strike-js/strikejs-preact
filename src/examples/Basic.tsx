import {createControllerView} from '../ControllerView'; 
import {localStorageStrategy} from '../LocalStoragePersistentStrategy'; 
import {createStore} from '../Store'; 
import {render,Component,h} from 'preact'; 

class Dino extends Component<any,any>{
    constructor(p){
        super(p);
        this.onChange = this.onChange.bind(this);
    }
    onChange(e){
        let el = e.currentTarget; 
        this.props.onChange(el.value); 
    }
    render({value}){
        return (
            h('div',{'class':'bit'},[
                h('div',{'class':'input'},
                    h('input',{type:'number',
                        onChange:this.onChange, 
                        value:value}))
            ])
        );
    }
}

function onChange(e:string){

}

class Basic extends Component<any,any>{
    constructor(props){
        super(props); 
        this.onChange = this.onChange.bind(this); 
        this.onClick = this.onClick.bind(this); 
    }

    componentDidMount(){
        // console.log(this.props);
    }

    onClick(){
        this.props.store.dispatch({ 
            type:1,
            data:2222
        });
    }

    onChange(txt:string){
        this.props.store.dispatch({
            type:1,
            data:txt
        });
    }

    render(){
        let {data} = this.props;
        return (
            h('div',{'class':'container'},[
                h('div',{
                    onClick:this.onClick
                },'Click me'),
                h(Dino,{
                    onChange:this.onChange,
                    value:data.input
                })
            ])
        );
        
    }
}

let cx = localStorageStrategy(); 

let div = document.createElement('div'); 
document.body.appendChild(div); 
let store = createStore({
    ready:true,
    trackChanges:false,
    middlewares:[]
});

const CV = createControllerView({
    component:Basic,
    initialState:{
        name:'Borqa',
        input:0,
    },
    reducer:(state,action)=>{
        state.$set('input',action.data);
    },
    stateKey:'basic'

});
let root = render(h(CV,{store:store,injector:null,persistenceStrategy:cx}),div);

var i = 0; 

var count = 0; 

function tick(){
    count++;
    if (count === 2){
        i++;
        store.dispatch({
            type:1,
            data:i
        });
        count = 0; 

    } 

    requestAnimationFrame(tick);
}

// requestAnimationFrame(tick);
const TX = function(){return h('h1',{},'Suhail')}; 
setTimeout(()=>{
    console.log('blah');
    console.log(div);
    render(h(TX,{}),div,root);
},2000);