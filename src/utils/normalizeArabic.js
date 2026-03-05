export function normalizeArabic(text) {
  if (!text) return "";
  return text
    .replace(/[\u064B-\u065F\u0670]/g, '') // Remove diacritics
    .replace(/[أإآ]/g, 'ا') // Normalize Alef
    .replace(/ة/g, 'ه') // Normalize Teh Marbuta to Heh
    .replace(/ى/g, 'ي') // Normalize Alef Maksura to Yeh
    .replace(/ؤ/g, 'و') // Normalize Waw with Hamza
    .replace(/ئ/g, 'ي') // Normalize Yeh with Hamza
    .trim()
    .replace(/\s+/g, ' '); // Remove extra spaces
}

export function compareAnswers(userAnswer, correctAnswer) {
  const normUser = normalizeArabic(userAnswer);
  const normCorrect = normalizeArabic(correctAnswer);
  
  if (normUser === normCorrect) return true;
  
  // Handle optional "ال"
  if (normUser === 'ال' + normCorrect || 'ال' + normUser === normCorrect) return true;
  
  // Handle two-word answers where user types one word (e.g. "عبد الله" vs "عبدالله")
  if (normUser.replace(/\s/g, '') === normCorrect.replace(/\s/g, '')) return true;

  return false;
}
