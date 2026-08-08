import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

// ---- Supported languages ----
// Display label shown in pickers ↔ internal code used to key dictionaries.
export const LANGUAGES: Array<{ code: LangCode; label: string }> = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "ta", label: "தமிழ்" },
  { code: "bn", label: "বাংলা" },
  { code: "te", label: "తెలుగు" },
  { code: "mr", label: "मराठी" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ml", label: "മലയാളം" },
];

export type LangCode = "en" | "hi" | "ta" | "bn" | "te" | "mr" | "gu" | "pa" | "kn" | "ml";

export function labelToCode(label: string | null | undefined): LangCode {
  if (!label) return "en";
  const hit = LANGUAGES.find((l) => l.label === label || l.code === label);
  return (hit?.code as LangCode) ?? "en";
}

export function codeToLabel(code: LangCode): string {
  return LANGUAGES.find((l) => l.code === code)?.label ?? "English";
}

// ---- Dictionary ----
// Keep keys short and meaningful. English is the source of truth; other locales
// fall back to English for any missing key.
type Dict = Record<string, string>;

const en: Dict = {
  // Nav / header
  "nav.features": "Features",
  "nav.who": "Who it's for",
  "nav.how": "How it works",
  "nav.signIn": "Sign in",
  "nav.getStarted": "Get started",
  "nav.signOut": "Sign out",
  "nav.openDashboard": "Open dashboard",
  "nav.backHome": "Back to home",

  // Landing hero
  "hero.badge": "Made in India · For every Indian",
  "hero.title1": "Your everyday AI",
  "hero.title2": "assistant for",
  "hero.title3": "life in India",
  "hero.subtitle":
    "Understand any document, fill any government form, spot scams, plan your career and never miss a deadline — all in the language you think in.",
  "hero.cta.try": "Try Bharat Buddy free",
  "hero.cta.see": "See what it can do",
  "hero.perk.noCard": "No credit card",
  "hero.perk.langs": "12+ Indian languages",
  "hero.perk.voice": "Voice input & output",

  // Sections
  "features.heading": "Five tools. One Buddy.",
  "features.sub": "Everything you need to navigate paperwork, scams and opportunities — in one place.",
  "who.heading": "Built for every Indian.",
  "who.sub":
    "Whether you are filing your first scholarship form or your hundredth tax return, Buddy speaks your language and meets you where you are.",
  "how.heading": "How it works",
  "how.sub": "Simple enough for your grandparents. Powerful enough for everyone else.",
  "cta.heading": "Let Buddy handle the paperwork.",
  "cta.sub": "Join thousands of Indians who finally understand every document they sign.",
  "cta.button": "Open my dashboard",

  // Audiences
  "aud.students": "Students",
  "aud.jobSeekers": "Job Seekers",
  "aud.parents": "Parents",
  "aud.firstNet": "First-time Internet Users",
  "aud.ruralUrban": "Rural & Urban India",

  // Steps
  "step.1.title": "Upload or paste",
  "step.1.text": "Share a document, message, screenshot, form or resume — in any format.",
  "step.2.title": "Buddy understands",
  "step.2.text": "Our AI reads it carefully, translates it, and pulls out what actually matters for you.",
  "step.3.title": "You take action",
  "step.3.text": "Get a clear summary, next steps, reminders and warnings — in your language.",

  // Feature cards (titles only; descriptions stay English to avoid bloat)
  "feat.docs": "Document Explainer",
  "feat.forms": "Government Form Assistant",
  "feat.scam": "Scam Shield",
  "feat.career": "Career Navigator",
  "feat.reminders": "Smart Reminder Engine",

  // Dashboard sidebar
  "side.overview": "Overview",
  "side.documents": "Documents",
  "side.forms": "Govt Forms",
  "side.scam": "Scam Shield",
  "side.women": "Women Safety",
  "side.career": "Career",
  "side.reminders": "Reminders",
  "side.analytics": "Analytics",
  "side.settings": "Settings",
  "side.language": "Language",

  // Dashboard overview
  "dash.namaste": "Namaste",
  "dash.welcomeNew": "Welcome to Bharat Buddy AI! Pick any tool below to get started — Buddy is ready to help.",
  "dash.welcomeReturning": "What would you like Buddy to help with today?",
  "dash.stats.docs": "Documents explained",
  "dash.stats.scams": "Scams checked",
  "dash.stats.upcoming": "Upcoming deadlines",
  "dash.stats.allTime": "All time",
  "dash.stats.staySafe": "Stay safe",
  "dash.stats.notDone": "Not yet done",
  "dash.quick": "Quick actions",
  "quick.docs.title": "Explain a document",
  "quick.docs.desc": "PDF, image or screenshot",
  "quick.forms.title": "Fill a govt form",
  "quick.forms.desc": "Aadhaar, PAN, PMAY & more",
  "quick.scam.title": "Check a message",
  "quick.scam.desc": "SMS, WhatsApp, email",
  "quick.career.title": "Plan my career",
  "quick.career.desc": "Upload resume",
  "quick.reminders.title": "View reminders",
  "quick.reminders.desc": "Never miss a deadline",

  // Footer
  "footer.copy": "© {year} Bharat Buddy AI · Made with care for India",

  // Toasts
  "toast.langSet": "Language set to {lang}",
  "toast.signedOut": "Signed out",
};

