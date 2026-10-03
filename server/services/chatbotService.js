/**
 * Chatbot Intelligence and Knowledge-base Matching Service
 * Supports keyword scoring, phrase matching, and fallback handling.
 * Designed so external LLM APIs (Gemini/OpenAI) can be plugged in easily.
 */

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'about', 'against',
  'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
  'can', 'could', 'will', 'would', 'shall', 'should', 'may', 'might', 'must',
  'i', 'me', 'my', 'myself', 'we', 'our', 'you', 'your', 'he', 'him', 'she',
  'her', 'it', 'its', 'they', 'them', 'what', 'which', 'who', 'whom', 'this',
  'that', 'these', 'those', 'am', 'do', 'does', 'did', 'having', 'please', 'tell'
]);

function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOP_WORDS.has(token));
}

export function findFaqMatch(query, faqsList) {
  if (!query || typeof query !== 'string' || !query.trim()) {
    return {
      success: false,
      answer: "Please ask a question regarding college timings, exams, fees, library, departments, or facilities.",
      matchedFaq: null,
      confidence: 0
    };
  }

  const cleanQuery = query.toLowerCase().trim();
  const queryTokens = tokenize(query);

  let bestMatch = null;
  let highestScore = 0;

  for (const faq of faqsList) {
    let score = 0;
    const faqQuestionClean = faq.question.toLowerCase();
    const faqTokens = tokenize(faq.question);
    const keywords = (faq.keywords || []).map(k => k.toLowerCase());

    // 1. Direct whole-phrase or question match
    if (faqQuestionClean.includes(cleanQuery) || cleanQuery.includes(faqQuestionClean)) {
      score += 40;
    }

    // 2. Keyword exact phrase matches
    for (const kw of keywords) {
      if (cleanQuery.includes(kw)) {
        score += 25;
      } else {
        // partial token match within keyword
        const kwTokens = tokenize(kw);
        for (const kwToken of kwTokens) {
          if (queryTokens.includes(kwToken)) {
            score += 8;
          }
        }
      }
    }

    // 3. Question tokens overlap
    for (const qToken of queryTokens) {
      if (faqTokens.includes(qToken)) {
        score += 6;
      }
    }

    // 4. Category relevance
    if (faq.category && cleanQuery.includes(faq.category.toLowerCase())) {
      score += 10;
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = faq;
    }
  }

  // Minimum threshold to avoid false positives
  const THRESHOLD = 12;

  if (bestMatch && highestScore >= THRESHOLD) {
    return {
      success: true,
      answer: bestMatch.answer,
      matchedFaq: {
        _id: bestMatch._id,
        question: bestMatch.question,
        category: bestMatch.category
      },
      confidence: Math.min(100, Math.round(highestScore * 2.5))
    };
  }

  return {
    success: false,
    answer: "I don't have that information yet. Please contact the college administration or try another question.",
    matchedFaq: null,
    confidence: 0,
    suggestedTopics: [
      "College timings",
      "Library timings & location",
      "Semester examinations",
      "CSE Department HOD",
      "Tuition fees payment",
      "Hostel facilities"
    ]
  };
}
