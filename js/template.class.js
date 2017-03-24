if (typeof Object.assign != 'function') {
  (function () {
    Object.assign = function (target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  })();
}

/**
 * [Template description]
 * @param {[type]} sUrlScript [description]
 */
var Template = function( sTemplate, aPattern) {

    this._sTemplate = sTemplate;
    this._aNeed     = [];

    this._aPattern = (typeof(aPattern) != 'undefined' && aPattern.length == 2)? aPattern : ['[:',':]'];

    var oRegex = new RegExp( this.clean( this._aPattern[0]) + '(.*?)' + this.clean( this._aPattern[1]), 'g'),
        aFind  = sTemplate.match( oRegex),
        i      = 0,
        sAttr  = '',
        iLimit = aFind.length;

    for( ;i < iLimit ; i++){
      sAttr = aFind[i].split( this._aPattern[0]).join( '');
      sAttr = sAttr.split( this._aPattern[1]).join( '');
      this._aNeed.push( sAttr.toLowerCase());
    }

};

/**
 * [treatObjet treatement par reference]
 * @param  {[type]} _oObj    [description]
 * @param  {[type]} _oReturn [description]
 * @return {[type]}          [description]
 */
Template.prototype.treatObjet = function( sPrefix, oItem, oParent) {

    var sNewAttr;
    for (var sAttr in oItem) {

        if( typeof( oItem[sAttr]) == 'object'){

            sNewAttr = ( sPrefix !== '')? sPrefix + '.' + sAttr : sAttr;
            this.treatObjet( sNewAttr, oItem[sAttr], oItem);
            delete oParent[sAttr];

        }else{
            sNewAttr = ( sPrefix !== '')? sPrefix + '.' + sAttr : sAttr;
            oParent[sNewAttr] = oItem[sAttr];
        }

    }

};

/**
 * [function description]
 * @return {[type]} [description]
 */
Template.prototype.clean = function( pattern){

    return pattern.replace(/\\/g, '\\\\').
        replace(/\[/g, '\\[').
        replace(/\?/g, '\\?').
        replace(/\!/g, '\\!').
        replace(/\*/g, '\\*').
        replace(/\]/g, '\\]');

};

/**
 * [compute description]
 * @param  {[type]} oItem [description]
 * @return {[type]}       [description]
 */
Template.prototype.compute = function( _oItem, _oDirective) {

    _oDirective = _oDirective || {};

    var oItem      = JSON.parse( JSON.stringify( _oItem)),
        oDirective = Object.assign( {}, _oDirective),
        sTemplate  = this._sTemplate,
        sValue     = '',
        sAttr      = '',
        sValueTmp  = '',
        i          = 0,
        iLimit     = this._aNeed.length;

    this.treatObjet( '', oItem, {});
    this.treatObjet( '', oDirective, {});

    for(; i < iLimit; i++){

      sAttr = this._aNeed[ i ];

      if( oDirective[ sAttr] && (typeof oDirective[sAttr] == 'function')){

        sValueTmp = oItem[ sAttr ] || null;
        sValue    = oDirective[ sAttr ].call( _oItem, sValueTmp);

      }else{

        sValue = (typeof oItem[ sAttr ] == "undefined")? '' : oItem[ sAttr ] ;
      }

      sTemplate = sTemplate.split( this._aPattern[0] + sAttr.toUpperCase() + this._aPattern[1]).join( sValue);
    }

    return sTemplate;

};
