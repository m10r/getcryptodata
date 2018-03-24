var rp = require('request-promise');
var fs = require('fs');
var promise = require('bluebird');
var markets = [
	'ETH-SNT',
	'ETH-BNT',
	'ETH-GUP',
	'ETH-BAT',
	'BTC-ETH'
]

function sendRequest(){
	var promises = [];
	for (var i = 0; i < markets.length; i++) {
		promises.push(rp({
    		uri: 'https://bittrex.com/api/v1.1/public/getticker?market=' + markets[i],
    		method: 'GET',
    		json: true
    	}));
	}

	promise.all(promises)
	.then(function(data){
		var res = {timestamp: new Date(), markets: []};

		for (var i = 0; i < data.length; i++) {
			res.markets.push({
				market: markets[i],
				price: data[i].result
			})
		}
		fs.appendFile('current_price', '\n' + JSON.stringify(res, null, "\t"));
	})
	// .on('data', function(data) {
	// 	var body = JSON.parse(data)
	// 	body.timestamp = new Date();

	// 	// fs.readFile('current_price', {encording: 'utf-8'}, function(err, data){
	// 	// 	if(!err){
	// 	// 		let original	
	// 	// 		var stream = fs.createWriteStream('current_price');
	// 	// 		stream.once('open', function(fd) {
	// 	// 			stream.read
	// 	// 			stream.write(JSON.stringify(body));
	// 	// 		})		
	// 	// 	}
	// 	// })

	// 	fs.appendFile('current_price', '\n' + JSON.stringify(body));
	// });
}

fs.writeFile('current_price', '');

setInterval(function(){
	sendRequest();
	console.log('Sent Request');
}, 1000 * 5)


var express = require('express');
var app = express();


const port = 8000;
app.use(express.static(__dirname));
app.get('/', function(req, res) {
	fs.readFile('current_price', {encording: 'utf-8'}, function(err, data){
		res.send(data.toString());	
	})
	
})
app.listen(port, () => console.log('Example app listening on port ' + port))