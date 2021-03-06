// LICENSE
// This file (core / module) is released under the BSD License. See [LICENSE] file for details.
/*global flex*/
/// <reference path='intellisense/flex.callers.node.intellisense.js' />
/// <reference path='intellisense/flex.callers.nodes.intellisense.js' />
/// <reference path='intellisense/flex.callers.object.intellisense.js' />
/// <reference path="intellisense/flex.intellisense.js" />
/// <module>
///     <summary>
///         Module control movement of some node on screen. Works only with position: absolute.
///     </summary>
/// </module>
(function () {
    "use strict";
    if (flex !== void 0) {
        var protofunction = function () { };
        protofunction.prototype = function () {
            /* Description
            * data-flex-ui-window-move-container
            * data-flex-ui-window-move-hook
            * */
            var //Get modules
                html            = flex.libraries.html.create(),
                events          = flex.libraries.events.create(),
                //Variables
                privates        = null,
                global          = null,
                processing      = null,
                settings        = null;
            settings = {
                CONTAINER           : 'data-flex-ui-window-maximize',
                HOOK                : 'data-flex-window-maximize-hook',
                INITED              : 'data-flex-window-maximize-inited',
                STORAGE             : 'flex-window-maximize-storage',
            };
            function init(id) {
                var selector    = new html.select.bySelector(),
                    id          = id || null,
                    containers  = selector.all('*[' + settings.CONTAINER + (id !== null ? '="' + id + '"' : '') + ']:not([' + settings.INITED + '])');
                if (containers !== null) {
                    Array.prototype.forEach.call(
                        containers,
                        function (container) {
                            var id      = container.getAttribute(settings.CONTAINER),
                                hooks   = null;
                            if (id !== '' && id !== null) {
                                hooks = selector.all('*[' + settings.HOOK + '="' + id + '"]');
                                if (hooks !== null) {
                                    processing.attach(container, hooks, id);
                                }
                            }
                            container.setAttribute(settings.INITED, true);
                            flex.overhead.objecty.set(container, settings.STORAGE, { maximazed: false }, true);
                        }
                    );
                }
            };
            processing = {
                attach: function (container, hooks, id) {
                    var DOMEvents = events.DOMEvents();
                    Array.prototype.forEach.call(
                        hooks,
                        function (hook, index) {
                            DOMEvents.add(
                                hook,
                                'click',
                                function (event) {
                                    processing.onClick(event, container, hooks, id);
                                    return true;
                                },
                                id + '_' + index
                            );
                        }
                    );
                },
                onClick : function (event, container, hooks, id) {
                    var storage = flex.overhead.objecty.get(container, settings.STORAGE, false);
                    if (storage !== null) {
                        if (storage.maximazed === false) {
                            processing.actions.maximaze(container, storage, id);
                        } else {
                            processing.actions.restore(container, storage, id);
                        }
                        //Run external events in background
                        setTimeout(
                            function () {
                                flex.events.core.fire(
                                    flex.registry.events.ui.window.maximize.GROUP,
                                    flex.registry.events.ui.window.maximize.CHANGE,
                                    { container: container, id: id }
                                );
                            },
                            10
                        );
                    }
                },
                actions: {
                    maximaze: function (container, storage, id) {
                        storage.maximazed   = true;
                        storage.size        = {
                            position: container.style.position  !== '' ? container.style.position   : false,
                            width   : container.style.width     !== '' ? container.style.width      : false,
                            height  : container.style.height    !== '' ? container.style.height     : false,
                            left    : container.style.left      !== '' ? container.style.left       : false,
                            top     : container.style.top       !== '' ? container.style.top        : false,
                        };
                        container.style.position    = 'fixed';
                        container.style.width       = '100%';
                        container.style.height      = '100%';
                        container.style.left        = '0px';
                        container.style.top         = '0px';
                        //Run external events in background
                        setTimeout(
                            function () {
                                flex.events.core.fire(
                                    flex.registry.events.ui.window.maximize.GROUP,
                                    flex.registry.events.ui.window.maximize.MAXIMIZED,
                                    { container: container, id: id }
                                );
                            },
                            10
                        );
                    },
                    restore : function (container, storage, id) {
                        storage.maximazed           = false;
                        container.style.position    = storage.size.position !== false ? storage.size.position   : '';
                        container.style.width       = storage.size.width    !== false ? storage.size.width      : '';
                        container.style.height      = storage.size.height   !== false ? storage.size.height     : '';
                        container.style.left        = storage.size.left     !== false ? storage.size.left       : '';
                        container.style.top         = storage.size.top      !== false ? storage.size.top        : '';
                        //Run external events in background
                        setTimeout(
                            function () {
                                flex.events.core.fire(
                                    flex.registry.events.ui.window.maximize.GROUP,
                                    flex.registry.events.ui.window.maximize.RESTORED,
                                    { container: container, id: id }
                                );
                            },
                            10
                        );
                    },
                }
            };
            privates    = {
                init : init
            };
            return {
                init : privates.init
            };
        };
        flex.modules.attach({
            name            : 'ui.window.maximize',
            protofunction   : protofunction,
            reference       : function () {
                flex.libraries.events   ();
                flex.libraries.html     ();
            }
        });
    }
}());