
var request = require('request')
var git = require('nodegit')
var argv = require('yargs')
	         .usage('Usage: $0 -u [username] -p [password] [path]')
           .demand(['u', 'p'])
				   .alias('u', 'user')
				   .alias('p', 'pass')
           .argv

var username = argv.u
var password = argv.p
var path = argv._[0]

request.get('https://api.bitbucket.org/1.0/user/repositories', function(err, resp, body) {
	if (!err && resp.statusCode === 200) {
		var repos = JSON.parse(body)
		repos.forEach(function(repo) {
			var url = `https://${username}:${password}@bitbucket.org/${repo.owner}/${repo.slug}.git`
		  console.log('Cloning '+ url)
			git.Clone(url, `${path}/${repo.owner}/${repo.slug}`).then(function(gitRepo) {
				console.log('FINISHED: Cloned ' + url)
			}, function(err) { 
		    console.log('ERR: ' + err)	
			})
		})
	}
}).auth(username, password)
