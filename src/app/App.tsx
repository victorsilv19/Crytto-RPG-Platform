import React, { useState } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { StreamCard } from "./components/StreamCard";
import { CreatorRanking } from "./components/CreatorRanking";
import { ChatArea } from "./components/ChatArea";
import { MarketplaceCard } from "./components/MarketplaceCard";
import { CharacterSheet } from "./components/CharacterSheet";
import { AudioPlayer } from "./components/AudioPlayer";
import { ImmersiveIntro } from "./components/ImmersiveIntro";
import { UserTypeSelection } from "./components/UserTypeSelection";
import { ProfileCustomizer } from "./components/ProfileCustomizer";
import { DiceRoller } from "./components/DiceRoller";
import { CharacterManager } from "./components/CharacterManager";
import { ReplayPlayer } from "./components/ReplayPlayer";
import { EnhancedMarketplace } from "./components/EnhancedMarketplace";
import { CryttsShop } from "./components/CryttsShop";
import { CalendarAgenda } from "./components/CalendarAgenda";
import { ThemeCustomizer } from "./components/ThemeCustomizer";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { toast } from "sonner@2.0.3";
import { Toaster } from "./components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Separator } from "./components/ui/separator";
import { Textarea } from "./components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Switch } from "./components/ui/switch";
import { Label } from "./components/ui/label";
import { Dice6, Map, CloudRain, Volume2, Sparkles, Settings, Upload, Save, X, Image, Palette, Eye, Layers, Link, Bell, Shield, Zap, Users, Crown, User, Play, Pause, Square, Mic, MicOff, Camera, CameraOff, MonitorSpeaker, Music, Film, AlertCircle, Timer, RotateCcw, FileUser, Headphones, Edit, Calendar, Coins, ShoppingCart } from "lucide-react";

