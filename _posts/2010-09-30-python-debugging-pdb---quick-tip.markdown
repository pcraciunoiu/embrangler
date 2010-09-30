---
layout: post
title: "Python debugging (pdb) - quick tip"
tags: [python, debugging]
published: false
time: 10:21AM
---

Sometimes you want to use multiple breakpoints like so:
{% highlight python %}
    # some function/file...
    import pdb; pdb.set_trace()
    some_python_code_on_one_line()

    # some other function/file...
    import pdb; pdb.set_trace()
    some_other_python_code_on_one_line()
{% endhighlight %}

I personally get lost sometimes, tracking through many files and having to read the method name and remember where exactly it is. So it can help me keep track if I leave myself a message:
{% highlight python %}
    # some function/file...
    import pdb; pdb.set_trace()
    s = 'Some function/file'
    some_python_code_on_one_line()

    # some other function/file...
    import pdb; pdb.set_trace()
    s = 'Some other function/file'
    some_other_python_code_on_one_line()
{% endhighlight %}

In some cases (when running django on my mac, for example), I can even do this:
{% highlight python %}
    # some function/file...
    import pdb; pdb.set_trace()
    """Some function/file"""
    some_python_code_on_one_line()
{% endhighlight %}
... so it actually looks like a bit cleaner, like a comment)

So instead of:
{% highlight python %}
    > /path/to/some/file.py(##)method()
    -> some_python_code_on_one_line
    (Pdb)
{% endhighlight %}

You see:
{% highlight python %}
    > /path/to/some/file.py(##)some_function()
    -> s = 'Some function/file'
    (Pdb)
{% endhighlight %}

Hope that helps someone.
