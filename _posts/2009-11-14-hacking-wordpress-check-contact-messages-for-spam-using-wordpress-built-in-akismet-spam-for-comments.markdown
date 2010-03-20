--- 
wordpress_id: 128
layout: post
title: "Hacking Wordpress: check contact messages for spam using Wordpress' built-in Akismet spam for comments"
wordpress_url: http://embrangler.com/?p=128
summary: If you want a contact form that uses Akismet instead of Captcha to filter spam.
---
This article explains how to easily create a contact form with spam filtering in Wordpress.

__Duration:__ 30 minutes<br/>
__Demo:__ [http://awesomemath.org/](http://awesomemath.org/) (see footer)<br/>
__Software:__ Wordpress 2.8.6 (latest as of this writing)<br/>

Don't you wish there was a nice and easy Wordpress plugin to add a contact form anywhere on your site, with the benefit of spam filtering _without_ Captchas? I do. And that's what prompted me to do things this way.

_Why not use Captchas?_ Hey, don't take my word for it: [other people have spent time showing why](http://www.seomoz.org/blog/captchas-affect-on-conversion-rates "Captcha effect on conversion rates"). In short, Captchas are not user friendly, and, frankly, to me, they are frustrating. Every time I want to send a comment or submit some data to a website - bam, I have to spend that extra few to stare at some deformed text. I hate Captchas.

_So what instead?_ Well, you're in luck: Wordpress offers a free, well-integrated spam service called [Akismet](http://akismet.com/ "Akismet spam service"), which works really well, and is [integrated into Wordpress by default](http://codex.wordpress.org/Plugins/Akismet "Wordpress 2.0 or later comes with Akismet").

This article shows you how to quickly integrate Akismet into a contact form, and it's all built from scratch.

## Step 1: The frontend (HTML + PHP + jQuery)

I needed my contact form to be on every page (in the footer), so I created a widget. I used the ExecPHP plugin to include PHP code in it. I also limit submission to 1 every so often, based on a cookie. I also use jQuery to submit this form with AJAX for a snappy sense of response ;)

### Step 1a: The HTML and PHP:
{% highlight html %}
<div id="contact_thanks" <?php
  if (!$_GET['contacted'] && !$_COOKIE['examplesite_contact'])
    echo 'style="display:none;"';
?>>
    Thank you for contacting example site!
</div>
<?php if (!$_GET['contacted'] && !$_COOKIE['examplesite_contact']) { ?>
<form id="contact_form" method="post" action="">
    <div id="contact_msgbox" style="display:none;">
        Put contact information here.
    </div>
    <div id="contact_error" style="display: none">
        <a href="#" class="contact_error_close" "Dismiss message">x</a>
        We couldn't submit your form for one or more of the following reasons:
        <ul>
            <li>All fields must be longer than 5 characters</li>
            <li>You must provide a valid email</li>
        </ul>
        Please resolve the above problems for the highlighted fields
        and try again.
    </div>
    <div id="contact_info" style="display: none">
        <a href="#" class="contact_error_close" "Dismiss message">x</a>
        <p><strong>E-mail:</strong> <a href="#" id="contact_email_addr">
        <img src="/photos/email.png" alt="email" /></a><br/>
    </div>
    <label id="contact_message_label">Message:
        <br/>
        <textarea rows="5" cols ="25" name="contact_message"
            id="contact_message" tabindex="3" ></textarea>
    </label>
    <label>Name:
        <br/>
        <input type="text" name="contact_name" tabindex="1"
            id="contact_name" />
    </label>
    <br/>
    <label>Email:
        <br/>
        <input type="text" name="contact_email" tabindex="2"
           id="contact_email" />
    </label>
    <div class="btn-panel">
        <a class="btn btn-brown" href="#" id="contact_form_info">
            Contact Info
        </a>
        <input type="submit" name="contact" value="Submit"
            class="btn btn-green" />
    </div><!-- btn-panel -->
</form>
<?php } ?>
{% endhighlight %}

That may look a bit complicated, but let's strip this down to understand what's going on. At first, we wish to display a thank you message if the form was submitted -- either recently (through a cookie), or right after submission (using the URL parameter "contacted"). So, we hide the thank you message in any other situation.
If the form hasn't been submitted recently, we show it. This, too, breaks down into parts:

