# jml-h

> **J**son**ML** + Virtual **H**ypertext generator

Super light-weight 60-line package to work with `JsonML` and *Virtual Hypertext* functions 
to generate XML/HTML or virtual DOM from `JsonML`.

```js
var lib = require('jml-h');
var h = lib.h;

var html =
    h('div', {'class': 'wrapper'},
        h('div', {'class': 'avatar'},
            h('img', {src: '...'}),
            h('span', {},
                'Hello there'
            ),
            h('br')
        )
    );
console.log(html);
// <div class="wrapper"><div class="avatar"><img src="..."/><span>Hello there</span><br/></div></div>
```

Or using `JsonML`:

```js
console.log(lib.dom(
    ['div', {'class': 'wrapper'},
        ['div', {'class': 'avatar'},
            ['img', {src: '...'}],
            ['span',
                'Hello there'
            ],
            ['br']
        ]
    ]
));
// <div class="wrapper"><div class="avatar"><img src="..."/><span>Hello there</span><br/></div></div>
```

## Reference

```ts
type JsonMLNode         = [tag: string, attributes?: {}, ...children: JsonMLNode[]];
type JsonMLNodeReplaced = any|[tag: string, attributes?: {}, ...children: (any|JsonMLNode)[]];
type VHypertext         = (tag: string, attributes: {}, ...children: JsonMLNodeReplaced[]) => JsonMLNodeReplaced;
```

#### `attr(obj: {}): string`

Formats a collection of tag attributes into an HTML string.

```js
var attributes = {id: 'header', 'class': 'floating'};
console.log(lib.attr(attributes));
// id="header" class="floating"
```

#### `h(tag: string, attributes: {}, ...children: string[]): string`

The most basic *Virtual Hypertext* function that directly generates an HTML string.

```js
var h = lib.h;
var html = h('div', {'class': 'main'},
    h('a', {href: '...'},
        'Click me'
    )
);
console.log(html);
// <div class="main"><a href="...">Click me</a></div>
```

#### `traverse(jml: JsonMLNode, callback: (node: JsonMLNodeReplaced) => any): any`

Traverses `JsonML` object starting from leaf nodes calling `callback` for every node. `callback`
receives a `JsonML` node as a single argument.

The value returned by `callback` is used to replace that node when the `callback`
is called for its parent node.

```js
lib.traverse(
    ['div', {'class': 'wrapper'},
        ['div', {'class': 'avatar'},
            ['img', {src: '...'}],
            ['span',
                'Hello there'
            ],
            ['br']
        ]
    ], function(node) {
        console.log(node);
        return node;
    }
);
```

#### `dom(jml: JsonMLNode, h: VHypertext): any`

`dom` accepts two arguments: a `JsonML` tree and a *Virtual Hypertext* function `h`, it
feeds `JsomML` nodes one-by-one to the, Virtual Hypertext effectively creating a `Virtual DOM`.

By default it uses the bundled `h` function:

```js
var vdom = lib.dom(
    ['div', {'class': 'wrapper'},
        ['a', {'href': '#link'}, 'Click me!']
    ]
);
console.log(vdom); // <div class="wrapper"><a href="#link">Click me!</a></div>
```

Alternatively you can provide the Virtual Hypertext function of your framework, for example:

```js
var jml = ['div', {'class': 'wrapper'},
    ['a', {'href': '#link'}, 'Click me!]
];

// React.js
lib.dom(jml, React.createElement.bind(React));

// Mithril.js
lib.dom(jml, m);

// virtual-dom
var h = require('virtual-dom/h');
lib.dom(jml, h);
```

#### `map(transform: (node: JsonMLNode) => JsonMLNode, h: VHypertext): VHypertext`

Based on existing hypertext function `h` creates a new hypertext function that applies `transform` function
to every JsonML node before giving it to the original `h`.

For example, replace `div` tags with `span` tags:

