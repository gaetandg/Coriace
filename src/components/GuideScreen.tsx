import { ArrowRight, Info, Shield } from 'lucide-react';

export function GuideScreen({ onOpenWorkout }: { onOpenWorkout: () => void }) {
  return (
    <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <h2 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight flex items-center gap-2.5">
          <Shield className="text-[#FF6321] w-6 h-6" />
          Pourquoi renforcer ces muscles ?
        </h2>
        <p className="text-sm text-white/60 leading-relaxed font-sans">
          La plupart des marathoniens ne font que courir. En fin de course, la fatigue s'installe et certains muscles lâchent avant les autres. Trois zones méritent un travail spécifique.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-3">
            <span className="text-2xl">🦵</span>
            <h3 className="font-display font-bold text-white text-base tracking-tight uppercase">Mollets</h3>
            <p className="text-xs text-white/50 leading-relaxed font-sans">
              Le soléaire, muscle profond du mollet, encaisse plusieurs fois le poids du corps à chaque foulée. Quand il fatigue, la foulée se dégrade et le risque de crampe augmente. On le travaille genoux pliés (mollets assis, squat profond) et en descente lente.
            </p>
          </div>

          <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-3">
            <span className="text-2xl">💥</span>
            <h3 className="font-display font-bold text-white text-base tracking-tight uppercase">Adducteurs</h3>
            <p className="text-xs text-white/50 leading-relaxed font-sans">
              Ils stabilisent le bassin et le genou à chaque appui. Faibles ou fatigués, ils laissent le bassin et les genoux bouger davantage. Le <b>Copenhagen plank</b> est l'un des exercices les plus efficaces pour les renforcer.
            </p>
          </div>

          <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-3">
            <span className="text-2xl">🛡️</span>
            <h3 className="font-display font-bold text-white text-base tracking-tight uppercase">Gainage</h3>
            <p className="text-xs text-white/50 leading-relaxed font-sans">
              Le tronc maintient la posture quand la fatigue arrive. Un gainage solide aide à garder une foulée efficace jusqu'au bout.
            </p>
          </div>
        </div>

        <div className="bg-[#FF6321]/5 border border-[#FF6321]/20 p-5 rounded-xl text-xs text-[#FF6321] flex items-start gap-3">
          <Info className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block uppercase tracking-wider mb-0.5">Fréquence</span>
            <p className="leading-relaxed text-white/80">
              Deux séances par semaine pendant la préparation. Arrête environ 10 jours avant la course pour arriver reposé. Compte quelques semaines avant d'en sentir les effets.
            </p>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={onOpenWorkout}
            className="px-8 h-12 rounded-full bg-[#FF6321] hover:bg-[#FF6321]/90 text-black font-bold uppercase tracking-wider text-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            Préparer une séance <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </main>
  );
}
