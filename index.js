"use strict";
function attr(attributes) {
    var list = [];
    for (var prop in attributes) {
        var value = attributes[prop];
        if (typeof value === 'string')
            list.push(prop + "=\"" + value.replace(/[\"]/g, '\\"') + "\"");
        else
            list.push(prop + "=\"" + value + "\"");
    }
    return list.join(' ');
}
exports.attr = attr;
function h(name, attributes) {
    if (attributes === void 0) { attributes = null; }
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    var attrstr = attr(attributes);
    var body = children.join('');
    return ("<" + name + (attrstr ? ' ' + attrstr : '')) + (body ? ">" + body + "</" + name + ">" : '/>');
}
exports.h = h;
function traverse(jml, callback) {
    var children_start = 2;
    var attr = jml[1];
    if ((attr !== null) && ((typeof attr !== 'object') || (attr instanceof Array))) {
        attr = null;
        children_start = 1;
    }
    var list = [jml[0], attr];
    // Add children
    for (var i = children_start; i < jml.length; i++) {
        var child = jml[i];
        function c(child) {
            if (child instanceof Array) {
                // This flattens an array of children, makes compatible with React.
                if (child[0] instanceof Array)
                    for (var j = 0; j < child.length; j++)
                        c(child[j]);
                else
                    list.push(traverse(child, callback));
            }
            else
                list.push(child);
        }
        c(child);
    }
    return callback(list);
}
exports.traverse = traverse;
function dom(jml, _) {
    if (_ === void 0) { _ = h; }
    return traverse(jml, function (node) { return _.apply(null, node); });
}
exports.dom = dom;
