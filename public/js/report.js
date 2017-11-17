function Model(data){
  var self = this;

  self.pdf;




};



function View(model){
  var self = this;

  self.elements = {
    freeBeds: $('.freeBeds'),
    users: $('.users'),
    money: $('.money'),
    houses: $('.totalHouses'),
  };

  self.init = function(items){
    self.elements.freeBeds.html(items.freeBeds);
    self.elements.users.html(items.users);
    self.elements.money.html(Math.round(items.money));
    self.elements.houses.html(items.houses);
    console.log(items);
    return;
  };




};




function Controller(model, view){
  var self = this;

//===========================================
//-----------------Events--------------------
//===========================================
  $(document).delegate( ".rooms", "click", freeBeds);
  // $(document).delegate( ".amount", "click", );
  // $(document).delegate( ".guests", "click", );
  $(document).delegate( ".houses", "click", pdf);
  //
  // $(document).delegate( ".cancel", "click", );
  $(document).delegate( ".amount", "click", amount);

  $(document).delegate( ".navBtn", "click", nav);

//===========================================
//---------------Functions-------------------
//===========================================

//------------------init----------------------
  function init(){
    $.ajax({
      url: '/report/data',
      method: 'GET',
      dataType: 'json'
    }).done(function (data){
      view.init(data);
      console.log(data);
    });
  };
  init();


  function nav(){
    var a = $(this).attr('value');
    console.log('function');
    $.session.remove('placeH');
    $.session.remove('placeU');
    window.location.href = a
  };

  function freeBeds(){
    window.location.href = '/houses'
  }








//------------------PDF----------------------
  function pdf () {
    window.location.href = '/api/doc/houses'
  };

  function amount () {
    window.location.href = '/payments'
  };

};



$(function(){
  var model = new Model();
  var view = new View(model);
  var controller = new Controller(model, view);
});



$(".guests").click(function() {
    location = "/api/report/createReport"
});
