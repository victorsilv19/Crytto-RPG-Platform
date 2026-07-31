import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";
import { 
  Play, 
  Sparkles, 
  Users, 
  Dice6, 
  Map, 
  Crown, 
  Zap, 
  Music,
  ArrowRight,
  Star,
  Shield,
  Sword,
  Eye,
  Volume2
} from "lucide-react";

interface ImmersiveIntroProps {
  onGetStarted: () => void;
  onWatchDemo: () => void;
}

export function ImmersiveIntro({ onGetStarted, onWatchDemo }: ImmersiveIntroProps) {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [particlesVisible, setParticlesVisible] = useState(true);

  const features = [
    {
      icon: <Crown className="h-8 w-8" />,
      title: "Ferramentas de Mestre",
      description: "Sistema completo para mestres criarem mundos épicos"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Streaming Interativo",
      description: "Transmita suas sessões com chat ao vivo e interações"
    },
    {
      icon: <Dice6 className="h-8 w-8" />,
      title: "Dados Virtuais",
      description: "Sistema de rolagem integrado com animações épicas"
    },
    {
      icon: <Map className="h-8 w-8" />,
      title: "Mapas Interativos",
      description: "Compartilhe mapas e cenários em tempo real"
    },
    {
      icon: <Music className="h-8 w-8" />,
      title: "Áudio Imersivo",
      description: "Trilhas e efeitos sonoros para cada momento"
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Marketplace",
      description: "Compre e venda conteúdo RPG exclusivo"
    }
  ];

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Floating particles animation
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2
  }));

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-transparent to-red-900/5" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-red-900/5 to-transparent" />
        
        {/* Floating Particles */}
        {particlesVisible && particles.map((particle) => (
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
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-6xl mx-auto text-center">
            {/* Logo/Brand */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-900/30 to-red-700/20 border-2 border-red-500/50 rounded-full mb-6">
                <Crown className="h-12 w-12 text-red-400" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-red-400 via-red-300 to-red-500 bg-clip-text text-transparent mb-4">
                CRYTTO
              </h1>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Uma plataforma imersiva com
                <br />
                <span className="text-primary">ferramentas nativas de RPG</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Conecte-se com mestres épicos, participe de aventuras ao vivo e explore mundos fantásticos. 
                A revolução do RPG online está aqui.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Button 
                size="lg" 
                onClick={onGetStarted}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-red-900/30 text-lg px-8 py-6"
              >
                <Zap className="h-5 w-5 mr-2" />
                Começar Aventura
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={onWatchDemo}
                className="border-red-700/50 text-red-300 hover:bg-red-900/30 text-lg px-8 py-6"
              >
                <Play className="h-5 w-5 mr-2" />
                Ver Demonstração
              </Button>
            </motion.div>

            {/* Features Carousel */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-16"
            >
              <Card className="max-w-md mx-auto bg-gradient-to-br from-red-900/10 to-red-700/5 border-red-700/30">
                <CardContent className="p-8">
                  <motion.div
                    key={currentFeature}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-red-900/30 to-red-700/20 border border-red-500/50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-400">
                      {features[currentFeature].icon}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {features[currentFeature].title}
                    </h3>
                    <p className="text-muted-foreground">
                      {features[currentFeature].description}
                    </p>
                  </motion.div>
                </CardContent>
              </Card>

              {/* Feature indicators */}
              <div className="flex justify-center gap-2 mt-6">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFeature(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentFeature ? 'bg-primary' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Feature Grid Section */}
        <div className="px-6 py-16 bg-gradient-to-b from-transparent to-red-900/5">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-center mb-12"
            >
              <h3 className="text-3xl font-bold text-foreground mb-4">
                Ferramentas Profissionais para RPG
              </h3>
              <p className="text-muted-foreground text-lg">
                Tudo o que você precisa para criar e participar de aventuras épicas
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Crown className="h-6 w-6" />,
                  title: "Modo Mestre",
                  description: "Ferramentas completas para criação de mundos, gestão de campanhas e streaming",
                  badge: "Premium",
                  color: "red"
                },
                {
                  icon: <Users className="h-6 w-6" />,
                  title: "Modo Jogador",
                  description: "Assista streams, interaja com mestres e explore mundos fantásticos",
                  badge: "Gratuito",
                  color: "blue"
                },
                {
                  icon: <Dice6 className="h-6 w-6" />,
                  title: "Dados Virtuais",
                  description: "Sistema de rolagem avançado com animações e histórico completo",
                  badge: "Nativo",
                  color: "green"
                },
                {
                  icon: <Map className="h-6 w-6" />,
                  title: "Mapas Interativos",
                  description: "Compartilhe e explore mapas em tempo real com seus jogadores",
                  badge: "Colaborativo",
                  color: "purple"
                },
                {
                  icon: <Music className="h-6 w-6" />,
                  title: "Áudio Profissional",
                  description: "Trilhas ambientes e efeitos sonoros sincronizados com a história",
                  badge: "Imersivo",
                  color: "yellow"
                },
                {
                  icon: <Sparkles className="h-6 w-6" />,
                  title: "Marketplace",
                  description: "Compre, venda e compartilhe conteúdo RPG com a comunidade",
                  badge: "Economia",
                  color: "pink"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                >
                  <Card className="h-full hover:border-red-700/50 transition-colors cursor-pointer bg-gradient-to-br from-muted/30 to-muted/10">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-12 h-12 bg-${feature.color}-900/30 border border-${feature.color}-700/50 rounded-lg flex items-center justify-center text-${feature.color}-400`}>
                          {feature.icon}
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`border-${feature.color}-700/50 text-${feature.color}-300`}
                        >
                          {feature.badge}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Demo Video Section */}
        <div className="px-6 py-16 bg-gradient-to-b from-red-900/5 to-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <h3 className="text-3xl font-bold text-foreground mb-6">
                Veja o Crytto em Ação
              </h3>
              <p className="text-muted-foreground text-lg mb-8">
                Descubra como nossa plataforma revoluciona a experiência de RPG online
              </p>
              
              <Card className="bg-gradient-to-br from-red-900/10 to-red-700/5 border-red-700/30 cursor-pointer hover:border-red-500/50 transition-colors">
                <CardContent className="p-12">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-transparent rounded-lg"></div>
                    <div className="relative bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
                      <Button 
                        size="lg" 
                        onClick={onWatchDemo}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-red-900/30"
                      >
                        <Play className="h-6 w-6 mr-2" />
                        Assistir Demo
                      </Button>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      2.3k visualizações
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      4.9/5 avaliação
                    </div>
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      5min de duração
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-6 py-12 border-t border-red-900/20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Pronto para Começar Sua Jornada?
              </h3>
              <p className="text-muted-foreground mb-8">
                Junte-se a milhares de mestres e jogadores na plataforma definitiva de RPG
              </p>
              <Button 
                size="lg" 
                onClick={onGetStarted}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-red-900/30"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Entrar no Crytto
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}