---
layout: post
title: "Introducing Google App Engine Paginator"
summary: Need for a generic paginator for large datasets? Look no further!
tags: [appengine, python]
time: 11:24AM
---

## Table of contents

* [Summary](#summary)
* [Getting Started](#getting_started)
* [Features](#features)


## Summary

Need a way to paginate through a GQL query easily? __gae_paginator__ handles the generation of next/previous page URLs, paginates on both unique and non-unique properties, and wants to be as efficient and easy to use as possible.

## Getting Started

1. Download [the source](https://github.com/humble/gae_paginator) and copy the `gae_paginator/` folder anywhere inside your App Engine project directory.

2. That's it! Use it like so, in your handlers:
	  {% highlight python %}import os
	
	from google.appengine.ext.webapp import template
	import webapp2
	
	from gae_paginator import Paginator
	
	
	class YourHandler(webapp2.RequestHandler):
	
	  def get(self):
	  paginator = Paginator(YourModel, 'some_column = :1 AND other_column = :2',
	                        ['some_value', 'other_value'], expect_duplicates=True,
	                        per_page=50, paginate_on='-created')
	  page = paginator.get_page(request=self.request)
	  path = os.path.join(os.path.dirname(__file__), 'index.html')
	  self.response.out.write(template.render(path, {
	    'objects': list(page),
	    'page': page,
	  }){% endhighlight %}
3. In your django template:
		{% highlight html+django %}{% raw %}{% if page.has_previous %}
	  <a href="{{ page.get_previous_url }}">&laquo; Previous page</a>
	{% endif %}
	{% if page.has_next %}
	  <a href="{{ page.get_next_url }}">Next page &raquo;</a>
{% endif %}{% endraw %}{% endhighlight %}

   Or jinja2 template:
		{% highlight html+jinja %}{% raw %}
{% if page.has_previous() %}
   <a href="{{ page.get_previous_url() }}">&laquo; Previous page</a>
{% endif %}
{% if page.has_next() %}
  <a href="{{ page.get_next_url() }}">Next page &raquo;</a>
{% endif %}{% endraw %}{% endhighlight %}


## Features

* Simple pagination by key
* Paginate by non-unique properties with a specified tolerance for duplicates.

  * Example: paginate songs by artist name, 10 songs per page, expect 100 duplicates. Set: `expect_duplicates=100`
* Order and paginate by a custom column (Date/DateTime and key supported and tested).
* Show next and previous buttons only when there is actual data before/after.

