const fs = require('fs');
const handlebars = require('handlebars');
const helper = require('sendgrid').mail;
const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

/* Send Email using SendGrid */
module.exports = async (email, name, subject, template_file, url) => {
    const source = fs.readFileSync(template_file, 'utf8');
    // Compile the template
    const template = handlebars.compile(source);
    const content =  template({
        user: name,
        domain: process.env.BASE_URL,
        url: url
    });

    // Set parameters
    const from_email = new helper.Email(process.env.EMAIL_HOST);
    const to_email = new helper.Email(email, name);
    const cont = new helper.Content('text/html', content);
    const mail = new helper.Mail(from_email, subject, to_email, cont);

    const request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON(),
    });

    sg.API(request, function(err, response) {
        if (response.statusCode !== 202) {
            console.log(response.body);
        }
    });
};
