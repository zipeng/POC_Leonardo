/* global JSZip:true */
/* global saveAs:true */
sap.ui.define([
  'demo/POC_leonardo/controller/BaseController',
  'demo/POC_leonardo/model/formatter',
  "sap/m/MessageBox"
], function (Controller,formatter, MessageBox) {
  "use strict";
  return Controller.extend("demo.POC_leonardo.controller.demo", {
    Tocken:"",
    formData:null,
	Tocken2:"",
	formatter: formatter,
    onInit:function(){
    	this.fngetTocken();
    	this.fngetTocken2();
    //	this.fngetTocken1ptrail();
    },
    
    fileTypeMissmatch: function (oControlEvent) {
      MessageBox.show("Wrong file type!");
    },
    clearPredictions: function () {
      this.getView().getModel("demo").setProperty("/predictions", null);
      this.getView().getModel("demo").setProperty("/visible", false);
      this.getView().getModel("demo").setProperty("/qualitybutton", true);
    },
    addPrediction: function (prediction) {
      var current = this.getView().getModel("demo").getProperty("/predictions");
      if (!current) {
        current = [];
      }
      var result= prediction.results.filter(function (el) {
							return el.label !="negative";
				});
				
	//prediction.results=	result;		
      
     
      	current.push(prediction);
      
      //current.push(prediction);
      // add the results from the model
      this.getView().getModel("demo").setProperty("/predictions", current);
      this.getView().getModel("demo").setProperty("/visible", true);
    },
    
    getRouter : function () {
				return sap.ui.core.UIComponent.getRouterFor(this);
			},
    
    onNaveToMaterial: function(sID){
    
    	this.getRouter().navTo("MaterialInfo", {
						appdata: sID					
					});
    },
    
    displayErrorsOrFinish: function (oController) {
      if (oController.oFilesProcessed === oController.oFiles.length) {
        oController.oBusyIndicator.close();
        if (oController.oErrors.length === 0) {
       //   MessageBox.show("Process completed!\n Target URL: " + oController.getView().getModel("demo").getProperty("/url"));
        } else {
          var message = "";
          for (var i = 0; i < oController.oErrors.length; i++) {
            message += "\n\t  Error: " + oController.oErrors[i].status + " - " + oController.oErrors[i].message;
          }
          MessageBox.show("Errors: \n" + message);
        }
      }
    },
    
    fileUploaderChange: function (oControlEvent) {
  // start the busy indicator
  var oBusyIndicator = new sap.m.BusyDialog();
  oBusyIndicator.open();

  // clear previous results from the model
  this.clearPredictions();

  // keep a reference of the uploaded file name and create the local url
  var oFiles = oControlEvent.getParameters().files;
  for (var i = 0; i < oFiles.length; i++) {
    oFiles[i].contentUrl = URL.createObjectURL(oFiles[i]);
  }
  // keep a reference in the view to close it later
  this.oBusyIndicator = oBusyIndicator;
  this.oFiles = Object.assign({}, oFiles);
  this.oFiles.length = oFiles.length;
  this.oFilesProcessed = 0;
  this.oErrors = [];
},
fileUploaderComplete: function (oControlEvent) {
  var response = JSON.parse(oControlEvent.getParameters().responseRaw);
  this.processResults(this, response);
},
processResults: function (oController, response) {
  oController.oFilesProcessed++;
  if (response.status === "DONE") {
    for (var i = 0; i < response.predictions.length; i++) {
      var callback = function (prediction, contentUrl) {
        prediction.contentUrl = contentUrl;
        oController.addPrediction(prediction);
      };
      oController.getFileContentUrl(oController.oFiles, response.predictions[i], callback);
    }
  } else {
    oController.oErrors.push({
      "status": response.error.code,
      "message": response.error.message
    });
  }
  oController.displayErrorsOrFinish(oController);
},

/* the following code is used by the Ajax & XHR methods only*/
onPressImageClassifier: function (oControlEvent) {
  // start the busy indicator
  var oBusyIndicator = new sap.m.BusyDialog();
  oBusyIndicator.open();

  // clear previous results from the model
  this.clearPredictions();

  // get the call mode ajax or xhr
  var mode = oControlEvent.getSource().data("mode");

  // keep a reference of the uploaded file
  var oFiles = oControlEvent.getParameters().files;

  // keep a reference in the view to close it later
  this.oBusyIndicator = oBusyIndicator;
  this.oFiles = Object.assign({}, oFiles);
  this.oFiles.length = oFiles.length;
  this.oFilesProcessed = 0;
  this.oErrors = [];

  for (var i = 0; i < oFiles.length; i++) {
    this.oFiles[i].contentUrl = URL.createObjectURL(this.oFiles[i]);
    //this.callService(this, mode, this.oFiles[i], this.processResults);
    this.fncallModelnew(this,this.oFiles[i]);
  }
},


onQualityChecknew: function (oControlEvent) {
  // start the busy indicator
  var sLabel=oControlEvent.getSource().getParent().oBindingContexts.demo.getObject().label;
  var sScore=oControlEvent.getSource().getParent().oBindingContexts.demo.getObject().score;
  var sMaterialID = this.getView().getModel("materialID").getProperty("/"+sLabel);
  
  	var oCurrentPredictions=this.getView().getModel("demo").getProperty("/predictions")[0];
  	
    	this.getView().getModel("CurrentPicture").setProperty("/URI",oCurrentPredictions.contentUrl);
    	this.getView().getModel("CurrentPicture").setProperty("/MaterialID",sMaterialID);
    	this.getView().getModel("CurrentPicture").setProperty("/Confident",sScore);
    	
  
  this.onNaveToMaterial(sMaterialID);
  
},

onSelectionChange: function(oEvent){
	
	var oSelectedItem = oEvent.getParameter("listItem");
   	var sLabel=oSelectedItem.oBindingContexts.demo.getObject().label;
  var sScore=oSelectedItem.oBindingContexts.demo.getObject().score;
  var sMaterialID = this.getView().getModel("materialID").getProperty("/"+sLabel);
  
  	var oCurrentPredictions=this.getView().getModel("demo").getProperty("/predictions")[0];
  	
    	this.getView().getModel("CurrentPicture").setProperty("/URI",oCurrentPredictions.contentUrl);
    	this.getView().getModel("CurrentPicture").setProperty("/MaterialID",sMaterialID);
    	this.getView().getModel("CurrentPicture").setProperty("/Confident",sScore);
},



onContinue: function(){

  var sMaterialID = this.getView().getModel("CurrentPicture").getProperty("/MaterialID");
  
  this.fnCheckQuality(this,sMaterialID);
    	
  
  //this.onNaveToMaterial(sMaterialID);
},




/* the following code is used by the Ajax & XHR methods only*/
onQualityCheck: function (oControlEvent) {
  // start the busy indicator
  var oBusyIndicator = new sap.m.BusyDialog();
  oBusyIndicator.open();
this.oBusyIndicator=oBusyIndicator;
  // clear previous results from the model
  this.clearPredictions();
  this.getView().getModel("demo").setProperty("/qualitybutton", false);
 this.fncallQualityModel(this);
  
},


fngetTocken1ptrail: function(){
	
//	var Autho= "Basic c2ItZjViZTcwYWUtZDQ0Yi00OThiLWE4ZjMtODdmMzI0ZDYxMjI1IWI5Njk1fGZvdW5kYXRpb24tc3RkLW1sZnRyaWFsIWIzNDEwOmd2MWJ6SnJrVkZsKzBOYUplbS9YWnlaalc2OD0=";
		var callbackAjaxSuccess = function (data, status, jqXHR) {
			this.Tocken="Bearer "+data.access_token;
    console.log(data);
  }.bind(this);
  var callbackAjaxError = function (jqXHR, status, message) {
    
  };
	var url = "/MLTocken2/";
	var type = "GET";
	$.ajax({
      type: type,
      url: url,
      
      data:{
      	grant_type:"client_credentials"
      },
      success: callbackAjaxSuccess,
      error: callbackAjaxError
      
    });
},

fngetTocken: function(){
	
//	var Autho= "Basic c2ItZjViZTcwYWUtZDQ0Yi00OThiLWE4ZjMtODdmMzI0ZDYxMjI1IWI5Njk1fGZvdW5kYXRpb24tc3RkLW1sZnRyaWFsIWIzNDEwOmd2MWJ6SnJrVkZsKzBOYUplbS9YWnlaalc2OD0=";
		var callbackAjaxSuccess = function (data, status, jqXHR) {
			this.Tocken="Bearer "+data.access_token;
    console.log(data);
  }.bind(this);
  var callbackAjaxError = function (jqXHR, status, message) {
    
  };
	var url = "/MLTockenProduction/";
	var type = "GET";
	$.ajax({
      type: type,
      url: url,
      
      data:{
      	grant_type:"client_credentials"
      },
      success: callbackAjaxSuccess,
      error: callbackAjaxError
      
    });
},

fngetTocken2: function(){
	
	var Autho= "Basic c2ItNmI4NzZjZjEtYTJmZS00N2YyLWFhYTAtZWIzNDFiMGRlMWM3IWIxMDQwMHxmb3VuZGF0aW9uLXN0ZC1tbGZ0cmlhbCFiMzQxMDo5UWk4V1VwT0JWS1FVUm8wTEl4ZnpMUlk5ck09";
		var callbackAjaxSuccess = function (data, status, jqXHR) {
			this.Tocken2="Bearer "+data.access_token;
    console.log(data);
  }.bind(this);
  var callbackAjaxError = function (jqXHR, status, message) {
    
  };
	var url = "/MLTockenStrail/";
	var type = "GET";
	$.ajax({
      type: type,
      url: url,
      
      data:{
      	grant_type:"client_credentials"
      },
      success: callbackAjaxSuccess,
      error: callbackAjaxError
      
    });
},



fncallQualityModel: function(oController){
	
	  var url = "/Zipengml_Production/api/v2/image/classification/models/20EuroQuality2/versions/1";
  var type = this.getView().getModel("demo").getProperty("/method");
  
  var accept = this.getView().getModel("demo").getProperty("/accept");
	
	
	var callbackAjaxSuccess = function (data, status, jqXHR) {
		oController.oBusyIndicator.close();
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
      type: "post",
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
/*
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

*/
fncallModel: function(oController, file){
	
	  var url = "/Zipengml_strail/api/v2/image/classification/models/retrainwithnegative/versions/2";
  var type = this.getView().getModel("demo").getProperty("/method");
  
  var accept = this.getView().getModel("demo").getProperty("/accept");
	this.formData = new window.FormData();

var Tocken="Bearer eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vcDE5NDA3MTYyMDd0cmlhbC5hdXRoZW50aWNhdGlvbi5ldTEwLmhhbmEub25kZW1hbmQuY29tL3Rva2VuX2tleXMiLCJraWQiOiJrZXktaWQtMSIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5NmZiYmZjNTRjMjA0NmY1YmE0MGE4ODY1ZjE2MDM4YyIsImV4dF9hdHRyIjp7ImVuaGFuY2VyIjoiWFNVQUEiLCJ6ZG4iOiJwMTk0MDcxNjIwN3RyaWFsIiwic2VydmljZWluc3RhbmNlaWQiOiJmNWJlNzBhZS1kNDRiLTQ5OGItYThmMy04N2YzMjRkNjEyMjUifSwic3ViIjoic2ItZjViZTcwYWUtZDQ0Yi00OThiLWE4ZjMtODdmMzI0ZDYxMjI1IWI5Njk1fGZvdW5kYXRpb24tc3RkLW1sZnRyaWFsIWIzNDEwIiwiYXV0aG9yaXRpZXMiOlsidWFhLnJlc291cmNlIiwiZm91bmRhdGlvbi1zdGQtbWxmdHJpYWwhYjM0MTAucmV0cmFpbnNlcnZpY2UucmVhZCIsImZvdW5kYXRpb24tc3RkLW1sZnRyaWFsIWIzNDEwLm1vZGVsc2VydmljZS5yZWFkIiwiZm91bmRhdGlvbi1zdGQtbWxmdHJpYWwhYjM0MTAubW9kZWxtZXRlcmluZy5yZWFkIiwiZm91bmRhdGlvbi1zdGQtbWxmdHJpYWwhYjM0MTAubW9kZWxyZXBvLndyaXRlIiwiZm91bmRhdGlvbi1zdGQtbWxmdHJpYWwhYjM0MTAucmVzb3VyY2VwbGFuc2VydmljZS5hbGwiLCJmb3VuZGF0aW9uLXN0ZC1tbGZ0cmlhbCFiMzQxMC5tb2RlbGRlcGxveW1lbnQuYWxsIiwiZm91bmRhdGlvbi1zdGQtbWxmdHJpYWwhYjM0MTAubWVoLmFsbCIsImZvdW5kYXRpb24tc3RkLW1sZnRyaWFsIWIzNDEwLm1vZGVscmVwby5yZWFkIiwiZm91bmRhdGlvbi1zdGQtbWxmdHJpYWwhYjM0MTAucmV0cmFpbnNlcnZpY2Uud3JpdGUiLCJmb3VuZGF0aW9uLXN0ZC1tbGZ0cmlhbCFiMzQxMC5mdW5jdGlvbmFsc2VydmljZS5hbGwiLCJmb3VuZGF0aW9uLXN0ZC1tbGZ0cmlhbCFiMzQxMC5kYXRhbWFuYWdlbWVudC53cml0ZSIsImZvdW5kYXRpb24tc3RkLW1sZnRyaWFsIWIzNDEwLmRhdGFtYW5hZ2VtZW50LnJlYWQiLCJmb3VuZGF0aW9uLXN0ZC1tbGZ0cmlhbCFiMzQxMC5zdG9yYWdlYXBpLmFsbCJdLCJzY29wZSI6WyJ1YWEucmVzb3VyY2UiLCJmb3VuZGF0aW9uLXN0ZC1tbGZ0cmlhbCFiMzQxMC5yZXRyYWluc2VydmljZS5yZWFkIiwiZm91bmRhdGlvbi1zdGQtbWxmdHJpYWwhYjM0MTAubW9kZWxzZXJ2aWNlLnJlYWQiLCJmb3VuZGF0aW9uLXN0ZC1tbGZ0cmlhbCFiMzQxMC5tb2RlbG1ldGVyaW5nLnJlYWQiLCJmb3VuZGF0aW9uLXN0ZC1tbGZ0cmlhbCFiMzQxMC5tb2RlbHJlcG8ud3JpdGUiLCJmb3VuZGF0aW9uLXN0ZC1tbGZ0cmlhbCFiMzQxMC5yZXNvdXJjZXBsYW5zZXJ2aWNlLmFsbCIsImZvdW5kYXRpb24tc3RkLW1sZnRyaWFsIWIzNDEwLm1vZGVsZGVwbG95bWVudC5hbGwiLCJmb3VuZGF0aW9uLXN0ZC1tbGZ0cmlhbCFiMzQxMC5tZWguYWxsIiwiZm91bmRhdGlvbi1zdGQtbWxmdHJpYWwhYjM0MTAubW9kZWxyZXBvLnJlYWQiLCJmb3VuZGF0aW9uLXN0ZC1tbGZ0cmlhbCFiMzQxMC5yZXRyYWluc2VydmljZS53cml0ZSIsImZvdW5kYXRpb24tc3RkLW1sZnRyaWFsIWIzNDEwLmZ1bmN0aW9uYWxzZXJ2aWNlLmFsbCIsImZvdW5kYXRpb24tc3RkLW1sZnRyaWFsIWIzNDEwLmRhdGFtYW5hZ2VtZW50LndyaXRlIiwiZm91bmRhdGlvbi1zdGQtbWxmdHJpYWwhYjM0MTAuZGF0YW1hbmFnZW1lbnQucmVhZCIsImZvdW5kYXRpb24tc3RkLW1sZnRyaWFsIWIzNDEwLnN0b3JhZ2VhcGkuYWxsIl0sImNsaWVudF9pZCI6InNiLWY1YmU3MGFlLWQ0NGItNDk4Yi1hOGYzLTg3ZjMyNGQ2MTIyNSFiOTY5NXxmb3VuZGF0aW9uLXN0ZC1tbGZ0cmlhbCFiMzQxMCIsImNpZCI6InNiLWY1YmU3MGFlLWQ0NGItNDk4Yi1hOGYzLTg3ZjMyNGQ2MTIyNSFiOTY5NXxmb3VuZGF0aW9uLXN0ZC1tbGZ0cmlhbCFiMzQxMCIsImF6cCI6InNiLWY1YmU3MGFlLWQ0NGItNDk4Yi1hOGYzLTg3ZjMyNGQ2MTIyNSFiOTY5NXxmb3VuZGF0aW9uLXN0ZC1tbGZ0cmlhbCFiMzQxMCIsImdyYW50X3R5cGUiOiJjbGllbnRfY3JlZGVudGlhbHMiLCJyZXZfc2lnIjoiNDZjN2Y4ODkiLCJpYXQiOjE1NDcxOTY1NDMsImV4cCI6MTU0NzIzOTc0MywiaXNzIjoiaHR0cDovL3AxOTQwNzE2MjA3dHJpYWwubG9jYWxob3N0OjgwODAvdWFhL29hdXRoL3Rva2VuIiwiemlkIjoiOTczMDAzZGEtZDVlZC00ZTJkLWJiZTItZDRiMjQzNzM0OWZkIiwiYXVkIjpbInNiLWY1YmU3MGFlLWQ0NGItNDk4Yi1hOGYzLTg3ZjMyNGQ2MTIyNSFiOTY5NXxmb3VuZGF0aW9uLXN0ZC1tbGZ0cmlhbCFiMzQxMCIsImZvdW5kYXRpb24tc3RkLW1sZnRyaWFsIWIzNDEwLnJldHJhaW5zZXJ2aWNlIiwiZm91bmRhdGlvbi1zdGQtbWxmdHJpYWwhYjM0MTAucmVzb3VyY2VwbGFuc2VydmljZSIsImZvdW5kYXRpb24tc3RkLW1sZnRyaWFsIWIzNDEwLm1laCIsImZvdW5kYXRpb24tc3RkLW1sZnRyaWFsIWIzNDEwLmZ1bmN0aW9uYWxzZXJ2aWNlIiwiZm91bmRhdGlvbi1zdGQtbWxmdHJpYWwhYjM0MTAuZGF0YW1hbmFnZW1lbnQiLCJmb3VuZGF0aW9uLXN0ZC1tbGZ0cmlhbCFiMzQxMC5tb2RlbG1ldGVyaW5nIiwidWFhIiwiZm91bmRhdGlvbi1zdGQtbWxmdHJpYWwhYjM0MTAubW9kZWxyZXBvIiwiZm91bmRhdGlvbi1zdGQtbWxmdHJpYWwhYjM0MTAubW9kZWxkZXBsb3ltZW50IiwiZm91bmRhdGlvbi1zdGQtbWxmdHJpYWwhYjM0MTAuc3RvcmFnZWFwaSIsImZvdW5kYXRpb24tc3RkLW1sZnRyaWFsIWIzNDEwLm1vZGVsc2VydmljZSJdfQ.FRH8YBwOJoKB6Z-egOf4i4PqTz-HTfZNSfEp5RMaf8nZYKN2WrXwmQ8ZffEb3UWGsnpaxxXlBLgf5JBHwOQmVcwqdgEZKo4D7mE2HfARutMGKn4cA6jrVmAlFiCTvNU9VC2AYGwBatAShE72KndL9Xc2pgRCvkxX46AowMqUCSFatx0KIwblSu3tnrgsGcnGvm5e8T2eCqtRsH_MUaehvLe4DI_m6zIbYuN8vf6qPLG4BEDIhayM8fl2m8SPB822Wyk4bkrneCzl6-88ZQ1Be24IUkvmnRpso7gOyArBJ7L4FoIlugnlGNJHqFpLbAxSUZlEkuXvn4LQop98hzxUTG17KiOyeflnAg4J4QMPZ-XrsA8FOPrP07w7Mmm1qWN58HmN1Pez6RKMchLrorLpCnxBJdoiO-1gP1dd0qEKiAItHay2xeWoWjxOE3vVxAUEwOr1wRYVAjAFlPPTMZSpxCcDK9MCLfpo9np4Q72S39sHh7woPJhGXhebCoEeyTZARFPSx6_wyvpd2tC2BeXnEeShsVwK1ONpw1lx1DEeehO8QHIo_syEDogIkvOY7pf2MtPZ6kPA3vDAhRmPg3LdMtQV7yDKsvUB5DhGwW9vUdADU1_rh3nMMVM0jK2ATRdXU2KTJIM8_3yy-ZjiuisdxMtq7b_DQXRzRjlfpO36IDc";

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
        "Authorization": oController.Tocken2
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

callService: function (oController, mode, file, callback) {
  // create the form data to be sent in the request
  var formData = new window.FormData();
  formData.append("files", file, file.name);
  console.log(file.name);

  var url = oController.getView().getModel("demo").getProperty("/url");
  var type = oController.getView().getModel("demo").getProperty("/method");
  var apiKey = oController.getView().getModel("demo").getProperty("/APIKey");
  var accept = oController.getView().getModel("demo").getProperty("/accept");

  var callbackAjaxSuccess = function (data, status, jqXHR) {
    callback(oController, data);
  };
  var callbackAjaxError = function (jqXHR, status, message) {
    oController.clearPredictions();
    var error_message = {
      "error": jqXHR.responseJSON.error
    };
    callback(oController, error_message);
  };
  var callbackXHRReadyStateChange = function () {
    if (this.readyState === this.DONE) {
      if (this.status === 200) {
        callback(oController, JSON.parse(this.response));
      } else {
        oController.clearPredictions();
        var error_message = {
          "error": this.responseJSON.error
        };
        callback(oController, error_message);
      }
    }
  };
  if (mode === "ajax") {
    $.ajax({
      type: type,
      url: url,
      headers: {
        "Accept": accept,
        "APIKey": apiKey
      },
      success: callbackAjaxSuccess,
      error: callbackAjaxError,
      contentType: false,
      async: true,
      data: formData,
      cache: false,
      processData: false
    });
  } else if (mode === "xhr") {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.addEventListener("readystatechange", callbackXHRReadyStateChange);
    xhr.open(type, url, true); // setting request method & API endpoint, the last parameter is to set the calls as asynchyronous
    xhr.setRequestHeader("Accept", accept); // adding request headers
    xhr.setRequestHeader("APIKey", apiKey); // API Key for API Sandbox
    xhr.send(formData); // sending request
  } else {
    oController.oBusyIndicator.close();
  }
},


    
    getFileContentUrl: function (files, prediction, callback) {
      for (var i = 0; i < files.length; i++) {
        if (files[i].type.match("image.*")) {
          if (files[i].name === prediction.name) {
            callback(prediction, files[i].contentUrl);
          }
        } else {
          JSZip.loadAsync(files[i]).then(function (zip) {
            Object.keys(zip.files).forEach(function (zipEntry) {
              if (zipEntry === prediction.name) {
                zip.files[zipEntry].async("blob").then(function (zipEntryFile) {
                  callback(prediction, URL.createObjectURL(zipEntryFile));
                });
              }
            });
          });
        }
      }
    }
  });
});
