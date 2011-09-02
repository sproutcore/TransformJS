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
  
  var translationUnit = ''
  
  var prop = "transform",
      vendorProp, supportedProp, supports3d, supports2d, supportsFilter,
      
      // capitalize first character of the prop to test vendor prefix
      capProp = prop.charAt(0).toUpperCase() + prop.slice(1),
      prefixes = [ "Moz", "Webkit", "O", "ms" ],
      div = document.createElement( "div" );

  if ( prop in div.style ) {

    // browser supports standard CSS property name
    supportedProp = prop;
    supports3d = div.style.perspective !== undefined;
  } 
  else {

    // otherwise test support for vendor-prefixed property names
    for ( var i = 0; i < prefixes.length; i++ ) {
      vendorProp = prefixes[i] + capProp;

      if ( vendorProp in div.style ) {
        supportedProp = vendorProp;
        if (prefixes[i] === 'Moz') {
            translationUnit = 'px'
        }
        if((prefixes[i] + 'Perspective') in div.style) {
          supports3d = true;
        }
        else {
          supports2d = true;
        }
        break;
      }
    }
  }
  
  if (!supportedProp) {
    supportsFilter = ('filter' in div.style);
    supportedProp = 'filter';
  }

  // console.log('supportedProp: '+supportedProp+', 2d: '+supports2d+', 3d: '+supports3d+', filter: '+supportsFilter);

  // avoid memory leak in IE
  div = null;
  
  // add property to $.support so it can be accessed elsewhere
  $.support[ prop ] = supportedProp;
  
  var transformProperty = supportedProp;

  var properties = {
    rotateX: {
      defaultValue: 0,
      matrix: function(a) {
        if (supports3d) {
          return $M([
            [1,0,0,0],
            [0,Math.cos(a), Math.sin(-a), 0],
            [0,Math.sin(a), Math.cos( a), 0],
            [0,0,0,1]
          ]);          
        }
        else {
          return $M([
            [1, 0,0],
            [0, 1,0],
            [0,0,1]
          ]);               
        }
      }
    },
    rotateY: {
      defaultValue: 0,
      matrix: function(b) {
        if (supports3d) {
          return $M([
            [Math.cos( b), 0, Math.sin(b),0],
            [0,1,0,0],
            [Math.sin(-b), 0, Math.cos(b), 0],
            [0,0,0,1]
          ]);
        }
        else {
          return $M([
            [1, 0,0],
            [0, 1,0],
            [0,0,1]
          ]);               
        }
      }
    },
    rotateZ: {
      defaultValue: 0,
      matrix: function(c) {
        if (supports3d) {
          return $M([
            [Math.cos(c), Math.sin(-c), 0, 0],
            [Math.sin(c), Math.cos( c), 0, 0],
            [0,0,1,0],
            [0,0,0,1]
          ]);
        }
        else {
          return $M([
            [Math.cos(c), Math.sin(-c),0],
            [Math.sin(c), Math.cos( c),0],
            [0,0,1]
          ]);          
        }
      }
    },
    scale: {
      defaultValue: 1,
      matrix: function(s) {
        if (supports3d) {
          return $M([
            [s,0,0,0],
            [0,s,0,0],
            [0,0,s,0],
            [0,0,0,1]
          ]);
        }
        else {
          return $M([
            [s, 0,0],
            [0, s,0],
            [0,0,1]
          ]);               
        }
      }
    },
    translateX: {
      defaultValue: 0,
      matrix: function(tx) {
        if (supports3d) {
          return $M([
            [1,0,0,0],
            [0,1,0,0],
            [0,0,1,0],
            [tx,0,0,1]
          ]);
        }
        else {
          return $M([
            [1, 0,0],
            [0, 1,0],
            [tx,0,1]
          ]);               
        }
      }
    },
    translateY: {
      defaultValue: 0,
      matrix: function(ty) {
        if (supports3d) {
          return $M([
            [1,0,0,0],
            [0,1,0,0],
            [0,0,1,0],
            [0,ty,0,1]
          ]);
        }
        else {
          return $M([
            [1, 0,0],
            [0, 1,0],
            [0,ty,1]
          ]);               
        }
      }
    },
    translateZ: {
      defaultValue: 0,
      matrix: function(tz) {
        if (supports3d) {
          return $M([
            [1,0,0,0],
            [0,1,0,0],
            [0,0,1,0],
            [0,0,tz,1]
          ]);
        }
        else {
          return $M([
            [1, 0,0],
            [0, 1,0],
            [0,0,1]
          ]);               
        }
      }
    }
  };
  
  var applyMatrix = function(elem) {
      var transforms = $(elem).data('transforms');
      var tM;
      
      if (supports3d) {
        tM = $M([
          [1,0,0,0],
          [0,1,0,0],
          [0,0,1,0],
          [0,0,0,1]
        ]);
      }
      else {
        tM = $M([
          [1,0,0],
          [0,1,0],
          [0,0,1]
        ]);
      }

      for (var name in properties) {
        tM = tM.x(properties[name].matrix(transforms[name] || properties[name].defaultValue))
      }
      
      if (supports3d) {
        s  = "matrix3d(";
          s += tM.e(1,1).toFixed(10) + "," + tM.e(1,2).toFixed(10) + "," + tM.e(1,3).toFixed(10) + "," + tM.e(1,4).toFixed(10) + ",";
          s += tM.e(2,1).toFixed(10) + "," + tM.e(2,2).toFixed(10) + "," + tM.e(2,3).toFixed(10) + "," + tM.e(2,4).toFixed(10) + ",";
          s += tM.e(3,1).toFixed(10) + "," + tM.e(3,2).toFixed(10) + "," + tM.e(3,3).toFixed(10) + "," + tM.e(3,4).toFixed(10) + ",";
          s += tM.e(4,1).toFixed(10) + "," + tM.e(4,2).toFixed(10) + "," + tM.e(4,3).toFixed(10) + "," + tM.e(4,4).toFixed(10);
        s += ")";        
      }
      else if (supports2d) {
        s  = "matrix(";
          s += tM.e(1,1).toFixed(10) + "," + tM.e(1,2).toFixed(10) + ",";
          s += tM.e(2,1).toFixed(10) + "," + tM.e(2,2).toFixed(10) + ",";
          s += tM.e(3,1).toFixed(10) + translationUnit + "," + tM.e(3,2).toFixed(10) + translationUnit;
        s += ")";        
      }
      else if (supportsFilter) {
        s = "progid:DXImageTransform.Microsoft.";
			 	  s += "Matrix(";
            s += "M11="+tM.e(1,1).toFixed(10) + ",";
            s += "M12="+tM.e(1,2).toFixed(10) + ",";
            s += "M21="+tM.e(2,1).toFixed(10) + ",";
            s += "M22="+tM.e(2,2).toFixed(10) + ",";
            s += "SizingMethod='auto expand'";
          s += ")";
          
        elem.style.top = tM.e(3,1);
        elem.style.left = tM.e(3,2);
      }

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
