"use client"

import { Plus, Trash2, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CATEGORIES,
  FABRICS,
  SMART_RULE_FIELD_META,
  SMART_RULE_OPERATOR_META,
} from "@/lib/constants"
import type {
  SmartRule,
  SmartRuleField,
  SmartRuleMatch,
  SmartRuleOperator,
} from "@/types"

/** Option lists for fields whose value is picked, not typed. */
const VALUE_OPTIONS: Partial<Record<SmartRuleField, readonly string[]>> = {
  category: CATEGORIES,
  fabric: FABRICS,
}

const FIELDS = Object.keys(SMART_RULE_FIELD_META) as SmartRuleField[]

function newRule(): SmartRule {
  return { id: crypto.randomUUID(), field: "category", operator: "is", value: "" }
}

interface SmartRuleBuilderProps {
  match: SmartRuleMatch
  onMatchChange: (match: SmartRuleMatch) => void
  rules: SmartRule[]
  onChange: (rules: SmartRule[]) => void
}

/**
 * Shopify-style condition editor. Controlled — the parent form owns the rule
 * array; this component only knows how to edit one.
 */
export function SmartRuleBuilder({
  match,
  onMatchChange,
  rules,
  onChange,
}: SmartRuleBuilderProps) {
  function patchRule(id: string, patch: Partial<SmartRule>) {
    onChange(rules.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  // Changing the field invalidates the operator and value with it.
  function changeField(id: string, field: SmartRuleField) {
    patchRule(id, { field, operator: SMART_RULE_FIELD_META[field].operators[0], value: "" })
  }

  return (
    <div className="space-y-3 rounded-lg border bg-muted/30 p-3">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span>Products must match</span>
        <Select value={match} onValueChange={(v) => onMatchChange(v as SmartRuleMatch)}>
          <SelectTrigger size="sm" className="h-8 w-[6.5rem]" aria-label="Rule matching">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">all</SelectItem>
            <SelectItem value="any">any</SelectItem>
          </SelectContent>
        </Select>
        <span>of the following rules:</span>
      </div>

      {rules.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed bg-background p-5 text-center">
          <Zap className="size-4 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            No rules yet — products only join this collection once a rule matches
            them.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {rules.map((rule) => {
            const fieldMeta = SMART_RULE_FIELD_META[rule.field]
            const options = VALUE_OPTIONS[rule.field]
            return (
              <div
                key={rule.id}
                className="grid grid-cols-1 gap-2 sm:grid-cols-[1.1fr_1fr_1.1fr_auto]"
              >
                <Select
                  value={rule.field}
                  onValueChange={(v) => changeField(rule.id, v as SmartRuleField)}
                >
                  <SelectTrigger size="sm" className="h-9" aria-label="Rule field">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FIELDS.map((f) => (
                      <SelectItem key={f} value={f}>
                        {SMART_RULE_FIELD_META[f].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={rule.operator}
                  onValueChange={(v) =>
                    patchRule(rule.id, { operator: v as SmartRuleOperator })
                  }
                >
                  <SelectTrigger size="sm" className="h-9" aria-label="Rule condition">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldMeta.operators.map((op) => (
                      <SelectItem key={op} value={op}>
                        {SMART_RULE_OPERATOR_META[op].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {options ? (
                  <Select
                    value={rule.value || undefined}
                    onValueChange={(v) => patchRule(rule.id, { value: v })}
                  >
                    <SelectTrigger size="sm" className="h-9" aria-label="Rule value">
                      <SelectValue placeholder="Select…" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <Input
                      type={fieldMeta.input === "number" ? "number" : "text"}
                      value={rule.value}
                      onChange={(e) => patchRule(rule.id, { value: e.target.value })}
                      placeholder={fieldMeta.input === "number" ? "0" : "e.g. Best Seller"}
                      aria-label="Rule value"
                      className="h-9 bg-background"
                    />
                    {fieldMeta.unit ? (
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {fieldMeta.unit}
                      </span>
                    ) : null}
                  </div>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="justify-self-end text-muted-foreground hover:text-destructive sm:justify-self-auto"
                  onClick={() => onChange(rules.filter((r) => r.id !== rule.id))}
                  aria-label="Remove rule"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            )
          })}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...rules, newRule()])}
      >
        <Plus className="size-4" /> Add rule
      </Button>
    </div>
  )
}
