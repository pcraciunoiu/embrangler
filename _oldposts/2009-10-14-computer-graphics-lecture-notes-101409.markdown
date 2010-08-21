--- 
wordpress_id: 96
layout: post
title: Computer graphics - lecture notes - 10/14/09
wordpress_url: http://embrangler.com/?p=96
summary: Lecture notes from October 14, 2009 for CS160, a computer graphics class at UC Santa Cruz
---
Reflection:

$ Rf_{xy} = $
\[1xxx\]
\[x1xx\]
\[xx-1x\]
\[xxx1\]
For yz, -1 is at 1,1. For xz, -1 is at 2, 2
$ Rf_{z=5} = T(0, 0, -5) Rf_{xy}(0, 0, 5)$

3D Shear
$ SH_{xy} = $
\[1xxx\]
\[x1xx\]
\[sh_x sh_y xx\]
\[xxx1\]

$ SH_{xz} = $
\[1xxx\]
\[sh_x 1 sh_z x\]
\[xx1x\]
\[xxx1\]

$ SH_{yz} = $
\[1 sh_y sh_z 0 \]
\[x1xx\]
\[xx1x\]
\[xxx1\]

Rotate a line around its akis by $ \beta $ degrees:
$ M = R_x^{90 - \theta} R_z^\beta R_x^{-90+\theta}$

Given $ P_1 (x_1, y_1, z_1), P_2(x_2, y_2, z_2), \theta = 30$. Find: M to rotate $ \theta $ around $ P_1P_2$
$ M = T_{orig} R_x^{\alpha} R_y^{\beta} R_z^{\theta} R_y^{-\beta} R_x^{-\alpha} T_{-orig}$

2D: (S - scale, T - translate, R - rotate, SH - shear)
$ T_1 T_2 = T_2 T_1 YES$
$ S_1 S_2 = S_2 S_1 YES$
$ R_1 R_2 = R_2 R_1 NO$
$ SH_{x1} SH_{x2} = SH_{x2} SH_{x1} YES$
