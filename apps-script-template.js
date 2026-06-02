/*
  كود Google Apps Script لحفظ تأكيدات الحضور في Google Sheets.

  الخطوات:
  1. أنشئي Google Sheet جديد.
  2. أنشئي ورقة داخل الملف باسم: RSVPs
  3. ضعي هذه العناوين في الصف الأول:
     الوقت | اسم الضيف | الاسم المعروض | الحضور | عدد المرافقين | وسيلة التواصل | الرسالة | وقت الإرسال
  4. من Google Sheets اختاري: Extensions > Apps Script
  5. الصقي هذا الكود.
  6. ضعي رقم ملف Google Sheet مكان SPREADSHEET_ID.
  7. اختاري: Deploy > New deployment > Web app
     - Execute as: Me
     - Who has access: Anyone
  8. انسخي رابط Web App وضعيه في RSVP_ENDPOINT داخل ملف script.js.
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
      data.plusOnes || "0",
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
