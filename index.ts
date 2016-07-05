

export type Tname = string;
export type Tattributes = {[s: string]: number|string|boolean};
export type Tchild = any; // `any` just becase TypeScript does not allow circular references.
export type Ttag = [Tname, Tattributes, Tchild[]];


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
        function c(child) {
            if(child instanceof Array) {
                // This flattens an array of children, makes compatible with React.
                if(child[0] instanceof Array)
                    for(var j = 0; j < child.length; j++) c(child[j]);
                else list.push(traverse(child, callback));
            } else list.push(child);
        }
        c(child);
    }
    return callback(list);
}


export function dom(jml, _ = h) {
    return traverse(jml, (node) => { return _.apply(null, node); });
}
