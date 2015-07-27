$(document).ready(function () {

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
        }, 40000, 'linear', function () {
            moveClouds();
        });
        cloudStart[0] = actualStart;

        $('#cloud2').css({
            right: cloudStart[1]
        });
        $('#cloud2').animate({
            right: leftBound,
        }, 100000, 'linear', function () {
            moveClouds();
        });
        cloudStart[1] = actualStart;

        $('#cloud3').css({
            right: cloudStart[2]
        });
        $('#cloud3').animate({
            right: leftBound,
        }, 60000, 'linear', function () {
            moveClouds();
        });
        cloudStart[2] = actualStart;

        $('#cloud4').css({
            right: cloudStart[3]
        });
        $('#cloud4').animate({
            right: leftBound,
        }, 80000, 'linear', function () {
            moveClouds();
        });
        cloudStart[3] = actualStart;

        $('#cloud5').css({
            right: cloudStart[4]
        });
        $('#cloud5').animate({
            right: leftBound,
        }, 20000, 'linear', function () {
            moveClouds();
        });
        cloudStart[4] = actualStart;
    }

    moveClouds();

    $('#submit-button').click(function () {

        var emailInput = $('.email');
        var emailInputValue = emailInput.val();

        if (/.+@.+\..+/.test(emailInputValue)) {
            emailInput.val(emailInputValue.trim());
            $('form#signup').submit();

            $.post('http://formula-one.herokuapp.com/wh/signup', {
                    email: emailInputValue
                })
                .done(function (result) {
                    console.log(result);
                });
            
            $('#submit-button').attr('disabled', 'true');
            $('#submit-button').html('Thanks for signing up!');
        } else {
            
            $('.illustration-container').animate({
                backgroundColor: '#EF9A9A'
            });
            $('.illustration-container').animate({
                backgroundColor: '#d7ede6'
            });
            emailInput.closest('form').find('input[type=text], textarea').val('');
            emailInput.attr('placeholder', "That's not an email! Try again.");
        }
    });
});