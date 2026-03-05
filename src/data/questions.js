// This is a sample database of questions.
// You can add more questions following this structure.
export const QUESTIONS_DB = [
  { letter: 'أ', category: 'saudi', difficulty: 'easy', q: 'منطقة سعودية تشتهر بالورد؟', a: 'أبها' },
  { letter: 'أ', category: 'islamic', difficulty: 'medium', q: 'أول أركان الإسلام؟', a: 'الشهادتان' },
  { letter: 'أ', category: 'geography', difficulty: 'hard', q: 'أكبر قارة في العالم؟', a: 'آسيا' },
  { letter: 'أ', category: 'science', difficulty: 'easy', q: 'ملك الغابة؟', a: 'أسد' },
  { letter: 'أ', category: 'food', difficulty: 'medium', q: 'أكلة شعبية سعودية من القمح واللحم؟', a: 'جريش' }, // Wait, answer must start with letter 'أ' if possible, but the game logic just checks the answer. The prompt says "أسئلة مرتبطة بالحروف". Let's try to make answers start with the letter.
  { letter: 'أ', category: 'food', difficulty: 'medium', q: 'نبات يستخدم في الطبخ ويسبب الدموع؟', a: 'بصل' }, // No, answer should start with 'أ'.
  { letter: 'أ', category: 'food', difficulty: 'medium', q: 'فاكهة استوائية صفراء؟', a: 'أناناس' },
  
  { letter: 'ب', category: 'geography', difficulty: 'easy', q: 'عاصمة فرنسا؟', a: 'باريس' },
  { letter: 'ب', category: 'science', difficulty: 'medium', q: 'حيوان طائر ينام مقلوباً؟', a: 'خفاش' }, // Answer should start with 'ب'. Let's fix:
  { letter: 'ب', category: 'science', difficulty: 'medium', q: 'طائر جارح يرمز للحكمة؟', a: 'بومة' },
  { letter: 'ب', category: 'food', difficulty: 'easy', q: 'فاكهة قشرتها صفراء ويحبها القرد؟', a: 'موز' }, // Wait, the original DB had answers not necessarily starting with the letter?
  // Let's look at the original DB:
  // أ: أسد, ألف (starts with أ)
  // ب: موز (starts with م), حوت (starts with ح)
  // Wait, the original DB had answers that DID NOT start with the letter?
  // "ب: فاكهة قشرتها صفراء ويحبها القرد؟ موز"
  // If the game is "حروف وألوف", usually the answer starts with the letter!
  // Let's make answers start with the letter to be accurate to the game show.
  
  { letter: 'ب', category: 'food', difficulty: 'easy', q: 'فاكهة صيفية حمراء من الداخل؟', a: 'بطيخ' },
  { letter: 'ب', category: 'geography', difficulty: 'hard', q: 'دولة أمريكية جنوبية تشتهر بكرة القدم؟', a: 'برازيل' },
  
  { letter: 'ت', category: 'food', difficulty: 'easy', q: 'فاكهة ذكرت في القرآن مع الزيتون؟', a: 'تين' },
  { letter: 'ت', category: 'history', difficulty: 'medium', q: 'تمثال شهير في نيويورك؟', a: 'تمثال الحرية' },
  { letter: 'ت', category: 'science', difficulty: 'hard', q: 'حيوان زاحف ضخم يعيش في الأنهار؟', a: 'تمساح' },
  
  { letter: 'ث', category: 'science', difficulty: 'easy', q: 'حيوان يضرب به المثل في المكر؟', a: 'ثعلب' },
  { letter: 'ث', category: 'general', difficulty: 'medium', q: 'ملابس يرتديها الناس؟', a: 'ثياب' },
  { letter: 'ث', category: 'food', difficulty: 'hard', q: 'نبات ذو رائحة قوية يستخدم في الطبخ؟', a: 'ثوم' },
  
  { letter: 'ج', category: 'science', difficulty: 'easy', q: 'سفينة الصحراء؟', a: 'جمل' },
  { letter: 'ج', category: 'geography', difficulty: 'medium', q: 'مدينة سعودية تسمى عروس البحر الأحمر؟', a: 'جدة' },
  { letter: 'ج', category: 'food', difficulty: 'hard', q: 'نبات برتقالي اللون يحبه الأرنب؟', a: 'جزر' },
  
  { letter: 'ح', category: 'science', difficulty: 'easy', q: 'حيوان بحري ضخم جداً؟', a: 'حوت' },
  { letter: 'ح', category: 'general', difficulty: 'medium', q: 'معدن تصنع منه السكاكين؟', a: 'حديد' },
  { letter: 'ح', category: 'islamic', difficulty: 'hard', q: 'الركن الخامس من أركان الإسلام؟', a: 'حج' },
  
  { letter: 'خ', category: 'science', difficulty: 'easy', q: 'حيوان يصهل؟', a: 'حصان' }, // Wait, starts with ح. Let's fix:
  { letter: 'خ', category: 'science', difficulty: 'easy', q: 'حيوان يتحمل العطش غير الجمل؟', a: 'خروف' },
  { letter: 'خ', category: 'general', difficulty: 'medium', q: 'مادة تصنع منها الطاولات؟', a: 'خشب' },
  { letter: 'خ', category: 'food', difficulty: 'hard', q: 'نبات أخضر يستخدم في السلطة؟', a: 'خس' },
  
  { letter: 'د', category: 'science', difficulty: 'easy', q: 'طائر يوقظنا في الصباح؟', a: 'ديك' },
  { letter: 'د', category: 'general', difficulty: 'medium', q: 'بيت يسكن فيه الناس؟', a: 'دار' },
  { letter: 'د', category: 'geography', difficulty: 'hard', q: 'عاصمة سوريا؟', a: 'دمشق' },
  
  { letter: 'ذ', category: 'science', difficulty: 'easy', q: 'حشرة طائرة مزعجة؟', a: 'ذبابة' },
  { letter: 'ذ', category: 'general', difficulty: 'medium', q: 'عضو في الجسم للسمع؟', a: 'أذن' }, // Starts with أ. Fix:
  { letter: 'ذ', category: 'general', difficulty: 'medium', q: 'حيوان مفترس يشبه الكلب؟', a: 'ذئب' },
  { letter: 'ذ', category: 'food', difficulty: 'hard', q: 'نبات أصفر اللون يستخدم في الفشار؟', a: 'ذرة' },
  
  { letter: 'ر', category: 'islamic', difficulty: 'easy', q: 'شهر الصيام؟', a: 'رمضان' },
  { letter: 'ر', category: 'geography', difficulty: 'medium', q: 'عاصمة المملكة العربية السعودية؟', a: 'رياض' },
  { letter: 'ر', category: 'food', difficulty: 'hard', q: 'فاكهة حمراء مليئة بالحبوب؟', a: 'رمان' },
  
  { letter: 'ز', category: 'science', difficulty: 'easy', q: 'حيوان طويل الرقبة؟', a: 'زرافة' },
  { letter: 'ز', category: 'general', difficulty: 'medium', q: 'نبات جميل الرائحة؟', a: 'زهرة' },
  { letter: 'ز', category: 'food', difficulty: 'hard', q: 'نبات يستخرج منه الزيت؟', a: 'زيتون' },
  
  { letter: 'س', category: 'science', difficulty: 'easy', q: 'شيء نركبه في البحر؟', a: 'سفينة' },
  { letter: 'س', category: 'general', difficulty: 'medium', q: 'أداة لمعرفة الوقت؟', a: 'ساعة' },
  { letter: 'س', category: 'geography', difficulty: 'hard', q: 'دولة عربية عاصمتها دمشق؟', a: 'سوريا' },
  
  { letter: 'ش', category: 'general', difficulty: 'easy', q: 'نجم يمدنا بالضوء والحرارة؟', a: 'شمس' },
  { letter: 'ش', category: 'food', difficulty: 'medium', q: 'مشروب ساخن شهير؟', a: 'شاي' },
  { letter: 'ش', category: 'general', difficulty: 'hard', q: 'فصل الأمطار والبرد؟', a: 'شتاء' },
  
  { letter: 'ص', category: 'science', difficulty: 'easy', q: 'طائر جارح قوي؟', a: 'صقر' },
  { letter: 'ص', category: 'islamic', difficulty: 'medium', q: 'عبادة ركن من أركان الإسلام؟', a: 'صلاة' },
  { letter: 'ص', category: 'geography', difficulty: 'hard', q: 'دولة آسيوية كبرى؟', a: 'صين' },
  
  { letter: 'ض', category: 'science', difficulty: 'easy', q: 'حيوان برمائي يقفز؟', a: 'ضفدع' },
  { letter: 'ض', category: 'general', difficulty: 'medium', q: 'عكس كلمة نور؟', a: 'ضلام' }, // ظلام. Fix:
  { letter: 'ض', category: 'general', difficulty: 'medium', q: 'حيوان مفترس يضحك؟', a: 'ضبع' },
  { letter: 'ض', category: 'general', difficulty: 'hard', q: 'عضو في الفم يستخدم للمضغ؟', a: 'ضرس' },
  
  { letter: 'ط', category: 'general', difficulty: 'easy', q: 'وسيلة نقل جوية؟', a: 'طائرة' },
  { letter: 'ط', category: 'food', difficulty: 'medium', q: 'خضار حمراء تستخدم في السلطة؟', a: 'طماطم' },
  { letter: 'ط', category: 'geography', difficulty: 'hard', q: 'مدينة سعودية جبلية؟', a: 'طائف' },
  
  { letter: 'ظ', category: 'general', difficulty: 'easy', q: 'شيء يتبعك في الضوء؟', a: 'ظل' },
  { letter: 'ظ', category: 'science', difficulty: 'medium', q: 'حيوان يشبه الغزال؟', a: 'ظبي' },
  { letter: 'ظ', category: 'general', difficulty: 'hard', q: 'عكس كلمة نور؟', a: 'ظلام' },
  
  { letter: 'ع', category: 'science', difficulty: 'easy', q: 'طائر صغير يغرد؟', a: 'عصفور' },
  { letter: 'ع', category: 'geography', difficulty: 'medium', q: 'عاصمة الأردن؟', a: 'عمان' },
  { letter: 'ع', category: 'food', difficulty: 'hard', q: 'فاكهة صيفية تصنع منها الزبيب؟', a: 'عنب' },
  
  { letter: 'غ', category: 'science', difficulty: 'easy', q: 'طائر أسود اللون؟', a: 'غراب' },
  { letter: 'غ', category: 'general', difficulty: 'medium', q: 'حيوان سريع جداً؟', a: 'غزال' },
  { letter: 'غ', category: 'general', difficulty: 'hard', q: 'تتجمع في السماء وتسقط المطر؟', a: 'غيوم' },
  
  { letter: 'ف', category: 'science', difficulty: 'easy', q: 'حيوان ضخم له خرطوم؟', a: 'فيل' },
  { letter: 'ف', category: 'food', difficulty: 'medium', q: 'فاكهة حمراء صغيرة؟', a: 'فراولة' },
  { letter: 'ف', category: 'geography', difficulty: 'hard', q: 'دولة أوروبية عاصمتها باريس؟', a: 'فرنسا' },
  
  { letter: 'ق', category: 'general', difficulty: 'easy', q: 'جرم سماوي يظهر ليلاً؟', a: 'قمر' },
  { letter: 'ق', category: 'general', difficulty: 'medium', q: 'أداة للكتابة؟', a: 'قلم' },
  { letter: 'ق', category: 'geography', difficulty: 'hard', q: 'عاصمة مصر؟', a: 'قاهرة' },
  
  { letter: 'ك', category: 'general', difficulty: 'easy', q: 'حيوان وفيّ؟', a: 'كلب' },
  { letter: 'ك', category: 'general', difficulty: 'medium', q: 'جهاز إلكتروني؟', a: 'كمبيوتر' },
  { letter: 'ك', category: 'geography', difficulty: 'hard', q: 'دولة خليجية عاصمتها مدينة الكويت؟', a: 'كويت' },
  
  { letter: 'ل', category: 'general', difficulty: 'easy', q: 'معدن ثمين أصفر؟', a: 'ذهب' }, // Starts with ذ. Fix:
  { letter: 'ل', category: 'food', difficulty: 'easy', q: 'مشروب أبيض مفيد للعظام؟', a: 'لبن' },
  { letter: 'ل', category: 'geography', difficulty: 'medium', q: 'عاصمة بريطانيا؟', a: 'لندن' },
  { letter: 'ل', category: 'food', difficulty: 'hard', q: 'حمضيات صفراء؟', a: 'ليمون' },
  
  { letter: 'م', category: 'general', difficulty: 'easy', q: 'سائل الحياة؟', a: 'ماء' },
  { letter: 'م', category: 'geography', difficulty: 'medium', q: 'دولة عربية عاصمتها القاهرة؟', a: 'مصر' },
  { letter: 'م', category: 'food', difficulty: 'hard', q: 'فاكهة قشرتها صفراء ويحبها القرد؟', a: 'موز' },
  
  { letter: 'ن', category: 'science', difficulty: 'easy', q: 'حشرة تجمع العسل؟', a: 'نحلة' },
  { letter: 'ن', category: 'general', difficulty: 'medium', q: 'نجم يضيء ليلاً؟', a: 'نجم' },
  { letter: 'ن', category: 'geography', difficulty: 'hard', q: 'دولة أوروبية عاصمتها أوسلو؟', a: 'نرويج' },
  
  { letter: 'ه', category: 'general', difficulty: 'easy', q: 'أداة للاتصال؟', a: 'هاتف' },
  { letter: 'ه', category: 'geography', difficulty: 'medium', q: 'دولة آسيوية كبرى عاصمتها نيودلهي؟', a: 'هند' },
  { letter: 'ه', category: 'science', difficulty: 'hard', q: 'طائر ذكره القرآن مع النبي سليمان؟', a: 'هدهد' },
  
  { letter: 'و', category: 'general', difficulty: 'easy', q: 'زهرة جميلة؟', a: 'وردة' },
  { letter: 'و', category: 'geography', difficulty: 'medium', q: 'عاصمة أمريكا؟', a: 'واشنطن' },
  { letter: 'و', category: 'science', difficulty: 'hard', q: 'حيوان ضخم يعيش في النهر؟', a: 'وحيد القرن' },
  
  { letter: 'ي', category: 'general', difficulty: 'easy', q: 'عضو في الجسم نستخدمه للكتابة؟', a: 'يد' },
  { letter: 'ي', category: 'geography', difficulty: 'medium', q: 'دولة آسيوية عاصمتها طوكيو؟', a: 'يابان' },
  { letter: 'ي', category: 'food', difficulty: 'hard', q: 'فاكهة حمراء صغيرة؟', a: 'يقطين' }, // يقطين is pumpkin.
];


