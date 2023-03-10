const nodemailer = require('nodemailer');

class MailService {

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    })
  }
  async sendActivationMail(emailto, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: emailto,
      subject: `Активация аккаунта в RS Music App (${process.env.DEPLOY_URL})`,
      text: '',
      html: 
      `
        <div>
          <h1>Для активации перейдите по ссылке</h1>
          <a href="${link}">${link}</a>
        </div>
      `
    })
  }
}

module.exports = new MailService();