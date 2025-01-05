const express = require("express");
const { Resend } = require("resend");
require("dotenv").config();

const app = express();
app.use(express.json());

const resendApiKey = process.env.RESEND_API_KEY;
const adminkey = process.env.ADMIN_KEY;
if (!resendApiKey) {
  console.error("RESEND_API_KEY or ADMIN_KEY environment variable not set!");
  process.exit(1);
}

const resend = new Resend(resendApiKey);
app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, body } = req.body;
    const token = req.headers.token;

    // console.log(token);

    if (!token || token !== adminkey) {
      return res.status(401).json({ error: "Unauthorized" }); // 401 Unauthorized
    }

    if (!to) {
      return res.status(400).json({ error: "Missing required fields (to)" });
    }

    const emailOptions = {
      from: "support@santechh.online",
      to,
      subject: body || "Welcome to Santech Community",
      html: subject || `Get ready to explore the more products from us.`,
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
