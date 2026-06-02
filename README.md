# Rasha Edris Graduation RSVP Website

This version is English + Arabic.

## Upload to GitHub

Upload only these files to the root of your GitHub repo:

- `index.html`
- `styles.css`
- `script.js`
- `guest-list.js`

You do not need to upload `apps-script-template.js` unless you want to keep it there as a backup. It is mainly for Google Apps Script.

## Current test guest list

The website currently allows only:

- Rim Edris / ريم إدريس — 0 additional guests
- Sarah Edris / سارة إدريس — 0 additional guests
- Rasha Edris / رشا إدريس — up to 3 additional guests

If a name does not match, the site blocks them and shows an error.

## How guest numbers work

For Rasha, the dropdown allows:

- Just me / بدون مرافقين
- +1
- +2
- +3

When saved to Google Sheets, it saves:

- Attendance: yes/no
- Additional Guests: 0, 1, 2, or 3
- Total People: guest + additional guests

Example:
If Rasha chooses +2, the sheet saves:
Additional Guests = 2
Total People = 3

## Google Sheet headers

Use this row 1:

```text
Timestamp | Guest Name | Display Name | Attendance | Additional Guests | Total People | Contact | Message | Submitted At
```

Arabic version:

```text
الوقت | اسم الضيف | الاسم المعروض | الحضور | عدد المرافقين | إجمالي الحضور | وسيلة التواصل | الرسالة | وقت الإرسال
```

## Connect Google Sheets

1. Create a Google Sheet.
2. Rename the first tab to `RSVPs`.
3. Add the headers above in row 1.
4. Open `Extensions > Apps Script`.
5. Paste the code from `apps-script-template.js`.
6. Replace `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` with your Google Sheet ID.
7. Deploy as a Web App:
   - Execute as: Me
   - Who has access: Anyone
8. Copy the Web App URL.
9. In `script.js`, paste it here:

```js
RSVP_ENDPOINT: "PASTE_WEB_APP_URL_HERE"
```

## Edit guest list

Open `guest-list.js`.

Each guest looks like this:

```js
{
  name: "Rasha Edris",
  displayName: "Rasha Edris / رشا إدريس",
  maxGuests: 3,
  aliases: ["Rasha", "رشا إدريس", "رشا"]
}
```

`maxGuests` is the maximum number of extra people they can bring.
