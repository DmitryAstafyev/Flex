/// <module>
///     <summary>
///         Settings of [flex].
///     </summary>
/// </module>
(function () {
    "use strict";
    var init = function () {
            flex.init({
                resources: {
                    MODULES: [
                        'flex.ui.window.move',
                        'flex.ui.window.resize',
                        'flex.ui.templates',
                        'flex.ui.scrollbox',
                        'flex.program'
                    ],
                    EXTERNAL: [
                        { url: '/program/highlight/highlight.pack.js', hash: 'TESTHASHPROPERTY' },
                        { url: '/program/highlight/styles/default.css', hash: 'TESTHASHPROPERTY' }
]
                },
                paths   : {
                    CORE: '/kernel'
                },
                events  : {
                    finish: function () {
                        var program = flex.libraries.program.create();
                        program.dynamically();
                    }
                }
            });
        },
        start = function () {
            if (typeof flex !== 'undefined') {
                init();
            } else {
                setTimeout(start, 50);
            }
        };
    start();
}());