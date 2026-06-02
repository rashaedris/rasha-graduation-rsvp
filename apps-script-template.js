/*
  Google Apps Script template to save RSVPs to Google Sheets.
  كود Google Apps Script لحفظ تأكيدات الحضور في Google Sheets.

  Google Sheet tab name must be: RSVPs

  Row 1 headers:
  Timestamp | Guest Name | Display Name | Attendance | Additional Guests | Total People | Contact | Message | Submitted At

  عناوين الصف الأول:
  الوقت | اسم الضيف | الاسم المعروض | الحضور | عدد المرافقين | إجمالي الحضور | وسيلة التواصل | الرسالة | وقت الإرسال
*/

const SPREADSHEET_ID = "PASTE_YOUR_GOOGLE_SHEET_ID_HERE";
const SHEET_NAME = "RSVPs";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);

    sheet.appendRow([
      new Date(),
      data.guestName || "",
      data.displayName || "",
      data.attendance || "",
      data.additionalGuests || "0",
      data.totalPeople || "0",
      data.contact || "",
      data.message || "",
      data.submittedAt || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function testSave() {
  const sheet = SpreadsheetApp
    .openById("165gK1c9kkK70X0mdN5KglCGQEZcqDZ00PIKg0k-oshI")
    .getSheetByName("RSVPs");

  sheet.appendRow([
    new Date(),
    "TEST",
    "TEST DISPLAY",
    "yes",
    "2",
    "3",
    "test contact",
    "test message",
    new Date().toISOString()
  ]);
}
