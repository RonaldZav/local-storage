
const moment = require("moment");

module.exports = class Logger {
	static log (content, type = "log") {
		const date = `${moment().format("DD-MM-YYYY hh:mm:ss")}`;
		switch (type) {
	
		case "log": {
			return console.log(`[${(date)}]: [${(type.toUpperCase())}] ${content}`);
		}
		case "warn": {
			return console.log(`[${(date)}]: [${(type.toUpperCase())}] ${content}`);
		}
		case "error": {
			return console.log(`[${(date)}]: [${(type.toUpperCase())}] ${content}`);
		}
		case "debug": {
			return console.log(`[${(date)}]: [${(type.toUpperCase())}] ${content}`);
		}
		default: throw new TypeError("Invalid log type");
		}
	}
};