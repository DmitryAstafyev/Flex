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
            var select      = null,
                privates    = null,
                sizes       = null,
                scroll      = null,
                builder     = null,
                styles      = null,
                position    = null,
                settings    = null;
            settings    = {
                storage : {
                    GROUP   : 'flex.html',
                    SCROLL  : 'scroll'
                },
                classes : {
                    scroll: {
                        MINIMAL_WIDTH   : 15,
                        MINIMAL_HEIGHT  : 15
                    }
                }
            };
            select      = {
                bySelector  : function (){
                    var protofunction       = function () { };
                    protofunction.prototype = (function () {
                        var cache       = null,
                            privates    = null;
                        cache = {
                            data    : {},
                            get     : function (selector) {
                                var data = cache.data;
                                return (typeof data[selector] !== 'undefined' ? data[selector] : null);
                            },
                            add     : function (selector, nodes) {
                                var data = cache.data;
                                data[selector] = nodes;
                                return nodes;
                            },
                            remove  : function (selector) {
                                var data = cache.data;
                                data[selector] = null;
                                delete data[selector];
                            },
                            reset   : function () {
                                cache.data = {};
                            }
                        };
                        function first(selector, document_link) {
                            if (typeof selector === 'string') {
                                return (document_link || document).querySelector(selector);
                            }
                            return null;
                        };
                        function all(selector, document_link) {
                            if (typeof selector === 'string') {
                                return (document_link || document).querySelectorAll(selector);
                            }
                            return null;
                        };
                        function cachedFirst(selector, document_link) {
                            var nodes = null;
                            if (typeof selector === 'string') {
                                nodes = cache.get(selector);
                                if (nodes === null) {
                                    nodes = cache.add((document_link || document).querySelector(selector));
                                }
                                return nodes;
                            }
                            return null;
                        };
                        function cachedAll(selector, document_link) {
                            var nodes = null;
                            if (typeof selector === 'string') {
                                nodes = cache.get(selector);
                                if (nodes === null) {
                                    nodes = cache.add((document_link || document).querySelectorAll(selector));
                                }
                                return nodes;
                            }
                            return null;
                        };
                        privates = {
                            first       : first,
                            all         : all,
                            cachedFirst : cachedFirst,
                            cachedAll   : cachedAll,
                            cacheReset  : cache.reset,
                            cacheRemove : cache.remove
                        };
                        return {
                            first       : privates.first,
                            all         : privates.all,
                            cachedFirst : privates.cachedFirst,
                            cachedAll   : privates.cachedAll,
                            cacheReset  : privates.cacheReset,
                            cacheRemove : privates.cacheRemove
                        };
                    }());
                    return new protofunction();
                },
                fromParent  : function () {
                    var protofunction = function () {
                        this.selector = select.bySelector();
                    };
                    protofunction.prototype = {
                        selector    : null,
                        select      : function (parent, selector, only_first) {
                            var id      = flex.unique(),
                                nodes   = null,
                                id_attr = "data-" + id;
                            if (typeof parent.nodeName === "string") {
                                parent.setAttribute(id_attr, id);
                                nodes = this.selector[(only_first === false ? 'all' : 'first')](parent.nodeName + '[' + id_attr + '="' + id + '"] ' + selector);
                                parent.removeAttribute(id_attr);
                            }
                            return nodes;
                        },
                        first       : function (parent, selector) {
                            return this.select(parent, selector, true);
                        },
                        all         : function (parent, selector) {
                            return this.select(parent, selector, false);
                        }
                    };
                    return Object.freeze(new protofunction());
                },
            };
            sizes       = function () {
                var protofunction       = function () { };
                protofunction.prototype = {
                    nodeByClientRectSize    : function (node){
                        var height                  = 0,
                            width                   = 0,
                            bounding_client_rect    = null;
                        if (typeof node.getBoundingClientRect !== "undefined") {
                            bounding_client_rect    = node.getBoundingClientRect();
                            height                  = bounding_client_rect.bottom - bounding_client_rect.top;
                            width                   = bounding_client_rect.right - bounding_client_rect.left;
                        }
                        return { height: height, width: width }
                    },
                    nodeByOffset            : function (node) {
                        var height  = 0,
                            width   = 0;
                        if (typeof node.offsetHeight !== "undefined") {
                            height  = node.offsetHeight;
                            width   = node.offsetWidth;
                        }
                        return { height: height, Width: width }
                    },
                    nodeWithMargin          : function (node) {
                        var height      = 0,
                            width       = 0,
                            selector    = null,
                            size        = this.node(node),
                            top, bottom, right, left;
                        if (typeof node === 'string') {
                            selector    = select.bySelector();
                            node        = selector.first(node);
                            selector    = null;
                        }
                        if (node !== null) {
                            top     = parseInt(document.defaultView.getComputedStyle(node).marginTop,       10);
                            bottom  = parseInt(document.defaultView.getComputedStyle(node).marginBottom,    10);
                            right   = parseInt(document.defaultView.getComputedStyle(node).marginRight,     10);
                            left    = parseInt(document.defaultView.getComputedStyle(node).marginLeft,      10);
                            if (top     === null || top     === "") { top       = 0; } else { top       = parseInt(top,     10); }
                            if (bottom  === null || bottom  === "") { bottom    = 0; } else { bottom    = parseInt(bottom,  10); }
                            if (right   === null || right   === "") { right     = 0; } else { right     = parseInt(right,   10); }
                            if (left    === null || left    === "") { left      = 0; } else { left      = parseInt(left,    10); }
                        }
                        return {
                            height  : size.height + top + bottom,
                            width   : size.width + right + left
                        }
                    },
                    node                    : function (node) {
                        var height      = 0,
                            width       = 0,
                            selector    = null,
                            size        = { height : 0, width : 0 };
                        if (typeof node === 'string') {
                            selector    = select.bySelector();
                            node        = selector.first(node);
                            selector    = null;
                        }
                        if (node !== null) {
                            size = this.nodeByClientRectSize(node);
                            if (size.height === 0 && size.width === 0) {
                                size = this.nodeByOffset(node);
                            }
                        }
                        return size;
                    },
                    window                  : function () {
                        if (self.innerHeight) {
                            return {
                                height  : self.innerHeight,
                                width   : self.innerWidth
                            };
                        } else if (document.documentElement && document.documentElement.clientHeight) {
                            return {
                                height  : document.documentElement.clientHeight,
                                width   : document.documentElement.clientWidth
                            };
                        }
                        else if (document.body) {
                            return {
                                height  : document.body.clientHeight,
                                width   : document.body.clientWidth
                            };
                        }
                        return null;
                    },
                    image                   : function (image) {
                        function generateSize(image) {
                            var imageObj    = new Image(),
                                size        = null;
                            imageObj.src = image.src;
                            size = {
                                width   : imageObj.width,
                                height  : imageObj.height
                            };
                            imageObj = null;
                            return size;
                        };
                        if (typeof image !== 'undefined') {
                            if (typeof image.naturalWidth === 'number') {
                                return {
                                    width   : image.naturalWidth,
                                    height  : image.naturalHeight
                                }
                            } else {
                                return generateSize(image);
                            }
                        }
                        return null;
                    },
                };
                return new protofunction();
            };
            scroll      = function () {
                var protofunction       = function () { };
                protofunction.prototype = {
                    window          : function () {
                        var body = document.body,
                            html = document.documentElement;
                        return {
                            top     : function () {
                                return Math.max(
                                    body.scrollTop      || 0,
                                    html.scrollTop      || 0,
                                    body.pageYOffset    || 0,
                                    html.pageYOffset    || 0,
                                    window.pageYOffset  || 0
                                );
                            },
                            left    : function () {
                                return Math.max(
                                    body.scrollLeft     || 0,
                                    html.scrollLeft     || 0,
                                    body.pageXOffset    || 0,
                                    html.pageXOffset    || 0,
                                    window.pageXOffset  || 0
                                );
                            },
                            height  : function () {
                                return Math.max(
                                    body.scrollHeight || 0,
                                    body.offsetHeight || 0,
                                    html.clientHeight || 0,
                                    html.scrollHeight || 0,
                                    html.offsetHeight || 0
                                );
                            },
                            width   : function () {
                                return Math.max(
                                    body.scrollWidth || 0,
                                    body.offsetWidth || 0,
                                    html.clientWidth || 0,
                                    html.scrollWidth || 0,
                                    html.offsetWidth || 0
                                );
                            },
                        };
                    },
                    get             : function (object) {
                        if (object !== document.body && object !== document.documentElement) {
                            return {
                                top     : function () {
                                    return Math.max(
                                        object.scrollTop    || 0,
                                        object.pageYOffset  || 0
                                    );
                                },
                                left    : function () {
                                    return Math.max(
                                        object.scrollLeft   || 0,
                                        object.pageXOffset  || 0
                                    );
                                },
                                height  : function () {
                                    return Math.max(
                                        object.scrollHeight || 0,
                                        object.clientHeight || 0,
                                        object.offsetHeight || 0
                                    );
                                },
                                width   : function () {
                                    return Math.max(
                                        object.scrollWidth || 0,
                                        object.clientWidth || 0,
                                        object.offsetWidth || 0
                                    );
                                }
                            };
                        } else {
                            return this.window();
                        }

                    },
                    scrollBarSize   : function () {
                        function getSize() {
                            var node    = document.createElement("DIV"),
                                css     = styles(),
                                result  = null;
                            css.apply(
                                node,
                                {
                                    position    : 'absolute',
                                    top         : '-1000px',
                                    left        : '-1000px',
                                    width       : '300px',
                                    height      : '300px',
                                    overflow    : 'scroll',
                                    opacity     : '0.01',
                                }
                            );
                            document.body.appendChild(node);
                            result = {
                                width   : node.offsetWidth  - node.clientWidth,
                                height  : node.offsetHeight - node.clientHeight
                            };
                            result.probablyMobile   = (result.width     === 0 ? true : false);
                            result.width            = (result.width     === 0 ? settings.classes.scroll.MINIMAL_WIDTH   : result.width  );
                            result.height           = (result.height    === 0 ? settings.classes.scroll.MINIMAL_HEIGHT  : result.height );
                            document.body.removeChild(node);
                            return result;
                            /*
                            Здесь проблемное место. Дело в том, что на таблетках полоса проктутки накладывается на содержимое страницы.
                            Это приводит к тому, что метод определения ширины полосы путем вычетания из общего размера области размера 
                            содержимого не дает результатов, так как полоса прокрутки над содержимым и не "уменьшает" его. Но а найти
                            на момент написания этого комментрия сколь нибудь достойных решений по определению размера полосы прокрутки
                            на таблетках - не удалось. Поэтому и берется фиксированный размер в 15 пк. 
                            23.01.2014
                            */
                        };
                        var storaged = flex.overhead.globaly.get(settings.storage.GROUP, settings.storage.SCROLL, {});
                        if (!storaged.value) {
                            storaged.value = getSize();
                        }
                        return storaged.value;
                    }
                };
                return new protofunction();
            };
            builder     = function () {
                var protofunction = function () { };
                protofunction.prototype = {
                    build: function (attributes) {
                        function settingup(attributes, nodes) {
                            var parent = nodes[attributes.settingup.parent] || null;
                            if (typeof attributes.settingup === "object" && nodes !== null && parent !== null) {
                                Array.prototype.forEach.call(
                                    attributes.settingup.childs,
                                    function (child) {
                                        if (nodes[child]) {
                                            if (typeof attributes[child].settingup === "object") {
                                                parent.appendChild(nodes[child][attributes[child].settingup.parent]);
                                            } else {
                                                parent.appendChild(nodes[child]);
                                            }
                                        }
                                    }
                                );
                            }
                        };
                        function make(attribute) {
                            var node = document.createElement(attribute.node);
                            if (attribute.html !== null) {
                                node.innerHTML = attribute.html;
                            }
                            Array.prototype.forEach.call(
                                attribute.attrs,
                                function (attr) {
                                    if (flex.oop.objects.validate(attr, [   { name: "name",     type: "string" },
                                                                            { name: "value",    type: "string" }]) === true) {
                                        node.setAttribute(attr.name, attr.value);
                                    }
                                }
                            );
                            return node;
                        };
                        function validate(property) {
                            return flex.oop.objects.validate(property, [{ name: "node",     type: "string"              },
                                                                        { name: "attrs",    type: "array",  value: []   },
                                                                        { name: "html",     type: "string", value: null }]);
                        };
                        var nodes = {};
                        try {
                            if (validate(attributes) === true) {
                                return make(attributes);
                            } else {
                                for (var property in attributes) {
                                    if (validate(attributes[property]) === true) {
                                        nodes[property] = make(attributes[property]);
                                    } else {
                                        if (typeof attributes[property] === "object" && property !== "settingup") {
                                            nodes[property] = this.build(attributes[property]);
                                            if (nodes[property] === null) {
                                                return null;
                                            }
                                        }
                                    }
                                }
                                settingup(attributes, nodes);
                            }
                        } catch (e) {
                            return null;
                        }
                        return nodes;
                    }
                };
                return new protofunction();
            };
            styles      = function () {
                var protofunction = function () { };
                protofunction.prototype = {
                    apply   : function (node, styles) {
                        if (node && typeof styles === 'object') {
                            if (node.style) {
                                for (var property in styles) {
                                    node.style[property] = styles[property];
                                }
                                return true;
                            }
                        }
                        return false;
                    },
                    redraw  : function(node){
                        if (node){
                            if (typeof node.style !== 'undefined'){
                                node.style.display = 'none';
                                node.style.display = '';
                                return true;
                            }
                        }
                        return false;
                    }
                };
                return new protofunction();
            };
            position    = function () {
                var protofunction = function () { };
                protofunction.prototype = (function () {
                    var tools       = null,
                        byPage      = null,
                        byWindow    = null,
                        privates    = null;
                    position = {
                        old     : function (node) {
                            var top     = 0,
                                left    = 0;
                            while (node) {
                                if (typeof node.offsetTop !== "undefined" && typeof node.offsetLeft !== "undefined") {
                                    top     += parseFloat(node.offsetTop    );
                                    left    += parseFloat(node.offsetLeft   );
                                }
                                node = node.offsetParent;
                            }
                            return {
                                top : top,
                                left: left
                            };
                        },
                        modern  : function (node) {
                            var box                 = null,
                                objBody             = null,
                                objDocumentElement  = null,
                                scrollTop           = null,
                                scrollLeft          = null,
                                clientTop           = null,
                                clientLeft          = null;
                            box                 = node.getBoundingClientRect();
                            objBody             = document.body;
                            objDocumentElement  = document.documentElement;
                            scrollTop           = window.pageYOffset || objDocumentElement.scrollTop || objBody.scrollTop;
                            scrollLeft          = window.pageXOffset || objDocumentElement.scrollLeft || objBody.scrollLeft;
                            clientTop           = objDocumentElement.clientTop || objBody.clientTop || 0;
                            clientLeft          = objDocumentElement.clientLeft || objBody.clientLeft || 0;
                            return {
                                top : box.top + scrollTop - clientTop,
                                left: box.left + scrollLeft - clientLeft
                            };
                        }
                    };
                    byPage      = function (node) {
                        var top             = null,
                            left            = null,
                            box             = null,
                            offset          = null,
                            scrollTop       = null,
                            scrollLeft      = null;
                        try {
                            box     = node.getBoundingClientRect();
                            top     = box.top;
                            left    = box.left;
                        } catch (e) {
                            offset          = position.old(node);
                            scrollTop       = window.pageYOffset || objDocumentElement.scrollTop || objBody.scrollTop;
                            scrollLeft      = window.pageXOffset || objDocumentElement.scrollLeft || objBody.scrollLeft;
                            top             = offset.top - scrollTop;
                            left            = offset.left - scrollLeft;
                        } finally {
                            return {
                                top : top,
                                left: left
                            };
                        }
                    };
                    byWindow    = function (node) {
                        var result = null;
                        try {
                            result = position.modern(node);
                        } catch (e) {
                            result = position.old(node);
                        } finally {
                            return result;
                        }
                    };
                    privates    = {
                        byPage      : byPage,
                        byWindow    : byWindow
                    };
                    return {
                        byPage  : privates.byPage,
                        byWindow: privates.byWindow,
                    }
                }());
                return new protofunction();
            };
            privates    = {
                select  : {
                    bySelector  : select.bySelector,
                    fromParent  : select.fromParent
                },
                size    : sizes,
                scroll  : scroll,
                builder : builder,
                styles  : styles,
                position: position
            };
            return {
                select      : {
                    bySelector: privates.select.bySelector,
                    fromParent: privates.select.fromParent
                },
                size        : privates.size,
                scroll      : privates.scroll,
                builder     : privates.builder,
                styles      : styles,
                position    : privates.position
            };
        };
        flex.modules.attach({
            name            : 'html',
            protofunction   : protofunction,
        });
    }
}());