import { Badge } from "./ui/badge";
import { Play, Film, Users } from "lucide-react";

interface StreamCardProps {
  title: string;
  isLive?: boolean;
  viewers?: number;
  thumbnail?: string;
  onClick?: () => void;
}

export function StreamCard({ title, isLive = false, viewers, onClick }: StreamCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-red-900/20 transition-all hover:border-red-700/50 group" onClick={onClick}>
      <div className="bg-gradient-to-br from-red-900/20 via-gray-900 to-gray-900 h-32 flex items-center justify-center relative overflow-hidden group-hover:from-red-900/30 transition-all">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-600/20 to-transparent animate-pulse"></div>
        </div>
        {/* Icon */}
        <div className="relative z-10">
          {isLive ? (
            <Play className="h-12 w-12 text-red-500/60 fill-red-500/60 group-hover:scale-110 group-hover:text-red-400 transition-all" />
          ) : (
            <Film className="h-12 w-12 text-red-500/60 group-hover:scale-110 group-hover:text-red-400 transition-all" />
          )}
        </div>
        {isLive && (
          <Badge className="bg-red-600 text-white absolute top-2 left-2 animate-pulse">
            LIVE
          </Badge>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-sm mb-1 truncate text-card-foreground">{title}</h3>
        <div className="flex items-center justify-between">
          {viewers && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3" />
              {viewers}
            </p>
          )}
          {!isLive && (
            <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
              Replay
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}