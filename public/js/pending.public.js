function Model(data){
    var self = this;
  
    self.payments = [];
    self.pay;
  
  
  };
  
  
  
  function View(model){
    var self = this;
    
    self.init = function() {
        for (let i = 0; i < model.payments.length; i++) {
            const element = model.payments[i];
            $('.payBlock').append(element.name + element.lastname + element.date + '</br>')
        }
    }
  
  
  
  
  };
  
  
  
  function Controller(model, view){
    var self = this;

    function init() {

        $.ajax({
            url: '/api/payments/pending',
            type: 'GET'
        }).done(function(data){
            model.payments = data;
            model.pay = data[0];
            view.init(data)
        })

    }

    init();

    $(document).delegate( ".navBtn", "click", nav);
  
    
  
    function nav(){
      var a = $(this).attr('value');
      console.log('function');
      $.session.remove('houseID');
      $.session.remove('userID');
      $.session.remove('room');
      $.session.remove('bed');
      $.session.remove('price');
      window.location.href = a
    };

  
 
  
  
  
  
  };
  
  
  
  $(function(){
    var model = new Model();
    var view = new View(model);
    var controller = new Controller(model, view);
  });
  