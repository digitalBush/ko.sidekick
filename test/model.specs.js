describe('Model',function(){
  describe('When instantiating', function() {
    var init=false;
    var Model=ko.Model.extend({
      init:function(){
        init=true;
      }
    });
    var model=new Model();
    it('should set up inheritance correctly', function() {
      model.should.be.an.instanceof(Model);
    });
    it('should call init function', function() {
      init.should.equal(true);
    });
  });

  describe('When supplying default properties', function() {
    var Model=ko.Model.extend({defaults:{goodToGo:true}});
    var model=new Model();

    it('should create those properties on the instance', function() {
      model.goodToGo().should.equal(true);
    });
  });

  describe('When supplying properties at instantiation', function() {
    var Model=ko.Model.extend();
    var model=new Model({bacon:"awesome"});

    it('should create those properties on the instance', function() {
      model.bacon().should.equal("awesome");
    });
  });

  describe('When supplying properties at instantiation that conflict with default properties', function() {
    var Model=ko.Model.extend({defaults:{bacon:"sizzles"}});
    var model=new Model({bacon:"awesome"});

    it('should create those properties on the instance', function() {
      model.bacon().should.equal("awesome");
    });
  });

  describe('When supplying a default function property', function() {
    var Person=ko.Model.extend({
      defaults:{
        firstName:"",
        lastName:"",
        name:function(){
          return this.firstName() + " " + this.lastName();
        }
      }
    });
    var model=new Person({firstName:"Josh",lastName:"Bush"});

    it('should create an observable property', function() {
      model.name().should.equal("Josh Bush");
    });
  });

  describe('When extending Model with a function property', function() {
    var Person=ko.Model.extend({
      defaults:{
        firstName:"",
        lastName:"",
      },
      getName:function(){
        return this.firstName()+" "+this.lastName();
      }
    });
    var model=new Person({firstName:"Josh",lastName:"Bush"});

    it('should create property on the prototype', function() {      
      model.should.have.property('getName');
      model.should.not.have.ownProperty('getName');
    });

    it('should be able to access "this" correctly', function() {      
      model.getName().should.equal("Josh Bush");
    });
  });
});
