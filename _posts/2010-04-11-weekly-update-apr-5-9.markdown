--- 
layout: post
title: "April 5-9 status"
summary: What I've been busy with this week at Mozilla.
tags: [mozilla, webdev, weekly updates]
---

## Last week (April 5-9)
* kitsune
	* r? [exclude staging articles from search](https://bugzilla.mozilla.org/show_bug.cgi?id=554740), which also includes [sphinx tests](http://github.com/jsocol/kitsune/commit/ef50d5fcd64f65f89ff688874f3fa920f69ff216), reviewed again later after [a fix to not require FORCE_DB](http://github.com/jsocol/kitsune/commit/c2a1356e084a68de17f20376ad051c918ecfd172)
	* r? [l10n -> tower rename](http://github.com/jsocol/kitsune/commit/dbdb116aecda1332c932e278786dba2719c71d09)
	* r? [add JINJA_CONFIG() for string extraction and caching](https://bugzilla.mozilla.org/show_bug.cgi?id=556810)
	* quick look at [minify in kitsune](http://github.com/jsocol/kitsune/commit/f159b8f25ea78c38cc7e60fae6004ccb5e1273c6), TODO next week
	* fixed [duplicate page param in paginator URL](https://bugzilla.mozilla.org/show_bug.cgi?id=556418)
	* spent most of the week [converting our current database from latin1 to utf8](https://bugzilla.mozilla.org/show_bug.cgi?id=554210)
* tiki
	* started work on [adding WebTrends to SUMO for tracking](https://bugzilla.mozilla.org/show_bug.cgi?id=558105)
	* [push desktop 1.5.3 on Tuesday](https://bugzilla.mozilla.org/show_bug.cgi?id=555003) &mdash; [see bugs](https://bugzilla.mozilla.org/buglist.cgi?quicksearch=ALL+product%3Asupport+milestone%3A1.5.3)

## This week (April 12-16)
* kitsune
	* r? [minify bug 550515](http://github.com/jsocol/kitsune/commits/bug-550515)
	* r? [tiki patch for django sessions](https://bugzilla.mozilla.org/show_bug.cgi?id=553131)
	* r? [cool vim indenting in templates](https://bugzilla.mozilla.org/show_bug.cgi?id=558228)
	* __finish up [character encoding conversion](https://bugzilla.mozilla.org/show_bug.cgi?id=554210)__
	* finish up [when to trigger advanced search](http://github.com/pcraciunoiu/kitsune/commits/bug-555249)
	* finish getting sessions into kitsune, i.e. fix any issues spotted by davedash/jbalogh/jsocol on [bug 553131](http://github.com/pcraciunoiu/kitsune/tree/bug-553131)
* tiki

	* finish [adding WebTrends to SUMO for tracking](https://bugzilla.mozilla.org/show_bug.cgi?id=558105)

### Stretch goals
* [search summaries are Jinja-friendly](https://bugzilla.mozilla.org/show_bug.cgi?id=553734)
