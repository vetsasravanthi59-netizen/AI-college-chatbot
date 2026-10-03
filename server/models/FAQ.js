import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, 'Answer is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      default: 'General',
      trim: true,
    },
    keywords: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const FAQ = mongoose.models.FAQ || mongoose.model('FAQ', faqSchema);
