import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { toast } from "sonner";
import { 
  Palette, 
  Image, 
  Upload, 
  Eye, 
  Layers, 
  Sparkles, 
  Save, 
  RotateCcw,
  Crown,
  User,
  Brush,
  Monitor,
  Smartphone,
  Settings,
  Wand2
} from "lucide-react";

interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  preview: string;
}

interface BackgroundOption {
  id: string;
  name: string;
  type: "gradient" | "pattern" | "image";
  preview: string;
  data: any;
}

export function ProfileCustomizer() {
  const [activeTab, setActiveTab] = useState("themes");
  const [currentTheme, setCurrentTheme] = useState("dark-red");
  const [currentBackground, setCurrentBackground] = useState("gradient-1");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [customizations, setCustomizations] = useState({
    profileBorder: "glow",
    cardStyle: "elevated",
    fontSize: "medium",
    animations: true,
    particleEffects: true,
    soundEffects: true,
    autoTheme: false,
    contrastMode: false
  });

  // Available themes
  const themes: Theme[] = [
    {
      id: "dark-red",
      name: "Dragão Sombrio",
      description: "Tema padrão com tons vermelhos e pretos",
      colors: { primary: "#b91c1c", secondary: "#1a1a1a", accent: "#dc2626", background: "#0a0a0a" },
      preview: "linear-gradient(135deg, #7f1d1d, #450a0a)"
    },
    {
      id: "mystic-purple",
      name: "Místico Arcano",
      description: "Tons roxos e violetas para magos e feiticeiros",
      colors: { primary: "#7c3aed", secondary: "#1e1b4b", accent: "#a855f7", background: "#0f0b2f" },
      preview: "linear-gradient(135deg, #581c87, #312e81)"
    },
    {
      id: "forest-green",
      name: "Floresta Élfica",
      description: "Verde natural para rangers e druidas",
      colors: { primary: "#16a34a", secondary: "#14532d", accent: "#22c55e", background: "#052e16" },
      preview: "linear-gradient(135deg, #166534, #14532d)"
    },
    {
      id: "golden-sun",
      name: "Sol Dourado",
      description: "Dourado brilhante para paladinos e clérigos",
      colors: { primary: "#f59e0b", secondary: "#78350f", accent: "#fbbf24", background: "#1c1917" },
      preview: "linear-gradient(135deg, #d97706, #92400e)"
    },
    {
      id: "ice-blue",
      name: "Gelo Nórdico",
      description: "Azul gélido para aventuras no norte",
      colors: { primary: "#0ea5e9", secondary: "#0c4a6e", accent: "#38bdf8", background: "#0c1b2e" },
      preview: "linear-gradient(135deg, #0369a1, #164e63)"
    },
    {
      id: "shadow-gray",
      name: "Sombras Furtivas",
      description: "Tons de cinza para ladinos e assassinos",
      colors: { primary: "#6b7280", secondary: "#374151", accent: "#9ca3af", background: "#111827" },
      preview: "linear-gradient(135deg, #4b5563, #1f2937)"
    }
  ];

  // Background options
  const backgrounds: BackgroundOption[] = [
    {
      id: "gradient-1",
      name: "Gradiente Sombrio",
      type: "gradient",
      preview: "linear-gradient(135deg, #7f1d1d, #450a0a)",
      data: { colors: ["#7f1d1d", "#450a0a"], direction: "135deg" }
    },
    {
      id: "gradient-2", 
      name: "Fogo Dracônico",
      type: "gradient",
      preview: "linear-gradient(45deg, #dc2626, #f59e0b, #dc2626)",
      data: { colors: ["#dc2626", "#f59e0b", "#dc2626"], direction: "45deg" }
    },
    {
      id: "pattern-1",
      name: "Runas Arcanas",
      type: "pattern",
      preview: "radial-gradient(circle, #b91c1c 1px, transparent 1px)",
      data: { pattern: "dots", color: "#b91c1c", spacing: "20px" }
    },
    {
      id: "pattern-2",
      name: "Escamas de Dragão",
      type: "pattern", 
      preview: "repeating-linear-gradient(45deg, transparent, transparent 10px, #b91c1c33 10px, #b91c1c33 20px)",
      data: { pattern: "scales", color: "#b91c1c33", size: "10px" }
    },
    {
      id: "image-1",
      name: "Castelo Medieval",
      type: "image",
      preview: "url('/fantasy-castle.jpg')",
      data: { url: "/fantasy-castle.jpg", position: "center", size: "cover" }
    },
    {
      id: "image-2",
      name: "Floresta Mística",
      type: "image", 
      preview: "url('/mystic-forest.jpg')",
      data: { url: "/mystic-forest.jpg", position: "center", size: "cover" }
    }
  ];

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      toast.success(`🎨 Tema "${theme.name}" aplicado!`);
    }
  };

  const handleBackgroundChange = (backgroundId: string) => {
    setCurrentBackground(backgroundId);
    const background = backgrounds.find(b => b.id === backgroundId);
    if (background) {
      toast.success(`🖼️ Fundo "${background.name}" aplicado!`);
    }
  };

  const handleSaveCustomizations = () => {
    toast.success("💾 Personalizações salvas com sucesso!");
  };

  const handleResetToDefault = () => {
    setCurrentTheme("dark-red");
    setCurrentBackground("gradient-1");
    setCustomizations({
      profileBorder: "glow",
      cardStyle: "elevated", 
      fontSize: "medium",
      animations: true,
      particleEffects: true,
      soundEffects: true,
      autoTheme: false,
      contrastMode: false
    });
    toast.info("🔄 Configurações resetadas para o padrão");
  };

  const currentThemeData = themes.find(t => t.id === currentTheme) || themes[0];
  const currentBackgroundData = backgrounds.find(b => b.id === currentBackground) || backgrounds[0];

  return (
    <div className="space-y-6">
      {/* Header with preview toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground mb-1">Personalização do Perfil</h2>
          <p className="text-sm text-muted-foreground">
            Customize a aparência do seu perfil com temas, fundos e efeitos
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(previewMode === "desktop" ? "mobile" : "desktop")}
            className="border-red-700/50 text-red-300 hover:bg-red-900/30"
          >
            {previewMode === "desktop" ? (
              <>
                <Smartphone className="h-4 w-4 mr-1" />
                Mobile
              </>
            ) : (
              <>
                <Monitor className="h-4 w-4 mr-1" />
                Desktop
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="border-red-700/50 text-red-300 hover:bg-red-900/30"
          >
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customization Panel */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Opções de Personalização
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="themes" className="flex items-center gap-1">
                    <Brush className="h-4 w-4" />
                    Temas
                  </TabsTrigger>
                  <TabsTrigger value="backgrounds" className="flex items-center gap-1">
                    <Image className="h-4 w-4" />
                    Fundos
                  </TabsTrigger>
                  <TabsTrigger value="effects" className="flex items-center gap-1">
                    <Sparkles className="h-4 w-4" />
                    Efeitos
                  </TabsTrigger>
                  <TabsTrigger value="advanced" className="flex items-center gap-1">
                    <Settings className="h-4 w-4" />
                    Avançado
                  </TabsTrigger>
                </TabsList>

                {/* Themes Tab */}
                <TabsContent value="themes" className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Temas Disponíveis</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Escolha um tema que combine com seu estilo de jogo
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {themes.map((theme) => (
                      <Card 
                        key={theme.id} 
                        className={`cursor-pointer transition-all ${
                          currentTheme === theme.id 
                            ? 'border-primary shadow-lg shadow-primary/25' 
                            : 'hover:border-red-700/50'
                        }`}
                        onClick={() => handleThemeChange(theme.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div 
                              className="w-12 h-12 rounded-lg border-2 border-border"
                              style={{ background: theme.preview }}
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{theme.name}</h4>
                              <p className="text-xs text-muted-foreground">{theme.description}</p>
                            </div>
                            {currentTheme === theme.id && (
                              <Badge className="bg-primary text-primary-foreground">
                                Ativo
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex gap-1">
                            {Object.entries(theme.colors).map(([name, color]) => (
                              <div
                                key={name}
                                className="w-4 h-4 rounded-sm border border-border"
                                style={{ backgroundColor: color }}
                                title={name}
                              />
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Backgrounds Tab */}
                <TabsContent value="backgrounds" className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Fundos do Perfil</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Personalize o fundo do seu perfil com gradientes, padrões ou imagens
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {backgrounds.map((background) => (
                      <Card
                        key={background.id}
                        className={`cursor-pointer transition-all ${
                          currentBackground === background.id
                            ? 'border-primary shadow-lg shadow-primary/25'
                            : 'hover:border-red-700/50'
                        }`}
                        onClick={() => handleBackgroundChange(background.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div 
                              className="w-16 h-12 rounded-lg border-2 border-border"
                              style={{ background: background.preview }}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{background.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {background.type}
                                </Badge>
                              </div>
                              {currentBackground === background.id && (
                                <Badge className="bg-primary text-primary-foreground text-xs">
                                  Em uso
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Upload de Imagem Personalizada</Label>
                          <p className="text-sm text-muted-foreground">
                            Faça upload de sua própria imagem de fundo
                          </p>
                        </div>
                        <Button variant="outline" className="border-red-700/50 text-red-300 hover:bg-red-900/30">
                          <Upload className="h-4 w-4 mr-1" />
                          Upload
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Effects Tab */}
                <TabsContent value="effects" className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Efeitos Visuais</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Configure efeitos e animações para uma experiência mais imersiva
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Animações de Interface</Label>
                        <p className="text-sm text-muted-foreground">
                          Transições suaves e animações nos elementos
                        </p>
                      </div>
                      <Switch 
                        checked={customizations.animations}
                        onCheckedChange={(checked) => 
                          setCustomizations({...customizations, animations: checked})
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Efeitos de Partículas</Label>
                        <p className="text-sm text-muted-foreground">
                          Partículas flutuantes no fundo do perfil
                        </p>
                      </div>
                      <Switch 
                        checked={customizations.particleEffects}
                        onCheckedChange={(checked) => 
                          setCustomizations({...customizations, particleEffects: checked})
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Efeitos Sonoros</Label>
                        <p className="text-sm text-muted-foreground">
                          Sons de interface e notificações
                        </p>
                      </div>
                      <Switch 
                        checked={customizations.soundEffects}
                        onCheckedChange={(checked) => 
                          setCustomizations({...customizations, soundEffects: checked})
                        }
                      />
                    </div>

                    <Separator />

                    <div>
                      <Label>Estilo da Borda do Perfil</Label>
                      <Select 
                        value={customizations.profileBorder}
                        onValueChange={(value) => 
                          setCustomizations({...customizations, profileBorder: value})
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="glow">Brilho Sutil</SelectItem>
                          <SelectItem value="solid">Borda Sólida</SelectItem>
                          <SelectItem value="animated">Animada</SelectItem>
                          <SelectItem value="none">Sem Borda</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Estilo dos Cards</Label>
                      <Select 
                        value={customizations.cardStyle}
                        onValueChange={(value) => 
                          setCustomizations({...customizations, cardStyle: value})
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="elevated">Elevado</SelectItem>
                          <SelectItem value="flat">Plano</SelectItem>
                          <SelectItem value="outlined">Contornado</SelectItem>
                          <SelectItem value="glass">Vidro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                {/* Advanced Tab */}
                <TabsContent value="advanced" className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Configurações Avançadas</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Opções avançadas de personalização e acessibilidade
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Tamanho da Fonte</Label>
                      <Select 
                        value={customizations.fontSize}
                        onValueChange={(value) => 
                          setCustomizations({...customizations, fontSize: value})
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Pequeno</SelectItem>
                          <SelectItem value="medium">Médio</SelectItem>
                          <SelectItem value="large">Grande</SelectItem>
                          <SelectItem value="extra-large">Extra Grande</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Tema Automático</Label>
                        <p className="text-sm text-muted-foreground">
                          Adapta o tema baseado no horário do dia
                        </p>
                      </div>
                      <Switch 
                        checked={customizations.autoTheme}
                        onCheckedChange={(checked) => 
                          setCustomizations({...customizations, autoTheme: checked})
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Alto Contraste</Label>
                        <p className="text-sm text-muted-foreground">
                          Aumenta o contraste para melhor acessibilidade
                        </p>
                      </div>
                      <Switch 
                        checked={customizations.contrastMode}
                        onCheckedChange={(checked) => 
                          setCustomizations({...customizations, contrastMode: checked})
                        }
                      />
                    </div>

                    <Separator />

                    <Card className="bg-muted/30">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Exportar/Importar Configurações</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Salve suas configurações ou importe de outro dispositivo
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="border-red-700/50 text-red-300 hover:bg-red-900/30">
                            Exportar
                          </Button>
                          <Button variant="outline" size="sm" className="border-red-700/50 text-red-300 hover:bg-red-900/30">
                            Importar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview ao Vivo
                <Badge variant="outline" className="text-xs">
                  {previewMode}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mini Profile Preview */}
              <div 
                className={`relative rounded-lg overflow-hidden ${
                  previewMode === "mobile" ? "h-64" : "h-48"
                } border-2`}
                style={{ 
                  background: currentBackgroundData.preview,
                  borderColor: currentThemeData.colors.primary + "50"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                
                <div className="relative z-10 p-4 h-full flex flex-col justify-end">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar 
                      className={`h-12 w-12 ${
                        customizations.profileBorder === 'glow' 
                          ? `ring-2 ring-[${currentThemeData.colors.primary}]/50` 
                          : ''
                      }`}
                    >
                      <AvatarFallback 
                        className="text-white"
                        style={{ backgroundColor: currentThemeData.colors.primary }}
                      >
                        ME
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white font-medium">MestreEpico</p>
                      <Badge 
                        className="text-xs"
                        style={{ 
                          backgroundColor: currentThemeData.colors.primary,
                          color: 'white'
                        }}
                      >
                        <Crown className="h-3 w-3 mr-1" />
                        Mestre
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Particle effects preview */}
                {customizations.particleEffects && (
                  <>
                    <div className="absolute top-4 left-4 w-1 h-1 bg-white/50 rounded-full animate-pulse"></div>
                    <div className="absolute top-8 right-6 w-1 h-1 bg-white/30 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-12 left-8 w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
                  </>
                )}
              </div>

              {/* Theme Colors */}
              <div>
                <Label className="text-xs">Cores do Tema</Label>
                <div className="flex gap-1 mt-2">
                  {Object.entries(currentThemeData.colors).map(([name, color]) => (
                    <div key={name} className="flex-1">
                      <div
                        className="w-full h-8 rounded border border-border"
                        style={{ backgroundColor: color }}
                        title={`${name}: ${color}`}
                      />
                      <p className="text-xs text-muted-foreground mt-1 text-center">
                        {name.charAt(0).toUpperCase()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Settings Summary */}
              <Card className="bg-muted/30">
                <CardContent className="p-3">
                  <Label className="text-xs">Configurações Ativas</Label>
                  <div className="space-y-1 mt-2 text-xs text-muted-foreground">
                    <div>Tema: {currentThemeData.name}</div>
                    <div>Fundo: {currentBackgroundData.name}</div>
                    <div>Animações: {customizations.animations ? 'Ativadas' : 'Desativadas'}</div>
                    <div>Partículas: {customizations.particleEffects ? 'Ativas' : 'Inativas'}</div>
                    <div>Sons: {customizations.soundEffects ? 'Ativos' : 'Inativos'}</div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleResetToDefault}
          className="border-red-700/50 text-red-300 hover:bg-red-900/30"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Resetar
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" className="border-red-700/50 text-red-300 hover:bg-red-900/30">
            <Wand2 className="h-4 w-4 mr-1" />
            Auto-Personalizar
          </Button>
          <Button onClick={handleSaveCustomizations} className="bg-primary hover:bg-primary/90">
            <Save className="h-4 w-4 mr-1" />
            Salvar Personalizações
          </Button>
        </div>
      </div>
    </div>
  );
}