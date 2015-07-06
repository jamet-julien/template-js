/**
 * [Template description]
 * @param {[type]} sUrlScript [description]
 */
var Template = function(sTemplate, aPattern) {

    this._sTemplate = sTemplate;

    this._aPattern = (typeof(aPattern) != 'undefined' && aPattern.length == 2)? aPattern : ['[:',':]'];

}

/**
 * [treatObjet description]
 * @param  {[type]} _oObj    [description]
 * @param  {[type]} _oReturn [description]
 * @return {[type]}          [description]
 */
Template.prototype.treatObjet = function( sPrefix, oItem, oParent) {

    var sNewAttr;
    for (var sAttr in oItem) {

        if( typeof( oItem[sAttr]) == 'object'){

            sNewAttr = ( sPrefix != '')? sPrefix + '.' + sAttr : sAttr;
            oParent  = this.treatObjet( sNewAttr, oItem[sAttr], oItem);
            delete oParent[sAttr];

        }else{
            sNewAttr = ( sPrefix != '')? sPrefix + '.' + sAttr : sAttr;
            oParent[sNewAttr] = oItem[sAttr];
        }

    }

    return oParent;

}

/**
 * [compute description]
 * @param  {[type]} oItem [description]
 * @return {[type]}       [description]
 */
Template.prototype.compute = function( oItem) {

    var sTemplate = this._sTemplate;

    var oNewItem  = this.treatObjet( '', oItem, {});

    for (var sAttr in oNewItem) {

        sTemplate = sTemplate.split( this._aPattern[0] + sAttr.toUpperCase() + this._aPattern[1]).join( oItem[sAttr]);

    }

    return sTemplate;

}