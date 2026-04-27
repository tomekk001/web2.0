const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Hasło aplikacji Google, NIE zwykłe hasło!
    },
});

/**
 * Wysyła e-mail aktywacyjny
 * @param {string} toEmail - adres odbiorcy
 * @param {string} activationLink - pełny link aktywacyjny
 */
async function sendActivationEmail(toEmail, activationLink) {
    const mailOptions = {
        from: `"Moja Aplikacja Web 2.0" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Aktywacja konta',
        html: `
            <h2>Witaj!</h2>
            <p>Dziękujemy za rejestrację. Kliknij poniższy link, aby aktywować swoje konto:</p>
            <a href="${activationLink}" style="
                display: inline-block;
                padding: 10px 20px;
                background-color: #4CAF50;
                color: white;
                text-decoration: none;
                border-radius: 5px;
            ">Aktywuj konto</a>
            <p>Link wygaśnie po 24 godzinach.</p>
            <p>Jeśli nie rejestrowałeś się w naszej aplikacji, zignoruj tę wiadomość.</p>
        `,
    };

    await transporter.sendMail(mailOptions);
}

module.exports = { sendActivationEmail };