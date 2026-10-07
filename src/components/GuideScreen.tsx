import { primaryButton } from '../lib/ui';

const ZONES = [
  {
    title: 'Mollets',
    text: 'Le soléaire, muscle profond du mollet, encaisse plusieurs fois le poids du corps à chaque foulée. Quand il fatigue, la foulée se dégrade et le risque de crampe augmente. On le travaille genoux pliés (mollets assis, squat profond) et en descente lente.',
  },
  {
    title: 'Adducteurs',
    text: "Ils stabilisent le bassin et le genou à chaque appui. Faibles ou fatigués, ils laissent le bassin et les genoux bouger davantage. Le Copenhagen plank est l'un des exercices les plus efficaces pour les renforcer.",
  },
  {
    title: 'Gainage',
    text: "Le tronc maintient la posture quand la fatigue arrive. Un gainage solide aide à garder une foulée efficace jusqu'au bout.",
  },
];

export function GuideScreen({ onOpenWorkout }: { onOpenWorkout: () => void }) {
  return (
    <main className="flex-1 flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1 className="font-display font-extrabold text-[40px] leading-none tracking-[-0.03em]">Pourquoi ces muscles ?</h1>
        <p className="text-base leading-relaxed text-sand">
          La plupart des marathoniens ne font que courir. En fin de course, la fatigue s'installe et certains muscles lâchent avant les autres. Trois zones méritent un travail spécifique.
        </p>
      </div>

      {ZONES.map(zone => (
        <section key={zone.title} className="flex flex-col gap-1.5 border-t border-white/30 pt-4">
          <h2 className="font-display font-bold text-2xl">{zone.title}</h2>
          <p className="text-base leading-relaxed text-sand">{zone.text}</p>
        </section>
      ))}

      <section className="bg-cream text-ink rounded-[18px] px-5 py-4 flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-clay">Fréquence</h2>
        <p className="text-base leading-relaxed">
          Deux séances par semaine pendant la préparation. Arrête environ 10 jours avant la course pour arriver reposé. Compte quelques semaines avant d'en sentir les effets.
        </p>
      </section>

      <section className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-sand">Bon à savoir</h2>
        <p className="text-base leading-relaxed">
          Les crampes de fin de marathon sont souvent liées à la fatigue des muscles. Des mollets, des adducteurs et un gainage plus endurants aident à repousser ce moment.
        </p>
      </section>

      <p className="text-sm text-sand">
        <a href="conditions.html" className="underline underline-offset-4">Conditions d'utilisation</a>
        {' · '}
        <a href="confidentialite.html" className="underline underline-offset-4">Confidentialité</a>
      </p>

      <button onClick={onOpenWorkout} className={`mt-auto w-full ${primaryButton}`}>Préparer une séance</button>
    </main>
  );
}
