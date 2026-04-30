"use client";

import { Plus, Trash2 } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMagicuiStore } from "@/providers/magicui-store-provider";
import type { Data } from "@/templates/portfolios/magicui/data/schema";

import { Field } from "./field";

type EducationItem = Data["education"][number];

const blankEducationItem = (): EducationItem => ({
  school: "",
  href: "",
  degree: "",
  logoUrl: "",
  start: "",
  end: "",
});

export function EducationEditor() {
  const education = useMagicuiStore((s) => s.data.education);
  const patch = useMagicuiStore((s) => s.patch);

  const updateAt = (index: number, partial: Partial<EducationItem>) => {
    patch(
      "education",
      education.map((item, i) => (i === index ? { ...item, ...partial } : item)),
    );
  };

  const removeAt = (index: number) => {
    patch(
      "education",
      education.filter((_, i) => i !== index),
    );
  };

  const add = () => {
    patch("education", [...education, blankEducationItem()]);
  };

  return (
    <div className="flex flex-col gap-3">
      {education.length > 0 ? (
        <Accordion type="multiple">
          {education.map((item, i) => (
            <AccordionItem key={i} value={`education-${i}`}>
              <AccordionTrigger className="px-1">
                <div className="flex flex-col items-start gap-0.5 pr-2">
                  <span className="text-sm font-medium">
                    {item.school || "Untitled education"}
                  </span>
                  {item.degree && (
                    <span className="text-xs text-muted-foreground">
                      {item.degree}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-1">
                <div className="flex flex-col gap-3 pt-1">
                  <Field label="School">
                    <Input
                      value={item.school}
                      onChange={(e) => updateAt(i, { school: e.target.value })}
                    />
                  </Field>
                  <Field label="Course / Degree">
                    <Input
                      value={item.degree}
                      onChange={(e) => updateAt(i, { degree: e.target.value })}
                      placeholder="Bachelor's Degree of Computer Science"
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Start">
                      <Input
                        value={item.start}
                        onChange={(e) =>
                          updateAt(i, { start: e.target.value })
                        }
                        placeholder="2016"
                      />
                    </Field>
                    <Field label="End">
                      <Input
                        value={item.end}
                        onChange={(e) => updateAt(i, { end: e.target.value })}
                        placeholder="2021"
                      />
                    </Field>
                  </div>
                  <Field label="School URL" optional>
                    <Input
                      value={item.href}
                      onChange={(e) => updateAt(i, { href: e.target.value })}
                      placeholder="https://…"
                    />
                  </Field>
                  <Field label="Logo URL" optional>
                    <Input
                      value={item.logoUrl}
                      onChange={(e) =>
                        updateAt(i, { logoUrl: e.target.value })
                      }
                      placeholder="https://…"
                    />
                  </Field>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeAt(i)}
                    className="self-start"
                  >
                    <Trash2 />
                    Remove
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <p className="text-xs text-muted-foreground">
          No education yet. Add one below.
        </p>
      )}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={add}
        className="self-start"
      >
        <Plus />
        Add education
      </Button>
    </div>
  );
}
