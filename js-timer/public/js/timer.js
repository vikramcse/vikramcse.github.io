(function() {
  'use strict';

  var timeInputMin = document.getElementById('time-input-min');
  var timeInputSec = document.getElementById('time-input-sec');

  var timeView = document.getElementById('time-view');

  var play = document.getElementById('play');
  var stop = document.getElementById('stop');

  var audio = new Audio('public/assets/ring.mp3');

  var timerTimeMin = 0;
  var timerTimeSec = 0;
  timeView.innerHTML = '00:00';
  var interval;

  for (var i = 0; i < 60; i++) {
    var opt = document.createElement('option');
    opt.setAttribute('value', i);
    opt.innerText = i;
    timeInputMin.appendChild(opt);
  }

  for (var i = 0; i < 60; i++) {
    var opt = document.createElement('option');
    opt.setAttribute('value', i);
    opt.innerText = i;
    timeInputSec.appendChild(opt);
  }


  timeInputMin.addEventListener('change', function(event) {
    var time = event.target.value.trim();

    if (time && time >= 0) {
      timerTimeMin = parseInt(time);
    }
  });

  timeInputSec.addEventListener('change', function(event) {
    var time = event.target.value.trim();

    if (time && time >= 0) {
      timerTimeSec = parseInt(time);
    }
  });

  play.addEventListener('click', function(event) {
    var seconds = (timerTimeMin * 60) + timerTimeSec;
    if (seconds > 0)
      startTimer(seconds);
  });

  stop.addEventListener('click', function(event) {
    clearInterval(interval);
    audio.pause();
    audio.load();
    init();
  });

  var init = function() {
    timeView.innerHTML = '00:00';
  };

  var startTimer = function startTimer(duration) {
    var timer = duration,
      minutes,
      seconds;

    interval = setInterval(function() {
      minutes = parseInt(timer / 60, 10)
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      timeView.innerHTML = minutes + ":" + seconds;

      if (--timer < 0) {
        timer = 0;
        audio.play();
      }
    }, 1000);
  }

})();
