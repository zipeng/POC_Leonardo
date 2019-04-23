sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		
	
		
		createFrontendModel: function() {
			var oModelData = {
				
				"CurrentMaterial": null
			};
			var oModel = new JSONModel(oModelData);
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;			
		}

	};
});