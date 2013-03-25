var mapWidget = {

  showMap: function () {
    var parameters = {};
    parameters['clusterid'] = '1';
    parameters['test'] = 'hallo';
    var returnData = apisWrapper.callApisFunction('institutionsmap', 'GET', 'json', parameters);
  }

};
