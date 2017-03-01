(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
let AET = require ('abstract-event-target');
let DIS = AET.dispatcher;
/**
  * Represents a 'user-space' style user on the backend.
  */
class User extends AET {
  /**
    * Mongoose-esque constructor for users.
    * Creates the local object representing a user.
    * No request is created until the 'create' method is called.
    * 
    * @param {Object} obj Accepts an object that defines other user attributes.
    * @param {String} [obj.email] The user's email.
    * @param {String} [obj.phone] The user's (US) phone number.
    * @param {String} [obj.password] The user's password.
    */
  constructor (obj={}) {
    super ();
    /**
      * The users email.
      */
    this.email = obj.email;
    /**
      * The users phone number.
      */
    this.phone = obj.phone;
    /**
      * The users password.
      */
    this.password = obj.password;
  }
  /**
    * Create a new account. Then dispatches the 'create' event.
    */
  create () {
    let xhr = new XMLHttpRequest ();
    xhr.open ('POST', '/users');
    xhr.setRequestHeader ('Content-Type', 'application/json');
    xhr.onload = () => {
      let arr = [null, null];
      if (xhr.status !== 201)
        arr [0] = xhr.status;
      try {
        arr [1] = JSON.parse (xhr.response);
      } catch (e) {
        arr [1] = xhr.response;
      }
      this [dispatcher] ('create', this, arr);
    }
    xhr.send (JSON.stringify (this));
  }
  /**
    * Log the user in. Fire the 'login' event.
    */
  login () {
    let xhr = new XMLHttpRequest ();
    xhr.open ('POST', '/sessions');
    xhr.setRequestHeader ('Content-Type', 'application/json');
    xhr.onload = () => {
      let arr = [null, null];
      if (xhr.status !== 201)
        arr [0] = xhr.status;
      try {
        arr [1] = JSON.parse (xhr.response);
      } catch (e) {
        arr [1] = xhr.response;
      }
      this [dispatcher] ('login', this, arr);
    }
    xhr.send (JSON.stringify ());
  }
  /**
    * Log the user out. Fire the 'logout' event.
    */
  logout () {
    let xhr = new XMLHttpRequest ();
    xhr.open ('DELETE', '/sessions');
    xhr.setRequestHeader ('Content-Type', 'application/json');
    xhr.onload = () => {
      let arr = [null, null];
      if (xhr.status !== 200)
        arr [0] = xhr.status;
      try {
        arr [1] = JSON.parse (xhr.response);
      } catch (e) {
        arr [1] = xhr.response;
      }
      this [dispatcher] ('logout', this, arr);
    }
    xhr.send ();
  }
}

module.exports = User;
},{"abstract-event-target":4}],2:[function(require,module,exports){
(function (global){
global.User = require ('./api/user-space');
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./api/user-space":1}],3:[function(require,module,exports){
'use strict'
let evt = Symbol ();
let dispatcher = Symbol (); 
/**
  * An es6 abstract class simulating the native javscript EventTarget interface.
  * Designed for custom/composite events.
  */
class AbstractEventTarget {
  /**
    * Initializes the event handler object.
    */
  constructor () {
    this [evt] = {};
    this [dispatcher] = (event_name, thisArg, args) => {
      if (this [evt] [event_name])
        this [evt] [event_name].forEach ((event_handler) => {
          event_handler.apply (thisArg, args);
        });
    }
  }
  /**
    * Add an event handler.
    * 
    * @param {String} event_name The name of the event to add.
    * @param {Function} event_handler The callback function.
    * Data passed into callbacks should be documented by child classes.
    */
  addEventListener (event_name, event_handler) {
    if (!this [evt] [event_name])
      this [evt] [event_name] = [];
    this [evt] [event_name].push (event_handler);
  }
  /**
    * Remove an event handler.
    * 
    * @param {String} event_name Must be the same name as the callback to remove.
    * @param {Functino} event_handler Must be the same function as the callback to remove.
    */
  removeEventListener (event_name, event_handler) {
    if (this [evt] [event_name])
      if (this [evt] [event_name].indexOf (event_handler) !== -1)
        this [evt] [event_name].splice (this [evt] [event_name].indexOf (event_handler), 1);
  }
  /**
    * Retrieve the symbol for accessing the dispatcher function.
    * 
    * @return {Symbol} The accessor symbol for the dispatcher function.
    */
  static dispatcher () {
    return dispatcher;
  }
}

module.exports = AbstractEventTarget;
},{}],4:[function(require,module,exports){
module.exports = require ('./api/AbstractEventTarget');
},{"./api/AbstractEventTarget":3}]},{},[2]);
