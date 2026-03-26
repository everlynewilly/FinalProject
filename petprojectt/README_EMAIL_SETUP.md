# Gmail SMTP Fix for Emails

**Error:** `535-5.7.8 Username and Password not accepted`

**Solution:**
1. **Enable 2FA** on ruthmueni309@gmail.com
2. **Generate new App Password**: https://myaccount.google.com/apppasswords → Select 'Mail' + 'Other (Custom)' → Generate
3. **Replace** `etngeoesbblxeujx` in mailer.php with new 16-char password
4. **Test**: http://localhost/project/petprojectt/api/test_email.php → "Email result: SENT"

**App Password looks like:** `abcd efgh ijkl mnop`

**Disable "Less secure app access"** - use App Password only.

Restart Apache after changes.
