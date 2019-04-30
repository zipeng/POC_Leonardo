sap.ui.define([
		"sap/ui/core/mvc/Controller"
	], function (Controller) {
		"use strict";

		return Controller.extend("demo.POC_leonardo.controller.BaseController", {
			/**
			 * Convenience method for accessing the router.
			 * @public
			 * @returns {sap.ui.core.routing.Router} the router for this component
			 */
			fngetMaterialID: function(sLabel){
				var oModel= this.getModel("materialID");
				var sPath="/"+sLabel;
				var sMaterialID=oModel.getProperty(sPath);
				return sMaterialID;
			},  
			 
			getRouter : function () {
				return sap.ui.core.UIComponent.getRouterFor(this);
			},

			/**
			 * Convenience method for getting the view model by name.
			 * @public
			 * @param {string} [sName] the model name
			 * @returns {sap.ui.model.Model} the model instance
			 */
			getModel : function (sName) {
				return this.getView().getModel(sName);
			},

			/**
			 * Convenience method for setting the view model.
			 * @public
			 * @param {sap.ui.model.Model} oModel the model instance
			 * @param {string} sName the model name
			 * @returns {sap.ui.mvc.View} the view instance
			 */
			setModel : function (oModel, sName) {
				return this.getView().setModel(oModel, sName);
			},
			
			fnGetMaterialImageURL : function(sMaterial){
				
				var oMaterialImageModel= this.getModel("materilaPic");
				var sPath="/"+sMaterial;
				var sURL= oMaterialImageModel.getProperty(sPath);
				return sURL;
			},
			
			fnSetMaterialImageURL: function(sURL){
				var oPicModel=this.getModel("CurrentPicture");
				oPicModel.setProperty("/defaultURI", sURL);
			},

			/**
			 * Getter for the resource bundle.
			 * @public
			 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
			 */
			getResourceBundle : function () {
				return this.getOwnerComponent().getModel("i18n").getResourceBundle();
			}

		});

	}
);