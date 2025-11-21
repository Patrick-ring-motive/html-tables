
const isNum = x =>{
    try{
        return String(x).trim().length != 0 && !isNaN(x);
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

const isNode = x => instanceOf(x,Node) 
                 || isPrototypeOf(Node.prototype,x) 
                 || x?.constructor?.name == 'Node';

const isArray = x => instanceOf(x,Array) 
                  || isPrototypeOf(Array.prototype,x)
                  || Array.isArray(x)
                  || x?.constructor?.name == 'Array';

const isNodeList = x => instanceOf(x,NodeList) 
                 || isPrototypeOf(NodeList.prototype,x) 
                 || x?.constructor?.name == 'NodeList';

const isHTMLCollection = x => instanceOf(x,HTMLCollection) 
                 || isPrototypeOf(HTMLCollection.prototype,x) 
                 || x?.constructor?.name == 'HTMLCollection'
                 || instanceOf(x,HTMLAllCollection) 
                 || isPrototypeOf(HTMLAllCollection.prototype,x) 
                 || x?.constructor?.name == 'HTMLAllCollection';


const isList = x => isArray(x) || isNodeList(x) || isHTMLCollection(x);

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
        console.warn(e,el,query);
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
  set(target, prop, value, receiver) {
    const $this = receiver ?? target;
    if(isNum(prop) && prop >= 0){
        const num = parseInt(prop);
        const numt1 = num + 1;
        for(let i = 0;i !== numt1; ++i){
            if(!getCells($this)[i]){
                $this.appendChild(create('td'));
            }
        }
        const cell = getCells($this)[num];
        if(!isNode(value)){
            value = document.createTextNode(String(value));
        }
        cell.innerText = '';
        cell.appendChild(value);
        return value;
    }
    return Reflect.set(...arguments);
  },
});

const getRows = el => {
    return elementSelectAll(el, 'tr:not(tr tr)');
};

const $Table = class Table extends HTMLTableElement {
    constructor(data) {
        const table = Object.setPrototypeOf(create('table'), $Table.prototype);
        if(isNode(data)){
            data = getRows(data);
        }
        if (isList(data)) {
            const grid = [...data];
            const gridLength = grid.length;
            for (let i = 0; i !== gridLength; ++i) {
                try{
                    const row = new $Row();
                    let list = grid[i];
                    if(isNode(list)){
                        list = getCells(list);
                    }
                    if (isList(list)) {
                        const arr = [...list];
                        const arrLength = arr.length;
                        for (let x = 0; x !== arrLength; ++x) {
                            try{
                                row[x] = arr[x];
                            }catch(e){
                                console.warn(e);
                            }
                        }
                    }
                    table.appendChild(row);
                }catch(e){
                    console.warn(e);
                }
            }
        }
        return table;
    }
};

const _TablePrototype = $Table.prototype;

$Table.prototype = new Proxy(_TablePrototype, {
    get(target, prop, receiver) {
        const $this = receiver ?? target;
        if (isNum(prop)) {
            return getRows($this)?.[prop];
        }
        return Reflect.get(...arguments);
    },
    set(target, prop, value, receiver) {
        const $this = receiver ?? target;
        if (isNum(prop) && prop >= 0) {
            const num = parseInt(prop);
            const numt1 = num + 1;
            for (let i = 0; i !== numt1; ++i) {
                if (!getRows($this)[i]) {
                    $this.appendChild(new $Row());
                }
            }
            const row = getRows($this)[num];
            // Value should be an array or a row element
            if (isList(value)) {
                const arr = [...value];
                const arrLength = arr.length;
                for (let x = 0; x !== arrLength; ++x) {
                    try{
                        row[x] = arr[x];
                    }catch(e){
                        console.warn(e);
                    }
                }
            } else if (isNode(value)) {
                $this.replaceChild(value, row);
            }
            return value;
        }
        return Reflect.set(...arguments);
    }
});
