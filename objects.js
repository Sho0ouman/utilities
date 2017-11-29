function mergeKeys(objs) {
	let keys = [];
	for (let i = 0; i < objs.length; i++){
		let objKeys = Object.keys(objs[i]);
		let newKeys = objKeys.filter((k)=>{return keys.indexOf(k) === -1});
		keys = keys.concat(newKeys);
	}
    return keys;
}
