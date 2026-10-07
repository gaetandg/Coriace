import { ArrowRight, Info, Shield } from 'lucide-react';

export function GuideScreen({ onOpenWorkout }: { onOpenWorkout: () => void }) {
  return (
    <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <h2 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight flex items-center gap-2.5">
          <Shield className="text-[#FF6321] w-6 h-6" />
          Pourquoi cette préparation physique spécifique (PPG) ?
        </h2>
        <p className="text-sm text-white/60 leading-relaxed font-sans">
          La majorité des marathoniens s'entraînent uniquement en courant. Pourtant, après 3 heures de foulées répétées, le système neuromusculaire fatigue et les déséquilibres apparaissent :
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-3">
            <span className="text-2xl">🦵</span>
            <h3 className="font-display font-bold text-white text-base tracking-tight uppercase">Les Crampes aux Mollets</h3>
            <p className="text-xs text-white/50 leading-relaxed font-sans">
              Le muscle <i>Soléaire</i> encaisse jusqu'à 8 fois le poids du corps à chaque impact. S'il n'est pas entraîné en endurance de force (extensions de mollets assis) et en freinage excentrique lent (extensions de mollets debout), il se tétanise après le 30ème km.
            </p>
          </div>

          <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-3">
            <span className="text-2xl">💥</span>
            <h3 className="font-display font-bold text-white text-base tracking-tight uppercase">Les Adducteurs</h3>
            <p className="text-xs text-white/50 leading-relaxed font-sans">
              Les adducteurs stabilisent le bassin pour empêcher son oscillation latérale. Des adducteurs fatigués ou faibles entraînent une déstabilisation du genou et tirent sur la rotule, créant des spasmes douloureux. Le <b>Copenhagen Plank</b> est l'exercice de référence universel.
            </p>
          </div>

          <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-3">
            <span className="text-2xl">🛡️</span>
            <h3 className="font-display font-bold text-white text-base tracking-tight uppercase">La Sangle Abdominale</h3>
            <p className="text-xs text-white/50 leading-relaxed font-sans">
              Le gainage maintient votre posture droite. Quand les abdominaux s'effondrent, le bassin bascule en antéversion, modifiant l'angle d'impact au sol des jambes, ce qui surcharge instantanément les mollets et déclenche les crampes reflexe.
            </p>
          </div>
        </div>

        <div className="bg-[#FF6321]/5 border border-[#FF6321]/20 p-5 rounded-xl text-xs text-[#FF6321] flex items-start gap-3">
          <Info className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block uppercase tracking-wider mb-0.5">Fréquence Recommandée</span>
            <p className="leading-relaxed text-white/80">
              Réalisez ce circuit de 30 minutes 2 fois par semaine en période de préparation marathon (jusqu'à 10 jours avant l'épreuve). Les fibres musculaires mettront environ 3 semaines pour se restructurer solidement. Bien respirer et s'hydrater activement.
            </p>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={onOpenWorkout}
            className="px-8 h-12 rounded-full bg-[#FF6321] hover:bg-[#FF6321]/90 text-black font-bold uppercase tracking-wider text-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            Accéder au configurateur <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </main>
  );
}
