--- 
wordpress_id: 196
layout: post
title: Upgrading Windows Vista or 7RC to Windows 7 on dual boot with Linux (Ubuntu)
wordpress_url: http://embrangler.com/?p=196
---
As you may or may not know, the Windows 7 RC/beta/other releases expire at the latest on March 1st, 2 days from now. So I had to spend some time this weekend upgrading to a full Windows 7. Fortunately, my school offers Windows 7 Professional for free if you're an engineering student (so we _do_ get special treatment, aw!).

Anyway, if you're like me, you're dual booting Windows + Linux, and you have to reinstall Windows, you were probably using GRUB to boot into your <abbr title="Operating System">OS</abbr>. Well, as it turns out, reinstalling Windows wipes out GRUB from the boot record. Oh no! What to do?

Fortunately, the solution is simple. I searched for "restore grub" and found <a href="http://ubuntuforums.org/showthread.php?t=1195275">this excellent guide</a>.

The summary:

1. Get a <a href="http://ubuntu.com">Ubuntu</a> Live CD and boot from it.</li>
1. Then run these in your terminal:
    {% highlight bash %}
    sudo -i
    
    # get a list of your partitions in /dev/sdX format
    fdisk -l
    
    # if you can't decide which one is your linux
    # partition (see the System column?)
    df -Th # lists partitions with size and % used
    
    
    # mount your Ubuntu partition, mine was sda4
    mount /dev/sdXY /mnt # 
    
    # install grub on the partition, mine was sda
    grub-install --root-directory=/mnt /dev/sdX
    
    # be nice and unmount it, to avoid problems
    umount /mnt
    {% endhighlight %}
1. Reboot. __Done!__ Your old GRUB shows up now.</li>

So that's it. Hope this helps you avoid reinstalling Linux, which is really unnecessary :)
