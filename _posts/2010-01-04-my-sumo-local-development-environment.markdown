--- 
wordpress_id: 151
layout: post
title: My SUMO local development environment
wordpress_url: http://embrangler.com/?p=151
summary: How I set things up locally to develop for Mozilla's <a href="http://support.mozilla.com">SUMO</a>.
tags: [mozilla, development, webdev, SUMO]
---
## Summary
A while back, James wrote about [his development environment](http://coffeeonthekeyboard.com/local-web-development-323/ "James' local development environment"). I wanted to summarize my approach, and go into a bit more detail about the specific setup you would need to have SUMO work locally. For more information, see also [this wiki page](http://https://wiki.mozilla.org/Support:Sumodev#Get_Involved).

## My LDE: Ubuntu Linux
My <abbr title="local development environment">LDE</abbr> is slightly different: I dual boot Windows 7 and Kubuntu 9.10. As of now I'm still a student, and I work on my own machine. There are several reasons I find dual booting a great solution:

* __Best performance__ while developing. Although less and less of an issue, being in the native <abbr title="Operating System">OS</abbr> is always be faster than running a <abbr title="Virtual Machine">VM</abbr>.
* A __full powered OS__ that I can use for other work. I do schoolwork and other contracting work, and sometimes Windows is not an option. Even a VM has its limitations when it comes to certain drivers (one example is audio -- which I needed for a <a title="Music Visualizer for CMPS160" href="http://code.google.com/p/music-visualizer-cs160/">graphics project</a>)
* Keeps my __work and pleasure separate__ -- having dual boot is basically like having two machines. Typically, when I'm in Linux, I do work, otherwise I'm in Windows to do personal things.

The only downside is some additional wait time for rebooting if you need to switch to the other OS. Since I work on Linux only, I rarely need to switch while working. However, everything works fine for me on Linux -- sound, video, even webcam and VPN (will blog later about all of these).

## LAMP
For web development in general, you'll need to have the [LAMP stack](http://en.wikipedia.org/wiki/LAMP_%28software_bundle%29) installed.
Fortunately, Ubuntu provides an easy way to do this in one line. From a terminal, run:
{% highlight bash %}
sudo tasksel
{% endhighlight %}
Select _LAMP server_ from the list, and choose OK (TAB + ENTER). Follow the steps to choose a MySQL password and any other configuration there may be.
Once that's done, you should be able to go to `http://localhost` and see the "It works!" text. Here are some useful paths:

* Web root: `/var/www/`
* Hosts file: `/etc/hosts`
* Apache sites: `/etc/apache2/sites-available/` and `/etc/apache2/sites-enabled/`
* PHP ini: `/etc/php5/apache2/php.ini`
* MySQL ini: `/etc/php5/conf.d/mysql.ini`

## SUMO setup
What you'll need:

* LAMP stack -- see [above](#lamp)
* A host (optional) -- see [below](#host)
* SSL -- see [this guide](http://www.tc.umn.edu/~brams006/selfsign_ubuntu.html)
* Sphinx -- see <a title="installing Sphinx" href="https://wiki.mozilla.org/Support/Sphinx_Installation">this guide</a>
* Memcached -- I just install the package and that's enough: `sudo apt-get install memcached php5-memcache`
* Virtualbox (optional) -- for testing: `sudo apt-get install virtualbox`
* A copy of our database -- you may ask James, Laura or myself for this -- [see how, below](#help)
* SVN -- `sudo apt-get install subversion`
* Checking out and configuring the SUMO codebase -- [see this guide](https://wiki.mozilla.org/Support/SUMO_install_process "checking out and configuring SUMO")

<span id="host">To set up a SUMO host, I add the entry for it in `/etc/hosts`. Here is the top of my file:</span>
{% highlight bash %}
127.0.0.1   localhost
127.0.1.2   sumo
{% endhighlight %}

Then, add the site info to apache. Here's my complete conf file (with SSL), in `/etc/apache2/sites-available/sumo`:
{% highlight bash %}
<VirtualHost 127.0.1.2:80>
    ServerAdmin webmaster@sumo
    ServerName sumo
    ServerAlias sumo
    DocumentRoot /var/www/trunk/webroot
    <Directory /var/www/trunk/webroot>
        Options Indexes FollowSymLinks MultiViews
        AllowOverride All
        Order allow,deny
        allow from all
    </Directory>
</VirtualHost>

<IfModule mod_ssl.c>
<VirtualHost _default_:443>

    ServerAdmin webmaster@sumo
    ServerName sumo
    ServerAlias sumo
    DocumentRoot /var/www/trunk/webroot
    <Directory /var/www/trunk/webroot>
        Options Indexes FollowSymLinks MultiViews
        AllowOverride All
        Order allow,deny
        allow from all
    </Directory>
    SSLEngine on
    SSLCertificateFile /etc/apache2/ssl/apache.pem
</VirtualHost>
</IfModule>
{% endhighlight %}

To enable the site, just do this:
{% highlight bash %}
cd /etc/apache2/sites-enabled
sudo ln -s ../sites-available/sumo
{% endhighlight %}
Then, restart apache:
{% highlight bash %}
sudo /etc/init.d/apache2 restart
{% endhighlight %}
## Testing
For testing, I also use a VM in VirtualBox, running WinXP with multiple IEs. I chose WinXP to save space -- only takes up 3GB. You should allow 4GB just in case you want to install more stuff.
Using multiple IEs is not the best, as [quirksmode points out](http://www.quirksmode.org/css/condcom.html), so you may consider running a VM for each IE version you wish to test. However, I haven't experienced that many problems.
On WinXP I've also installed Firefox (of course), Chrome, and Opera. On Ubuntu I just use the defaults: Firefox and Konqueror (since I'm running Kubuntu).

## Help?
I've tried to cover everything, but of course there may be stuff I missed. If you need additional info, you may leave a comment.
To obtain a copy of our database, you can find [us on IRC or contact us by email](https://wiki.mozilla.org/Support:Sumodev#Get_Involved).
