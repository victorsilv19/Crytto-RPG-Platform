import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";
import { 
  Crown, 
  User, 
  Zap, 
  Sparkles,
  ArrowRight,
  Check,
  Dice6,
  Users,
  Map,
  Music,
  ShoppingCart,
  Eye,
  Heart,
  Star,
  Shield,
  Swords
} from "lucide-react";

interface UserTypeSelectionProps {
  onSelectUserType: (type: "master" | "player") => void;
}

export function UserTypeSelection({ onSelectUserType }: UserTypeSelectionProps) {
  const [selectedType, setSelectedType] = useState<"master" | "player" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSelect = (type: "master" | "player") => {
    setSelectedType(type);
  };

  const handleConfirm = () => {
    if (selectedType) {
      setIsAnimating(true);
      setTimeout(() => {
        onSelectUserType(selectedType);
      }, 600);
    }
  };

  // Floating particles animation
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2
  }));

  const masterFeatures = [
    { icon: <Zap className="h-4 w-4" />, text: "Transmita sessões ao vivo" },
    { icon: <Dice6 className="h-4 w-4" />, text: "Ferramentas de RPG nativas" },
    { icon: <Map className="h-4 w-4" />, text: "Mapas interativos" },
    { icon: <Music className="h-4 w-4" />, text: "Central de áudio profissional" },
    { icon: <ShoppingCart className="h-4 w-4" />, text: "Venda conteúdo no marketplace" },
    { icon: <Users className="h-4 w-4" />, text: "Gerencie campanhas e jogadores" }
  ];

  const playerFeatures = [
    { icon: <Eye className="h-4 w-4" />, text: "Assista streams épicas" },
    { icon: <Heart className="h-4 w-4" />, text: "Apoie seus mestres favoritos" },
    { icon: <Users className="h-4 w-4" />, text: "Participe de jogos ao vivo" },
    { icon: <Star className="h-4 w-4" />, text: "Explore mundos fantásticos" },
    { icon: <ShoppingCart className="h-4 w-4" />, text: "Compre conteúdo exclusivo" },
    { icon: <Dice6 className="h-4 w-4" />, text: "Crie fichas de personagens" }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-transparent to-red-900/5" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-red-900/5 to-transparent" />
        
        {/* Floating Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-red-400/30 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-900/30 to-red-700/20 border-2 border-red-500/50 rounded-full mb-6">
            <Swords className="h-12 w-12 text-red-400" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-400 via-red-300 to-red-500 bg-clip-text text-transparent mb-4">
            Bem-vindo ao CRYTTO
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-2">
            Comece sua aventura épica escolhendo seu caminho
          </p>
          
          <p className="text-sm text-muted-foreground/70">
            Você poderá alterar isso depois nas configurações
          </p>
        </motion.div>

        {/* User Type Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
        >
          {/* Master Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-300 h-full ${
                selectedType === "master" 
                  ? "border-red-500 shadow-lg shadow-red-900/50 bg-gradient-to-br from-red-900/20 to-red-700/10" 
                  : "border-border hover:border-red-700/50 bg-card"
              }`}
              onClick={() => handleSelect("master")}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-900/40 to-red-700/30 border-2 border-red-500/50 rounded-full flex items-center justify-center">
                    <Crown className="h-8 w-8 text-red-400" />
                  </div>
                  {selectedType === "master" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center"
                    >
                      <Check className="h-5 w-5 text-white" />
                    </motion.div>
                  )}
                </div>
                <CardTitle className="text-2xl mb-2">Mestre de RPG</CardTitle>
                <p className="text-muted-foreground">
                  Para criadores de mundos e contadores de histórias
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  {masterFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm">
                      <div className="w-6 h-6 bg-red-900/30 border border-red-700/50 rounded flex items-center justify-center flex-shrink-0 text-red-400 mt-0.5">
                        {feature.icon}
                      </div>
                      <span className="text-muted-foreground">{feature.text}</span>
                    </div>
                  ))}
                </div>
                <Badge variant="outline" className="border-red-700/50 text-red-300">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Acesso Premium
                </Badge>
              </CardContent>
            </Card>
          </motion.div>

          {/* Player Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-300 h-full ${
                selectedType === "player" 
                  ? "border-blue-500 shadow-lg shadow-blue-900/50 bg-gradient-to-br from-blue-900/20 to-blue-700/10" 
                  : "border-border hover:border-blue-700/50 bg-card"
              }`}
              onClick={() => handleSelect("player")}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-900/40 to-blue-700/30 border-2 border-blue-500/50 rounded-full flex items-center justify-center">
                    <Shield className="h-8 w-8 text-blue-400" />
                  </div>
                  {selectedType === "player" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
                    >
                      <Check className="h-5 w-5 text-white" />
                    </motion.div>
                  )}
                </div>
                <CardTitle className="text-2xl mb-2">Jogador</CardTitle>
                <p className="text-muted-foreground">
                  Para aventureiros e exploradores de mundos
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  {playerFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm">
                      <div className="w-6 h-6 bg-blue-900/30 border border-blue-700/50 rounded flex items-center justify-center flex-shrink-0 text-blue-400 mt-0.5">
                        {feature.icon}
                      </div>
                      <span className="text-muted-foreground">{feature.text}</span>
                    </div>
                  ))}
                </div>
                <Badge variant="outline" className="border-blue-700/50 text-blue-300">
                  <Star className="h-3 w-3 mr-1" />
                  Gratuito
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Confirm Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <Button 
            size="lg"
            onClick={handleConfirm}
            disabled={!selectedType || isAnimating}
            className={`px-12 py-6 text-lg transition-all duration-300 ${
              selectedType === "master" 
                ? "bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/50" 
                : selectedType === "player"
                ? "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/50"
                : "bg-gray-600"
            }`}
          >
            {isAnimating ? (
              <>
                <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                Iniciando sua aventura...
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 mr-2" />
                Começar Aventura
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
          
          {selectedType && !isAnimating && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground mt-4"
            >
              Você escolheu ser um <span className="font-semibold text-foreground">
                {selectedType === "master" ? "Mestre de RPG" : "Jogador"}
              </span>
            </motion.p>
          )}
        </motion.div>

        {/* Info Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-xs text-muted-foreground/60">
            Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade
          </p>
        </motion.div>
      </div>
    </div>
  );
}
