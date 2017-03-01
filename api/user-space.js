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
      this [AET.dispatcher ()] ('create', this, arr);
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
      this [AET.dispatcher ()] ('login', this, arr);
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
      this [AET.dispatcher ()] ('logout', this, arr);
    }
    xhr.send ();
  }
}

module.exports = User;