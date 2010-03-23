--- 
layout: post
title: "Embrangler: Moving to Jekyll"
summary: The migration process of <a href="http://embrangler.com">this blog</a>, from Wordpress 2.9 to Jekyll 0.5.7
---

It took only three days to migrate my blog from [Wordpress](http://wordpress.org) to [Jekyll](http://wiki.github.com/mojombo/jekyll/). For anyone who plans to do this, I'm summarizing the whole process below.

Table of contents:

* [Why change?](#why_change)
* [Why Jekyll?](#why_jekyll)
* [Migration process](#migration_process)
* [Conclusion](#conclusion)

## Why change?
While I realize Wordpress the most popular blogging platform for a reason, I was bothered by the workflow involved with having a WP blog. Some of the (arguable) inconveniences I found were:

* the WYSIWYG editor doesn't handle some of the markup I would like (headings, tables aren't great either), so I would constantly switch between the Visual and HTML tabs to format things the way I wanted to. While I realize this could be fixed by customizing the editor, why should I have to do that? Plus, I have long given up hope of the ideal WYSIWYG editor. Besides not handling markup very well, it would sometimes reformat some of my plain HTML and break it.
* creating posts is pretty much the only thing I do. I don't use categories, tags, or any other features. Yet I had this admin area cluttered with features.
* I'm not too fond of WP's version control. I would often see the message that "a more recent version of this post is available" erroneously, I'm still not sure why. While changing versions worked well enough, I find the idea of an actual version control system more appealing.
* My blog could use a redesign. For a while, I was using the [Carrington Text](http://wordpress.org/extend/themes/carrington-text) theme, which was ok but not great. I wanted to make it feel more like _my_ blog -- no sidebar, larger font, a better home page to name a few.

## Why Jekyll?
A few weeks before I decided to switch off of Wordpress, I found out about static site-generator engines alternatives that would use available version control software such as git or svn. After looking around I hesitated to switch to any of these because they were mostly Ruby-based, and I was unfamliar with how they work. However, all other alternatives seem to be heading towards full-fledged <abbr title="Content Management System">CMS</abbr>'s.

A quick note on static sites: they have virtually no security holes (well, in theory), because there is no server-side handling of data submission. I'm using a <abbr title="Virtual Private Server">VPS</abbr> too, so I was fond of having less CPU usage on the server (due to not having to process, say, PHP scripts for Wordpress).

Some of the alternatives to Jekyll that I considered are [Toto](http://www.cloudhead.io/toto), [StaceyApp](http://www.staceyapp.com/), [Chyrp](http://chyrp.net/), [Subtext](http://subtextproject.com/) and [Typo](http://typosphere.org/). I picked [Jekyll](http://wiki.github.com/mojombo/jekyll/) for two main reasons:
* popularity -- looking at the [project's github](http://wiki.github.com/mojombo/jekyll/) watches/forks
* documentation and examples -- there is actually a [Sites](http://wiki.github.com/mojombo/jekyll/sites) page, leading to other sites and their github hosted sources, immensely helpful when starting out

## Migration process

I followed these instructions:

* [Installation steps from the Jekyll documentation](http://wiki.github.com/mojombo/jekyll/install)
* [Installing Jekyll on Ubuntu](http://blog.favrik.com/2009/03/02/installing-jekyll-on-ubuntu-8-10/)

... and started by looking at [Tom Preston-Werner's blog](http://tom.preston-werner.com/) and its [source on github](http://github.com/mojombo/mojombo.github.com).

### Migrating posts

After I got the redesign to look good on Jekyll, the next step was migrating my Wordpress posts. Fortunately, [there is documentation for that too](http://wiki.github.com/mojombo/jekyll/blog-migrationsl).

Unfortunately, the automatic migration did not convert some of the markup very well, such as LaTex, images with captions, most lists and links. Yet I had less than 15 posts, so I just went through them and checked everything. Because I'm using [LaTeX](http://www.latex-project.org/) in some of my posts, I used [maruku](http://maruku.rubyforge.org/maruku.html) (instead of [rdiscount](http://github.com/rtomayko/rdiscount)) to parse them. I couldn't find LaTeX support for rdiscount, which is a faster parser.

I'm also using lsi for related posts, and [python-pygments](http://pygments.org/) for syntax highlighting. The latter is simply a wonderful tool, and I recommend it to anyone posting code on the web. Of course, all of these are documented in the Jekyll documentation, so it was easy to get it all working.

The code for this site is up on github as well, so you can [check it out there](http://github.com/pcraciunoiu/embrangler/) to see how it works.

### Migrating comments

This took me about 20 minutes :), following [these instructions](http://disqus.com/comments/wordpress/).

### Server setup and more

I actually didn't want to install jekyll on my server, and preferred to do all the generating locally. My server only works with plain html this way. The one thing I did do, however, was use github's post-receive-hook service. I ended up having something [similar to this](http://forum.webfaction.com/viewtopic.php?id=964):

1. github posts data to a php file on my server
1. this file verifies the posted data, logs the commit, and runs a C script.
1. the C script runs `git pull`

Here's the code for all of this:

1. php script

__Update:__ [James](http://coffeeonthekeyboard.com/) pointed out that my security measures weren't good enough, so I updated the script. If you don't care much for security, you may prefer automated publishing. See my [second script](#second-script), below.

{% highlight php %}
<?php

$check = auth();
if (!$check) die;

echo '<pre>';
echo exec('/path/to/site/pull_script');
echo '</pre>';

function auth() {
    // do some parameter checking here
    // and return true when matches
}
{% endhighlight %}
To make things even more awesome, I bookmarked this URL using [Firefox's keywords](http://lifehacker.com/196779/hack-attack-firefox-and-the-art-of-keyword-bookmarking), so I only need to type one character to publish ;)

<span id="second-script"></span>
Here is my second script, which does automatic publishing.
{% highlight php %}
<?php

if (!$_POST['payload']) {
    header('HTTP/1.0 403 Forbidden');
    exit;
}

define('HOOKLOG', '../logs/hooks.log');
$fh = fopen(HOOKLOG, 'w') or die("Can't open file");
$data = '';

$hook = json_decode($_POST['payload']);

if ($hook->repository->owner->name != 'pcraciunoiu') {
    header('HTTP/1.0 403 Forbidden');
    exit;
}

$cs = $hook->commits;

foreach ($cs as $c) {
    $data .= $c->timestamp . "\n";
    $data .= $c->author->name
        . ' (' . $c->author->email . ')'
        . ' pushed to ' . $hook->repository->url . "\n"
        . 'View commit at ' . $c->url . "\n"
        . "\n\nCommit message was:\n" . $c->message . "\n\n"
    ;
}

fwrite($fh, $data);
fclose($fh);

// set this to your path
exec('/path/to/site/pull_script');
{% endhighlight %}
There are two important security measures in the first script:

* it not write to a file, so if it gets hit by someone trying to find the secret codes, my server's disk doesn't perform intensive <abbr title="input-output">IO</abbr>
* it does not hint in any way at parameter names, number of parameters that must be submitted, or whether they should be submitted through GET or POST -- if you don't get the right values, you don't see anything


2. the c file
{% highlight cpp %}
#include <stddef.h>
#include <stdlib.h>
#include <unistd.h>

int main(void) {
    execl("/usr/bin/git", "git", "pull", "origin", "master",
        (const char *) NULL);

    return EXIT_FAILURE;
}
{% endhighlight %}

Compile this with 
{% highlight bash %}
gcc pull_script.c -o pull_script
{% endhighlight %}

So now, every time I push to github, the server automatically updates. Really cool way of publishing!

## Conclusion
I enjoy using git, and having a static site. My comments are offloaded to a separate server, and I write plain text files using the markdown syntax. My blog gets published when I visit a bookmarked URL.

Goodbye Wordpress!
