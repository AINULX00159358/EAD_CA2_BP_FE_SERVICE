const http = require('http');
const { parse } = require('querystring');
const fs = require('fs');
const querystring = require('querystring');


//Loading the config fileContents
const config = require('./config/config.json');
const defaultConfig = config.development;
global.gConfig = defaultConfig;

const BP_INFO_URL = process.env.BP_INFO_URL || config.development.bp_info_url;
const BP_DATA_URL = process.env.BP_DATA_URL || config.development.bp_data_url;
const BP_RECORD_URL = process.env.BP_RECORD_URL || config.development.bp_record_url;


var header = '<!doctype html><html>'+
		     '<head>';

var body =  '</head><body><div id="container">' +
				 '<div id="logo">' + global.gConfig.app_name + '</div>' +
				 '<div id="space"></div>' +
				 '<div id="form">' +
				 '<form id="form" action="/" method="post"><center>'+
				 '<label class="control-label">Email</label>' +
				 '<input class="input" type="text" name="email"/><br />'+
				 '<label class="control-label">Systolic Reading</label>' +
				 '<input class="input" type="number" name="systolic" /><br />'+
				 '<label class="control-label">Diastolic Reading</label>' +
				 '<input class="input" type="number" name="diastolic" /><br />';

var submitButton = '<button class="button button1">Submit</button>' +
				   '</div></form>';

var endBody = '</div></body></html>';



function getBpCategory(systolic, diastolic) {
	let parameterObj = {
		"systolic": systolic,
		"diastolic": diastolic
	};

	let bpCatUrl = BP_INFO_URL + "?" + querystring.stringify(parameterObj);
	console.log("getBpCategory() URL--> ", bpCatUrl);

	const options = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		},
	};
	return new Promise((resolve, reject) => {
		http.request(bpCatUrl, options, function (response) {
			response.on('error', (e) => reject(e.message));
			response.on('data', (data) => {
				console.log(data);
				let resRcvd = JSON.parse(data);
				if (resRcvd.error && resRcvd.error !== '') reject(resRcvd.error);
				else resolve(resRcvd);
			});
		}).end();
	});
}

function getHistoricalReading(email){
    return new Promise((resolve, reject) => {
		let options = {
			method: 'POST',
			json: {
				"email": email, 'limit': 5
			},
			headers: {
				'Content-Type': 'application/json'
			}
		};
		http.request(BP_DATA_URL, options, function (response){
			response.on('error', (e) => reject(e));
			response.on('data', (data) => resolve(JSON.parse(data)));
		}).end();
	});
}

function collectFormData(req, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if(req.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            var parsedBody = parse(body);
			callback(parsedBody.email, parsedBody.systolic, parsedBody.diastolic);
        });
    }
    else {
        callback(null);
    }
}

function pushReading(email, systolic, diastolic, category){
	let reading = {
		email: email,
		systolic: Number(systolic),
		diastolic: Number(diastolic),
		category: category,
		timestamp: Date.now(),
	};
	return  new Promise((resolve, reject) => {
			let options = {
				method: 'POST',
				json: {
					email: email,
					systolic: Number(systolic),
					diastolic: Number(diastolic),
					category: category,
					timestamp: Date.now(),
				},
				headers: {
					'Content-Type': 'application/json'
				}
			};
			console.log("Persisting   ", reading);
			http.request(BP_RECORD_URL, options, (response) => {
				response.on('error', (e) => reject(e));
				response.on('data' , (data) => resolve(reading));
			}).end();
	});
}

// async function record(email, systolic, diastolic, category) {
// 	let reading = {
// 	    eamil: email,
// 		systolic: Number(systolic),
// 		diastolic: Number(diastolic),
// 		category: category,
// 		timestamp: Date.now(),
// 	};
// 	 return await pushReading(reading);
// }


function css(req, response) {
  if (req.url === '/default.css') {
    response.writeHead(200, {'Content-type' : 'text/css'});
    var fileContents = fs.readFileSync('./public/default.css', {encoding: 'utf8'});
    response.write(fileContents);
  }
}

function handleError( error, res ) {
	console.log(error);
	res.write('<center><div id="logo"> Could not retrieve category </div>');
	if(error != null) {
		res.write('<center><div id="logo"> '+ error +' </div>');
	}
	//res.end(endBody);
}

function writeHistorical(res, hist_res){
  	res.write('<div id="space"></div>');
	res.write('<div id="logo">Your Previous Readings</div>');
	res.write('<div id="space"><p></p></p></div>');
	res.write('<table border="1"><tr><th>date</th><th>systolic</th><th>diastolic</th><th>category</th></tr>')
	hist_res.forEach(function(item) {
		res.write('<tr><td>' + new Date(Number(item.timestamp)).toISOString() + '</td><td>'+item.systolic+'</td><td>'+item.diastolic+'</td><td>'+item.category+'</td></tr>')
	});
	res.write('</div><div id="space"></div>');

}

http.createServer(function (req, res) {

	res.writeHead(200, {'Content-Type': 'text/html'});

	if (req.method === 'POST') {
		collectFormData(req, (email, s, d) => {
			getBpCategory(s, d)
				.then( cat => {
					console.log("Category is ", cat);
					pushReading(email, s, d, cat.category).then(r => console.log("recorded ", r))
				// res.write('<center><div id="results_input">Systolic :'+ cat.systolic +' Diastolic '+ cat.diastolic + '</div>');
				// res.write('<center><div id="results_category">Your blood Pressure category is: ' + cat.category + '</div>');
				getHistoricalReading(email).then( (rec, e) => {
					res.write('<center><div id="results_input">Systolic :'+ cat.systolic +' Diastolic '+ cat.diastolic + '</div>');
					res.write('<center><div id="results_category">Your blood Pressure category is: ' + cat.category + '</div>');

					res.write('</div><div id="space"></div>');
					res.write('</div><div id="space"></div>');

					writeHistorical(res, rec);
					res.end(endBody);
					}).catch(er => console.log(er));
				}).catch(error => {
				console.error(error);
				res.write('<center><div id="result_error">  Error  occurred while reading BP Category    </div>');
				res.write('<center><div id="result_error">'+ error  +'</div>');
				res.end(endBody);
			});
		});
	}
    else {
		var fileContents = fs.readFileSync('./public/default.css', {encoding: 'utf8'});
		res.write(header);
		res.write('<style>' + fileContents + '</style>');
		res.write(body);
		res.write(submitButton);
		res.end(endBody);
	}
}).listen(global.gConfig.exposedPort);
