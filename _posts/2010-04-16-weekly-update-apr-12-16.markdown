--- 
layout: post
title: "April 12-16 status"
summary: Past and future weekly goals @ Mozilla.
---

## Last week (April 12-16)
* kitsune
	* r? [cool vim indenting in templates](https://bugzilla.mozilla.org/show_bug.cgi?id=558228)
	* r? [minify bug 550515](http://github.com/jsocol/kitsune/commits/bug-550515)
	* finish [converting our current database from latin1 to utf8](https://bugzilla.mozilla.org/show_bug.cgi?id=554210) after lots of painful dealing with data
	* fix [advanced search form logic](http://github.com/pcraciunoiu/kitsune/commits/bug-555249), deals with default values, validation, cleanup. fixes [a few](https://bugzilla.mozilla.org/show_bug.cgi?id=559086) [other](https://bugzilla.mozilla.org/show_bug.cgi?id=559249) [bugs](https://bugzilla.mozilla.org/show_bug.cgi?id=559117) in the process
	* fix [json results and add lots of tests](https://bugzilla.mozilla.org/show_bug.cgi?id=555251)
	* fix [search results sorting](https://bugzilla.mozilla.org/show_bug.cgi?id=558941)
	* IT bugs to [truncate a table](https://bugzilla.mozilla.org/show_bug.cgi?id=559645), [sync stage db with prod](https://bugzilla.mozilla.org/show_bug.cgi?id=559717) and [convert the database to UTF8](https://bugzilla.mozilla.org/show_bug.cgi?id=559997) according to [this bug](https://bugzilla.mozilla.org/show_bug.cgi?id=554210)
* tiki

	* [session fixes](https://bugzilla.mozilla.org/show_bug.cgi?id=553131) required for kitsune integration [filed](https://bug553131.bugzilla.mozilla.org/attachment.cgi?id=439362) and [reviewed](https://bug553131.bugzilla.mozilla.org/attachment.cgi?id=438241)
	* fix and review some security vulnerabilities on mobile

## This week (April 19-23)
* kitsune
	* finish [the remaining kitsune bugs](https://bugzilla.mozilla.org/buglist.cgi?quicksearch=OPEN+product%3Asupport+milestone%3A2.0) with the rest of the SUMOdev team
	* finish [UTF conversion of the database](https://bugzilla.mozilla.org/show_bug.cgi?id=559997)
	* prepare for kitsune push, potential QA bugs
	* begin work on discussion forums -- milestone 2.1
	* install mod_wsgi and run tiki in parallel with kitsune locally
	* discuss/learn more about Test Driven Development
* tiki

	* finish [adding WebTrends to SUMO for tracking](https://bugzilla.mozilla.org/show_bug.cgi?id=558105)

