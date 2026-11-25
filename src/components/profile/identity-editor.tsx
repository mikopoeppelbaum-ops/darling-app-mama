"use client";

import { useAppStore } from "@/lib/store";
import {
  GENDER_OPTIONS,
  ORIENTATION_OPTIONS,
  PRONOUN_SUGGESTIONS,
  RELATIONSHIP_STRUCTURE_OPTIONS,
  ROMANTIC_ORIENTATION_OPTIONS,
} from "@/lib/options";
import type { Gender, Orientation, RelationshipStructure, RomanticOrientation } from "@/lib/types";
import { RadioCards } from "@/components/ui/radio-cards";
import { ChipGroup } from "@/components/ui/chip-group";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { VisibilitySelect } from "@/components/profile/visibility-select";

/** Vorschlagsliste für Pronomen-Felder (per `list="pronoun-suggestions"`). */
export function PronounDatalist() {
  return (
    <datalist id="pronoun-suggestions">
      {PRONOUN_SUGGESTIONS.map((p) => (
        <option key={p} value={p} />
      ))}
    </datalist>
  );
}

/**
 * Identität und Beziehungsform. Alles freiwillig, eigene Worte immer möglich.
 * Sexuelle und romantische Orientierung sind getrennt — wichtig für
 * asexuelle und aromantische Menschen.
 */
export function IdentityEditor({ showPronouns = false }: { showPronouns?: boolean }) {
  const store = useAppStore();
  const me = store.state.me;
  const orientations = me.orientations?.length ? me.orientations : [me.orientation];

  return (
    <div className="space-y-6">
      <RadioCards
        legend="Geschlechtsidentität"
        hint="Wähle, was am besten passt — oder beschreibe es selbst."
        name="identity-gender"
        options={GENDER_OPTIONS}
        value={me.gender}
        onChange={(v) => store.updateProfile({ gender: v as Gender })}
      />
      {me.gender === "self_described" ? (
        <FormField label="In deinen Worten" htmlFor="identity-gender-self">
          <Input
            id="identity-gender-self"
            value={me.genderSelfDescribed ?? ""}
            onChange={(e) => store.updateProfile({ genderSelfDescribed: e.target.value })}
          />
        </FormField>
      ) : null}

      {showPronouns ? (
        <FormField
          label="Pronomen"
          htmlFor="identity-pronouns"
          optional
          hint="Vorschläge erscheinen beim Tippen; du kannst aber alles frei eintragen."
        >
          <Input
            id="identity-pronouns"
            list="pronoun-suggestions"
            value={me.pronouns ?? ""}
            onChange={(e) => store.updateProfile({ pronouns: e.target.value || undefined })}
          />
          <PronounDatalist />
        </FormField>
      ) : null}

      <ChipGroup
        legend="Sexuelle Orientierung"
        hint="Mehrfachauswahl möglich, z. B. bisexuell und queer."
        options={ORIENTATION_OPTIONS}
        selected={orientations}
        onChange={(v) => {
          const next = v.length ? (v as Orientation[]) : (["prefer_not_to_say"] as Orientation[]);
          store.updateProfile({ orientations: next, orientation: next[0] });
        }}
      />

      <RadioCards
        legend="Romantische Orientierung (freiwillig)"
        hint="Für manche Menschen unterscheidet sich, zu wem sie sich romantisch und zu wem sexuell hingezogen fühlen."
        name="identity-romantic"
        options={[...ROMANTIC_ORIENTATION_OPTIONS]}
        value={me.romanticOrientation ?? "prefer_not_to_say"}
        onChange={(v) =>
          store.updateProfile({
            romanticOrientation: v === "prefer_not_to_say" ? undefined : (v as RomanticOrientation),
          })
        }
      />

      <RadioCards
        legend="Beziehungsform"
        name="identity-structure"
        options={[...RELATIONSHIP_STRUCTURE_OPTIONS, { value: "none", label: "Keine Angabe" }]}
        value={me.relationshipStructure ?? "none"}
        onChange={(v) =>
          store.updateProfile({
            relationshipStructure: v === "none" ? undefined : (v as RelationshipStructure),
          })
        }
      />

      <fieldset className="space-y-3 rounded-xl border border-border p-4">
        <legend className="px-1 font-semibold">Inter* (freiwillig)</legend>
        <p className="text-sm text-muted-foreground">
          Wenn du inter* bist und das teilen möchtest. Standardmäßig für niemanden sichtbar.
        </p>
        <div className="flex items-start gap-3">
          <Checkbox
            id="identity-inter"
            checked={me.inter ?? false}
            onChange={(e) => store.updateProfile({ inter: e.target.checked })}
          />
          <Label htmlFor="identity-inter" className="font-normal">
            Ich bin inter*
          </Label>
        </div>
        {me.inter ? (
          <VisibilitySelect
            id="identity-inter-visibility"
            label="Wer sieht diese Angabe?"
            value={me.interVisibility ?? "hidden"}
            onChange={(v) => store.updateProfile({ interVisibility: v })}
          />
        ) : null}
      </fieldset>
    </div>
  );
}
