import React, { useState } from "react";
import axios from "axios";
import { Star, Send, CheckCircle } from "lucide-react";

const FeedbackPanel = ({ API, concept, prediction, onClose }) => {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    try {
      await axios.post(`${API}/feedback`, {
        concept,
        prediction,
        rating,
        comments: comments || null
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Feedback error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mt-4 bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3" data-testid="feedback-success">
        <CheckCircle size={20} className="text-emerald-400" />
        <span className="text-emerald-300 text-sm">Thank you for your feedback! It helps improve our predictions.</span>
      </div>
    );
  }

  return (
    <div className="mt-4 bg-[#111827]/80 rounded-2xl border border-slate-800/40 p-5" data-testid="feedback-panel">
      <h3 className="text-white font-bold text-sm mb-3">Rate This Prediction</h3>
      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className="transition-all hover:scale-110"
            data-testid={`star-${star}`}
          >
            <Star
              size={24}
              className={star <= rating ? "text-amber-400 fill-amber-400" : "text-slate-600"}
            />
          </button>
        ))}
        {rating > 0 && <span className="text-slate-400 text-xs ml-2">{rating}/5</span>}
      </div>
      <textarea
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        placeholder="Optional: Share your thoughts on this prediction..."
        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg p-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none h-20"
        data-testid="feedback-comments"
      />
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleSubmit}
          disabled={rating === 0 || submitting}
          className="bg-amber-500/90 hover:bg-amber-500 text-black font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 disabled:opacity-40 transition-all"
          data-testid="submit-feedback"
        >
          <Send size={13} /> {submitting ? "Sending..." : "Submit"}
        </button>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-300 px-4 py-2 text-sm transition-all"
        >
          Skip
        </button>
      </div>
    </div>
  );
};

export default FeedbackPanel;
