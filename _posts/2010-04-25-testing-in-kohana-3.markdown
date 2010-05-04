--- 
layout: post
title: "Introduction to testing in Kohana 3"
summary: A quick intro to writing tests in Kohana 3 with real code examples.
---

Table of contents:

* [Introduction to introduction](#introduction)
* [Resources](#resources)
* [Setup](#setup)
* [Running tests](#running_tests)
* [Writing tests](#writing_tests)
* [Test suites](#test_suites)
* [Up next](#up_next)


## Introduction

I'm working on a project largely written in Kohana and JavaScript + jQuery. (Under construction at [fastask.net](http://fastask.net).) It's getting complicated enough to be worth having tests for it. While I'm at it, I'll blog about the process, for several reasons:

1. There aren't that many resources on Kohana 3 and testing out there, I've found.
1. Testing is hugely important for complex projects.
1. Testing JavaScript is new to me (and fairly uncommon practice on the web, still).
1. I plan to make this project publicly available fairly soon and it's an opportunity to share information about it with my readers :)

Along the way I will write about:

1. Writing tests in Kohana 3, the basics (this post)
1. Writing JavaScript + jQuery tests

	* so far I'm set on using [JS Test Driver](http://code.google.com/p/js-test-driver/) with [QUnit](http://docs.jquery.com/QUnit) or [YUI Test](http://developer.yahoo.com/yui/3/test/)
1. In-depth testing: using fixtures and mock objects, understanding code coverage, and more

## Resources

Testing on Kohana 3 is easy. It's so easy, in fact, that I've written tests covering almost 1000 lines of code over one weekend.

Here are the necessary resources to get you going:

* [The Kohana 3 unittest module](http://github.com/kohana/unittest), awesomely written by the Kohana team (thanks guys!)
* [PHPUnit](http://www.phpunit.de/)
* [PHPUnit's brilliant documentation](http://www.phpunit.de/manual/3.4/en/)
* [unittest's documentation](http://github.com/kohana/unittest/tree/master/guide/), I mostly used it for [grouping tests](http://github.com/kohana/unittest/blob/master/guide/unittest.testing.md)

## Setup

1. Install PHPUnit. [See their documentation](http://www.phpunit.de/manual/current/en/installation.html).

	* I'm using Ubuntu and the package manager offers a relatively recent version. But, I wanted the latest. Installing it from source was so quick that I can't remember if I had any problems with it :)
1. Git a copy the unittest module: `git submodule add git://github.com/kohana/unittest.git modules/unittest`

	* Follow their [installation instructions](http://github.com/kohana/unittest#readme)
	* I wanted code coverage reports. At the time of writing, these require the archive module, but they really don't have to. So I forked their unittest repo and rolled my own. [My unittest repository](http://github.com/pcraciunoiu/unittest) doesn't require the archive module. I'll write about code coverage in a later post.

_You're all set!_

## Running tests

I'm using the UI provided by the __unittest__ module. That means I've added a route to it in my __bootstrap.php__ file, and I'm accessing it at `http://mysite/phpunit`. From there, I pick the group of tests that I wish to run, and examine the results. Yep, it's that easy.

Here's how it looks:
![Running PHPUnit tests in Kohana 3](/images/phpunit/fastask-running-tests.png)

## Writing tests

Start by reading [the PHPUnit documentation](http://www.phpunit.de/manual/3.4/en/writing-tests-for-phpunit.html). It's full of great examples. My project is fairly complex, and so I'm using __TestSuites__, __TestCases__, and __fixtures__. I will write about the latter in subsequent posts.

Here is a simple example of a __TestCase__:

{% highlight php %}
<?php // application/tests/test_example.php

/**
 * Logged out, 403 forbidden everywhere.
 * @group anonymous
 * @group invalid
 */
class AnonymousTest extends PHPUnit_Framework_TestCase {
    protected function setUp() {
        Kohana::config('database')->default = Kohana::config('database')
                                                ->unit_testing;
    }

    function testFastask() {
        $fastask = new Controller_Fastask(new Request('in/t'));
        $fastask->action_t();
        $response = $fastask->request;
        $this->assertSame($response->headers['Content-Type'],
                          'application/json' );
        $this->assertSame($response->status, 403);
    }

    // ... more tests here ...
}
{% endhighlight %}

So what's happening here?

* Use `@group` to pile tests together. I'm using the UI at `http://mysite/phpunit` to pick which to run at any time.
* The _anonymous_ group is handy to run all tests for actions performed by anonymous users.
* You can use multiple groups, as many as you want.
* I'm using an MySQL database to test in this example. This is a quick way to set the database Kohana uses when running tests:
{% highlight php %}
Kohana::config('database')->default = Kohana::config('database')
                                        ->unit_testing;
{% endhighlight %}

* Set up a test database in MySQL and configure access to it in `application/config/database.php`
* I have multiple tests, hence the `setUp()` method. If you only have one test, don't use this.


## Test suites

Again, [the PHPUnit documentation](http://www.phpunit.de/manual/3.4/en/api.html#api.testsuite) is golden.

Test suites come in handy when multiple tests can use the same setup. You can also [share fixtures between tests](http://www.phpunit.de/manual/3.4/en/fixtures.html#fixtures.sharing-fixture) this way. My main reason for using test suites was actually the gain in speed. This next example shows why.

{% highlight php %}
<?php // application/tests/testsuite_fastask_search.php

/**
 * This suite tests search functionality in the main controller.
 * @group authenticated
 * @group fastask
 * @group fastask.search
 */
class FastaskSearchTestSuite extends PHPUnit_Framework_TestSuite
{
    public static function suite()
    {
        include_once '/path/to/kohana/application/testcases/' .
            'test_fastask_search.php';
        return new FastaskSearchTestSuite('FastaskSearchTest');
    }

    protected function setUp()
    {
        // Set database connection and log in the user.
        Kohana::config('database')->default = Kohana::config('database')
                                                ->unit_testing;
        Auth::instance()->login(TEST_USERNAME, TEST_PASSWORD);

        // Index data and start up the search daemon
        exec('indexer --all --config ' . SPHINX_CONF);
        exec('searchd --config ' . SPHINX_CONF);
    }

    protected function tearDown()
    {
        // Reset logins and log out the user
        $test_user         = Auth::instance()->get_user();
        $test_user->logins = 1;
        $test_user->save();
        Auth::instance()->logout();

        // Stop the search daemon
        exec('killall searchd');
    }
}
{% endhighlight %}

Explanation:

* `TEST_USERNAME` and `TEST_PASSWORD` are used for multiple test suites, so I defined them in `application/config/phpunit.php`
* I'm using the Sphinx search engine here to search through data. So I need to tell Sphinx to index my test data and start up the search daemon.
* Obviously, doing this for every search test is gonna slow things down _a lot_.
* I'm doing all these tests for authenticated users, so logging in and out for every test is also a waste.

Next, some test cases.

{% highlight php %}
<?php // application/testcases/test_fastask_search.php

/**
 * @group loggedin
 * @group fastask
 * @group fastask.search
 */
class FastaskSearchTest extends PHPUnit_Framework_TestCase
{
    /**
     * Sets the data for search.
     */
    function providerSearch()
    {
        /* format for each test:
            array(
                search term
                status code to expect
        */
        return array(
            array('s' => 'asdfgh', 404),
            array('s' => '', 404),
            array('s' => 'nulla', 200),  // One of those lorem-ipsum results
        );
    }

    /**
     * Test search.
     * @dataProvider providerSearch
     */
    function testSearch($search, $status)
    {
        $_GET = array(
            'ep' => 1,
            's'  => $search,
        );
        $fastask = new Controller_Fastask(new Request('in/t'));
        $fastask->before();
        $fastask->action_t();
        $response = $fastask->request;

        $this->assertSame($response->headers['Content-Type'],
                          'application/json' );
        $this->assertSame($response->status, $status);

        $json = json_decode($response->response);
        $count = count($json->tasks);
        if ($count > 0) {
            foreach ($json->tasks as $task) {
                $follower_ids = array();
                foreach($task->followers as $follower) {
                    $follower_ids[] = $follower->id;
                }
                $follower_ids[] = $task->user_id;

                $this->assertContains(TEST_USER_ID, $follower_ids);
            }
        }
    }
}
{% endhighlight %}

The test case looks basically the same as it would if it were stand alone, but it has no `setUp()` or `tearDown()`. I was too lazy to write a separate test for having results, so I check the `$count` for testing the actual data.

## Up next

Stay tuned for Kohana tests using [fixtures](http://www.phpunit.de/manual/3.4/en/fixtures.html), getting and using [code coverage](http://www.phpunit.de/manual/3.4/en/code-coverage-analysis.html) reports, and [mock objects](http://www.phpunit.de/manual/3.4/en/test-doubles.html#test-doubles.mock-objects). Also, JavaScript tests!
