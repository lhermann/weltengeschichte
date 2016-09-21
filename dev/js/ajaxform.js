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

            // Submit the form using AJAX.
            $.ajax({
                type: 'POST',
                url: $(form).attr('action'),
                data: $(form).serialize()
            }).done(function(response) {
                console.log(response);

                // Make sure that the formMessages div has the 'success' class.
                // $(formMessages).removeClass('error');
                // $(formMessages).addClass('success');

                // Set the message text.
                // $(formMessages).text(response);

                // Clear the form.
                // $('#name').val('');
                // $('#email').val('');
                // $('#message').val('');
            })
        }

        // TODO
        // - Ajax Request
        // - Spinner
        // - Ajax response
    });

    // TODO: The rest of the code will go here...
});
