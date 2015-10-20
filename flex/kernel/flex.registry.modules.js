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
            events  : { settings: true, source: 'kernel/flex.events.js', hash: 'HASHPROPERTY' },
            /// <field type = 'function'>Collection of tools for management of DOM</field>
            html    : { settings: true, source: 'kernel/flex.html.js', hash: 'HASHPROPERTY' },
            css     : {
                /// <field type = 'function'>Controller CSS animation</field>
                animation   : { settings: true, source: 'kernel/flex.css.animation.js', hash: 'HASHPROPERTY' },
                /// <field type = 'function'>Controller CSS events</field>
                events      : { settings: true, source: 'kernel/flex.css.events.js', hash: 'HASHPROPERTY' },
            },
            /// <field type = 'function'>Collection of UI elements</field>
            ui      : {
                /// <field type = 'function'>Controller of window</field>
                window      : {
                    /// <field type = 'function'>Controller of window movement</field>
                    move    : { settings: true, source: 'kernel/flex.ui.window.move.js',        hash: 'HASHPROPERTY' },
                    /// <field type = 'function'>Controller of window resize</field>
                    resize  : { settings: true, source: 'kernel/flex.ui.window.resize.js',      hash: 'HASHPROPERTY' },
                    /// <field type = 'function'>Controller of window resize</field>
                    focus   : { settings: true, source: 'kernel/flex.ui.window.focus.js',       hash: 'HASHPROPERTY' },
                    /// <field type = 'function'>Controller of window maximize / restore</field>
                    maximize: { settings: true, source: 'kernel/flex.ui.window.maximize.js',    hash: 'HASHPROPERTY' },
                },
                /// <field type = 'function'>Controller of templates</field>
                templates   : { settings: true, source: 'kernel/flex.ui.templates.js',      hash: 'HASHPROPERTY' },
                /// <field type = 'function'>Controller of scrollbox</field>
                scrollbox   : { settings    : true, source : 'kernel/flex.ui.scrollbox.js', hash : 'HASHPROPERTY' },
                /// <field type = 'function'>Controller of itemsbox</field>
                itemsbox    : { settings: true, source: 'kernel/flex.ui.itemsbox.js',       hash: 'HASHPROPERTY' },
                /// <field type = 'function'>Controller of areaswitcher</field>
                areaswitcher: { settings: true, source: 'kernel/flex.ui.areaswitcher.js',   hash: 'HASHPROPERTY' },
                /// <field type = 'function'>Controller of areascroller</field>
                areascroller: { settings: true, source: 'kernel/flex.ui.areascroller.js',   hash: 'HASHPROPERTY' },
                /// <field type = 'function'>Controller of arearesizer</field>
                arearesizer : { settings: true, source: 'kernel/flex.ui.arearesizer.js',    hash: 'HASHPROPERTY' },
            },
            presentation: { settings: true, source: 'program/presentation.js', hash: 'HASHPROPERTY' },
        };
    }
}());