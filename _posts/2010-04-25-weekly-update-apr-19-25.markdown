--- 
layout: post
title: "April 19-25 status"
summary: Past and future weekly goals @ Mozilla.
tags: [mozilla, webdev, weekly updates]
---

## Last week (April 19-25)
* kitsune
	* r?d [adding sumo-dev to receive useful stack traces from kitsune](http://github.com/jsocol/kitsune/commit/03b9b540b96968dda4bffacb0f6abdee351e9b12)
	* r?d [improved maintenance of locales](http://github.com/jsocol/kitsune/commit/a5ceb6974a03a8f0487c58a56baf9ed88c1a3701), go James!
	* r?d [kitsune documentation](http://github.com/jsocol/kitsune/commit/79847afa23ee9a3ff3200949824463e6d50e9bf2)
	* r?d [better handling of timeouts for excerpts](http://github.com/jsocol/kitsune/commit/97fe787bae6592360e7603dc6440b4db729126de) and [merged](http://github.com/jsocol/kitsune/commit/29d2134f6d0d5ca22e0bbdcf6832c21aea9ee00a)
	* r?d [unicode improvements, adding sumo.utils.urlencode](http://github.com/jsocol/kitsune/commit/32be0335fd22876379e9716e0df88ffc953fc151) and [merged](http://github.com/jsocol/kitsune/commit/633d0166c9bf65fc35886ad05c038f5f74058448)
	* r?d [fixing an IE6/7 bug](http://github.com/jsocol/kitsune/commit/23f586b285d3c63b842dd643623ce2491f1a3b87)
	* r?d [case insensitive Accept-Language for Opera, Chrome, Safari](http://github.com/jsocol/kitsune/commit/e9aa5d2f87e163917ad339c0d6c06fc0b58625c2)
	* r?d [adding a search plugin](http://github.com/jsocol/kitsune/commit/4464b2033a4c5ce079034dabdafed808e0bcfc51)
	* [fix pagination on IE6](http://github.com/jsocol/kitsune/commit/633d0166c9bf65fc35886ad05c038f5f74058448)
	* [adding two new supported locales](http://github.com/jsocol/kitsune/commit/b2563c4dffcf2515d23f7f861600fc01cb0578da)
	* finished [lots of tests for search filters and JSON for all](https://bugzilla.mozilla.org/show_bug.cgi?id=555251)
	* finished [the remaining 2.0 bugs](https://bugzilla.mozilla.org/buglist.cgi?quicksearch=ALL+product%3Asupport+milestone%3A2.0) with the rest of the SUMOdev team
	* installed mod_wsgi locally with help of [James' docs](http://github.com/jsocol/kitsune/blob/development/docs/wsgi.rst)
	* assisted with IT bugs to [convert the database to UTF8](https://bugzilla.mozilla.org/show_bug.cgi?id=559997) according to [this bug](https://bugzilla.mozilla.org/show_bug.cgi?id=554210)
	* [debugging server issues for kitsune stage](https://bugzilla.mozilla.org/show_bug.cgi?id=559109)
	* begin work on milestone 2.1
* tiki

	* r?d [using kitsune for search](https://bugzilla.mozilla.org/show_bug.cgi?id=556672) on [stage-new](http://support-stage-new.mozilla.com/)
	* filed patch for [adding WebTrends to SUMO for tracking](https://bugzilla.mozilla.org/show_bug.cgi?id=558105)
	* revert [a notifications bug for articles](https://bugzilla.mozilla.org/show_bug.cgi?id=558828)
	* [add .htaccess rewrites for Fx3.7 help topic: keyboard shortcuts](https://bugzilla.mozilla.org/show_bug.cgi?id=519927)
	* [debugging screencast bug on mobile](https://bugzilla.mozilla.org/show_bug.cgi?id=554781)

## This week (April 26-30)
* WebDev onsite! Excited to hang out with the team.
* kitsune
	* work on [forums and other 2.1 stuff](https://bugzilla.mozilla.org/buglist.cgi?type1-0-0=substring&query_format=advanced&field0-0-0=product&value1-0-0=2.1&type0-0-0=substring&value0-0-0=support&field1-0-0=target_milestone&target_milestone=2.1&product=support.mozilla.com)
	* prepare for kitsune push, potential QA bugs
* tiki
	* prepare for 1.5.4 push, potential QA bugs
	* figure out [screencast bug](https://bugzilla.mozilla.org/show_bug.cgi?id=554781)
