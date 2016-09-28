$(document).ready(function() {
    /*
     * Import and parse events.json
     */
    var events = myjson["events"];
    for (var i = 0; i < events.length; ++i) {
        events[i].time = new Date(events[i].time);
    }


    /*
     * Reused variables
     */
    function getNow() {
        // return new Date(2016, 8, 23, 18, 59, 53).getTime();
        if(!Date.now) {
            return new Date().getTime();
        } else {
            return Date.now()
        }
    }

    // get the conf opbject from the html body
    var conf;
    if( typeof window.conf === 'undefined' ) {
        conf = {
            live: false,
            reload: 123
        }
    } else {
        conf = window.conf;
    }

    /*
     * Do an AJAX call (every minutes) for trigger.txt and show the reload button if it returns '1'
     */
    setInterval(function() {

        $.ajax({
            url: "/conf.json?" + (Math.floor(Math.random()*90000) + 10000)
        }).done(function( data ) {
            if( conf === null ) {
                // first ajax call, do nothing
            } else if ( !conf.live && data.live ) {
                // livestream went live -> reload button
                showReloadButton()
            } else if ( conf.reload !== data.reload ) {
                // request extraudinary reload -> reload button
                showReloadButton()
            }
            conf = data;
        });

    }, 60*1000);


    /*
     * Determine the next and currently active event
     */
    var nextEvent,
        nextEventIndex,
        activeEvent,
        activeEventIndex;

    updateEventVars(getNow());
    function updateEventVars(now) {
        var ninetyMinFuture = new Date(now-(90*60*1000));
        var oneSecPast = new Date(now+(1*1000));

        for (var i = 0; i < events.length; ++i) {
            if(events[i].time < oneSecPast && events[i].time > ninetyMinFuture) {
                // within the first 90 minutes of an event start
                activeEvent = events[i];
                activeEventIndex = i;
                continue;
            } else if(events[i].time.getTime() < now) {
                // past event
                continue;
            } else if(conf.live && !activeEvent) {
                activeEvent = events[i];
                activeEventIndex = i;
                break;
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
                showReloadButton();
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
            clock.setTime(Math.ceil((nextEvent.time.getTime() - getNow()) / 1000));
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
        updateEventVars(getNow());
        displayOnPage();
    }

    /*
     * Show the reload button
     */
    function showReloadButton() {
        $('#reloadButton').removeClass('hidden');
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
    var tl = $('#eventslist');
    var counter = 0;
    var maxEpisodes = 6;
    for (var i = nextEventIndex ? nextEventIndex : 0 ; i < events.length; ++i) {

        // Limit number of events listed
        counter++;
        if(counter > maxEpisodes) {
            if(counter === maxEpisodes+1) $(tl).append( $('<li class="">...</li>') );
            continue;
        }

        // Generate list item
        var e = events[i];
        var days = ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."];
        var time = '<span class="badge">' + days[e.time.getDay()] + ' ' + e.time.getDate() + '.' + (e.time.getMonth()+1) + '. &bull; ' + e.time.getHours() + ":" + ("0" + e.time.getMinutes()).slice(-2) + ' &bull; 90min</span>';
        var li = $( '<li class="">' + time + (i+1) + '. ' + e.title + '</li>' );
        $(tl).append(li);
    }


    /*
     * Loop through the calendar days and insert the Livestream event
     */
    var today = new Date();
    $('#events').find('td[id]').each(function(){
        var id = $(this).attr("id");
        var calday = id.split("/");
        var caldate = new Date(2016, calday[0]-1, calday[1]);

        // Highlight Today
        if( today.toDateString() === caldate.toDateString() ) {
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
