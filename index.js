const puppeteer = require('puppeteer')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

const { PhonePage } = require('./lib/PhonePage')
const { EmailSender } = require('./lib/EmailSender')
const { Storage } = require('./lib/Storage')

const schedule = require('node-schedule')

const scrape = async () => {
	console.log(`${new Date().toISOString()} - Starting`)
	const args = [
		'--no-sandbox',
		'--disable-setuid-sandbox',
		'--disable-infobars',
		'--window-position=0,0',
		'--ignore-certifcate-errors',
		'--ignore-certifcate-errors-spki-list',
		'--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'
	]
	const browser = await puppeteer.launch({
		headless: true,
		ignoreHTTPSErrors: true,
		ignoreDefaultArgs: ['--disable-extensions'],
		args
	})
	console.log('Browser launched')
	const page = new PhonePage(browser)
	await page.open()
	console.log('Page opened')
	const price = await page.getPrice()
	console.log('Price captured:', price)
	browser.close()
	return { price }
}

const sendEmail = async ({ price }) => {
	const sender = new EmailSender({
		user: argv.emailUser,
		pass: argv.emailPass
	})
	await sender.sendEmail({ product: { price } })
	sender.close()
}

async function main () {
	try {
		const { price } = await scrape()
		if (price <= 2001) {
			console.log('Price matched')
			const S21 = 'S21'
			const storage = new Storage('./workdir/products-db.json')
			const previousStatus = await storage.read(S21)
			if (!previousStatus || Number(previousStatus.price) !== Number(price)) {
				console.log('New Price, sending email')
				await sendEmail({ price })
				storage.save(S21, {
					price
				})
			}
		}
		console.log('Finished')
	} catch (error) {
		console.log('Failed:', error)
	}
}

schedule.scheduleJob('*/5 * * * *', main)
