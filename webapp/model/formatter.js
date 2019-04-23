sap.ui.define([], function() {
	"use strict";

	return {
		
		
		
		
		fngetMaterialID: function(sLabel){
				var oModel= this.getView().getModel("materialID");
				var sPath="/"+sLabel;
				var sMaterialID=oModel.getProperty(sPath);
				return sMaterialID;
			},  
	
	
	};
});