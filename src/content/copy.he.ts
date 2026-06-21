/**
 * Single source-of-truth for all Hebrew copy on the landing page.
 * Every section component imports from this file.
 * No Hebrew strings should live inside JSX.
 *
 * Structured top-to-bottom in page reading order.
 */

export const meta = {
  title: 'הזיווג שלך מתחיל בט״ו באב | מסע נשים לאומן עם רונית ברש',
  description:
    'בס״ד · המסע הנשי לאומן ביום ט״ו באב — 5 ימים של תפילות, שמחה, חיבור ושבת מרוממת אצל רבי נחמן מברסלב, בהובלת רונית ברש.',
  besd: 'בס״ד',
} as const;

// Trip departure date — used by the countdown timer in Hero.
// Israel time, dawn flight (05:00 local). Update if exact takeoff differs.
export const tripDate = {
  iso: '2026-07-28T05:00:00+03:00',
  labels: {
    days: 'ימים',
    hours: 'שעות',
    minutes: 'דקות',
    seconds: 'שניות',
  },
  afterFlightMessage: 'המסע התקיים — תודה ❤️',
} as const;

export const hero = {
  spotlight: 'אור הצדיק רונית ברש',
  title: 'הזיווג שלך מתחיל בט״ו באב הזה 💍',
  subtitle: 'המסע הנשי שיכול לשנות לך את השנה',
  countdownKicker: 'הטיסה ממריאה בעוד ↓',
  cta: 'אני רוצה לשמוע עוד',
} as const;

export const intro = {
  lines: [
    'ביום הכי מסוגל לזיווגים וישועות',
    'טסות יחד לאומן לציון הקדוש של רבי נחמן מברסלב ✨',
    '5 ימים של תפילות, שמחה, חיבור, שבת מרוממת, הפרשת חלה, הפקת מסיבת ט״ו באב, חינה לרווקות וחוויה שלא שוכחים.',
  ],
  highlights: [
    'קבוצה נשית איכותית בהובלת רונית ברש 👭',
    'מתנה אישית לכל נוסעת 🎁',
    'כולל טיסות, מלון מפנק, ארוחות והפקה מיוחדת של פעם בשנה ✈️',
  ],
} as const;

export const marquee = [
  'תפילות בציון הקדוש',
  'שבת מרוממת',
  'מסיבת ט״ו באב',
  'חינה לרווקות',
  'הפרשת חלה ענקית',
  'קבוצה נשית איכותית',
  'מתנה אישית לכל נוסעת',
  'מלון "המשכן" באומן',
] as const;

export const price = {
  label: 'מחיר המסע',
  amount: '5,900₪',
  amountValue: 5900,
  scarcity: 'מספר המקומות מוגבל',
  cta: '✨ אני רוצה לשמור מקום',
} as const;

// Early-page teaser — no number, builds desire. The real price reveal
// lives right before the LeadForm (see Payment.tsx).
export const priceTeaser = {
  kicker: 'מספר המקומות מוגבל ✨',
  headline: 'שינוי לחיים',
  body: 'יש מסעות שמשנים את המסלול. ויש כאלה שמשנים את הלב.',
  cta: 'אני רוצה להירשם ↓',
} as const;

// Big reveal moment (just before the lead form).
export const priceReveal = {
  kicker: 'הרגע שבו זה הופך לאמיתי',
  label: 'מחיר המסע',
  currency: '₪',
  postlude: 'כולל טיסות, מלון מפנק, ארוחות, הפקה והפתעות',
} as const;

// Personal handwritten letter from Ronit — embedded as an image because
// the source PDF is handwritten cursive Hebrew (no transcription).
export const letterFromRonit = {
  kicker: 'מילים אישיות מרונית',
  image: '/images/letter-from-ronit.webp',
  imageFallback: '/images/letter-from-ronit.jpg',
  alt: 'מכתב אישי בכתב יד מרונית ברש',
} as const;

export const whyTuBav = {
  title: 'למה דווקא בט״ו באב?',
  quote: 'לא היו ימים טובים לישראל כט״ו באב וכיום הכיפורים',
  quoteAttribution: '(מסכת תענית)',
  paragraphs: [
    'יש תאריכים שמרגישים אחרת בלב.',
    'ט״ו באב נחשב ליום מסוגל לזיווגים, ישועות, אהבה והתחלות חדשות.',
    'אלפי נשים מגיעות בכל שנה להתפלל אצל רבי נחמן מברסלב דווקא ביום הזה — על חתונה, ילדים, פרנסה, שמחה וריפוי הלב.',
    'אולי השנה… גם המקום שלך שם, יחד איתי ❤️',
  ],
} as const;

