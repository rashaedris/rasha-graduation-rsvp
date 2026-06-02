# موقع تأكيد حضور احتفال تخرّج رشا إدريس

هذا الموقع جاهز للرفع على GitHub Pages.

## الملفات التي ترفعينها على GitHub

للموقع نفسه، ارفعي هذه الملفات داخل نفس المستودع:

- `index.html`
- `styles.css`
- `script.js`
- `guest-list.js`

ملف `README.md` اختياري، وملف `apps-script-template.js` لا يحتاج أن يكون على GitHub لأنه مخصص للنسخ داخل Google Apps Script فقط.

الموقع يبدأ من ملف `index.html`.

## تعديل تفاصيل المناسبة

افتحي ملف `script.js` وعدّلي هذه القيم:

```js
graduateName
heroCopy
eventDateText
eventTimeText
eventLocationText
dressCodeText
storyText
eventDateISO
RSVP_ENDPOINT
```

التاريخ مضبوط الآن على:

```js
eventDateISO: "2026-06-06T18:00:00"
```

إذا كان وقت الاحتفال مختلفًا، غيّري الساعة فقط.

## تعديل قائمة الضيوف

افتحي ملف `guest-list.js`.

استخدمي هذا الشكل:

```js
window.GUESTS = [
  {
    name: "Full Guest Name",
    displayName: "الاسم الذي سيظهر في الدعوة",
    plusOnes: 1,
    aliases: ["تهجئة أخرى", "اسم مختصر"]
  }
];
```

## أين يتم حفظ تأكيدات الحضور؟

يوجد خياران:

### الخيار الأول: بدون Google Sheet

إذا تركتِ `RSVP_ENDPOINT` فارغًا في `script.js`، الموقع سيعمل كتجربة فقط.
الردود ستُحفظ داخل متصفح الضيف نفسه باستخدام `localStorage`.
هذا لا يفيدك لجمع الردود، لأنه لن يرسلها لك.

### الخيار الثاني: Google Sheets

هذا هو الخيار الصحيح.

تأكيدات الحضور ستُحفظ في Google Sheet خاص بك.
الملف `apps-script-template.js` يحتوي كود الربط.

## خطوات Google Sheet

1. أنشئي Google Sheet جديد.
2. أنشئي ورقة باسم `RSVPs`.
3. ضعي هذه العناوين في الصف الأول:

```text
الوقت | اسم الضيف | الاسم المعروض | الحضور | عدد المرافقين | وسيلة التواصل | الرسالة | وقت الإرسال
```

4. من Google Sheet افتحي:

```text
Extensions > Apps Script
```

5. الصقي كود `apps-script-template.js`.
6. انسخي رقم Google Sheet من الرابط وضعيه مكان:

```js
PASTE_YOUR_GOOGLE_SHEET_ID_HERE
```

7. من Apps Script اختاري:

```text
Deploy > New deployment > Web app
```

8. الإعدادات تكون:

```text
Execute as: Me
Who has access: Anyone
```

9. انسخي رابط Web App.
10. افتحي `script.js` وضعي الرابط هنا:

```js
RSVP_ENDPOINT: "PASTE_WEB_APP_URL_HERE"
```

## خطوات GitHub Pages

1. افتحي GitHub.
2. أنشئي مستودع جديد.
3. ارفعي كل الملفات في الصفحة الرئيسية للمستودع.
4. افتحي:

```text
Settings > Pages
```

5. اختاري:

```text
Source: Deploy from a branch
Branch: main
Folder: /root
```

6. اضغطي Save.
7. سيظهر لك رابط الموقع بعد النشر.

## ملاحظة خصوصية مهمة

GitHub Pages موقع عام.
قائمة الأسماء الموجودة في `guest-list.js` يمكن لأي شخص تقني رؤيتها.
إذا كانت قائمة الضيوف حساسة جدًا، نحتاج طريقة أكثر خصوصية باستخدام Backend حقيقي.
