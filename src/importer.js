const importer = {
	
	version: '{{ VERSION }}',
	
	import: filename => {
		
		var queriesString = fs.readFileSync(filename, 'utf8');
		
		var queries = parseQueries(queriesString);
		
		return slowLoop(queries, (q,i,d)=>{
			try{
				conn.query(q, err=>{
					if (err) err_handler(err); 
					else d();
				});
			}catch(e){
				err_handler(err); 
			}
		});
		
	},
	
	config: settings => {
		
		const valid = settings.hasOwnProperty('host') && typeof settings.host === "string" &&
			settings.hasOwnProperty('user') && typeof settings.user === "string" &&
			settings.hasOwnProperty('password') && typeof settings.password === "string" &&
			settings.hasOwnProperty('database') && typeof settings.database === "string";
	
		if(!settings.hasOwnProperty("onerror") || typeof settings.onerror !== "function"){
			settings.onerror = err=>{ throw err };
		}
		
		err_handler = settings.onerror;
		
		if(!valid) return settings.onerror(new Error("Invalid host, user, password, or database parameters"));
		
		conn = mysql.createConnection(settings);
		
		return importer;
	}
	
};

module.exports = importer;