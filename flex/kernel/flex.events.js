// LICENSE
// This file (core / module) is released under the BSD License. See [LICENSE] file for details.
/*global flex*/
/// <reference path="flex.registry.modules.js" />
/// <reference path="flex.core.js" />
/// <module>
///     <summary>
///         Basic events controller.
///     </summary>
/// </module>
(function () {
    "use strict";
    if (typeof flex !== 'undefined') {
        var protofunction = function () { };
        protofunction.prototype = function () {
            var DOM         = null,
                privates    = null;
            DOM = function () {
                var protofunction       = function () {};
                protofunction.prototype = (function () {
                    var tools       = null,
                        storage     = null,
                        settings    = {
                            STORAGE_NAME                : 'FlexEventsStorage',
                            HANDLE_EVENT_ID_PROPERTY    : 'FlexEventIDProrerty'
                        },
                        Handle      = null,
                        privates    = null;
                    //Handle class
                    Handle              = function (id, handle, once) {
                        this.id             = id;
                        this.handle         = handle;
                        this.once           = once;
                        this.remove         = false;
                        this.interaction    = null;
                        this.working        = false;
                    };
                    Handle.prototype    = {
                        id          : null,
                        once        : null,
                        remove      : null,
                        handle      : null,
                        interaction : null,
                        working     : null,
                        launch      : function (context, event) {
                            if (this.remove === false) {
                                try {
                                    this.working    = true;
                                    this.remove     = this.once;
                                    return this.handle.call(context, event);
                                } catch (e) {
                                    this.error(event, e);
                                    return null;
                                } finally {
                                    this.working    = false;
                                }
                            }
                            return null;
                        },
                        isWorking   : function(){
                            return this.working;
                        },
                        isRemoving  : function(){
                            return this.remove;
                        },
                        toRemove    : function(){
                            this.remove = true;
                        },
                        error       : function (event, e) {
                            flex.logs.log(
                                "event: " + event.type + "; ID: " + this.id + "; generated error: \r\n" + flex.logs.parseError(e),
                                flex.logs.types.WARNING
                            );
                        }
                    };
                    //Methods
                    function add(parameters) {
                        /// <summary>
                        /// Attach to element event handle
                        /// </summary>
                        /// <param name="parameters" type="Object">Events parameters:               &#13;&#10;
                        /// {   [node]      element,                                                &#13;&#10;
                        ///     [string]    name,                                                   &#13;&#10;
                        ///     [function]  handle,                                                 &#13;&#10;
                        ///     [string]    id     (optional),                                      &#13;&#10;
                        ///     [boolean]   once   (optional) -> true - remove after handle will be once used}</param>
                        /// <returns type="boolean">true if success and false if fail</returns>
                        function validate(parameters) {
                            parameters.element  = typeof parameters.element !== 'undefined' ? parameters.element    : null;
                            parameters.name     = typeof parameters.name    === 'string'    ? parameters.name       : null;
                            parameters.handle   = typeof parameters.handle  === 'function'  ? parameters.handle     : null;
                            parameters.id       = typeof parameters.id      === 'string'    ? parameters.id         : flex.unique();
                            parameters.once     = typeof parameters.once    === 'boolean'   ? parameters.once       : false;
                            return parameters;
                        };
                        var parameters  = validate(parameters),
                            handles     = null;
                        if (parameters.element !== null && parameters.handle !== null && parameters.name !== null) {
                            handles = storage.get(parameters.element, false);
                            if (handles !== null) {
                                handles = tools.buildCommonHandle(parameters.element, parameters.name, handles);
                                if (handles instanceof Array) {
                                    handles.push(
                                        new Handle(parameters.id, parameters.handle, parameters.once)
                                    );
                                    return parameters.id;
                                }
                            }
                        }
                        return null;
                    };
                    function fire(element, event, element_id) {
                        /// <summary>
                        /// Common handle of events
                        /// </summary>
                        /// <param name="element" type="node"       >Element        </param>
                        /// <param name="event" type="string"       >Event name     </param>
                        /// <param name="element_id" type="string"  >ID of event    </param>
                        /// <returns type="boolean">true if success and false if fail</returns>
                        var event               = typeof event !== 'undefined' ? event : tools.fixEvent(),
                            handles_storage     = storage.get(this, true),
                            handles             = null,
                            interaction         = flex.unique(),
                            isPrevent           = null,
                            self                = this,
                            needRemoveChecking  = false;
                        if (event && element && element_id && handles_storage !== null) {
                            event = tools.unificationEvent(event);
                            if (handles_storage[event.type]) {
                                handles_storage = handles_storage[event.type];
                                if (handles_storage.element_id === element_id) {
                                    handles = handles_storage.handles;
                                    try {
                                        Array.prototype.forEach.call(
                                            handles,
                                            function (handle) {
                                                if (handle.interaction !== interaction) {
                                                    handle.interaction = interaction;
                                                    isPrevent = handle.handle.call(self, event);
                                                    needRemoveChecking = needRemoveChecking === true ? true : (handle.isRemoving() === false ? false : true);
                                                    if (isPrevent === false) {//It's correct. Here false means prevent other handles
                                                        event.flex.stop();
                                                        flex.logs.log(
                                                            'Break event in DOM.fire; \n\r ' +
                                                            '>event: ' + event.type + '\n\r ' +
                                                            '>handle_id' + handle.id + '\n\r ' +
                                                            '>element_id' + element_id,
                                                            flex.logs.types.WARNING
                                                        );
                                                        throw 'prevent';
                                                    }
                                                } else {
                                                    flex.logs.log(
                                                        'Unexpected behavior of handle event in DOM.fire. Attempt to call handle twice. \n\r ' +
                                                        '>event: ' + event.type + '\n\r ' +
                                                        '>handle_id' + handle.id + '\n\r ' +
                                                        '>element_id' + element_id,
                                                        flex.logs.types.LOGICAL
                                                    );
                                                }
                                            }
                                        );
                                    } catch (e) {
                                        if (e !== 'prevent') {
                                            flex.logs.log(
                                                'Unexpected error in DOM.fire; \n\r ' +
                                                '>event: ' + event.type + '\n\r ' +
                                                '>element_id' + element_id,
                                                flex.logs.types.CRITICAL
                                            );
                                        }
                                    } finally {
                                        if (needRemoveChecking !== false) {
                                            //Remove all handles, which should be removed
                                            handles_storage.handles = handles.filter(
                                                function (handle) {
                                                    if (handle.isWorking() === false && handle.isRemoving() !== false) {
                                                        return false;
                                                    } else {
                                                        return true;
                                                    }
                                                }
                                            );
                                        }
                                        return true;
                                    }
                                }
                            }
                        }
                        return false;
                    };
                    function remove(parameters) {
                        /// <summary>
                        /// Attach to element event handle
                        /// </summary>
                        /// <param name="parameters" type="Object">Events parameters:               &#13;&#10;
                        /// {   [node]      element,                                                &#13;&#10;
                        ///     [string]    name,                                                   &#13;&#10;
                        ///     [function]  handle,                                                 &#13;&#10;
                        ///     [string]    id     (optional) }</param>
                        /// <returns type="boolean">true if success and false if fail</returns>
                        function getIDByHandle(handle) {
                            if (typeof handle[settings.HANDLE_EVENT_ID_PROPERTY] !== 'undefined') {
                                return handle[settings.HANDLE_EVENT_ID_PROPERTY];
                            }
                            return null;
                        };
                        function validate(parameters) {
                            parameters.element  = typeof parameters.element !== 'undefined' ? parameters.element    : null;
                            parameters.name     = typeof parameters.name    === 'string'    ? parameters.name       : null;
                            parameters.handle   = typeof parameters.handle  === 'function'  ? parameters.handle     : null;
                            parameters.id       = typeof parameters.id      === 'string'    ? parameters.id         : getIDByHandle(parameters.handle);
                            return parameters;
                        };
                        var parameters      = validate(parameters),
                            handles_storage = null,
                            handles         = null;
                        if (parameters.element !== null && parameters.name !== null) {
                            if (parameters.id === null && parameters.handle !== null) {
                                if (typeof parameters.handle[settings.HANDLE_EVENT_ID_PROPERTY] !== 'undefined') {
                                    parameters.id = parameters.handle[settings.HANDLE_EVENT_ID_PROPERTY];
                                }
                            }
                            if (parameters.id !== null) {
                                handles_storage = storage.get(parameters.element, true);
                                if (typeof handles_storage[parameters.name] === 'object') {
                                    handles_storage = handles_storage[parameters.name];
                                    handles         = handles_storage.handles;
                                    try {
                                        Array.prototype.forEach.call(
                                            handles,
                                            function (handle) {
                                                if (handle.id === parameters.id) {
                                                    handle.toRemove();
                                                    throw 'handle found';
                                                }
                                            }
                                        );
                                    } catch (e) {
                                        if (e !== 'handle found') {
                                            flex.logs.log(
                                                'Unexpected error in DOM.remove; \n\r ' +
                                                '>event: ' + parameters.name + '\n\r ' +
                                                '>event_id' + parameters.id,
                                                flex.logs.types.CRITICAL
                                            );
                                        }
                                    } finally {
                                        handles = handles.filter(
                                            function (handle) {
                                                if (handle.isWorking() === false && handle.isRemoving() !== false) {
                                                    return false;
                                                } else {
                                                    return true;
                                                }
                                            }
                                        );
                                        if (handles.length === 0) {
                                            tools.destroyCommonHandle(parameters.element, parameters.name);
                                            storage.clear(parameters.element);
                                        }
                                    }
                                }
                            }
                        }
                    };
                    function call(element, name) {
                        /// <summary>
                        /// Emulate (call) event on some node
                        /// </summary>
                        /// <param name="element" type="Object" >Node           </param>
                        /// <param name="name" type="string"    >Type of event  </param>
                        /// <returns type="Object">returns node in success or throw new syntax error in fail</returns>
                        function extend(destination, source) {
                            for (var property in source)
                                destination[property] = source[property];
                            return destination;
                        }
                        var oEvent          = null,
                            eventType       = null,
                            evt             = null,
                            eventMatchers   = {
                                'HTMLEvents'    : /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
                                'MouseEvents'   : /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
                            },
                            defaultOptions  = {
                                type            : name,
                                canBubble       : true,
                                cancelable      : true,
                                view            : element.ownerDocument.defaultView,
                                detail          : 1,
                                screenX         : 0,
                                screenY         : 0,
                                clientX         : 0,
                                clientY         : 0,
                                pointerX        : 0,
                                pointerY        : 0,
                                ctrlKey         : false,
                                altKey          : false,
                                shiftKey        : false,
                                metaKey         : false,
                                button          : 0,
                                relatedTarget   : null
                            },
                            options = extend(defaultOptions, arguments[2] || {});
                        for (var name in eventMatchers) {
                            if (eventMatchers[name].test(name)) { eventType = name; break; }
                        }
                        if (!eventType) {
                            throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');
                        }
                        if (document.createEvent) {
                            oEvent = document.createEvent(eventType);
                            if (eventType == 'HTMLEvents') {
                                oEvent.initEvent(name, options.bubbles, options.cancelable);
                            } else {
                                oEvent.initMouseEvent(
                                    options.type,       options.canBubble,  options.cancelable, options.view,
                                    options.detail,     options.screenX,    options.screenY,    options.clientX,
                                    options.clientY,    options.ctrlKey,    options.altKey,     options.shiftKey,
                                    options.metaKey,    options.button,     options.relatedTarget
                                );
                            }
                            element.dispatchEvent(oEvent);
                        } else {
                            options.clientX = options.pointerX;
                            options.clientY = options.pointerY;
                            evt             = document.createEventObject();
                            oEvent          = extend(evt, options);
                            element.fireEvent('on' + name, oEvent);
                        }
                        return element;
                    };
                    storage = {
                        get     : function (element, only_get) {
                            /// <summary>
                            /// Get virtual storage from element
                            /// </summary>
                            /// <param name="element"   type="node"     >Element</param>
                            /// <param name="only_get"  type="boolean"  >false - create, if doesn't exist; true - only get</param>
                            /// <returns type="object">virtual storage</returns>
                            var only_get = (typeof only_get === "boolean" ? only_get : true),
                                storage     = null;
                            if (element) {
                                storage = flex.overhead.objecty.get(element, settings.STORAGE_NAME);
                                if (storage === null && only_get === false) {
                                    storage = flex.overhead.objecty.set(element, settings.STORAGE_NAME, {});
                                }
                                return storage;
                            }
                            return null;
                        },
                        clear   : function (element) {
                                /// <summary>
                                /// Try to clear virtual storage from element (only if storage is empty)
                                /// </summary>
                                /// <param name="element"   type="node"     >Element</param>
                                /// <returns type="object">true - if removed; false - if not.</returns>
                            var handles = storage.get(element, true);
                            if (handles !== null) {
                                if (Object.keys(handles).length === 0) {
                                    flex.overhead.objecty.del(element, settings.STORAGE_NAME);
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                            return false;
                        }
                    };
                    tools = {
                        buildCommonHandle   : function (element, type, storage) {
                            /// <summary>
                            /// Build common handle for element for defined event
                            /// </summary>
                            /// <param name="element"   type="node"     >Element</param>
                            /// <param name="type"      type="string"   >Event name</param>
                            /// <param name="storage"   type="object"   >Virtual storage of element</param>
                            /// <returns type="object">collection of handles</returns>
                            var element_id = flex.unique();
                            if (typeof storage[type] !== "object") {
                                storage[type] = {
                                    globalHandle    : function (event) {
                                        return fire.call(element, element, event, element_id);
                                    },
                                    element_id      : element_id,
                                    handles         : []
                                };
                                if (flex.events.DOM.add(element, type, storage[type].globalHandle) === false) {
                                    return null;
                                }
                                return storage[type].handles;
                            }
                            return null;
                        },
                        destroyCommonHandle : function (element, type) {
                            /// <summary>
                            /// Destroy common handle for element for defined event
                            /// </summary>
                            /// <param name="element"   type="node"     >Element</param>
                            /// <param name="type"      type="string"   >Event name</param>
                            /// <returns type="object">true - if removed; false - if not.</returns>
                            var handles_storage = null;
                            if (element && type) {
                                handles_storage = storage.get(element, true);
                                if (typeof handles_storage[type] === 'object') {
                                    flex.events.DOM.remove(element, type, handles_storage[type].globalHandle);
                                    handles_storage[type] = null;
                                    delete handles_storage[type];
                                    return true;
                                }
                            }
                            return null;
                        },
                        fixEvent            : function() {
                            /// <summary>
                            /// Fix IE bug with event object
                            /// </summary>
                            /// <returns type="void">void</returns>
                            if (!event) {
                                if (window.event) {
                                    return window.event;
                                }
                            }
                            return null;
                        },
                        unificationEvent    : function (event) {
                            /// <summary>
                            /// Unification of event object
                            /// </summary>
                            /// <param name="event" type="event">Event object</param>
                            /// <returns type="event">Event object</returns>
                            function addContainer(event) {
                                event.flex = {};
                                return event;
                            };
                            function unificationStop(event) {
                                if (typeof event.preventDefault === 'undefined') {
                                    event.preventDefault = function () { try { this.returnValue = false; } catch (e) { } };
                                }
                                if (typeof event.stopPropagation === 'undefined') {
                                    event.stopPropagation = function () { try { this.cancelBubble = true; } catch (e) { } };
                                }
                                event.flex.stop = function () {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    return false;
                                };
                                return event;
                            };
                            function unificationTarget(event) {
                                if (typeof event.target === 'undefined') {
                                    if (typeof event.srcElement !== 'undefined') {
                                        event.target = event.srcElement;
                                    } else {
                                        event.target = null;
                                    }
                                }
                                if (event.target !== null) {
                                    if (typeof event.relatedTarget === 'undefined') {
                                        if (typeof event.fromElement !== 'undefined') {
                                            if (event.fromElement === event.target) {
                                                event.relatedTarget = event.toElement;
                                            } else {
                                                event.relatedTarget = event.fromElement;
                                            }
                                        } else {
                                            event.relatedTarget = null;
                                            event.fromElement   = null;
                                        }
                                    }
                                }
                                event.flex.target = event.target;
                                return event;
                            };
                            function unificationCoordinate(event) {
                                if (typeof event.clientX !== 'undefined') {
                                    if (typeof event.pageX === 'undefined') {
                                        event.flex.pageX = null;
                                        event.flex.pageY = null;
                                    }
                                    if (event.pageX === null && event.clientX !== null) {
                                        var DocumentLink    = document.documentElement,
                                            BodyLink        = document.body;
                                        event.flex.pageX = event.clientX + (DocumentLink && DocumentLink.scrollLeft || BodyLink && BodyLink.scrollLeft || 0) - (DocumentLink.clientLeft || 0);
                                        event.flex.pageY = event.clientY + (DocumentLink && DocumentLink.scrollTop || BodyLink && BodyLink.scrollTop || 0) - (DocumentLink.clientTop || 0);
                                    } else {
                                        event.flex.pageX = event.pageX;
                                        event.flex.pageY = event.pageY;
                                    }
                                } else {
                                    event.flex.pageX = null;
                                    event.flex.pageY = null;
                                }
                                event.flex.clientX = (typeof event.clientX !== 'undefined' ? event.clientX : null);
                                event.flex.clientY = (typeof event.clientY !== 'undefined' ? event.clientY : null);
                                event.flex.offsetX = (typeof event.offsetX !== 'undefined' ? event.offsetX : (typeof event.layerX !== 'undefined' ? event.layerX : null));
                                event.flex.offsetY = (typeof event.offsetY !== 'undefined' ? event.offsetY : (typeof event.layerY !== 'undefined' ? event.layerY : null));
                                return event;
                            };
                            function unificationButtons(event) {
                                if (typeof event.which === 'undefined' && typeof event.button !== 'undefined') {
                                    event.flex.which    = (event.button & 1 ? 1 : (event.button & 2 ? 3 : (event.button & 4 ? 2 : 0)));
                                    event.flex.button   = event.button;
                                }
                                return event;
                            };
                            if (typeof event.flex === 'undefined') {
                                event = addContainer            (event);
                                event = unificationStop         (event);
                                event = unificationTarget       (event);
                                event = unificationCoordinate   (event);
                                event = unificationButtons      (event);
                            }
                            return event;
                        }
                    };
                    privates = {
                        _add    : add,
                        _remove : remove,
                        add     : function (element, type, handle, id) {
                            return add({
                                element : element,
                                name    : type,
                                handle  : handle,
                                id      : id,
                            });
                        },
                        remove  : function (element, type, handle, id) {
                            return remove({
                                element : element,
                                name    : type,
                                handle  : handle,
                                id      : id,
                            });
                        },
                        unify   : tools.unificationEvent
                    };
                    return {
                        add     : privates.add,
                        remove  : privates.remove,
                        unify   : privates.unify
                    };
                }());
                return new protofunction();
            };
            privates = {
                ClassDOMEvents: DOM,
            };
            return {
                ClassDOMEvents: privates.ClassDOMEvents
            };
        };
        flex.modules.attach({
            name            : 'events',
            protofunction   : protofunction,
        });
    }
}());