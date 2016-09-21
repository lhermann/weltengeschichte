$(function() {
    // Get the form.
    var form = $('#ajaxForm');

    $(form).validate({
        ignore: ".ignore",
        rules: {
            'g-recaptcha-response': 'required'
        },
        messages: {
            captcha: "Captcha ist erforderlich."
        }
    });

    // Get the messages div.
    var formMessages = $('#form-messages');

    // Set up an event listener for the contact form.
    $(form).submit(function(event) {

        // Stop the browser from submitting the form.
        event.preventDefault();
        // console.log(grecaptcha.getResponse().length);

        if( form.valid() ) {

            $(form).removeClass('success error');
            $(form).addClass('spinner');

            // Submit the form using AJAX.
            $.ajax({
                type: 'POST',
                url: $(form).attr('action'),
                data: $(form).serialize()
            }).done(function(response) {

                console.log(response);

                // Make sure that the form div has the 'success' class.
                $(form).removeClass('spinner error');
                $(form).addClass('success');

                // Clear the form.
                cleanupForm()

            }).fail(function(data) {

                // Make sure that the form div has the 'error' class.
                $(form).removeClass('spinner success');
                $(form).addClass('error');

                // Clear the form.
                cleanupForm()

            });
        }
    });

    function cleanupForm() {
        $('#inputEmail').val('');
        $('#inputName').val('');
        $('#inputMessage').val('');
        grecaptcha.reset();
    }
});
