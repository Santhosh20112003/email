const express = require("express");
const { Resend } = require("resend");

const app = express();
app.use(express.json());

const resend = new Resend("re_VyJ9Znci_7YSzHNCroyLA9jx4Jq1dSZxY");
app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, html } = req.body;
    if (!to || !subject || !html) {
      return res
        .status(400)
        .json({ error: "Missing required fields (to, subject, html)" });
    }

    const emailOptions = {
      from: "support@santechh.online",
      to: to,
      subject: subject,
      html: html,
    };

    const response = await resend.emails.send(emailOptions);

    res
      .status(200)
      .json({ message: "Email sent successfully", response: response });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ error: "Failed to send email", details: error.message });
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
