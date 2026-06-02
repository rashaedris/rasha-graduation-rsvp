/*
  Google Apps Script template to save RSVPs to Google Sheets.
  كود Google Apps Script لحفظ تأكيدات الحضور في Google Sheets.

  Google Sheet tab name must be: RSVPs

  Row 1 headers:
  Timestamp | Guest Name | Display Name | Attendance | Additional Guests | Total People | Contact | Message | Submitted At

  عناوين الصف الأول:
  الوقت | اسم الضيف | الاسم المعروض | الحضور | عدد المرافقين | إجمالي الحضور | وسيلة التواصل | الرسالة | وقت الإرسال
*/

const SPREADSHEET_ID = "165gK1c9kkK70X0mdN5KglCGQEZcqDZ00PIKg0k-oshI";
const SHEET_NAME = "RSVPs";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const sheet = SpreadsheetApp
      .openById(SPREADSHEET_ID)
      .getSheetByName(SHEET_NAME);

    if (!sheet) {
      throw new Error("Sheet tab named RSVPs was not found.");
    }

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
