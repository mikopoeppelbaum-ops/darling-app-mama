"use client";

import { ACCESSIBILITY_NEED_GROUPS } from "@/lib/options";
import { ChipGroup } from "@/components/ui/chip-group";

/**
 * Barrierefreiheitsbedürfnisse in kleinen, thematischen Gruppen (nach
 * ICF-Bereichen) statt einer langen Liste — weniger auf einmal zu lesen.
 */
export function AccessibilityNeedsPicker({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="space-y-5">
      {ACCESSIBILITY_NEED_GROUPS.map((group) => {
        const groupOptions = group.options as readonly string[];
        const inGroup = selected.filter((s) => groupOptions.includes(s));
        const outside = selected.filter((s) => !groupOptions.includes(s));
        return (
          <ChipGroup
            key={group.id}
            legend={group.title}
            options={groupOptions.map((o) => ({ value: o, label: o }))}
            selected={inGroup}
            onChange={(next) => onChange([...outside, ...next])}
          />
        );
      })}
    </div>
  );
}
