import { storageService } from '../services/storageService.js';

export async function getFaqs(req, res) {
  try {
    const { search = '', category = '' } = req.query;
    const faqs = await storageService.getAllFaqs({ search, category });
    return res.json({
      success: true,
      count: faqs.length,
      faqs,
    });
  } catch (err) {
    console.error('Get FAQs error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve FAQs.' });
  }
}

export async function createFaq(req, res) {
  try {
    const { question, answer, category, keywords } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ success: false, message: 'Question and Answer are required.' });
    }

    const newFaq = await storageService.createFaq({
      question: question.trim(),
      answer: answer.trim(),
      category: category || 'General',
      keywords: keywords || [],
    });

    return res.status(201).json({
      success: true,
      message: 'FAQ created successfully.',
      faq: newFaq,
    });
  } catch (err) {
    console.error('Create FAQ error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create FAQ.' });
  }
}

export async function updateFaq(req, res) {
  try {
    const { id } = req.params;
    const { question, answer, category, keywords } = req.body;

    const updated = await storageService.updateFaq(id, {
      question: question?.trim(),
      answer: answer?.trim(),
      category,
      keywords,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'FAQ not found.' });
    }

    return res.json({
      success: true,
      message: 'FAQ updated successfully.',
      faq: updated,
    });
  } catch (err) {
    console.error('Update FAQ error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update FAQ.' });
  }
}

export async function deleteFaq(req, res) {
  try {
    const { id } = req.params;
    const deleted = await storageService.deleteFaq(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'FAQ not found or already deleted.' });
    }

    return res.json({
      success: true,
      message: 'FAQ deleted successfully.',
    });
  } catch (err) {
    console.error('Delete FAQ error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete FAQ.' });
  }
}
