/// <reference path="flex.core.js" />
/*global flex*/
/// <module>
///     <summary>
///         Registry of all flex events.
///     </summary>
/// </module>
(function() {
    "use strict";
    if (typeof flex !== 'undefined') {
        flex.registry           = flex.registry || {};
        //Declaration of modules
        /// <var>Collection of flex events</var>
        flex.registry.events    = {
            /// <field type = 'object'>Events of UI</field>
            ui: {
                /// <field type = 'object'>Events of scrollbox</field>
                scrollbox: {
                    GROUP               : 'flex.ui.scrollbox',
                    REFRESH             : 'refresh',
                    REFRESH_BY_PARENT   : 'refresh_by_parent'
                }
            }
        };
    }
}());