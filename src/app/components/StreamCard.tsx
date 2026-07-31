import { Badge } from "./ui/badge";

interface StreamCardProps {
  title: string;
  isLive?: boolean;
  viewers?: number;
  thumbnail?: string;
  onClick?: () => void;
}

export function StreamCard({ title, isLive = false, viewers, onClick }: StreamCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-red-900/20 transition-all hover:border-red-700/50" onClick={onClick}>
      <div className="bg-gray-800 h-32 flex items-center justify-center relative">
        <span className="text-gray-400 text-sm">Thumbnail</span>
        {isLive && (
          <Badge className="bg-red-600 text-white absolute top-2 left-2 animate-pulse">
            LIVE
          </Badge>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-sm mb-1 truncate text-card-foreground">{title}</h3>
        {viewers && (
          <p className="text-xs text-muted-foreground">{viewers} visualizadores</p>
        )}
        {!isLive && (
          <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
            Replay
          </Badge>
        )}
      </div>
    </div>
  );
}