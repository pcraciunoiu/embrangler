---
layout: post
title: "SUMO and migrating large amounts of data"
summary: Over the past 6 months or so, I've been doing legacy data migration.
tags: [legacy data, migration, mozilla]
---

Data migration is a complicated problem. It's one of those things nobody wants to do, because it's mostly tedious, not engaging, and also important to get right. Often times you have to compromise. I'll talk a bit about the history of SUMO's data, decisions the product and development team have made regarding its migration, and things I've learned from the experience.

* [Quick tips](#quick_tips)
* [Background](#background)
* [Data influences which components are rewritten first](#rewriting_where_to_start)
* [Too much data! What now?](#too_much_data)
	* [Lesson 1: Migrating questions](#migrating_questions)
	* [Lesson 2: Migrating the knowledge base](#migrating_the_knowledge-base)
* [Can I get away with pure SQL?](#can_i_get_away_with_pure_sql)
* [Converting data: some challenges](#converting_data)

	* [Lesson 3: Data integrity and storage](#data_integrity_and_storage)

## Quick tips

* Start with the smallest dataset first to get the hang of things. ([details](#rewriting_where_to_start))
* You'll have to deal with lots of edge cases. Make sure to write tests. ([details](#testing))
* Careful when converting dates/times: timezones can be a pain, and data is often stored in the timezone of the server. ([details](#converting_data))
* When you have so much data that migrating it would take days: do you need _all_ of it? ([details](#too_much_data))
* Consider the benefits of migrating data offline ([details](#migrating_the_knowledge_base))
* It's unlikely that you'll be able to use raw SQL. ([details](#can_i_get_away_with_pure_sql))
* You'll learn how important data integrity is, so you'll pay attention at the schema your software uses next time. ([details](#data_integrity_and_storage))

## Background

At the beginning of February, [SUMO](http://support.mozilla.com) started on a new adventure: rewriting the entire platform from an outdated version of [TikiWiki](http://tikiwiki.org/) to [Django](http://www.djangoproject.com/). As different (more or less stand-alone) pieces of the application were moved over to the new platform, our data had to be migrated over as well.

Over the course of the past 6 months, I've migrated over 25,000 pieces of content, most of which contained large amounts of text data.

## Rewriting: where to start?

___Tip: Start with the smallest, simplest dataset first.___

The first migration of data was part of our new [discussion forums](http://support.mozilla.com/en-US/forums). This was by far the smallest component we had to migrate over:

* the forums contained roughly 5000 posts, in just about 1000 threads.
* by comparison, we had a total of ~450,000 answers for ~260,000 questions, and over 5,000 knowledge base pages.
	* [questions](http://support.mozilla.com/en-US/questions)
	* [knowledge base, document example](http://support.mozilla.com/en-US/kb/Using%20Firefox)
* I had never done migrations before, so starting small was a good idea.
* In addition to being the smallest, the forums content was also more straightforward to migrate (see also [Converting data](#converting_data))

## Too much data!!

Our questions component had over 450,000 (!) answers in the old system. Should you ever be in this situation, here are some options worth considering:
* do you need all this data? can you keep just a reasonable portion of it?
* if you don't, great! ([details](#migrating_questions))
* if you __do__, tough luck. Consider:
	* migrating data offline and then running a straighforward SQL import on the production database. ([details](#migrating_the_knowledge_base))
	* running the conversion script in chunks: migrate a part of the data now, and more later.

### Migrating questions
Fortunately, even though we had over 260,000 questions to migrate, only about 15,000 were recent enough to be relevant for the currently supported versions of [Firefox](http://getfirefox.com). Hence, the development and product teams agreed to _not_ migrate all of them.

The script to convert data over was run live on the production server, and took over one hour to finish - not too bad.

__Caveat:__ frozen edits to and creation of TikiWiki questions for those a bit over an hour.

### Migrating the Knowledge Base
The Knowledge base presented a different situation:
* Between 5,000 and 6,000 articles, some with long-standing history
* Approved and unreviewed versions of an article were stored as separate articles in TikiWiki (each with its own history)
* Lots and lots of content and metadata _per document_
* Changing our wiki syntax from [TikiWiki](http://tiki.org/tiki-index.php?page=WikiSyntax) to [MediaWiki](http://www.mediawiki.org/wiki/Help:Formatting) (used by [Wikipedia](http://www.wikipedia.org/), among many others).

Thus, even though the _count_ was much lower than for forums or questions, migrating these was much more intensive, both CPU and IO-wise.

__Our solution__ here was to run the script offline (a.k.a. I ran the script on my machine) and hand our IT team just the SQL output to import.

__Why?__ The script was complex enough to take _over 3 hours_ from start to finish. Unreasonable to run on our production servers: if something went wrong, it could take an entire workday (or more) for the IT and development team to get things back on track.

__Caveat:__ frozen edits to and creation of TikiWiki knowledge base articles for a day.

__Huge benefits:__
* the data migration took less than __5 minutes__ to import on the production database.
* no worrying about a script crashing on untested data
* no overloading the production servers with database queries (replication lag can be an issue)

## Can I get away with pure SQL?

___Rarely.___

__Why?__
* Data __changes frequently__ over time.
* Thus, you want to freeze changes for the __minimum possible time__, so running a script on the production database is the way to go.
* Hence, unless the new schema structure is close enough for raw SQL to handle, you're out of luck.

The only time we were able to use pure SQL was when [we froze edits for a day](#migrating_the_knowledge-base) and generated the SQL offline.

__How similar does schema structure have to be for SQL to work?__ you ask.

Here is the story for our [forums](http://support.mozilla.com/en-US/forums), the __simplest schema:__
* we kept the general structure of the data: forum with threads as children, and threads with posts as children.
* in TikiWiki, our threads and posts were stored in the same table, with a parentId column distinguishing which are threads and which are posts.
* in Django, threads had their own table (a good [normalization](http://en.wikipedia.org/wiki/Database_normalization) to have).
* a thread from TikiWiki mapped to a thread + a post in Django

Because of those (and other) differences, we couldn't run a SQL-only import as reliably as a python/PHP conversion script. You could try doing a SQL-only import, but you're gonna hit some __key issues you wish SQL could solve:__
* while + if/else if/else structures. Much too often, data is corrupted or columns contain unexpected values - [MySQL's conditional construct](http://dev.mysql.com/doc/refman/5.0/en/control-flow-functions.html#function_if) doesn't do much.
* colliding unique keys, or integrity errors due to foreign key references are _very_ difficult to prevent against in SQL.

## Converting data

Here are some general observations of problems you might run into when converting data, based on our problems:

* Frequently, __normalization__/denormalization changes are __worth the effort__:
	* More often than not, normalization is the way to go.
	* Long-term benefits are:
		* Data integrity a [___huge issue___](#data_integrity_and_storage).
		* Usually, more flexibility to add functionality later on.
		* Easier migration (should you need to do it again).
		* [And more!](http://lmgtfy.com/?q=benefits+of+normalization)
* __Syntax changes__ are __the worst__:
	* If you have to change wiki syntax, consider going straight to HTML: this way, you can use the rendered output of the documents from the old platform.
	* Can't get away with just HTML? Try regex conversion! I'm not saying that using a proper parser is a bad idea -- but if you have to __write a parser__, it's probably not worth the effort.
	* Consider a [simple PDA](http://en.wikipedia.org/wiki/Pushdown_automaton) instead of a parser, it might just work.
* Dates and times are __timezone-sensitive__. When converting, make sure to test that you're taking timezones into account.
	* In our case, we were moving over from a basically timezone-ignorant platform (as many PHP applications are), to a timezone-sensitive application (Django).
	* Some columns were integers ([UNIX timestamps](http://en.wikipedia.org/wiki/Unix_time)), which are universally based on UTC, and so less tricky to convert. MySQL's [FROM_UNIXTIME](http://dev.mysql.com/doc/refman/5.1/en/date-and-time-functions.html#function_from-unixtime) can be useful here.
	* Others were mysql dates/datetimes/timestamps, recorded at the server's timezone (for us, US/Pacific, or PDT).
* Be prepared for __lots and lots of edge cases:__
	* Syntax changes are a nightmare of edge cases, as the old syntax probably has different rules and a different parser than the new one. One common problem for us was whitespace handling.
	* If foreign keys were not (well) enforced in the old system, there will be numerous exceptions to catch in the new one.

### Data integrity and storage

One of the most valuable lessons to learn from migrating data is [integrity](http://en.wikipedia.org/wiki/Data_integrity). Another one is storing data properly encoded and consistently. I'll highlight just a few things that help with respect to data migration:

* Use foreign keys and any other constraints as much as technically accurate

	* E.g. you will have fewer exceptions to handle if you can rely on foreign keys to refer to valid rows
* Storing text in one encoding is better than multiple; preferably unicode.
* Store dates and times in the same timezone; preferably UTC.
* Use a database that [supports deferred foreign key checks](http://coffeeonthekeyboard.com/django-fixtures-with-circular-foreign-keys-480/), and is generally better about [ACID](http://en.wikipedia.org/wiki/ACID). That's not MySQL.

## Testing
Although testing some temporary code that you'll use once may seem like a waste, if you're dealing with large amounts of data that can change, you will be better off writing tests.

* Cover the basics - migrating a typical piece of content.
* Cover some, if not all of the edge cases.
* (somewhat related to testing) Write some helper scripts (e.g. bash) to make it easy to run the migration and spot check.

I worked on migrating the Knowledge Base over several weeks, and sometimes changes I made to the script broke tests -- if it wasn't for those tests, lots of content could have been migrated poorly, or not at all.
