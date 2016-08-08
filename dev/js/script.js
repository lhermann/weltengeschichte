$(document).ready(function() {

    /*
     * Initiating the FlipClock Countdown
     */
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


    /*
     * Loop through the calendar days and insert the Livestream event
     */
    var calendar = $('#calendar');
    $('#calendar').find('td').each(function(){
        var id = $(this).attr("id");
        if( id !== undefined ) {
            // console.log(id);
            var i;
            var day = id.split("/")
            var title = "";

            for (i = 0; i < events.length; ++i) {

                var e = events[i];
                if( e.time.toDateString() === new Date(2016, day[0]-1, day[1]).toDateString() ) {

                    if( title ) title += "<br>";
                    var time = "<span class='color-primary'>" + e.time.getHours() + ":" + ("0" + e.time.getMinutes()).slice(-2) + "</span>";
                    title += time + " " + (i+1) + ". " + e.title;
                    // console.log(events[i]);

                }
            }

            if( title ) {
                $(this).html('<span class="eventday" data-toggle="tooltip" title="'+title+'">'+day[1]+'</span>');
            }

        }

    });


    $('.eventday').tooltip({'html': true})

});
