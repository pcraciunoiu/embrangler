---
layout: post
title: "Caching Django views with nginx and memcache"
summary: "Improve the performance of your static pages by serving them without hitting Django."
tags: [django, performance, nginx, memcache, scaling]
time: 12:30AM
---

## Table of contents

* [Summary](#summary)
* [Motivation](#motivation)
* [Pros and cons](#pros_and_cons)
* [Results](#results)
* [Alternatives](#alternatives)

	* [Research](#research)

* [Approach](#approach)
* [Conclusion](#conclusion)


## Summary

I wanted a way to increase performance for some of our static pages. One way to do this is to cache Django pages somewhere, and serve that content from earlier on the request pipe.

A simple approach is having [nginx](http://nginx.org/en/) grab the page directly from memcache, without touching Django at all. Enter [nginx_memcache](https://github.com/pcraciunoiu/django-nginx-memcache).

## Motivation

Performance increase. Avoiding database queries when they're unnecessary. Make your static pages load faster.

## Pros and cons

What can you do or cannot do with this approach?

*Pros:*
* Easy to set which views are cached from Django
* Flag for turning on and off
* Page versioning, so you can cache multiple contents for the same page, based on your own criteria
* User will see the same page version based on a cookie
* Significant speedup versus loading with Django (more below).

*Cons:*
* Can only cache entire page at a time (though more research may show otherwise)
* No auto-invalidate from Django, until user visits some non-cached page (though possible to clear this cache when updating your codebase with a commit hook).
* Can no longer embed forms on that page unless CSRF is obtained through JS.

## Results

Our tests showed a *10x increase* in kbps transferred with ApacheBench tests against our landing page (run with `ab -k -c 20 -n 2000`, before and after).

Deployment was very straightforward. You can [read the docs](https://github.com/pcraciunoiu/django-nginx-memcache) for details.

## Alternatives

[Varnish](https://www.varnish-cache.org/about) can also be placed in front of or behind nginx, and there are several articles showing how to do this.

Here's my 2 cents on django + varnish + nginx VS django + memcache + nginx:

* (+1 for memcache) Easier to configure nginx with memcache than Varnish. Configuring Varnish implied learning a whole new language (VCL), and adding one more piece of software to our technology stack.
* (+1 for varnish) [Some perf tests](http://codysoyland.com/2010/jan/17/evaluating-django-caching-options/) out there say Varnish can be quite a bit faster. However, the difference is not orders of magnitude, so I was not compelled.
* (+1 for memcache) Django and Memcache are very well integrated. By contrast, python-varnish and django-varnish are not actively developed and have several known issues. Didn't seem a good idea for production.

### Research links
* [django-nginx-memcache](https://github.com/pcraciunoiu/django-nginx-memcache)
* [djangonginxed](https://github.com/shaunsephton/djanginxed), an alternative to my project.
* [django + nginx + memcache](http://weichhold.com/2008/09/12/django-nginx-memcached-the-dynamic-trio/) middleware example.
* [Evaluating Django caching options]( http://codysoyland.com/2010/jan/17/evaluating-django-caching-options/)
* [Using varnish with Django for high performance caching](http://ghughes.com/blog/2011/11/11/using-varnish-with-django-for-high-performance-caching/)
* [What is an ideal architecture that includes nginx and Varnish?](http://www.quora.com/What-is-an-ideal-architecure-that-includes-nginx-and-Varnish?q=varnish+nginx)
* [Example set up for nginx in front of varnish](http://www.linuxpinguin.de/2011/09/nva-setup-nginx-varnish-apache/)
* [Example set up for varnish in front of nginx](http://serverfault.com/questions/111678/how-to-setup-nginx-with-varnish)
