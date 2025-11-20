
const isNum = x =>{
    try{
        return x?.length != 0 && !isNaN(x);
    }catch{
        return false;
    }

};

const create = x =>{
    try{
        return document.createElement(String(x));
    }catch(e){
        console.warn(e,x);
        return document.createElement('error');
    }
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
        return $this?.querySelectorAll?.('td:not(td td)')?.[prop];
    }
    return Reflect.get(...arguments);
  },
  get(target, prop, receiver) {
    const $this = receiver ?? target;
    if(isNum(prop) && prop >= 0){
        for(const td of $this){
            
        }
    }
    return Reflect.get(...arguments);
  },
});

const Table = class Table extends HTMLTableElement{
    constructor
}
