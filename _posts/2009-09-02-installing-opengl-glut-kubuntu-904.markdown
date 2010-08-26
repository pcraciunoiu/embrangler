--- 
wordpress_id: 6
layout: post
title: Installing OpenGL + GLUT on Kubuntu 9.04
wordpress_url: http://embrangler.com/?p=6
summary: Some of the tricks involved in setting up GLUT and OpenGL on Kubuntu 9.04
tags: [opengl, ubuntu, kubuntu, computer graphics, UCSC]
---
I'm taking a Computer Graphics class, and during the first week we need to install OpenGL and write a first, very simple program. I looked around for tutorials and couldn't find any simple ones, so I've compiled one below.


This tutorial should help you install OpenGL + Glut on Debian-based Linux distributions.

My OS: Kubuntu 9.04 i386 (32 bit)

Installing GLUT:
{% highlight bash %}
sudo apt-get install freeglut3 glut-doc
{% endhighlight %}
In my case, I had to install an nvidia driver as well:
{% highlight bash %}
sudo apt-get install nvidia-glx-180-dev
{% endhighlight %}

For some of you, this might not be the case, and the mesa-common package would work:
{% highlight bash %}
sudo apt-get install mesa-common-dev
{% endhighlight %}

Then (and here's the part that got me worried), you can try testing a simple example, but I got this error:
{% highlight bash %}
OpenGL GLX extension not supported by display ':0.0'
{% endhighlight %}
To fix this, it was much simpler than I thought -- I just needed to reboot. (If you don't want to, for some reason, restarting X should work just fine.)
If this problem doesn't go away, I found a couple of resources in my search before rebooting, <a href="http://ubuntuforums.org/showthread.php?t=380175">here</a> and <a href="http://www.linuxquestions.org/questions/linux-newbie-8/opengl-glx-extension-not-supported-by-display-0.0-107369/">here</a>.

After setting this up, I looked up tutorials, and decided to use this simple example: (found <a href="http://ubuntuforums.org/showthread.php?t=375425">here</a>)
{% highlight cpp %}
#include &lt;GL/glut.h&gt;

#define window_width  640
#define window_height 480

// Main loop
void main_loop_function()
{
   // Z angle
   static float angle;
   // Clear color (screen)
   // And depth (used internally to block obstructed objects)
   glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
   // Load identity matrix
   glLoadIdentity();
   // Multiply in translation matrix
   glTranslatef(0,0, -10);
   // Multiply in rotation matrix
   glRotatef(angle, 0, 0, 1);
   // Render colored quad
   glBegin(GL_QUADS);
   glColor3ub(255, 000, 000); glVertex2f(-1,  1);
   glColor3ub(000, 255, 000); glVertex2f( 1,  1);
   glColor3ub(000, 000, 255); glVertex2f( 1, -1);
   glColor3ub(255, 255, 000); glVertex2f(-1, -1);
   glEnd();
   // Swap buffers (color buffers, makes previous render visible)
    glutSwapBuffers();
   // Increase angle to rotate
   angle+=0.25;
}

// Initialze OpenGL perspective matrix
void GL_Setup(int width, int height)
{

    glViewport( 0, 0, width, height );
    glMatrixMode( GL_PROJECTION );
    glEnable( GL_DEPTH_TEST );
    gluPerspective( 45, (float)width/height, .1, 100 );
    glMatrixMode( GL_MODELVIEW );
}

// Initialize GLUT and start main loop
int main(int argc, char** argv) {
    glutInit(&argc, argv);

    glutInitWindowSize(window_width, window_height);

    glutInitDisplayMode(GLUT_RGB | GLUT_DOUBLE);

    glutCreateWindow("GLUT Example!!!");

    glutIdleFunc(main_loop_function);

    GL_Setup(window_width, window_height);
   glutMainLoop();
}
{% endhighlight %}

Thanks! I'm eager to update this tutorial with more information, so if you're having problems, let me know!

## Additional resources:

* [GLUT documentation](http://www.opengl.org/documentation/specs/glut/spec3/spec3.html)
* [Tutorials on spacesimulator](http://www.spacesimulator.net/tutorials.html)
* [GameDev Forum](http://www.gamedev.net/reference/list.asp?categoryid=31)
* [OpenGL Programming guide](http://www.glprogramming.com/red/index.html)
* [Using SDL with OpenGL](http://lazyfoo.net/SDL_tutorials/lesson36/index.php) (part of [Beginning Game Programming](http://lazyfoo.net/SDL_tutorials/index.php))
* [OpenGL Video Tutorials](http://www.videotutorialsrock.com/)
