var sinon=require("sinon");

describe('Model Sync',function(){
	var Test=ko.Model.extend({urlRoot:'/Foo'});
	describe('When declaring a model with an id', function() {
	    var model=new Test({id:1});
	    it('should return the correct url', function() {
	    	model.url().should.equal('/Foo/1');
	    });
	});

	describe('When fetching a model', function() {
	    var model = new Test({id:1}),
	    	parseSpy = sinon.spy(model,"parse");

	    before(function(){
	    	sinon.stub(jQuery, "ajax")
	    		.returns(jQuery.when({foo:"bar"}));

	    	model.fetch();
	    });
	    
	    it('should make the correct AJAX request', function() {
      		sinon.assert.calledWith(jQuery.ajax,{
      			type: 'GET',
      			url: '/Foo/1',
      			dataType: "json"
      		});
	    });

	    it('should call the model parse method', function() {
	    	parseSpy.calledOnce.should.be.true;
	    });

	    it('should set the object values returned from request', function() {
	    	model.foo().should.equal("bar");
	    });

	    after(function(){
	  		jQuery.ajax.restore();
	  	});
	});

	describe('When saving a model without an id', function() {
		var model = new Test({blah:true}),
	    	parseSpy = sinon.spy(model,"parse");
	    before(function(){
	    	sinon.stub(jQuery, "ajax")
	    		.returns(jQuery.when({foo:"bar"}));

	    	model.save();
	    });
	    
	    it('should make the correct AJAX request', function() {
      		sinon.assert.calledWith(jQuery.ajax,{
      			type: 'POST',
      			url: '/Foo',
      			contentType: "application/json",
      			data: JSON.stringify({blah:true}),
      			dataType: "json"
      		});
	    });

	    it('should call the model parse method', function() {
	    	parseSpy.calledOnce.should.be.true;
	    });

	    it('should set the object values returned from request', function() {
	    	model.foo().should.equal("bar");
	    });

	    after(function(){
	  		jQuery.ajax.restore();
	  	});
	});

	describe('When saving a model with an id', function() {
		var model = new Test({id:2,blah:true}),
	    	parseSpy = sinon.spy(model,"parse");

	    before(function(){
	    	sinon.stub(jQuery, "ajax")
	    		.returns(jQuery.when({foo:"bar"}));

	    	model.save();
	    });
	    
	    it('should make the correct AJAX request', function() {
      		sinon.assert.calledWith(jQuery.ajax,{
      			type: 'PUT',
      			url: '/Foo/2',
      			contentType: "application/json",
      			data: JSON.stringify({id:2,blah:true}),
      			dataType: "json"
      		});
	    });

	    it('should call the model parse method', function() {
	    	parseSpy.calledOnce.should.be.true;
	    });

	    it('should set the object values returned from request', function() {
	    	model.foo().should.equal("bar");
	    });

	    after(function(){
	  		jQuery.ajax.restore();
	  	});
	});

	describe('When destorying a model', function() {
		var model = new Test({id:3});

	    before(function(){
	    	sinon.stub(jQuery, "ajax")
	    		.returns(jQuery.when({}));

	    	model.destroy();
	    });
	    
	    it('should make the correct AJAX request', function() {
      		sinon.assert.calledWith(jQuery.ajax,{
      			type: 'DELETE',
      			url: '/Foo/3',
      			dataType: "json"
      		});
	    });

	    after(function(){
	  		jQuery.ajax.restore();
	  	});
	});

});