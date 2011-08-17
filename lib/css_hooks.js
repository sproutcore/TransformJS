// ==========================================================================
// Project:  TransformJS        
// Copyright: ©2011 Strobe Inc.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

require('TransformJS/sylvester');

(function($) {
  if ( !$.cssHooks ) {
    throw("jQuery 1.4.3+ is needed for this plugin to work");
    return;
  }
  
  function styleSupport( prop ) {
    var vendorProp, supportedProp,

        // capitalize first character of the prop to test vendor prefix
        capProp = prop.charAt(0).toUpperCase() + prop.slice(1),
        prefixes = [ "Moz", "Webkit", "O", "ms" ],
        div = document.createElement( "div" );

    if ( prop in div.style ) {

      // browser supports standard CSS property name
      supportedProp = prop;
    } else {

      // otherwise test support for vendor-prefixed property names
      for ( var i = 0; i < prefixes.length; i++ ) {
        vendorProp = prefixes[i] + capProp;
        if ( vendorProp in div.style ) {
          supportedProp = vendorProp;
          break;
        }
      }
    }

    // avoid memory leak in IE
    div = null;
    
    // add property to $.support so it can be accessed elsewhere
    $.support[ prop ] = supportedProp;
    
    return supportedProp;
  }
  
  var transformProperty = styleSupport('transform');
  console.log(transformProperty);
  
  var properties = {
    rotateX: {
      defaultValue: 0
    },
    rotateY: {
      defaultValue: 0
    },
    rotateZ: {
      defaultValue: 0
    },
    translateX: {
      defaultValue: 0
    },
    translateY: {
      defaultValue: 0
    },
    translateZ: {
      defaultValue: 0
    },
    scale: {
      defaultValue: 1
    }
  };

  var RotationXMatrix = function(a) {
    return $M([
      [1,0,0,0],
      [0,Math.cos(a), Math.sin(-a), 0],
      [0,Math.sin(a), Math.cos( a), 0],
      [0,0,0,1]
    ]);
  };

  var RotationYMatrix = function(b) {
    return $M([
      [Math.cos( b), 0, Math.sin(b),0],
      [0,1,0,0],
      [Math.sin(-b), 0, Math.cos(b), 0],
      [0,0,0,1]
    ]);
  };

  var RotationZMatrix = function(c) {
    return $M([
      [Math.cos(c), Math.sin(-c), 0, 0],
      [Math.sin(c), Math.cos( c), 0, 0],
      [0,0,1,0],
      [0,0,0,1]
    ]);
  };

  var TranslationMatrix = function(tx,ty,tz) {
    return $M([
      [1,0,0,0],
      [0,1,0,0],
      [0,0,1,0],
      [tx,ty,tz,1]
    ]);
  };

  var ScaleMatrix = function(s) {  
    return $M([
      [s,0,0,0],
      [0,s,0,0],
      [0,0,s,0],
      [0,0,0,1]
    ]);
  };
  
  var applyMatrix = function(elem) {
      var transforms = $(elem).data('transforms');

      var rotX = transforms.rotateX || properties.rotateX.defaultValue,
          rotY = transforms.rotateY || properties.rotateY.defaultValue,
          rotZ = transforms.rotateZ || properties.rotateZ.defaultValue,
          scale = transforms.scale || properties.scale.defaultValue,
          translateX = transforms.translateX || properties.translateX.defaultValue,
          translateY = transforms.translateY || properties.translateY.defaultValue,
          translateZ = transforms.translateZ || properties.translateZ.defaultValue;

      var tM = RotationXMatrix(rotX)
                .x(RotationYMatrix(rotY))
                .x(RotationZMatrix(rotZ))
                .x(ScaleMatrix(scale))
                .x(TranslationMatrix(translateX,translateY,translateZ));
      
      s  = "matrix3d(";
        s += tM.e(1,1).toFixed(10) + "," + tM.e(1,2).toFixed(10) + "," + tM.e(1,3).toFixed(10) + "," + tM.e(1,4).toFixed(10) + ",";
        s += tM.e(2,1).toFixed(10) + "," + tM.e(2,2).toFixed(10) + "," + tM.e(2,3).toFixed(10) + "," + tM.e(2,4).toFixed(10) + ",";
        s += tM.e(3,1).toFixed(10) + "," + tM.e(3,2).toFixed(10) + "," + tM.e(3,3).toFixed(10) + "," + tM.e(3,4).toFixed(10) + ",";
        s += tM.e(4,1).toFixed(10) + "," + tM.e(4,2).toFixed(10) + "," + tM.e(4,3).toFixed(10) + "," + tM.e(4,4).toFixed(10);
      s += ")";
      
      elem.style[transformProperty] = s;
  }
  
  var hookFor = function(name) {
    
    $.fx.step[name] = function(fx){
      $.cssHooks[name].set( fx.elem, fx.now + fx.unit );
    };
    
    return {
      get: function( elem, computed, extra ) {
        var transforms = $(elem).data('transforms');
        if (transforms === undefined) {
          transforms = {};
          $(elem).data('transforms',transforms);
        }
        
        return transforms[name] || properties[name].defaultValue;
      },
      set: function( elem, value) {
        var transforms = $(elem).data('transforms');
        if (transforms === undefined) transforms = {};
        var propInfo = properties[name];

        if (typeof propInfo.apply === 'function') {
          transforms[name] = propInfo.apply(transforms[name] || propInfo.defaultValue, value);
        } else {
          transforms[name] = value
        }
        
        $(elem).data('transforms',transforms);
        applyMatrix(elem);
      }
    }
  }

  if (transformProperty) {
    for (var name in properties) {
      $.cssHooks[name] = hookFor(name);
      $.cssNumber[name] = true;
    } 
  }

})(jQuery);
