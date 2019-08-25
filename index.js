const runApplescript = require('run-applescript');

(async () => {
	const result = await runApplescript('return "unicorn"');

	console.log(result);
	//=> 'unicorn'
})();
