Knockout Sidekick
=================

This project is my playground for introducing Backbone concepts that work with Knockout. 
**Warning:** This project is in its early stages. *Proceed with caution*

Want to help?
-------------
* run `npm install` to install dependencies
* run `npm test` to run tests


Model
-----

```javascript
//define a Model
var Person = ko.Model({
	urlRoot:'/Person',
	defaults:{ //We'll make sure we always have these observable properties on the model
		firstName:"", 
		lastName:"",
		fullName: function(){ //We'll even wire up computed observables for you
			return this.firstName+ " "+ this.lastName; //"this" will be your model instance
		} 
	}
});

//create your very own person
//The properties you pass in will be created as observables on your instance
var josh = new Person({
	firstName: "Josh", //default property will be overidden
	twitter: "@digitalbush",
	websites: ["http://digitalbush.com","http://freshbrewedcode.com"] //Arrays work too!
});

//Save it. The default implementation follows a RESTful pattern that will
// POST to the urlRoot defined above if no id is set on the model
// PUT to "{urlRoot}/{id}" if an id is set
josh.save();


//You can fetch a model if you know it's id
var fred = new Person({id:42});
fred.fetch();

```
