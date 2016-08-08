$(document).ready(function() {
    var clock;

    // Initiate FlipClock
    clock = $('.countdown__inner').FlipClock( difference, {
        clockFace: 'DailyCounter',
        countdown: true,
        language: "de",
        autostart: false,
        callbacks: {
            stop: function() {
                $('.message').html('The clock has stopped!')
            }
        }
    });

    // Calculate Seconds until next presentation
    var now = new Date().getTime();
    var next = new Date(2016, 9, 23, 19, 00);
    var difference = (next - now) / 1000;

    // Start the countdown
    clock.setTime(difference);
    clock.start();

});
