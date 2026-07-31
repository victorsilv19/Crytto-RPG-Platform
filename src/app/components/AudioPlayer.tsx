import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner@2.0.3";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  SkipForward, 
  SkipBack,
  Repeat,
  Shuffle,
  Music,
  CloudRain,
  Swords,
  Sparkles,
  Ghost,
  TreePine,
  Flame,
  Shield,
  Heart,
  Zap,
  Wind,
  Settings,
  Upload,
  Download,
  List
} from "lucide-react";

interface Track {
  id: string;
  name: string;
  duration: string;
  category: "ambient" | "battle" | "tavern" | "dungeon" | "epic";
  url?: string;
  isPlaying?: boolean;
}

interface SoundEffect {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: "combat" | "magic" | "environment" | "social";
  cooldown?: number;
  lastUsed?: number;
}

export function AudioPlayer() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([75]);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Mock playlists
  const ambientTracks: Track[] = [
    { id: "1", name: "Floresta Mística", duration: "10:45", category: "ambient" },
    { id: "2", name: "Taverna Calorosa", duration: "8:22", category: "tavern" },
    { id: "3", name: "Caverna Sombria", duration: "12:15", category: "dungeon" },
    { id: "4", name: "Tempestade Distante", duration: "6:30", category: "ambient" },
    { id: "5", name: "Campo de Batalha", duration: "5:45", category: "battle" },
    { id: "6", name: "Marcha Épica", duration: "7:20", category: "epic" },
  ];

  const soundEffects: SoundEffect[] = [
    { id: "thunder", name: "Trovão", icon: <CloudRain className="h-4 w-4" />, category: "environment", cooldown: 2000 },
    { id: "swords", name: "Espadas", icon: <Swords className="h-4 w-4" />, category: "combat", cooldown: 1000 },
    { id: "magic", name: "Magia", icon: <Sparkles className="h-4 w-4" />, category: "magic", cooldown: 1500 },
    { id: "fire", name: "Fogo", icon: <Flame className="h-4 w-4" />, category: "magic", cooldown: 1500 },
    { id: "shield", name: "Escudo", icon: <Shield className="h-4 w-4" />, category: "combat", cooldown: 1000 },
    { id: "heal", name: "Cura", icon: <Heart className="h-4 w-4" />, category: "magic", cooldown: 2000 },
    { id: "lightning", name: "Raio", icon: <Zap className="h-4 w-4" />, category: "magic", cooldown: 2000 },
    { id: "wind", name: "Vento", icon: <Wind className="h-4 w-4" />, category: "environment", cooldown: 3000 },
    { id: "ghost", name: "Assombração", icon: <Ghost className="h-4 w-4" />, category: "environment", cooldown: 4000 },
    { id: "forest", name: "Floresta", icon: <TreePine className="h-4 w-4" />, category: "environment", cooldown: 5000 },
  ];

  const [effects, setEffects] = useState<SoundEffect[]>(soundEffects);

  // Mock audio durations (in a real app, these would come from actual audio files)
  useEffect(() => {
    if (currentTrack) {
      const mockDurations: { [key: string]: number } = {
        "1": 645, "2": 502, "3": 735, "4": 390, "5": 345, "6": 440
      };
      setDuration(mockDurations[currentTrack.id] || 300);
    }
  }, [currentTrack]);

  // Simulate audio progress
  useEffect(() => {
    if (isPlaying && currentTrack) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            if (isRepeat) {
              return 0;
            } else {
              setIsPlaying(false);
              return prev;
            }
          }
          return prev + 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, duration, isRepeat]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);
    toast.success(`🎵 Reproduzindo: ${track.name}`);
  };

  const togglePlayPause = () => {
    if (currentTrack) {
      setIsPlaying(!isPlaying);
      toast.info(isPlaying ? "⏸️ Música pausada" : "▶️ Música reproduzida");
    }
  };

  const playEffect = (effect: SoundEffect) => {
    const now = Date.now();
    const lastUsed = effect.lastUsed || 0;
    
    if (effect.cooldown && now - lastUsed < effect.cooldown) {
      const remaining = Math.ceil((effect.cooldown - (now - lastUsed)) / 1000);
      toast.warning(`⏰ Aguarde ${remaining}s para usar novamente`);
      return;
    }

    // Update last used time
    setEffects(prev => prev.map(e => 
      e.id === effect.id ? { ...e, lastUsed: now } : e
    ));
    
    toast.success(`🔊 ${effect.name} reproduzido!`);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "ambient": return <TreePine className="h-4 w-4" />;
      case "battle": return <Swords className="h-4 w-4" />;
      case "tavern": return <Music className="h-4 w-4" />;
      case "dungeon": return <Ghost className="h-4 w-4" />;
      case "epic": return <Sparkles className="h-4 w-4" />;
      default: return <Music className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "ambient": return "border-green-700/50 text-green-300";
      case "battle": return "border-red-700/50 text-red-300";
      case "tavern": return "border-yellow-700/50 text-yellow-300";
      case "dungeon": return "border-purple-700/50 text-purple-300";
      case "epic": return "border-blue-700/50 text-blue-300";
      default: return "border-gray-700/50 text-gray-300";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5 text-primary" />
          Sistema de Áudio Imersivo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="player" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="player">Player</TabsTrigger>
            <TabsTrigger value="effects">Efeitos</TabsTrigger>
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
          </TabsList>

          {/* Main Audio Player */}
          <TabsContent value="player" className="space-y-4">
            {/* Current Track Display */}
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                {currentTrack ? (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-900/20 to-red-700/10 border border-red-700/50 rounded-lg flex items-center justify-center">
                          {getCategoryIcon(currentTrack.category)}
                        </div>
                        <div>
                          <h3 className="font-medium">{currentTrack.name}</h3>
                          <Badge variant="outline" className={getCategoryColor(currentTrack.category)}>
                            {currentTrack.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <Slider
                        value={[currentTime]}
                        max={duration}
                        step={1}
                        className="w-full"
                        onValueChange={(value) => setCurrentTime(value[0])}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Music className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Selecione uma faixa para começar</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Player Controls */}
            <div className="flex items-center justify-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className={`border-red-700/50 hover:bg-red-900/30 ${isShuffle ? 'text-primary' : 'text-red-300'}`}
                onClick={() => setIsShuffle(!isShuffle)}
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="border-red-700/50 text-red-300 hover:bg-red-900/30"
                disabled={!currentTrack}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-red-700/50 text-red-300 hover:bg-red-900/30"
                onClick={togglePlayPause}
                disabled={!currentTrack}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="border-red-700/50 text-red-300 hover:bg-red-900/30"
                disabled={!currentTrack}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className={`border-red-700/50 hover:bg-red-900/30 ${isRepeat ? 'text-primary' : 'text-red-300'}`}
                onClick={() => setIsRepeat(!isRepeat)}
              >
                <Repeat className="h-4 w-4" />
              </Button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-red-700/50 text-red-300 hover:bg-red-900/30"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted || volume[0] === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Slider
                value={isMuted ? [0] : volume}
                max={100}
                step={1}
                className="flex-1"
                onValueChange={(value) => {
                  setVolume(value);
                  setIsMuted(false);
                }}
              />
              <span className="text-sm text-muted-foreground w-10">{isMuted ? 0 : volume[0]}%</span>
            </div>
          </TabsContent>

          {/* Sound Effects */}
          <TabsContent value="effects" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {effects.map((effect) => {
                const now = Date.now();
                const lastUsed = effect.lastUsed || 0;
                const onCooldown = effect.cooldown && (now - lastUsed < effect.cooldown);
                const remainingCooldown = onCooldown ? Math.ceil((effect.cooldown! - (now - lastUsed)) / 1000) : 0;
                
                return (
                  <Button
                    key={effect.id}
                    variant="outline"
                    className={`h-20 flex flex-col items-center justify-center gap-1 relative ${
                      onCooldown 
                        ? 'opacity-50 cursor-not-allowed border-gray-700/50' 
                        : 'border-red-700/50 text-red-300 hover:bg-red-900/30'
                    }`}
                    onClick={() => playEffect(effect)}
                    disabled={!!onCooldown}
                  >
                    {effect.icon}
                    <span className="text-xs">{effect.name}</span>
                    {onCooldown && (
                      <Badge className="absolute -top-2 -right-2 bg-red-900/50 text-xs">
                        {remainingCooldown}s
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>
            
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Controles de Efeitos</h4>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-red-700/50 text-red-300 hover:bg-red-900/30">
                    <Settings className="h-4 w-4 mr-1" />
                    Configurar
                  </Button>
                  <Button variant="outline" size="sm" className="border-red-700/50 text-red-300 hover:bg-red-900/30">
                    <Upload className="h-4 w-4 mr-1" />
                    Importar
                  </Button>
                  <Button variant="outline" size="sm" className="border-red-700/50 text-red-300 hover:bg-red-900/30">
                    <Download className="h-4 w-4 mr-1" />
                    Baixar Pack
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Playlists */}
          <TabsContent value="playlists" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Trilhas Ambientes</h3>
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="ambient">Ambiente</SelectItem>
                  <SelectItem value="battle">Batalha</SelectItem>
                  <SelectItem value="tavern">Taverna</SelectItem>
                  <SelectItem value="dungeon">Masmorra</SelectItem>
                  <SelectItem value="epic">Épico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              {ambientTracks.map((track, index) => (
                <div
                  key={track.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    currentTrack?.id === track.id 
                      ? 'bg-red-900/20 border border-red-700/50' 
                      : 'bg-muted/30 hover:bg-muted/50'
                  }`}
                  onClick={() => playTrack(track)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-900/20 to-red-700/10 border border-red-700/50 rounded flex items-center justify-center">
                      {getCategoryIcon(track.category)}
                    </div>
                    <div>
                      <p className="font-medium">{track.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getCategoryColor(track.category)}>
                          {track.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{track.duration}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {currentTrack?.id === track.id && isPlaying && (
                      <div className="flex gap-1">
                        <div className="w-1 h-4 bg-primary animate-pulse"></div>
                        <div className="w-1 h-4 bg-primary animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-1 h-4 bg-primary animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-700/50 text-red-300 hover:bg-red-900/30"
                      onClick={(e) => {
                        e.stopPropagation();
                        playTrack(track);
                      }}
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Gerenciar Playlists</h4>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-red-700/50 text-red-300 hover:bg-red-900/30">
                    <List className="h-4 w-4 mr-1" />
                    Nova Playlist
                  </Button>
                  <Button variant="outline" size="sm" className="border-red-700/50 text-red-300 hover:bg-red-900/30">
                    <Upload className="h-4 w-4 mr-1" />
                    Upload Música
                  </Button>
                  <Button variant="outline" size="sm" className="border-red-700/50 text-red-300 hover:bg-red-900/30">
                    <Download className="h-4 w-4 mr-1" />
                    Marketplace
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}