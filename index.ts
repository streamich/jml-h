

export type Tname = string;
export type Tattributes = {[s: string]: number|string|boolean};
export type Tchild = any; // `any` just becase TypeScript does not allow circular references.
export type Ttag = [Tname, Tattributes, Tchild[]];
export type TVirtualHypertext = (tag: string, attributes: any, ...children: any[]) => any;


export function attr(attributes) {
    var list = [];
    for(var prop in attributes) {
        var value = attributes[prop];
        if(typeof value === 'string')   list.push(`${prop}="${(value as string).replace(/[\"]/g, '\\"')}"`);
        else                            list.push(`${prop}="${value}"`);
        // if(typeof value === 'number')   list.push(`${prop}="${value}"`);
        // if(typeof value === 'boolean')  list.push(`${prop}="${value ? '1' : '0'}"`);
    }
    return list.join(' ');
}


export function h(name: string, attributes: Tattributes = null, ...children: string[]): string {
    var attrstr = attr(attributes);
    var body = children.join('');
    return `<${name}${attrstr ? ' ' + attrstr : ''}` + (body ? `>${body}</${name}>` : '/>');
}


function _c(child, list, callback) {
    if(child instanceof Array) {
        // This flattens an array of children, makes compatible with React.
        if(child[0] instanceof Array)
            for(var j = 0; j < child.length; j++)
                _c(child[j], list, callback);
        else list.push(traverse(child, callback));
    } else {
        if(typeof child !== 'object')
            list.push(child);
    }
}

export function traverse(jml, callback) {
    var children_start = 2;
    var attr = jml[1];

    if((attr !== null) && ((typeof attr !== 'object') || (attr instanceof Array))) {
        attr = null;
        children_start = 1;
    }

    var list = [jml[0], attr];

    // Add children
    for(var i = children_start; i < jml.length; i++) {
        var child = jml[i];
        _c(child, list, callback);
    }
    return callback(list);
}


export function dom(jml, _ = h) {
    return traverse(jml, (node) => { return _.apply(null, node); });
}


// Create collection of `tag(attr, ..childrend)` functions
export function tags(col: any = {}, _: TVirtualHypertext = h, list: string[] = ['div', 'span', 'img']) {
    for(let tag of list)
        col[tag] = (attributes, ...children: any[]) => _.apply(null, [tag, attributes, ...children]);
}


export var map = (transform, _ = h) => (...args) => _.apply(null, transform(args));
