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
                        { url: '/kernel/body.css', hash: 'TESTHASHPROPERTY' }
                    ],
                    USE_STORAGED : true
                },
                paths   : {
                    CORE: '/kernel'
                },
                events  : {
                    finish: function () {
                        var program = flex.libraries.program.create();
                        program.fromLayout();
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