const hi: Dict = {
  "nav.features": "विशेषताएँ",
  "nav.who": "किसके लिए",
  "nav.how": "कैसे काम करता है",
  "nav.signIn": "साइन इन",
  "nav.getStarted": "शुरू करें",
  "nav.signOut": "साइन आउट",
  "nav.openDashboard": "डैशबोर्ड खोलें",
  "nav.backHome": "होम पर वापस",
  "hero.badge": "भारत में बना · हर भारतीय के लिए",
  "hero.title1": "आपका रोज़मर्रा का AI",
  "hero.title2": "साथी",
  "hero.title3": "भारत में जीवन के लिए",
  "hero.subtitle": "कोई भी दस्तावेज़ समझें, सरकारी फॉर्म भरें, ठगी पहचानें, करियर बनाएँ और कोई डेडलाइन कभी न चूकें — आपकी अपनी भाषा में।",
  "hero.cta.try": "Bharat Buddy मुफ़्त आज़माएँ",
  "hero.cta.see": "देखें यह क्या कर सकता है",
  "hero.perk.noCard": "कोई क्रेडिट कार्ड नहीं",
  "hero.perk.langs": "12+ भारतीय भाषाएँ",
  "hero.perk.voice": "आवाज़ इनपुट और आउटपुट",
  "features.heading": "पाँच टूल। एक Buddy।",
  "features.sub": "कागज़ी काम, ठगी और अवसरों से निपटने के लिए सब कुछ — एक जगह।",
  "who.heading": "हर भारतीय के लिए बना।",
  "who.sub": "चाहे पहली छात्रवृत्ति का फॉर्म हो या सौवाँ टैक्स रिटर्न — Buddy आपकी भाषा बोलता है।",
  "how.heading": "यह कैसे काम करता है",
  "how.sub": "इतना आसान कि आपके दादा-दादी भी समझें। इतना ताकतवर कि सबके काम आए।",
  "cta.heading": "कागज़ी काम Buddy पर छोड़ दें।",
  "cta.sub": "हज़ारों भारतीयों के साथ जुड़ें जो हर दस्तावेज़ समझते हैं।",
  "cta.button": "मेरा डैशबोर्ड खोलें",
  "aud.students": "विद्यार्थी",
  "aud.jobSeekers": "नौकरी ढूँढ़ने वाले",
  "aud.parents": "अभिभावक",
  "aud.firstNet": "पहली बार इंटरनेट यूज़र",
  "aud.ruralUrban": "ग्रामीण और शहरी भारत",
  "step.1.title": "अपलोड या पेस्ट करें",
  "step.1.text": "कोई भी दस्तावेज़, संदेश, स्क्रीनशॉट, फॉर्म या रिज़्यूमे साझा करें।",
  "step.2.title": "Buddy समझता है",
  "step.2.text": "हमारा AI ध्यान से पढ़ता है, अनुवाद करता है और ज़रूरी बातें निकालता है।",
  "step.3.title": "आप कार्रवाई करें",
  "step.3.text": "साफ़ सारांश, अगला कदम, रिमाइंडर और चेतावनियाँ — आपकी भाषा में।",
  "feat.docs": "दस्तावेज़ व्याख्याकार",
  "feat.forms": "सरकारी फॉर्म सहायक",
  "feat.scam": "Scam Shield",
  "feat.career": "करियर मार्गदर्शक",
  "feat.reminders": "स्मार्ट रिमाइंडर",
  "side.overview": "अवलोकन",
  "side.documents": "दस्तावेज़",
  "side.forms": "सरकारी फॉर्म",
  "side.scam": "Scam Shield",
  "side.women": "महिला सुरक्षा",
  "side.career": "करियर",
  "side.reminders": "रिमाइंडर",
  "side.analytics": "विश्लेषण",
  "side.settings": "सेटिंग्स",
  "side.language": "भाषा",
  "dash.namaste": "नमस्ते",
  "dash.welcomeNew": "Bharat Buddy AI में स्वागत है! नीचे से कोई भी टूल चुनें — Buddy तैयार है।",
  "dash.welcomeReturning": "आज Buddy आपकी क्या मदद करे?",
  "dash.stats.docs": "समझाए गए दस्तावेज़",
  "dash.stats.scams": "जाँचे गए संदेश",
  "dash.stats.upcoming": "आगामी डेडलाइन",
  "dash.stats.allTime": "अब तक",
  "dash.stats.staySafe": "सुरक्षित रहें",
  "dash.stats.notDone": "अभी बाक़ी",
  "dash.quick": "त्वरित क्रियाएँ",
  "quick.docs.title": "दस्तावेज़ समझाएँ",
  "quick.docs.desc": "PDF, छवि या स्क्रीनशॉट",
  "quick.forms.title": "सरकारी फॉर्म भरें",
  "quick.forms.desc": "Aadhaar, PAN, PMAY और बहुत कुछ",
  "quick.scam.title": "संदेश जाँचें",
  "quick.scam.desc": "SMS, WhatsApp, ईमेल",
  "quick.career.title": "करियर बनाएँ",
  "quick.career.desc": "रिज़्यूमे अपलोड करें",
  "quick.reminders.title": "रिमाइंडर देखें",
  "quick.reminders.desc": "कोई डेडलाइन न चूकें",
  "footer.copy": "© {year} Bharat Buddy AI · भारत के लिए प्रेम से बनाया",
  "toast.langSet": "भाषा सेट हुई: {lang}",
  "toast.signedOut": "साइन आउट हो गए",
};

const ta: Dict = {
  "nav.features": "அம்சங்கள்",
  "nav.who": "யாருக்காக",
  "nav.how": "எப்படி",
  "nav.signIn": "உள்நுழை",
  "nav.getStarted": "தொடங்கு",
  "nav.signOut": "வெளியேறு",
  "nav.openDashboard": "டாஷ்போர்டு திற",
  "nav.backHome": "முகப்புக்கு திரும்பு",
  "hero.badge": "இந்தியாவில் உருவாக்கப்பட்டது · ஒவ்வொரு இந்தியருக்கும்",
  "hero.title1": "உங்கள் தினசரி AI",
  "hero.title2": "துணை",
  "hero.title3": "இந்திய வாழ்க்கைக்கு",
  "hero.subtitle": "எந்த ஆவணத்தையும் புரிந்து கொள்ளுங்கள், அரசு படிவங்களை நிரப்புங்கள், மோசடியை கண்டறியுங்கள் — உங்கள் மொழியில்.",
  "hero.cta.try": "Bharat Buddy இலவசமாக முயற்சிக்கவும்",
  "hero.cta.see": "என்ன செய்ய முடியும் என பாருங்கள்",
  "hero.perk.noCard": "கிரெடிட் கார்டு தேவையில்லை",
  "hero.perk.langs": "12+ இந்திய மொழிகள்",
  "hero.perk.voice": "குரல் உள்ளீடு & வெளியீடு",
  "features.heading": "ஐந்து கருவிகள். ஒரு Buddy.",
  "features.sub": "காகித வேலை, மோசடி, வாய்ப்புகள் — அனைத்தும் ஒரே இடத்தில்.",
  "who.heading": "ஒவ்வொரு இந்தியருக்கும்.",
  "who.sub": "முதல் கல்வி உதவித்தொகை படிவம் அல்லது நூறாவது வரி வருமான படிவம் — Buddy உங்கள் மொழியில் பேசுகிறது.",
  "how.heading": "எப்படி வேலை செய்கிறது",
  "how.sub": "தாத்தா பாட்டிக்கும் எளிது. அனைவருக்கும் சக்தி வாய்ந்தது.",
  "cta.heading": "காகித வேலையை Buddy-க்கு விடுங்கள்.",
  "cta.sub": "ஆயிரக்கணக்கான இந்தியர்களுடன் இணையுங்கள்.",
  "cta.button": "எனது டாஷ்போர்டு திற",
  "aud.students": "மாணவர்கள்",
  "aud.jobSeekers": "வேலை தேடுபவர்கள்",
  "aud.parents": "பெற்றோர்",
  "aud.firstNet": "புதிய இணைய பயனர்கள்",
  "aud.ruralUrban": "கிராம & நகர இந்தியா",
  "step.1.title": "பதிவேற்றவும் அல்லது ஒட்டவும்",
  "step.1.text": "எந்த வடிவத்திலும் ஆவணம், செய்தி, ஸ்கிரீன்ஷாட் அல்லது படிவத்தைப் பகிரவும்.",
  "step.2.title": "Buddy புரிந்து கொள்கிறது",
  "step.2.text": "எங்கள் AI கவனமாக படித்து, மொழிபெயர்த்து, முக்கியமானதை எடுக்கிறது.",
  "step.3.title": "நீங்கள் செயல்படுங்கள்",
  "step.3.text": "தெளிவான சுருக்கம், அடுத்த படிகள், நினைவூட்டல்கள் — உங்கள் மொழியில்.",
  "feat.docs": "ஆவண விளக்கி",
  "feat.forms": "அரசு படிவ உதவியாளர்",
  "feat.scam": "Scam Shield",
  "feat.career": "தொழில் வழிகாட்டி",
  "feat.reminders": "ஸ்மார்ட் நினைவூட்டல்",
  "side.overview": "மேலோட்டம்",
  "side.documents": "ஆவணங்கள்",
  "side.forms": "அரசு படிவங்கள்",
  "side.scam": "Scam Shield",
  "side.women": "பெண்கள் பாதுகாப்பு",
  "side.career": "தொழில்",
  "side.reminders": "நினைவூட்டல்கள்",
  "side.analytics": "பகுப்பாய்வு",
  "side.settings": "அமைப்புகள்",
  "side.language": "மொழி",
  "dash.namaste": "வணக்கம்",
  "dash.welcomeNew": "Bharat Buddy AI-க்கு வரவேற்கிறோம்! கீழே ஒரு கருவியைத் தேர்வு செய்யுங்கள்.",
  "dash.welcomeReturning": "இன்று Buddy எப்படி உதவ வேண்டும்?",
  "dash.stats.docs": "விளக்கப்பட்ட ஆவணங்கள்",
  "dash.stats.scams": "சரிபார்க்கப்பட்டவை",
  "dash.stats.upcoming": "வரவிருக்கும் காலக்கெடு",
  "dash.stats.allTime": "எல்லா காலமும்",
  "dash.stats.staySafe": "பாதுகாப்பாக இருங்கள்",
  "dash.stats.notDone": "இன்னும் முடியவில்லை",
  "dash.quick": "விரைவு செயல்கள்",
  "quick.docs.title": "ஆவணம் விளக்கு",
  "quick.docs.desc": "PDF, படம் அல்லது ஸ்கிரீன்ஷாட்",
  "quick.forms.title": "அரசு படிவம் நிரப்பு",
  "quick.forms.desc": "Aadhaar, PAN, PMAY மற்றும் பல",
  "quick.scam.title": "செய்தியை சரிபார்",
  "quick.scam.desc": "SMS, WhatsApp, மின்னஞ்சல்",
  "quick.career.title": "தொழில் திட்டமிடு",
  "quick.career.desc": "ரெஸ்யூமே பதிவேற்று",
  "quick.reminders.title": "நினைவூட்டல்களைப் பார்",
  "quick.reminders.desc": "காலக்கெடுவைத் தவறவிடாதீர்",
  "footer.copy": "© {year} Bharat Buddy AI · இந்தியாவுக்காக அன்புடன் உருவாக்கப்பட்டது",
  "toast.langSet": "மொழி அமைக்கப்பட்டது: {lang}",
  "toast.signedOut": "வெளியேறிவிட்டீர்கள்",
};

