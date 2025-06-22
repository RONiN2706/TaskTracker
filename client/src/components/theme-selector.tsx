import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Palette } from "lucide-react";

const themes = [
  { name: "Notebook", value: "light", color: "hsl(44, 33%, 98%)" },
  { name: "Midnight", value: "dark", color: "hsl(220, 15%, 15%)" },
  { name: "Forest", value: "green", color: "hsl(120, 25%, 12%)" },
  { name: "Clean", value: "white", color: "hsl(0, 0%, 100%)" },
  { name: "Ocean", value: "blue", color: "hsl(200, 80%, 25%)" },
];

export default function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("diary-theme") || "light";
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    root.style.setProperty("--theme-bg", `var(--${theme}-bg)`);
    root.style.setProperty("--theme-card-bg", `var(--${theme}-card-bg)`);
    root.style.setProperty("--theme-text", `var(--${theme}-text)`);
    root.style.setProperty("--theme-primary", `var(--${theme}-primary)`);
    root.style.setProperty("--theme-secondary", `var(--${theme}-secondary)`);
    root.style.setProperty("--theme-accent", `var(--${theme}-accent)`);
    root.style.setProperty("--theme-muted", `var(--${theme}-muted)`);
    root.style.setProperty("--theme-border", `var(--${theme}-border)`);
  };

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    applyTheme(theme);
    localStorage.setItem("diary-theme", theme);
  };

  const currentThemeData = themes.find(t => t.value === currentTheme);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-theme-border bg-theme-card-bg theme-primary hover:bg-theme-primary/10"
        >
          <Palette className="mr-2" size={16} />
          <span className="font-century text-sm">Theme</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 bg-theme-card-bg border-theme-border">
        <div className="space-y-3">
          <h4 className="font-serif font-semibold theme-primary">Choose Theme</h4>
          <div className="grid grid-cols-1 gap-2">
            {themes.map((theme) => (
              <Button
                key={theme.value}
                variant={currentTheme === theme.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleThemeChange(theme.value)}
                className={`flex items-center justify-start gap-2 font-century ${
                  currentTheme === theme.value
                    ? "bg-theme-primary theme-card-bg"
                    : "border-theme-border bg-theme-card-bg theme-primary hover:bg-theme-primary/10"
                }`}
              >
                <div 
                  className="w-3 h-3 rounded-full border border-theme-border" 
                  style={{ backgroundColor: theme.color }}
                />
                {theme.name}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}