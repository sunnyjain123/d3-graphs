var request = require('request');

exports.allAppData = function(req,res,next){
	// return res.send('1');
	console.log('------starting to hit api------');
	var options = {
		method: 'POST',
		url: 'http://163.47.152.170:8090/MachinfinityDataPreparation/machinfinitydataprep/hiveDataAggregation/',
		headers: {
			'Content-Type' : 'application/json'
		},
		body: '{"hiveMachineIp" : "192.168.0.110","hiveMachinePort" : "10000","hiveUsername"  : "nt","hivePassword"  : "","hiveDatabaseName" :"default","hiveTableName":"transactions_24m","hiveAggregationColumn":"customerid","hiveAggregationFunction":"HISTOGRAM","hiveAggregationHistogramBin":"5"}'
	}

	request(options, function (err, result, body) {
		if (err) {
			console.log(err, '--------err-----');
			res.send(err);
			res.status(400);
		}else if(body) {
			body = JSON.parse(body);
			console.log(body, body.length, '-------------body-----');
			return res.jsonp(body);
		}else{
			console.log(body, '-------------body-------not------found-------');
			return res.jsonp('-------------body-------not------found-------');
		}
	});
}