const bn: Dict = {
  "nav.features": "বৈশিষ্ট্য", "nav.who": "কাদের জন্য", "nav.how": "কীভাবে কাজ করে",
  "nav.signIn": "সাইন ইন", "nav.getStarted": "শুরু করুন", "nav.signOut": "সাইন আউট",
  "nav.openDashboard": "ড্যাশবোর্ড খুলুন", "nav.backHome": "হোমে ফিরুন",
  "hero.badge": "ভারতে তৈরি · প্রতিটি ভারতীয়ের জন্য",
  "hero.title1": "আপনার দৈনন্দিন AI", "hero.title2": "সহকারী", "hero.title3": "ভারতের জীবনের জন্য",
  "hero.subtitle": "যেকোনো নথি বুঝুন, সরকারি ফর্ম পূরণ করুন, প্রতারণা চিনুন — আপনার ভাষায়।",
  "hero.cta.try": "Bharat Buddy বিনামূল্যে চেষ্টা করুন", "hero.cta.see": "এটি কী করতে পারে দেখুন",
  "hero.perk.noCard": "ক্রেডিট কার্ড লাগবে না", "hero.perk.langs": "১২+ ভারতীয় ভাষা", "hero.perk.voice": "ভয়েস ইনপুট ও আউটপুট",
  "features.heading": "পাঁচটি টুল। এক Buddy।",
  "features.sub": "কাগজপত্র, প্রতারণা ও সুযোগের জন্য সব কিছু — এক জায়গায়।",
  "who.heading": "প্রতিটি ভারতীয়ের জন্য।",
  "who.sub": "প্রথম বৃত্তির ফর্ম হোক বা শততম কর রিটার্ন — Buddy আপনার ভাষায় কথা বলে।",
  "how.heading": "এটি কীভাবে কাজ করে",
  "how.sub": "দাদু-দিদার জন্যও সহজ। সবার জন্য শক্তিশালী।",
  "cta.heading": "কাগজপত্র Buddy-কে দিন।", "cta.sub": "হাজার হাজার ভারতীয়ের সাথে যোগ দিন।", "cta.button": "আমার ড্যাশবোর্ড খুলুন",
  "aud.students": "ছাত্র", "aud.jobSeekers": "চাকরি প্রার্থী", "aud.parents": "অভিভাবক",
  "aud.firstNet": "প্রথমবার ইন্টারনেট ব্যবহারকারী", "aud.ruralUrban": "গ্রামীণ ও শহুরে ভারত",
  "step.1.title": "আপলোড বা পেস্ট", "step.1.text": "যেকোনো নথি, বার্তা বা ফর্ম শেয়ার করুন।",
  "step.2.title": "Buddy বোঝে", "step.2.text": "আমাদের AI পড়ে, অনুবাদ করে, গুরুত্বপূর্ণ অংশ বের করে।",
  "step.3.title": "আপনি পদক্ষেপ নিন", "step.3.text": "স্পষ্ট সারাংশ, পরবর্তী পদক্ষেপ — আপনার ভাষায়।",
  "feat.docs": "নথি ব্যাখ্যাকারী", "feat.forms": "সরকারি ফর্ম সহায়ক", "feat.scam": "Scam Shield",
  "feat.career": "ক্যারিয়ার গাইড", "feat.reminders": "স্মার্ট রিমাইন্ডার",
  "side.overview": "ওভারভিউ", "side.documents": "নথি", "side.forms": "সরকারি ফর্ম",
  "side.scam": "Scam Shield", "side.women": "নারী নিরাপত্তা", "side.career": "ক্যারিয়ার",
  "side.reminders": "রিমাইন্ডার", "side.analytics": "বিশ্লেষণ", "side.settings": "সেটিংস", "side.language": "ভাষা",
  "dash.namaste": "নমস্কার",
  "dash.welcomeNew": "Bharat Buddy AI-তে স্বাগতম! নিচে যেকোনো টুল বেছে নিন।",
  "dash.welcomeReturning": "আজ Buddy কীভাবে সাহায্য করবে?",
  "dash.stats.docs": "ব্যাখ্যা করা নথি", "dash.stats.scams": "যাচাই করা বার্তা", "dash.stats.upcoming": "আসন্ন সময়সীমা",
  "dash.stats.allTime": "সর্বকালের", "dash.stats.staySafe": "সুরক্ষিত থাকুন", "dash.stats.notDone": "এখনও বাকি",
  "dash.quick": "দ্রুত ক্রিয়া",
  "quick.docs.title": "নথি ব্যাখ্যা করুন", "quick.docs.desc": "PDF, ছবি বা স্ক্রিনশট",
  "quick.forms.title": "সরকারি ফর্ম পূরণ", "quick.forms.desc": "Aadhaar, PAN, PMAY ও আরও",
  "quick.scam.title": "বার্তা যাচাই", "quick.scam.desc": "SMS, WhatsApp, ইমেইল",
  "quick.career.title": "ক্যারিয়ার পরিকল্পনা", "quick.career.desc": "রিজিউমে আপলোড",
  "quick.reminders.title": "রিমাইন্ডার দেখুন", "quick.reminders.desc": "সময়সীমা মিস করবেন না",
  "footer.copy": "© {year} Bharat Buddy AI · ভারতের জন্য যত্নে তৈরি",
  "toast.langSet": "ভাষা সেট হয়েছে: {lang}", "toast.signedOut": "সাইন আউট হয়েছে",
};

