sap.ui.define([
	'jquery.sap.global',
	'demo/POC_leonardo/controller/BaseController',
		
		'sap/ui/model/json/JSONModel'
], function (jQuery, BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("demo.POC_leonardo.controller.MaterialInfo", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf demo.POC_leonardo.view.MaterialInfo
		 */
		  getRouter : function () {
				return sap.ui.core.UIComponent.getRouterFor(this);
			},
			
			getCompModel : function (sName) {
				return this.getOwnerComponent().getModel(sName);
			},
		 
		onInit: function () {
			this.getRouter().getRoute("MaterialInfo").attachPatternMatched(this.onDisplay, this);
		},
		
	
		 getCurrentMaterial: function(){
		 	return this.getCompModel("Material").getProperty('/CurrentMaterial');
		 },
		 
		 fnGetMaterialMasterData: function(sCurrentMaterialID){
		 var oMaterialMasterModel=	this.getView().getModel("MaterialNew");
		//   var oMaterialMasterModel=	this.getView().getModel("materialmaster");
		  
		  var sURL="/C_ProductObjPg('"+sCurrentMaterialID+"')";
		  oMaterialMasterModel.read(sURL, {
					
	        		
	        		
	        		"success": function(oData, oResponse) {
	        		        				        				        			
	        		console.log(oData);
	        		// set model data
	        		var oMatStockModel = this.getModel("MaterialStockInfo");
	        		oMatStockModel.setProperty("/MaterialMaster",oData);
	        			
	        		}.bind(this),

	        		"error": function(oError) { 
	        		
	        		}.bind(this) 
				});
	        	
		 },
		 
		 fnGetMaterialStock: function(sCurrentMaterialID){
		 var oMaterialMLModel=	this.getView().getModel("MaterialML");
		//   var oMaterialMasterModel=	this.getView().getModel("materialmaster");
		  
		  var sURL="/MaterialStockSet('"+sCurrentMaterialID+"')";
		  oMaterialMLModel.read(sURL, {
					
	        		
	        		
	        		"success": function(oData, oResponse) {
	        		        				        				        			
	        		console.log(oData);
	        		// set model data
	        	var oMatStockModel = this.getModel("MaterialStockInfo");
	        		oMatStockModel.setProperty("/Stock",oData);
	        			
	        		}.bind(this),

	        		"error": function(oError) { 
	        		
	        		}.bind(this) 
				});
	        	
		 },
		 
		 fnpostGoodsreceipt: function(){
		 	
		 var sCurrentMaterial=this.getModel("MaterialStockInfo").getProperty("/MaterialMaster/Product");
		 
		 var sAmount=this.getModel("MaterialStockInfo").getProperty("/PostAmount");
		 var oMaterialAmount={ 
         "Matnr" : sCurrentMaterial, 
         "Erfmg" : sAmount
        };	
		 var oMaterialMLModel=	this.getView().getModel("MaterialML");
		//   var oMaterialMasterModel=	this.getView().getModel("materialmaster");
		  
		  var sURL="/GMSet";
		  oMaterialMLModel.create(sURL,oMaterialAmount, {
					
	        		
	        		
	        		
	        		"success": function(oData, oResponse) {
	        		        				        				        			
	        		console.log(oData);
	        		// set model data
	        		this.fnGetMaterialStock(sCurrentMaterial);
	        	this.fnCleanInput();
	        			
	        		}.bind(this),

	        		"error": function(oError) { 
	        			console.log("error");
	        		this.fnGetMaterialStock(sCurrentMaterial);
	        		this.fnCleanInput();
	        		}.bind(this) 
				});
	        	
		 },
		 
		 fnInitCurrentMaterial: function(sCurrentMaterialID){
		 	
		 	var sURL=this.fnGetMaterialImageURL(sCurrentMaterialID);
		 	
		 
		 	
		 	this.fnSetMaterialImageURL(sURL);
		 	
		 	this.fnGetMaterialMasterData(sCurrentMaterialID);
		 	// fnGet Stock Data
		 	this.fnGetMaterialStock(sCurrentMaterialID);
		 },
		 
		 fnQualityCheck: function(oEvent){
		 	
		 },
		 
		onDisplay: function(oEvent) {
			//this.removeAllMessages();
			this.fnCleanInput();
		    var sCurrentMaterialID=oEvent.getParameter("arguments").appdata;
			var oCurrentMaterial = this.getCurrentMaterial();
			// fn Quality Check
			if(oCurrentMaterial){
				
			}else
			{
				this.fnInitCurrentMaterial(sCurrentMaterialID);	
			}
		
			
		},

onGoHome: function(oEvent){
		this.getRouter().navTo("Routedemo");
},


fnCleanInput: function(){
	var oModel=this.getModel("MaterialStockInfo");
	oModel.setProperty("/PostAmount",null);
	
},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf demo.POC_leonardo.view.MaterialInfo
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf demo.POC_leonardo.view.MaterialInfo
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf demo.POC_leonardo.view.MaterialInfo
		 */
		//	onExit: function() {
		//
		//	}

	});

});