* I included a contact information box, too, but you may find that unnecessary. See the [demo](http://awesomemath.org) to get the picture.
* I also include an error message box, to help validate the submitted contact information.
* Finally, the inputs themselves, _Name_, _Email_ and _Message_, each using tabindex attributes to ensure that the user fills them out in this order. Since, in my layout, the `<textarea>` comes before the two `<input>`, I need to use tabindex. I'm using this layout because I intend to float the `<textarea>` to the right. Then, the submit button and contact info button are grouped together in `&div class="btn-panel">`

### Step 1b: The jQuery:
{% highlight javascript %}
var MIN_FIELDLENGTH = 5;
var EMAIL_PREFIX = 'me';
var EMAIL_END = 'examplesite.com';
jQuery(document).ready(function($) {
    function is_valid_email_address(email_address) {
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        return pattern.test(email_address);
    }
    function validate_submission(field) {
        if (field) {
            var fields = [field];
        }
        else {
            var fields = ['name', 'email', 'message'];
        }
        var returnval = true;
        var text;
        for (var i in fields) {
            text = $('#contact_'+fields[i]).val();
            minlen = MIN_FIELDLENGTH;
            if (fields[i] == 'message') minlen *= 10;
            if ((text.length < minlen)
                || ((fields[i] == 'email')
                && !is_valid_email_address($('#contact_'+fields[i]).val())))
            {
                $('#contact_'+fields[i]).attr('class', 'chighlight');
                returnval = false;
            }
            else {
                $('#contact_'+fields[i]).attr('class', '');
            }
        };
        return returnval;
    }
    $('#contact_name').keypress(function() {
        validate_submission('name');
    });
    $('#contact_email').keypress(function() {
        validate_submission('email');
    });
    $('#contact_message').keypress(function() {
        validate_submission('message');
    });

    $('#contact_form').submit(function () {
        if (validate_submission()) {
            var formInput = $(this).serialize();
            $.post('/contact_form.php', formInput, function(data){
                $('#contact_form').hide();
                $('#contact_thanks').show();
            });
        }
        else if (showing_message != 1) {
            showing_message = 1;
            $('#contact_msgbox').html($('#contact_error').html());
            $('#contact_msgbox').addClass('error')
                                .removeClass('message').show();
            if (msg_timeout) clearTimeout(msg_timeout);
            msg_timeout = setTimeout(function(){ close_msgbox(); }, 10000);
        }
        return false;
    });

    $('#contact_form_info').click(function () {
        if (showing_message == 2) {
            close_msgbox();
            return false;
        }
        $('#contact_msgbox').html($('#contact_info').html());
        $('#contact_msgbox').removeClass('error')
                            .addClass('message').show();
        showing_message = 2;
        if (msg_timeout) clearTimeout(msg_timeout);
        msg_timeout = setTimeout(function(){ close_msgbox(); }, 10000);
        return false;
    });

    function close_msgbox() {
        $('#contact_msgbox').hide();
        showing_message = 0;
        return false;
    }

   function email_link() {
        window.location = "mailto:" + EMAIL_PREFIX + "@" + EMAIL_END;
        return false;
    }
    $('#contact_msgbox a:first-child').live('click', close_msgbox);
    $('#contact_email_addr').live('click', function() {
      return email_link();
    });
});
{% endhighlight %}

Okay. First we have a constant for the minimum length of each field. In the validation function, `validate_submission()`, fields get checked against this length. There's a special case for the `<textarea>`, which has a minimum length of the constant value * 10 (times ten). Then two constants making up the email address for clicking on the image -- this is nice, it keeps the functionality of the `mailto:` link, but protects it from spam. I doubt bots are smart enough to do string concatenation for every site they visit :)

* `is_valid_email_address()` validates an email using a regex. There's tons of these on the web. I wanted mine to be not too long, but long enough :)
* `validate_submission()` either valides a certain field, or validates the entire form (latter if no parameters are passed
* The next three are jQuery events for `onkeypress` in the form fields. They just call the validation function for each field. To make this even better (but a bit more CPU intensive), you may consider additional events on `blur` or `change`.
* Next up, the submit function. This validates the entire form and submits data through ajax, using [jQuery's built-in $.post call](http://docs.jquery.com/Ajax/jQuery.post). Ideally, you should expect some kind of data response after posting, and show a thank you message based on that (or error otherwise) to ensure best functionality for the user, but I didn't bother.
* Finally, we have the close button functionality, with a timeout. At the end, we add events for email and bindings for the close button. You can read about all of these in [jQuery's wonderful documentation](http://docs.jquery.com/Main_Page).

## Step 2: The backend (PHP)
This is fairly short :)

{% highlight php %}
<?php
define('DEFAULT_POST_ID', post_id_here);
/* Contact form handling here */
if ($_POST['contact']) {
    require_once( '/wp-load.php' );
    $contact_invalid = array();
    $contact_data = array();
    $contact_data['name'] = filter_var($_POST['contact_name'],
        FILTER_SANITIZE_STRING);
    $contact_data['message'] = filter_var($_POST['contact_message'],
        FILTER_SANITIZE_STRING);
    $contact_data['email'] = filter_var($_POST['contact_email'],
        FILTER_VALIDATE_EMAIL);
    foreach ($contact_data as $contact_key => $contact_field) {
        if (!$contact_field) {
            $contact_invalid[$contact_key] = true;
        }
    }

    if (!$contact_invalid && !$_COOKIE['awesomemath_contact']) {
        $comment_post_ID = DEFAULT_POST_ID;
        $comment_author = $contact_data['name'];
        $comment_author_email = $contact_data['email'];
        $comment_author_url = '';
        $comment_content = $contact_data['message'];
        $comment_type = '';
        $comment_parent = 0;
        $user_ID = 0;

        $commentdata = compact('comment_post_ID', 'comment_author',
            'comment_author_email', 'comment_author_url', 'comment_content',
            'comment_type', 'comment_parent', 'user_ID');
        $comment_id = wp_new_comment( $commentdata );
        $comment_approved = $wpdb->get_results(
           "SELECT (comment_approved = 'spam')
                AS spam
            FROM wp_comments
            WHERE comment_ID = '{$comment_id} LIMIT 1;'"
        );
        // allow contact again after one hour
        setcookie('awesomemath_contact', 1, time() + 3600, '/');
        if ($comment_id && !$comment_approved->spam) {
            // not spam!
            $contact_headers = 
            "From: {$contact_data['name']} <{$contact_data['email']}>\r\n\\";
            wp_mail(get_option('admin_email'),
                'Examplesite Contact Form Message'
                , $contact_data['message'], $contact_headers);
            $contact_headers =
                "From: Examplesite <me@examplesite.com>\r\n\\";
            wp_mail("{$contact_data['name']} <{$contact_data['email']}>",
                'Thank you for contacting Examplesite!',
                'Thank you for contacting us. We will get back to you shortly.

Below is a copy of your message.
If for any reason we do not get back to you soon, simply reply to this email.

------------------------------

' . $contact_data['message'], $contact_headers);
            // redirect to prevent resubmission
            header("Location: {$_SERVER['HTTP_REFERER']}?contacted=1");
            die;
        }
    }
}
{% endhighlight %}

See? That wasn't so bad. Let me summarize the above.
First, we validate data once again by using a simple php filter. See [this easy tutorial](http://net.tutsplus.com/tutorials/php/getting-clean-with-php/) for the basics of php filters.

Then, we use Wordpress' built-in comment system to post contact messages as comments. We then check to see if the comments were potentially marked as spam. If they weren't, we send an email to the site admin (it can be any email, really), with the contact message. Make sure to set DEFAULT_POST_ID to a post against which you can file these "comments".

I should add that this contact_form.php file is also included in my theme to support no-JS submission. But, really, nowadays, unless you're on your phone, 99.9% of users have Javascript enabled in their web browsers.

If I had time, I would turn this into a plugin with options and such. Wishlist:

* A separate panel for administering contact form messages, similar to the built-in WP comments.
* A built-in easy-to-customize widget
* Custom fields


All-in-all, this was a quick and easy way to safely implement a contact form on a site without the hassle of using multiple plugins, having Captchas, or the inflexibility of requiring a subject line for the contact message (yet another reason I chose to implement my own contact form from scratch).

Hope you found this article useful. Feedback welcome!