const te: Dict = {
  "nav.features": "ఫీచర్లు", "nav.who": "ఎవరి కోసం", "nav.how": "ఎలా పనిచేస్తుంది",
  "nav.signIn": "సైన్ ఇన్", "nav.getStarted": "ప్రారంభించండి", "nav.signOut": "సైన్ అవుట్",
  "nav.openDashboard": "డాష్‌బోర్డ్ తెరువు", "nav.backHome": "హోమ్‌కు తిరిగి",
  "hero.badge": "భారత్‌లో తయారు · ప్రతి భారతీయుని కోసం",
  "hero.title1": "మీ రోజువారీ AI", "hero.title2": "సహాయకుడు", "hero.title3": "భారత జీవితానికి",
  "hero.subtitle": "ఏ పత్రాన్నైనా అర్థం చేసుకోండి, ప్రభుత్వ ఫారాలు నింపండి, మోసాలను గుర్తించండి — మీ భాషలో.",
  "hero.cta.try": "Bharat Buddy ఉచితంగా ప్రయత్నించండి", "hero.cta.see": "ఏమి చేయగలదో చూడండి",
  "hero.perk.noCard": "క్రెడిట్ కార్డ్ అవసరం లేదు", "hero.perk.langs": "12+ భారతీయ భాషలు", "hero.perk.voice": "వాయిస్ ఇన్‌పుట్ & అవుట్‌పుట్",
  "features.heading": "ఐదు సాధనాలు. ఒక Buddy.",
  "features.sub": "పేపర్ వర్క్, మోసాలు, అవకాశాలు — అన్నీ ఒకే చోట.",
  "who.heading": "ప్రతి భారతీయుని కోసం.",
  "who.sub": "మొదటి స్కాలర్‌షిప్ ఫారం లేదా వందో ట్యాక్స్ రిటర్న్ — Buddy మీ భాషలో మాట్లాడుతుంది.",
  "how.heading": "ఎలా పనిచేస్తుంది", "how.sub": "తాతయ్యలకు సులభం. అందరికీ శక్తివంతం.",
  "cta.heading": "పేపర్ వర్క్‌ను Buddy-కి వదిలెయ్యండి.", "cta.sub": "వేల మంది భారతీయులతో చేరండి.", "cta.button": "నా డాష్‌బోర్డ్ తెరువు",
  "aud.students": "విద్యార్థులు", "aud.jobSeekers": "ఉద్యోగాన్వేషకులు", "aud.parents": "తల్లిదండ్రులు",
  "aud.firstNet": "మొదటిసారి ఇంటర్నెట్ వాడేవారు", "aud.ruralUrban": "గ్రామీణ & పట్టణ భారత్",
  "step.1.title": "అప్‌లోడ్ లేదా పేస్ట్", "step.1.text": "ఏ ఫార్మాట్‌లోనైనా పత్రం, సందేశం, ఫారం షేర్ చేయండి.",
  "step.2.title": "Buddy అర్థం చేసుకుంటుంది", "step.2.text": "మా AI జాగ్రత్తగా చదివి, అనువదించి, ముఖ్యమైనది తీస్తుంది.",
  "step.3.title": "మీరు చర్య తీసుకోండి", "step.3.text": "స్పష్టమైన సారాంశం, తదుపరి దశలు — మీ భాషలో.",
  "feat.docs": "డాక్యుమెంట్ వివరణకర్త", "feat.forms": "ప్రభుత్వ ఫారం సహాయకుడు", "feat.scam": "Scam Shield",
  "feat.career": "కెరీర్ గైడ్", "feat.reminders": "స్మార్ట్ రిమైండర్",
  "side.overview": "అవలోకనం", "side.documents": "పత్రాలు", "side.forms": "ప్రభుత్వ ఫారాలు",
  "side.scam": "Scam Shield", "side.women": "మహిళా భద్రత", "side.career": "కెరీర్",
  "side.reminders": "రిమైండర్లు", "side.analytics": "విశ్లేషణ", "side.settings": "సెట్టింగ్‌లు", "side.language": "భాష",
  "dash.namaste": "నమస్తే",
  "dash.welcomeNew": "Bharat Buddy AI-కి స్వాగతం! దిగువ ఏదైనా సాధనాన్ని ఎంచుకోండి.",
  "dash.welcomeReturning": "ఈరోజు Buddy ఎలా సహాయం చేయాలి?",
  "dash.stats.docs": "వివరించిన పత్రాలు", "dash.stats.scams": "తనిఖీ చేసినవి", "dash.stats.upcoming": "రాబోయే గడువులు",
  "dash.stats.allTime": "మొత్తం", "dash.stats.staySafe": "సురక్షితంగా ఉండండి", "dash.stats.notDone": "ఇంకా బాకీ",
  "dash.quick": "త్వరిత చర్యలు",
  "quick.docs.title": "పత్రం వివరించు", "quick.docs.desc": "PDF, చిత్రం లేదా స్క్రీన్‌షాట్",
  "quick.forms.title": "ప్రభుత్వ ఫారం నింపు", "quick.forms.desc": "Aadhaar, PAN, PMAY మరియు ఇంకా",
  "quick.scam.title": "సందేశం తనిఖీ", "quick.scam.desc": "SMS, WhatsApp, ఇమెయిల్",
  "quick.career.title": "కెరీర్ ప్లాన్", "quick.career.desc": "రెజ్యూమ్ అప్‌లోడ్",
  "quick.reminders.title": "రిమైండర్లు చూడు", "quick.reminders.desc": "గడువును మిస్ కావద్దు",
  "footer.copy": "© {year} Bharat Buddy AI · భారత్ కోసం ప్రేమతో తయారు",
  "toast.langSet": "భాష సెట్ చేయబడింది: {lang}", "toast.signedOut": "సైన్ అవుట్ అయ్యారు",
};

const mr: Dict = {
  "nav.features": "वैशिष्ट्ये", "nav.who": "कोणासाठी", "nav.how": "कसे काम करते",
  "nav.signIn": "साइन इन", "nav.getStarted": "सुरू करा", "nav.signOut": "साइन आउट",
  "nav.openDashboard": "डॅशबोर्ड उघडा", "nav.backHome": "मुख्यपानावर परत",
  "hero.badge": "भारतात बनवले · प्रत्येक भारतीयासाठी",
  "hero.title1": "तुमचा रोजचा AI", "hero.title2": "सहायक", "hero.title3": "भारतातील जीवनासाठी",
  "hero.subtitle": "कोणतेही दस्तऐवज समजून घ्या, सरकारी फॉर्म भरा, फसवणूक ओळखा — तुमच्या भाषेत.",
  "hero.cta.try": "Bharat Buddy मोफत वापरून पहा", "hero.cta.see": "ते काय करू शकते पहा",
  "hero.perk.noCard": "क्रेडिट कार्ड नको", "hero.perk.langs": "12+ भारतीय भाषा", "hero.perk.voice": "व्हॉइस इनपुट व आउटपुट",
  "features.heading": "पाच साधने. एक Buddy.",
  "features.sub": "कागदपत्रे, फसवणूक आणि संधी — सर्व एका ठिकाणी.",
  "who.heading": "प्रत्येक भारतीयासाठी बनवले.",
  "who.sub": "पहिला शिष्यवृत्ती फॉर्म असो की शंभरावा कर रिटर्न — Buddy तुमच्या भाषेत बोलते.",
  "how.heading": "कसे काम करते", "how.sub": "आजी-आजोबांसाठी सोपे. सर्वांसाठी शक्तिशाली.",
  "cta.heading": "कागदपत्रे Buddy वर सोपवा.", "cta.sub": "हजारो भारतीयांसोबत सामील व्हा.", "cta.button": "माझा डॅशबोर्ड उघडा",
  "aud.students": "विद्यार्थी", "aud.jobSeekers": "नोकरी शोधणारे", "aud.parents": "पालक",
  "aud.firstNet": "पहिल्यांदा इंटरनेट वापरकर्ते", "aud.ruralUrban": "ग्रामीण व शहरी भारत",
  "step.1.title": "अपलोड किंवा पेस्ट", "step.1.text": "कोणत्याही स्वरूपात दस्तऐवज, संदेश, फॉर्म शेअर करा.",
  "step.2.title": "Buddy समजते", "step.2.text": "आमचा AI काळजीपूर्वक वाचतो, भाषांतर करतो आणि महत्त्वाचे काढतो.",
  "step.3.title": "तुम्ही कृती करा", "step.3.text": "स्पष्ट सारांश, पुढील पावले — तुमच्या भाषेत.",
  "feat.docs": "दस्तऐवज स्पष्टीकरण", "feat.forms": "सरकारी फॉर्म सहायक", "feat.scam": "Scam Shield",
  "feat.career": "करिअर मार्गदर्शक", "feat.reminders": "स्मार्ट रिमाइंडर",
  "side.overview": "आढावा", "side.documents": "दस्तऐवज", "side.forms": "सरकारी फॉर्म",
  "side.scam": "Scam Shield", "side.women": "महिला सुरक्षा", "side.career": "करिअर",
  "side.reminders": "रिमाइंडर", "side.analytics": "विश्लेषण", "side.settings": "सेटिंग्ज", "side.language": "भाषा",
  "dash.namaste": "नमस्कार",
  "dash.welcomeNew": "Bharat Buddy AI मध्ये स्वागत आहे! खालून कोणतेही साधन निवडा.",
  "dash.welcomeReturning": "आज Buddy ने कसे मदत करावे?",
  "dash.stats.docs": "स्पष्ट केलेले दस्तऐवज", "dash.stats.scams": "तपासलेले संदेश", "dash.stats.upcoming": "आगामी मुदती",
  "dash.stats.allTime": "एकूण", "dash.stats.staySafe": "सुरक्षित रहा", "dash.stats.notDone": "अद्याप बाकी",
  "dash.quick": "जलद क्रिया",
  "quick.docs.title": "दस्तऐवज समजावा", "quick.docs.desc": "PDF, प्रतिमा किंवा स्क्रीनशॉट",
  "quick.forms.title": "सरकारी फॉर्म भरा", "quick.forms.desc": "Aadhaar, PAN, PMAY आणि अधिक",
  "quick.scam.title": "संदेश तपासा", "quick.scam.desc": "SMS, WhatsApp, ईमेल",
  "quick.career.title": "करिअर नियोजन", "quick.career.desc": "रेज्युमे अपलोड",
  "quick.reminders.title": "रिमाइंडर पहा", "quick.reminders.desc": "मुदत चुकवू नका",
  "footer.copy": "© {year} Bharat Buddy AI · भारतासाठी प्रेमाने बनवले",
  "toast.langSet": "भाषा सेट केली: {lang}", "toast.signedOut": "साइन आउट झाले",
};

