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
function _c(child, list, callback) {
    if (child instanceof Array) {
        // This flattens an array of children, makes compatible with React.
        if (child[0] instanceof Array)
            for (var j = 0; j < child.length; j++)
                _c(child[j], list, callback);
        else
            list.push(traverse(child, callback));
    }
    else {
        if (typeof child !== 'object')
            list.push(child);
    }
}
function traverse(jml, callback) {
    if (!jml)
        return null;
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
        _c(child, list, callback);
    }
    return callback(list);
}
exports.traverse = traverse;
function topDown(jml, callback) {
    if (!jml)
        return null;
    if (!(jml instanceof Array)) {
        if (typeof jml === 'object')
            return null;
        else
            return jml;
    }
    jml = callback(jml);
    var attr = jml[1];
    var children_start = 2;
    if ((attr !== null) && ((typeof attr !== 'object') || (attr instanceof Array))) {
        children_start = 1;
    }
    for (var i = children_start; i < jml.length; i++) {
        var child = jml[i];
        var res = topDown(child, callback);
        jml[i] = res || null;
    }
    return jml;
}
exports.topDown = topDown;
function dom(jml, _) {
    if (_ === void 0) { _ = h; }
    return traverse(jml, function (node) { return _.apply(null, node); });
}
exports.dom = dom;
// Create collection of `tag(attr, ..childrend)` functions
function tags(col, _, list) {
    if (col === void 0) { col = {}; }
    if (_ === void 0) { _ = h; }
    if (list === void 0) { list = ['div', 'span', 'img']; }
    var _loop_1 = function(tag) {
        col[tag] = function (attributes) {
            var children = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                children[_i - 1] = arguments[_i];
            }
            return _.apply(null, [tag, attributes].concat(children));
        };
    };
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
        var tag = list_1[_i];
        _loop_1(tag);
    }
}
exports.tags = tags;
exports.map = function (transform, _) {
    if (_ === void 0) { _ = h; }
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return _.apply(null, transform(args));
    };
};
