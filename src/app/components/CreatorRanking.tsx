import { Avatar, AvatarFallback } from "./ui/avatar";

interface Creator {
  id: number;
  name: string;
  points: number;
}

interface CreatorRankingProps {
  creators: Creator[];
}

export function CreatorRanking({ creators }: CreatorRankingProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="font-medium mb-4 text-card-foreground">Ranking de Criadores</h3>
      
      <div className="space-y-3">
        {creators.map((creator, index) => (
          <div key={creator.id} className="flex items-center gap-3 p-2 rounded hover:bg-accent/50 transition-colors">
            <span className="text-sm text-muted-foreground w-4">#{index + 1}</span>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-red-900/30 text-red-200 text-xs border border-red-700/50">
                {creator.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">{creator.name}</p>
              <p className="text-xs text-muted-foreground">{creator.points} pontos</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}