import { Sparkles } from "lucide-react";

/** Zeigt verständliche Übereinstimmungen — bewusst keine Prozentwerte. */
export function MatchReasonsList({ reasons }: { reasons: string[] }) {
  return (
    <div className="rounded-xl bg-primary-soft p-4">
      <h3 className="flex items-center gap-2 font-semibold">
        <Sparkles aria-hidden="true" className="size-4 text-primary" />
        Warum ihr zusammenpassen könntet
      </h3>
      <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
        {reasons.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </div>
  );
}
