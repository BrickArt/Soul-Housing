function Model(data){
    var self = this;
  
    self.payments = [];
    self.pay;

    self.article = function(i, name, last, program, date, sum) {
        var thisDate = new Date(date)
        if(name) {
            name.toUpperCase();
        } else {
            name = 'Name';
        }

        if(last){
            last.toUpperCase();
        } else {
            last = 'Lastname';
        }

        if (!program || program === 'Select Program') program = 'program';
        var d = thisDate.getDate();
        var m = thisDate.getMonth() + 1;
        var y = thisDate.getFullYear();
        if(d<10) d = '0' + d;
        if(m<10) m = '0' + m;
        if(date){
            date = m + '.' + d + '.' + y;
        } else {
            date = 'Date'
        }
        if(sum && sum < 0) {
            sum = -sum;
        } else {
            sum = 0;
        }
        var result = '<div id="article_' + i + '" class="article">'+
                        '<button value="' + i + '" class="userBtn">'+
                        '<div class="gist">'+
                            '<h2>' + name + ' ' + last + '</h2>'+
                            '<p>' + program + '</p>'+
                        '</div>'+
                        '<div class="gistStatus">'+
                            '<div class="Activity">'+
                            '<p>' + date + '</p>'+
                            '<h3 class="price">' + sum + ' $</h3>'+
                            '</div><img src="img/svg/join.svg" alt="join" class="moreDetails"/>'+
                        '</div>'+
                        '</button>'+
                    '</div>'
        
        return result;
    }
  
};
  
  
  
function View(model){
    var self = this;
    
    self.init = function() {
        if(model.payments.length > 0){
            for (let i = 0; i < model.payments.length; i++) {
                const element = model.payments[i];
                $('.payBlock').append(model.article(i, element.name, element.lastname, element.program, element.date, element.sum))
            }
        } else {
            $('.payBlock').html('<h1>No overdue payments at the moment</h1>')
        }
    }

    self.editShow = function(id) {
        var pay = model.payments[id];
        var sum;
        if (!pay.program || pay.program === 'Select Program') pay.program = '';
        if (pay.date){
            var thisDate = new Date(pay.date)
            var d = thisDate.getDate();
            var m = thisDate.getMonth() + 1;
            var y = thisDate.getFullYear();
            if(d<10) d = '0' + d;
            if(m<10) m = '0' + m;
            if(pay.date){
                pay.date = m + '/' + d + '/' + y;
            } else {
                pay.date = ''
            }
        }
        if(pay.sum && pay.sum < 0) {
            sum = -pay.sum;
        } else {
            sum = 0;
        }
        $('.edit').hide()
        $('.editDate').val(pay.date);
        $('.editSum').val(sum);
        $('.done').val(id);
        $('.edit').slideDown()
        $('.delete').val(id);
        
        $('.article').removeClass('selectedPayment');
        $('#article_' + id).addClass('selectedPayment');
    }

    self.done = function(id) {
        $('#article_' + id).slideUp()
        $('.edit').slideUp()
        $('.edit').slideDown()
    }

    self.hideDown = function(id) {
        $('.edit').hide()
        $('#article_' + id).slideUp()
        return;
    }

};
  
  
  
function Controller(model, view){
    var self = this;
    var files;

    function init() {

        $.ajax({
            url: '/api/payments/pending',
            type: 'GET'
        }).done(function(data){
            model.payments = data;
            model.pay = data[0]
            view.init(data)
            if (data.length > 0){
                view.editShow(0)
            }
        })


    }

    init();

    $(document).delegate(".navBtn", "click", nav);
    $(document).delegate(".userBtn", "click", openEdit);

    $(document).delegate('input[type=file]', 'change', function(){
        files = this.files;
        console.log(this.files);
    });
    
    $(document).delegate( ".done", "click", done);
    $(document).delegate( ".editSave", "click", update);
    $(document).delegate( ".delete", "click", deletePay);
    $(document).delegate( ".addCancel", "click", cancel);
    
    
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

    function openEdit() {
        var id = $(this).val();
        model.pay = model.payments[id];
        view.editShow(id);
    };

    function done() {
        $('body').css('cursor', 'wait')
        var num = $(this).val()
        var id = model.pay._id;
        var now = new Date;
        var item = {
            date: now,
            status: 'done'
        }
        $.ajax({
            url: '/payments/edit/payment_' + id,
            type: 'post',
            data: item
        }).done(function(data){
            $('body').css('cursor', 'default')
            console.log(data)
            model.payments.slice(num, 1);
            if(model.payments[1]){
                console.log(model.payments[1])
                view.done(num)
                view.editShow(0)
                console.log('1')
            } else {
                return view.hideDown(num)
            }
            // window.location.href = '/pending';
        })
    };

    function update() {
        event.stopPropagation(); // Остановка происходящего
        event.preventDefault();  // Полная остановка происходящего
        var id = model.pay._id;
        var formEvent = $(this);
        // Создадим данные формы и добавим в них данные файлов из files
        var form = $('.edit').serializeArray();
    
        var data = new FormData();
    
        for (var key in form){
          data.append(form[key].name, form[key].value)
        }

        if (files){
          $.each( files, function( key, value ){
            data.append( key, value );
          });
        }
        
        $.ajax({
          url: '/payments/edit/payment_' + id,
          type: 'post',
          data: data,
          cache: false,
          dataType: 'json',
          processData: false, // Не обрабатываем файлы (Don't process the files)
          contentType: false, // Так jQuery скажет серверу что это строковой запрос
          statusCode: {
            200: function() {
              formEvent.html("Payment is saved").addClass('alert-success');
              console.log('update is done')
              window.location.href = '/pending'
            },
            403: function(jqXHR) {
              var error = JSON.parse(jqXHR.responseText);
              $('.error', formEvent).html(error.message);
            }
          },
          error: function( jqXHR, textStatus, errorThrown ){
              console.log('ОШИБКИ AJAX запроса: ' + textStatus );
          }
        }).done(function(data){
          console.log(data)
        })
    }

    function deletePay() {
        var id = model.pay._id;
        var num = $(this).val();
    
        $.ajax({
          url: '/payments/delete/payment_' + id,
          type: 'post'
        }).done(function(data){
            $('body').css('cursor', 'default')
            console.log(data)
            model.payments.slice(num, 1);
            if (model.payments[1]){
                view.done(num)
                view.editShow(0)
            } else {
                return view.hideDown(num)
            }
        })
    }

    function cancel() {
        window.location.href = '/payments';
    }
  
};
  
  
  
$(function(){
    var model = new Model();
    var view = new View(model);
    var controller = new Controller(model, view);
});
  