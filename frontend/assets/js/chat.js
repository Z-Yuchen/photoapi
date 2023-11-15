var checkout = {};

$(document).ready(function() {
  var $messages = $('.messages-content'),
    d, h, m,
    i = 0;

  $(window).load(function() {
    $messages.mCustomScrollbar();
    insertResponseMessage('Hi there, I\'m your personal Concierge. How can I help?');
  });
  $('#search-form').click(searchPhotos); 
  $('#upload-form').click(uploadPhotos); 


  function updateScrollbar() {
    $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
      scrollInertia: 10,
      timeout: 0
    });
  }

  function setDate() {
    d = new Date()
    if (m != d.getMinutes()) {
      m = d.getMinutes();
      $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
    }
  }

  function callChatbotApi(message) {
    // params, body, additionalParams
    return sdk.chatbotPost({}, {
      messages: [{
        type: 'unstructured',
        unstructured: {
          text: message
        }
      }]
    }, {});
  }

  function insertMessage() {
    msg = $('.message-input').val();
    if ($.trim(msg) == '') {
      return false;
    }
    $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
    setDate();
    $('.message-input').val(null);
    updateScrollbar();

    callChatbotApi(msg)
      .then((response) => {
        console.log(response);
        var data = response.data;

        if (data.messages && data.messages.length > 0) {
          console.log('received ' + data.messages.length + ' messages');

          var messages = data.messages;

          for (var message of messages) {
            if (message.type === 'unstructured') {
              insertResponseMessage(message.unstructured.text);
            } else if (message.type === 'structured' && message.structured.type === 'product') {
              var html = '';

              insertResponseMessage(message.structured.text);

              setTimeout(function() {
                html = '<img src="' + message.structured.payload.imageUrl + '" witdth="200" height="240" class="thumbnail" /><b>' +
                  message.structured.payload.name + '<br>$' +
                  message.structured.payload.price +
                  '</b><br><a href="#" onclick="' + message.structured.payload.clickAction + '()">' +
                  message.structured.payload.buttonLabel + '</a>';
                insertResponseMessage(html);
              }, 1100);
            } else {
              console.log('not implemented');
            }
          }
        } else {
          insertResponseMessage('Oops, something went wrong. Please try again.');
        }
      })
      .catch((error) => {
        console.log('an error occurred', error);
        insertResponseMessage('Oops, something went wrong. Please try again.');
      });
  }
  
  function searchPhotos() {
    var query = $('#search-query').val();
    if ($.trim(query) == '') {
      alert('Please enter a search query.');
      return false;
    }}


  function uploadPhotos() {
    var file = $('#photo-upload')[0].files[0];
    var customLabels = $('#custom-labels').val();
    if (!file) {
      alert('Please select a photo to upload.');
      return false;
    }

    var formData = new FormData();
    formData.append('photo', file);

    // AJAX request to PUT /photos endpoint
    const form = document.querySelector('search-form');
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        // Assuming you have an input field with the id 'photo-upload' for selecting files
        const fileInput = document.getElementById('photo-upload');
        const customLabelsInput = form.elements.query; // Assuming your custom labels input has the name 'query'
    
        const formData = new FormData();
        formData.append('photo', fileInput.files[0]); // Assuming only one file is selected
    
        const customLabels = customLabelsInput.value;
        formData.append('customLabels', customLabels);
    
        $.ajax({
            url: '/photos', // Replace with your actual endpoint
            type: 'PUT',
            headers: {
                'x-amz-meta-customLabels': customLabels
            },
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                alert('Photo uploaded successfully.');
                // You may want to add logic to handle the success response
            },
            error: function () {
                alert('Error occurred while uploading.');
                // You may want to add logic to handle the error response
            }
        });
    
        // Assuming you want to clear the input fields after submission
        fileInput.value = '';
        customLabelsInput.value = '';
    });

  $('.message-submit').click(function() {
    insertMessage();
  });

  $(window).on('keydown', function(e) {
    if (e.which == 13) {
      insertMessage();
      return false;
    }
  })

  function insertResponseMessage(content) {
    $('<div class="message loading new"><figure class="avatar"><img src="https://media.tenor.com/images/4c347ea7198af12fd0a66790515f958f/tenor.gif" /></figure><span></span></div>').appendTo($('.mCSB_container'));
    updateScrollbar();

    setTimeout(function() {
      $('.message.loading').remove();
      $('<div class="message new"><figure class="avatar"><img src="https://media.tenor.com/images/4c347ea7198af12fd0a66790515f958f/tenor.gif" /></figure>' + content + '</div>').appendTo($('.mCSB_container')).addClass('new');
      setDate();
      updateScrollbar();
      i++;
    }, 500);
  }

}});
