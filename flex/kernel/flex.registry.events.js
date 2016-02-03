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
                scrollbox   : {
                    GROUP               : 'flex.ui.scrollbox',
                    REFRESH             : 'refresh',
                },
                /// <field type = 'object'>Events of itemsbox</field>
                itemsbox    : {
                    GROUP               : 'flex.ui.itemsbox',
                    REFRESH             : 'refresh',
                },
                /// <field type = 'object'>Events of arearesizer</field>
                arearesizer : {
                    GROUP               : 'flex.ui.arearesizer',
                    REFRESH             : 'refresh',
                },
                window      : {
                    /// <field type = 'object'>Events of window resize module</field>
                    resize  : {
                        GROUP   : 'flex.ui.window.resize',
                        REFRESH : 'refresh',
                        FINISH  : 'finish',
                    },
                    /// <field type = 'object'>Events of window maximize / restore module</field>
                    maximize: {
                        GROUP       : 'flex.ui.window.maximize',
                        MAXIMIZED   : 'maximized',
                        RESTORED    : 'restored',
                        CHANGE      : 'change',
                    }
                }
            },
            /// <field type = 'object'>Events of Flex (system events)</field>
            system: {
                /// <field type = 'object'>Events of logs</field>
                logs: {
                    GROUP       : 'flex.system.logs.messages',
                    CRITICAL    : 'critical',
                    LOGICAL     : 'logical',
                    WARNING     : 'warning',
                    NOTIFICATION: 'notification',
                    LOGS        : 'log',
                    KERNEL_LOGS : 'kernel_logs',
                },
                cache: {
                    GROUP               : 'flex.system.cache.events',
                    ON_NEW_MODULE       : 'ON_NEW_MODULE',
                    ON_UPDATED_MODULE   : 'ON_UPDATED_MODULE',
                    ON_NEW_RESOURCE     : 'ON_NEW_RESOURCE',
                    ON_UPDATED_RESOURCE : 'ON_UPDATED_RESOURCE',
                }
            }
        };
    }
}());