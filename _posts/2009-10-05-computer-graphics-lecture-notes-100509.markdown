--- 
wordpress_id: 39
layout: post
title: Computer graphics - lecture notes - 10/05/09
wordpress_url: http://embrangler.com/?p=39
---
Filling in recursive calls
<pre style="text-align: center;">x
x x
x  ox
x x
x</pre>
Starting from 'o' go R(ight), T(op), L(eft), B(ottom). As you can see, diagonal fill would "leak" outside.

Scanline Polygon Fill
* Filling one polygon at a time, scan horizontally.
* Reliable only for convex polygons.

Idea: Find intersection of polygon edges with scanline; pair off intesections, fill in each span.
Data structure: edge info: $ y_{min}$, $ x_{cur}$, $ y_{max}$, $ slope$

Algorithm:

1. maintain edges in sorted edge table (ET) by $ y_{min}$
1. maintain active edge table (AET) of edges in current scanline. init AET = null
1. while AET != null OR ET != null
    1. put relevant edges from ET =&gt; AET
    1. find intersections with current scanline y and sort by x
    1. fill in spans
    1. y+t
    1. remove edges whose $ y_{max} < y$

*Obs:*
* Scanline, origin is top-left.
* As we go through loop, $ x_{cur}$ will be the current intersection of edge with scanline.
* Scanline intercept for next line:
$ x_{i+1} = x_i + \frac{1}{m}$, $ \delta y = 1$
* Vertical lines: $ m = \infty$, $ x_{i+1} = x_i$
* Horizontal: $ m = 0$
* Start shaped polygon (self-crossing) will not be filled in. Count number of spans, cannot distinguish between *in, out, in* and *in, in, in*

World coordinates vs Device coordinates vs Object coordinates

* World coordinates (WC)
	* also specify world size, $ x_w, y_w$
	* measurements flexible
	* able to "zoom in" through a "window" (part of the world that's visible) =&gt; mapped to screen (DC)
	* in 3D, this "window" is described as a ViewVolume (more technically)
	* viewport -- part of __screen __where graphics window that shows content (as opposed to part of __world__)
	* similar to the cameras, in 3D a viewport specifies where camera is
	* glOrtho (L, R, B, T, N, F) -- in 3D

* Object coordinates (OC)
	* $ x_o, y_o$
	* Size relative to object

* Device coordinates (DC)
	* measurements are usually number of pixels
	* need to be able to normalize units in terms of pixels, so turns device coordinates to a 0,1 scale (for x, y) =&gt; normalized device coordinates (NDC)
	* glutInitWindowSize(W, H)
	* glutInitWindowPosition(x, y)

Next time:
* linear interpolation
* line clipping
* volume clipping
* transformations