export const whatAwaits = {
  title: 'מה מחכה לך במסע?',
  items: [
    'טיסה קבוצתית וחוויה נשית מיוחדת ✈️',
    'מלון "המשכן" המפואר באומן 🏨',
    'ארוחות מסודרות 🍽️',
    'תפילות בציון הקדוש 🕍',
    'שבת מרוממת באומן 🕯️',
    'הפקת ט״ו באב מיוחדת 🎉',
    'הפרשת חלה ענקית בציון 🌸',
    'ביקור אצל הבעל שם טוב, מעיין הרפואה ורבי נתן מברסלב 🌿',
    'ליווי אישי של רונית ברש וצוות הדרכה 👭',
    'מתנה מיוחדת לכל נוסעת 🎁',
  ],
} as const;

export const whoFor = {
  title: 'למי מתאים המסע?',
  items: [
    'רווקות שמתפללות לזיווג',
    'נשואות שרוצות ישועה וברכה',
    'נשים שרוצות להתחזק ולהתמלא באור',
    'נשים שמרגישות שהלב שלהן צריך התחלה חדשה',
    'כל מי שתמיד חלמה להגיע לאומן',
  ],
} as const;

export const importantInfo = {
  title: '⚠️ חשוב לדעת',
  items: [
    'הנסיעה מיועדת לנשים בלבד',
    'מספר המקומות מוגבל',
    'ההרשמה מתבצעת לאחר שיחה אישית',
    'דרכון בתוקף — לפחות חצי שנה מיום היציאה',
    'שמירת מקום מותנית בתשלום מלא',
  ],
} as const;

export const payment = {
  title: 'אפשרויות התשלום',
  options: [
    { label: 'העברה בנקאית', amount: '5,900₪', note: '' },
    {
      label: 'אשראי',
      amount: '6,077₪',
      note: 'ניתן לפרוס עד ל-12 תשלומים',
    },
  ],
} as const;

export const itinerary = {
  title: 'קצת מהמסע ✨',
  items: [
    'טיסה לאומן דרך מולדובה ✈️',
    "ביקור אצל הבעל שם טוב במז'יבוז', מעיין הרפואה ורבי נתן מברסלב 🌿",
    'תפילות בט״ו באב בציון הקדוש 💍',
    'הפקה מושקעת — מסיבת ט״ו באב וחינה לרווקות 🎉',
    'שבת מיוחדת אצל רבנו 🕯️',
    'זמן אישי לתפילה וישועה 🙏',
  ],
} as const;

