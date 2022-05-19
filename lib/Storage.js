const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

class Storage {
	constructor (fileName) {
		this.fileName = fileName
		const adapter = new FileSync(fileName)
		this.db = low(adapter)
		this.db.defaults({})
			.write()
	}

	read (id) {
		return this.db
			.defaults({})
			.get(id)
			.value()
	}

	save (id, json) {
		this.db.set(id, json)
			.write()
	}
}

module.exports = { Storage }
