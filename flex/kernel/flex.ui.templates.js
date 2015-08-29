﻿// LICENSE
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
            var //Get modules
                html        = flex.libraries.html.create(),
                //Variables
                privates    = null,
                settings    = null,
                transport   = null,
                layout      = null,
                resources   = null,
                storage     = null,
                template    = null;
            settings    = {
                regs            : {
                    BODY            : /<body>(\n|\r|\s|.)*?<\/body>/gi,
                    BODY_TAG        : /<\s*body\s*>|<\s*\/\s*body\s*>/gi,
                    BODY_CLEAR      : /^[\n\r\s]*|[\n\r\s]*$/gi,
                    CSS             : /<link\s+.*?\/>/gi,
                    CSS_HREF        : /href\s*\=\s*"(.*?)"|href\s*\=\s*'(.*?)'/gi,
                    CSS_REL         : /rel\s*=\s*"stylesheet"|rel\s*=\s*'stylesheet'/gi,
                    CSS_TYPE        : /type\s*=\s*"text\/css"|type\s*=\s*'text\/css'/gi,
                    STRING          : /"(.*?)"|'(.*?)'/gi,
                    STRING_BORDERS  : /"|'/gi,
                    HOOK            : /\[@\].*?\[\/@\]/gi,
                    HOOK_OPEN       : '\\[@\\]',
                    HOOK_CLOSE      : '\\[\\/@\\]',
                },
                storage         : {
                    USE_LOCALSTORAGE        : true,
                    VIRTUAL_STORAGE_GROUP   : 'FLEX_UI_TEMPLATES_GROUP',
                    VIRTUAL_STORAGE_ID      : 'FLEX_UI_TEMPLATES_STORAGE',
                    CSS_ATTACHED_JOURNAL    : 'FLEX_UI_TEMPLATES_CSS_JOURNAL',
                    PRELOAD_TRACKER         : 'FLEX_UI_TEMPLATES_PRELOAD_TRACKER',
                },
                tags   : {
                    FLEX_TEMPLATE       : 'flex-template',
                    FLEX_TEMPLATE_MARK  : 'flex-template-mark',
                }
            };
            transport = {
                preload: {
                    /// <summary>
                    /// Tracker is submodule for preload several templates by one time
                    /// </summary>
                    tracker: {
                        create      : function (template_urls) {
                            var id      = flex.unique(),
                                storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.PRELOAD_TRACKER, {});
                            storage[id] = {};
                            Array.prototype.forEach.call(
                                template_urls,
                                function (template_url) {
                                    if (!storage[id][template_url]) {
                                        storage[id][template_url] = {
                                            url     : template_url,
                                            status  : false
                                        };
                                    }
                                }
                            );
                            return id;
                        },
                        start       : function (template_urls, tracker_id, callbacks) {
                            Array.prototype.forEach.call(
                                template_urls,
                                function (template_url) {
                                    transport.send({
                                        url         : template_url,
                                        callbacks   : {
                                            success : function (url, template) {
                                                transport.preload.tracker.success(url, template, template_url, tracker_id, callbacks);
                                            },
                                            fail    : function (url, template) {
                                                transport.preload.tracker.fail(url, template, template_url, tracker_id, callbacks);
                                            },
                                        }
                                    });
                                }
                            );

                        },
                        success     : function (url, template, track_url, tracker_id, callbacks) {
                            var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.PRELOAD_TRACKER, {});
                            if (storage[tracker_id]) {
                                storage[tracker_id][track_url].status = 'success';
                                transport.preload.tracker.tryFinish(tracker_id, callbacks);
                            }
                        },
                        fail        : function (url, template, track_url, tracker_id, callbacks) {
                            var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.PRELOAD_TRACKER, {});
                            if (storage[tracker_id]) {
                                storage[tracker_id][track_url].status = 'fail';
                                transport.preload.tracker.tryFinish(tracker_id, callbacks);
                            }
                        },
                        tryFinish   : function (tracker_id, callbacks) {
                            function callback(callback, success, fail) {
                                if (typeof callback === 'function') {
                                    flex.system.handle(
                                        callback,
                                        [
                                            success,
                                            fail
                                        ],
                                        'flex.ui.templates:: templates preload',
                                        this
                                    );
                                }
                            };
                            var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.PRELOAD_TRACKER, {}),
                                success = [],
                                fail    = [];
                            if (storage[tracker_id]) {
                                for (var key in storage[tracker_id]) {
                                    switch (storage[tracker_id][key].status) {
                                        case 'success':
                                            success.push(storage[tracker_id].url);
                                            break;
                                        case 'fail':
                                            fail.push(storage[tracker_id].url);
                                            break;
                                        case false:
                                            return false;
                                            break;
                                    }
                                }
                                //Clear storage
                                storage[tracker_id] = null;
                                delete storage[tracker_id];
                                //Call main callback
                                if (fail.length === 0) {
                                    callback(callbacks.success, success, fail);
                                } else {
                                    callback(callbacks.fail, success, fail);
                                }
                            }
                        }
                    },
                    preload: function (template_urls, callbacks) {
                        /// <summary>
                        /// Preload template and save it in virtual storage and local storage (if it's allowed)
                        /// </summary>
                        /// <param name="template_urls" type="string || array"  >URL or URLs of template(s), which should be loaded</param>
                        /// <param name="callbacks"     type="object"           >Collection of callbacks: before, success, fail</param>
                        /// <returns                    type="boolean"          >true - success; false - fail</returns>
                        var tracker_id = null;
                        if (typeof template_urls === 'string') {
                            template_urls = [template_urls];
                        }
                        if (template_urls instanceof Array) {
                            tracker_id = transport.preload.tracker.create(template_urls);
                            transport.preload.tracker.start(template_urls, tracker_id, callbacks);
                            return true;
                        }
                        return false;
                    },
                },
                send        : function (parameters) {
                    /// <summary>
                    /// Load template; save it in virtual storage and local storage (if it's allowed)
                    /// </summary>
                    /// <param name="parameters" type="Object">Template parameters: &#13;&#10;
                    /// {   [string]            url                     (source of template),                                               &#13;&#10;
                    ///     [string || node]    node                    (target node for mount),                                            &#13;&#10;
                    ///     [boolean]           replace                 (true - replace node by template; false - append template to node), &#13;&#10;
                    ///     [object]            hooks                   (bind data),                                                        &#13;&#10;
                    ///     [object]            callbacks               (callbacks),                                                        &#13;&#10;
                    ///     [boolean]           remove_missing_hooks    (remove missed bind data),                                          &#13;&#10;
                    /// }</param>
                    /// <returns type="boolean">true - success; false - fail</returns>
                    var ajax                    = null,
                        storaged                = null;
                    if (flex.oop.objects.validate(parameters, [ { name: 'url',                  type: 'string'                              },
                                                                { name: 'node',                 type: ['node', 'string'],   value: null     },
                                                                { name: 'replace',              type: 'boolean',            value: false    },
                                                                { name: 'hooks',                type: ['object', 'array'],  value: null     },
                                                                { name: 'callbacks',            type: 'object',             value: {}       },
                                                                { name: 'remove_missing_hooks', type: 'boolean',            value: true }]) !== false) {
                        flex.oop.objects.validate(parameters.callbacks, [   { name: 'before',   type: 'function', value: null },
                                                                            { name: 'success',  type: 'function', value: null },
                                                                            { name: 'fail',     type: 'function', value: null }]);

                        parameters.node = transport.node(parameters.node);
                        storaged        = storage.virtual.get(parameters.url);
                        if (storaged === null) {
                            storaged = storage.local.get(parameters.url);
                        }
                        if (storaged === null) {
                            ajax = flex.ajax.send(
                                null,
                                parameters.url,
                                'get',
                                null,
                                {
                                    success : function (response, request) {
                                        transport.success(response, request, parameters);
                                    },
                                    fail    : function (response, request) {
                                        transport.fail(request, parameters);
                                    },
                                },
                                null
                            );
                            ajax.send();
                            return true;
                        } else {
                            return transport.success(storaged, null, parameters);
                        }
                    }
                    return null;
                },
                success     : function (response, request, parameters) {
                    if (request === null) {
                        //Data have gotten from storage
                        return template.apply(response, parameters, false);
                    } else {
                        //Data have gotten from server
                        template.apply(response.original, parameters, true);
                    }
                },
                fail        : function (request, parameters) {
                    transport.callback(parameters.callbacks.fail);
                },
                callback    : function (callback, template_url, template) {
                    /// <summary>
                    /// Calls callback with same parameters for all events
                    /// </summary>
                    /// <param name="callback"      type="function || null" >function of callback or null (in this case will nothing)</param>
                    /// <param name="template_url"  type="string"           >URL of template, which is owner of callback</param>
                    /// <param name="template"      type="node || null"     >collection of nodes (build template)</param>
                    /// <returns                    type="void"             >void</returns>
                    if (callback !== null) {
                        flex.system.handle(
                            callback,
                            [
                                template_url,
                                template || null
                            ],
                            'flex.ui.templates:: template [' + template_url + ']',
                            this
                        );
                    }
                },
                node        : function (node) {
                    var selector = null;
                    if (node) {
                        if (typeof node.parentNode !== 'undefined') {
                            node = [node];
                        }
                        if (typeof node === 'string') {
                            selector    = new html.select.bySelector();
                            node        = selector.all(node);
                        }
                        if (node !== null) {
                            if (node.length > 0) {
                                return node;
                            }
                        }
                    }
                    return null;
                }
            };
            template    = {
                apply       : function (html, parameters, save) {
                    var data = {};
                    data = {
                        original: html,
                        body    : template.get.body(html),
                        css     : template.get.css(html),
                        template: null
                    };
                    if (data.body !== null) {
                        if (save !== false) {
                            //Save data into virtual
                            storage.virtual.add(parameters.url, html);
                            //Save data into local
                            storage.local.add(parameters.url, html);
                        }
                        //Call callback
                        transport.callback(parameters.callbacks.before);
                        //Insert content into template
                        data.body = template.set.content(data.body, parameters.hooks, parameters.remove_missing_hooks);
                        //Build template with content
                        data.template = template.build(data.body);
                        //Load css
                        resources.css.load(data.css);
                        //Mount node(s)
                        template.mount(data.template, parameters.node, parameters.replace);
                        //Call callback
                        transport.callback(parameters.callbacks.success, data.template);
                        return data.template;
                    }
                    return false;
                },
                build       : function (html){
                    var container = document.createElement('div');
                    try{
                        container.innerHTML = html;
                    } catch (e) {
                    } finally {
                        return (container.childNodes ? container.childNodes : null);
                    }
                },
                mount       : function (templates, nodes, replace) {
                    if (nodes !== null) {
                        Array.prototype.forEach.call(
                            nodes,
                            function (parent) {
                                Array.prototype.forEach.call(
                                    templates,
                                    function (template) {
                                        if (replace === false) {
                                            parent.appendChild(template);
                                        } else {
                                            parent.parentNode.insertBefore(template, parent);
                                            parent.parentNode.removeChild(parent);
                                        }
                                    }
                                );
                            }
                        );
                    }
                },
                get         : {
                    body: function (html) {
                        var regs = settings.regs,
                            body = html.match(regs.BODY);
                        if (body !== null) {
                            if (body.length === 1) {
                                return body[0].replace(regs.BODY_TAG, '');
                            }
                        }
                        return null;
                    },
                    css : function (html) {
                        var regs = settings.regs,
                            links = html.match(regs.CSS),
                            css     = []
                        if (links !== null) {
                            Array.prototype.forEach.call(
                                links,
                                function (link) {
                                    function validate(link) {
                                        var rel     = link.search(regs.CSS_REL),
                                            type    = link.search(regs.CSS_TYPE);
                                        if (rel > 0 && type > 0) {
                                            return true;
                                        }
                                        return false;
                                    };
                                    var href = link.match(regs.CSS_HREF),
                                        str  = null;
                                    if (validate(link) !== false && href !== null) {
                                        if (href.length === 1) {
                                            str = href[0].match(regs.STRING);
                                            if (str !== null) {
                                                if (str.length === 1) {
                                                    css.push(str[0].replace(regs.STRING_BORDERS, ''));
                                                }
                                            }
                                        }
                                    }
                                }
                            );
                        }
                        return css;
                    }
                },
                set: {
                    content : function (body, hooks, remove_missing_hooks) {
                        function isNode(something){
                            if (something.nodeName && something.parentNode && something.childNodes){
                                return true;
                            }else{
                                return false;
                            }
                        };
                        function getString(something) {
                            function getValue(something) {
                                var value = '';
                                if (something.length && typeof something !== 'string') {
                                    Array.prototype.forEach.call(
                                        something,
                                        function (_something) {
                                            value += getString(_something);
                                        }
                                    );
                                } else {
                                    value = something;
                                    if (isNode(value) === true) {
                                        value = (function (something) {
                                            var wrapper = document.createElement('div');
                                            wrapper.appendChild(something.cloneNode(true));
                                            return wrapper.innerHTML;
                                        }(value));
                                    }
                                    if (typeof value.toString === 'function') {
                                        value = value.toString();
                                    } else {
                                        value = (typeof value === 'string' ? value : '');
                                    }
                                }
                                return value;
                            };
                            if (typeof something === 'function') {
                                something = something();
                            }
                            something = getValue(something);
                            return something;
                        };
                        var regs    = settings.regs,
                            current = null,
                            _body   = body,
                            result  = '';
                        if (hooks instanceof Array) {
                            Array.prototype.forEach.call(
                                hooks,
                                function (hook) {
                                    result += template.set.content(body, hook, remove_missing_hooks);
                                }
                            );
                            return result;
                        } else {
                            if (typeof hooks === 'object') {
                                for (var key in hooks) {
                                    current = new RegExp(regs.HOOK_OPEN + key + regs.HOOK_CLOSE, 'gi');
                                    _body = _body.replace(current, getString(hooks[key]));
                                }
                                if (remove_missing_hooks !== false) {
                                    _body = _body.replace(regs.HOOK, '');
                                }
                            }
                        }
                        return _body.replace(regs.BODY_CLEAR, '');
                    }
                }
            };
            resources   = {
                css: {
                    load    : function (hrefs) {
                        var journal = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.CSS_ATTACHED_JOURNAL, {});
                        Array.prototype.forEach.call(
                            hrefs,
                            function (href) {
                                var storaged = null;
                                if (!journal[href]) {
                                    //Add into journal
                                    journal[href] = true;
                                    //Check virtual storage
                                    storaged = storage.virtual.get(href);
                                    if (storaged === null) {
                                        //Check local storage
                                        storaged = storage.local.get(href);
                                    }
                                    if (storaged === null) {
                                        //Load css from server
                                        flex.resources.attach.css.connect(href, resources.css.onLoad);
                                    } else {
                                        //Load css from storage
                                        flex.resources.attach.css.adoption(storaged);
                                    }
                                }
                            }
                        );
                    },
                    onLoad  : function (href) {
                        var cssText = flex.resources.parse.css.stringify(href);
                        if (cssText !== null) {
                            //Save into virtual storage
                            storage.virtual.add(href, cssText);
                            //Save into local storage
                            storage.local.add(href, cssText);
                        }
                    }
                }
            };
            layout = {
                find    : function (callbacks) {
                    function setIDs(templates) {
                        Array.prototype.forEach.call(
                            templates,
                            function (template) {
                                template.template_id = flex.unique();
                            }
                        );
                    };
                    var selector    = new html.select.bySelector(),
                        templates   = selector.all(settings.tags.FLEX_TEMPLATE),
                        callbacks   = callbacks || {};
                    if (templates !== null) {
                        if (templates.length > 0) {
                            flex.oop.objects.validate(callbacks, [  { name: 'success',  type: 'function', value: null },
                                                                    { name: 'fail',     type: 'function', value: null }]);
                            setIDs(templates);
                            layout.apply(templates, callbacks);
                            return true;
                        }
                    }
                    return false;
                },
                apply   : function (templates, callbacks) {
                    function getSrc(template) {
                        var src = null;
                        if (template.getAttribute) {
                            src = template.getAttribute('src');
                            if (src !== null && src !== '') {
                                return src;
                            }
                        }
                        return null;
                    };
                    function addSrc(src, srcs) {
                        if (src !== null) {
                            if (srcs.indexOf(src) === -1) {
                                srcs.push(src);
                            }
                        }
                    };
                    function getBinds(template, srcs) {
                        var src     = getSrc(template),
                            binds   = {};
                        if (src !== null) {
                            addSrc(src, srcs);
                            binds.src = src;
                            if (template.childNodes) {
                                Array.prototype.forEach.call(
                                    template.childNodes,
                                    function (parameter) {
                                        var nodeName = null;
                                        if (parameter.nodeName) {
                                            nodeName = parameter.nodeName.toLowerCase();
                                            if (['text', '#text'].indexOf(nodeName) === -1) {
                                                if (!binds[nodeName]) {
                                                    binds[nodeName] = parameter.innerHTML;
                                                }
                                            }
                                        }
                                    }
                                );
                            }
                            return binds;
                        }
                        return null;
                    };
                    function createMark(template) {
                        var mark        = document.createElement(settings.tags.FLEX_TEMPLATE_MARK);
                        mark.innerHTML  = template.template_id;
                        template.parentNode.insertBefore(mark, template);
                    };
                    function finalize(parsed, id) {
                        function getID(str) {
                            return str.replace(new RegExp('<' + settings.tags.FLEX_TEMPLATE_MARK + '>|</' + settings.tags.FLEX_TEMPLATE_MARK + '>', 'gi'), '');
                        };
                        var included    = null,
                            str         = '',
                            reg         = new RegExp('<' + settings.tags.FLEX_TEMPLATE_MARK + '>.*?</' + settings.tags.FLEX_TEMPLATE_MARK + '>', 'gi'),
                            separator   = flex.unique();
                        for (var key in parsed[id]) {
                            str         = parsed[id][key];
                            included    = str.match(reg);
                            if (included !== null) {
                                if (included.length) {
                                    str             = (' ' + str + ' ').replace(reg, separator);
                                    parsed[id][key] = [];
                                    Array.prototype.forEach.call(
                                        str.split(separator),
                                        function (part, index) {
                                            parsed[id][key].push(part);
                                            if (included[index]) {
                                                parsed[id][key].push(flex.oop.objects.copy(parsed[getID(included[index])]));
                                            }
                                        }
                                    );
                                }
                            }
                        }
                    };
                    var is_ready    = true,
                        srcs        = [],
                        selector    = new html.select.fromParent(),
                        parsed      = {};
                    do {
                        is_ready = true;
                        Array.prototype.forEach.call(
                            templates,
                            function (template) {
                                var childs = selector.all(template, settings.tags.FLEX_TEMPLATE);
                                if (childs !== null) {
                                    if (childs.length === 0) {
                                        parsed[template.template_id]    = getBinds(template, srcs);
                                        template.flexTemplateParsed     = true;
                                        createMark(template);
                                    } else {
                                        is_ready = false;
                                    }
                                }
                            }
                        );
                        templates = Array.prototype.filter.call(
                            templates,
                            function (template) {
                                if (template.flexTemplateParsed) {
                                    finalize(parsed, template.template_id);
                                    template.parentNode.removeChild(template);
                                    return false;
                                } else {
                                    return true;
                                }
                            }
                        );
                    } while (is_ready === false);
                    layout.append(parsed, srcs, callbacks);
                },
                append  : function (parsed, srcs, callbacks) {
                    function getCall(hooks, parent) {
                        return function () {
                            return transport.send({
                                url         : hooks.src,
                                node        : parent,
                                replace     : true,
                                hooks       : getHooks(hooks),
                                callbacks   : {
                                    fail    : callbacks.fail
                                }
                            });
                        }
                    };
                    function getHooks(hooks) {
                        var result = {};
                        for (var key in hooks) {
                            if (typeof hooks[key] !== 'string') {
                                if (hooks[key] instanceof Array) {
                                    result[key] = [];
                                    Array.prototype.forEach.call(
                                        hooks[key],
                                        function (value) {
                                            if (typeof value !== 'string') {
                                                if (typeof value === 'object') {
                                                    result[key].push(getCall(value, null));
                                                }
                                            } else {
                                                result[key].push(value);
                                            }
                                        }
                                    );
                                } else if (typeof hooks[key] === 'object') {
                                    result[key] = getCall(value, null);
                                }
                            } else {
                                result[key] = hooks[key];
                            }
                        }
                        return result;
                    };
                    var selector    = new html.select.bySelector(),
                        marks       = selector.all(settings.tags.FLEX_TEMPLATE_MARK),
                        handles     = [];
                    if (marks !== null) {
                        if (marks.length > 0) {
                            Array.prototype.forEach.call(
                                marks,
                                function (mark) {
                                    var id = mark.innerHTML;
                                    if (parsed[id]) {
                                        handles.push(getCall(parsed[id], mark));
                                    }
                                }
                            );
                            transport.preload.preload(
                                srcs,
                                {
                                    success : function () {
                                        Array.prototype.forEach.call(
                                            handles,
                                            function (handle) {
                                                handle();
                                            }
                                        );
                                        transport.callback(callbacks.success, null, null);
                                    },
                                    fail    : callbacks.fail
                                }
                            );
                        }
                    }
                }
            };
            storage     = {
                virtual : {
                    add     : function (key, value) {
                        var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.VIRTUAL_STORAGE_ID, {});
                        if (storage !== null) {
                            if (typeof storage[key] === 'undefined') {
                                storage[key] = value;
                                return true;
                            }
                        }
                    },
                    get     : function (key) {
                        var storage = flex.overhead.globaly.get(settings.storage.VIRTUAL_STORAGE_GROUP, settings.storage.VIRTUAL_STORAGE_ID, {});
                        if (storage !== null) {
                            return (typeof storage[key] !== 'undefined' ? storage[key] : null);
                        }
                        return null;
                    }
                },
                local   : {
                    add: function (key, value) {
                        if (settings.storage.USE_LOCALSTORAGE === true){
                            return flex.localStorage.add(key, value, true);
                        }
                        return false;
                    },
                    get: function (key) {
                        if (settings.storage.USE_LOCALSTORAGE === true){
                            return flex.localStorage.get(key, true);
                        }
                        return false;
                    }
                }
            };
            privates    = {
                render  : transport.send,
                preload : transport.preload.preload,
                layout  : layout.find
            };
            return {
                render  : privates.render,
                preload : privates.preload,
                layout  : privates.layout
            };
        };
        flex.modules.attach({
            name            : 'ui.templates',
            protofunction   : protofunction,
            reference       : function () {
                flex.libraries.html();
            }
        });
    }
}());