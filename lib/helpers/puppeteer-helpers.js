// Try to eval or timeout
async function tryEval (page, evalPromise) {
	const result = await Promise.race([
		evalPromise,
		page.waitForTimeout(5000)
	])
	return result || null
}

module.exports = {
	tryEval
}
