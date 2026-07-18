"use client";

import * as React from "react";
import type { DiscoverFilters } from "@/lib/types";
import {
  ALCOHOL_OPTIONS,
  CHILDREN_WISH_OPTIONS,
  COMMUNICATION_STYLE_OPTIONS,
  CONTACT_FREQUENCY_OPTIONS,
  GENDER_OPTIONS,
  INTEREST_OPTIONS,
  ORIENTATION_OPTIONS,
  PET_OPTIONS,
  PLANNING_STYLE_OPTIONS,
  RELATIONSHIP_GOAL_OPTIONS,
  SMOKING_OPTIONS,
  VALUE_OPTIONS,
} from "@/lib/options";
import type {
  CommunicationStyle,
  ContactFrequency,
  Gender,
  Orientation,
  PlanningStyle,
  RelationshipGoal,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChipGroup } from "@/components/ui/chip-group";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

/**
 * Filter für den Entdecken-Bereich.
 * Sensible Merkmale (freiwillige Angaben) filtern nur Profile, die diese
 * Angaben ausdrücklich als durchsuchbar freigegeben haben.
 */
export function DiscoverFiltersPanel({
  filters,
  onChange,
  onClose,
}: {
  filters: DiscoverFilters;
  onChange: (f: DiscoverFilters) => void;
  onClose: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <FormField label="Alter von" htmlFor="filter-age-min">
            <Input
              id="filter-age-min"
              type="number"
              min={18}
              max={99}
              inputMode="numeric"
              value={filters.ageMin ?? ""}
              onChange={(e) =>
                onChange({ ...filters, ageMin: e.target.value ? Number(e.target.value) : undefined })
              }
            />
          </FormField>
          <FormField label="Alter bis" htmlFor="filter-age-max">
            <Input
              id="filter-age-max"
              type="number"
              min={18}
              max={99}
              inputMode="numeric"
              value={filters.ageMax ?? ""}
              onChange={(e) =>
                onChange({ ...filters, ageMax: e.target.value ? Number(e.target.value) : undefined })
              }
            />
          </FormField>
          <FormField label="Entfernung (km)" htmlFor="filter-distance">
            <Input
              id="filter-distance"
              type="number"
              min={1}
              max={500}
              inputMode="numeric"
              value={filters.maxDistanceKm ?? ""}
              onChange={(e) =>
                onChange({
                  ...filters,
                  maxDistanceKm: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
          </FormField>
        </div>

        <ChipGroup
          legend="Geschlecht"
          options={GENDER_OPTIONS}
          selected={filters.genders ?? []}
          onChange={(v) => onChange({ ...filters, genders: v as Gender[] })}
        />
        <ChipGroup
          legend="Orientierung"
          hint="Es werden nur Profile gefunden, deren Orientierung öffentlich sichtbar ist."
          options={ORIENTATION_OPTIONS}
          selected={filters.orientations ?? []}
          onChange={(v) => onChange({ ...filters, orientations: v as Orientation[] })}
        />
        <ChipGroup
          legend="Beziehungsziel"
          options={RELATIONSHIP_GOAL_OPTIONS}
          selected={filters.relationshipGoals ?? []}
          onChange={(v) => onChange({ ...filters, relationshipGoals: v as RelationshipGoal[] })}
        />
        <ChipGroup
          legend="Interessen"
          options={INTEREST_OPTIONS.map((i) => ({ value: i, label: i }))}
          selected={filters.interests ?? []}
          onChange={(v) => onChange({ ...filters, interests: v })}
        />
        <ChipGroup
          legend="Werte"
          options={VALUE_OPTIONS.map((i) => ({ value: i, label: i }))}
          selected={filters.values ?? []}
          onChange={(v) => onChange({ ...filters, values: v })}
        />
        <ChipGroup
          legend="Kommunikationsstil"
          options={COMMUNICATION_STYLE_OPTIONS}
          selected={filters.communicationStyles ?? []}
          onChange={(v) => onChange({ ...filters, communicationStyles: v as CommunicationStyle[] })}
        />
        <ChipGroup
          legend="Planungsbedürfnis"
          options={PLANNING_STYLE_OPTIONS}
          selected={filters.planningStyles ?? []}
          onChange={(v) => onChange({ ...filters, planningStyles: v as PlanningStyle[] })}
        />
        <ChipGroup
          legend="Kontaktfrequenz"
          options={CONTACT_FREQUENCY_OPTIONS}
          selected={filters.contactFrequencies ?? []}
          onChange={(v) => onChange({ ...filters, contactFrequencies: v as ContactFrequency[] })}
        />
        <ChipGroup
          legend="Kinderwunsch"
          options={CHILDREN_WISH_OPTIONS}
          selected={filters.childrenWish ?? []}
          onChange={(v) => onChange({ ...filters, childrenWish: v })}
        />
        <ChipGroup
          legend="Rauchen"
          options={SMOKING_OPTIONS}
          selected={filters.smoking ?? []}
          onChange={(v) => onChange({ ...filters, smoking: v })}
        />
        <ChipGroup
          legend="Alkohol"
          options={ALCOHOL_OPTIONS}
          selected={filters.alcohol ?? []}
          onChange={(v) => onChange({ ...filters, alcohol: v })}
        />
        <ChipGroup
          legend="Haustiere"
          options={PET_OPTIONS}
          selected={filters.pets ?? []}
          onChange={(v) => onChange({ ...filters, pets: v })}
        />

        <div className="flex items-start gap-3">
          <Checkbox
            id="filter-accessible"
            checked={filters.accessibleMeetingPlaces ?? false}
            onChange={(e) => onChange({ ...filters, accessibleMeetingPlaces: e.target.checked })}
          />
          <Label htmlFor="filter-accessible" className="font-normal">
            Nur Profile, die barrierearme Treffpunkte bevorzugen
          </Label>
        </div>

        <FormField
          label="Freiwillige Angaben (z. B. ADHS, neurodivergent)"
          htmlFor="filter-disclosures"
          hint="Findet nur Profile, die diese Angabe selbst öffentlich und ausdrücklich für die Suche freigegeben haben."
        >
          <Input
            id="filter-disclosures"
            placeholder="z. B. ADHS"
            value={filters.disclosureLabels?.join(", ") ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                disclosureLabels: e.target.value
                  ? e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  : undefined,
              })
            }
          />
        </FormField>

        <div className="flex gap-3">
          <Button onClick={onClose}>Filter anwenden</Button>
          <Button variant="secondary" onClick={() => onChange({})}>
            Alle Filter zurücksetzen
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
