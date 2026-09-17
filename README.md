# A Safe Place to Grow — Eshbal

אתר הקמפיין של Eshbal Center for Human–Animal Connection. חבילה עצמאית להעלאה ל־GitHub ולפרסום באמצעות Cloudflare Pages.

## 1. העלאה ל־GitHub

1. חלצו את קובץ ה־ZIP במחשב.
2. צרו מאגר חדש ב־GitHub. שם מוצע: `eshbal-campaign`. מומלץ לבחור **Private**; האתר ב־Cloudflare עדיין יכול להיות ציבורי.
3. במסך המאגר בחרו **uploading an existing file**, או **Add file → Upload files**.
4. פתחו את התיקייה `eshbal-campaign` שחילצתם וגררו את התוכן שלה: `public`, `scripts`, `package.json`, `README.md` ושאר קבצי ההוראות. אין להעלות את ה־ZIP עצמו ואין ליצור שכבת תיקייה נוספת.
5. אשרו באמצעות **Commit changes**, לענף `main`.
6. בשורש המאגר צריכים להופיע `package.json`, התיקייה `public` והתיקייה `scripts`.

לא נדרשים מפתחות API, סיסמאות או קובצי הגדרות של ChatGPT. קובץ `.gitignore` המצורף שימושי לעבודה דרך Git; אם הוא לא מוצג בהעלאה מהדפדפן, אין בכך כדי למנוע את ההקמה.

## 2. חיבור Cloudflare Pages

פתחו חשבון Cloudflare שבשליטתכם. היכנסו ל־**Workers & Pages → Create application → Pages → Connect to Git**. חברו את GitHub, תנו גישה למאגר ובחרו אותו. בחרו במסלול Pages עם חיבור Git.

| הגדרה | ערך |
| --- | --- |
| Project name | שם פנוי לבחירתכם, למשל `eshbal-campaign` |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | להשאיר ריק — שורש המאגר |
| Environment variable | שם: `SITE_URL`; ערך: כתובת האתר המלאה |

**לפני הפרסום הראשון הגדירו `SITE_URL`.** אם שם הפרויקט שבחרתם הוא `eshbal-campaign`, הערך יהיה `https://eshbal-campaign.pages.dev`. זו דוגמה בלבד: השתמשו בשם הפרויקט שאושר לכם בפועל. ניתן להגדיר אותו גם לסביבת Preview; כך קישורי השיתוף יפנו תמיד לכתובת הציבורית הקבועה.

לחצו **Save and Deploy**. הבנייה אינה מתקינה ספריות חיצוניות: היא מעתיקה את האתר לתיקיית הפרסום ומעדכנת את כתובות השיתוף לפי `SITE_URL`. אם המשתנה חסר, הבנייה תעצור עם הודעה ברורה במקום לפרסם קישורים שבורים.

מדריך רשמי: https://developers.cloudflare.com/pages/get-started/git-integration/

## 3. חיבור כתובת קבועה משלכם

בפרויקט Pages הוסיפו את הכתובת ב־**Custom domains** והשלימו את הוראות ה־DNS שמוצגות. לאחר שהדומיין פעיל, שנו את `SITE_URL` לכתובת החדשה, למשל `https://eshbal.example.org`, ופרסמו מחדש. אין צורך לשנות את התמונות או את קוד האתר.

מדריך רשמי: https://developers.cloudflare.com/pages/configuration/custom-domains/

## 4. בדיקה לאחר הפרסום

- פתחו את הכתובת בחלון פרטי ללא התחברות ובטלפון.
- ודאו שהתמונות, הפייד והזום פועלים וששני הלוגואים מוצגים.
- ודאו שטופס Donorbox נטען והמעבר בין שלביו פועל. אל תבצעו תרומת אמת לצורך בדיקה ללא כוונה לתרום.
- הדביקו את הקישור בהודעת WhatsApp חדשה והמתינו לתצוגה המקדימה. תמונת השיתוף מגיעה מ־`assets/eshbal-whatsapp-share.jpg`.
- השאירו את האתר הקיים זמין עד שהכתובת החדשה נבדקה.

## 5. עדכונים שוטפים

התוכן נערך ב־`public/index.html`, העיצוב ב־`public/style.css`, והתמונות ב־`public/assets`. אנימציית ההירו ב־`public/hero-slideshow.js`; יתר האינטראקציות ב־`public/app.js`.

לאחר העלאת שינוי ל־`main`, Cloudflare יבנה ויפרסם את האתר אוטומטית באותה כתובת. ערכו את `public`, לא את `dist` שנוצרת אוטומטית. שינויים בשיחה ב־ChatGPT אינם מועברים למאגר הזה אוטומטית.

טופס התרומה משויך לקמפיין Donorbox `a-safe-place-to-grow`. ההגדרות הפנימיות שלו מנוהלות ב־Donorbox. האתר אינו מאחסן פרטי אשראי או התחייבויות; מחשבון התרומה לשלוש שנים יוצר טיוטת דוא״ל בלבד.

## Local preview / developer handoff

Requires Node.js 20 or newer. No npm dependencies or installation required.

```sh
SITE_URL=http://localhost:8000 npm run build
python3 -m http.server 8000 --directory dist
```

Open http://localhost:8000. To rebuild for production, set `SITE_URL` to the final HTTPS origin before running the same build command. Do not publish the development output directly.

This package preserves the published campaign's content, photos, donation integration and sharing artwork. Source snapshot: September 17, 2026. It contains no hosting credentials or original provider configuration. The existing hosted website is unchanged.

## Rights

This repository is not licensed as open source. Campaign photographs, branding and text remain subject to their respective rights. Font licensing is included in `public/assets/font-license.txt`. Hosting in a private GitHub repository does not make the published website private.
