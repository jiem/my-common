(function() {

  var Person = function(name, city) {
    this.name = name;
    this.city = city;
  };

  Person.prototype.sayHello = function() {
    alert(this.name + ' says: "Hello from ' + this.city + '!"');
  };

  exports.Person = Person;
  
  exports.doSomethingCrazy = function() {
    alert('I\'m doing something crazy!')
  }

})();
