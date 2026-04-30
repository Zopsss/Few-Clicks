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
import { Textarea } from "@/components/ui/textarea";
import { useMagicuiStore } from "@/providers/magicui-store-provider";
import type { Data } from "@/templates/portfolios/magicui/data/schema";

import { Field } from "./field";

type WorkItem = Data["work"][number];

const blankWorkItem = (): WorkItem => ({
  company: "",
  href: "",
  location: "",
  title: "",
  logoUrl: "",
  start: "",
  end: "",
  description: "",
});

export function WorkEditor() {
  const work = useMagicuiStore((s) => s.data.work);
  const patch = useMagicuiStore((s) => s.patch);

  const updateAt = (index: number, partial: Partial<WorkItem>) => {
    patch(
      "work",
      work.map((item, i) => (i === index ? { ...item, ...partial } : item)),
    );
  };

  const removeAt = (index: number) => {
    patch(
      "work",
      work.filter((_, i) => i !== index),
    );
  };

  const add = () => {
    patch("work", [...work, blankWorkItem()]);
  };

  return (
    <div className="flex flex-col gap-3">
      {work.length > 0 ? (
        <Accordion type="multiple">
          {work.map((item, i) => (
            <AccordionItem key={i} value={`work-${i}`}>
              <AccordionTrigger className="px-1">
                <div className="flex flex-col items-start gap-0.5 pr-2">
                  <span className="text-sm font-medium">
                    {item.company || "Untitled experience"}
                  </span>
                  {item.title && (
                    <span className="text-xs text-muted-foreground">
                      {item.title}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-1">
                <div className="flex flex-col gap-3 pt-1">
                  <Field label="Company">
                    <Input
                      value={item.company}
                      onChange={(e) => updateAt(i, { company: e.target.value })}
                    />
                  </Field>
                  <Field label="Role">
                    <Input
                      value={item.title}
                      onChange={(e) => updateAt(i, { title: e.target.value })}
                    />
                  </Field>
                  <Field label="Location" optional>
                    <Input
                      value={item.location}
                      onChange={(e) =>
                        updateAt(i, { location: e.target.value })
                      }
                      placeholder="Remote, San Francisco, CA…"
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Start">
                      <Input
                        value={item.start}
                        onChange={(e) => updateAt(i, { start: e.target.value })}
                        placeholder="May 2021"
                      />
                    </Field>
                    <Field label="End">
                      <Input
                        value={item.end}
                        onChange={(e) => updateAt(i, { end: e.target.value })}
                        placeholder="Oct 2022"
                      />
                    </Field>
                  </div>
                  <Field label="Company URL" optional>
                    <Input
                      value={item.href}
                      onChange={(e) => updateAt(i, { href: e.target.value })}
                      placeholder="https://…"
                    />
                  </Field>
                  <Field label="Logo URL" optional>
                    <Input
                      value={item.logoUrl}
                      onChange={(e) => updateAt(i, { logoUrl: e.target.value })}
                      placeholder="https://…"
                    />
                  </Field>
                  <Field label="Description">
                    <Textarea
                      value={item.description}
                      onChange={(e) =>
                        updateAt(i, { description: e.target.value })
                      }
                      rows={4}
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
          No experiences yet. Add one below.
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
        Add experience
      </Button>
    </div>
  );
}
