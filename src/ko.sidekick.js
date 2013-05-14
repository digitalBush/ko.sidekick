/*
  Knockout.js Sidekick
	Copyright (c) 2013 Josh Bush (digitalbush.com)
	Licensed under the MIT license (https://raw.github.com/digitalBush/ko.sidekick/master/LICENSE)
*/

(function(undefined){
  var utils = (function(){
    var utils ={},
        forEach = [].forEach,
        slice = [].slice;

    //Underscore.js (c) Jeremy Ashkenas, DocumentCloud Inc. https://github.com/documentcloud/underscore/
    var each = utils.each = function(obj, callback, context) {
      if (obj == null) return;
      if (forEach && obj.forEach === forEach) {
        obj.forEach(callback, context);
      } else if (typeof obj.length === 'number' && obj.length > 0) {
        for (var i = 0, length = obj.length; i < length; i++) {
          callback.call(context, obj[i], i, obj);
        }
      } else {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
           callback.call(context, obj[key], key, obj);
          }
        }
      }
    };

    //Underscore.js (c) Jeremy Ashkenas, DocumentCloud Inc. https://github.com/documentcloud/underscore/
    utils.extend=function(obj){
      each(slice.call(arguments, 1), function(source) {
        if (source) {
          for (var prop in source) {
            obj[prop] = source[prop];
          }
        }
      });
      return obj;
    };

    var isFunction = utils.isFunction = function(value){
      return (typeof(value) === 'function');
    };

    utils.value = function(value){
      return isFunction(value) ? value() : value;
    };
    return utils;
  })();


  (function(){
    var methodMap = {
      'create': 'POST',
      'update': 'PUT',
      'patch':  'PATCH',
      'delete': 'DELETE',
      'read':   'GET'
    };

    ko.sync = function(method, model, options) {
      var type = methodMap[method];

      options || (options = {});

      var params = {
        type: type, 
        dataType: 'json',
        url: options.url || model.url() || urlError()
      };

      if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
        params.contentType = 'application/json';
        params.data = ko.toJSON(model);
      }

      return jQuery.ajax(utils.extend(params,options))
    };

    function urlError(){throw new Error('A "url" property or function must be specified');}
  })();



  (function(){
      var Model = ko.Model = function(properties) {
          var props = properties||{};

          if (this.defaults){
              props = utils.extend({},utils.value(this.defaults),props);
          }
          this._properties={};
          this.set(props);
          this.init.apply(this, arguments);
      };

      utils.extend(Model.prototype,{
          idAttribute:'id',
          isNew:function() {
            return this[this.idAttribute] == null;
          },
          init:function(){},
          set:function(props){
            var self=this;
            utils.each(props,function(value,key){
              if(self.hasOwnProperty(key)){
                if(ko.isObservable(self[key])){
                  self[key](value);
                }else if (self[key] instanceof ko.Model){
                  self[key].set(value);
                }else{
                  self[key]=value;
                }
              }else{
                if(self.defaults && self.defaults[key].extend===ko.Model.extend){
                  self[key] = new self.defaults[key]();
                  if(!utils.isFunction(value)) self[key].set(value);
                }else if(utils.isFunction(value)){
                    self[key]=ko.computed(value,self);
                }else if(value instanceof Array){
                    self[key]=ko.observableArray(value.slice(0));
                }else{
                    self[key]=ko.observable(value);
                }
                self._properties[key]=self[key];
              }
            });
            return self;
          },
          toJSON:function(){
              return this._properties;
          },
          sync:function(){
              return ko.sync.apply(this,arguments);
          },
          fetch:function(options){
            var self=this,success;

            options = utils.extend({},options);

            return self.sync('read', self, options)
              .then(function(response){
                if (!self.set(self.parse(response))) return false;
                if (success) success(self, response, options);
              });
          },
          save:function(options){
            var self=this,success,method;
            
            options = utils.extend({},options);
            method = self.isNew() ? 'create' : 'update';

            return self.sync(method, self, options)
              .then(function(response){
                if (!self.set(self.parse(response))) return false;
                if (success) success(self, response, options);
              });
          },
          destroy:function(options){
            var self=this,success;

            options = utils.extend({},options);

            return self.sync('delete', self, options)
              .then(function(response){
                if (success) success(self, response, options);
              });
          },
          url:function(){
            var self=this,
                base = utils.value(self.urlRoot);

            if (this.isNew()) return base;
            return base + (base.charAt(base.length - 1) === '/' ? '' : '/') + encodeURIComponent(utils.value(this.id));
    
          },
          parse:function(response){
            return response;
          }
      });

      //Backbone.js (c) Jeremy Ashkenas, DocumentCloud https://github.com/documentcloud/backbone
      var extend = function(protoProps, staticProps) {
        var parent = this,child;
        if (protoProps && protoProps.hasOwnProperty('constructor')) {
          child = protoProps.constructor;
        } else {
          child = function(){ parent.apply(this, arguments); };
        }

        utils.extend(child, parent, staticProps);

        var Surrogate = function(){ this.constructor = child; };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;

        if (protoProps) utils.extend(child.prototype, protoProps);

        child.__super__ = parent.prototype;
        return child;
      };
      Model.extend = extend;
  })();
})();