const gu: Dict = {
  "nav.features": "વિશેષતાઓ", "nav.who": "કોના માટે", "nav.how": "કેવી રીતે કામ કરે છે",
  "nav.signIn": "સાઇન ઇન", "nav.getStarted": "શરૂ કરો", "nav.signOut": "સાઇન આઉટ",
  "nav.openDashboard": "ડેશબોર્ડ ખોલો", "nav.backHome": "ઘરે પાછા",
  "hero.badge": "ભારતમાં બનાવ્યું · દરેક ભારતીય માટે",
  "hero.title1": "તમારો રોજિંદો AI", "hero.title2": "સહાયક", "hero.title3": "ભારતના જીવન માટે",
  "hero.subtitle": "કોઈપણ દસ્તાવેજ સમજો, સરકારી ફોર્મ ભરો, છેતરપિંડી ઓળખો — તમારી ભાષામાં.",
  "hero.cta.try": "Bharat Buddy મફત અજમાવો", "hero.cta.see": "શું કરી શકે છે જુઓ",
  "hero.perk.noCard": "ક્રેડિટ કાર્ડ જરૂરી નથી", "hero.perk.langs": "12+ ભારતીય ભાષાઓ", "hero.perk.voice": "વોઇસ ઇનપુટ અને આઉટપુટ",
  "features.heading": "પાંચ સાધનો. એક Buddy.",
  "features.sub": "કાગળકામ, છેતરપિંડી અને તકો — એક જગ્યાએ.",
  "who.heading": "દરેક ભારતીય માટે.",
  "who.sub": "પ્રથમ શિષ્યવૃત્તિ ફોર્મ હોય કે સોમો ટેક્સ રિટર્ન — Buddy તમારી ભાષામાં બોલે છે.",
  "how.heading": "કેવી રીતે કામ કરે છે", "how.sub": "દાદા-દાદી માટે સરળ. બધા માટે શક્તિશાળી.",
  "cta.heading": "કાગળકામ Buddy ને સોંપો.", "cta.sub": "હજારો ભારતીયો સાથે જોડાઓ.", "cta.button": "મારું ડેશબોર્ડ ખોલો",
  "aud.students": "વિદ્યાર્થીઓ", "aud.jobSeekers": "નોકરી શોધનારા", "aud.parents": "વાલીઓ",
  "aud.firstNet": "પ્રથમ વખત ઇન્ટરનેટ વપરાશકર્તાઓ", "aud.ruralUrban": "ગ્રામીણ અને શહેરી ભારત",
  "step.1.title": "અપલોડ કે પેસ્ટ", "step.1.text": "કોઈપણ ફોર્મેટમાં દસ્તાવેજ, સંદેશ, ફોર્મ શેર કરો.",
  "step.2.title": "Buddy સમજે છે", "step.2.text": "અમારું AI કાળજીપૂર્વક વાંચે, ભાષાંતર કરે અને મહત્વનું કાઢે.",
  "step.3.title": "તમે પગલાં લો", "step.3.text": "સ્પષ્ટ સારાંશ, આગળના પગલાં — તમારી ભાષામાં.",
  "feat.docs": "દસ્તાવેજ સ્પષ્ટકર્તા", "feat.forms": "સરકારી ફોર્મ સહાયક", "feat.scam": "Scam Shield",
  "feat.career": "કારકિર્દી માર્ગદર્શક", "feat.reminders": "સ્માર્ટ રિમાઇન્ડર",
  "side.overview": "ઝાંખી", "side.documents": "દસ્તાવેજો", "side.forms": "સરકારી ફોર્મ",
  "side.scam": "Scam Shield", "side.women": "મહિલા સુરક્ષા", "side.career": "કારકિર્દી",
  "side.reminders": "રિમાઇન્ડર", "side.analytics": "વિશ્લેષણ", "side.settings": "સેટિંગ્સ", "side.language": "ભાષા",
  "dash.namaste": "નમસ્તે",
  "dash.welcomeNew": "Bharat Buddy AI માં આપનું સ્વાગત છે! નીચે કોઈપણ સાધન પસંદ કરો.",
  "dash.welcomeReturning": "આજે Buddy કેવી રીતે મદદ કરે?",
  "dash.stats.docs": "સ્પષ્ટ કરેલા દસ્તાવેજો", "dash.stats.scams": "ચકાસેલા સંદેશ", "dash.stats.upcoming": "આગામી મુદત",
  "dash.stats.allTime": "બધો સમય", "dash.stats.staySafe": "સુરક્ષિત રહો", "dash.stats.notDone": "હજુ બાકી",
  "dash.quick": "ઝડપી ક્રિયાઓ",
  "quick.docs.title": "દસ્તાવેજ સમજાવો", "quick.docs.desc": "PDF, ચિત્ર કે સ્ક્રીનશોટ",
  "quick.forms.title": "સરકારી ફોર્મ ભરો", "quick.forms.desc": "Aadhaar, PAN, PMAY અને વધુ",
  "quick.scam.title": "સંદેશ ચકાસો", "quick.scam.desc": "SMS, WhatsApp, ઈમેલ",
  "quick.career.title": "કારકિર્દી પ્લાન", "quick.career.desc": "રિઝ્યુમ અપલોડ",
  "quick.reminders.title": "રિમાઇન્ડર જુઓ", "quick.reminders.desc": "મુદત ચૂકશો નહીં",
  "footer.copy": "© {year} Bharat Buddy AI · ભારત માટે પ્રેમથી બનાવ્યું",
  "toast.langSet": "ભાષા સેટ થઈ: {lang}", "toast.signedOut": "સાઇન આઉટ થયા",
};

