$(document).ready(function() {
  $('#scroll').scrollspy();

  var cloudStart = [600, 900, 300, 0, 1200];

  var actualStart = -200;

  var leftBound = window.innerWidth;
  leftBound = leftBound.toString() + 'px';

  for (var i = 0; i < cloudStart.length; i++) {
    if (cloudStart[i] > leftBound) {
      cloudStart[i] = cloudStart[i] % leftBound;
    }
  }

  function moveClouds() {
    $('#cloud1').css({
      right: cloudStart[0]
    });
    $('#cloud1').animate({
      right: leftBound,
    }, 40000, 'linear', function() {
      moveClouds();
    });
    cloudStart[0] = actualStart;

    $('#cloud2').css({
      right: cloudStart[1]
    });
    $('#cloud2').animate({
      right: leftBound,
    }, 100000, 'linear', function() {
      moveClouds();
    });
    cloudStart[1] = actualStart;

    $('#cloud3').css({
      right: cloudStart[2]
    });
    $('#cloud3').animate({
      right: leftBound,
    }, 60000, 'linear', function() {
      moveClouds();
    });
    cloudStart[2] = actualStart;

    $('#cloud4').css({
      right: cloudStart[3]
    });
    $('#cloud4').animate({
      right: leftBound,
    }, 80000, 'linear', function() {
      moveClouds();
    });
    cloudStart[3] = actualStart;

    $('#cloud5').css({
      right: cloudStart[4]
    });
    $('#cloud5').animate({
      right: leftBound,
    }, 20000, 'linear', function() {
      moveClouds();
    });
    cloudStart[4] = actualStart;

    $('#cloud6').css({
      right: cloudStart[5]
    });
    $('#cloud6').animate({
      right: leftBound,
    }, 9000, 'linear', function() {
      moveClouds();
    });
    cloudStart[5] = actualStart;

    $('#cloud7').css({
      right: cloudStart[6]
    });
    $('#cloud7').animate({
      right: leftBound,
    }, 12000, 'linear', function() {
      moveClouds();
    });
    cloudStart[6] = actualStart;
  }

  moveClouds();

})
