---
layout: post
title: "Serve media from Amazon S3 and keep it in sync"
summary: "Do you want to serve your CSS, JS and user-uploaded content from S3, while easily keeping your data in sync? Then this post is for you!"
tags: [django, performance, scaling]
time: 12:47PM
---

## Table of contents

* [Summary](#summary)
* [Pros and cons](#pros_and_cons)
* [Get started](#get_started)
* [Results](#results)
* [Alternatives](#alternatives)
* [Approach](#approach)
* [Conclusion](#conclusion)


## Summary

Amazon S3 is an affordable, web-scale storage. It has a well supported python API, thanks to [boto](https://github.com/boto/boto), and it offers "99.999999999% durability, with 99.99% availability." ([quote](http://aws.amazon.com/s3/#requirements)).

To improve the performance of a site, it helps to offload media to a different machine - that way your web server doesn't have to process additional requests for your assets. [django-s3sync](https://github.com/pcraciunoiu/django-s3sync) helps you serve media such as your static media (CSS, JS, images) and user-uploaded content easily and efficiently.

## Get started

Go to [the github page](https://github.com/pcraciunoiu/django-s3sync) and follow the installation instructions.

## Pros and cons

*Pros:*
* Easy to install and get running
* Fall back to local URLs if file is not on S3 yet
* Separate buckets for static media VS user-uploaded media
* Easy to set  up cron jobs, management commands to keep your media in sync
* Efficient sync of pending uploaded and deleted files
* Automatically link to files on S3 when they have been uploaded
* Optionally deletes files from S3 once they have been deleted locally

*Cons:*
* Currently only works using Django's <pre>FileSystemStorage</pre> backend (\*)
* Doesn't work with symlinks as far as I know

(\*) Can be easily fixed, but I've kept it simple for my purposes.

## Alternatives

* [django-cuddlybuddly-storage-s3](https://github.com/kylemacfarlane/django-cuddlybuddly-storage-s3), a fork of [django-storages](https://github.com/iserko/django-storages). Wasn't good enough for me, because it seems to upload the files right away, and I didn't want to block the server threads while they connect and upload to S3.
* [django-extensions](https://github.com/django-extensions/django-extensions)'s management command `sync_media_s3`, which served as inspiration for my project, provides a simple management command that you can use to copy local files to S3. It does not support removing files that have been locally removed, nor does it support advanced pattern matching for files.