const pa: Dict = {
  "nav.features": "ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ", "nav.who": "ਕਿਸ ਲਈ", "nav.how": "ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ",
  "nav.signIn": "ਸਾਈਨ ਇਨ", "nav.getStarted": "ਸ਼ੁਰੂ ਕਰੋ", "nav.signOut": "ਸਾਈਨ ਆਉਟ",
  "nav.openDashboard": "ਡੈਸ਼ਬੋਰਡ ਖੋਲ੍ਹੋ", "nav.backHome": "ਘਰ ਵਾਪਸ",
  "hero.badge": "ਭਾਰਤ ਵਿੱਚ ਬਣਾਇਆ · ਹਰ ਭਾਰਤੀ ਲਈ",
  "hero.title1": "ਤੁਹਾਡਾ ਰੋਜ਼ਾਨਾ AI", "hero.title2": "ਸਹਾਇਕ", "hero.title3": "ਭਾਰਤ ਦੀ ਜ਼ਿੰਦਗੀ ਲਈ",
  "hero.subtitle": "ਕੋਈ ਵੀ ਦਸਤਾਵੇਜ਼ ਸਮਝੋ, ਸਰਕਾਰੀ ਫਾਰਮ ਭਰੋ, ਧੋਖੇ ਨੂੰ ਪਛਾਣੋ — ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਵਿੱਚ.",
  "hero.cta.try": "Bharat Buddy ਮੁਫ਼ਤ ਅਜ਼ਮਾਓ", "hero.cta.see": "ਇਹ ਕੀ ਕਰ ਸਕਦਾ ਹੈ ਦੇਖੋ",
  "hero.perk.noCard": "ਕ੍ਰੈਡਿਟ ਕਾਰਡ ਨਹੀਂ", "hero.perk.langs": "12+ ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ", "hero.perk.voice": "ਆਵਾਜ਼ ਇਨਪੁਟ ਤੇ ਆਉਟਪੁਟ",
  "features.heading": "ਪੰਜ ਟੂਲ। ਇੱਕ Buddy।",
  "features.sub": "ਕਾਗਜ਼ੀ ਕੰਮ, ਧੋਖੇ ਤੇ ਮੌਕੇ — ਇੱਕ ਥਾਂ.",
  "who.heading": "ਹਰ ਭਾਰਤੀ ਲਈ।",
  "who.sub": "ਪਹਿਲਾ ਸਕਾਲਰਸ਼ਿਪ ਫਾਰਮ ਹੋਵੇ ਜਾਂ ਸੌਵਾਂ ਟੈਕਸ ਰਿਟਰਨ — Buddy ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਬੋਲਦਾ ਹੈ.",
  "how.heading": "ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ", "how.sub": "ਦਾਦੇ-ਦਾਦੀ ਲਈ ਆਸਾਨ। ਸਾਰਿਆਂ ਲਈ ਤਾਕਤਵਰ।",
  "cta.heading": "ਕਾਗਜ਼ੀ ਕੰਮ Buddy ਨੂੰ ਦਿਓ.", "cta.sub": "ਹਜ਼ਾਰਾਂ ਭਾਰਤੀਆਂ ਨਾਲ ਜੁੜੋ.", "cta.button": "ਮੇਰਾ ਡੈਸ਼ਬੋਰਡ ਖੋਲ੍ਹੋ",
  "aud.students": "ਵਿਦਿਆਰਥੀ", "aud.jobSeekers": "ਨੌਕਰੀ ਲੱਭਣ ਵਾਲੇ", "aud.parents": "ਮਾਪੇ",
  "aud.firstNet": "ਪਹਿਲੀ ਵਾਰ ਇੰਟਰਨੈੱਟ ਯੂਜ਼ਰ", "aud.ruralUrban": "ਪਿੰਡ ਤੇ ਸ਼ਹਿਰੀ ਭਾਰਤ",
  "step.1.title": "ਅਪਲੋਡ ਜਾਂ ਪੇਸਟ", "step.1.text": "ਕਿਸੇ ਵੀ ਫਾਰਮੈਟ ਵਿੱਚ ਦਸਤਾਵੇਜ਼ ਜਾਂ ਫਾਰਮ ਸਾਂਝਾ ਕਰੋ.",
  "step.2.title": "Buddy ਸਮਝਦਾ ਹੈ", "step.2.text": "ਸਾਡਾ AI ਧਿਆਨ ਨਾਲ ਪੜ੍ਹਦਾ, ਅਨੁਵਾਦ ਕਰਦਾ ਤੇ ਖ਼ਾਸ ਗੱਲਾਂ ਕੱਢਦਾ ਹੈ.",
  "step.3.title": "ਤੁਸੀਂ ਕਾਰਵਾਈ ਕਰੋ", "step.3.text": "ਸਾਫ਼ ਸੰਖੇਪ, ਅਗਲੇ ਕਦਮ — ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਵਿੱਚ.",
  "feat.docs": "ਦਸਤਾਵੇਜ਼ ਵਿਆਖਿਆਕਾਰ", "feat.forms": "ਸਰਕਾਰੀ ਫਾਰਮ ਸਹਾਇਕ", "feat.scam": "Scam Shield",
  "feat.career": "ਕੈਰੀਅਰ ਗਾਈਡ", "feat.reminders": "ਸਮਾਰਟ ਰਿਮਾਈਂਡਰ",
  "side.overview": "ਝਾਤ", "side.documents": "ਦਸਤਾਵੇਜ਼", "side.forms": "ਸਰਕਾਰੀ ਫਾਰਮ",
  "side.scam": "Scam Shield", "side.women": "ਔਰਤ ਸੁਰੱਖਿਆ", "side.career": "ਕੈਰੀਅਰ",
  "side.reminders": "ਰਿਮਾਈਂਡਰ", "side.analytics": "ਵਿਸ਼ਲੇਸ਼ਣ", "side.settings": "ਸੈਟਿੰਗਾਂ", "side.language": "ਭਾਸ਼ਾ",
  "dash.namaste": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
  "dash.welcomeNew": "Bharat Buddy AI ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ! ਹੇਠੋਂ ਕੋਈ ਟੂਲ ਚੁਣੋ.",
  "dash.welcomeReturning": "ਅੱਜ Buddy ਕਿਵੇਂ ਮਦਦ ਕਰੇ?",
  "dash.stats.docs": "ਸਮਝਾਏ ਦਸਤਾਵੇਜ਼", "dash.stats.scams": "ਜਾਂਚੇ ਸੁਨੇਹੇ", "dash.stats.upcoming": "ਆਉਣ ਵਾਲੀਆਂ ਮਿਆਦਾਂ",
  "dash.stats.allTime": "ਹਰ ਸਮੇਂ", "dash.stats.staySafe": "ਸੁਰੱਖਿਅਤ ਰਹੋ", "dash.stats.notDone": "ਅਜੇ ਬਾਕੀ",
  "dash.quick": "ਤੇਜ਼ ਕਾਰਵਾਈਆਂ",
  "quick.docs.title": "ਦਸਤਾਵੇਜ਼ ਸਮਝਾਓ", "quick.docs.desc": "PDF, ਤਸਵੀਰ ਜਾਂ ਸਕ੍ਰੀਨਸ਼ੌਟ",
  "quick.forms.title": "ਸਰਕਾਰੀ ਫਾਰਮ ਭਰੋ", "quick.forms.desc": "Aadhaar, PAN, PMAY ਤੇ ਹੋਰ",
  "quick.scam.title": "ਸੁਨੇਹਾ ਜਾਂਚੋ", "quick.scam.desc": "SMS, WhatsApp, ਈਮੇਲ",
  "quick.career.title": "ਕੈਰੀਅਰ ਯੋਜਨਾ", "quick.career.desc": "ਰਿਜ਼ਿਊਮੇ ਅਪਲੋਡ",
  "quick.reminders.title": "ਰਿਮਾਈਂਡਰ ਦੇਖੋ", "quick.reminders.desc": "ਮਿਆਦ ਨਾ ਖੁੰਝੇ",
  "footer.copy": "© {year} Bharat Buddy AI · ਭਾਰਤ ਲਈ ਪਿਆਰ ਨਾਲ ਬਣਾਇਆ",
  "toast.langSet": "ਭਾਸ਼ਾ ਸੈੱਟ ਹੋਈ: {lang}", "toast.signedOut": "ਸਾਈਨ ਆਉਟ ਹੋ ਗਏ",
};

