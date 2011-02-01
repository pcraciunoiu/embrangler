#!/bin/env python

import datetime
import os
import re
import sys

rep_disallowed = re.compile('[\.\\\/\]\[\(\)?><:\'";,-=+_| ]+')

today = datetime.datetime.today()

def get_filename(title):
    date = today.strftime('%Y-%m-%d')
    title = title.lower()
    title = rep_disallowed.sub('-', title)
    return "_posts/%s-%s.markdown" % (date, title)

def get_time():
    t = today.strftime('%I:%M%p')
    if t.startswith('0'):
        t = t[1:]
    return t

if __name__ == '__main__':
    title = " ".join(sys.argv[1:])
    if len(title) < 2:
	sys.exit("Title too short")

    filename = get_filename(title)
    # Only create the file if it doesn't exist.
    if not os.path.exists(filename):
        with file(filename, 'w') as f:
            lines = []
            lines.append('---')
            lines.append('layout: post')
            lines.append('title: "%s"' % title)
            lines.append('summary:')
            lines.append('tags: []')
            lines.append('time: %s' % get_time())
            lines.append("---\n\n")
            f.write("\n".join(lines))
    # Then edit it.
    os.system('vim ' + filename)
