// LICENSE
// This file (core / module) is released under the BSD License. See [LICENSE] file for details.
/*global flex*/
/// <reference path="flex.registry.modules.js" />
/// <reference path="flex.core.js" />
/// <module>
///     <summary>
///         Module control movement of some node on screen. Works only with position: absolute.
///     </summary>
/// </module>
(function () {
    "use strict";
    if (typeof flex !== 'undefined') {
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
                render          = null,
                settings        = null;
            settings = {
                CONTAINER           : 'data-flex-ui-window-move-container',
                HOOK                : 'data-flex-ui-window-move-hook',
                INITED              : 'data-flex-window-move-inited',
                GLOBAL_GROUP        : 'flex-window-move',
                GLOBAL_EVENT_FLAG   : 'flex-window-move-global-event',
                GLOBAL_CURRENT      : 'flex-window-move-global-current',
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
                                    render.attach(container, hooks, id);
                                }
                            }
                            container.setAttribute(settings.INITED, true);
                        }
                    );
                }
            };
            render      = {
                attach  : function (container, hooks, id) {
                    var DOMEvents = events.ClassDOMEvents();
                    Array.prototype.forEach.call(
                        hooks,
                        function (hook) {
                            DOMEvents.add(
                                hook,
                                'mousedown',
                                function (event) {
                                    render.start(event, container, hook, id);
                                },
                                id
                            );
                        }
                    );
                },
                start   : function (event, container, hook, id) {
                    function getPosition(node) {
                        if (node.currentStyle) {
                            if (node.currentStyle.position) {
                                return node.currentStyle.position;
                            }
                        }
                        if (window.getComputedStyle) {
                            return window.getComputedStyle(node).position;
                        }
                        return null;
                    }
                    var possition   = html.position(),
                        scroll      = html.scroll(),
                        pos         = possition.byPage(container),
                        scrl        = scroll.get(container.parentNode),
                        isFixed     = getPosition(container) !== 'fixed' ? false : true;
                    flex.overhead.globaly.set(
                        settings.GLOBAL_GROUP,
                        settings.GLOBAL_CURRENT,
                        {
                            clientX     : event.flex.clientX,
                            clientY     : event.flex.clientY,
                            offsetX     : event.flex.offsetX,
                            offsetY     : event.flex.offsetY,
                            pageX       : event.flex.pageX,
                            pageY       : event.flex.pageY,
                            hook        : hook,
                            container   : container,
                            id          : id,
                            oldX        : event.flex.pageX,
                            oldY        : event.flex.pageY,
                            posX        : pos.left + (isFixed === false ? scrl.left() : 0),
                            posY        : pos.top + (isFixed === false ? scrl.top() : 0),
                        }
                    );
                    return event.flex.stop();
                },
                move    : function(event){
                    var instance    = flex.overhead.globaly.get(settings.GLOBAL_GROUP, settings.GLOBAL_CURRENT),
                        container   = null;
                    if (instance !== null) {
                        container               = instance.container;
                        instance.posX           = (instance.posX - (instance.oldX - event.flex.pageX));
                        instance.posY           = (instance.posY - (instance.oldY - event.flex.pageY));
                        container.style.left    = instance.posX + 'px';
                        container.style.top     = instance.posY + 'px';
                        instance.oldX           = event.flex.pageX;
                        instance.oldY           = event.flex.pageY;
                    }
                    return event.flex.stop();
                },
                stop    : function(event) {
                    flex.overhead.globaly.del(settings.GLOBAL_GROUP, settings.GLOBAL_CURRENT);
                },
                global: {
                    attach: function () {
                        var isAttached  = flex.overhead.globaly.get(settings.GLOBAL_GROUP, settings.GLOBAL_EVENT_FLAG),
                            DOMEvents   = events.ClassDOMEvents();
                        if (isAttached !== true) {
                            flex.overhead.globaly.set(settings.GLOBAL_GROUP, settings.GLOBAL_EVENT_FLAG, true);
                            flex.events.DOM.add(
                                window,
                                'mousemove',
                                function (event) {
                                    render.move(DOMEvents.unify(event));
                                }
                            );
                            flex.events.DOM.add(
                                window,
                                'mouseup',
                                function (event) {
                                    render.stop(DOMEvents.unify(event));
                                }
                            );
                        }
                    }
                }
            };
            privates    = {
                init : init
            };
            render.global.attach();
            return {
                init : privates.init
            };
        };
        flex.modules.attach({
            name            : 'ui.window.move',
            protofunction   : protofunction,
            reference       : function () {
                flex.libraries.events   ();
                flex.libraries.html     ();
            }
        });
    }
}());