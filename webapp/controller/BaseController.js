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
			
			fnGetMaterialModelURL: function(sMaterial){
				var oMaterialModelModel= this.getModel("materialModel");
				var sPath="/"+sMaterial;
				var oMaterialModel= oMaterialModelModel.getProperty(sPath);
				var sURL="/Zipengml_Production/api/v2/image/classification/models/"+oMaterialModel.Name+"/versions/"+oMaterialModel.Version;
			
				return sURL;
			},
			
			
			fncallModelnew: function(oController, file){
	
	  var url = "/Zipengml_Production/api/v2/image/classification/models/Materialnewtraining/versions/1";
  var type = this.getView().getModel("demo").getProperty("/method");
  
  var accept = this.getView().getModel("demo").getProperty("/accept");
	this.formData = new window.FormData();


  this.formData.append("files", file, file.name);
	
	var callbackAjaxSuccess = function (data, status, jqXHR) {
    oController.processResults(oController, data);
  };
  var callbackAjaxError = function (jqXHR, status, message) {
    oController.clearPredictions();
    var error_message = {
      "error": jqXHR.responseJSON.error
    };
    oController.processResults(oController, error_message);
  };
	
	$.ajax({
      type: type,
      url: url,
      headers: {
        "Accept": accept,
        "Authorization": oController.Tocken
      },
      success: callbackAjaxSuccess,
      error: callbackAjaxError,
      contentType: false,
      async: true,
      data: this.formData,
      cache: false,
      processData: false
    });
	
	
},
			
			
			fnCheckQuality: function(oController,sMaterial){
					  var url = this.fnGetMaterialModelURL(sMaterial);
  var type = this.getView().getModel("demo").getProperty("/method");
  
  var accept = this.getView().getModel("demo").getProperty("/accept");



  
	

	
	$.ajax({
      type: type,
      url: url,
      headers: {
        "Accept": accept,
        "Authorization": oController.Tocken
      },
      success: function (data, status, jqXHR) {
           console.log(data);
           this.fnsetQuality(data.predictions[0].results[0].label);
            this.onNaveToMaterial(sMaterial);
            }.bind(this),
      error: function (jqXHR, status, message) {
    this.onNaveToMaterial(sMaterial);
           }.bind(this),
      contentType: false,
      async: true,
      data: this.formData,
      cache: false,
      processData: false
    });
	
			},
			
			
	fnsetQuality: function(sQuality){
		this.getView().getModel("CurrentPicture").setProperty("/Quality",sQuality);
		
	},		

			/**
			 * Getter for the resource bundle.
			 * @public
			 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
			 */
			getResourceBundle : function () {
				
			}

		});

	}
);