```js
var jml = ['div', null, 'Hello'];
function divToSpan(node) {
    if(node[0] === 'div') node[0] = 'span';
    return node;
}
var new_h = lib.map(divToSpan, lib.h);
console.log(lib.dom(jml, new_h));
```

## What is `JsonML`

`JsonML` is a compact representation of `XML/HTML` as JSON or JavaScript objects. Consider the following
 HTML snippet:
 
```html
<ul class="my-list">
    <li><a href="#link1">Click 1</a></li>
    <li><a href="#link2">Click 2</a></li>
</ul>
```

In `JsonML` it can be represented as follows:

```js
['ul', {'class': 'my-list'},
    ['li',
        ['a', {href: '#link1'}, 'Click 1'],
    ]
    ['li',
        ['a', {href: '#link2'}, 'Click 2'],
    ]
]
```

Basically, every node is represented by an array, where first element is a tag name,
the second element is a collection of attributes and all the rest elements represent child nodes.

```ts
type JsonMLNode = [tag: string, attributes?: {}, ...children: JsonMLNode[]];
```

## Virtual Hypertext Generator `h`

*Virtual Hypertext* generator function, frequently represented by `h` and has a similar syntax to `JsonML`.

It is frequently used in virtual DOM templating libraries, such as `React.js`, `Mithril.js`, `virtual-dom`, etc.

Even if your virtual DOM templating library does not have a Virtual Hypertext function, you can create it yourself.

To generate the above HTML with `h`, you would write this:

```js
h('ul', {'class': 'my-list'},
    h('li', null,
        h('a', {href: '#link1'}, 'Click 1'),
    ),
    h('li', null,
        h('a', {href: '#link2'}, 'Click 2'),
    )
);
```

Virtual Hypertext function is defined as follows:

```ts
h(tag: string, attributes: {}, ...children: any[]): any;
```

## Virtual Tag Functions

Create convenience function `div()`, `span()`, etc..

```js
var h = lib.h;
lib.tags(h, h, ['div', 'span']);
var {div, span} = h;
console.log(div({'class': 'test'}, span(null, 'Hello')));
// <div class="test"><span>Hello</span></div>
```

## Usage with React.js

The second argument to the `dom()` function is a Virtual Hypertext generator function, you can provide
`React.createElement.bind(React)` to it to generate React's virtual DOM.

Generate React Virtual DOM representations from `JsonML` lists instead of using `React.createElement` or `.jsx`
files and compiling them to `.js`: 

```js
var react_dom = lib.dom(
    ['div', {className: 'test'},
        ['span', null,
            'Hello world!'
        ]
    ], React.createElement.bind(React)
);
```

This is equivalent to:

```js
var react_dom = React.createElement('div', {className: 'test'},
    React.createElement('span', null, 'Hello world!'));
```

You might consider creating the *React's Virtual Hypertext* function for convenience:

```js
React.h = React.createElement.bind(React);
```

And then create `JsonML` to virtual DOM generator:

```js
React.dom = function(jml) {
    return lib.dom(jml, React.h);
};
```

So now, instead of installing `.jsx` to `.js` compiler and writing `XML` in your JavaScript projects,
like so:

```jsx
var CommentBox = React.createClass({
    render: function() {
        return (
            <div className="commentBox">
                Hello, world! I am a CommentBox.
            </div>
        );
    }
});
```

You can do everything in **100%** JavaScript:

```jsx
var CommentBox = React.createClass({
    render: function() {
        return React.dom(
            // BONUS:
            // You can now add plain comments to your React templates,
            // without the required {/* */} syntax (in some places).           
            ['div', {className: 'commentBox'},
                'Hello, world! I am a CommentBox.'
            ]
        );
    }
});
```

TypeScript definitions for your extension:

```ts
declare namespace __React {
    export var h: (...jml: any[]) => React.ReactElement<any>;
    export var dom: (jml: any[]) => React.ReactElement<any>;
}
```
