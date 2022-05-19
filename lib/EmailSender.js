const nodemailer = require('nodemailer')
const path = require('path')
const Email = require('email-templates')

class EmailSender {
	constructor ({ user, pass }) {
		this.toEmail = user
		this.transporter = nodemailer.createTransport({
			pool: false,
			host: 'smtp-relay.sendinblue.com',
			port: 587,
			secure: false,
			auth: {
				user: user,
				pass: pass
			}
		})

		this.transporter.verify(function (error, success) {
			if (error) {
				console.log(error)
			} else {
				console.log('Server is ready to take our messages')
			}
		})
	}

	close () {
		this.transporter.close()
	}

	async sendEmail ({ product }) {
		const email = new Email({
			message: {
				from: this.toEmail
			},
			send: true,
			transport: this.transporter,
			preview: true,
			juiceResources: {
				preserveImportant: true,
				webResources: {
					relativeTo: path.resolve('emails/css')
				}
			}
		})
		try {
			return await email.send({
				template: 'houseNotification',
				message: {
					to: this.toEmail
				},
				locals: {
					product
				}
			})
		} catch (error) {
			console.error(error)
			return null
		}
	}
}
module.exports = { EmailSender }
