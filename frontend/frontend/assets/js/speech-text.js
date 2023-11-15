var recognition;
var recognizing = false
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
                
    recognition.onstart = function () {
    recognizing = true;
    };
                
    recognition.onerror = function (event) {
    console.error(event.error);
    };
          
    recognition.onend = function () {
      recognizing = false;
     };
                
    recognition.onresult = function (event) {
    var final_transcript = '';
    var interim_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
         final_transcript += event.results[i][0].transcript + ' ';
        } else {
          interim_transcript += event.results[i][0].transcript;
          }
      }
     // Update the textarea with final results
    document.querySelector('.message-input').value += final_transcript;
     // Update the textarea with interim results
    document.querySelector('.message-input').setAttribute('placeholder', interim_transcript);
    };
    } else {
      alert("Your browser does not support voice recognition.");
    }
                
    document.getElementById('start-record-btn').onclick = function () {
    if (recognizing) {
      recognition.stop();
      return;
    }
    recognition.lang = 'en-US';
    recognition.start();
    }