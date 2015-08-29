// LICENSE
// This file (core / module) is released under the BSD License. See [LICENSE] file for details.
/// <reference path="flex.registry.modules.js" />
/// <reference path="flex.registry.events.js" />
/// <reference path="flex.events.js" />
/// <module>
///     <summary>
///         Basic module of [flex].
///     </summary>
/// </module>
(function () {
    "use strict";
    //Prevent double initialization
    if (typeof flex === 'undefined') {
        //Create class
        var Flex = function () { };
        //Define class
        Flex.prototype = (function () {
            var information = {
                    name    : "Flex::: web tools",
                    version : "0.08",
                    author  : "Dmitry Astafyev",
                },
                config      = {},
                options     = {},
                registry    = {},
                ajax        = {},
                events      = {},
                oop         = {},
                privates    = {},
                modules     = {},
                overhead    = {},
                parsing     = {},
                system      = {},
                IDs         = {},
                logs        = {};
            config = {
                defaults : {
                    resources   :{
                        USE_STORAGED    : { type: 'boolean',    value: true         },
                        MODULES         : { type: 'array',      value: []           }
                    },
                    paths       : {
                        CORE            : { type: 'string',     value: '/kernel'    }
                    },
                    events      : {
                        finish          : { type: 'function',   value: null         }
                    }
                },
                init    : function (settings) {
                    function validate(section, settings, path) {
                        function getType(property) {
                            if (property instanceof Array) {
                                return 'array';
                            } else {
                                return typeof property;
                            }
                        };
                        var path    = path || '',
                            setting = null;
                        if (typeof section.content === 'object') {
                            if (typeof section.content.type !== 'undefined' && typeof section.content.value !== 'undefined') {
                                setting = oop.namespace.get(path, settings);
                                if (getType(setting) === section.content.type) {
                                    section.parent[section.name] = setting;
                                } else {
                                    section.parent[section.name] = section.content.value;
                                }
                            } else {
                                for (var property in section.content) {
                                    validate(
                                        {
                                            content : section.content[property],
                                            parent  : section.content,
                                            name    : property
                                        },
                                        settings,
                                        path + (path === '' ? '' : '.') + property
                                    );
                                }
                            }
                        }
                    };
                    var backup      = overhead.globaly.get(options.storage.GROUP, options.storage.DEFAULT_CONFIG),
                        inited      = overhead.globaly.get(options.storage.GROUP, options.storage.DEFAULT_CONFIG_FLAG);
                    if (inited === null) {
                        if (backup === null) {
                            overhead.globaly.set(options.storage.GROUP, options.storage.DEFAULT_CONFIG, oop.objects.copy(config.defaults))
                        } else {
                            config.defaults = oop.objects.copy(backup);
                        }
                        if (settings) {
                            inited = overhead.globaly.set(options.storage.GROUP, options.storage.DEFAULT_CONFIG_FLAG, true);
                        }
                        validate(
                            {
                                content : config.defaults,
                                parent  : null,
                                name    : null
                            },
                            settings || {}
                        );
                        if (inited === true) {
                            modules.preload();
                        }
                    }
                }
            };
            options = {
                storage : {
                    GROUP               : 'flex.core',
                    RESOURCES_JOURNAL   : 'flex.modules.resources.journal',
                    MODULES_HISTROY     : 'flex.modules.history',
                    DEFAULT_CONFIG      : 'flex.defualt.config',
                    DEFAULT_CONFIG_FLAG : 'flex.defualt.config.flag',
                },
                regs    : {
                    resources: {
                        CSS : /\.css$/gi,
                        JS  : /\.js$/gi,
                    }
                },
                registry: {
                    EVENTS  : 'flex.registry.events.js',
                    MODULES : 'flex.registry.modules.js'
                }
            };
            registry = {
                load    : function () {
                    function getURL(item){
                        var path = config.defaults.paths.CORE.replace(/\s*$/gi, '').replace(/^\/|\\$/gi, '');
                        return path + (path === '' ? '' : '/') + item;
                    };
                    for (var item in options.registry) {
                        (function (item) {
                            system.resources.js.connect(
                                getURL(options.registry[item]),
                                function () {
                                    registry.onLoad(item);
                                },
                                function () {
                                    registry.onError(item);
                                }
                            );
                        }(item));
                    }
                },
                onLoad  : function (item) {
                    function isFinish() {
                        var result = true;
                        for (var item in options.registry) {
                            result = (options.registry[item] === true ? result : false);
                        }
                        return result;
                    }
                    options.registry[item] = true;
                    if (isFinish() !== false) {
                        modules.registry.ready();
                        modules.preload();
                    }
                },
                onError : function (item) {
                    logs.log('Fail load [' + options.registry[item] + ']. Flex cannot be used without that resource.', logs.types.CRITICAL);
                },
            };
            ajax = {
                settings    : {
                    DEFAULT_TIMEOUT : 15000, //ms ==> 1000 ms = 1 s
                    DEFAULT_METHOD  : 'post'
                },
                requests    : {
                    storage     : {},
                    add         : function (request) {
                        var storage = ajax.requests.storage;
                        if (typeof storage[request.id] === 'undefined') {
                            storage[request.id] = request;
                            return true;
                        }
                        return false;
                    },
                    remove      : function (request) {
                        var storage = ajax.requests.storage;
                        if (typeof storage[request.id] !== 'undefined') {
                            storage[request.id] = null;
                            delete storage[request.id];
                            return true;
                        }
                        return false;
                    },
                    isConflict  : function (id) {
                        return typeof ajax.requests.storage[id] === 'undefined' ? false : true;
                    }
                },
                create      : function (id, url, method, parameters, callbacks, timeout) {
                    /// <summary>
                    /// Create XMLHttpRequest request. 
                    /// </summary>
                    /// <param name="id"            type="string, number"           >[optional] ID of request</param>
                    /// <param name="url"           type="string"                   >URL</param>
                    /// <param name="method"        type="string" default="post"    >[optional] POST or GET. Default POST</param>
                    /// <param name="parameters"    type="object, string"           >[optional] Object with parameters or string of parameters</param>
                    /// <param name="callbacks"     type="object"                   >[optional] Collection of callbacks [before, success, fail, reaction, timeout]. </param>
                    /// <param name="timeout"       type="number"                   >[optional] Number of ms for timeout</param>
                    /// <returns type="object" mayBeNull="true">Instance of request</returns>
                    var request = null,
                        Request = null;
                    //Parse parameters
                    id          = (typeof id        === 'string' ? id       : (typeof id === 'number' ? id : IDs.id()));
                    id          = (ajax.requests.isConflict(id) === false ? id : IDs.id());
                    url         = (typeof url       === 'string' ? url      : null);
                    method      = (typeof method    === 'string' ? (['post', 'get'].indexOf(method.toLowerCase()) !== -1 ? method.toLowerCase() : ajax.settings.DEFAULT_METHOD) : ajax.settings.DEFAULT_METHOD);
                    timeout     = (typeof timeout   === 'number' ? timeout  : ajax.settings.DEFAULT_TIMEOUT);
                    parameters  = ajax.parse.parameters(parameters);
                    callbacks   = ajax.parse.callbacks(callbacks);
                    if (url !== null) {
                        //Define class for request
                        Request = function (id, url, method, parameters, callbacks, timeout) {
                            this.id         = id;
                            this.url        = url;
                            this.method     = method;
                            this.parameters = parameters;
                            this.callbacks  = callbacks;
                            this.timeout    = timeout;
                        };
                        Request.prototype = {
                            id          : null,
                            method      : null,
                            url         : null,
                            parameters  : null,
                            callbacks   : null,
                            timeout     : null,
                            timerID     : null,
                            response    : null,
                            httpRequest : null,
                            send        : function(){
                                var self = this;
                                try {
                                    //Add request to journal
                                    ajax.requests.add(self);
                                    self.httpRequest = new XMLHttpRequest();
                                    for (var event_name in self.events) {
                                        (function (event_name, self) {
                                            events.DOM.add(
                                                self.httpRequest,
                                                event_name,
                                                function (event) {
                                                    return self.events[event_name](event, self);
                                                }
                                            );
                                        }(event_name, self));
                                    }
                                    if (self.httpRequest !== null) {
                                        self.callback(self.callbacks.before);
                                        switch (self.method) {
                                            case 'post':
                                                self.httpRequest.open(self.method, self.url, true);
                                                self.httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                                                self.httpRequest.send(self.parameters._parameters);
                                                break;
                                            case 'get':
                                                self.httpRequest.open(self.method, self.url + '?' + self.parameters._parameters, true);
                                                self.httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                                                self.httpRequest.send();
                                                break;
                                        }
                                        //Set manual timeout
                                        self.timerID = setTimeout(
                                            function () {
                                                self.events.timeout(null, self);
                                            },
                                            self.timeout
                                        );
                                        return true;
                                    } else {
                                        throw 'Fail create XMLHttpRequest';
                                    }
                                } catch (e) {
                                    self.callback(self.callbacks.fail, e);
                                    self.destroy(self);
                                }
                            },
                            events      : {
                                readystatechange: function (event, self) {
                                    if (ajax.requests.isConflict(self.id) !== false) {
                                        if (event.target) {
                                            if (event.target.readyState) {
                                                self.callback(self.callbacks.reaction, event);
                                                if (event.target.readyState === 4) {
                                                    if (event.target.status === 200) {
                                                        //Success
                                                        self.response = self.parse(event.target.responseText);
                                                        self.destroy(self);
                                                        self.callback(self.callbacks.success, event);
                                                        return true;
                                                    } else {
                                                        //Fail
                                                        self.destroy(self);
                                                        self.callback(self.callbacks.fail, event);
                                                        return false;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                timeout: function (event, self) {
                                    if (ajax.requests.isConflict(self.id) !== false) {
                                        self.callback(self.callbacks.timeout, event);
                                        self.destroy(self);
                                    }
                                }
                            },
                            parse       : function (response){
                                var result = {
                                        original: response,
                                        parsed  : null
                                    };
                                try {
                                    //Try get JSON object
                                    result.parsed = JSON.parse(response);
                                } catch (e) {
                                    //Do nothing
                                } finally {
                                    return result;
                                }
                            },
                            callback    : function (callback, event) {
                                if (callback !== null) {
                                    system.handle(
                                        callback,
                                        [
                                            this.response,
                                            {
                                                id          : this.id,
                                                event       : typeof event !== 'undefined' ? event : null,
                                                response    : this.response,
                                                parameters  : this.parameters,
                                                url         : this.url
                                            }
                                        ],
                                        'ajax.callback:: request ID:: ' + this.id + ' URL:: ' + this.url,
                                        this
                                    );
                                }
                            },
                            destroy     : function (self) {
                                clearTimeout(self.timerID);
                                ajax.requests.remove(self);
                            }
                        };
                        //Create and return request
                        return new Request(id, url, method, parameters, callbacks, timeout);
                    }
                    return null;
                },
                parse  : {
                    parameters  : function (_parameters) {
                        var parameters  = _parameters,
                            params      = {},
                            str_params  = '',
                            excluded    = [];
                        if (typeof parameters === 'string') {
                            parameters = parameters.split('&');
                        }
                        if (parameters instanceof Array) {
                            //If as parameters we have script (after it was convert to array)
                            Array.prototype.forEach.call(
                                parameters,
                                function (parameter, index) {
                                    var property = null;
                                    parameters[index]   = param.replace(/^\s*\?/gi, '');
                                    property            = parameters[index].split('=');
                                    if (property instanceof Array) {
                                        if (property.length === 2) {
                                            params[property[0]] = property[1];
                                        } else {
                                            excluded.push(parameters[index]);
                                        }
                                    } else {
                                        excluded.push(parameters[index]);
                                    }
                                }
                            );
                        } else if (typeof parameters === 'object' && parameters !== null) {
                            //If as parameters we have object
                            for (var key in parameters) {
                                switch(typeof parameters[key]){
                                    case 'string':
                                        params[key] = parameters[key];
                                        break;
                                    case 'boolean':
                                        params[key] = parameters[key].toString();
                                        break;
                                    case 'number':
                                        params[key] = parameters[key].toString();
                                        break;
                                    case 'object':
                                        params[key] = JSON.stringify(parameters[key]);
                                        break;
                                    default:
                                        try{
                                            params[key] = JSON.stringify(parameters[key]);
                                        } catch (e) { }
                                        break;
                                }
                            }
                        }
                        //Make parameters string
                        for (var key in params) {
                            str_params = '&' + key + '=' + params[key];
                        }
                        str_params = str_params.replace(/^\s*\&/gi, '');
                        //Return result
                        return {
                            original    : _parameters,
                            parameters  : params,
                            _parameters : str_params,
                            excluded    : excluded
                        }
                    },
                    callbacks   : function (_callbacks) {
                        var callbacks = {
                            before      : null,
                            success     : null,
                            fail        : null,
                            reaction    : null,
                            timeout     : null
                        };
                        if (typeof _callbacks === 'object') {
                            if (_callbacks !== null) {
                                callbacks.before    = typeof _callbacks.before      === 'function' ? _callbacks.before      : null;
                                callbacks.success   = typeof _callbacks.success     === 'function' ? _callbacks.success     : null;
                                callbacks.fail      = typeof _callbacks.fail        === 'function' ? _callbacks.fail        : null;
                                callbacks.reaction  = typeof _callbacks.reaction    === 'function' ? _callbacks.reaction    : null;
                                callbacks.timeout   = typeof _callbacks.timeout     === 'function' ? _callbacks.timeout     : null;
                            }
                        }
                        return callbacks;
                    }
                }
            };
            oop     = {
                namespace   : {
                    create  : function (namespace, root) {
                        /// <summary>
                        /// Create namespace from root. 
                        /// </summary>
                        /// <param name="namespace" type="String">Namespace, like: root.child.sub</param>
                        /// <param name="root"      type="Object">[optional] Root object. Default - window</param>
                        /// <returns type="Object" value="{ target: root, parent: parent }" mayBeNull="true">Namespace data</returns>
                        var root    = root || window,
                            parent  = null,
                            target  = root,
                            name    = null;
                        if (typeof namespace === 'string') {
                            try{
                                Array.prototype.forEach.call(
                                    namespace.split('.'),
                                    function (part) {
                                        parent  = target;
                                        if (!(part in target)) {
                                            target[part] = {};
                                        }
                                        target  = target[part];
                                        name    = part;
                                    }
                                );
                                return {
                                    target  : target,
                                    parent  : parent,
                                    root    : root,
                                    name    : name
                                };
                            } catch (error) {
                                return null;
                            }
                        }
                        return null;
                    },
                    get     : function (namespace, root) {
                        /// <summary>
                        /// Get last child in namespace. 
                        /// </summary>
                        /// <param name="namespace" type="String">Namespace, like: root.child.sub</param>
                        /// <param name="root"      type="Object">[optional] Root object. Default - window</param>
                        /// <returns type="Object" mayBeNull="true">Last child of namespace</returns>
                        var root    = root || window,
                            target  = root;
                        if (typeof namespace === 'string') {
                            try{
                                Array.prototype.forEach.call(
                                    namespace.split('.'),
                                    function (part) {
                                        if (!(part in target)) {
                                            throw 'Property [' + target  + '] was not found';
                                        }
                                        target = target[part];
                                    }
                                );
                                return target;
                            } catch (error) {
                                return null;
                            }
                        }
                        return null;
                    }
                },
                classes     : {
                    of      : function (object) {
                        /// <summary>
                        /// Returns class's name of object. 
                        /// </summary>
                        /// <param name="object" type="Object">Object</param>
                        /// <returns type="String">Name of class</returns>
                        if (object === null) return null;
                        if (object === undefined) return null;
                        return Object.prototype.toString.call(object).slice(8, -1);
                    }
                },
                objects     : {
                    forEach : function (object, callback) {
                        /// <summary>
                        /// Apply callback function to each enumerable property of object. 
                        /// </summary>
                        /// <param name="object" type="Object">Object</param>
                        /// <param name="function" type="Object">Callback function(property_name, object)</param>
                        /// <returns type="String">Name of class</returns>
                        if (typeof object === 'object') {
                            for (var property in object) {
                                (function (property, object, callback) {
                                    callback(property, object);
                                }(property, object, callback));
                            }
                            if (!('toString' in { toString: null })) {
                                //Hello, IE8 :)
                                Array.prototype.forEach.call(
                                    ['toString', 'valueOf', 'constructor', 'hasOwnPropery', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString'],
                                    function (protoprop) {
                                        if (object.hasOwnProperty(prototype)) {
                                            callback(protoprop, object);
                                        }
                                    }
                                );
                            }
                        }
                    },
                    extend  : function (sources, target, exclusion) {
                        /// <signature>
                        ///     <summary>
                        ///     Copy all properties from source object to target object. And miss exclusion. 
                        ///     </summary>
                        ///     <param name="sources" type="Object">Object</param>
                        ///     <param name="target" type="Object">Object (can be null, in this case new object will be created)</param>
                        ///     <param name="exclusion" type="Array">String array with properties names</param>
                        ///     <returns type="Object">Updated target object</returns>
                        /// </signature>
                        /// <signature>
                        ///     <summary>
                        ///     Copy all properties from source object to target object. 
                        ///     </summary>
                        ///     <param name="sources" type="Object">Object</param>
                        ///     <param name="target" type="Object">Object (can be null, in this case new object will be created)</param>
                        ///     <returns type="Object">New object</returns>
                        /// </signature>
                        /// <signature>
                        ///     <summary>
                        ///     Create new object from all properties from source object. 
                        ///     </summary>
                        ///     <param name="sources" type="Object">Object</param>
                        ///     <returns type="Object">New object</returns>
                        /// </signature>
                        var exclusion = (oop.classes.of(exclusion) === 'Array' ? exclusion : []),
                            target      = (target !== null ? (target !== undefined ? (typeof target === 'object' ? target : {}) : {}) : {}),
                            sources     = (typeof sources === 'object' ? [sources] : (oop.classes.of(sources) === 'Array' ? sources : null));
                        if (sources !== null) {
                            Array.prototype.forEach.call(
                                sources,
                                function (source) {
                                    if (typeof source === 'object') {
                                        for (var property in source) {
                                            if (exclusion.indexOf(property) === -1) {
                                                target[property] = source[property];
                                            }
                                        }
                                    }
                                }
                            );
                        }
                        return target;
                    },
                    copy    : function (source, target) {
                        var target  = target || {},
                            source  = (typeof source === "object" ? source : null),
                            copy    = oop.objects.copy;
                        if (source !== null) {
                            for (var key in source) {
                                if (source.hasOwnProperty(key)) {
                                    if (source[key] instanceof Array) {
                                        target[key] = [];
                                        Array.prototype.forEach.call(
                                            source[key],
                                            function (item) {
                                                if (item instanceof Array === false && typeof item !== 'object' && typeof item !== 'function') {
                                                    target[key].push(item);
                                                } else {
                                                    target[key].push(copy(item));
                                                }
                                            }
                                        );
                                    } else if (typeof source[key] === 'object' && source[key] !== null && typeof source[key] !== 'function') {
                                        target[key] = {};
                                        target[key] = copy(source[key]);
                                    } else {
                                        target[key] = source[key];
                                    }

                                }
                            }
                            return target;
                        }
                        return null;
                    },
                    validate: function (object, properties) {
                        /// <signature>
                        ///     <summary>
                        ///         Validate object
                        ///     </summary>
                        ///     <param name="object"        type="object">Object for validate</param>
                        ///     <param name="properties"    type="object">Parameters of validation:     &#13;&#10;
                        ///     {   [string]            name,                                           &#13;&#10;
                        ///         [string || array]   type,                                           &#13;&#10;
                        ///         [any]               value       (default value),                    &#13;&#10;
                        ///         [any || array]      values      (allowed values)                    &#13;&#10;
                        ///     }</param>
                        ///     <returns type="boolean">true - valid; false - isn't valid</returns>
                        /// </signature>
                        /// <signature>
                        ///     <summary>
                        ///         Validate object
                        ///     </summary>
                        ///     <param name="object"        type="object"   >Object for validate</param>
                        ///     <param name="properties"    type="array"    >Array of parameters of validation</param>
                        ///     <returns type="boolean">true - valid; false - isn't valid</returns>
                        /// </signature>
                        var object          = (typeof object === "object" ? object : null),
                            properties      = properties || null,
                            types           = null,
                            status          = null,
                            values_check    = null;
                        if (object !== null && properties !== null) {
                            properties = (properties instanceof Array ? properties : [properties]);
                            try{
                                Array.prototype.forEach.call(
                                    properties,
                                    function (property) {
                                        if (property.name && property.type) {
                                            if (object[property.name]) {
                                                property.type = (typeof property.type === "string" ? [property.type] : property.type);
                                                if (property.type instanceof Array) {
                                                    status = false;
                                                    Array.prototype.forEach.call(
                                                        property.type,
                                                        function (type) {
                                                            if (type === "node") {
                                                                if (object[property.name]) {
                                                                    status = (object[property.name].nodeName ? true : status);
                                                                }
                                                            } else if (type === "array") {
                                                                status = (object[property.name] instanceof Array === true ? true : status);
                                                            } else {
                                                                status = (typeof object[property.name] === type ? true : status);
                                                            }
                                                        }
                                                    );
                                                    if (status === false) {
                                                        if (property.value) {
                                                            object[property.name] = property.value;
                                                        } else {
                                                            throw 'deny';
                                                        }
                                                    } else {
                                                        if (property.values) {
                                                            if (property.values instanceof Array) {
                                                                try {
                                                                    values_check = false;
                                                                    Array.prototype.forEach.call(
                                                                        property.values,
                                                                        function (value) {
                                                                            if (object[property.name] === value) {
                                                                                values_check = true;
                                                                                throw 'found';
                                                                            }
                                                                        }
                                                                    );
                                                                } catch (e) {
                                                                }
                                                                if (values_check === false) {
                                                                    throw 'deny';
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            } else {
                                                if (typeof property.value !== 'undefined') {
                                                    object[property.name] = property.value;
                                                } else {
                                                    throw 'deny';
                                                }
                                            }
                                        }
                                    }
                                );
                            } catch (e) {
                                return false;
                            }
                            return true;
                        }
                        return null;
                    }
                }
            };
            modules = {
                preload     : function () {
                    var libraries = config.defaults.resources.MODULES;
                    if (libraries instanceof Array && modules.registry.is_ready !== false) {
                        modules.history.add(libraries);
                        Array.prototype.forEach.call(
                            libraries,
                            function (library) {
                                modules.repository.call(library);
                            }
                        );
                    }
                },
                reference   : {
                    history: {
                        data    : [],
                        add     : function (name) {
                            modules.reference.history.data.push(name);
                        },
                        isIn    : function (name) {
                            return (modules.reference.history.data.indexOf(name) !== -1 ? true : false);
                        }
                    },
                    caller  : {
                        name    : null,
                        ready   : null
                    },
                    call    : function (library) {
                        var caller  = modules.reference.caller,
                            histroy = modules.reference.history;
                        if (caller.name !== null) {
                            if (modules.storage.get(library) === null) {
                                caller.ready = false;
                                if (histroy.isIn(library) === false) {
                                    histroy.add(library);
                                    modules.repository.call(library);
                                }
                            } else {
                                caller.ready = (caller.ready === false ? false : true);
                            }
                        }
                    },
                    check   : function (library) {
                        var caller          = modules.reference.caller,
                            storaged        = modules.storage.get(library);
                        if (storaged !== null) {
                            try {
                                caller.name     = library;
                                caller.ready    = true;
                                if (typeof storaged.reference === 'function') {
                                    storaged.reference();
                                }
                            } catch (e) {
                                logs.log('Library [' + library + '] generated error during request for references:\n\r' + logs.parseError(e), logs.types.CRITICAL);
                                caller.ready    = false;
                            } finally {
                                storaged.ready  = caller.ready;
                                caller.name     = null;
                                caller.ready    = null;
                            }
                        }
                    },
                    pending : function () {
                        var libraries   = modules.storage.pending(),
                            check       = modules.reference.check;
                        if (libraries.length > 0) {
                            Array.prototype.forEach.call(
                                libraries,
                                function (library) {
                                    check(library);
                                }
                            );
                        }
                    }
                },
                registry    : {
                    /// <field type="boolean">Flag shows ready modules for loading or not</field>
                    get is_ready() {
                        return (typeof modules.registry.ready.is_ready !== 'boolean' ? false : true);
                    },
                    ready       : function () {
                        /// <summary>
                        /// Start work with modules. Make list, prepare callers etc. 
                        /// </summary>
                        /// <returns type="void">void</returns>
                        var libraries   = flex.libraries;
                        if (typeof modules.registry.ready.is_ready !== 'boolean') {
                            modules.registry.makeCallers(modules.registry.getList(libraries));
                            modules.registry.ready.is_ready = true;
                            events.core.fire('modules.registry', 'ready', null);
                        }
                    },
                    getList     : function (libraries, list, parent) {
                        /// <summary>
                        /// Make list of modules from object with module. 
                        /// </summary>
                        /// <param name="libraries" type="Object"   >Link to object with modules    </param>
                        /// <param name="list"      type="Array"    >Array with list of modules     </param>
                        /// <param name="parent"    type="Object"   >Link to current parent         </param>
                        /// <returns type="Array">List of modules</returns>
                        var list    = list || [],
                            parent  = parent || false;
                        for (var property in libraries) {
                            list.push({ name: (parent !== false ? parent + '.' + property : property) });
                            if (typeof libraries[property] === 'object' && libraries[property] !== null && libraries[property] !== undefined) {
                                if (typeof libraries[property].settings !== 'boolean') {
                                    modules.registry.getList(
                                        libraries[property],
                                        list,
                                        (parent !== false ? parent + '.' + property : property)
                                    );
                                }
                            }
                        }
                        return list;
                    },
                    makeCallers : function (list_libraries) {
                        /// <summary>
                        /// Create object of module's callers
                        /// </summary>
                        /// <param name="list_libraries" type="Array">Array with list of modules</param>
                        /// <returns type="void">void</returns>
                        flex.libraries_data = oop.objects.extend(flex.libraries);
                        Array.prototype.forEach.call(
                            list_libraries,
                            function (library) {
                                var property    = oop.namespace.create(library.name, flex.libraries),
                                    full_name   = null;
                                if (property !== null) {
                                    full_name = modules.tools.fullName(library.name);
                                    Object.defineProperty(
                                        property.parent,
                                        property.name,
                                        {
                                            enumerable  : false,
                                            configurable: false,
                                            value       : function () { modules.reference.call(full_name); }
                                        }
                                    );
                                }
                            }
                        );
                    },
                    getSettings : function (name) {
                        /// <summary>
                        /// Get settings of library
                        /// </summary>
                        /// <param name="name" type="string">Library name</param>
                        /// <returns type="object">Settings if it was found or NULL in fail</returns>
                        var name = name.indexOf('flex.libraries.') === 0 ? name.replace('flex.libraries.', '') : name;
                        return oop.namespace.get(name, flex.libraries_data);
                    }
                },
                storage     : {
                    data    : {},
                    add     : function (parameters) {
                        /// <summary>
                        /// Add module data to virtual storage
                        /// </summary>
                        /// <param name="parameters" type="Object">Object of module</param>
                        /// <returns type="boolean">true if success and false if fail</returns>
                        var storage = modules.storage.data;
                        if (typeof storage[parameters.name] === 'undefined') {
                            storage[parameters.name] = {
                                name            : parameters.name,
                                protofunction   : parameters.protofunction,
                                onBeforeAttach  : parameters.onBeforeAttach,
                                onAfterAttach   : parameters.onAfterAttach,
                                extend          : parameters.extend,
                                reference       : parameters.reference,
                                ready           : false
                            };
                            return true;
                        }
                        return false;
                    },
                    get     : function (name) {
                        /// <summary>
                        /// Get module data from virtual storage
                        /// </summary>
                        /// <param name="name" type="string">Name of module</param>
                        /// <returns type="Object">Object of module</returns>
                        return (typeof modules.storage.data[name] === 'undefined' ? null : modules.storage.data[name]);
                    },
                    pending : function () {
                        /// <summary>
                        /// Get pending modules data from virtual storage
                        /// </summary>
                        /// <returns type="Array">Array of names of pending modules</returns>
                        var libraries = [];
                        for (var library in modules.storage.data) {
                            if (modules.storage.data[library].ready === false) {
                                libraries.push(library);
                            }
                        }
                        return libraries;
                    },
                },
                attach      : {
                    queue   : {
                        data    : [],
                        add     : function (parameters) {
                            /// <summary>
                            /// Add module to queue of initialization (until registry will be ready)
                            /// </summary>
                            /// <param name="parameters" type="Object">Object of module</param>
                            /// <returns type="void">void</returns>
                            modules.attach.queue.data.push(parameters);
                        },
                        reset   : function () {
                            /// <summary>
                            /// Reset a queue of initialization
                            /// </summary>
                            /// <returns type="void">void</returns>
                            modules.attach.queue.data = [];
                        },
                        proceed : function () {
                            /// <summary>
                            /// Processing of queue of initialization
                            /// </summary>
                            /// <returns type="void">void</returns>
                            var queue = modules.attach.queue;
                            Array.prototype.forEach.call(
                                queue.data,
                                function (parameters, index) {
                                    if (typeof parameters.going !== 'boolean') {
                                        queue.data[index].going = true;
                                        modules.attach.embody(parameters);
                                    }
                                }
                            );
                            queue.reset();
                        }
                    },
                    safely  : function (parameters) {
                        /// <summary>
                        /// Safely attach module. Method attaches module with queue
                        /// </summary>
                        /// <param name="parameters" type="Object">Object of module:    &#13;&#10;
                        /// {   [string]    name,                                       &#13;&#10;
                        ///     [function]  protofunction,                              &#13;&#10;
                        ///     [function]  reference       (optional),                 &#13;&#10;
                        ///     [array]     resources       (optional),                 &#13;&#10;
                        ///     [function]  onBeforeAttach  (optional),                 &#13;&#10;
                        ///     [function]  onAfterAttach   (optional),                 &#13;&#10;
                        ///     [array]     extend          (optional)}</param>
                        /// <returns type="boolean">true if success and false if module placed in queue</returns>
                        var queue = modules.attach.queue;
                        queue.add(parameters);
                        if (modules.registry.is_ready !== false) {
                            //Registry of libraries is ready
                            queue.proceed();
                        }
                        //Registry of libraries is not ready. We have to wait
                        return false;
                    },
                    embody  : function (parameters) {
                        /// <summary>
                        /// Attach module. Method attaches module directly without queue
                        /// </summary>
                        /// <param name="parameters" type="Object">Object of module:    &#13;&#10;
                        /// {   [string]    name,                                       &#13;&#10;
                        ///     [function]  protofunction,                              &#13;&#10;
                        ///     [function]  reference       (optional),                 &#13;&#10;
                        ///     [array]     resources       (optional),                 &#13;&#10;
                        ///     [function]  onBeforeAttach  (optional),                 &#13;&#10;
                        ///     [function]  onAfterAttach   (optional),                 &#13;&#10;
                        ///     [array]     extend          (optional)}</param>
                        /// <returns type="boolean">true if success and false if fail</returns>
                        function validateParameters(parameters) {
                            parameters.name             = parameters.name           || null;
                            parameters.protofunction    = parameters.protofunction  || null;
                            parameters.reference        = parameters.reference      || null;
                            parameters.resources        = parameters.resources      || [];
                            parameters.onBeforeAttach   = parameters.onBeforeAttach || null;
                            parameters.onAfterAttach    = parameters.onAfterAttach  || null;
                            parameters.extend           = parameters.extend         || [];
                            return parameters;
                        };
                        function makeConstructor(constructor_storage, name) {
                            constructor_storage.create = function () {
                                var library = modules.storage.get(name);
                                //Check prototype
                                if (typeof library.protofunction.prototype === 'function') {
                                    //Initialize prototype if it's necessary
                                    library.protofunction.prototype = (library.protofunction.prototype)();
                                }
                                return new (library.protofunction)();
                            };
                        };
                        var parameters          = validateParameters((parameters || {})),
                            constructor_storage = null;
                        if (parameters.protofunction !== null && parameters.name !== null) {
                            //Correct namespace
                            parameters.name = modules.tools.fullName(parameters.name);
                            //Get link to storage of library. Also it checks is library in registry or not
                            constructor_storage = oop.namespace.get(parameters.name);
                            if (constructor_storage !== null && constructor_storage !== false) {
                                //Check is library attached or not
                                if (typeof constructor_storage.create === 'undefined') {
                                    //Save library data in storage
                                    if (modules.storage.add(parameters) !== false) {
                                        //Add to repository
                                        modules.repository.add(parameters);
                                        //Make constructor
                                        makeConstructor(constructor_storage, parameters.name);
                                        //Check references of this library
                                        modules.reference.check(parameters.name);
                                        //Restart references of pending libraries
                                        modules.reference.pending();
                                        //Check resources of module
                                        modules.resources.check(parameters.name);
                                        //Mark as done
                                        modules.history.done(parameters.name);
                                        return true;
                                    }
                                }
                            }
                        }
                        return false;
                    }
                },
                resources   : {
                    check   : function (name) {
                        function validate(resources) {
                            var valid = [];
                            Array.prototype.forEach.call(
                                resources,
                                function (resource) {
                                    if (typeof resource === 'string') {
                                        valid.push({
                                            url     : resource,
                                            hash    : settings.hash
                                        });
                                    }
                                }
                            );
                            return valid;
                        };
                        var settings    = modules.registry.getSettings(name),
                            repository  = null;
                        if (settings !== null) {
                            if (settings.resources) {
                                //Validate resources links
                                if (typeof settings.resources === 'string') {
                                    settings.resources = [settings.resources];
                                }
                                settings.resources = validate(settings.resources);
                                //Try get resources
                                modules.resources.get(settings.resources, name);
                            }
                        }
                    },
                    get     : function (resources, name) {
                        var journal = overhead.globaly.get(options.storage.GROUP, options.storage.RESOURCES_JOURNAL, {});
                        Array.prototype.forEach.call(
                            resources,
                            function (resource) {
                                if (!journal[resource.url]) {
                                    modules.resources.load(resource);
                                    journal[resource.url] = name;
                                }
                            }
                        );
                    },
                    load    : function (resource) {
                        function restore(resource) {
                            //Resource: CSS
                            if (resource.url.search(regs.CSS) !== -1) {
                                system.resources.css.adoption(resource.value);
                            }
                        };
                        function reload(resource) {
                            //Resource: CSS
                            if (resource.url.search(regs.CSS) !== -1) {
                                system.resources.css.connect(
                                    resource.url,
                                    function () {
                                        modules.resources.save.css(resource);
                                    },
                                    null
                                );
                            }
                        };
                        var localStorage    = system.localStorage,
                            storaged        = localStorage.getJSON(resource.url),
                            regs            = options.regs.resources;
                        if (storaged !== null && config.defaults.resources.USE_STORAGED !== false) {
                            if (resource.hash === storaged.hash) {
                                restore(storaged);
                            } else {
                                reload(resource);
                            }
                        } else {
                            reload(resource);
                        }
                    },
                    save    : {
                        css : function (resource) {
                            var localStorage    = system.localStorage,
                                cssText         = parsing.css.stringify(resource.url);
                            if (cssText !== null) {
                                localStorage.setJSON(
                                    resource.url,
                                    {
                                        value   : cssText,
                                        url     : resource.url,
                                        hash    : resource.hash
                                    }
                                );
                            }
                        }
                    }
                },
                repository  : {
                    add     : function (parameters) {
                        /// <summary>
                        /// Add resource into repository
                        /// </summary>
                        /// <param name="parameters" type="Object">Object of data. Same as in [attach.embody]</param>
                        /// <returns type="boolean">true if success and false if not</returns>
                        var settings    = modules.registry.getSettings(parameters.name),
                            data        = {
                                name            : parameters.name,
                                constr          : parameters.protofunction,
                                protofunction   : parameters.protofunction.prototype,
                                reference       : parameters.reference,
                                resources       : parameters.resources,
                                onBeforeAttach  : parameters.onBeforeAttach,
                                onAfterAttach   : parameters.onAfterAttach,
                                extend          : parameters.extend,
                            },
                            hash        = modules.repository.getHash(parameters.name);
                        if (hash !== settings.hash && config.defaults.resources.USE_STORAGED !== false) {
                            data.constr         = (typeof data.constr           === 'function' ? parsing.js.stringify(data.constr           ) : null);
                            data.protofunction  = (typeof data.protofunction    === 'function' ? parsing.js.stringify(data.protofunction    ) : null);
                            data.reference      = (typeof data.reference        === 'function' ? parsing.js.stringify(data.reference        ) : null);
                            data.onBeforeAttach = (typeof data.onBeforeAttach   === 'function' ? parsing.js.stringify(data.onBeforeAttach   ) : null);
                            data.onAfterAttach  = (typeof data.reference === 'function' ? parsing.js.stringify(data.onAfterAttach) : null);
                            if (data.constr !== null && data.protofunction !== null) {
                                return system.localStorage.set(
                                    parameters.name,
                                    JSON.stringify(
                                        {
                                            data: data,
                                            hash: settings.hash
                                        }
                                    ),
                                    true
                                );
                            }
                        }
                        return null;
                    },
                    get     : function (name, hash) {
                        /// <summary>
                        /// Get resource from repository
                        /// </summary>
                        /// <param name="name" type="string">Name of resource</param>
                        /// <param name="hash" type="string">Control hash for resource</param>
                        /// <returns type="object">Value of resource if success and NULL if not</returns>
                        var localStorage    = system.localStorage,
                            storaged        = localStorage.get(name, true);
                        if (storaged !== null && config.defaults.resources.USE_STORAGED !== false) {
                            try{
                                storaged = JSON.parse(storaged);
                                if (storaged.hash === hash) {
                                    storaged.data.protofunction = parsing.js.parse({
                                        constr  : { params: storaged.data.constr.params, body: storaged.data.constr.body },
                                        proto   : { params: storaged.data.protofunction.params, body: storaged.data.protofunction.body }
                                    });
                                    if (storaged.data.reference !== null) {
                                        storaged.data.reference = parsing.js.parseFunction(storaged.data.reference.params, storaged.data.reference.body);
                                    }
                                    if (storaged.data.onBeforeAttach !== null) {
                                        storaged.data.onBeforeAttach = parsing.js.parseFunction(storaged.data.onBeforeAttach.params, storaged.data.onBeforeAttach.body);
                                    }
                                    if (storaged.data.onAfterAttach !== null) {
                                        storaged.data.onAfterAttach = parsing.js.parseFunction(storaged.data.onAfterAttach.params, storaged.data.onAfterAttach.body);
                                    }
                                    storaged.data.constr = null;
                                    delete storaged.data.constr;
                                    return storaged.data;
                                } else {
                                    localStorage.del(name);
                                    return null;
                                }
                            } catch (e) {
                                localStorage.del(name);
                                return null;
                            }
                        }
                        return null;
                    },
                    getHash : function (name){
                        /// <summary>
                        /// Returns hash of resource from repository
                        /// </summary>
                        /// <param name="name" type="string">Name of resource</param>
                        /// <returns type="string">Value of hash</returns>
                        var localStorage    = system.localStorage,
                            storaged        = localStorage.get(name, true);
                        if (storaged !== null) {
                            try{
                                storaged = JSON.parse(storaged);
                                return storaged.hash;
                            } catch (e) {
                                return null;
                            }
                        }
                        return null;
                    },
                    call    : function (name) {
                        /// <summary>
                        /// Try find resource into repository and load it if necessary 
                        /// </summary>
                        /// <param name="name" type="string">Name of resource</param>
                        /// <returns type="void">void</returns>
                        var name        = modules.tools.clearName(name),
                            settings    = modules.registry.getSettings(name),
                            repository  = null;
                        if (settings !== null) {
                            if (settings.hash) {
                                modules.history.add(name);
                                repository = modules.repository.get(modules.tools.fullName(name), settings.hash);
                                if (repository !== null) {
                                    modules.attach.safely(repository);
                                } else {
                                    if (settings.source.toLocaleString().indexOf('.js') === settings.source.length - '.js'.length) {
                                        system.resources.js.connect(settings.source, null, null);
                                    }
                                    if (settings.source.toLocaleString().indexOf('.css') === settings.source.length - '.css'.length) {
                                        system.resources.css.connect(settings.source, null, null, false);
                                    }
                                }
                            }
                        }
                    }
                },
                history     : {
                    add     : function (names) {
                        var storage = overhead.globaly.get(options.storage.GROUP, options.storage.MODULES_HISTROY, {}),
                            names   = names instanceof Array ? names : [names];
                        Array.prototype.forEach.call(
                            names,
                            function (name) {
                                var _name = modules.tools.clearName(name);
                                if (storage[_name] === undefined) {
                                    storage[_name] = 'wait';
                                }
                            }
                        );
                    },
                    done    : function (name) {
                        var storage = overhead.globaly.get(options.storage.GROUP, options.storage.MODULES_HISTROY, {}),
                            name    = modules.tools.clearName(name);
                        if (storage[name] !== undefined) {
                            storage[name] = 'done';
                        }
                        if (modules.history.isReady() !== false) {
                            system.handle(config.defaults.events.finish, null, 'onFinishLoadModules', this);
                        }
                    },
                    isReady : function () {
                        var storage = overhead.globaly.get(options.storage.GROUP, options.storage.MODULES_HISTROY, {});
                        for (var key in storage) {
                            if (storage[key] !== 'done') {
                                return false;
                            }
                        }
                        return true;
                    }
                },
                tools       : {
                    fullName    : function (library) {
                        library = library.toLowerCase();
                        return (library.indexOf('flex.libraries.') !== 0 ? 'flex.libraries.' + library : library);
                    },
                    clearName   : function (library) {
                        library = library.toLowerCase().replace('flex.', '');
                        return (library.indexOf('libraries.') === -1 ? 'flex.libraries.' + library : 'flex.' + library);
                    }
                }
            };
            parsing = {
                js  : {
                    stringify       : function (_function) {
                        /// <summary>
                        /// Get string from function
                        /// </summary>
                        /// <param name="name" type="string">Function body</param>
                        /// <returns type="object" value="{params:string,body:string}">Function as object</returns>
                        var tools           = parsing.js.tools,
                            str_function    = null,
                            result          = null;
                        if (typeof _function === 'function') {
                            str_function    = _function.toString();
                            result          = {
                                params  : tools.getParams(str_function),
                                body    : tools.getBody(str_function)
                            };
                            if (result.params !== null && result.body !== null) {
                                return result;
                            }
                            return null;
                        }
                    },
                    parse           : function (data) {
                        /// <summary>
                        /// Make prototype function and constructor from string data
                        /// </summary>
                        /// <param name="parameters" type="Object"> 
                        /// {   [object] constr:                    &#13;&#10;
                        ///     {   [string] params,                &#13;&#10;
                        ///         [string] body                   &#13;&#10;
                        ///     },                                  &#13;&#10;
                        /// {   [object] proto:                     &#13;&#10;
                        ///     {   [string] params,                &#13;&#10;
                        ///         [string] body                   &#13;&#10;
                        ///     },                                  &#13;&#10;
                        /// }</param>
                        /// <returns type="function">Prototype function</returns>
                        var protofunction = parsing.js.parseFunction(data.constr.params, data.constr.body);
                        if (typeof protofunction === 'function') {
                            protofunction.prototype = parsing.js.parseFunction(data.proto.params, data.proto.body);
                            if (typeof protofunction.prototype === 'function') {
                                return protofunction;
                            }
                        }
                        return null;
                    },
                    parseFunction   : function (params, body) {
                        /// <summary>
                        /// Make function from string data
                        /// </summary>
                        /// <param name="params" type="string">Parameters of function</param>
                        /// <param name="body" type="string">Body of function</param>
                        /// <returns type="function">Function</returns>
                        if (typeof params === 'string' && typeof body === 'string') {
                            return new Function(params, body);
                        }
                        return null;
                    },
                    tools           : {
                        getBody     : function (function_str) {
                            /// <summary>
                            /// Get body of function from string representation
                            /// </summary>
                            /// <param name="function_str" type="string">String representation of function</param>
                            /// <returns type="string">String representation of function's body</returns>
                            function_str = function_str.replace(/^(function\s*?\(.*?\)\s*?\{)/gi, '');
                            function_str = function_str.replace(/\}$/gi, '');
                            if (function_str.search(/(use strict)/gi) === -1) {
                                function_str = '"use strict";' + function_str;
                            }
                            return function_str;
                        },
                        getParams   : function (function_str) {
                            /// <summary>
                            /// Get parameters of function from string representation
                            /// </summary>
                            /// <param name="function_str" type="string">String representation of function</param>
                            /// <returns type="string">String representation of function's parameters</returns>
                            var matches = function_str.match(/^(function\s*?\(.*?\)\s*?\{)/gi);
                            if (matches !== null) {
                                if (matches.length === 1) {
                                    matches = matches[0].match(/\(.*?\)/gi, '');
                                    if (matches.length === 1) {
                                        matches = matches[0].replace(/[\(\)]/g, '');
                                        return matches;
                                    }
                                }
                            }
                            return null;
                        }
                    }
                },
                css : {
                    stringify: function (href) {
                        /// <summary>
                        /// Get string from CSS resource
                        /// </summary>
                        /// <param name="resource" type="string">URL of CSS resource</param>
                        /// <returns type="string">String representation of CSS resource</returns>
                        function getCSSText(sheet) {
                            function getKeyframesIE(rule) {
                                var keyframe = '';
                                if (rule.cssRules) {
                                    keyframe = '@keyframes ' + rule.name + ' {\n\r';
                                    Array.prototype.forEach.call(
                                        rule.cssRules,
                                        function (sub_rule) {
                                            keyframe += sub_rule.keyText + ' { ' + sub_rule.style.cssText + ' }\n\r';
                                        }
                                    );
                                    keyframe += '}';
                                }
                                return keyframe;
                            };
                            var CSSText = '',
                                doc     = document;
                            if (sheet.cssRules || sheet.rules) {
                                Array.prototype.forEach.call(
                                    (sheet.cssRules || sheet.rules),
                                    function (rule) {
                                        if (typeof rule.cssText === 'string') {
                                            CSSText += rule.cssText + '\n\r';
                                        } else {
                                            CSSText += getKeyframesIE(rule) + '\n\r';
                                        }
                                    }
                                );
                            } else if (typeof sheet.cssText === 'string') {
                                CSSText = sheet.cssText;
                            }
                            return CSSText;
                        };
                        var sheets      = document.styleSheets,
                            styles      = null;
                        try{
                            Array.prototype.forEach.call(
                                document.styleSheets,
                                function (sheet) {
                                    if (sheet.href) {
                                        if (sheet.href.indexOf(href) !== -1) {
                                            styles = getCSSText(sheet);
                                            throw 'found';
                                        }
                                    }
                                }
                            );
                        } catch (e) {
                        } finally {
                            return styles;
                        }
                    }
                }
            };
            overhead    = {
                globaly : {
                    storage : {},
                    get     : function (group, name, default_value) {
                        /// <summary>
                        /// Return value from closed space 
                        /// </summary>
                        /// <param name="group" type="string"   >Name of storage group</param>
                        /// <param name="name"  type="string"   >Name of storage</param>
                        /// <returns type="any">returns saved value</returns>
                        var storage = overhead.globaly.storage;
                        if (group in storage) {
                            if (name in storage[group]) {
                                return storage[group][name];
                            }
                        }
                        if (default_value) {
                            return overhead.globaly.set(group, name, default_value);
                        }
                        return null;
                    },
                    set     : function (group, name, value) {
                        /// <summary>
                        /// Create value in closed space 
                        /// </summary>
                        /// <param name="group" type="string"   >Name of storage group</param>
                        /// <param name="name"  type="string"   >Name of storage</param>
                        /// <param name="value" type="any"      >Value</param>
                        /// <returns type="any">returns saved value</returns>
                        var storage = overhead.globaly.storage;
                        storage[group] = (group in storage ? storage[group] : {});
                        storage[group][name] = value;
                        return storage[group][name];
                    },
                    remove  : function (group, name) {
                        /// <summary>
                        /// Return value from closed space 
                        /// </summary>
                        /// <param name="group" type="string"   >Name of storage group</param>
                        /// <param name="name"  type="string"   >Name of storage</param>
                        /// <returns type="boolean">true - if removed; false - if not found</returns>
                        var storage = overhead.globaly.storage;
                        if (group in storage) {
                            if (name in storage[group]) {
                                storage[group][name] = null;
                                delete storage[group][name];
                                if (Object.keys(storage[group]).length === 0) {
                                    storage[group] = null;
                                    delete storage[group];
                                }
                                return true;
                            }
                        }
                        return false;
                    }
                },
                objecty: {
                    settings: {
                        COMMON_STORAGE_NAME : 'FlexObjectStorage'
                    },
                    set     : function (element, property, value, rewrite) {
                        /// <summary>
                        /// Add property to virtual storage based on element
                        /// </summary>
                        /// <param name="element"   type="object"   >Object for attach storage</param>
                        /// <param name="property"  type="string"   >Name of property</param>
                        /// <param name="value"     type="any"      >Value</param>
                        /// <param name="rewrite"   type="boolean"  >[optional] rewrite or not value</param>
                        /// <returns type="any">value</returns>
                        var rewrite = (typeof rewrite === "boolean" ? rewrite : true),
                            settings    = overhead.objecty.settings;
                        if (typeof element === "object" && typeof property === "string" && typeof value !== "undefined") {
                            if (typeof element[settings.COMMON_STORAGE_NAME] !== "object") {
                                element[settings.COMMON_STORAGE_NAME] = {};
                            }
                            if (rewrite === false) {
                                if (typeof element[settings.COMMON_STORAGE_NAME][property] === "undefined") {
                                    element[settings.COMMON_STORAGE_NAME][property] = value;
                                }
                            } else {
                                element[settings.COMMON_STORAGE_NAME][property] = value;
                            }
                            return value;
                        }
                        return null; 
                    },
                    get     : function (element, property, remove) {
                        /// <summary>
                        /// Get property from virtual storage based on element
                        /// </summary>
                        /// <param name="element"   type="object"   >Object for attach storage</param>
                        /// <param name="property"  type="string"   >Name of property</param>
                        /// <param name="remove"    type="boolean"  >[optional] remove or not property from storage after value will be read</param>
                        /// <returns type="any">value</returns>
                        var remove = (typeof remove === "boolean" ? remove : false),
							value       = null,
                            settings    = overhead.objecty.settings,
							tools       = overhead.objecty.tools;
                        if (typeof element === "object" && typeof property === "string") {
                            if (typeof element[settings.COMMON_STORAGE_NAME] === "object") {
                                if (typeof element[settings.COMMON_STORAGE_NAME][property] !== "undefined") {
                                    value = element[settings.COMMON_STORAGE_NAME][property];
                                    if (remove === true) {
                                        element[settings.COMMON_STORAGE_NAME][property] = null;
                                        tools.deleteAttribute(element, property);
                                        tools.clear(element);
                                    }
                                    return value;
                                }
                            }
                        }
                        return null;
                    },
                    remove  : function (element, property) {
                        /// <summary>
                        /// Remove property from virtual storage based on element
                        /// </summary>
                        /// <param name="element"   type="object"   >Object for attach storage</param>
                        /// <param name="property"  type="string"   >Name of property</param>
                        /// <returns type="boolean">true - removed; false - not found; null - bad parameters</returns>
                        var remove      = (typeof remove === "boolean" ? remove : false),
							value       = null,
                            settings    = overhead.objecty.settings,
							tools       = overhead.objecty.tools;
                        if (typeof element === "object" && typeof property === "string") {
                            if (typeof element[settings.COMMON_STORAGE_NAME] === "object") {
                                if (typeof element[settings.COMMON_STORAGE_NAME][property] !== "undefined") {
                                    element[settings.COMMON_STORAGE_NAME][property] = null;
                                    tools.deleteAttribute(element, property);
                                    tools.clear(element);
                                    return true;
                                }
                            }
                            return false;
                        }
                        return null;
                    },
                    tools   : {
                        deleteAttribute : function (element, property) {
                            try {
                                delete element[property];
                            } catch (e) {
                                element.removeAttribute(property);
                            }
                        },
                        clear           : function (element) {
                            var settings    = overhead.objecty.settings,
                                tools       = overhead.objecty.tools;
                            if (Object.keys(element[settings.COMMON_STORAGE_NAME]).length === 0) {
                                element[settings.COMMON_STORAGE_NAME] = null;
                                tools.deleteAttribute(element, settings.COMMON_STORAGE_NAME);
                            }
                        }
                    }
                }
            };
            events = {
                DOM     : {
                    add     : (function () {
                        if (typeof window.addEventListener === "function") {
                            return function (element, eventName, handle) {
                                /// <summary>
                                /// Add DOM's events listener 
                                /// </summary>
                                /// <param name="element"   type="node"     >Node</param>
                                /// <param name="eventName" type="string"   >Name of event</param>
                                /// <param name="handle"    type="function" >Handle</param>
                                /// <returns type="void">void</returns>
                                var events = (eventName instanceof Array ? eventName : [eventName]);
                                Array.prototype.forEach.call(
                                    events,
                                    function (event) {
                                        element.addEventListener(event, handle, false);
                                    }
                                );
                            };
                        } else if (typeof document.attachEvent === "function") {
                            return function (element, eventName, handle) {
                                /// <summary>
                                /// Add DOM's events listener 
                                /// </summary>
                                /// <param name="element"   type="node"     >Node</param>
                                /// <param name="eventName" type="string"   >Name of event</param>
                                /// <param name="handle"    type="function" >Handle</param>
                                /// <returns type="void">void</returns>
                                var events = (eventName instanceof Array ? eventName : [eventName]);
                                Array.prototype.forEach.call(
                                    events,
                                    function (event) {
                                        element.attachEvent(("on" + event), handle);
                                    }
                                );
                            };
                        } else {
                            return function (element, eventName, handle) {
                                /// <summary>
                                /// Add DOM's events listener 
                                /// </summary>
                                /// <param name="element"   type="node"     >Node</param>
                                /// <param name="eventName" type="string"   >Name of event</param>
                                /// <param name="handle"    type="function" >Handle</param>
                                /// <returns type="void">void</returns>
                                var events = (eventName instanceof Array ? eventName : [eventName]);
                                Array.prototype.forEach.call(
                                    events,
                                    function (event) {
                                        element[("on" + event)] = handle;
                                    }
                                );
                            };
                        };
                    }()),
                    remove  : (function () {
                        if (typeof window.removeEventListener === "function") {
                            return function (element, eventName, handle) {
                                /// <summary>
                                /// Remove DOM's events listener 
                                /// </summary>
                                /// <param name="element"   type="node"     >Node</param>
                                /// <param name="eventName" type="string"   >Name of event</param>
                                /// <param name="handle"    type="function" >Handle</param>
                                /// <returns type="void">void</returns>
                                element.removeEventListener(eventName, handle, false);
                            };
                        } else if (typeof document.detachEvent === "function") {
                            return function (element, eventName, handle) {
                                /// <summary>
                                /// Remove DOM's events listener 
                                /// </summary>
                                /// <param name="element"   type="node"     >Node</param>
                                /// <param name="eventName" type="string"   >Name of event</param>
                                /// <param name="handle"    type="function" >Handle</param>
                                /// <returns type="void">void</returns>
                                element.detachEvent(("on" + eventName), handle);
                            };
                        } else {
                            return function (element, eventName, handle) {
                                /// <summary>
                                /// Remove DOM's events listener 
                                /// </summary>
                                /// <param name="element"   type="node"     >Node</param>
                                /// <param name="eventName" type="string"   >Name of event</param>
                                /// <param name="handle"    type="function" >Handle</param>
                                /// <returns type="void">void</returns>
                                element[("on" + eventName)] = null;
                            };
                        };
                    }())
                },
                core    : {
                    storage : {},
                    listen  : function (group, name, handle, id, registered_only) {
                        /// <summary>
                        /// Add core's events listener 
                        /// </summary>
                        /// <param name="group"             type="string"   >Name of event group</param>
                        /// <param name="name"              type="string"   >Name of event</param>
                        /// <param name="handle"            type="function" >Handle</param>
                        /// <param name="id"                type="string"   >[optional][unique ID] ID of event</param>
                        /// <param name="registered_only"   type="boolean"  >[optional][false] Add listener only if event was registered before</param>
                        /// <returns type="boolean / string">return ID of listener - if attached; false - if not</returns>
                        var group           = group || null,
                            name            = name      || null,
                            handle          = handle    || null,
                            id              = id        || IDs.id(),
                            registered_only = typeof registered_only !== 'boolean' ? false : registered_only,
                            storage         = null,
                            core            = events.core;
                        if (group !== null && name !== null && handle !== null) {
                            if (registered_only !== false) {
                                if (core.get(group, name) === null) {
                                    return false;
                                }
                            }
                            storage = core.register(group, name);
                            if (id in storage) {
                                //Here should be message about rewrite existing handle
                                //LOGS!
                            }
                            storage[id] = handle;
                            return id;
                        }
                        return false;
                    },
                    remove  : function (group, name, id) {
                        /// <summary>
                        /// Remove core's events listener 
                        /// </summary>
                        /// <param name="group" type="string">Name of event group</param>
                        /// <param name="name"  type="string">Name of event</param>
                        /// <param name="id"    type="string">ID of event</param>
                        /// <returns type="boolean">true - removed; false - not found</returns>
                        var group = group || null,
                            name            = name      || null,
                            id              = id        || null,
                            storage         = null,
                            global_starage  = events.core.storage,
                            core            = events.core;
                        if (group !== null && name !== null && id !== null) {
                            storage = core.register(group, name);
                            if (id in storage) {
                                storage[id] = null;
                                delete storage[id];
                                if (Object.keys(storage).length === 0) {
                                    global_starage[group][name] = null;
                                    delete global_starage[group][name];
                                    if (Object.keys(global_starage[group]).length === 0) {
                                        global_starage[group] = null;
                                        delete global_starage[group];
                                    }
                                }
                                return true;
                            }
                        }
                        return false;
                    },
                    register: function (group, name) {
                        /// <summary>
                        /// Register core's event 
                        /// </summary>
                        /// <param name="group" type="string">Name of event group</param>
                        /// <param name="name"  type="string">Name of event</param>
                        /// <returns type="object">Storage of registered event</returns>
                        var storage = events.core.storage;
                        if (!(group in storage      )) { storage[group]         = {}; }
                        if (!(name in storage[group])) { storage[group][name]   = {}; }
                        return storage[group][name];
                    },
                    get     : function (group, name) {
                        /// <summary>
                        /// Get storage of registered core's event 
                        /// </summary>
                        /// <param name="group" type="string">Name of event group</param>
                        /// <param name="name"  type="string">Name of event</param>
                        /// <returns type="object" mayBeNull="true">Storage of registered event. NULL if event isn't registered</returns>
                        var storage = events.core.storage;
                        if (!(group in storage      )) { return null; }
                        if (!(name in storage[group])) { return null; }
                        return storage[group][name];
                    },
                    fire    : function (group, name, params) {
                        /// <summary>
                        /// Call handles of registered core's event 
                        /// </summary>
                        /// <param name="group"     type="string"   >Name of event group</param>
                        /// <param name="name"      type="string"   >Name of event</param>
                        /// <param name="params"    type="any"      >Parameters for all called handles</param>
                        /// <returns type="void">void</returns>
                        var handles = events.core.get(group, name);
                        if (handles !== null) {
                            for (var id in handles) {
                                try{
                                    handles[id](params);
                                } catch (e) {
                                    //LOGS!
                                }
                            }
                        }
                    }
                }
            };
            system = {
                handle  : function (handle_body, handle_arguments, call_point, this_argument) {
                    var handle_body         = handle_body || null,
                        handle_arguments    = handle_arguments || null,
                        call_point          = call_point || null,
                        this_argument       = this_argument || null;
                    if (handle_body !== null) {
                        try {
                            if (handle_arguments === null) {
                                return handle_body.call(this_argument);
                            } else {
                                if (typeof handle_arguments.length === "number" && typeof handle_arguments === "object") {
                                    return handle_body.apply(this_argument, handle_arguments);
                                } else {
                                    return handle_body.call(this_argument, handle_arguments);
                                }
                            }
                        } catch (e) {
                            logs.log(
                                "Initializer runFunction method catch error: \r\n" +
                                logs.parseError(e) + "\r\n Call point: " + call_point,
                                logs.types.WARNING
                            );
                            return null;
                        }
                    }
                    return null;
                },
                localStorage: {
                    get     : function (key, decode) {
                        var value   = null,
                            decode  = typeof decode === 'boolean' ? decode : false;
                        try {
                            value = window.localStorage.getItem(key);
                            if (typeof value !== "string") {
                                value = null;
                            }
                            if (decode !== false) {
                                value = system.convertor.BASE64.decode(value);
                                value = system.convertor.UTF8.  decode(value);
                            }
                            return value;
                        } catch (e) {
                            return null;
                        }
                    },
                    set     : function (key, value, encode) {
                        var result_value    = value,
                            encode          = typeof encode === 'boolean' ? encode : false;
                        try {
                            window.localStorage.removeItem(key);
                            if (encode !== false) {
                                result_value = system.convertor.UTF8.   encode(result_value);
                                result_value = system.convertor.BASE64. encode(result_value);
                            }
                            window.localStorage.setItem(key, result_value);
                            return true;
                        } catch (e) {
                            return false;
                        }
                    },
                    del     : function (key) {
                        try {
                            window.localStorage.removeItem(key);
                            return true;
                        } catch (e) {
                            return null;
                        }
                    },
                    getJSON : function (key) {
                        var storaged = system.localStorage.get(key, true);
                        if (storaged !== null) {
                            try{
                                storaged = JSON.parse(storaged);
                                return storaged;
                            } catch (e) {
                                return null;
                            }
                        }
                        return null;
                    },
                    setJSON : function (key, value) {
                        return system.localStorage.set(key, JSON.stringify(value), true);
                    }
                },
                resources : {
                    settings : {
                        RESOURCES_MARK_ATTR: { name: 'data-flex-connect-mark', value: 'dynamically' },
                        CSS_TIMER_PROPERTY : 'flex_css_load_event_timer',
                        CSS_TIMER_DURATION : 5000,
                    },
                    css: {
                        connect : function (url, onLoad, onError) {
                            function addLink(url) {
                                var settings    = system.resources.settings,
                                    link        = document.createElement("LINK");
                                link.type   = "text/css";
                                link.href   = url;
                                link.rel    = "stylesheet";
                                link.setAttribute(settings.RESOURCES_MARK_ATTR.name, settings.RESOURCES_MARK_ATTR.value);
                                return {
                                    link    : link,
                                    append  : function () { document.head.appendChild(link); }
                                };
                            };
                            function addLoadListener(link, url, onLoad) {
                                function resetTimer(link, setting) {
                                    clearTimeout(link[settings.CSS_TIMER_PROPERTY]);
                                    link[settings.CSS_TIMER_PROPERTY] = null;
                                    delete link[settings.CSS_TIMER_PROPERTY];
                                };
                                var settings = system.resources.settings;
                                //Not all browsers supports load event for CSS. That's why using <IMG> to emulate load event
                                link[settings.CSS_TIMER_PROPERTY] = setTimeout(
                                    function () {
                                        if (typeof link[settings.CSS_TIMER_PROPERTY] !== 'undefined') {
                                            var img = document.createElement("IMG");
                                            resetTimer(link, settings);
                                            events.DOM.add(
                                                img,
                                                ['load', 'error'],
                                                function (event) {
                                                    system.handle(onLoad, url, 'system.resources.css.connect', this);
                                                }
                                            );
                                            img.src = url;
                                        }
                                    },
                                    settings.CSS_TIMER_DURATION
                                );
                                events.DOM.add(
                                    link,
                                    'load',
                                    function (event) {
                                        if (typeof link[settings.CSS_TIMER_PROPERTY] !== 'undefined') {
                                            resetTimer(link, settings);
                                            system.handle(onLoad, url, 'system.resources.css.connect', this);
                                        }
                                    }
                                );
                            };
                            function isConnected(url) {
                                var sheets = document.styleSheets;
                                try{
                                    Array.prototype.forEach.call(
                                        document.styleSheets,
                                        function (sheet) {
                                            if (sheet.href.indexOf(url) !== -1) {
                                                throw 'found';
                                            }
                                        }
                                    );
                                } catch (e) {
                                    if (e === 'found') {
                                        return true;
                                    }
                                }
                                return false;
                            };
                            var link            = null,
                                onLoad          = onLoad || null,
                                onError         = onError || null,
                                url             = url || null,
                                onLoadContainer = null;
                            if (url !== null) {
                                if (isConnected(url) === false) {
                                    link = addLink(url);
                                    //Attach common handle for error
                                    events.DOM.add(
                                        link.link,
                                        'error',
                                        function (event) {
                                            logs.log(
                                                "During loading CSS resource [" + url + "] was error",
                                                logs.types.WARNING
                                            );
                                        }
                                    );
                                    if (onError !== null) {
                                        //Attach user error handle
                                        events.DOM.add(link.link, 'error', onError);
                                    }
                                    if (onLoad !== null) {
                                        addLoadListener(link.link, url, onLoad);
                                    } else {
                                        system.handle(onLoad, null, 'system.resources.css.connect', this);
                                    }
                                    link.append();
                                    return true;
                                }
                            }
                            return false;
                        },
                        adoption: function (cssText, documentLink) {
                            var documentLink    = (typeof documentLink === "object" ? (typeof documentLink.body !== "undefined" ? documentLink : document) : document),
                                style           = documentLink.createElement("style");
                            try {
                                style.type = "text/css";
                                if (style.styleSheet) {
                                    style.styleSheet.cssText = cssText;
                                } else {
                                    style.appendChild(documentLink.createTextNode(cssText));
                                }
                                documentLink.head.appendChild(style);
                                return style;
                            } catch (e) {
                                return null;
                            }
                        }
                    },
                    js: {
                        connect : function (url, onLoad, onError) {
                            function addScript(url) {
                                var settings    = system.resources.settings,
                                    script      = document.createElement("SCRIPT");
                                script.type = "application/javascript";
                                script.src  = url;
                                script.setAttribute(settings.RESOURCES_MARK_ATTR.name, settings.RESOURCES_MARK_ATTR.value);
                                return {
                                    script: script,
                                    append: function () { document.head.appendChild(script); }
                                };
                            };
                            var script  = null,
                                onLoad  = onLoad || null,
                                onError = onError || null,
                                url     = url || null;
                            if (url !== null) {
                                script = addScript(url);
                                if (onLoad !== null) {
                                    events.DOM.add(script.script, "load", onLoad);
                                }
                                if (onError !== null) {
                                    events.DOM.add(script.script, "error", onError);
                                }
                                script.append();
                                return script.script;
                            }
                            return false;
                        },
                        adoption: function (jsScript, onFinish) {
                            var resourceJS  = document.createElement("SCRIPT"),
                                onFinish    = onFinish || null,
                                jsScript    = jsScript || null;
                            if (jsScript !== null) {
                                resourceJS.type = "application/javascript";
                                resourceJS.appendChild(document.createTextNode(jsScript));
                                document.body.insertBefore(resourceJS, document.body.childNodes[0]);
                                if (onFinish !== null) {
                                    system.handle(onFinish, null, 'system.resources.js.adoption', this);
                                }
                            }
                        },
                    }
                },
                convertor: {
                    UTF8: {
                        encode: function (s) {
                            return unescape(encodeURIComponent(s));
                        },
                        decode: function (s) {
                            return decodeURIComponent(escape(s));
                        }
                    },
                    BASE64: {
                        decode: function (s) {
                            var e = {}, i, k, v = [], r = "", w = String.fromCharCode, z,
                                n = [[65, 91], [97, 123], [48, 58], [43, 44], [47, 48]],
                                b = 0, c, x, l = 0, o = 0, char, num;
                            for (z in n) { for (i = n[z][0]; i < n[z][1]; i++) { v.push(w(i)); } }
                            for (i = 0; i < 64; i++) { e[v[i]] = i; }
                            if (s.length < 100) {
                                var stop = true;
                            }
                            for (i = 0; i < s.length; i += 72) {
                                o = s.substring(i, i + 72);
                                for (x = 0; x < o.length; x++) {
                                    c = e[o.charAt(x)]; b = (b << 6) + c; l += 6;
                                    while (l >= 8) {
                                        char = w((b >>> (l -= 8)) % 256);
                                        num = char.charCodeAt(0);
                                        r = (num !== 0 ? r + char : r);
                                    }
                                }
                            }
                            return r;
                        },
                        encode: function (s) {
                            var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
                                o1, o2, o3, h1, h2, h3, h4, r, bits, i = 0,
                                ac = 0,
                                enc = "",
                                tmp_arr = [];
                            if (!s) {
                                return s;
                            }
                            do { // pack three octets into four hexets
                                o1 = s.charCodeAt(i++);
                                o2 = s.charCodeAt(i++);
                                o3 = s.charCodeAt(i++);
                                bits = o1 << 16 | o2 << 8 | o3;
                                h1 = bits >> 18 & 0x3f;
                                h2 = bits >> 12 & 0x3f;
                                h3 = bits >> 6 & 0x3f;
                                h4 = bits & 0x3f;
                                // use hexets to index into b64, and append result to encoded string
                                tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
                            } while (i < s.length);
                            enc = tmp_arr.join('');
                            r = s.length % 3;
                            return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
                        }
                    }
                },
            };
            IDs = {
                id: (function () {
                    var index = 0;
                    return function (prefix) {
                        index += 1;
                        return (prefix || '') + (new Date()).valueOf() + '_' + index;
                    };
                }()),
            };
            logs = {
                types : {
                    CRITICAL: 'critical',
                    LOGICAL : 'logical',
                    WARNING : 'warning'
                },
                parseError  : function (e) {
                    var message = e.name + ": " + e.message + "\r\n--------------------------------------------";
                    for (var property in e) {
                        if (property !== "name" && property !== "message") {
                            message = message + "\r\n  " + property + "=" + e[property];
                        }
                    }
                    return message;
                },
                log         : function (message, type) {
                    var type = type || '';
                    if (console) {
                        if (typeof console.log !== 'undefined') {
                            console.log(message);
                        }
                    }
                }
            };
            //Private part
            privates = {
                init    : config.init,
                oop     : oop,
                modules : {
                    attach : modules.attach.safely
                },
                unique  : IDs.id,
                events  : {
                    DOM     : events.DOM,
                    core    : events.core
                },
                overhead: {
                    globaly: {
                        set: overhead.globaly.set,
                        get: overhead.globaly.get,
                        del: overhead.globaly.remove
                    },
                    objecty: {
                        set: overhead.objecty.set,
                        get: overhead.objecty.get,
                        del: overhead.objecty.remove
                    },
                },
                ajax : {
                    send : ajax.create
                },
                logs: {
                    parseError  : logs.parseError,
                    log         : logs.log,
                    types       : logs.types
                },
                resources: {
                    parse   : {
                        css : parsing.css
                    },
                    attach  : {
                        css: {
                            connect : system.resources.css.connect,
                            adoption: system.resources.css.adoption,
                        }
                    }
                },
                system  : {
                    handle : system.handle
                },
                localStorage: {
                    add : system.localStorage.set,
                    get : system.localStorage.get,
                    del : system.localStorage.del
                }
            };
            //Settings of flex
            config.init();
            //Load registries
            registry.load();
            //Module events
            events.core.listen('modules.registry', 'ready', modules.attach.queue.proceed);
            //Public methods and properties
            return {
                init    : privates.init,
                oop     : privates.oop,
                modules : {
                    attach : privates.modules.attach
                },
                unique  : privates.unique,
                events  : {
                    DOM : privates.events.DOM,
                    core: privates.events.core,
                },
                overhead: {
                    globaly: {
                        set: privates.overhead.globaly.set,
                        get: privates.overhead.globaly.get,
                        del: privates.overhead.globaly.del
                    },
                    objecty: {
                        set: privates.overhead.objecty.set,
                        get: privates.overhead.objecty.get,
                        del: privates.overhead.objecty.del
                    },
                },
                ajax : {
                    send : privates.ajax.send
                },
                resources: {
                    parse   : {
                        css : privates.resources.parse.css
                    },
                    attach  : {
                        css : {
                            connect : privates.resources.attach.css.connect,
                            adoption: privates.resources.attach.css.adoption,
                        }
                    }
                },
                localStorage : {
                    add: privates.localStorage.add,
                    get: privates.localStorage.get,
                    del: privates.localStorage.del
                },
                system : {
                    handle : privates.system.handle
                },
                logs: {
                    parseError  : privates.logs.parseError,
                    log         : privates.logs.log,
                    types       : privates.logs.types
                }
            }
        }());
        //Core of flex is in global space
        window['flex'] = new Flex();
    }
}());