// Full day-by-day trip schedule (ScheduleSection). Times in 24h; entries
// with empty `time` render as an italic note/quote line instead of a
// timed row.
export const schedule = {
  besd: 'בס״ד',
  title: 'ט״ו באב אצל ר׳ נחמן מברסלב זיע״א',
  days: [
    {
      day: 'יום שלישי',
      hebrewDate: 'י״ד אב',
      gregorianDate: '28/07/2026',
      entries: [
        { time: '16:30', text: 'חלוקת כרטיסי טיסה בנקודת המפגש — טרמינל 3, דלפק קבוצות' },
        { time: '20:00', text: 'המראה לקישינב, מולדובה בטיסת SKYUP' },
        { time: '23:00', text: 'נחיתה במולדובה ויציאה למעבר הגבולות' },
      ],
    },
    {
      day: 'יום רביעי',
      hebrewDate: 'ט״ו באב',
      gregorianDate: '29/07/2026',
      entries: [
        { time: '07:00', text: 'מז׳יבוז׳ — ביקור בציון הבעש״ט "אור שבעת הימים" ובמעיין הרפואה' },
        { time: '13:00', text: 'ר׳ נתן הקדוש — "המאור הקטן"' },
        { time: '18:00', text: 'רבי נחמן באומן — "עיר הגעגועים" וקבלת חדרים · "רבנו מחכה לך…"' },
        { time: '19:00', text: 'ארוחת ערב' },
        { time: '', text: 'זמן חופשי לתפילה ביום המסוגל לישועות — "לא היו ימים טובים לישראל כט״ו באב וכיום הכיפורים" (משנה תענית ד׳, ח׳)' },
      ],
    },
    {
      day: 'יום חמישי',
      hebrewDate: 'ט״ז אב',
      gregorianDate: '30/07/2026',
      entries: [
        { time: '09:00', text: 'ארוחת בוקר ישראלית' },
        { time: '12:00', text: 'ביקור בגן סופיה — "להיות באומן ולא להיות בסופיה?" (ר׳ נחמן). הכניסה לגן וההסעה בעלות 5$' },
        { time: '17:00', text: 'ארוחת ערב' },
        { time: '21:00', text: 'הפקת מסיבת ט״ו באב' },
      ],
    },
    {
      day: 'יום שישי',
      hebrewDate: 'י״ז אב',
      gregorianDate: '31/07/2026',
      entries: [
        { time: '09:00', text: 'ארוחת בוקר ישראלית' },
        { time: '12:00', text: 'הפרשת חלה ענקית בציון הקדוש, וזמן חופשי להתארגנות לכבוד שבת קודש' },
        { time: '20:09', text: 'כניסת שבת — הדלקת נרות בציון, קבלת שבת ותפילת ערבית, וארוחת ערב עשירה לכבוד שבת קודש' },
      ],
    },
    {
      day: 'יום שבת',
      hebrewDate: 'י״ח אב',
      gregorianDate: '01/08/2026',
      entries: [
        { time: '11:30', text: 'קידוש וסעודה שניה' },
        { time: '17:30', text: 'שיעור תורה' },
        { time: '20:30', text: 'סעודה שלישית' },
        { time: '21:34', text: 'הבדלה לפי זמן יציאת שבת באומן' },
        { time: '', text: 'אמר רבי נחמן מברסלב: "השבתות ששובתים אצלי הם יותר טובים וגדולים משבע פעמים תענית, משבת לשבת"' },
      ],
    },
    {
      day: 'יום ראשון',
      hebrewDate: 'י״ט אב',
      gregorianDate: '02/08/2026',
      entries: [
        { time: '01:00', text: 'נסיעה לשדה התעופה בקישינב, מולדובה' },
      ],
    },
  ],
  returnFlightTitle: 'פרטי טיסה חזור ✈️',
  returnFlight: [
    { time: '16:10', text: 'זמן המראה משוער לתל אביב בטיסת SKYUP' },
    { time: '19:10', text: 'זמן נחיתה משוער — נתב״ג, ישראל' },
  ],
  note: '* זמני ההגעה, ההמראה והנחיתה משוערים, ויתכנו עיכובים ושינויים.',
} as const;

export const videoGallery = {
  title: 'רגעים מהמסע',
  subtitle: 'הצצה קצרה לאווירה — לחצי על סרטון כדי לצפות',
} as const;

export const testimonials = {
  kicker: 'נשים שכבר טסו איתנו',
  title: 'מה הן אומרות',
  subtitle: 'עדויות אישיות מנשים שחזרו מהמסע — בקולן ובמילותיהן',
} as const;

export const leadForm = {
  title: 'השאירי פרטים ונחזור אלייך',
  fields: {
    fullName: 'שם מלא',
    age: 'גיל',
    birthDate: 'תאריך לידה',
    city: 'עיר מגורים',
    occupation: 'עיסוק ותפקיד',
    phone: 'מספר טלפון',
    email: 'מייל',
    phoneKind: {
      label: 'סוג הטלפון',
      options: ['כשר', 'רגיל'] as const,
    },
    passport: {
      label: 'האם יש דרכון בתוקף לפחות 6 חודשים מיום היציאה?',
      options: ['כן', 'לא'] as const,
    },
  },
  cta: '✨ אני רוצה לטוס לאומן בט״ו באב',
  // Submission flow — the form POSTs to /api/lead which forwards to
  // Monday.com. These three messages cover submitting / success / error
  // states (see LeadForm.tsx for the state machine).
  submitting: 'שולחת…',
  success: 'תודה! קיבלנו את הפרטים, נחזור אלייך בקרוב 💌',
  error: 'השליחה נכשלה — נסי שוב או חייגי 050-2696862',
} as const;

export const closingQuote = {
  text: 'יש תפילות ששומעים אחרת באומן ✨',
} as const;

export const footer = {
  brand: 'אור הצדיק · רונית ברש',
  tagline: 'מסע נשי לאומן · ט״ו באב',
  phone: '050-2696862',
  phoneLabel: 'טלפון המשרד',
} as const;
