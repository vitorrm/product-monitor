(async () => {
	const { EmailSender } = require('./lib/EmailSender')
	const yargs = require('yargs/yargs')
	const { hideBin } = require('yargs/helpers')
	const argv = yargs(hideBin(process.argv)).argv

	const sender = new EmailSender({
		user: argv.emailUser,
		pass: argv.emailPass
	})

	await sender.sendEmail({ product: { price: 5000 } })

	sender.close()
})()
