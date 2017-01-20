(function() {

    // Baseline setup
    // --------------

    // Establish the root object, `window` in the browser, or `exports` on the server.
    var root = this;

    // Create a safe reference to the Underscore object for use below.
    var common = function(obj) {
        if (obj instanceof common) return obj;
        if (!(this instanceof common)) return new _(obj);
        this._wrapped = obj;
    };

    // Export the Underscore object for **Node.js**, with
    // backwards-compatibility for the old `require()` API. If we're in
    // the browser, add `_` as a global object.
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = common;
        }
        exports.common = common;
    } else {
        root.common = common;
    };
    /**
     * [random random function]
     * @param  {[number]} min [description]
     * @param  {[number]} max [description]
     * @return {[number]}     [description]
     */
    common.random = function(min, max) {
        var len = max - min;
        var random = min + Math.random() * len;
        return random;
    };
    /**
     * [randomNNumber get random string from 00...0 to 99...9]
     * @param  {[int]} n [string's length]
     * @return {[string]}   [description]
     */
    common.randomNNumber = function(n) {
        var str = '';
        for (var i = 0; i < n; i++) {
            str += '0';
        }
        var random = (str + parseInt(common.random(0, Math.pow(10, n)))).slice(-n);
        return random;
    };
    /**
     * [getIdNode get the document Node id]
     * @param  {[string]} id [id name]
     * @return {[document node]}    [description]
     */
    common.getIdNode = function(id) {
        return document.getElementById(id);
    };
    /**
     * [getFormData get the form value,the input tag or textarea tag must have the name attribute]
     * @param  {[string]} formId [the form id]
     * @return {[object]}        [form data,if the input's type is checkbox,it will get a Array]
     */
    common.getFormData = function(formId) {
        var formNode = common.getIdNode(formId),
            inputChild = formNode.getElementsByTagName('input'),
            textareaChild = formNode.getElementsByTagName('textarea');
        data = {};
        for (var i = 0; i < inputChild.length; i++) {
            var type = inputChild[i].getAttribute("type");
            var name = inputChild[i].getAttribute("name"),
                value = inputChild[i].value;
            if (type == 'radio') { //get the radio input's checked value
                if (inputChild[i].checked) data[name] = value;
            } else if (type == 'checkbox') { //get the checkbox input's value
                if (inputChild[i].checked) {
                    if (data[name] instanceof Array) data[name].push(value);
                    else data[name] = [value];
                }
            } else {
                data[name] = value;
            }
        }
        for (var i = 0; i < textareaChild.length; i++) {
            var name = textareaChild[i].getAttribute("name"),
                value = textareaChild[i].value;
            data[name] = value;
        }
        return data;
    };
    /**
     * [createXmlRequest create a xmlRequest]
     * @return {[type]} [description]
     */
    common.createXmlRequest = function() {
        if (window.ActiveXObject) {
            return new ActiveXObject("Microsoft.XMLHTTP");
        } else if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        }
    };
    /**
     * [dataToUrl make the object to a url param string]
     * @param  {[object]} data [origin object]
     * @return {[string]}      [description]
     */
    common.dataToUrl = function(data) {
        var str = '';
        for (var i in data) {
            str += '&' + i + '=' + data[i];
        }
        return str
    };
    common.ajax = function(url, type, data, successCallback, failCallback, requestHeader) {
        var xmlHttp = common.createXmlRequest();
        url = encodeURI(url);
        xmlHttp.open(type, url);
        if (!requestHeader && type == "POST") {
            xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        } else if (requestHeader) {
            xmlHttp.setRequestHeader(requestHeader.key, requestHeader.value)
        }
        xmlHttp.send(data);
        xmlHttp.onreadystatechange = function() {
            if ((xmlHttp.readyState == 4) && (xmlHttp.status == 200)) {
                successCallback(data);
            } else {
                failCallback(error);
            }
        }
    };

    common.getUrlParam = function(key) {
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
        var r = location.search.substr(1).match(reg)
        if (r) {
            return decodeURI(r[2])
        }
        return ""
    };
    // AMD registration happens at the end for compatibility with AMD loaders
    // that may not enforce next-turn semantics on modules. Even though general
    // practice for AMD registration is to be anonymous, underscore registers
    // as a named module because, like jQuery, it is a base library that is
    // popular enough to be bundled in a third party lib, but not be part of
    // an AMD load request. Those cases could generate an error when an
    // anonymous define() is called outside of a loader request.
    if (typeof define === 'function' && define.amd) {
        define('underscore', [], function() {
            return common;
        });
    };
}.call(this));
