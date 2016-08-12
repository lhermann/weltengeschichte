$(document).ready(function() {
    /*
     * Reused variables
     */
    // var now = new Date();
    var now = getNow();

    function getNow() {
        return new Date();
        // return new Date(2016, 8, 23, 18, 59, 53);
    }


    /*
     * Determine the next and currently active event
     */
    var nextEvent,
        nextEventIndex,
        activeEvent,
        activeEventIndex;

    updateEventVars(now);
    function updateEventVars(now) {
        var nowLess90Min = new Date(now.getTime()-(90*60*1000));

        for (var i = 0; i < events.length; ++i) {
            if(events[i].time < now && events[i].time > nowLess90Min) {
                activeEvent = events[i];
                activeEventIndex = i;
                continue;
            } else if(events[i].time < now) {
                continue;
            } else {
                nextEvent = events[i];
                nextEventIndex = i;
                break;
            }
        }
    }


    /*
     * Set Up the FlipClock Countdown
     */
    var clock = $('#countdownTimer').FlipClock({
        clockFace: 'DailyCounter',
        countdown: true,
        language: "de",
        autoStart: false,
        callbacks: {
            stop: function() {
                setTimeout(function(){
                    reinitializeAppropriateDisplay()
                }, 1100);
            }
        }
    });


    /*
     * Detemine which display to show on the page
     */
    displayOnPage();
    function displayOnPage() {
        if( activeEvent ) {

            updateEpisode(activeEvent, activeEventIndex);
            $('#countdown').addClass('hidden');
            $('#liveEpisode').removeClass('hidden');

        } else if( nextEvent ) {

            updateEpisode(nextEvent, nextEventIndex);
            $('#liveEpisode').addClass('hidden');
            $('#countdown').removeClass('hidden');

            // Start the countdown
            clock.setTime(Math.ceil((nextEvent.time - now) / 1000));
            clock.start();

        }
    }

    /*
     * Function to update the prominently displayed episode title and number
     */
    function updateEpisode(episode, episodeIndex) {
        $('.episodeNumber')
            .text(episodeIndex+1)
            .next().text(episode.title);
    }

    /*
     * Recalculate present time and reinitialize appropriate display
     */
    function reinitializeAppropriateDisplay() {
        now = getNow();
        updateEventVars(now);
        displayOnPage();
    }

    /*
     * Do the reinitializing thing every 5 minutes
     */
    setInterval(function() {
        reinitializeAppropriateDisplay()
    }, 5*60*1000);



    /*
     * Populate Themenlist
     */
    var tl = $('#themenlist');
    var counter = 0;
    for (var i = nextEventIndex ? nextEventIndex : 0 ; i < events.length; ++i) {

        // Limit number of events listed
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
    $('#events').find('td[id]').each(function(){
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



    /**
     * Disable interaction with google maps until
     * it is being clicked upon directly
     *
     * @source http://stackoverflow.com/a/25904582/3346744
     */
    // Disable scroll zooming and bind back the click event
    var onMapMouseleaveHandler = function (event) {
        var that = $(this);

        that.on('click', onMapClickHandler);
        that.off('mouseleave', onMapMouseleaveHandler);
        that.find('iframe').css("pointer-events", "none");
    }

    var onMapClickHandler = function (event) {
        var that = $(this);

        // Disable the click handler until the user leaves the map area
        that.off('click', onMapClickHandler);

        // Enable scrolling zoom
        that.find('iframe').css("pointer-events", "auto");

        // Handle the mouse leave event
        that.on('mouseleave', onMapMouseleaveHandler);
    }

    // Enable map zooming with mouse scroll when the user clicks the map
    $('.embed-container').find('iframe').css("pointer-events", "none");
    $('.embed-container').on('click', onMapClickHandler);

});
