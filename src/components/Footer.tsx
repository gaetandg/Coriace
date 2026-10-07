export function Footer() {
  return (
    <footer className="mt-auto bg-[#050505] border-t border-white/10 py-10 px-6 text-center text-white/50 text-xs space-y-4">
      <div className="max-w-xl mx-auto space-y-2">
        <h4 className="text-[10px] font-bold tracking-widest text-[#FF6321] uppercase">
          Bon à savoir
        </h4>
        <p className="leading-relaxed text-[#FF6321]/80 text-xs">
          Les crampes de fin de marathon sont souvent liées à la fatigue des muscles. Des mollets, des adducteurs et un gainage plus endurants aident à repousser ce moment.
        </p>
      </div>
      <p className="text-[10px] text-white/20 pt-3 font-mono">
        Coriace · Renfo pour coureurs
      </p>
    </footer>
  );
}
