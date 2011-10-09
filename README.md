# TransformJS 1.0 Beta

### 2D and 3D transforms as regular CSS properties you can set using `.css()` and animate using `.animate()`

## Overview

  CSS Transforms  were first introduced in WebKit in 2007, and have now 
reached mass-adoption by all the major browser vendors. This is great news 
for web developers, especially in the case of 3D transforms which are
hardware-accelerated, resulting in extremely smooth animations and
responsive applications. 

  The API for applying transforms however, does not scale to complex applications 
which require intricate and complex management of transformations. TransformJS
attempts to identify and address these problems, allowing developers to
make use of transforms without having to be encumbered by cross browser
issues, and low-level APIs.

  Here's a snippet of code that uses TransformJS to apply multiple 3d
transformations to the same element, relative to their current value,
and animate the changes:

```javascript
    $('#test').animate({
      translateY:'+=150',
      scale:'+=2',
      rotateY: '+=6.24',
      rotateX: '+=3.15',
      rotateZ: '+=3.15'
    },1500);    
```

For more detailed usage and overview information, please visit the
project homepage at http://transformjs.strobeapp.com

## License


  <javascript>
    Copyright (c) 2011 Strobe Inc.

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
  </javascript>
    


---

[Back to top](#)
