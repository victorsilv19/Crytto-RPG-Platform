import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { toast } from "sonner@2.0.3";
import { 
  Palette, 
  RotateCcw, 
  Download, 
  Upload, 
  Eye,
  Save,
  Sparkles
} from "lucide-react";

interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    muted: string;
    accent: string;
    border: string;
    card: string;
  };
  isCustom?: boolean;
}

export function ThemeCustomizer() {
  const [selectedTheme, setSelectedTheme] = useState<string>("default");
  const [customColors, setCustomColors] = useState<Theme['colors']>({
    background: "#0a0a0a",
    foreground: "#e5e5e5", 
    primary: "#b91c1c",
    primaryForeground: "#ffffff",
    secondary: "#262626",
    muted: "#262626",
    accent: "#404040",
    border: "rgba(185, 28, 28, 0.2)",
    card: "#1a1a1a"
  });

  const predefinedThemes: Theme[] = [
    {
      id: "default",
      name: "Crytto Clássico",
      description: "Tema vermelho sangue padrão",
      colors: {
        background: "#0a0a0a",
        foreground: "#e5e5e5",
        primary: "#b91c1c",
        primaryForeground: "#ffffff",
        secondary: "#262626",
        muted: "#262626",
        accent: "#404040",
        border: "rgba(185, 28, 28, 0.2)",
        card: "#1a1a1a"
      }
    },
    {
      id: "dragon",
      name: "Fúria do Dragão",
      description: "Vermelho intenso com dourado",
      colors: {
        background: "#0f0f0f",
        foreground: "#fbbf24",
        primary: "#dc2626",
        primaryForeground: "#fbbf24",
        secondary: "#451a03",
        muted: "#451a03",
        accent: "#92400e",
        border: "rgba(220, 38, 38, 0.3)",
        card: "#1c1917"
      }
    },
    {
      id: "mystic",
      name: "Místico Roxo",
      description: "Tons de púrpura e violeta",
      colors: {
        background: "#0c0a15",
        foreground: "#e4d4f7",
        primary: "#7c3aed",
        primaryForeground: "#ffffff",
        secondary: "#2e1065",
        muted: "#2e1065",
        accent: "#5b21b6",
        border: "rgba(124, 58, 237, 0.2)",
        card: "#1e1b31"
      }
    },
    {
      id: "forest",
      name: "Guardião da Floresta",
      description: "Verde natural e terroso",
      colors: {
        background: "#0a0f0a",
        foreground: "#dcfce7",
        primary: "#16a34a",
        primaryForeground: "#ffffff",
        secondary: "#14532d",
        muted: "#14532d",
        accent: "#166534",
        border: "rgba(22, 163, 74, 0.2)",
        card: "#1a251a"
      }
    },
    {
      id: "ocean",
      name: "Profundezas do Oceano",
      description: "Azul profundo e aquático",
      colors: {
        background: "#020617",
        foreground: "#dbeafe",
        primary: "#0ea5e9",
        primaryForeground: "#ffffff",
        secondary: "#0c4a6e",
        muted: "#0c4a6e",
        accent: "#0369a1",
        border: "rgba(14, 165, 233, 0.2)",
        card: "#0f172a"
      }
    },
    {
      id: "shadow",
      name: "Reino das Sombras",
      description: "Preto e prata minimalista",
      colors: {
        background: "#000000",
        foreground: "#f1f5f9",
        primary: "#64748b",
        primaryForeground: "#ffffff",
        secondary: "#1e293b",
        muted: "#1e293b",
        accent: "#334155",
        border: "rgba(100, 116, 139, 0.2)",
        card: "#0f172a"
      }
    },
    {
      id: "gold",
      name: "Tesouro Dourado",
      description: "Dourado luxuoso com marrom",
      colors: {
        background: "#1c1917",
        foreground: "#fbbf24",
        primary: "#f59e0b",
        primaryForeground: "#1c1917",
        secondary: "#451a03",
        muted: "#451a03",
        accent: "#92400e",
        border: "rgba(245, 158, 11, 0.2)",
        card: "#292524"
      }
    }
  ];

  // Load saved theme on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('crytto-theme');
    const savedCustomColors = localStorage.getItem('crytto-custom-colors');
    
    if (savedTheme) {
      setSelectedTheme(savedTheme);
      if (savedTheme === 'custom' && savedCustomColors) {
        setCustomColors(JSON.parse(savedCustomColors));
      }
    }
  }, []);

  // Apply theme to CSS variables
  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    
    root.style.setProperty('--background', theme.colors.background);
    root.style.setProperty('--foreground', theme.colors.foreground);
    root.style.setProperty('--primary', theme.colors.primary);
    root.style.setProperty('--primary-foreground', theme.colors.primaryForeground);
    root.style.setProperty('--secondary', theme.colors.secondary);
    root.style.setProperty('--muted', theme.colors.muted);
    root.style.setProperty('--accent', theme.colors.accent);
    root.style.setProperty('--border', theme.colors.border);
    root.style.setProperty('--card', theme.colors.card);
    root.style.setProperty('--card-foreground', theme.colors.foreground);
    root.style.setProperty('--popover', theme.colors.card);
    root.style.setProperty('--popover-foreground', theme.colors.foreground);
    root.style.setProperty('--muted-foreground', theme.colors.foreground + '99'); // 60% opacity
    root.style.setProperty('--accent-foreground', theme.colors.foreground);
    root.style.setProperty('--input-background', theme.colors.secondary);
    root.style.setProperty('--ring', theme.colors.primary);
  };

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    
    if (themeId === 'custom') {
      const customTheme: Theme = {
        id: 'custom',
        name: 'Personalizado',
        description: 'Tema customizado',
        colors: customColors
      };
      applyTheme(customTheme);
    } else {
      const theme = predefinedThemes.find(t => t.id === themeId);
      if (theme) {
        applyTheme(theme);
      }
    }
    
    // Save to localStorage
    localStorage.setItem('crytto-theme', themeId);
    toast.success(`🎨 Tema "${predefinedThemes.find(t => t.id === themeId)?.name || 'Personalizado'}" aplicado!`);
  };

  const handleCustomColorChange = (colorKey: keyof Theme['colors'], value: string) => {
    const newColors = { ...customColors, [colorKey]: value };
    setCustomColors(newColors);
    
    if (selectedTheme === 'custom') {
      const customTheme: Theme = {
        id: 'custom',
        name: 'Personalizado',
        description: 'Tema customizado',
        colors: newColors
      };
      applyTheme(customTheme);
    }
  };

  const saveCustomTheme = () => {
    localStorage.setItem('crytto-custom-colors', JSON.stringify(customColors));
    if (selectedTheme === 'custom') {
      handleThemeSelect('custom');
    }
    toast.success("💾 Tema personalizado salvo!");
  };

  const resetToDefault = () => {
    const defaultTheme = predefinedThemes[0];
    setSelectedTheme(defaultTheme.id);
    setCustomColors(defaultTheme.colors);
    applyTheme(defaultTheme);
    localStorage.setItem('crytto-theme', defaultTheme.id);
    toast.info("🔄 Tema resetado para o padrão");
  };

  const exportTheme = () => {
    const themeData = selectedTheme === 'custom' 
      ? { id: 'custom', colors: customColors }
      : predefinedThemes.find(t => t.id === selectedTheme);
    
    const dataStr = JSON.stringify(themeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `crytto-theme-${selectedTheme}.json`;
    link.click();
    
    toast.success("📥 Tema exportado com sucesso!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-bold">Personalização de Tema</h2>
              <p className="text-muted-foreground">Customize as cores da plataforma do seu jeito</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={resetToDefault} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Resetar
            </Button>
            <Button onClick={exportTheme} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button onClick={saveCustomTheme} className="bg-primary hover:bg-primary/90">
              <Save className="h-4 w-4 mr-2" />
              Salvar Tema
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Predefined Themes */}
      <Card>
        <CardHeader>
          <CardTitle>Temas Predefinidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {predefinedThemes.map((theme) => (
              <Card 
                key={theme.id}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  selectedTheme === theme.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleThemeSelect(theme.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{theme.name}</CardTitle>
                    {selectedTheme === theme.id && (
                      <Badge className="bg-primary text-white">Ativo</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{theme.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Color Preview */}
                  <div className="grid grid-cols-5 gap-1 h-8 rounded overflow-hidden">
                    <div 
                      className="h-full" 
                      style={{ backgroundColor: theme.colors.background }}
                      title="Background"
                    />
                    <div 
                      className="h-full" 
                      style={{ backgroundColor: theme.colors.primary }}
                      title="Primary"
                    />
                    <div 
                      className="h-full" 
                      style={{ backgroundColor: theme.colors.secondary }}
                      title="Secondary"
                    />
                    <div 
                      className="h-full" 
                      style={{ backgroundColor: theme.colors.accent }}
                      title="Accent"
                    />
                    <div 
                      className="h-full" 
                      style={{ backgroundColor: theme.colors.card }}
                      title="Card"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Theme Editor */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Editor de Tema Personalizado
            </CardTitle>
            <Button 
              onClick={() => handleThemeSelect('custom')}
              variant={selectedTheme === 'custom' ? 'default' : 'outline'}
            >
              <Eye className="h-4 w-4 mr-2" />
              {selectedTheme === 'custom' ? 'Aplicado' : 'Aplicar Personalizado'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(customColors).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={value.startsWith('rgba') ? '#000000' : value}
                    onChange={(e) => handleCustomColorChange(key as keyof Theme['colors'], e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={value}
                    onChange={(e) => handleCustomColorChange(key as keyof Theme['colors'], e.target.value)}
                    placeholder="#000000 ou rgba(0,0,0,0.2)"
                    className="flex-1"
                  />
                </div>
              </div>
            ))}
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h4 className="font-medium">Preview do Tema Personalizado</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Color Palette Preview */}
              <Card style={{ backgroundColor: customColors.card, borderColor: customColors.border }}>
                <CardHeader>
                  <CardTitle style={{ color: customColors.foreground }}>
                    Preview do Card
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    style={{ 
                      backgroundColor: customColors.primary, 
                      color: customColors.primaryForeground 
                    }}
                    className="mb-2 w-full"
                  >
                    Botão Primário
                  </Button>
                  <div 
                    className="p-2 rounded text-sm"
                    style={{ 
                      backgroundColor: customColors.secondary, 
                      color: customColors.foreground 
                    }}
                  >
                    Texto secundário
                  </div>
                </CardContent>
              </Card>
              
              {/* Color Grid */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Paleta de Cores</h5>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(customColors).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <div 
                        className="h-8 rounded border border-border" 
                        style={{ backgroundColor: value }}
                      />
                      <div className="text-xs text-center text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Presets for Quick Setup */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              onClick={() => setCustomColors({
                ...customColors,
                primary: '#dc2626',
                background: '#0a0a0a'
              })}
            >
              🔥 Mais Vermelho
            </Button>
            <Button 
              variant="outline"
              onClick={() => setCustomColors({
                ...customColors,
                background: '#000000',
                card: '#111111'
              })}
            >
              🌙 Mais Escuro
            </Button>
            <Button 
              variant="outline"
              onClick={() => setCustomColors({
                ...customColors,
                primary: '#3b82f6',
                accent: '#1e40af'
              })}
            >
              💙 Azul
            </Button>
            <Button 
              variant="outline"
              onClick={() => setCustomColors({
                ...customColors,
                foreground: '#fbbf24',
                primary: '#f59e0b'
              })}
            >
              ✨ Dourado
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}