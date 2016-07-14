var lib = require('./index');
var _ = lib.h;


console.log(lib.attr({id: 'header', 'class': 'floating'}));

var html =
    _('div', {'class': 'wrapper'},
        _('div', {'class': 'avatar'},
            _('img', {src: '...'}),
            'Text',
            _('span', {},
                'Hello there'
            ),
            _('br')
        )
    );
console.log(html);

var pojo =
    ['span', null, [
        ['span', null, '1'],
        ['span', null, '2'],
    ]];

lib.traverse(pojo, function(node) {
    console.log(node);
    return node;
});

console.log(lib.traverse(pojo, function(node) {
    return lib.h.apply(null, node);
}));

console.log(lib.dom(pojo));
console.log(lib.dom(pojo, function(tag, attr, body) {
    return '<' + tag + ' ' + body + '>';
}));


var jml =
    ['div', {'class': 'wrapper'},
        ['div', {'class': 'avatar'},
            ['img', {src: '...'}],
            'Text',
            ['span', null,
                'Hello there'
            ],
            ['br'],
        ],
    ];
console.log(lib.dom(jml));

console.log(lib.dom(['div',
    ['span', 1],
    ['span', 2],
    ['span', 3]
]));

console.log(lib.dom(['div', [
    ['span', 1],
    ['span', 2],
    ['span', 3]
]]));


React = {
    createElement: function() {
        return (arguments);
    }
};
console.log(lib.dom(jml, React.createElement.bind(React)));
console.log(lib.dom(jml, _));


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


html = h('div', {'class': 'main'},
    h('a', {href: '...'},
        'Click me'
    )
);
console.log(html);


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


var vdom = lib.dom(
    ['div', {'class': 'wrapper'},
        ['a', {'href': '#link'}, 'Click me!']
    ]
);
console.log(vdom);

var l = {};
lib.tags(l, lib.h);
console.log(l.div({'class': 'test'}, l.span(null, 'Hello')));


var jml = ['div', null, 'Hello'];
function divToSpan(node) {
    if(node[0] === 'div') node[0] = 'span';
    return node;
}
var new_h = lib.map(divToSpan, lib.h);
console.log(lib.dom(jml, new_h));

