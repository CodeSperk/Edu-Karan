"use client";

import { MathToolConfig } from "@/types/tool";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RefreshCcw, GripVertical, GripHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/contexts/I18nContext";

interface ToolConfigManagerProps {
  config: MathToolConfig;
  updateConfig: (updates: Partial<MathToolConfig>) => void;
  onGenerate: () => void;
}

export function ToolConfigManager({ config, updateConfig, onGenerate }: ToolConfigManagerProps) {
  const { t } = useI18n();

  return (
    <Card className="w-full bg-card/50 backdrop-blur border-border/50 shadow-sm rounded-none">
      <CardContent className="p-3 xl:px-4 xl:py-4">
        <div className="flex flex-wrap xl:flex-col items-center xl:items-stretch gap-x-4 gap-y-6 xl:gap-5 justify-between w-full border-none">
          
          {/* Operator Selection */}
          <div className="flex items-center w-full shrink-0">
            <Select value={config.type} onValueChange={(v: any) => updateConfig({ type: v })}>
               <SelectTrigger className="w-full h-12 border-primary/20 bg-primary/5 text-primary font-bold text-lg hover:bg-primary/10 transition-colors shadow-sm font-heading capitalize rounded-none"><SelectValue /></SelectTrigger>
               <SelectContent className="capitalize">
                 <SelectItem value="addition">{t("config.addition")}</SelectItem>
                 <SelectItem value="subtraction">{t("config.subtraction")}</SelectItem>
                 <SelectItem value="multiplication">{t("config.multiplication")}</SelectItem>
                 <SelectItem value="division">{t("config.division")}</SelectItem>
               </SelectContent>
            </Select>
          </div>

          {/* Layout Conversion & Re-roll */}
          <div className="flex items-center justify-between gap-4 shrink-0 xl:w-full">
             <div className="flex items-center bg-muted p-1 rounded-lg">
                <Button 
                  variant={config.layout === "vertical" ? "default" : "ghost"}
                  size="icon"
                  className="w-8 h-8 rounded-md"
                  onClick={() => updateConfig({ layout: "vertical" })}
                  title="Vertical Stack"
                ><GripVertical className="w-4 h-4" /></Button>
                <Button 
                  variant={config.layout === "horizontal" ? "default" : "ghost"}
                  size="icon"
                  className="w-8 h-8 rounded-md"
                  onClick={() => updateConfig({ layout: "horizontal" })}
                  title="Horizontal Row"
                ><GripHorizontal className="w-4 h-4" /></Button>
             </div>

             <Button onClick={onGenerate} variant="default" size="icon" className="hidden xl:flex shrink-0 shadow-sm h-10 w-10 transition-all hover:rotate-180 active:scale-95" title="Re-roll">
               <RefreshCcw className="w-5 h-5" />
             </Button>
          </div>

          {/* Digits Dropdown */}
          <div className="relative shrink-0 xl:w-full mt-2">
            <Label className="absolute -translate-y-1/2 top-0 left-2 z-10 bg-card px-1 whitespace-nowrap uppercase text-[10px] font-bold text-muted-foreground leading-none">
               {config.type === "multiplication" || config.type === "subtraction" ? t("config.top_digits") : config.type === "division" ? t("config.dividend_max") : t("config.digits")}
            </Label>
            <Select value={config.digits.toString()} onValueChange={(v) => updateConfig({ digits: Number(v) })}>
              <SelectTrigger className="w-[80px] xl:w-full h-10 rounded-none"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Stack / Bottom Digits Dropdown */}
          {config.type !== "subtraction" ? (
            <div className="relative shrink-0 xl:w-full mt-2">
              <Label className="absolute -translate-y-1/2 top-0 left-2 z-10 bg-card px-1 whitespace-nowrap uppercase text-[10px] font-bold text-muted-foreground leading-none">
                {config.type === "multiplication" ? t("config.bot_digits") : config.type === "division" ? t("config.divisor_size") : t("config.stack")}
              </Label>
              <Select value={config.columns.toString()} onValueChange={(v) => updateConfig({ columns: Number(v) })}>
                <SelectTrigger className="w-[80px] xl:w-full h-10 rounded-none"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="relative shrink-0 xl:w-full mt-2">
              <Label className="absolute -translate-y-1/2 top-0 left-2 z-10 bg-card px-1 whitespace-nowrap uppercase text-[10px] font-bold text-muted-foreground leading-none">
                {t("config.bot_digits")}
              </Label>
              <Select value={(config.bottomDigits || 1).toString()} onValueChange={(v) => updateConfig({ bottomDigits: Number(v) })}>
                <SelectTrigger className="w-[80px] xl:w-full h-10 rounded-none"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Count Dropdown */}
          <div className="relative shrink-0 xl:w-full mt-2">
            <Label className="absolute -translate-y-1/2 top-0 left-2 z-10 bg-card px-1 whitespace-nowrap uppercase text-[10px] font-bold text-muted-foreground leading-none">{t("config.count")}</Label>
            <Select value={config.count.toString()} onValueChange={(v) => updateConfig({ count: Number(v) })}>
              <SelectTrigger className="w-[70px] xl:w-full h-10 rounded-none"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5,6,8,10,12,15,20].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Carry Filter Dropdown */}
          {config.type !== "division" && (
            <div className="relative shrink-0 xl:w-full mt-2">
              <Label className="absolute -translate-y-1/2 top-0 left-2 z-10 bg-card px-1 whitespace-nowrap uppercase text-[10px] font-bold text-muted-foreground leading-none">{t("config.carry_rule")}</Label>
              <Select value={config.carryMode} onValueChange={(v: any) => updateConfig({ carryMode: v })}>
                <SelectTrigger className="w-[120px] xl:w-full h-10 text-xs rounded-none"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">{t("config.mixed")}</SelectItem>
                  <SelectItem value="with-carry">{t("config.with_carry")}</SelectItem>
                  <SelectItem value="without-carry">{t("config.no_carry")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Cards Per Row Dropdown */}
          <div className="relative shrink-0 xl:w-full mt-2">
            <Label className="absolute -translate-y-1/2 top-0 left-2 z-10 bg-card px-1 whitespace-nowrap uppercase text-[10px] font-bold text-muted-foreground leading-none">{t("config.grid")}</Label>
            <Select value={config.cardsPerRow?.toString() || "auto"} onValueChange={(v) => updateConfig({ cardsPerRow: v === "auto" ? "auto" : Number(v) })}>
              <SelectTrigger className="w-[80px] xl:w-full h-10 rounded-none"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">{t("config.auto")}</SelectItem>
                {[1,2,3,4].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Interactive Switch */}
          <div className="flex items-center gap-2 shrink-0 xl:pt-4 xl:border-t xl:border-border/50 xl:justify-between w-full xl:w-auto ml-2 xl:ml-0">
            <Label className="cursor-pointer uppercase text-[10px] xl:text-xs font-semibold text-muted-foreground whitespace-nowrap">
              <span className="font-semibold">{t("config.interactive")}</span>
            </Label>
            <Switch 
              checked={config.allowDrag} 
              onCheckedChange={(v) => updateConfig({ allowDrag: v })} 
            />
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
