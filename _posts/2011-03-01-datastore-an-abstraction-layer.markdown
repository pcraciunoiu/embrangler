---
layout: post
title: "DataStore - an abstraction layer for storing data and processing requests"
summary: "Abstract data stores and request processing to avoid future maintenance hell."
tags: [javascript, data, offline storage, mozilla]
time: 8:11PM
---

__Update 2012/01:__ I still haven't started working on this project and I've heard much interest from others. Some have offered to pick up the project. I will update this post once the project finds a home.

## Table of contents

1. [Motivation](#motivation)
1. [Idea](#idea)
1. [From past to present, what now?](#from_past_to_present_what_now)
1. [What does better mean?](#what_does_better_mean)
1. [Why should you care?](#why_should_you_care)
1. [My scenario](#my_scenario)
1. [What worked for me](#what_worked_for_me)
1. [Proposed features](#proposed_features)
1. [Help!](#help)


## Motivation
I wrote an application which extensively used Ajax requests to communicate with the server. After a while I wanted to add [localStorage](http://developer.mozilla.org/en/dom/storage#localStorage). Though most actions were grouped together, there were still more than just a handful of Ajax requests that had to be changed. Then I thought what if I want to add IndexedDB later on...

... you can see where this is going: [maintenance hell.](http://www.brainstuck.com/2009/09/30/cartel/)

Then I thought: other people must be having similar problems. Hence...

## Idea
A library to unify all the different data storage/retrieval/sending/receiving API's such as XMLHttpRequest, WebSockets, localStorage, IndexedDB, and make it easier to use any number of them at once.

## From past to present, what now?
__Past:__ Before, all we had was AJAX requests. Really.

__To present:__ With the new technologies coming up in the HTML5 era, we've got localStorage and IndexedDB, WebSockets, node.js, and more. Hectic.

__What now?__ Don't you wish there was a _better way_ to send and receive data in the browser?

## What does better mean?
My general goals for this are:

1. Simple key/value store common abstraction.
1. Pluggable handlers for each type of send/receive.
1. Use other abstractions specified in each handler (library surfaces your API as well).
1. Straightforward way to define flow of data. [More on this later.](#flow_of_data)

Anything else you wish it could do?

## Why should you care?
Short answer: __maintenance, scalability, flexibility.__

As these technologies become widely supported, you will start seeing a common problem for websites heavily relying on AJAX (or any kind of data transfer without page reloads): _how do you take advantage of them without rewriting your entire codebase every time there's a new technology (API/storage engine/etc) coming out?_

## My scenario
The whole reason I got thinking about this was because it happened to me. And it was frustrating.

I had this client-side application using [jQuery.ajax requests](http://api.jquery.com/jQuery.ajax/), and I wanted to take advantage of localStorage for some of them, for data that I didn't need to get from the server on every page load.

I considered:

* Quick'n'dirty: Rewrite these pieces of the application to do both localStorage and ajax requests as fallback.
* __[Slightly better:](#what_worked_for_me)__ A library that's flexible enough for my purposes.
* [Ideal:](#proposed_features) A library that would allow me to enable/disable localStorage as an intermediary step on a per-request basis, make it easy to add IndexedDB support later, etc.

## What worked for me

The simpler thing I went with was a Data object with a couple of functions.

Example usage:
{% highlight javascript linenos %}
// main.js
window.data = new DataStore({
    url: '/fetch_new_data',
    // show a spinny tangy
    sync_before: function showSyncInProgress() { ... },
    // hide the spinny thingy, maybe show a fading notification
    sync_success: function showSyncDone() { ... },
    // hide the spinny thingy, definitely show some message
    sync_error: function showSyncFailed() { ... }
}

// example request
var i = 0;
window.data.process_request({
    ajax: {url: '/new_comment', type: 'POST',
           data: $('#comment-form').serialize()},
    key: 'comment_' + (i++),
    value: {'author': $('#comment-form .author').val(),
            'text': $('#comment-form .text').val()}
});
{% endhighlight %}

`ajax.data` and `value` are actually very similar, with an important exception in most applications (e.g. Django): the csrftoken. We don't need to store that in localStorage for every request. So I chose to keep the two completely separate. You could subclass DataStore and make it save you this extra work per request.

Below is an example implementation ([raw file](/files/code/datastore/datastore.js)):
{% highlight javascript linenos %}
/* This depends on Crockford's json2.js
 * from https://github.com/douglascrockford/JSON-js
 * Options:
 *     - url: function()
 *     - sync_before: function()
 *     - sync_success: function()
 *     - sync_error: function()
 */
function DataStore(options) {
    window.data = this;
    this.storage = window.localStorage;
    // date of last time we synced
    this.last_sync = null;
    // queue of requests, populated if offline
    this.queue = [];

    /**
     * Gets data stored at `key`; `key` is a string
     */
    this.get_data = function (key) {
        var str_data = this.storage.getItem(key);
        return JSON.parse(str_data);
    }

    /**
     * Sets data at `key`; `key` is a string
     */
    this.set_data = function (key, data) {
        var str_data = JSON.stringify(data);
        this.storage.setItem(key, str_data);
    }

    /**
     * Syncs data between local storage and server, depending on
     * modifications and online status.
     */
    this.sync_data = function () {
        // must be online to sync
        if (!this.is_online()) {
            return false;
        }

        this.last_sync = this.get_data('last_sync');

        // have we never synced before in this browser?
        if (!this.last_sync) {
            // first-time setup
            // ...
            this.last_sync = {};
            this.last_sync.when = new Date().getTime();
            this.last_sync.is_modified = false;
        }

        if (this.last_sync.is_modified) {
            var request_options;
            // sync modified data
            // you can pass callbacks here too
            while (this.queue.length > 0) {
                request_options = this.queue.pop();
                $.ajax(request_options.ajax);
            }
            this.set_data('queue', []);
            this.last_sync.is_modified = false;
        }
        // data is synced, update sync time
        this.set_data('last_sync', this.last_sync);

        // get modified data from the server here
       $.ajax({
            type: 'POST',
            url: options.url,
            dataType: 'json',
            data: {'last_sync': this.last_sync.sync_date},
            beforeSend:
                // here you can show some "sync in progress" icon
                options.sync_before,
            error:
                // an error callback should be passed in to this Data
                // object and would be called here
                options.sync_error,
            success: function (response, textStatus, request) {
                // callback for success
                options.sync_success(
                    response, textStatus, request);
            }
        });


    /**
     * Process a request. This is where all the magic happens.
     */
    this.process_request = function(request_options) {
        request_options.beforeSend();
        this.set_data(request_options.key, request_options.value);

        if (this.is_online()) {
            $.ajax(request_options.ajax);
        } else {
            this.queue.push(request_options);
            this.last_sync.is_modified = true;
            this.set_data('last_sync', this.last_sync);
            // there are issues with this, storing functions as
            // strings is not a good idea :)
            this.set_data('queue', this.queue);
        }

        request_options.processed();
    }

    /**
     * Return true if online, false otherwise.
     */
    this.is_online = function () {
        if (navigator && navigator.onLine !== undefined) {
            return navigator.onLine;
        }
        try {
            var request = new XMLHttpRequest();
            request.open('GET', '/', false);
            request.send(null);
            return (request.status === 200);
        }
        catch(e) {
            return false;
        }
    }
}
{% endhighlight %}

## Proposed Features

The example API isn't bad, but I think it could be better. Perhaps something along the lines of [Lawnchair](http://westcoastlogic.com/lawnchair/). As I'm writing this, I realize that writing an API is going to take longer than I'd like - therefore, this will serve as a teaser and food for thought. Feedback is welcome.

* Add an _.each_ method for iterating over retrieved objects (inspired by Lawnchair)
* Standard <code>DataStore.save, .get, .remove, etc.</code>
* Support for these "storage engines": localStorage, IndexedDB, send-to-server.
* Support for these request types: XMLHttpRequest, [WebSockets](http://en.wikipedia.org/wiki/WebSockets).
* Store, at the very least, primitive values and JSON.
* Include callbacks for various stages in the process of a request, similar to jQuery.ajax, e.g. <code>beforeSend, complete, success, error</code>. Figure out a good way to do this at each layer (minimize confusion).
* For each request, specify which layers and in what order to go through. For example, if you want to store something in localStorage, IndexedDB, and send it to the server, you could do it in that order or the reverse.
* Control whether to go to the next layer type depending on whether the previous succeeded or failed. Say, if you want to send the request to server but that fails, try localStorage as a fallback. Or the opposite.
* Include a <code>.get_then_store</code> shortcut for getting the data from layer A and storing it in layer B?
* Extensible: as easy as <code>DataStore.addLayer(layerName, layerHandler)</code>, where layerHandler (obviously) implements some common API along with exposing some of its own, if necessary (e.g. ability to query or find, for IndexedDB).
* As sending and getting data from the server means keeping _two or more_ databases in sync, collisions may arise. Provide a collision callback or some smart defaults for handling collision. E.g. sometimes server data is always right (trusted more than user data), other times local data is king.

## Help!
Hopefully my rant has gotten you thinking about the right approach. What would you like to see? What would make this something you would use and be happy with?

If you are interested in getting involved with coding this, contact me at paulc at mozilla.com.
