const { SOUB_S21 } = require('../constants/Pages')

const INITIAL_PAGE = `${SOUB_S21}`

class PhonePage {
	constructor (browser) {
		this.browser = browser
	}

	async open () {
		this.page = await this.browser.newPage()
		await this.page.goto(INITIAL_PAGE, { waitUntil: 'load', timeout: 0 })
	}

	async getPrice () {
		return parsePrice(this.page)
	}
}

async function parsePrice (page) {
	const priceSpan = await page.$('span[class*="price__SalesPrice"]')
	const priceInnerText = await priceSpan.getProperty('innerText')
	let priceValue = await priceInnerText.jsonValue()
	priceValue = priceValue.substring(0, priceValue.indexOf(','))
	return Number(priceValue.replace('R$ ', '').replace('.', ''))
}

module.exports = { PhonePage }