type Screen = "landing" | "dashboard" | "stream" | "profile" | "marketplace" | "profile-edit" | "immersive-intro" | "character-sheet" | "audio-center" | "customizer" | "character-manager" | "replay-player" | "enhanced-marketplace" | "crytts-shop" | "calendar" | "theme-customizer" | "user-type-selection";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    // Se não tiver tipo de usuário selecionado, mostra a tela de seleção
    const hasUserType = localStorage.getItem("userTypeSelected");
    return hasUserType ? "landing" : "user-type-selection";
  });
  const [sidebarActive, setSidebarActive] = useState("home");
  const [cryttsBalance, setCryttsBalance] = useState(() => {
    const saved = localStorage.getItem('crytto-balance');
    return saved ? parseInt(saved) : 1250;
  });
  const [userType, setUserType] = useState<"master" | "player">(() => {
    return (localStorage.getItem("userTypeSelected") as "master" | "player") || "master";
  });
  
  // Profile edit state with localStorage persistence
  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem('crytto-profile-data');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      username: "MestreEpico",
      displayName: "MestreEpico",
      bio: "Mestre de RPG há 10 anos, especialista em campanhas épicas de fantasia medieval.",
      bannerType: "gradient", // gradient, solid, custom
      bannerColors: ["#7f1d1d", "#374151"], // red-900, gray-700
      customBannerUrl: "",
      avatarUrl: "",
      isLiveNotifications: true,
      isPublicProfile: true,
      supportEnabled: true,
      supportMessage: "Apoie minhas aventuras épicas!",
      figmaIntegration: true,
      figmaWorkspaceUrl: "",
      autoImportAssets: false,
      streamOverlay: true,
      chatModeration: "moderate", // off, moderate, strict
      donationGoals: true,
      subscriptionTiers: [
        { name: "Aventureiro", price: 10, benefits: ["Chat prioritário", "Emojis exclusivos"] },
        { name: "Herói", price: 25, benefits: ["Acesso antecipado", "Sessões privadas", "Assets exclusivos"] },
        { name: "Lenda", price: 50, benefits: ["Influência na história", "Personagem NPC", "Encontros exclusivos"] }
      ]
    };
  });

  // New component states
  const [isCharacterSheetOpen, setIsCharacterSheetOpen] = useState(false);
  const [showImmersiveIntro, setShowImmersiveIntro] = useState(false);

  // Mock data
  const streams = [
    { id: 1, title: "Campanha: A Lenda do Dragão Dourado", isLive: true, viewers: 234 },
    { id: 2, title: "D&D 5e: Águas Sombrias", isLive: false, viewers: 0 },
    { id: 3, title: "RPG Medieval: Reino de Eldoria", isLive: true, viewers: 89 },
    { id: 4, title: "Cyberpunk: Noite Neon", isLive: false, viewers: 0 },
    { id: 5, title: "Vampire: The Masquerade", isLive: true, viewers: 156 },
    { id: 6, title: "Call of Cthulhu: Mistérios Antigos", isLive: false, viewers: 0 },
  ];

  const creators = [
    { id: 1, name: "MestreEpico", points: 2340 },
    { id: 2, name: "DragonMaster", points: 2156 },
    { id: 3, name: "RPGLegend", points: 1987 },
    { id: 4, name: "DiceMaster", points: 1754 },
    { id: 5, name: "StoryTeller", points: 1432 },
  ];

  const chatMessages = [
    { id: 1, user: "PlayerOne", message: "Que iniciativa incrível!" },
    { id: 2, user: "RogueMaster", message: "Vou tentar desarmar a armadilha", isPaid: true },
    { id: 3, user: "MageWizard", message: "Lanço bola de fogo!" },
    { id: 4, user: "BarbarianKing", message: "ATAQUE FURIOSO!!!" },
    { id: 5, user: "HealerPriest", message: "Curo o bárbaro com 15 HP" },
  ];

  const marketplaceItems = [
    { id: 1, title: "Mapa: Castelo Sombrio", price: 50, rating: 4.8, category: "Mapas" },
    { id: 2, title: "Aventura: O Tesouro Perdido", price: 120, rating: 4.9, category: "Aventuras" },
    { id: 3, title: "Trilha Sonora: Floresta Mística", price: 30, rating: 4.7, category: "Trilha Sonora" },
    { id: 4, title: "Mapa: Taverna do Javali", price: 35, rating: 4.6, category: "Mapas" },
    { id: 5, title: "Aventura: Templo do Caos", price: 95, rating: 4.8, category: "Aventuras" },
    { id: 6, title: "Efeitos Sonoros: Combate", price: 25, rating: 4.5, category: "Trilha Sonora" },
  ];

  const handleSidebarClick = (item: string) => {
    setSidebarActive(item);
    if (item === "home") setCurrentScreen("dashboard");
    if (item === "marketplace") setCurrentScreen("enhanced-marketplace");
    if (item === "profile") setCurrentScreen("profile");
    if (item === "streaming" && userType === "master") setCurrentScreen("stream");
    if (item === "library") {
      setCurrentScreen("replay-player");
    }
    if (item === "calendar") {
      setCurrentScreen("calendar");
    }
    if (item === "tables" || item === "following") {
      setCurrentScreen("character-manager");
    }
    if (item === "achievements") {
      // Implementar conquistas depois
      console.log("Conquistas em desenvolvimento");
    }
    if (item === "settings") {
      // Redirecionar para perfil com aba settings
      setCurrentScreen("profile");
    }
  };

  const renderLandingPage = () => {
    if (showImmersiveIntro) {
      return (
        <div className="relative">
          {/* Toggle back to normal */}
          <div className="fixed top-4 right-4 z-50">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowImmersiveIntro(false)}
              className="border-red-700/50 text-red-300 hover:bg-red-900/30"
            >
              <X className="h-4 w-4 mr-1" />
              Versão Simples
            </Button>
          </div>
          <ImmersiveIntro 
            onGetStarted={() => setCurrentScreen("dashboard")}
            onWatchDemo={() => {
              toast.info("🎬 Demo em desenvolvimento!");
              setCurrentScreen("dashboard");
            }}
          />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background">
        <Header onLogin={() => setCurrentScreen("dashboard")} onSignup={() => setCurrentScreen("dashboard")} />
        
        {/* Toggle for Immersive Intro */}
        <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowImmersiveIntro(true)}
            className="border-red-700/50 text-red-300 hover:bg-red-900/30"
          >
            <Sparkles className="h-4 w-4 mr-1" />
            Versão Imersiva
          </Button>
          
          {/* Dev: Reset User Type */}
          {localStorage.getItem("userTypeSelected") && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                localStorage.removeItem("userTypeSelected");
                setCurrentScreen("user-type-selection");
                toast.info("🔄 Redefinindo tipo de usuário...");
              }}
              className="border-yellow-700/50 text-yellow-300 hover:bg-yellow-900/30"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Resetar Tipo
            </Button>
          )}
        </div>
        
        {/* Hero Section */}
        <section className="py-20 px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gray-800 border border-red-900/30 h-64 rounded-lg mb-8 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-transparent"></div>
              <span className="text-gray-400 relative z-10">Imagem: Mesa de RPG</span>
            </div>
            <h1 className="mb-6 text-foreground">Onde mundos nascem e histórias ganham vida</h1>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              A plataforma definitiva para streaming de RPG. Conecte-se com mestres, assista transmissões ao vivo e participe de aventuras épicas.
            </p>
            <Button size="lg" onClick={() => setCurrentScreen("dashboard")} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-red-900/30">
              Começar Aventura
            </Button>
          </div>
        </section>

      {/* Feature Cards */}
      <section className="py-16 px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Streaming", desc: "Transmita suas sessões ao vivo" },
              { title: "Replay", desc: "Assista sessões gravadas" },
              { title: "Comunidade", desc: "Conecte-se com outros jogadores" },
              { title: "Marketplace", desc: "Compre e venda assets de RPG" },
            ].map((feature, index) => (
              <Card key={index} className="text-center bg-card border-border hover:border-red-700/50 transition-colors">
                <CardHeader>
                  <div className="bg-red-900/30 border border-red-700/50 h-16 w-16 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <div className="w-8 h-8 bg-red-600/50 rounded"></div>
                  </div>
                  <CardTitle className="text-card-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-red-900/20 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center gap-8">
            <span className="text-sm text-muted-foreground hover:text-red-400 cursor-pointer transition-colors">Sobre</span>
            <span className="text-sm text-muted-foreground hover:text-red-400 cursor-pointer transition-colors">Suporte</span>
            <span className="text-sm text-muted-foreground hover:text-red-400 cursor-pointer transition-colors">Termos</span>
            <span className="text-sm text-muted-foreground hover:text-red-400 cursor-pointer transition-colors">Privacidade</span>
          </div>
        </div>
      </footer>
    </div>
    );
  };

  const renderDashboard = () => (
    <div className="min-h-screen bg-background">
      <Header 
        showAuth={false} 
        balance={cryttsBalance} 
        userType={userType} 
        onUserTypeChange={() => {
          const newType = userType === "master" ? "player" : "master";
          setUserType(newType);
          localStorage.setItem("userTypeSelected", newType);
        }}
        onProfileClick={() => setCurrentScreen("profile")}
      />
      

      <div className="flex">
        <Sidebar activeItem={sidebarActive} onItemClick={handleSidebarClick} userType={userType} />
        
        <main className="flex-1 p-6">
          <div className="flex gap-6">
            {/* Main content */}
            <div className="flex-1">
              {/* Stream Action for Masters */}
              {userType === "master" && (
                <Card className="mb-6 bg-gradient-to-r from-red-900/20 to-red-700/10 border-red-700/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">Pronto para mais uma aventura?</h3>
                        <p className="text-sm text-muted-foreground">Conecte-se com seus jogadores e inicie uma nova sessão épica</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="border-red-700/50 text-red-300 hover:bg-red-900/30">
                          <Settings className="h-4 w-4 mr-2" />
                          Configurar
                        </Button>
                        <Button onClick={() => setCurrentScreen("stream")} className="bg-primary hover:bg-primary/90">
                          <Zap className="h-4 w-4 mr-2" />
                          Entrar ao Vivo
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* New Features Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="hover:border-red-700/50 transition-colors cursor-pointer" onClick={() => setIsCharacterSheetOpen(true)}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-900/30 to-red-700/20 border border-red-500/50 rounded-lg flex items-center justify-center">
                        <FileUser className="h-6 w-6 text-red-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">Ficha de Personagem</h3>
                        <p className="text-sm text-muted-foreground">Gerencie fichas interativas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="hover:border-red-700/50 transition-colors cursor-pointer" onClick={() => setCurrentScreen("character-manager")}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-900/30 to-red-700/20 border border-red-500/50 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-red-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{userType === "master" ? "Gerenciar Personagens" : "Meus Personagens"}</h3>
                        <p className="text-sm text-muted-foreground">Lista de personagens</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="hover:border-red-700/50 transition-colors cursor-pointer" onClick={() => setCurrentScreen("audio-center")}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-900/30 to-red-700/20 border border-red-500/50 rounded-lg flex items-center justify-center">
                        <Headphones className="h-6 w-6 text-red-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">Central de Áudio</h3>
                        <p className="text-sm text-muted-foreground">Trilhas e efeitos sonoros</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="hover:border-red-700/50 transition-colors cursor-pointer" onClick={() => setCurrentScreen("theme-customizer")}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-900/30 to-red-700/20 border border-red-500/50 rounded-lg flex items-center justify-center">
                        <Palette className="h-6 w-6 text-red-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">Temas</h3>
                        <p className="text-sm text-muted-foreground">Personalize cores e visual</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <h2 className="mb-6">Transmissões em Destaque</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {streams.map((stream) => (
                  <StreamCard
                    key={stream.id}
                    title={stream.title}
                    isLive={stream.isLive}
                    viewers={stream.viewers}
                    onClick={() => setCurrentScreen("stream")}
                  />
                ))}
              </div>
            </div>
            
            {/* Right sidebar */}
            <div className="w-80">
              <CreatorRanking creators={creators} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );

  const renderStreamPage = () => (
    <div className="min-h-screen bg-background">
      <Header 
        showAuth={false} 
        balance={cryttsBalance} 
        userType={userType} 
        onUserTypeChange={() => {
          const newType = userType === "master" ? "player" : "master";
          setUserType(newType);
          localStorage.setItem("userTypeSelected", newType);
        }}
        onProfileClick={() => setCurrentScreen("profile")}
      />
      <div className="p-6">
        <div className="mb-6">
          <Button variant="outline" onClick={() => setCurrentScreen("dashboard")}>
            ← Voltar ao Dashboard
          </Button>
        </div>
        <div className="flex gap-6">
          {/* Left column - Tools (only for Masters) */}
          {userType === "master" && (
            <div className="w-80 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Fichas Digitais</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="char1" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="char1" className="text-xs">Guerreiro</TabsTrigger>
                    <TabsTrigger value="char2" className="text-xs">Mago</TabsTrigger>
                    <TabsTrigger value="char3" className="text-xs">Ladino</TabsTrigger>
                  </TabsList>
                  <TabsContent value="char1" className="mt-4">
                    <div className="bg-gray-800 border border-red-900/30 p-3 rounded text-xs text-gray-300">
                      <div>HP: 45/50</div>
                      <div>CA: 18</div>
                      <div>Força: 16</div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full mt-2 border-red-700/50 text-red-300 hover:bg-red-900/30"
                      onClick={() => setIsCharacterSheetOpen(true)}
                    >
                      <FileUser className="h-3 w-3 mr-1" />
                      Ficha Completa
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <DiceRoller onRoll={(result) => {
              console.log("Dice rolled:", result);
              // Aqui podemos enviar o resultado para outros jogadores no chat
            }} />

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Mapa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-800 border border-red-900/30 h-32 rounded flex items-center justify-center cursor-pointer hover:border-red-700/50 transition-colors">
                  <Map className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            {/* Stream Controls - Only for Masters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Controles de Stream</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Stream Status */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Status:</span>
                  <Badge className="bg-red-500 text-white">AO VIVO</Badge>
                </div>
                
                {/* Basic Controls */}
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs"
                    onClick={() => toast.info("🎤 Microfone desativado")}
                  >
                    <Mic className="h-3 w-3 mr-1" />
                    Mute
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs"
                    onClick={() => toast.info("📹 Câmera pausada")}
                  >
                    <Camera className="h-3 w-3 mr-1" />
                    Cam
                  </Button>
                </div>
                
                {/* Stream Time */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Tempo:</span>
                  <span className="text-xs text-green-400">2h 15m</span>
                </div>
              </CardContent>
            </Card>

            {/* Media Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Efeitos & Mídia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Sound Effects */}
                <div>
                  <Label className="text-xs">Efeitos Sonoros</Label>
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs p-1"
                      onClick={() => toast.success("🌩️ Efeito de trovão reproduzido!")}
                    >
                      <Volume2 className="h-3 w-3 mr-1" />
                      Trovão
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs p-1"
                      onClick={() => toast.success("🎵 Música épica iniciada!")}
                    >
                      <Music className="h-3 w-3 mr-1" />
                      Épico
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs p-1"
                      onClick={() => toast.success("⚔️ Som de batalha ativo!")}
                    >
                      <MonitorSpeaker className="h-3 w-3 mr-1" />
                      Batalha
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs p-1"
                      onClick={() => toast.warning("🚨 Alerta enviado aos jogadores!")}
                    >
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Alerta
                    </Button>
                  </div>
                </div>
                
                {/* Video Ads */}
                <div>
                  <Label className="text-xs">Vídeos/Ads</Label>
                  <div className="space-y-1 mt-1">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full text-xs justify-start"
                      onClick={() => toast.success("🎬 Intro da campanha iniciada!")}
                    >
                      <Film className="h-3 w-3 mr-1" />
                      Intro Campanha
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full text-xs justify-start"
                      onClick={() => toast.info("📺 Pausa para patrocínio - 30 segundos")}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Sponsor Break
                    </Button>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div>
                  <Label className="text-xs">Ações Rápidas</Label>
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs p-1"
                      onClick={() => toast.info("⏸️ Pausa de 5 minutos iniciada")}
                    >
                      <Timer className="h-3 w-3 mr-1" />
                      Break
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs p-1"
                      onClick={() => toast.info("🔄 Replay dos últimos 30 segundos")}
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Replay
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Viewer Interaction */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Interação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Espectadores:</span>
                  <span className="text-xs text-primary">234</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Crytts recebidos:</span>
                  <span className="text-xs text-green-400">+156</span>
                </div>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full text-xs"
                  onClick={() => toast.success("✨ Evento especial ativado! Os jogadores foram notificados.")}
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Ativar Evento
                </Button>
              </CardContent>
            </Card>
          </div>
          )}

          {/* Center - Video Player */}
          <div className={userType === "master" ? "flex-1" : "flex-1 max-w-4xl mx-auto"}>
            <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative">
              <span className="text-white">Player de Vídeo</span>
              <Badge className="bg-red-500 absolute top-4 left-4">
                LIVE
              </Badge>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center gap-3 mb-2">
                <h2>Campanha: A Lenda do Dragão Dourado</h2>
                {userType === "master" && (
                  <Badge variant="outline" className="border-red-700/50 text-red-300">
                    <Crown className="h-3 w-3 mr-1" />
                    Sua Stream
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 mt-2">
                {userType === "master" 
                  ? "Você está transmitindo ao vivo! Use os controles à esquerda para gerenciar sua sessão."
                  : "Uma campanha épica de fantasia medieval comandada pelo MestreEpico. Participe da aventura!"}
              </p>
              
              {/* Crytts interaction buttons - available for all users */}
              <div className="flex gap-2 mt-4">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-red-700/50 text-red-300 hover:bg-red-900/30"
                  onClick={() => {
                    toast.success("🌩️ Você ativou uma tempestade! (-10 Crytts)");
                  }}
                >
                  <CloudRain className="h-4 w-4 mr-1" />
                  Tempestade (10)
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-red-700/50 text-red-300 hover:bg-red-900/30"
                  onClick={() => {
                    toast.success("🎵 Som épico ativado! (-5 Crytts)");
                  }}
                >
                  <Volume2 className="h-4 w-4 mr-1" />
                  Som Épico (5)
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-red-700/50 text-red-300 hover:bg-red-900/30"
                  onClick={() => {
                    toast.success("✨ Evento especial criado! (-15 Crytts)");
                  }}
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  Evento (15)
                </Button>
              </div>
              
              {/* Player Info Panel for regular players */}
              {userType === "player" && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-sm">Informações do Espectador</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tipo de conta:</span>
                      <Badge variant="outline" className="border-blue-700/50 text-blue-300">
                        <User className="h-3 w-3 mr-1" />
                        Jogador
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tempo assistindo:</span>
                      <span className="text-sm">2h 15m</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Crytts gastos hoje:</span>
                      <span className="text-sm text-primary">45</span>
                    </div>
                    <Separator />
                    <p className="text-xs text-muted-foreground">
                      Como jogador, você pode assistir streams, interagir com o chat e apoiar criadores com Crytts.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Right column - Chat */}
          <div className="w-80">
            <ChatArea messages={chatMessages} userType={userType} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="min-h-screen bg-background">
      <Header 
        showAuth={false} 
        balance={cryttsBalance} 
        userType={userType} 
        onUserTypeChange={() => {
          const newType = userType === "master" ? "player" : "master";
          setUserType(newType);
          localStorage.setItem("userTypeSelected", newType);
        }}
        onProfileClick={() => setCurrentScreen("profile")}
      />
      
      <div className="px-6 pt-6">
        <Button variant="outline" onClick={() => setCurrentScreen("dashboard")}>
          ← Voltar ao Dashboard
        </Button>
      </div>
      
      {/* Banner */}
      <div 
        className={`h-48 flex items-center justify-center relative overflow-hidden ${
          profileData.bannerType === 'gradient' 
            ? `bg-gradient-to-r` 
            : profileData.bannerType === 'solid'
            ? ''
            : 'bg-gray-800'
        }`}
        style={{
          backgroundImage: profileData.bannerType === 'gradient' 
            ? `linear-gradient(to right, ${profileData.bannerColors[0]}, ${profileData.bannerColors[1]})`
            : profileData.bannerType === 'solid'
            ? `linear-gradient(${profileData.bannerColors[0]}, ${profileData.bannerColors[0]})`
            : profileData.customBannerUrl
            ? `url(${profileData.customBannerUrl})`
            : 'linear-gradient(to right, #7f1d1d, #374151)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <span className="text-white relative z-10">Banner Personalizável</span>
      </div>
      
      {/* Profile Info */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-red-900/30 border border-red-700/50 text-red-200">
                {profileData.displayName.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              size="sm"
              className="absolute -bottom-2 -right-2 h-8 w-8 p-0 rounded-full border-red-700/50 text-red-300 hover:bg-red-900/30"
              onClick={() => setCurrentScreen("profile-edit")}
            >
              <Image className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-foreground">{profileData.displayName}</h2>
              <Badge variant="outline" className={userType === "master" ? "border-red-700/50 text-red-300" : "border-blue-700/50 text-blue-300"}>
                {userType === "master" ? (
                  <>
                    <Crown className="h-3 w-3 mr-1" />
                    Mestre
                  </>
                ) : (
                  <>
                    <User className="h-3 w-3 mr-1" />
                    Jogador
                  </>
                )}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground flex-1">{profileData.bio}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newBio = prompt("Edite sua biografia:", profileData.bio);
                  if (newBio !== null) {
                    const updatedProfile = {...profileData, bio: newBio};
                    setProfileData(updatedProfile);
                    localStorage.setItem('crytto-profile-data', JSON.stringify(updatedProfile));
                    toast.success("✏️ Biografia atualizada!");
                  }
                }}
                className="text-xs opacity-70 hover:opacity-100"
              >
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            {userType === "master" && (
              <Button variant="outline" onClick={() => setCurrentScreen("profile-edit")} className="border-red-700/50 text-red-300 hover:bg-red-900/30">
                <Settings className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => setCurrentScreen("crytts-shop")}
              className="border-green-700/50 text-green-300 hover:bg-green-900/30"
            >
              <Coins className="h-4 w-4 mr-2" />
              Comprar Crytts
            </Button>
            <Button className="bg-primary hover:bg-primary/90">Apoiar</Button>
          </div>
        </div>
        
        <Tabs defaultValue="agenda" className="w-full">
          <TabsList>
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
            <TabsTrigger value="replays">Replays</TabsTrigger>
            <TabsTrigger value="worlds">Meus Mundos</TabsTrigger>
            {userType === "master" && <TabsTrigger value="marketplace">Marketplace</TabsTrigger>}
            {userType === "player" && <TabsTrigger value="favorites">Favoritos</TabsTrigger>}
            {userType === "master" && <TabsTrigger value="settings">Configurações</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="agenda" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle className="text-sm">Sessão {i}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Data: 25/12/2024</p>
                    <p className="text-sm text-muted-foreground">Horário: 19:00</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="replays" className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Sessões Gravadas</h3>
                <p className="text-sm text-muted-foreground">
                  {userType === "master" 
                    ? "Gerencie e reproduza suas sessões gravadas." 
                    : "Assista novamente suas sessões favoritas."}
                </p>
              </div>
              {userType === "master" && (
                <Button
                  onClick={() => setCurrentScreen("replay-player")}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Player Avançado
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {streams.filter(s => !s.isLive).map((stream) => (
                <Card key={stream.id} className="hover:border-red-700/50 transition-colors cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="bg-gray-800 border border-red-900/30 h-32 rounded-lg mb-2 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-transparent"></div>
                      <Play className="h-12 w-12 text-red-400 relative z-10" />
                      <Badge className="absolute top-2 right-2 bg-black/70 text-white text-xs">
                        2:30:15
                      </Badge>
                    </div>
                    <CardTitle className="text-sm leading-tight">{stream.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      15/01/2024
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      234 visualizações
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setCurrentScreen("replay-player")}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Assistir
                      </Button>
                      {userType === "master" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-700/50 text-red-300 hover:bg-red-900/30"
                        >
                          <Settings className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="worlds" className="mt-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-foreground mb-2">Meus Mundos de RPG</h3>
              <p className="text-sm text-muted-foreground">
                {userType === "master" 
                  ? "Mundos criados por você para suas campanhas e aventuras." 
                  : "Mundos que você explora como jogador."}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { id: 1, name: "Reino de Eldoria", description: "Um mundo de fantasia medieval com dragões e magia", campaigns: 12, role: userType === "master" ? "Criador" : "Explorador" },
                { id: 2, name: "Nova Arcádia", description: "Cidade cyberpunk futurista com alta tecnologia", campaigns: 8, role: userType === "master" ? "Criador" : "Visitante" },
                { id: 3, name: "Terras Sombrias", description: "Mundo gótico de horror e mistério", campaigns: 5, role: userType === "master" ? "Criador" : "Sobrevivente" },
                { id: 4, name: "Império Celestial", description: "Reino nos céus com anjos e divindades", campaigns: 15, role: userType === "master" ? "Criador" : "Peregrino" }
              ].map((world) => (
                <Card key={world.id} className="hover:border-red-700/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="bg-gray-800 border border-red-900/30 h-32 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-transparent"></div>
                      <Map className="h-12 w-12 text-gray-400 relative z-10" />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-base">{world.name}</CardTitle>
                      <Badge variant="outline" className={userType === "master" ? "border-red-700/50 text-red-300" : "border-blue-700/50 text-blue-300"}>
                        {world.role}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{world.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="border-gray-700/50 text-gray-300">
                        {world.campaigns} {userType === "master" ? "campanhas" : "aventuras"}
                      </Badge>
                      <Button variant="outline" size="sm" className="border-red-700/50 text-red-300 hover:bg-red-900/30">
                        {userType === "master" ? "Gerenciar" : "Explorar"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {userType === "master" && (
              <div className="mt-6">
                <Button variant="outline" className="border-red-700/50 text-red-300 hover:bg-red-900/30">
                  + Criar Novo Mundo
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="marketplace" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { id: 1, title: "Mapa: Taverna Élfica", price: 45, sales: 23, type: "Mapa" },
                { id: 2, title: "Aventura: A Torre do Mago", price: 89, sales: 15, type: "Aventura" },
                { id: 3, title: "Trilha: Batalha Épica", price: 32, sales: 67, type: "Áudio" },
                { id: 4, title: "Token Set: Criaturas", price: 25, sales: 45, type: "Tokens" }
              ].map((item) => (
                <Card key={item.id} className="hover:border-red-700/50 transition-colors">
                  <CardHeader>
                    <div className="bg-gray-800 border border-red-900/30 h-32 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-transparent"></div>
                      <span className="text-gray-400 relative z-10 text-sm">{item.type}</span>
                    </div>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-primary font-medium">{item.price} Crytts</span>
                      <span className="text-sm text-muted-foreground">{item.sales} vendas</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 border-red-700/50 text-red-300 hover:bg-red-900/30">
                        Editar
                      </Button>
                      <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                        Estatísticas
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-6">
              <Button variant="outline" className="border-red-700/50 text-red-300 hover:bg-red-900/30">
                + Adicionar Produto
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-foreground mb-2">Meus Favoritos</h3>
              <p className="text-sm text-muted-foreground">
                Streamers, mundos e conteúdos que você mais gosta de acompanhar.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Favorite Streamers */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Streamers Favoritos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: "MestreEpico", followers: "2.3k", status: "online" },
                      { name: "DragonMaster", followers: "1.8k", status: "offline" },
                      { name: "RPGLegend", followers: "3.1k", status: "online" }
                    ].map((streamer, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-red-900/30 border border-red-700/50 text-red-200 text-xs">
                            {streamer.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{streamer.name}</p>
                            <div className={`w-2 h-2 rounded-full ${streamer.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`} />
                          </div>
                          <p className="text-sm text-muted-foreground">{streamer.followers} seguidores</p>
                        </div>
                        <Button variant="outline" size="sm" className="border-red-700/50 text-red-300 hover:bg-red-900/30">
                          Ver Perfil
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Favorite Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Conteúdo Favorito</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { title: "Mapa: Taverna Mística", category: "Mapa", price: 25 },
                      { title: "Trilha: Batalha Final", category: "Áudio", price: 15 },
                      { title: "Aventura: O Cristal Perdido", category: "Aventura", price: 45 }
                    ].map((item, index) => (
                      <Card key={index} className="bg-muted/30 border-red-700/30">
                        <CardHeader className="pb-3">
                          <div className="bg-gray-800 border border-red-900/30 h-20 rounded-lg mb-2 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">{item.category}</span>
                          </div>
                          <CardTitle className="text-sm">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between">
                            <span className="text-primary font-medium">{item.price} Crytts</span>
                            <Button variant="outline" size="sm" className="border-red-700/50 text-red-300 hover:bg-red-900/30">
                              Ver
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Figma Integration */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    <CardTitle>Integração Figma</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Ativar integração Figma</Label>
                      <p className="text-sm text-muted-foreground">Conecte seu workspace do Figma para importar designs</p>
                    </div>
                    <Switch 
                      checked={profileData.figmaIntegration}
                      onCheckedChange={(checked) => setProfileData({...profileData, figmaIntegration: checked})}
                    />
                  </div>
                  
                  {profileData.figmaIntegration && (
                    <div className="space-y-3">
                      <div>
                        <Label>URL do Workspace Figma</Label>
                        <div className="flex gap-2 mt-1">
                          <Input 
                            value={profileData.figmaWorkspaceUrl}
                            onChange={(e) => setProfileData({...profileData, figmaWorkspaceUrl: e.target.value})}
                            placeholder="https://figma.com/workspace/..."
                            className="flex-1"
                          />
                          <Button variant="outline" className="border-red-700/50 text-red-300 hover:bg-red-900/30">
                            <Link className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Auto-importar assets</Label>
                          <p className="text-sm text-muted-foreground">Importa automaticamente novos designs</p>
                        </div>
                        <Switch 
                          checked={profileData.autoImportAssets}
                          onCheckedChange={(checked) => setProfileData({...profileData, autoImportAssets: checked})}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Stream Settings */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <CardTitle>Configurações de Stream</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Overlay de stream</Label>
                      <p className="text-sm text-muted-foreground">Exibe informações da campanha na tela</p>
                    </div>
                    <Switch 
                      checked={profileData.streamOverlay}
                      onCheckedChange={(checked) => setProfileData({...profileData, streamOverlay: checked})}
                    />
                  </div>
                  
                  <div>
                    <Label>Moderação do chat</Label>
                    <Select value={profileData.chatModeration} onValueChange={(value) => setProfileData({...profileData, chatModeration: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="off">Desligada</SelectItem>
                        <SelectItem value="moderate">Moderada</SelectItem>
                        <SelectItem value="strict">Rigorosa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Metas de doação</Label>
                      <p className="text-sm text-muted-foreground">Exibe progresso de metas em Crytts</p>
                    </div>
                    <Switch 
                      checked={profileData.donationGoals}
                      onCheckedChange={(checked) => setProfileData({...profileData, donationGoals: checked})}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Subscription Tiers */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <CardTitle>Níveis de Assinatura</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {profileData.subscriptionTiers.map((tier, index) => (
                      <Card key={index} className="bg-muted/30 border-red-700/30">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{tier.name}</CardTitle>
                            <Badge variant="outline" className="border-red-700/50 text-red-300">
                              {tier.price} Crytts/mês
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <ul className="space-y-2">
                            {tier.benefits.map((benefit, benefitIndex) => (
                              <li key={benefitIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                                <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                          <Button variant="outline" size="sm" className="w-full mt-3 border-red-700/50 text-red-300 hover:bg-red-900/30">
                            Editar Nível
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="mt-4 border-red-700/50 text-red-300 hover:bg-red-900/30">
                    + Adicionar Novo Nível
                  </Button>
                </CardContent>
              </Card>

              {/* Privacy & Security */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <CardTitle>Privacidade & Segurança</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Perfil público</Label>
                      <p className="text-sm text-muted-foreground">Visível para todos os usuários</p>
                    </div>
                    <Switch 
                      checked={profileData.isPublicProfile}
                      onCheckedChange={(checked) => setProfileData({...profileData, isPublicProfile: checked})}
                    />
                  </div>
                  
                  <Button variant="outline" className="w-full border-red-700/50 text-red-300 hover:bg-red-900/30">
                    <Shield className="h-4 w-4 mr-2" />
                    Gerenciar Dados
                  </Button>
                  
                  <Button variant="outline" className="w-full border-red-700/50 text-red-300 hover:bg-red-900/30">
                    Exportar Dados
                  </Button>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <CardTitle>Notificações</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notificações de live</Label>
                      <p className="text-sm text-muted-foreground">Avisos quando entrar ao vivo</p>
                    </div>
                    <Switch 
                      checked={profileData.isLiveNotifications}
                      onCheckedChange={(checked) => setProfileData({...profileData, isLiveNotifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Novos seguidores</Label>
                      <p className="text-sm text-muted-foreground">Avisos de novos seguidores</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Apoios recebidos</Label>
                      <p className="text-sm text-muted-foreground">Avisos de doações em Crytts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Atualizações da plataforma</Label>
                      <p className="text-sm text-muted-foreground">Novidades e funcionalidades</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Save Settings Button */}
            <div className="mt-6 flex justify-end">
              <Button className="bg-primary hover:bg-primary/90">
                <Save className="h-4 w-4 mr-2" />
                Salvar Configurações
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  const renderProfileEdit = () => (
    <div className="min-h-screen bg-background">
      <Header 
        showAuth={false} 
        balance={cryttsBalance} 
        userType={userType} 
        onUserTypeChange={() => {
          const newType = userType === "master" ? "player" : "master";
          setUserType(newType);
          localStorage.setItem("userTypeSelected", newType);
        }}
        onProfileClick={() => setCurrentScreen("profile")}
      />
      
      {/* Header with preview */}
      <div className="border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-foreground">Editar Perfil</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCurrentScreen("profile")} className="border-red-700/50 text-red-300 hover:bg-red-900/30">
              <Eye className="h-4 w-4 mr-2" />
              Visualizar
            </Button>
            <Button onClick={() => setCurrentScreen("profile")} className="bg-primary hover:bg-primary/90">
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Edit Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Nome de usuário</Label>
                    <Input 
                      id="username"
                      value={profileData.username}
                      onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                      placeholder="@mestreepico"
                    />
                  </div>
                  <div>
                    <Label htmlFor="displayName">Nome de exibição</Label>
                    <Input 
                      id="displayName"
                      value={profileData.displayName}
                      onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                      placeholder="MestreEpico"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="bio">Biografia</Label>
                  <Textarea 
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    placeholder="Conte um pouco sobre você e suas aventuras..."
                    className="min-h-24"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Banner Customization */}
            <Card>
              <CardHeader>
                <CardTitle>Banner do Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Banner Preview */}
                <div className="relative">
                  <div 
                    className={`h-32 rounded-lg flex items-center justify-center relative overflow-hidden ${
                      profileData.bannerType === 'gradient' 
                        ? `bg-gradient-to-r` 
                        : profileData.bannerType === 'solid'
                        ? ''
                        : 'bg-gray-800'
                    }`}
                    style={{
                      backgroundImage: profileData.bannerType === 'gradient' 
                        ? `linear-gradient(to right, ${profileData.bannerColors[0]}, ${profileData.bannerColors[1]})`
                        : profileData.bannerType === 'solid'
                        ? `linear-gradient(${profileData.bannerColors[0]}, ${profileData.bannerColors[0]})`
                        : profileData.customBannerUrl
                        ? `url(${profileData.customBannerUrl})`
                        : undefined
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <span className="text-white relative z-10">Preview do Banner</span>
                  </div>
                </div>

                {/* Banner Type Selection */}
                <div>
                  <Label>Tipo de Banner</Label>
                  <Select value={profileData.bannerType} onValueChange={(value) => setProfileData({...profileData, bannerType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gradient">Gradiente</SelectItem>
                      <SelectItem value="solid">Cor sólida</SelectItem>
                      <SelectItem value="custom">Imagem personalizada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Color Pickers for Gradient/Solid */}
                {(profileData.bannerType === 'gradient' || profileData.bannerType === 'solid') && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Cor primária</Label>
                      <div className="flex gap-2">
                        <Input 
                          type="color"
                          value={profileData.bannerColors[0]}
                          onChange={(e) => setProfileData({
                            ...profileData, 
                            bannerColors: [e.target.value, profileData.bannerColors[1]]
                          })}
                          className="w-16 h-10 p-1"
                        />
                        <Input 
                          value={profileData.bannerColors[0]}
                          onChange={(e) => setProfileData({
                            ...profileData, 
                            bannerColors: [e.target.value, profileData.bannerColors[1]]
                          })}
                          placeholder="#7f1d1d"
                          className="flex-1"
                        />
                      </div>
                    </div>
                    {profileData.bannerType === 'gradient' && (
                      <div>
                        <Label>Cor secundária</Label>
                        <div className="flex gap-2">
                          <Input 
                            type="color"
                            value={profileData.bannerColors[1]}
                            onChange={(e) => setProfileData({
                              ...profileData, 
                              bannerColors: [profileData.bannerColors[0], e.target.value]
                            })}
                            className="w-16 h-10 p-1"
                          />
                          <Input 
                            value={profileData.bannerColors[1]}
                            onChange={(e) => setProfileData({
                              ...profileData, 
                              bannerColors: [profileData.bannerColors[0], e.target.value]
                            })}
                            placeholder="#374151"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Custom Image Upload */}
                {profileData.bannerType === 'custom' && (
                  <div>
                    <Label>URL da Imagem</Label>
                    <div className="flex gap-2">
                      <Input 
                        value={profileData.customBannerUrl}
                        onChange={(e) => setProfileData({...profileData, customBannerUrl: e.target.value})}
                        placeholder="https://example.com/banner.jpg"
                        className="flex-1"
                      />
                      <Button variant="outline" className="border-red-700/50 text-red-300 hover:bg-red-900/30">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Preset Templates */}
                <div>
                  <Label>Templates rápidos</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {[
                      { name: "Fogo", colors: ["#7f1d1d", "#dc2626"] },
                      { name: "Dragão", colors: ["#450a0a", "#7f1d1d"] },
                      { name: "Místico", colors: ["#581c87", "#7c3aed"] },
                      { name: "Floresta", colors: ["#14532d", "#16a34a"] },
                      { name: "Oceano", colors: ["#0c4a6e", "#0ea5e9"] },
                      { name: "Sombrio", colors: ["#0a0a0a", "#404040"] },
                      { name: "Ouro", colors: ["#78350f", "#f59e0b"] },
                      { name: "Prata", colors: ["#374151", "#9ca3af"] }
                    ].map((template, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-12 p-1 border-red-700/50 hover:border-red-500"
                        onClick={() => setProfileData({
                          ...profileData, 
                          bannerType: 'gradient',
                          bannerColors: template.colors
                        })}
                      >
                        <div 
                          className="w-full h-full rounded-sm"
                          style={{
                            backgroundImage: `linear-gradient(to right, ${template.colors[0]}, ${template.colors[1]})`
                          }}
                          title={template.name}
                        />
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Avatar */}
            <Card>
              <CardHeader>
                <CardTitle>Avatar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-red-900/30 border border-red-700/50 text-red-200">
                      {profileData.displayName.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Label>URL do Avatar</Label>
                    <div className="flex gap-2">
                      <Input 
                        value={profileData.avatarUrl}
                        onChange={(e) => setProfileData({...profileData, avatarUrl: e.target.value})}
                        placeholder="https://example.com/avatar.jpg"
                        className="flex-1"
                      />
                      <Button variant="outline" className="border-red-700/50 text-red-300 hover:bg-red-900/30">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Apoio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Ativar apoios</Label>
                    <p className="text-sm text-muted-foreground">Permite que seguidores te apoiem com Crytts</p>
                  </div>
                  <Switch 
                    checked={profileData.supportEnabled}
                    onCheckedChange={(checked) => setProfileData({...profileData, supportEnabled: checked})}
                  />
                </div>
                
                {profileData.supportEnabled && (
                  <div>
                    <Label>Mensagem de apoio</Label>
                    <Input 
                      value={profileData.supportMessage}
                      onChange={(e) => setProfileData({...profileData, supportMessage: e.target.value})}
                      placeholder="Apoie minhas aventuras épicas!"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-sm">Preview ao Vivo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mini Banner Preview */}
                <div 
                  className={`h-24 rounded-lg flex items-center justify-center relative overflow-hidden ${
                    profileData.bannerType === 'gradient' 
                      ? `bg-gradient-to-r` 
                      : profileData.bannerType === 'solid'
                      ? ''
                      : 'bg-gray-800'
                  }`}
                  style={{
                    backgroundImage: profileData.bannerType === 'gradient' 
                      ? `linear-gradient(to right, ${profileData.bannerColors[0]}, ${profileData.bannerColors[1]})`
                      : profileData.bannerType === 'solid'
                      ? `linear-gradient(${profileData.bannerColors[0]}, ${profileData.bannerColors[0]})`
                      : profileData.customBannerUrl
                      ? `url(${profileData.customBannerUrl})`
                      : undefined
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                {/* Mini Profile Info */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-red-900/30 border border-red-700/50 text-red-200 text-xs">
                      {profileData.displayName.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-card-foreground">{profileData.displayName}</p>
                    <p className="text-xs text-muted-foreground">@{profileData.username}</p>
                  </div>
                </div>

                {/* Mini Bio */}
                <div>
                  <p className="text-xs text-muted-foreground line-clamp-3">{profileData.bio}</p>
                </div>

                {/* Privacy Settings */}
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Perfil público</Label>
                    <Switch 
                      checked={profileData.isPublicProfile}
                      onCheckedChange={(checked) => setProfileData({...profileData, isPublicProfile: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Notificações live</Label>
                    <Switch 
                      checked={profileData.isLiveNotifications}
                      onCheckedChange={(checked) => setProfileData({...profileData, isLiveNotifications: checked})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={() => setCurrentScreen("profile")}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" className="border-red-700/50 text-red-300 hover:bg-red-900/30">
              Resetar
            </Button>
            <Button onClick={() => setCurrentScreen("profile")} className="bg-primary hover:bg-primary/90">
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMarketplace = () => (
    <div className="min-h-screen bg-background">
      <Header 
        showAuth={false} 
        balance={cryttsBalance} 
        userType={userType} 
        onUserTypeChange={() => {
          const newType = userType === "master" ? "player" : "master";
          setUserType(newType);
          localStorage.setItem("userTypeSelected", newType);
        }}
        onProfileClick={() => setCurrentScreen("profile")}
      />
      <div className="flex">
        <Sidebar activeItem={sidebarActive} onItemClick={handleSidebarClick} userType={userType} />
        
        <main className="flex-1 p-6">
          <div className="flex gap-6">
            {/* Filters */}
            <div className="w-64">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Filtros</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Categoria</label>
                    <div className="mt-2 space-y-2">
                      {["Mapas", "Aventuras", "Trilha Sonora"].map((cat) => (
                        <label key={cat} className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <label className="text-sm font-medium">Preço</label>
                    <div className="mt-2 flex gap-2">
                      <Input placeholder="Min" className="text-sm" />
                      <Input placeholder="Max" className="text-sm" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <h2>Marketplace</h2>
                <div className="text-sm text-red-300">
                  Seu saldo: {cryttsBalance} Crytts
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {marketplaceItems.map((item) => (
                  <MarketplaceCard
                    key={item.id}
                    title={item.title}
                    price={item.price}
                    rating={item.rating}
                    category={item.category}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );

  // New render functions
  const renderAudioCenter = () => (
    <div className="min-h-screen bg-background">
      <Header 
        showAuth={false} 
        balance={cryttsBalance} 
        userType={userType} 
        onUserTypeChange={() => {
          const newType = userType === "master" ? "player" : "master";
          setUserType(newType);
          localStorage.setItem("userTypeSelected", newType);
        }}
        onProfileClick={() => setCurrentScreen("profile")}
      />
      <div className="p-6">
        <div className="mb-6">
          <Button variant="outline" onClick={() => setCurrentScreen("dashboard")}>
            ← Voltar ao Dashboard
          </Button>
        </div>
        <AudioPlayer />
      </div>
    </div>
  );

  const renderCustomizer = () => (
    <div className="min-h-screen bg-background">
      <Header 
        showAuth={false} 
        balance={cryttsBalance} 
        userType={userType} 
        onUserTypeChange={() => {
          const newType = userType === "master" ? "player" : "master";
          setUserType(newType);
          localStorage.setItem("userTypeSelected", newType);
        }}
        onProfileClick={() => setCurrentScreen("profile")}
      />
      <div className="p-6">
        <div className="mb-6">
          <Button variant="outline" onClick={() => setCurrentScreen("dashboard")}>
            ← Voltar ao Dashboard
          </Button>
        </div>
        <ProfileCustomizer />
      </div>
    </div>
  );

  const renderCharacterManager = () => (
    <div className="min-h-screen bg-background">
      <Header 
        showAuth={false} 
        balance={cryttsBalance} 
        userType={userType} 
        onUserTypeChange={() => {
          const newType = userType === "master" ? "player" : "master";
          setUserType(newType);
          localStorage.setItem("userTypeSelected", newType);
        }}
        onProfileClick={() => setCurrentScreen("profile")}
      />
      <div className="p-6">
        <div className="mb-6">
          <Button variant="outline" onClick={() => setCurrentScreen("dashboard")}>
            ← Voltar ao Dashboard
          </Button>
        </div>
        <CharacterManager userType={userType} />
      </div>
    </div>
  );

  const renderReplayPlayer = () => (
    <div className="min-h-screen bg-background">
      <Header 
        showAuth={false} 
        balance={cryttsBalance} 
        userType={userType} 
        onUserTypeChange={() => {
          const newType = userType === "master" ? "player" : "master";
          setUserType(newType);
          localStorage.setItem("userTypeSelected", newType);
        }}
        onProfileClick={() => setCurrentScreen("profile")}
      />
      <div className="p-6">
        <div className="mb-6">
          <Button variant="outline" onClick={() => setCurrentScreen("dashboard")}>
            ← Voltar ao Dashboard
          </Button>
        </div>
        <ReplayPlayer userType={userType} />
      </div>
    </div>
  );

  const renderEnhancedMarketplace = () => (
    <div className="min-h-screen bg-background">
      <Header 
        showAuth={false} 
        balance={cryttsBalance} 
        userType={userType} 
        onUserTypeChange={() => {
          const newType = userType === "master" ? "player" : "master";
          setUserType(newType);
          localStorage.setItem("userTypeSelected", newType);
        }}
        onProfileClick={() => setCurrentScreen("profile")}
      />
      <div className="flex">
        <Sidebar activeItem={sidebarActive} onItemClick={handleSidebarClick} userType={userType} />
        <main className="flex-1 p-6">
          <EnhancedMarketplace 
            userType={userType} 
            balance={cryttsBalance}
            onPurchase={(item) => {
              const newBalance = cryttsBalance - item.price;
              setCryttsBalance(newBalance);
              localStorage.setItem('crytto-balance', newBalance.toString());
              toast.success(`🎉 ${item.title} adquirido com sucesso!`);
            }}
          />
        </main>
      </div>
    </div>
  );

  const renderCryttsShop = () => (
    <div className="min-h-screen bg-background">
      <Header 
        showAuth={false} 
        balance={cryttsBalance} 
        userType={userType} 
        onUserTypeChange={() => {
          const newType = userType === "master" ? "player" : "master";
          setUserType(newType);
          localStorage.setItem("userTypeSelected", newType);
        }}
        onProfileClick={() => setCurrentScreen("profile")}
      />
      <div className="p-6">
        <div className="mb-6">
          <Button variant="outline" onClick={() => setCurrentScreen("dashboard")}>
            ← Voltar ao Dashboard
          </Button>
        </div>
        <CryttsShop 
          balance={cryttsBalance}
          onPurchase={(amount, price) => {
            const newBalance = cryttsBalance + amount;
            setCryttsBalance(newBalance);
            localStorage.setItem('crytto-balance', newBalance.toString());
          }}
        />
      </div>
    </div>
  );

  const renderCalendar = () => (
    <div className="min-h-screen bg-background">
      <Header 
        showAuth={false} 
        balance={cryttsBalance} 
        userType={userType} 
        onUserTypeChange={() => {
          const newType = userType === "master" ? "player" : "master";
          setUserType(newType);
          localStorage.setItem("userTypeSelected", newType);
        }}
        onProfileClick={() => setCurrentScreen("profile")}
      />
      <div className="flex">
        <Sidebar activeItem={sidebarActive} onItemClick={handleSidebarClick} userType={userType} />
        <main className="flex-1 p-6">
          <CalendarAgenda userType={userType} />
        </main>
      </div>
    </div>
  );

  const renderThemeCustomizer = () => (
    <div className="min-h-screen bg-background">
      <Header 
        showAuth={false} 
        balance={cryttsBalance} 
        userType={userType} 
        onUserTypeChange={() => {
          const newType = userType === "master" ? "player" : "master";
          setUserType(newType);
          localStorage.setItem("userTypeSelected", newType);
        }}
        onProfileClick={() => setCurrentScreen("profile")}
      />
      <div className="p-6">
        <div className="mb-6">
          <Button variant="outline" onClick={() => setCurrentScreen("dashboard")}>
            ← Voltar ao Dashboard
          </Button>
        </div>
        <ThemeCustomizer />
      </div>
    </div>
  );

  return (
    <>
      {(() => {
        switch (currentScreen) {
          case "user-type-selection":
            return (
              <UserTypeSelection 
                onSelectUserType={(type) => {
                  setUserType(type);
                  localStorage.setItem("userTypeSelected", type);
                  setCurrentScreen("landing");
                  toast.success(`✨ Bem-vindo! Você é um ${type === "master" ? "Mestre de RPG" : "Jogador"}`);
                }}
              />
            );
          case "landing":
            return renderLandingPage();
          case "dashboard":
            return renderDashboard();
          case "stream":
            return renderStreamPage();
          case "profile":
            return renderProfile();
          case "marketplace":
            return renderMarketplace();
          case "profile-edit":
            return renderProfileEdit();
          case "audio-center":
            return renderAudioCenter();
          case "customizer":
            return renderCustomizer();
          case "character-manager":
            return renderCharacterManager();
          case "replay-player":
            return renderReplayPlayer();
          case "enhanced-marketplace":
            return renderEnhancedMarketplace();
          case "crytts-shop":
            return renderCryttsShop();
          case "calendar":
            return renderCalendar();
          case "theme-customizer":
            return renderThemeCustomizer();
          default:
            return renderLandingPage();
        }
      })()}
      
      {/* Character Sheet Modal */}
      <CharacterSheet 
        isOpen={isCharacterSheetOpen} 
        onClose={() => setIsCharacterSheetOpen(false)}
        onSave={(character) => {
          console.log("Character saved:", character);
          setIsCharacterSheetOpen(false);
        }}
      />
      
      <Toaster />
    </>
  );
}