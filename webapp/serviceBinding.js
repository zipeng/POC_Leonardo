function initModel() {
	var sUrl = "/HF3/sap/opu/odata/sap/MD_PRODUCT_OP_SRV/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}