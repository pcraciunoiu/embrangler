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