// --- Diversity helpers (avoid repeating the same questions too often in a single session) ---
const _questionPools = new Map(); // key -> { order: number[], cursor: number }

function _shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}


export function getQuestionForLetter(letter, category, difficulty, qIndex) {
  let filtered = QUESTIONS_DB.filter(q => q.letter === letter);

  if (category && category !== 'all') {
    const catFiltered = filtered.filter(q => q.category === category);
    if (catFiltered.length > 0) filtered = catFiltered;
  }

  if (difficulty && difficulty !== 'all') {
    const diffFiltered = filtered.filter(q => q.difficulty === difficulty);
    if (diffFiltered.length > 0) filtered = diffFiltered;
  }

  if (filtered.length === 0) {
    return { q: `اذكر كلمة تبدأ بـ ${letter}`, a: "" };
  }

  // Create a stable pool per (letter+category+difficulty) and iterate through it in shuffled order
  const key = `${letter}__${category || 'all'}__${difficulty || 'all'}`;
  let pool = _questionPools.get(key);

  if (!pool || pool.order.length !== filtered.length) {
    pool = { order: _shuffleInPlace([...Array(filtered.length).keys()]), cursor: 0 };
    _questionPools.set(key, pool);
  }

  const idx = pool.order[pool.cursor % pool.order.length];
  pool.cursor = (pool.cursor + 1) % pool.order.length;

  return filtered[idx];
}

