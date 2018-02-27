export const zips = require('../data/zipcode-locations.json');

for(let zip of Object.keys(zips)){

	if( !Array.isArray(zips[zip]) )
		break;

	zips[zip]={
		latitude:zips[zip][0],
		longitude:zips[zip][1]
	};

}


import * as UI from './ui'; //import UI

UI.start(); //start up the UI