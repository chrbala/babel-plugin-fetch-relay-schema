var fetch = require('node-fetch');
var graphQlutilities = require('graphql/utilities');

var url = process.argv[2];

const errors = [];

const TIMEOUT_MS = 30000;
var timeout = setTimeout(() => {
	if (!errors.length)
		console.error('Fetch timed out.');
	else
		console.error(`Attempted to fetch ${errors.length} times and failed with the message ${errors[errors.length - 1]}`);
	process.exit(1);
}, TIMEOUT_MS);

var checkSuccess = res => {
	if (!res.ok)
		throw new Error(res);
	return res;
}
var success = response => 
	response.json()
		.then(json => console.log(JSON.stringify(json)))
		.then(() => clearTimeout(timeout))
;

(function attemptFetch() {
	fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'query': graphQlutilities.introspectionQuery}),
  })
	.then(checkSuccess)
	.then(success)
	.catch(err => {
		errors.push(err.message);
		setTimeout(attemptFetch, 5000);
	})
})();
