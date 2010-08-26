--- 
layout: post
title: "May 3-14 status"
summary: Past and future weekly goals @ Mozilla.
tags: [mozilla, webdev, weekly updates]
---

## Two weeks ago (May 3-7)

* pushed 2.0/1.5.4 with rest of SUMOdev
	* first time had problems with nfs mounts
	* second time was a success, yay!
* r?d [nicer 404/500 handlers](https://bugzilla.mozilla.org/show_bug.cgi?id=561537)
* r?d [new wsgi script](http://github.com/jsocol/kitsune/commit/dbfc4488fc8df9d1f7a07fe3c6d1ecbc17752441)
* r?d [rewrite for discussion forums](https://bugzilla.mozilla.org/show_bug.cgi?id=563995), which also cleaned up some of the search rewrites from previous push
* r?d [posting should update # of replies](https://bugzilla.mozilla.org/show_bug.cgi?id=563593)
* [threads list view](https://bugzilla.mozilla.org/show_bug.cgi?id=563111)


## Last week (May 10-14)

* r?d preliminary work on [atom feeds](https://bugzilla.mozilla.org/show_bug.cgi?id=565362)
* [forums list view](https://bugzilla.mozilla.org/show_bug.cgi?id=563586)
* [wiki markup in discussion forums](https://bugzilla.mozilla.org/show_bug.cgi?id=561524)
* filed some [new](https://bugzilla.mozilla.org/show_bug.cgi?id=565801) [bugs](https://bugzilla.mozilla.org/show_bug.cgi?id=565481)
* added some [omitted indexes](https://bugzilla.mozilla.org/show_bug.cgi?id=565320) to tiki
* [re-sync db](https://bugzilla.mozilla.org/show_bug.cgi?id=565701), to test the SQL fix from above, also had IT [run schematic](https://bugzilla.mozilla.org/show_bug.cgi?id=565810) and set up test forum
* [remove omniture tags from tiki](https://bugzilla.mozilla.org/show_bug.cgi?id=558499)
* [fix crc32 not working with unicode](https://bugzilla.mozilla.org/show_bug.cgi?id=564385)
* discussion with [Dave Dash](http://spindrop.us/) about [ACL](http://github.com/davedash/zamboni/blob/master/docs/topics/acl.rst) on [AMO](https://addons.mozilla.org/en-US/firefox/)


## This week (May 17-21)

* [implement ACL](https://bugzilla.mozilla.org/show_bug.cgi?id=561523) after serious research
* [activate admin in forums app](https://bugzilla.mozilla.org/show_bug.cgi?id=564101)
* help out new team members
* fix up [some](https://bugzilla.mozilla.org/show_bug.cgi?id=565801) [of the](https://bugzilla.mozilla.org/show_bug.cgi?id=566102) wiki parser bugs