const kn: Dict = {
  "nav.features": "ವೈಶಿಷ್ಟ್ಯಗಳು", "nav.who": "ಯಾರಿಗಾಗಿ", "nav.how": "ಹೇಗೆ ಕಾರ್ಯ ನಿರ್ವಹಿಸುತ್ತದೆ",
  "nav.signIn": "ಸೈನ್ ಇನ್", "nav.getStarted": "ಪ್ರಾರಂಭಿಸಿ", "nav.signOut": "ಸೈನ್ ಔಟ್",
  "nav.openDashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆ", "nav.backHome": "ಮುಖ್ಯಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",
  "hero.badge": "ಭಾರತದಲ್ಲಿ ತಯಾರಿಸಲಾಗಿದೆ · ಪ್ರತಿ ಭಾರತೀಯನಿಗಾಗಿ",
  "hero.title1": "ನಿಮ್ಮ ದೈನಂದಿನ AI", "hero.title2": "ಸಹಾಯಕ", "hero.title3": "ಭಾರತದ ಜೀವನಕ್ಕಾಗಿ",
  "hero.subtitle": "ಯಾವುದೇ ದಾಖಲೆಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ, ಸರ್ಕಾರಿ ಅರ್ಜಿ ಭರ್ತಿ ಮಾಡಿ, ಮೋಸವನ್ನು ಗುರುತಿಸಿ — ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ.",
  "hero.cta.try": "Bharat Buddy ಉಚಿತವಾಗಿ ಪ್ರಯತ್ನಿಸಿ", "hero.cta.see": "ಏನು ಮಾಡಬಲ್ಲದು ನೋಡಿ",
  "hero.perk.noCard": "ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ ಬೇಡ", "hero.perk.langs": "12+ ಭಾರತೀಯ ಭಾಷೆಗಳು", "hero.perk.voice": "ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಮತ್ತು ಔಟ್‌ಪುಟ್",
  "features.heading": "ಐದು ಸಾಧನಗಳು. ಒಂದು Buddy.",
  "features.sub": "ಕಾಗದ ಕೆಲಸ, ಮೋಸ, ಅವಕಾಶಗಳು — ಎಲ್ಲವೂ ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ.",
  "who.heading": "ಪ್ರತಿ ಭಾರತೀಯನಿಗಾಗಿ.",
  "who.sub": "ಮೊದಲ ವಿದ್ಯಾರ್ಥಿವೇತನ ಅರ್ಜಿ ಇರಲಿ ಅಥವಾ ನೂರನೇ ತೆರಿಗೆ ರಿಟರ್ನ್ — Buddy ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡುತ್ತದೆ.",
  "how.heading": "ಹೇಗೆ ಕಾರ್ಯ ನಿರ್ವಹಿಸುತ್ತದೆ", "how.sub": "ಅಜ್ಜ-ಅಜ್ಜಿಗೆ ಸುಲಭ. ಎಲ್ಲರಿಗೂ ಶಕ್ತಿಶಾಲಿ.",
  "cta.heading": "ಕಾಗದ ಕೆಲಸವನ್ನು Buddy-ಗೆ ಬಿಡಿ.", "cta.sub": "ಸಾವಿರಾರು ಭಾರತೀಯರೊಂದಿಗೆ ಸೇರಿ.", "cta.button": "ನನ್ನ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆ",
  "aud.students": "ವಿದ್ಯಾರ್ಥಿಗಳು", "aud.jobSeekers": "ಉದ್ಯೋಗಾಕಾಂಕ್ಷಿಗಳು", "aud.parents": "ಪೋಷಕರು",
  "aud.firstNet": "ಮೊದಲ ಬಾರಿ ಇಂಟರ್ನೆಟ್ ಬಳಕೆದಾರರು", "aud.ruralUrban": "ಗ್ರಾಮೀಣ ಮತ್ತು ನಗರ ಭಾರತ",
  "step.1.title": "ಅಪ್‌ಲೋಡ್ ಅಥವಾ ಪೇಸ್ಟ್", "step.1.text": "ಯಾವುದೇ ಸ್ವರೂಪದಲ್ಲಿ ದಾಖಲೆ ಅಥವಾ ಅರ್ಜಿ ಹಂಚಿಕೊಳ್ಳಿ.",
  "step.2.title": "Buddy ಅರ್ಥಮಾಡಿಕೊಳ್ಳುತ್ತದೆ", "step.2.text": "ನಮ್ಮ AI ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ, ಭಾಷಾಂತರಿಸಿ ಮುಖ್ಯವಾದದ್ದನ್ನು ತೆಗೆಯುತ್ತದೆ.",
  "step.3.title": "ನೀವು ಕ್ರಮ ಕೈಗೊಳ್ಳಿ", "step.3.text": "ಸ್ಪಷ್ಟ ಸಾರಾಂಶ, ಮುಂದಿನ ಹಂತಗಳು — ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ.",
  "feat.docs": "ದಾಖಲೆ ವಿವರಣೆಗಾರ", "feat.forms": "ಸರ್ಕಾರಿ ಅರ್ಜಿ ಸಹಾಯಕ", "feat.scam": "Scam Shield",
  "feat.career": "ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶಿ", "feat.reminders": "ಸ್ಮಾರ್ಟ್ ರಿಮೈಂಡರ್",
  "side.overview": "ಅವಲೋಕನ", "side.documents": "ದಾಖಲೆಗಳು", "side.forms": "ಸರ್ಕಾರಿ ಅರ್ಜಿಗಳು",
  "side.scam": "Scam Shield", "side.women": "ಮಹಿಳಾ ಸುರಕ್ಷತೆ", "side.career": "ವೃತ್ತಿ",
  "side.reminders": "ರಿಮೈಂಡರ್‌ಗಳು", "side.analytics": "ವಿಶ್ಲೇಷಣೆ", "side.settings": "ಸೆಟ್ಟಿಂಗ್‌ಗಳು", "side.language": "ಭಾಷೆ",
  "dash.namaste": "ನಮಸ್ತೆ",
  "dash.welcomeNew": "Bharat Buddy AI-ಗೆ ಸ್ವಾಗತ! ಕೆಳಗಿನಿಂದ ಯಾವುದೇ ಸಾಧನವನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
  "dash.welcomeReturning": "ಇಂದು Buddy ಹೇಗೆ ಸಹಾಯ ಮಾಡಬೇಕು?",
  "dash.stats.docs": "ವಿವರಿಸಿದ ದಾಖಲೆಗಳು", "dash.stats.scams": "ಪರಿಶೀಲಿಸಿದ ಸಂದೇಶಗಳು", "dash.stats.upcoming": "ಮುಂಬರುವ ಗಡುವುಗಳು",
  "dash.stats.allTime": "ಎಲ್ಲಾ ಸಮಯ", "dash.stats.staySafe": "ಸುರಕ್ಷಿತವಾಗಿರಿ", "dash.stats.notDone": "ಇನ್ನೂ ಬಾಕಿ",
  "dash.quick": "ತ್ವರಿತ ಕ್ರಿಯೆಗಳು",
  "quick.docs.title": "ದಾಖಲೆ ವಿವರಿಸಿ", "quick.docs.desc": "PDF, ಚಿತ್ರ ಅಥವಾ ಸ್ಕ್ರೀನ್‌ಶಾಟ್",
  "quick.forms.title": "ಸರ್ಕಾರಿ ಅರ್ಜಿ ಭರ್ತಿ", "quick.forms.desc": "Aadhaar, PAN, PMAY ಮತ್ತು ಇನ್ನಷ್ಟು",
  "quick.scam.title": "ಸಂದೇಶ ಪರಿಶೀಲಿಸಿ", "quick.scam.desc": "SMS, WhatsApp, ಇಮೇಲ್",
  "quick.career.title": "ವೃತ್ತಿ ಯೋಜನೆ", "quick.career.desc": "ರೆಸ್ಯೂಮ್ ಅಪ್‌ಲೋಡ್",
  "quick.reminders.title": "ರಿಮೈಂಡರ್ ನೋಡಿ", "quick.reminders.desc": "ಗಡುವು ತಪ್ಪಿಸಬೇಡಿ",
  "footer.copy": "© {year} Bharat Buddy AI · ಭಾರತಕ್ಕಾಗಿ ಪ್ರೀತಿಯಿಂದ ತಯಾರಿಸಲಾಗಿದೆ",
  "toast.langSet": "ಭಾಷೆ ಸೆಟ್ ಆಗಿದೆ: {lang}", "toast.signedOut": "ಸೈನ್ ಔಟ್ ಆಗಿದ್ದೀರಿ",
};

