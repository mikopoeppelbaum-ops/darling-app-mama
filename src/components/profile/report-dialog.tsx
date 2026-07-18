"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { FormField } from "@/components/ui/form-field";
import { REPORT_CATEGORY_OPTIONS } from "@/lib/options";
import { reportSchema, type ReportInput } from "@/lib/validation";
import { useAppStore } from "@/lib/store";
import type { ReportCategory } from "@/lib/types";

export function ReportDialog({
  profileId,
  profileName,
  messageId,
  open,
  onClose,
}: {
  profileId: string;
  profileName: string;
  messageId?: string;
  open: boolean;
  onClose: () => void;
}) {
  const { report } = useAppStore();
  const [submitted, setSubmitted] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReportInput>({
    resolver: zodResolver(reportSchema),
    defaultValues: { category: "", description: "" },
  });

  function onSubmit(data: ReportInput) {
    report(profileId, data.category as ReportCategory, data.description, messageId);
    setSubmitted(true);
  }

  function close() {
    reset();
    setSubmitted(false);
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={close}
      title={`${profileName} melden`}
      description="Deine Meldung ist vertraulich. Die Person erfährt nicht, dass du sie gemeldet hast."
    >
      {submitted ? (
        <div className="space-y-4">
          <p>
            Danke für deine Meldung. Unser Moderationsteam schaut sie sich so schnell wie
            möglich an. Wenn du dich unsicher fühlst, kannst du die Person zusätzlich
            blockieren.
          </p>
          <Button onClick={close}>Schließen</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField label="Worum geht es?" htmlFor="report-category" error={errors.category?.message}>
            <Select
              id="report-category"
              aria-invalid={Boolean(errors.category)}
              aria-describedby={errors.category ? "report-category-error" : undefined}
              {...register("category")}
            >
              <option value="">Bitte auswählen …</option>
              {REPORT_CATEGORY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField
            label="Was ist passiert?"
            htmlFor="report-description"
            hint="Beschreibe es in deinen eigenen Worten. Jede Information hilft."
            error={errors.description?.message}
          >
            <Textarea
              id="report-description"
              rows={4}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? "report-description-error" : undefined}
              {...register("description")}
            />
          </FormField>
          <div className="flex gap-3">
            <Button type="submit">Meldung senden</Button>
            <Button type="button" variant="secondary" onClick={close}>
              Abbrechen
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  );
}
