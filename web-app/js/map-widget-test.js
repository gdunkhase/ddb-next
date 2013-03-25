var mapWidget = {

  showMap: function () {
    var parameters = {};
    parameters['clusterid'] = '1';
    var returnData = apisWrapper.callApisFunction('institutionsmap', 'GET', 'json', parameters);
  }

};