const ml: Dict = {
  "nav.features": "സവിശേഷതകൾ", "nav.who": "ആർക്ക്", "nav.how": "എങ്ങനെ പ്രവർത്തിക്കുന്നു",
  "nav.signIn": "സൈൻ ഇൻ", "nav.getStarted": "ആരംഭിക്കുക", "nav.signOut": "സൈൻ ഔട്ട്",
  "nav.openDashboard": "ഡാഷ്‌ബോർഡ് തുറക്കുക", "nav.backHome": "ഹോമിലേക്ക് മടങ്ങുക",
  "hero.badge": "ഇന്ത്യയിൽ നിർമ്മിച്ചത് · എല്ലാ ഇന്ത്യക്കാർക്കും",
  "hero.title1": "നിങ്ങളുടെ ദൈനംദിന AI", "hero.title2": "സഹായി", "hero.title3": "ഇന്ത്യൻ ജീവിതത്തിന്",
  "hero.subtitle": "ഏത് രേഖയും മനസ്സിലാക്കുക, സർക്കാർ ഫോമുകൾ പൂരിപ്പിക്കുക, തട്ടിപ്പ് കണ്ടെത്തുക — നിങ്ങളുടെ ഭാഷയിൽ.",
  "hero.cta.try": "Bharat Buddy സൗജന്യമായി പരീക്ഷിക്കുക", "hero.cta.see": "എന്തു ചെയ്യാമെന്ന് കാണുക",
  "hero.perk.noCard": "ക്രെഡിറ്റ് കാർഡ് ആവശ്യമില്ല", "hero.perk.langs": "12+ ഇന്ത്യൻ ഭാഷകൾ", "hero.perk.voice": "ശബ്ദ ഇൻപുട്ടും ഔട്ട്പുട്ടും",
  "features.heading": "അഞ്ച് ഉപകരണങ്ങൾ. ഒരു Buddy.",
  "features.sub": "കടലാസ് ജോലി, തട്ടിപ്പ്, അവസരങ്ങൾ — എല്ലാം ഒരിടത്ത്.",
  "who.heading": "എല്ലാ ഇന്ത്യക്കാർക്കും.",
  "who.sub": "ആദ്യ സ്കോളർഷിപ്പ് ഫോമോ നൂറാമത്തെ ടാക്സ് റിട്ടേണോ — Buddy നിങ്ങളുടെ ഭാഷയിൽ സംസാരിക്കും.",
  "how.heading": "എങ്ങനെ പ്രവർത്തിക്കുന്നു", "how.sub": "മുത്തശ്ശിമാർക്ക് എളുപ്പം. എല്ലാവർക്കും ശക്തം.",
  "cta.heading": "കടലാസ് ജോലി Buddy-ക്ക് വിടുക.", "cta.sub": "ആയിരക്കണക്കിന് ഇന്ത്യക്കാരോടൊപ്പം ചേരുക.", "cta.button": "എന്റെ ഡാഷ്‌ബോർഡ് തുറക്കുക",
  "aud.students": "വിദ്യാർത്ഥികൾ", "aud.jobSeekers": "ജോലി തേടുന്നവർ", "aud.parents": "മാതാപിതാക്കൾ",
  "aud.firstNet": "ആദ്യ ഇന്റർനെറ്റ് ഉപയോക്താക്കൾ", "aud.ruralUrban": "ഗ്രാമീണ & നഗര ഇന്ത്യ",
  "step.1.title": "അപ്‌ലോഡ് അല്ലെങ്കിൽ പേസ്റ്റ്", "step.1.text": "ഏത് ഫോർമാറ്റിലും രേഖ അല്ലെങ്കിൽ ഫോം പങ്കിടുക.",
  "step.2.title": "Buddy മനസ്സിലാക്കുന്നു", "step.2.text": "ഞങ്ങളുടെ AI ശ്രദ്ധയോടെ വായിച്ച്, വിവർത്തനം ചെയ്ത്, പ്രധാനപ്പെട്ടത് എടുക്കും.",
  "step.3.title": "നിങ്ങൾ നടപടി എടുക്കുക", "step.3.text": "വ്യക്തമായ സംഗ്രഹം, അടുത്ത നടപടികൾ — നിങ്ങളുടെ ഭാഷയിൽ.",
  "feat.docs": "ഡോക്യുമെന്റ് വിശദീകരണം", "feat.forms": "സർക്കാർ ഫോം സഹായി", "feat.scam": "Scam Shield",
  "feat.career": "കരിയർ ഗൈഡ്", "feat.reminders": "സ്മാർട്ട് റിമൈൻഡർ",
  "side.overview": "അവലോകനം", "side.documents": "രേഖകൾ", "side.forms": "സർക്കാർ ഫോമുകൾ",
  "side.scam": "Scam Shield", "side.women": "സ്ത്രീ സുരക്ഷ", "side.career": "കരിയർ",
  "side.reminders": "റിമൈൻഡറുകൾ", "side.analytics": "വിശകലനം", "side.settings": "ക്രമീകരണങ്ങൾ", "side.language": "ഭാഷ",
  "dash.namaste": "നമസ്തേ",
  "dash.welcomeNew": "Bharat Buddy AI-ലേക്ക് സ്വാഗതം! താഴെ നിന്ന് ഏതെങ്കിലും ഉപകരണം തിരഞ്ഞെടുക്കുക.",
  "dash.welcomeReturning": "ഇന്ന് Buddy എങ്ങനെ സഹായിക്കണം?",
  "dash.stats.docs": "വിശദീകരിച്ച രേഖകൾ", "dash.stats.scams": "പരിശോധിച്ച സന്ദേശങ്ങൾ", "dash.stats.upcoming": "വരാനിരിക്കുന്ന അവസാന തീയതികൾ",
  "dash.stats.allTime": "എല്ലാ കാലത്തും", "dash.stats.staySafe": "സുരക്ഷിതരായിരിക്കുക", "dash.stats.notDone": "ഇനിയും ബാക്കി",
  "dash.quick": "ദ്രുത പ്രവർത്തനങ്ങൾ",
  "quick.docs.title": "രേഖ വിശദീകരിക്കുക", "quick.docs.desc": "PDF, ചിത്രം അല്ലെങ്കിൽ സ്ക്രീൻഷോട്ട്",
  "quick.forms.title": "സർക്കാർ ഫോം പൂരിപ്പിക്കുക", "quick.forms.desc": "Aadhaar, PAN, PMAY എന്നിവ",
  "quick.scam.title": "സന്ദേശം പരിശോധിക്കുക", "quick.scam.desc": "SMS, WhatsApp, ഇമെയിൽ",
  "quick.career.title": "കരിയർ പ്ലാൻ", "quick.career.desc": "റെസ്യൂമെ അപ്‌ലോഡ്",
  "quick.reminders.title": "റിമൈൻഡറുകൾ കാണുക", "quick.reminders.desc": "അവസാന തീയതി നഷ്ടപ്പെടരുത്",
  "footer.copy": "© {year} Bharat Buddy AI · ഇന്ത്യയ്ക്കായി സ്നേഹത്തോടെ നിർമ്മിച്ചത്",
  "toast.langSet": "ഭാഷ സജ്ജമാക്കി: {lang}", "toast.signedOut": "സൈൻ ഔട്ട് ചെയ്തു",
};

const DICTS: Record<LangCode, Dict> = { en, hi, ta, bn, te, mr, gu, pa, kn, ml };

// ---- Context ----
type Ctx = {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "bb-lang";

function interpolate(s: string, vars?: Record<string, string | number>) {
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as LangCode | null;
      if (stored && DICTS[stored]) setLangState(stored);
    } catch {}
  }, []);

  const setLang = useCallback((l: LangCode) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {}
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const dict = DICTS[lang] ?? en;
      const val = dict[key] ?? en[key] ?? key;
      return interpolate(val, vars);
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Safe fallback for SSR / tests — returns English.
    return {
      lang: "en" as LangCode,
      setLang: () => {},
      t: (key: string, vars?: Record<string, string | number>) => interpolate(en[key] ?? key, vars),
    };
  }
  return ctx;
}
