/// <reference path="flex.core.js" />
/*global flex*/
/// <module>
///     <summary>
///         Registry of all flex modules.
///     </summary>
/// </module>
(function() {
    "use strict";
    if (typeof flex !== 'undefined') {
        //Declaration of modules
        /// <var>Collection of flex libraries</var>
        flex.libraries = {
            /// <field type = 'function'>Basic events controller</field>
            events  : { settings: true, source: 'kernel/flex.events.js', hash: 'TESTHASHPROPERTY' },
            /// <field type = 'function'>Collection of tools for management of DOM</field>
            html    : { settings: true, source: 'kernel/flex.html.js', hash: 'TESTHASHPROPERTY' },
            /// <field type = 'function'>Collection of UI elements</field>
            ui      : {
                /// <field type = 'function'>Controller of window</field>
                window      : {
                    /// <field type = 'function'>Controller of window movement</field>
                    move    : { settings: true, source: 'kernel/flex.ui.window.move.js', hash: 'TESTHASHPROPERTY' },
                    /// <field type = 'function'>Controller of window resize</field>
                    resize  : { settings: true, source: 'kernel/flex.ui.window.resize.js', hash: 'TESTHASHPROPERTY' },
                },
                /// <field type = 'function'>Controller of templates</field>
                templates   : { settings: true, source: 'kernel/flex.ui.templates.js', hash: 'TESTHASHPROPERTY' },
                /// <field type = 'function'>Controller of scrollbox</field>
                scrollbox   : { settings: true, source: 'kernel/flex.ui.scrollbox.js', resources: ['kernel/css/flex.ui.scrollbox.css'], hash: 'TESTHASHPROPERTY' },
            },
            program: { settings: true, source: 'program/program.js', hash: 'TESTHASHPROPERTY' },
        };
    }
}());