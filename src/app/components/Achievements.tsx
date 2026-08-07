import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { listCharacters } from "../lib/characterStore";
import {
  Trophy,
  Lock,
  Star,
  Swords,
  Users,
  Palette,
  BookOpen,
  Crown,
  Flame,
} from "lucide-react";

interface AchievementsProps {
  userId: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
}

// As conquistas são derivadas do progresso real do usuário (personagens criados, tema salvo).
export function Achievements({ userId }: AchievementsProps) {
  const achievements = useMemo<Achievement[]>(() => {
    const characters = listCharacters(userId);
    const hasCustomTheme =
      !!localStorage.getItem("crytto-theme") &&
      localStorage.getItem("crytto-theme") !== "default";

    return [
      {
        id: "first-character",
        title: "Primeiro Herói",
        description: "Crie seu primeiro personagem.",
        icon: <Swords className="h-6 w-6" />,
        unlocked: characters.length >= 1,
      },
      {
        id: "party",
        title: "Formando o Grupo",
        description: "Tenha 3 ou mais personagens.",
        icon: <Users className="h-6 w-6" />,
        unlocked: characters.length >= 3,
      },
      {
        id: "high-level",
        title: "Lenda Viva",
        description: "Possua um personagem de nível 5 ou mais.",
        icon: <Crown className="h-6 w-6" />,
        unlocked: characters.some((c) => c.level >= 5),
      },
      {
        id: "storyteller",
        title: "Contador de Histórias",
        description: "Escreva a história de fundo de um personagem.",
        icon: <BookOpen className="h-6 w-6" />,
        unlocked: characters.some((c) => (c.backstory || "").trim().length > 0),
      },
      {
        id: "custom-theme",
        title: "Estilo Próprio",
        description: "Personalize o tema da plataforma.",
        icon: <Palette className="h-6 w-6" />,
        unlocked: hasCustomTheme,
      },
      {
        id: "veteran",
        title: "Veterano de Mesa",
        description: "Tenha 5 ou mais personagens.",
        icon: <Flame className="h-6 w-6" />,
        unlocked: characters.length >= 5,
      },
    ];
  }, [userId]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const progress = Math.round((unlockedCount / achievements.length) * 100);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-bold">Conquistas</h2>
              <p className="text-muted-foreground">
                {unlockedCount} de {achievements.length} desbloqueadas
              </p>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={`transition-all ${
              achievement.unlocked
                ? "border-primary/40"
                : "opacity-60 border-border"
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    achievement.unlocked
                      ? "bg-gradient-to-br from-red-900/30 to-red-700/20 border border-red-500/50 text-red-400"
                      : "bg-muted/40 border border-border text-muted-foreground"
                  }`}
                >
                  {achievement.unlocked ? achievement.icon : <Lock className="h-6 w-6" />}
                </div>
                {achievement.unlocked ? (
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    Desbloqueada
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    Bloqueada
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardTitle className="text-base mb-1">{achievement.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{achievement.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
