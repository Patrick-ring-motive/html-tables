
const isNum = x =>{
    try{
        return x?.length != 0 && !isNaN(x);
    }catch{
        return false;
    }

};

const instanceOf = (x,y) =>{
    try{
        return x instanceof y;
    }catch(e){
        console.warn(e,x,y);
        return false;
    }
};

const isPrototypeOf = (x,y)=>{
    try{
        return x.isPrototypeOf(y);
    }catch(e){
        console.warn(e,x,y);
        return false;
    }
};

const isNode = x => instanceOf(x,Node) || isPrototypeOf(Node.prototype,x) || x?.constructor?.name == 'Node';

const create = x =>{
    try{
        return document.createElement(String(x));
    }catch(e){
        console.warn(e,x);
        return document.createElement('error');
    }
};

const elementSelectAll = (el,query) =>{
    try{
        return el.querySelectorAll(query);
    }catch(e){
        return create('NodeList').childNodes;
    }
};

const getCells = el =>{
    return elementSelectAll(el,'td:not(td td)');
};

const $Row = class Row extends HTMLTableRowElement{
    constructor(){
        return Object.setPrototypeOf(create('tr'),$Row.prototype);
    }
}

const _RowPrototype = $Row.prototype;

$Row.prototype = new Proxy(_RowPrototype,{
  get(target, prop, receiver) {
    const $this = receiver ?? target;
    if(isNum(prop)){
        return getCells($this)?.[prop];
    }
    return Reflect.get(...arguments);
  },
  set(target, prop, receiver) {
    const $this = receiver ?? target;
    if(isNum(prop) && prop >= 0){
        const num = parseInt(prop);
        const numtt = num++;
        for(let i = 0;i !== numtt; ++i){
            if(!getCells($this)[i]){
                $this.appendChild(create('td'));
            }
        }
    }
    return Reflect.get(...arguments);
  },
});

const Table = class Table extends HTMLTableElement{
    constructor
}
