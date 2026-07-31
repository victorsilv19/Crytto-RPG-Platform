import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Slider } from "./ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner@2.0.3";
import { 
  Play, 
  Pause, 
  Square, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Maximize,
  Settings,
  Clock,
  Calendar,
  Download,
  Share2
} from "lucide-react";

interface ReplaySession {
  id: string;
  title: string;
  date: Date;
  duration: number; // in seconds
  thumbnail: string;
  description: string;
  views: number;
  participants: string[];
}

interface ReplayPlayerProps {
  userType: "master" | "player";
}

export function ReplayPlayer({ userType }: ReplayPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedReplay, setSelectedReplay] = useState<ReplaySession | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<ReplaySession>>({});
  const videoRef = useRef<HTMLVideoElement>(null);

  const replaySessions: ReplaySession[] = [
    {
      id: "1",
      title: "A Lenda do Dragão Dourado - Sessão 1",
      date: new Date("2024-01-15"),
      duration: 7200, // 2 hours
      thumbnail: "",
      description: "O início da jornada épica pelos reinos perdidos...",
      views: 234,
      participants: ["João Silva", "Maria Santos", "Pedro Costa", "Ana Lima"]
    },
    {
      id: "2", 
      title: "Águas Sombrias - Episódio Final",
      date: new Date("2024-01-10"),
      duration: 9000, // 2.5 hours
      thumbnail: "",
      description: "A conclusão dramática da campanha marítima...",
      views: 189,
      participants: ["Carlos Mendes", "Sofia Oliveira", "Lucas Ferreira"]
    },
    {
      id: "3",
      title: "Reino de Eldoria - Batalha do Castelo",
      date: new Date("2024-01-05"),
      duration: 5400, // 1.5 hours
      thumbnail: "",
      description: "A épica batalha final contra o Lorde Sombrio...",
      views: 456,
      participants: ["Gabriel Santos", "Isabela Costa", "Rafael Silva", "Amanda Oliveira"]
    }
  ];

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (!selectedReplay) {
      toast.warning("Selecione um replay para reproduzir");
      return;
    }

    setIsPlaying(!isPlaying);
    if (isPlaying) {
      toast.info("⏸️ Replay pausado");
    } else {
      toast.info("▶️ Reproduzindo replay");
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    toast.info("⏹️ Replay parado");
  };

  const handleSeek = (value: number[]) => {
    if (selectedReplay) {
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(value[0] === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      toast.info("🔇 Som desativado");
    } else {
      toast.info("🔊 Som ativado");
    }
  };

  const handleSpeedChange = (speed: string) => {
    setPlaybackSpeed(parseFloat(speed));
    toast.info(`⚡ Velocidade: ${speed}x`);
  };

  const handleFullscreen = () => {
    toast.info("🔍 Modo tela cheia ativado");
  };

  const handleDownload = () => {
    if (selectedReplay) {
      toast.success(`📥 Download iniciado: ${selectedReplay.title}`);
    }
  };

  const handleShare = () => {
    if (selectedReplay) {
      navigator.clipboard.writeText(`Assista: ${selectedReplay.title}`);
      toast.success("🔗 Link copiado para área de transferência!");
    }
  };

  // Simulate time progression when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && selectedReplay) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= selectedReplay.duration) {
            setIsPlaying(false);
            toast.success("🎬 Replay finalizado!");
            return selectedReplay.duration;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedReplay, playbackSpeed]);

  return (
    <div className="space-y-6">
      {/* Replay Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📺 {userType === "master" ? "Seus Replays" : "Replays Disponíveis"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {replaySessions.map((replay) => (
              <Card 
                key={replay.id} 
                className={`cursor-pointer transition-colors hover:border-red-700/50 ${
                  selectedReplay?.id === replay.id ? 'border-red-500 bg-red-900/10' : ''
                }`}
                onClick={() => {
                  setSelectedReplay(replay);
                  setCurrentTime(0);
                  setIsPlaying(false);
                  toast.info(`📼 Replay selecionado: ${replay.title}`);
                }}
              >
                <CardHeader className="pb-3">
                  <div className="bg-gray-800 border border-red-900/30 h-32 rounded-lg mb-2 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-transparent"></div>
                    <Play className="h-12 w-12 text-red-400 relative z-10" />
                    <Badge className="absolute top-2 right-2 bg-black/70 text-white text-xs">
                      {formatTime(replay.duration)}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm leading-tight">{replay.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {replay.date.toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatTime(replay.duration)} • {replay.views} visualizações
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {replay.description}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Participantes:</span> {replay.participants.join(", ")}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Video Player */}
      <Card>
        <CardContent className="p-0">
          <div className="bg-gray-900 rounded-t-lg aspect-video flex items-center justify-center relative">
            {selectedReplay ? (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-transparent"></div>
                <div className="relative z-10 text-center text-white">
                  <h3 className="text-xl font-medium mb-2">{selectedReplay.title}</h3>
                  <p className="text-gray-300">{selectedReplay.description}</p>
                </div>
                {isPlaying && (
                  <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                    REPRODUZINDO
                  </Badge>
                )}
              </>
            ) : (
              <div className="text-gray-400 text-center">
                <Play className="h-16 w-16 mx-auto mb-4" />
                <p>Selecione um replay para assistir</p>
              </div>
            )}
          </div>

          {/* Player Controls */}
          <div className="p-4 space-y-4 bg-card border-t">
            {/* Progress Bar */}
            <div className="space-y-2">
              <Slider
                value={[currentTime]}
                max={selectedReplay?.duration || 100}
                step={1}
                onValueChange={handleSeek}
                className="w-full"
                disabled={!selectedReplay}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{selectedReplay ? formatTime(selectedReplay.duration) : "0:00"}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentTime(Math.max(0, currentTime - 30))}
                  disabled={!selectedReplay}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                
                <Button
                  onClick={handlePlayPause}
                  disabled={!selectedReplay}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStop}
                  disabled={!selectedReplay}
                >
                  <Square className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentTime(Math.min(selectedReplay?.duration || 0, currentTime + 30))}
                  disabled={!selectedReplay}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-4">
                {/* Volume Control */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="w-20"
                  />
                </div>

                {/* Playback Speed */}
                <Select value={playbackSpeed.toString()} onValueChange={handleSpeedChange}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">0.5x</SelectItem>
                    <SelectItem value="0.75">0.75x</SelectItem>
                    <SelectItem value="1">1x</SelectItem>
                    <SelectItem value="1.25">1.25x</SelectItem>
                    <SelectItem value="1.5">1.5x</SelectItem>
                    <SelectItem value="2">2x</SelectItem>
                  </SelectContent>
                </Select>

                {/* Additional Controls */}
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={handleFullscreen}>
                    <Maximize className="h-4 w-4" />
                  </Button>
                  
                  {userType === "master" && (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => toast.info("⚙️ Configurações do replay")}>
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleDownload}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  
                  <Button variant="ghost" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            {selectedReplay && (
              <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3">
                <div>
                  <span>📅 {selectedReplay.date.toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span>👁️ {selectedReplay.views} visualizações</span>
                </div>
                {userType === "master" && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      Editar Detalhes
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs border-red-700/50 text-red-300 hover:bg-red-900/30">
                      Excluir Replay
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}