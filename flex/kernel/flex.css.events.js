// LICENSE
// This file (core / module) is released under the BSD License. See [LICENSE] file for details.
/*global flex*/
/// <reference path='intellisense/flex.libraries.intellisense.js' />
/// <reference path="flex.core.js" />
/// <module>
///     <summary>
///         Controller of CSS events.
///     </summary>
/// </module>
(function () {
    "use strict";
    if (typeof flex !== 'undefined') {
        var protofunction       = function () { };
        protofunction.prototype = function () {
            var //Get modules
                html        = flex.libraries.html.create(),
                events      = flex.libraries.events.create(),
                //Variables
                animation   = null,
                transition  = null,
                privates    = null;
            animation = {
                //Names of events via browsers
                eventData: [    { platform: 'W3C',      prefix: '',         events: { start: 'animationstart',          iteration: 'animationiteration',        end: 'animationend'         } },
                                { platform: 'firefox',  prefix: 'Moz',      events: { start: 'animationstart',          iteration: 'animationiteration',        end: 'animationend'         } },
                                { platform: 'webkit',   prefix: 'Webkit',   events: { start: 'webkitAnimationStart',    iteration: 'webkitAnimationIteration',  end: 'webkitAnimationEnd'   } },
                                { platform: 'opera',    prefix: 'O',        events: { start: 'oanimationstart',         iteration: 'oanimationiteration',       end: 'oanimationend'        } },
                                { platform: 'IE10',     prefix: 'ms',       events: { start: 'MSAnimationStart',        iteration: 'MSAnimationIteration',      end: 'MSAnimationEnd'       } }],
                init        : function () {
                    var tempDOMElement  = document.createElement('DIV'),
                        resultPrefix    = '',
                        animationString = 'animation',
                        events          = null,
                        propertyName    = 'AnimationName',
                        platform        = '';
                    if (typeof tempDOMElement.style.animationName === 'undefined') {
                        try {
                            animation.eventData.forEach(function (element, index) {
                                if (typeof tempDOMElement.style[animation.eventData[index].prefix               + propertyName] !== 'undefined' ||
                                    typeof tempDOMElement.style[animation.eventData[index].prefix.toLowerCase() + propertyName] !== 'undefined') {
                                    resultPrefix    = animation.eventData[index].prefix.toLowerCase();
                                    animationString = resultPrefix + 'Animation';
                                    events          = animation.eventData[index].events;
                                    platform        = animation.eventData[index].platform;
                                    throw 'found';
                                }
                            });
                        } catch (e) {
                            if (e === 'found') {
                                animation.eventData = {
                                    animationString : animationString,
                                    prefix          : resultPrefix,
                                    events          : events,
                                    platform        : platform
                                };
                            }
                        }
                    } else {
                        animation.eventData = {
                            animationString : animation.eventData[0].prefix.toLowerCase() + 'Animation',
                            prefix          : animation.eventData[0].prefix.toLowerCase(),
                            events          : animation.eventData[0].events,
                            platform        : animation.eventData[0].platform
                        };
                    }
                    tempDOMElement = null;
                },
                attach      : function (element, event, handle, once, clear) {
                    var element     = (typeof element   !== 'undefined' ? html.helpers.validateNode(element) : null),
                        handle      = (typeof handle    === 'function'  ? handle    : null          ),
                        event       = (typeof event     === 'string'    ? event     : null          ),
                        once        = (typeof once      === 'boolean'   ? once      : false         ),
                        clear       = (typeof clear     === 'boolean'   ? clear     : false         ),
                        id          = (typeof id        !== 'undefined' ? id        : flex.unique() ),
                        DOMEvents   = events.DOMEvents();
                    if (flex.oop.objects.isValueIn([element, handle, event], null) === false) {
                        if (typeof animation.eventData.events[event] !== 'undefined') {
                            if (clear !== false) {
                                DOMEvents.clear(element, animation.eventData.events[event], true);
                            }
                            DOMEvents.extendedAdd({
                                element : element,
                                name    : animation.eventData.events[event],
                                handle  : function (_event) {
                                    return animation.processing(_event, element, event, id, handle);
                                },
                                id      : id,
                                once    : once
                            });
                            return id;
                        } else {
                            flex.logs.log("Event's type (" + event + ") is unknown. Available types: " + Object.keys(animation.eventData.events), flex.logs.types.WARNING);
                        }
                    }
                    return false;
                },
                remove      : function (element, event, id) {
                    var element     = (typeof element !== 'undefined' ? html.helpers.validateNode(element) : null),
                        event       = (typeof event === 'string' ? event    : null),
                        id          = (typeof id    === 'string' ? id       : null),
                        DOMEvents   = events.DOMEvents();
                    if (flex.oop.objects.isValueIn([element, event, id], null) === false) {
                        if (typeof animation.eventData.events[event] !== 'undefined') {
                            DOMEvents.extendedRemove({
                                element : element,
                                name    : animation.eventData.events[event],
                                id      : id
                            });
                            return true;
                        } else {
                            flex.logs.log("Events's type (" + event + ") is unknown. Available types: " + Object.keys(animation.eventData.events), flex.logs.types.WARNING);
                        }
                    }
                    return false;
                },
                processing  : function (_event, element, event, id, handle) {
                    var element = (typeof element !== 'undefined'   ? html.helpers.validateNode(element) : null),
                        event   = (typeof event     === 'string'    ? event     : null),
                        id      = (typeof id        === 'string'    ? id        : null),
                        handle  = (typeof handle    === 'function'  ? handle    : null);
                    if (flex.oop.objects.isValueIn([element, event, id, handle], null) === false) {
                        flex.system.handle(handle, _event, 'flex.css.events.animation.processing', element);
                    }
                },
                interfaces  : {
                    attach: {
                        start       : function (element, handle, once, clear) {
                            return animation.attach(element, 'start', handle, once, clear);
                        },
                        iteration   : function (element, handle, once, clear) {
                            return animation.attach(element, 'iteration', handle, once, clear);
                        },
                        end         : function (element, handle, once, clear) {
                            return animation.attach(element, 'end', handle, once, clear);
                        }
                    },
                    remove: {
                        start       : function (element) {
                            return animation.remove(element, 'start');
                        },
                        iteration   : function (element) {
                            return animation.remove(element, 'iteration');
                        },
                        end         : function (element) {
                            return animation.remove(element, 'end', id);
                        },
                    }
                }
            };
            transition = {
                eventData   : [ { platform: "W3C",      prefix: "",         events: { end: "transitionend"          } },
                                { platform: "firefox",  prefix: "Moz",      events: { end: "transitionend"          } },
                                { platform: "webkit",   prefix: "Webkit",   events: { end: "webkitTransitionEnd"    } },
                                { platform: "opera",    prefix: "O",        events: { end: "oTransitionEnd "        } },
                                { platform: "IE10",     prefix: "ms",       events: { end: "transitionend"          } }],
                init        : function () {
                    if (typeof animation.eventData.prefix === "string") {
                        try {
                            transition.eventData.forEach(function (element, index) {
                                if (transition.eventData[index].prefix.toLowerCase() === animation.eventData.prefix.toLowerCase()) {
                                    transition.eventData = {
                                        prefix  : transition.eventData[index].prefix,
                                        events  : transition.eventData[index].events,
                                        platform: transition.eventData[index].platform
                                    };
                                    throw 'found';
                                }
                            });
                        } catch (e) {
                            if (e === 'found') {
                                return true;
                            }
                        }
                    }
                    transition.eventData = null;
                    flex.logs.log("Transition's events aren't available on this browser", flex.logs.types.WARNING);
                },
                attach: function (element, event, handle, once) {
                    var element     = (typeof element   !== 'undefined' ? html.helpers.validateNode(element) : null),
                        handle      = (typeof handle    === "function"  ? handle    : null),
                        event       = (typeof event     === "string"    ? event     : null),
                        once        = (typeof once      === "boolean"   ? once      : false),
                        id          = flex.unique(),
                        DOMEvents   = events.DOMEvents();
                    if (flex.oop.objects.isValueIn([element, handle, event], null) === false) {
                        if (transition.eventData !== null) {
                            if (typeof transition.eventData.events[event] !== "undefined") {
                                DOMEvents.extendedAdd({
                                    element : element,
                                    name    : transition.eventData.events[event],
                                    handle  : function (_event) {
                                        return transition.processing(_event, element, event, id, handle);
                                    },
                                    id      : id,
                                    once    : once
                                });
                                return id;
                            } else {
                                flex.logs.log("Events's type (" + event + ") is unknown. Available types: " + Object.keys(transition.eventData.events), flex.logs.types.WARNING);
                            }
                        } else {
                            flex.logs.log("Transition's events aren't available on this browser", flex.logs.types.WARNING);
                        }
                    }
                    return false;
                },
                remove: function (element, event, id) {
                    var element     = (typeof element !== 'undefined' ? html.helpers.validateNode(element) : null),
                        event       = (typeof event === "string"    ? event     : null),
                        id          = (typeof id    === "string"    ? id        : null),
                        DOMEvents   = events.DOMEvents();
                    if (flex.oop.objects.isValueIn([element, event, id], null) === false) {
                        if (transition.eventData !== null) {
                            if (typeof transition.eventData["events"][event] !== "undefined") {
                                DOMEvents.extendedRemove({
                                    element : element,
                                    name    : transition.eventData.events[event],
                                    id      : id
                                });
                                return true;
                            } else {
                                flex.logs.log("Events's type (" + event + ") is unknown. Available types: " + Object.keys(transition.eventData.events), flex.logs.types.WARNING);
                            }
                        } else {
                            flex.logs.log("Transition's events aren't available on this browser", flex.logs.types.WARNING);
                        }
                    }
                    return false;
                },
                processing: function (_event, element, event, id, handle) {
                    var element     = (typeof element   !== 'undefined' ? html.helpers.validateNode(element) : null),
                        event       = (typeof event     === "string"    ? event     : null),
                        id          = (typeof id        === "string"    ? id        : null),
                        handle      = (typeof handle    === "function"  ? handle    : null);
                    if (flex.oop.objects.isValueIn([element, event, id, handle], null) === false) {
                        flex.system.handle(handle, _event, 'flex.css.events.transition.processing', element);
                    }
                },
                interfaces  : {
                    attach: {
                        end: function (element, handle, once) {
                            return transition.attach(element, "end", handle, once);
                        }
                    },
                    remove: {
                        end: function (element) {
                            return transition.remove(element, "end", id);
                        }
                    }
                }
            };
            privates = {
                animations  : animation.interfaces,
                transition  : transition.interfaces
            };
            animation.  init();
            transition. init();
            return {
                animations  : privates.animations,
                transition  : privates.transition
            };
        };
        flex.modules.attach({
            name            : 'css.events',
            protofunction   : protofunction,
            reference       : function () {
                flex.libraries.events();
                flex.libraries.html();
            },
        });
    }
}());