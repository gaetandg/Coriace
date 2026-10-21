import { useState } from 'react';
import { Star } from 'lucide-react';
import { MAX_MESSAGE, canSend, sendFeedback } from '../lib/feedback';
import { track } from '../lib/analytics';

interface FeedbackSheetProps {
  sessions: number; // completed sessions so far
  notify: (message: string) => void;
  onClose: () => void;
}

// Bottom sheet "Ton avis": an optional mark and a few words, read by the person who makes the app.
// Nothing here leads to the Play Store.
export function FeedbackSheet({ sessions, notify, onClose }: FeedbackSheetProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const send = async () => {
    setSending(true);
    if (await sendFeedback({ rating, message, sessions })) {
      track('avis-envoye', rating ? { note: rating } : undefined);
      notify('Merci, c\'est bien reçu.');
      onClose();
    } else {
      // The text stays in the sheet, to try again.
      notify('L\'envoi n\'a pas abouti. Vérifie ta connexion et réessaie.');
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
        className="w-full max-w-md bg-cream text-ink rounded-t-3xl px-6 pt-6 pb-8 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1">
          <h2 id="feedback-title" className="font-display font-extrabold text-[30px] leading-tight">Ton avis</h2>
          <p className="text-[15px] leading-snug">Ce qui te plaît, ce qui manque, ce qui coince : tout est lu, et sert à améliorer Coriace.</p>
        </div>

        <fieldset className="flex flex-col gap-1.5">
          <legend className="text-sm font-semibold text-clay mb-1.5">Ta note, si tu veux</legend>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(value => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(rating === value ? null : value)}
                aria-label={`${value} sur 5`}
                aria-pressed={rating === value}
                className="w-11 h-11 flex items-center justify-center cursor-pointer"
              >
                <Star className={`w-8 h-8 ${rating !== null && value <= rating ? 'fill-brick text-brick' : 'text-clay'}`} aria-hidden="true" />
              </button>
            ))}
          </div>
        </fieldset>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-clay">Ton message</span>
          <textarea
            id="feedback-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={MAX_MESSAGE}
            rows={4}
            placeholder="Une séance trop dure, un exercice qui manque, un bug…"
            className="rounded-[14px] border-[1.5px] border-ink/30 bg-white/60 px-3.5 py-3 text-base leading-snug placeholder:text-clay/70 resize-none"
          />
        </label>
        <p className="text-[13px] text-clay leading-snug -mt-2">Envoyé sans ton nom ni ton compte. N'y mets rien de personnel.</p>

        <div className="flex flex-col gap-2.5">
          <button
            id="btn-feedback-send"
            onClick={send}
            disabled={!canSend({ rating, message }) || sending}
            className="h-14 rounded-[18px] bg-ink text-cream font-semibold text-base cursor-pointer disabled:opacity-50 disabled:cursor-default"
          >
            {sending ? 'Envoi…' : 'Envoyer'}
          </button>
          <button onClick={onClose} className="h-12 font-semibold underline underline-offset-4 cursor-pointer">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

// At the end of a session, once: an invitation to say what works and what doesn't.
export function FeedbackCard({ onOpen, onLater }: { onOpen: () => void; onLater: () => void }) {
  return (
    <div id="card-feedback" className="relative bg-cream text-ink rounded-[18px] px-4 py-3.5 flex flex-col gap-2.5">
      <div className="flex flex-col gap-0.5">
        <span className="font-display font-bold text-lg leading-tight">Ton avis compte</span>
        <span className="text-[15px] text-clay leading-snug">Ce qui te plaît, ce qui manque, ce qui coince : dis-le, tout est lu.</span>
      </div>
      <button onClick={onOpen} className="h-12 rounded-[14px] bg-ink text-cream font-semibold text-[15px] cursor-pointer">
        Donner ton avis
      </button>
      <button onClick={onLater} className="self-start h-11 font-semibold underline underline-offset-4 cursor-pointer">
        Pas maintenant
      </button>
    </div>
  );
}
