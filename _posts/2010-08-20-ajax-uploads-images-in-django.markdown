--- 
layout: post
title: "Django and AJAX image uploads"
summary: How to upload images in django through AJAX, with graceful degradation and a smooth UI.
tags: [mozilla, webdev, django, upload, ajax, SUMO]
---

Table of contents:

* [Demo](#demo)
* [Summary](#summary)
* [Server side (Django)](#server_side_django)
	* [Model](#model)
	* [Form](#form)
	* [View](#view_uploading_image_saving_to_disk)
	* [Generating the thumbnail with PIL](#generating_the_thumbnail_with_pil)
* [Client side](#client_side)
* [Graceful degradation](#a_note_about_graceful_degradation)

## Demo

* [Screencast](http://screencast.com/t/ZGI0NTA3)

* Screenshots:

	* The upload form, empty and ready for action:
	<div class="img-wrap"><div class="img">
	    <img alt="Empty upload form" src="/images/upload/upload_1.png" title="Empty upload form">
	</div></div>

	* Browsing for an image:
	<div class="img-wrap"><div class="img">
	    <img alt="Browsing for an image" src="/images/upload/upload_2.png" title="Browsing for an image">
	</div></div>

	* Uploading the image (in progress):
	<div class="img-wrap"><div class="img">
	    <img alt="Uploading the image" src="/images/upload/upload_3.png" title="Uploading the image">
	</div></div>

	* The image is uploaded:
	<div class="img-wrap"><div class="img">
	    <img alt="Uploaded image" src="/images/upload/upload_4.png" title="Uploaded image">
	</div></div>

	* Deleting the image would show a similar progress block as uploading:
	<div class="img-wrap"><div class="img">
	    <img alt="Delete the image" src="/images/upload/upload_5.png" title="Delete the image">
	</div></div>


## Summary

In this post, we'll go through how to get AJAX uploads to work with Django, including:

* [csrf protection](http://en.wikipedia.org/wiki/Cross-site_request_forgery) with [Django's forms](http://docs.djangoproject.com/en/dev/topics/forms/)
* [graceful degradation](http://en.wikipedia.org/wiki/Graceful_degradation) (see also [unobtrusive JavaScript](http://en.wikipedia.org/wiki/Unobtrusive_JavaScript))
* [uploading files in Django](http://docs.djangoproject.com/en/dev/topics/http/file-uploads/)
* thumbnail generation with [PIL](http://www.pythonware.com/products/pil/)
* cross-browser uploading of files through AJAX

__Note:__ I'm planning to add upload progress. If you can't wait for that post (understandably), there are several ways to go about it:

* If your site isn't using multiple webheads, you can just ask the webhead to get you the size of what's been uploaded so far. Since Django can read in chunks, it can tell you how much has been processed. See [this post](http://fairviewcomputing.com/blog/2008/10/21/ajax-upload-progress-bars-jquery-django-nginx/) for implementation ideas.
* Or, regardless of the server setup, you can use the File API (in Firefox and Chrome) - easier, cleaner, no server-side interaction required.
* Other multi-webhead approaches: writing progress to a file shared among them, or saving directly to a shared folder and e.g. returning the size uploaded so far.


## Server side (Django)
First, we'll look at how the server handles files sent to it.


### Model
I created an app called `upload` with an ImageAttachment model, like so:

[apps/upload/models.py](http://github.com/pcraciunoiu/kitsune/blob/466b65ad885118f0fb8d14f706ea9efa21f49edd/apps/upload/models.py):
{% highlight python %}
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import generic
from django.db import models


class ImageAttachment(models.Model):
    """A tag on an item."""
    file = models.ImageField(upload_to=settings.IMAGE_UPLOAD_PATH)
    thumbnail = models.ImageField(upload_to=settings.THUMBNAIL_UPLOAD_PATH)
    creator = models.ForeignKey(User, related_name='image_attachments')
    content_type = models.ForeignKey(ContentType)
    object_id = models.PositiveIntegerField()

    content_object = generic.GenericForeignKey()

    def __unicode__(self):
        return self.file.name
{% endhighlight %}

This represents an image attached to a piece of content (using a generic foreign key). Pretty basic stuff. The form is ridiculously simple:


### Form
[apps/upload/forms.py](http://github.com/pcraciunoiu/kitsune/blob/466b65ad885118f0fb8d14f706ea9efa21f49edd/apps/upload/forms.py):
{% highlight python %}
from django import forms


class ImageUploadForm(forms.Form):
    """Image upload form."""
    image = forms.ImageField()
{% endhighlight %}


### View (uploading image, saving to disk)
The view is a bit more complicated, so I won't go into the details. But you can [have a look at the entire app](http://github.com/pcraciunoiu/kitsune/blob/466b65ad885118f0fb8d14f706ea9efa21f49edd/apps/upload) and [contact me](#footer) if you have questions. Basically, the view does the file upload as you see in [Django's documentation](http://docs.djangoproject.com/en/dev/topics/http/file-uploads/). The function [`create_image_attachment`](http://github.com/pcraciunoiu/kitsune/blob/466b65ad885118f0fb8d14f706ea9efa21f49edd/apps/upload/utils.py#L9) deals with the part about saving a file to disk.


### Generating the thumbnail with PIL
There is also a task for generating thumbnails, which is offloaded from the web server thread to improve performance. If you don't need that, you can just call generate_thumbnail directly, it's defined [here](http://github.com/pcraciunoiu/kitsune/blob/466b65ad885118f0fb8d14f706ea9efa21f49edd/apps/upload/tasks.py).


## Client side
Now, the magical JavaScript!

We're using jQuery on [SUMO](http://support.mozilla.com), so I wrote two jQuery extensions:

* jQuery.fn.ajaxSubmitInput(options) -- wraps an `<input type="file">` in a `<form>` and creates an `<iframe>` to which that form posts. To get around Django's csrf protection, it also copies the `csrfmiddlewaretoken` hidden input into the form. You can't clone a file input for security reasons (nor can you change or access its value), so you need to wrap it in a form.
* jQuery.fn.wrapDeleteInput(options) -- wraps an `input<type="submit">` in a `<form>` and creates an `<iframe>` to which that form posts.

These two pretty much summarize the process:

1. when the user changes the value of the file input, post the form

	* show some progress while the file is uploading
1. once the file is done uploading, show a thumbnail of the image

	* also create the delete input and wrap it in the form using `wrapDeleteInput()`
1. when the user clicks on the delete button, post the action

	* show some progress while the file is being deleted


## A note about graceful degradation

To degrade gracefully, you want to post the file input to whatever view you're including it to. And you can just do something like:
{% highlight python %}
def some_view(request):
    # ...
    # NOJS: upload image
    if 'upload_image' in request.POST:
        upload_images(request, obj)
    # ...
{% endhighlight %}

Thanks for reading, hope it helps!
