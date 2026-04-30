"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMagicuiStore } from "@/providers/magicui-store-provider";

export function SkillsEditor() {
  const skills = useMagicuiStore((s) => s.data.skills);
  const patch = useMagicuiStore((s) => s.patch);

  const updateAt = (index: number, value: string) => {
    patch(
      "skills",
      skills.map((s, i) => (i === index ? { name: value } : s)),
    );
  };

  const removeAt = (index: number) => {
    patch(
      "skills",
      skills.filter((_, i) => i !== index),
    );
  };

  const add = () => {
    patch("skills", [...skills, { name: "" }]);
  };

  return (
    <div className="flex flex-col gap-2">
      {skills.map((skill, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            value={skill.name}
            onChange={(e) => updateAt(i, e.target.value)}
            placeholder="Skill name"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => removeAt(i)}
            aria-label={`Remove ${skill.name || "skill"}`}
          >
            <X />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={add}
        className="mt-2"
      >
        Add skill
      </Button>
    </div>
  );
}
