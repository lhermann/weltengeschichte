$(document).ready(function() {
    /*
     * Reused variables
     */
    // var now = new Date();
    var now = new Date(2016, 8, 13, 11, 20);


    // /*
    //  * Initiating the FlipClock Countdown
    //  */
    // var clock;

    // // Initiate FlipClock
    // clock = $('.countdown__inner').FlipClock({
    //     clockFace: 'DailyCounter',
    //     countdown: true,
    //     language: "de",
    //     autoStart: false,
    //     callbacks: {
    //         stop: function() {
    //             $('.message').html('The clock has stopped!')
    //         }
    //     }
    // });

    // // Calculate Seconds until next presentation
    // var next = new Date(2016, 8, 23, 19, 00);
    // var difference = (next - now) / 1000;

    // // Start the countdown
    // clock.setTime(difference);
    // clock.start();



    /*
     * Populate Themenlist
     */
    var tl = $('#themenlist');
    var counter = 0;
    for (var i = 0; i < events.length; ++i) {

        // Logical checks
        if(events[i].time < now) continue;
        counter++;
        if(counter > 5) {
            if(counter === 6) $(tl).append( $('<li class="list-group-item">...</li>') );
            continue;
        }

        // Generate list item
        var e = events[i];
        var days = ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."];
        var time = '<span class="badge">' + days[e.time.getDay()] + ' ' + e.time.getDate() + '.' + (e.time.getMonth()+1) + '. &bull; ' + e.time.getHours() + ":" + ("0" + e.time.getMinutes()).slice(-2) + '</span>';
        var li = $( '<li class="list-group-item">' + time + (i+1) + '. ' + e.title + '</li>' );
        $(tl).append(li);
    }


    /*
     * Loop through the calendar days and insert the Livestream event
     */
    $('#calendar').find('td[id]').each(function(){
        var id = $(this).attr("id");
        var calday = id.split("/");
        var caldate = new Date(2016, calday[0]-1, calday[1]);

        // Highlight Today
        if( now.toDateString() === caldate.toDateString() ) {
            $(this).addClass('today');
        }

        // Insert events
        if( id !== undefined ) {

            var title = "";

            for (var i = 0; i < events.length; ++i) {

                var e = events[i];
                if( e.time.toDateString() === caldate.toDateString() ) {

                    if( title ) title += "<br>";
                    var time = "<span class='color-primary'>" + e.time.getHours() + ":" + ("0" + e.time.getMinutes()).slice(-2) + "</span>";
                    title += time + " " + (i+1) + ". " + e.title;

                }
            }

            if( title ) {
                $(this).html('<span class="eventday" data-toggle="tooltip" title="'+title+'">'+calday[1]+'</span>');
            }

        }

    });


    $('.eventday').tooltip({'html': true})

});
