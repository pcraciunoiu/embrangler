---
layout: post
title: "Python scoping: understading LEGB"
summary: Quick example of messing with python scoping
tags: [python, beginner, scoping, mozilla]
time: 8:11PM
---

## Summary

Python scoping fun! [Read about LEGB](http://stackoverflow.com/questions/291978/short-description-of-python-scoping-rules) to understand the basics of python scoping.

## Beef

I never bothered to read about how python scoping works until I hit this. It's not exactly something to research until you have issues with it. :)

I had something like this going on:
{% highlight python linenos %}
def func1(param=None):
    def func2():
        if not param:
            param = 'default'
        print param
    # Just return func2.
    return func2


if __name__ == '__main__':
    func1('test')()
{% endhighlight %}
__Note:__ Actual code was not as straightforward, `func2` was actually a decorator. Admittedly, using the same parameter name is not a must, but it's still a curiosity. I just wanted to fall back to a default value on run-time.

If you try to run this in python, here's what you get:
{% highlight python %}
~ $ python test.py 
Traceback (most recent call last):
  File "test.py", line 11, in <module>
    func1('test')()
  File "test.py", line 3, in func2
    if not param:
UnboundLocalError: local variable 'param' referenced before assignment
{% endhighlight %}

If you're curious, you can [read about the principles of LEGB.](http://stackoverflow.com/questions/291978/short-description-of-python-scoping-rules) You have to understand a bit about compilers and [the AST](http://en.wikipedia.org/wiki/Abstract_syntax_tree) to get what's going on behind the scenes. You might thing that replacing lines 3-4 with:
{% highlight python %}
param = param or 'default'
{% endhighlight %}
Might work. But no. You can't assign the same parameter at the local level if the enclosing level defines it. Even this fails:
{% highlight python %}
param = param
{% endhighlight %}

Fun, no?

## Read more

* [LEGB (stackoverflow)](http://stackoverflow.com/questions/291978/short-description-of-python-scoping-rules)
* [Python docs on scope and namespaces.](http://docs.python.org/tutorial/classes.html#python-scopes-and-namespaces)
