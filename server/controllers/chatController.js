import { storageService } from '../services/storageService.js';
import { findFaqMatch } from '../services/chatbotService.js';

export async function sendMessage(req, res) {
  try {
    const { message, userId, userName } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a non-empty question.',
      });
    }

    // Retrieve knowledge base FAQs
    const faqs = await storageService.getAllFaqs();

    // Execute matching algorithm
    const matchResult = findFaqMatch(message, faqs);

    // Save chat interaction
    const savedEntry = await storageService.saveChatMessage({
      userId: userId || 'usr_guest',
      userName: userName || 'Student',
      message: message.trim(),
      response: matchResult.answer,
      category: matchResult.matchedFaq?.category || 'General',
      confidence: matchResult.confidence || 0,
    });

    return res.json({
      success: true,
      answer: matchResult.answer,
      matchedFaq: matchResult.matchedFaq,
      confidence: matchResult.confidence,
      suggestedTopics: matchResult.suggestedTopics,
      timestamp: savedEntry.timestamp,
      id: savedEntry._id,
    });
  } catch (err) {
    console.error('Chat error:', err);
    return res.status(500).json({
      success: false,
      message: 'Unable to process question at this time. Please try again.',
      answer: 'Our assistant service is temporarily experiencing an issue. Please try again shortly.',
    });
  }
}

export async function getHistory(req, res) {
  try {
    const userId = req.query.userId || (req.user && req.user.id);
    const history = await storageService.getChatHistory(userId);
    return res.json({
      success: true,
      history,
    });
  } catch (err) {
    console.error('Get history error:', err);
    return res.status(500).json({ success: false, message: 'Could not fetch chat history.' });
  }
}

export async function clearHistory(req, res) {
  try {
    const userId = req.body.userId || req.query.userId || (req.user && req.user.id);
    await storageService.clearChatHistory(userId);
    return res.json({
      success: true,
      message: 'Chat history cleared successfully.',
    });
  } catch (err) {
    console.error('Clear history error:', err);
    return res.status(500).json({ success: false, message: 'Could not clear chat history.' });
  }
}
