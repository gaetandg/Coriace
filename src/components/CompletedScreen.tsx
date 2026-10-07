interface CompletedScreenProps {
  durationMinutes: number;
  onRestart: () => void;
}

export function CompletedScreen({ durationMinutes, onRestart }: CompletedScreenProps) {
  return (
    <div id="panel-completed" className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-10 shadow-2xl text-center space-y-6 max-w-xl mx-auto animate-fade-in text-white font-sans">
      <div className="w-16 h-16 bg-[#FF6321]/15 text-[#FF6321] border border-[#FF6321]/20 rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">
        🏆
      </div>

      <div className="space-y-3">
        <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight">Entraînement Bouclé !</h2>
        <p className="text-[#FF6321] font-bold text-sm tracking-widest uppercase font-mono">
          Sangle Abdominale & Adducteurs Blindés
        </p>
        <p className="text-white/60 text-sm max-w-md mx-auto leading-relaxed font-sans opacity-95">
          Excellent travail. En répétant cette séance de PPG spécifique 2 fois par semaine, votre corps résistera efficacement aux crampes violentes et à l'effondrement postural après le 30ème kilomètre.
        </p>
      </div>

      {/* SUMMARY STATS GRID */}
      <div className="grid grid-cols-2 gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl text-left">
        <div>
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-black block">Durée de l'exercice</span>
          <span className="text-xl font-bold text-white font-mono uppercase tracking-wide">{durationMinutes} minutes</span>
        </div>
        <div>
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-black block">Indice de protection</span>
          <span className="text-xl font-bold text-[#FF6321] font-mono uppercase tracking-wide">100% blindé</span>
        </div>
      </div>

      <button
        id="btn-completed-reset"
        onClick={onRestart}
        className="w-full bg-[#FF6321] hover:bg-[#FF6321]/90 text-black font-extrabold uppercase tracking-widest text-xs py-4 rounded-full transition-all cursor-pointer"
      >
        Retourner à l'accueil
      </button>
    </div>
  );
}
