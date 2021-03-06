(function () {
    window['flex'] = {
        /// <field type = 'object'></field>
        oop: {
            /// <field type = 'object'></field>
            objects: {
                copy        : function (source, target) {
                    /// <signature>
                    ///     <summary>Copy object</summary>
                    ///     <param name="source" type="object">Object - source</param>
                    ///     <returns type="object">object</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Copy object</summary>
                    ///     <param name="source" type="object">Object - source</param>
                    ///     <param name="target" type="object">Object - target</param>
                    ///     <returns type="object">object</returns>
                    /// </signature>
                },
                extend      : function (sources, target, exclusion) {
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
                },
                forEach     : function (object, callback) {
                    /// <summary>
                    /// Apply callback function to each enumerable property of object. 
                    /// </summary>
                    /// <param name="object" type="Object">Object</param>
                    /// <param name="function" type="Object">Callback function(property_name, object)</param>
                    /// <returns type="String">Name of class</returns>
                },
                validate    : function (object, properties) {
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
                    ///         [function]          handle      (value = handle(value))             &#13;&#10;
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
                },
                isValueIn   : function (target, value, deep) {
                    /// <signature>
                    ///     <summary>Search defined value in object</summary>
                    ///     <param name="source"    type="object"   >Object</param>
                    ///     <param name="value"     type="any"      >Searching value</param>
                    ///     <returns type="boolean">true - value is found; false - value isn't found</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Search defined value in object</summary>
                    ///     <param name="source"    type="object"   >Object</param>
                    ///     <param name="value"     type="any"      >Searching value</param>
                    ///     <param name="deep"      type="boolean"  >True - search in nested objects</param>
                    ///     <returns type="boolean">true - value is found; false - value isn't found</returns>
                    /// </signature>
                },
            },
            /// <field type = 'object'></field>
            classes: {
                of          : function (object) {
                    /// <summary>Returns class's name of object.</summary>
                    /// <param name="object" type="Object">Object</param>
                    /// <returns type="String">Name of class</returns>
                },
                create      : function (parameters) {
                    ///     <summary>
                    ///         Create instance of class with closed variables
                    ///     </summary>
                    ///     <param name="parameters"    type="object">Parameters of class:  &#13;&#10;
                    ///     {   [function]              constr,                             &#13;&#10;
                    ///         [object]                privates,                           &#13;&#10;
                    ///         [function || object]    prototype                           &#13;&#10;
                    ///     }</param>
                    ///     <returns type="object">Instance of class</returns>
                }
            },
            /// <field type = 'object'></field>
            namespace: {
                create      : function (namespace, root) {
                    /// <signature>
                    ///     <summary>Create namespace from root.</summary>
                    ///     <param name="namespace" type="String">Namespace, like: root.child.sub</param>
                    ///     <returns type="Object" value="{ target: root, parent: parent }" mayBeNull="true">Namespace data</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Create namespace from root.</summary>
                    ///     <param name="namespace" type="String">Namespace, like: root.child.sub</param>
                    ///     <param name="root"      type="Object">[optional] Root object. Default - window</param>
                    ///     <returns type="Object" value="{ target: root, parent: parent }" mayBeNull="true">Namespace data</returns>
                    /// </signature>
                },
                get         : function (namespace, root) {
                    /// <signature>
                    ///     <summary>Get last child in namespace.</summary>
                    ///     <param name="namespace" type="String">Namespace, like: root.child.sub</param>
                    ///     <returns type="Object" mayBeNull="true">Last child of namespace</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Get last child in namespace.</summary>
                    ///     <param name="namespace" type="String">Namespace, like: root.child.sub</param>
                    ///     <param name="root"      type="Object">[optional] Root object. Default - window</param>
                    ///     <returns type="Object" mayBeNull="true">Last child of namespace</returns>
                    /// </signature>
                },
            }
        },
        /// <field type = 'object'></field>
        modules: {
            attach: function (parameters) {
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
            }
        },
        /// <field type = 'object'></field>
        unique: function (prefix) {
            /// <signature>
            ///     <summary>Return unique (in current session) ID.</summary>
            ///     <returns type="String">ID</returns>
            /// </signature>
            /// <signature>
            ///     <summary>Return unique (in current session) ID.</summary>
            ///     <param name="prefix" type="String">Prefix</param>
            ///     <returns type="String">ID</returns>
            /// </signature>
        },
        /// <field type = 'object'></field>
        events: {
            /// <field type = 'object'></field>
            DOM: {
                add     : function (element, eventName, handle) {
                    /// <summary>Add DOM's events listener </summary>
                    /// <param name="element"   type="node"     >Node</param>
                    /// <param name="eventName" type="string"   >Name of event</param>
                    /// <param name="handle"    type="function" >Handle</param>
                    /// <returns type="void">void</returns>
                },
                remove  : function (element, eventName, handle) {
                    /// <summary>Remove DOM's events listener</summary>
                    /// <param name="element"   type="node"     >Node</param>
                    /// <param name="eventName" type="string"   >Name of event</param>
                    /// <param name="handle"    type="function" >Handle</param>
                    /// <returns type="void">void</returns>
                },
            },
            /// <field type = 'object'></field>
            core: {
                fire    : function (group, name, params) {
                    /// <signature>
                    ///     <summary>Call handles of registered core's event</summary>
                    ///     <param name="group"     type="string"   >Name of event group</param>
                    ///     <param name="name"      type="string"   >Name of event</param>
                    ///     <returns type="void">void</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Call handles of registered core's event</summary>
                    ///     <param name="group"     type="string"   >Name of event group</param>
                    ///     <param name="name"      type="string"   >Name of event</param>
                    ///     <param name="params"    type="any"      >Parameters for all called handles</param>
                    ///     <returns type="void">void</returns>
                    /// </signature>
                },
                listen  : function (group, name, handle, id, registered_only) {
                    /// <signature>
                    ///     <summary>Add core's events listener </summary>
                    ///     <param name="group"             type="string"   >Name of event group</param>
                    ///     <param name="name"              type="string"   >Name of event</param>
                    ///     <param name="handle"            type="function" >Handle</param>
                    ///     <param name="id"                type="string"   >[optional][unique ID] ID of event</param>
                    ///     <returns type="boolean / string">return ID of listener - if attached; false - if not</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Add core's events listener </summary>
                    ///     <param name="group"             type="string"   >Name of event group</param>
                    ///     <param name="name"              type="string"   >Name of event</param>
                    ///     <param name="handle"            type="function" >Handle</param>
                    ///     <param name="id"                type="string"   >[optional][unique ID] ID of event</param>
                    ///     <param name="registered_only"   type="boolean"  >[optional][false] Add listener only if event was registered before</param>
                    ///     <returns type="boolean / string">return ID of listener - if attached; false - if not</returns>
                    /// </signature>
                },
                register: function (group, name) {
                    /// <summary>Register core's event </summary>
                    /// <param name="group" type="string">Name of event group</param>
                    /// <param name="name"  type="string">Name of event</param>
                    /// <returns type="object">Storage of registered event</returns>
                },
                remove  : function (group, name, id) {
                    /// <summary>Remove core's events listener</summary>
                    /// <param name="group" type="string">Name of event group</param>
                    /// <param name="name"  type="string">Name of event</param>
                    /// <param name="id"    type="string">ID of event</param>
                    /// <returns type="boolean">true - removed; false - not found</returns>
                },
            }
        },
        /// <field type = 'object'></field>
        overhead: {
            /// <field type = 'object'></field>
            globaly: {
                set: function (group, name, value) {
                    /// <summary>Create value in closed space</summary>
                    /// <param name="group" type="string"   >Name of storage group</param>
                    /// <param name="name"  type="string"   >Name of storage</param>
                    /// <param name="value" type="any"      >Value</param>
                    /// <returns type="any">returns saved value</returns>
                },
                get: function (group, name, default_value) {
                    /// <signature>
                    ///     <summary>Return value from closed space</summary>
                    ///     <param name="group" type="string"   >Name of storage group</param>
                    ///     <param name="name"  type="string"   >Name of storage</param>
                    ///     <returns type="any">returns saved value</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Return value from closed space</summary>
                    ///     <param name="group"         type="string"   >Name of storage group</param>
                    ///     <param name="name"          type="string"   >Name of storage</param>
                    ///     <param name="default_value" type="any"      >Default value, if property will not be found</param>
                    ///     <returns type="any">returns saved value</returns>
                    /// </signature>
                },
                del: function (group, name) {
                    /// <summary>Return value from closed space</summary>
                    /// <param name="group" type="string"   >Name of storage group</param>
                    /// <param name="name"  type="string"   >Name of storage</param>
                    /// <returns type="boolean">true - if removed; false - if not found</returns>
                }
            },
            /// <field type = 'object'></field>
            objecty: {
                set: function (element, property, value, rewrite) {
                    /// <signature>
                    ///     <summary>Add property to virtual storage based on element</summary>
                    ///     <param name="element"   type="object"   >Object for attach storage</param>
                    ///     <param name="property"  type="string"   >Name of property</param>
                    ///     <param name="value"     type="any"      >Value</param>
                    ///     <returns type="any">value</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Add property to virtual storage based on element</summary>
                    ///     <param name="element"   type="object"   >Object for attach storage</param>
                    ///     <param name="property"  type="string"   >Name of property</param>
                    ///     <param name="value"     type="any"      >Value</param>
                    ///     <param name="rewrite"   type="boolean"  >[optional] rewrite or not value</param>
                    ///     <returns type="any">value</returns>
                    /// </signature>
                },
                get: function (element, property, remove, default_value) {
                    /// <signature>
                    ///     <summary>Get property from virtual storage based on element</summary>
                    ///     <param name="element"       type="object"   >Object for attach storage</param>
                    ///     <param name="property"      type="string"   >Name of property</param>
                    ///     <returns type="any">value</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Get property from virtual storage based on element</summary>
                    ///     <param name="element"       type="object"   >Object for attach storage</param>
                    ///     <param name="property"      type="string"   >Name of property</param>
                    ///     <param name="remove"        type="boolean"  >[optional] remove or not property from storage after value will be read</param>
                    ///     <returns type="any">value</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Get property from virtual storage based on element</summary>
                    ///     <param name="element"       type="object"   >Object for attach storage</param>
                    ///     <param name="property"      type="string"   >Name of property</param>
                    ///     <param name="remove"        type="boolean"  >[optional] remove or not property from storage after value will be read</param>
                    ///     <param name="default_value" type="any"      >[optional] default value of property</param>
                    ///     <returns type="any">value</returns>
                    /// </signature>
                },
                del: function (element, property) {
                    /// <summary>Remove property from virtual storage based on element</summary>
                    /// <param name="element"   type="object"   >Object for attach storage</param>
                    /// <param name="property"  type="string"   >Name of property</param>
                    /// <returns type="boolean">true - removed; false - not found; null - bad parameters</returns>
                }
            },
            /// <field type = 'object'></field>
            register: {
                open: function (name, keys, onReadyHandle) {
                    /// <summary>Create new register</summary>
                    /// <param name="name"          type="string"       >Name of register</param>
                    /// <param name="keys"          type="array || any" >Default keys for register</param>
                    /// <param name="onReadyHandle" type="function"     >onReady handle, handle, which will be fired on all items will be done</param>
                    /// <returns type="boolean">true / false</returns>
                },
                add : function (name, key) {
                    /// <summary>Add new key into register</summary>
                    /// <param name="name"  type="string">Name of register</param>
                    /// <param name="key"   type="string">New key name</param>
                    /// <returns type="boolean">true / false</returns>
                },
                done: function (name, key, do_not_check) {
                    /// <signature>
                    ///     <summary>Set item of register to DONE</summary>
                    ///     <param name="name"          type="string"   >Name of register</param>
                    ///     <param name="key"           type="string"   >New key name</param>
                    ///     <returns type="boolean">true / false</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Set item of register to DONE</summary>
                    ///     <param name="name"          type="string"   >Name of register</param>
                    ///     <param name="key"           type="string"   >New key name</param>
                    ///     <param name="do_not_check"  type="boolean"  >true - check is all items are ready; false - do not check</param>
                    ///     <returns type="boolean">true / false</returns>
                    /// </signature>

                },
            }
        },
        /// <field type = 'object'></field>
        ajax: {
            send: function (id, url, method, parameters, callbacks, timeout, headers) {
                /// <signature>
                ///     <summary>Create XMLHttpRequest request</summary>
                ///     <param name="id"            type="string, number"           >[optional] ID of request</param>
                ///     <param name="url"           type="string"                   >URL</param>
                ///     <returns type="object" mayBeNull="true">Instance of request</returns>
                /// </signature>
                /// <signature>
                ///     <summary>Create XMLHttpRequest request</summary>
                ///     <param name="id"            type="string, number"           >[optional] ID of request</param>
                ///     <param name="url"           type="string"                   >URL</param>
                ///     <param name="method"        type="string" default="post"    >[optional] POST or GET. Default POST</param>
                ///     <returns type="object" mayBeNull="true">Instance of request</returns>
                /// </signature>
                /// <signature>
                ///     <summary>Create XMLHttpRequest request</summary>
                ///     <param name="id"            type="string, number"           >[optional] ID of request</param>
                ///     <param name="url"           type="string"                   >URL</param>
                ///     <param name="method"        type="string" default="post"    >[optional] POST or GET. Default POST</param>
                ///     <param name="parameters"    type="object, string"           >[optional] Object with parameters or string of parameters</param>
                ///     <returns type="object" mayBeNull="true">Instance of request</returns>
                /// </signature>
                /// <signature>
                ///     <summary>Create XMLHttpRequest request</summary>
                ///     <param name="id"            type="string, number"           >[optional] ID of request</param>
                ///     <param name="url"           type="string"                   >URL</param>
                ///     <param name="method"        type="string" default="post"    >[optional] POST or GET. Default POST</param>
                ///     <param name="parameters"    type="object, string"           >[optional] Object with parameters or string of parameters</param>
                ///     <param name="callbacks"     type="object"                   >[optional] Collection of callbacks [before, success, fail, reaction, timeout, headers]. </param>
                ///     <returns type="object" mayBeNull="true">Instance of request</returns>
                /// </signature>
                /// <signature>
                ///     <summary>Create XMLHttpRequest request</summary>
                ///     <param name="id"            type="string, number"           >[optional] ID of request</param>
                ///     <param name="url"           type="string"                   >URL</param>
                ///     <param name="method"        type="string" default="post"    >[optional] POST or GET. Default POST</param>
                ///     <param name="parameters"    type="object, string"           >[optional] Object with parameters or string of parameters</param>
                ///     <param name="callbacks"     type="object"                   >[optional] Collection of callbacks [before, success, fail, reaction, timeout, headers]. </param>
                ///     <param name="headers"       type="object"                   >[optional] Collection of headers. </param>
                ///     <returns type="object" mayBeNull="true">Instance of request</returns>
                /// </signature>
                /// <signature>
                ///     <summary>Create XMLHttpRequest request</summary>
                ///     <param name="id"            type="string, number"           >[optional] ID of request</param>
                ///     <param name="url"           type="string"                   >URL</param>
                ///     <param name="method"        type="string" default="post"    >[optional] POST or GET. Default POST</param>
                ///     <param name="parameters"    type="object, string"           >[optional] Object with parameters or string of parameters</param>
                ///     <param name="callbacks"     type="object"                   >[optional] Collection of callbacks [before, success, fail, reaction, timeout, headers]. </param>
                ///     <param name="headers"       type="object"                   >[optional] Collection of headers. </param>
                ///     <param name="timeout"       type="number"                   >[optional] Number of ms for timeout</param>
                ///     <returns type="object" mayBeNull="true">Instance of request</returns>
                /// </signature>
            }
        },
        /// <field type = 'object'></field>
        resources: {
            /// <field type = 'object'></field>
            parse: {
                /// <field type = 'object'></field>
                css: {
                    stringify: function (href) {
                        /// <summary>
                        /// Get string from CSS resource
                        /// </summary>
                        /// <param name="resource" type="string">URL of CSS resource</param>
                        /// <returns type="string">String representation of CSS resource</returns>
                    }
                }
            },
            /// <field type = 'object'></field>
            attach: {
                /// <field type = 'object'></field>
                css: {
                    connect : function (url, onLoad, onError) {
                        /// <signature>
                        ///     <summary>Connect CSS resource via LINK in HEAD of page</summary>
                        ///     <param name="url"       type="string"   >URL to resource</param>
                        ///     <returns type="boolean">true / false</returns>
                        /// </signature>
                        /// <signature>
                        ///     <summary>Connect CSS resource via LINK in HEAD of page</summary>
                        ///     <param name="url"       type="string"   >URL to resource</param>
                        ///     <param name="onLoad"    type="function" >Callback on load will be finished</param>
                        ///     <returns type="boolean">true / false</returns>
                        /// </signature>
                        /// <signature>
                        ///     <summary>Connect CSS resource via LINK in HEAD of page</summary>
                        ///     <param name="url"       type="string"   >URL to resource</param>
                        ///     <param name="onLoad"    type="function" >Callback on load will be finished</param>
                        ///     <param name="onError"   type="function" >Callback on some error</param>
                        ///     <returns type="boolean">true / false</returns>
                        /// </signature>
                    },
                    adoption: function (cssText, documentLink, url) {
                        /// <signature>
                        ///     <summary>Inject CSS text as STYLE into HEAD</summary>
                        ///     <param name="cssText"       type="string"   >CSS text</param>
                        ///     <returns type="object">link to created node STYLE</returns>
                        /// </signature>
                        /// <signature>
                        ///     <summary>Inject CSS text as STYLE into HEAD</summary>
                        ///     <param name="cssText"       type="string"   >CSS text</param>
                        ///     <param name="documentLink"  type="object"   >Link to document</param>
                        ///     <returns type="object">link to created node STYLE</returns>
                        /// </signature>
                        /// <signature>
                        ///     <summary>Inject CSS text as STYLE into HEAD</summary>
                        ///     <param name="cssText"       type="string"   >CSS text</param>
                        ///     <param name="documentLink"  type="object"   >Link to document</param>
                        ///     <param name="url"           type="string"   >URL of parent to correct paths in CSS text</param>
                        ///     <returns type="object">link to created node STYLE</returns>
                        /// </signature>
                    },
                },
                /// <field type = 'object'></field>
                js: {
                    connect : function (url, onLoad, onError) {
                        /// <signature>
                        ///     <summary>Connect JS resource via LINK in HEAD of page</summary>
                        ///     <param name="url"       type="string"   >URL to resource</param>
                        ///     <returns type="boolean">link to created node SCRIPT</returns>
                        /// </signature>
                        /// <signature>
                        ///     <summary>Connect JS resource via LINK in HEAD of page</summary>
                        ///     <param name="url"       type="string"   >URL to resource</param>
                        ///     <param name="onLoad"    type="function" >Callback on load will be finished</param>
                        ///     <returns type="boolean">link to created node SCRIPT</returns>
                        /// </signature>
                        /// <signature>
                        ///     <summary>Connect JS resource via LINK in HEAD of page</summary>
                        ///     <param name="url"       type="string"   >URL to resource</param>
                        ///     <param name="onLoad"    type="function" >Callback on load will be finished</param>
                        ///     <param name="onError"   type="function" >Callback on some error</param>
                        ///     <returns type="boolean">link to created node SCRIPT</returns>
                        /// </signature>
                    },
                    adoption: function (jsScript, onFinish) {
                        /// <signature>
                        ///     <summary>Generate script within JS text</summary>
                        ///     <param name="jsScript"  type="string"   >JS text</param>
                        ///     <returns type="void">void</returns>
                        /// </signature>
                        /// <signature>
                        ///     <summary>Generate script within JS text</summary>
                        ///     <param name="jsScript"  type="string"   >JS text</param>
                        ///     <param name="onFinish"  type="function" >Callback on finish</param>
                        ///     <returns type="void">void</returns>
                        /// </signature>
                    },
                }
            }
        },
        /// <field type = 'object'></field>
        localStorage: {
            add     : function (key, value, encode) {
                /// <signature>
                ///     <summary>Save value in localStorage</summary>
                ///     <param name="key"       type="string"   >Key of value</param>
                ///     <param name="value"     type="any"      >Value</param>
                ///     <returns type="any">Value from localStorage</returns>
                /// </signature>
                /// <signature>
                ///     <summary>Save value in localStorage</summary>
                ///     <param name="key"       type="string"   >Key of value</param>
                ///     <param name="value"     type="any"      >Value</param>
                ///     <param name="decode"    type="boolean"  >True - encode to BASE64String</param>
                ///     <returns type="any">Value from localStorage</returns>
                /// </signature>
            },
            get     : function (key, decode) {
                /// <signature>
                ///     <summary>Get value from localStorage</summary>
                ///     <param name="key"       type="string"   >Key of value in localStorage</param>
                ///     <returns type="any">Value from localStorage</returns>
                /// </signature>
                /// <signature>
                ///     <summary>Get value from localStorage</summary>
                ///     <param name="key"       type="string"   >Key of value in localStorage</param>
                ///     <param name="decode"    type="boolean"  >True - decode from BASE64String</param>
                ///     <returns type="any">Value from localStorage</returns>
                /// </signature>
            },
            del     : function (key) {
                /// <signature>
                ///     <summary>Remove value from localStorage</summary>
                ///     <param name="key" type="string">Key of value</param>
                ///     <returns type="boolean">True - success, False - fail</returns>
                /// </signature>
            },
            addJSON : function (key, value) {
                /// <signature>
                ///     <summary>Stringify object from JSON and save it in localStorage</summary>
                ///     <param name="key"       type="string"   >Key of value</param>
                ///     <param name="value"     type="any"      >Value</param>
                ///     <returns type="any">Value from localStorage</returns>
                /// </signature>
            },
            getJSON : function (key) {
                /// <signature>
                ///     <summary>Get value from localStorage and convert it to JSON</summary>
                ///     <param name="key" type="string">Key of value in localStorage</param>
                ///     <returns type="any">Value from localStorage</returns>
                /// </signature>
            },
        },
        /// <field type = 'object'></field>
        system: {
            handle  : function (handle_body, handle_arguments, call_point, this_argument) {
                /// <signature>
                ///     <summary>Run function in safely mode</summary>
                ///     <param name="body"          type="function" >Handle</param>
                ///     <returns type="any">Return of handle</returns>
                /// </signature>
                /// <signature>
                ///     <summary>Run function in safely mode</summary>
                ///     <param name="body"          type="function" >Handle</param>
                ///     <param name="arguments"     type="any"      >Arguments for handle</param>
                ///     <returns type="any">Return of handle</returns>
                /// </signature>
                /// <signature>
                ///     <summary>Run function in safely mode</summary>
                ///     <param name="body"          type="function" >Handle</param>
                ///     <param name="arguments"     type="any"      >Arguments for handle</param>
                ///     <param name="call_point"    type="string"   >Text for log message.</param>
                ///     <returns type="any">Return of handle</returns>
                /// </signature>
                /// <signature>
                ///     <summary>Run function in safely mode</summary>
                ///     <param name="body"          type="function" >Handle</param>
                ///     <param name="arguments"     type="any"      >Arguments for handle</param>
                ///     <param name="call_point"    type="string"   >Text for log message.</param>
                ///     <param name="this"          type="object"   >Context of handle</param>
                ///     <returns type="any">Return of handle</returns>
                /// </signature>
            },
            /// <field type = 'object'></field>
            url     : {
                parse   : function (url, origin) {
                    /// <signature>
                    ///     <summary>Parsing of URL</summary>
                    ///     <param name="url"       type="string">URL</param>
                    ///     <returns type="object">Parsed URL</returns>
                    /// </signature>
                    /// <signature>
                    ///     <summary>Parsing of URL</summary>
                    ///     <param name="url"       type="string">URL</param>
                    ///     <param name="origin"    type="string">Original URL (i can be needed if URL hasn't domain definition. Like this ../folder/resource.ext</param>
                    ///     <returns type="object">Parsed URL</returns>
                    /// </signature>
                },
                restore : function (url) {
                    /// <signature>
                    ///     <summary>Add current domain to URL (if there are no definition of domain)</summary>
                    ///     <param name="url"type="string">URL</param>
                    ///     <returns type="object">Restored URL</returns>
                    /// </signature>
                }
            }
        },
        /// <field type = 'object'></field>
        logs: {
            parseError  : function (e) {
                /// <signature>
                ///     <summary>Create string from error object</summary>
                ///     <param name="error" type="object">Error object</param>
                ///     <returns type="string">String</returns>
                /// </signature>
            },
            log         : function (message, type) {
                /// <signature>
                ///     <summary>Add log message to console</summary>
                ///     <param name="message"   type="string">Message</param>
                ///     <returns type="void">void</returns>
                /// </signature>
                /// <signature>
                ///     <summary>Add log message to console</summary>
                ///     <param name="message"   type="string">Message</param>
                ///     <param name="type"      type="string">Type of message</param>
                ///     <returns type="void">void</returns>
                /// </signature>
            },
            /// <field type = 'object'>Types of messages</field>
            types: {
                /// <field type = 'string'>CRITICAL message</field>
                CRITICAL: '',
                /// <field type = 'string'>LOGICAL message</field>
                LOGICAL: '',
                /// <field type = 'string'>WARNING message</field>
                WARNING: '',
                /// <field type = 'string'>NOTIFICATION message</field>
                NOTIFICATION: ''
            }
        },
        /// <field type = 'object'></field>
        hashes: {
            get     : function (url) { 
                /// <signature>
                ///     <summary>Get hash for defined resource</summary>
                ///     <param name="url" type="string">URL to resource</param>
                ///     <returns type="string">HASH</returns>
                /// </signature>
            },
            update  : function (url) { 
                /// <signature>
                ///     <summary>Update hash of defined resource</summary>
                ///     <param name="url" type="string">URL to resource</param>
                ///     <returns type="void">void</returns>
                /// </signature>
            }
        },
        /// <field type = 'object'></field>
        callers: {
            /// <field type = 'object'></field>
            define  : {
                node    : function (path, value) { 
                    /// <signature>
                    ///     <summary>Define method / property for caller</summary>
                    ///     <param name="path"  type="string">Path to method / property, like "events.add"</param>
                    ///     <param name="value" type="function || object || any">Method or property, which will be attached by path</param>
                    ///     <returns type="void">void</returns>
                    /// </signature>
                },
                nodes   : function (path, value) {
                    /// <signature>
                    ///     <summary>Define method / property for caller</summary>
                    ///     <param name="path"  type="string">Path to method / property, like "events.add"</param>
                    ///     <param name="value" type="function || object || any">Method or property, which will be attached by path</param>
                    ///     <returns type="void">void</returns>
                    /// </signature>
                },
                array   : function (path, value) {
                    /// <signature>
                    ///     <summary>Define method / property for caller</summary>
                    ///     <param name="path"  type="string">Path to method / property, like "events.add"</param>
                    ///     <param name="value" type="function || object || any">Method or property, which will be attached by path</param>
                    ///     <returns type="void">void</returns>
                    /// </signature>
                },
                object  : function (path, value) {
                    /// <signature>
                    ///     <summary>Define method / property for caller</summary>
                    ///     <param name="path"  type="string">Path to method / property, like "events.add"</param>
                    ///     <param name="value" type="function || object || any">Method or property, which will be attached by path</param>
                    ///     <returns type="void">void</returns>
                    /// </signature>
                },
                string  : function (path, value) {
                    /// <signature>
                    ///     <summary>Define method / property for caller</summary>
                    ///     <param name="path"  type="string">Path to method / property, like "events.add"</param>
                    ///     <param name="value" type="function || object || any">Method or property, which will be attached by path</param>
                    ///     <returns type="void">void</returns>
                    /// </signature>
                },
                boolean : function (path, value) {
                    /// <signature>
                    ///     <summary>Define method / property for caller</summary>
                    ///     <param name="path"  type="string">Path to method / property, like "events.add"</param>
                    ///     <param name="value" type="function || object || any">Method or property, which will be attached by path</param>
                    ///     <returns type="void">void</returns>
                    /// </signature>
                },
            }
        },
        /*  *******************************************************************
        *   CORE EVENTS
        *   ********************************************************************/
        registry: {
            events: {
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
                    /// <field type = 'object'>Events of cache</field>
                    cache: {
                        GROUP               : 'flex.system.cache.events',
                        ON_NEW_MODULE       : 'ON_NEW_MODULE',
                        ON_UPDATED_MODULE   : 'ON_UPDATED_MODULE',
                        ON_NEW_RESOURCE     : 'ON_NEW_RESOURCE',
                        ON_UPDATED_RESOURCE : 'ON_UPDATED_RESOURCE',
                    }
                }
            }
        },
        /*  *******************************************************************
        *   LIBRARIES
        *   ********************************************************************/
        libraries: {
            /// Basic events controller
            events  : { 
			    create : function(){
				    /// <signature>
				    /// <summary>Create instance of controller</summary>
				    /// </signature>					
			    }
		    },
            /// Collection of tools for management of DOM
            html    : { 
			    create : function(){
				    /// <signature>
				    /// <summary>Create instance of controller</summary>
				    /// </signature>					
			    }
		    },
            css     : {
                /// Controller CSS animation
                animation   : { 
				    create : function(){
					    /// <signature>
					    /// <summary>Create instance of controller</summary>
					    /// </signature>					
				    }
			    },
                /// Controller CSS events
                events      : { 
				    create : function(){
					    /// <signature>
					    /// <summary>Create instance of controller</summary>
					    /// </signature>					
				    }
			    },
            },
            /// Collection of UI elements
            ui      : {
                /// Controller of window
                window      : {
                    /// Controller of window movement
                    move    : { 
					    create : function(){
						    /// <signature>
						    /// <summary>Create instance of controller</summary>
						    /// </signature>					
					    }
				    },
                    /// Controller of window resize
                    resize  : { 
					    create : function(){
						    /// <signature>
						    /// <summary>Create instance of controller</summary>
						    /// </signature>					
					    }
				    },
                    /// Controller of window resize
                    focus   : { 
					    create : function(){
						    /// <signature>
						    /// <summary>Create instance of controller</summary>
						    /// </signature>					
					    }
				    },
                    /// Controller of window maximize / restore
                    maximize: { 
					    create : function(){
						    /// <signature>
						    /// <summary>Create instance of controller</summary>
						    /// </signature>					
					    }
				    },
                },
                /// Controller of templates
                templates   : { 
				    create : function(){
					    /// <signature>
					    /// <summary>Create instance of controller</summary>
					    /// </signature>					
				    }
			    },
                /// Controller of scrollbox
                scrollbox   : { 
				    create : function(){
					    /// <signature>
					    /// <summary>Create instance of controller</summary>
					    /// </signature>					
				    }
			    },
                /// Controller of itemsbox
                itemsbox    : { 
				    create : function(){
					    /// <signature>
					    /// <summary>Create instance of controller</summary>
					    /// </signature>					
				    }
			    },
                /// Controller of areaswitcher
                areaswitcher: { 
				    create : function(){
					    /// <signature>
					    /// <summary>Create instance of controller</summary>
					    /// </signature>					
				    }
			    },
                /// Controller of areascroller
                areascroller: { 
				    create : function(){
					    /// <signature>
					    /// <summary>Create instance of controller</summary>
					    /// </signature>					
				    }
			    },
                /// Controller of arearesizer
                arearesizer : { 
				    create : function(){
					    /// <signature>
					    /// <summary>Create instance of controller</summary>
					    /// </signature>					
				    }
			    },
            },
        }

    };
})();