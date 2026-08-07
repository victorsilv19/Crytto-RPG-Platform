import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Crown, User, LogOut } from "lucide-react";
import logo from "figma:asset/c6cf295c73be3c7dab97aeea7773a75c4bfd1e05.png";

interface HeaderProps {
  onLogin?: () => void;
  onSignup?: () => void;
  showAuth?: boolean;
  balance?: number;
  userType?: "master" | "player";
  onProfileClick?: () => void;
  onLogout?: () => void;
}

export function Header({ onLogin, onSignup, showAuth = true, balance, userType, onProfileClick, onLogout }: HeaderProps) {
  return (
    <header className="border-b border-red-900/20 bg-gray-900 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center">
          <img src={logo} alt="Crytto" className="h-16 w-auto" />
        </div>
        
        <div className="flex items-center gap-4">
          {/* Badge de papel apenas informativo — o toggle Mestre/Jogador foi removido */}
          {userType && (
            <Badge 
              variant="outline" 
              className={`${userType === "master" ? "border-red-700/50 text-red-300" : "border-blue-700/50 text-blue-300"}`}
            >
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
          )}
          
          {balance !== undefined && (
            <div className="bg-red-900/30 border border-red-700/50 px-3 py-1 rounded">
              <span className="text-sm text-red-200">Crytts: {balance}</span>
            </div>
          )}
          
          {!showAuth && onProfileClick && (
            <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity" onClick={onProfileClick}>
              <AvatarFallback className="bg-red-900/30 border border-red-700/50 text-red-200 text-xs">
                ME
              </AvatarFallback>
            </Avatar>
          )}

          {!showAuth && onLogout && (
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="border-red-700/50 text-red-300 hover:bg-red-900/30"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Sair
            </Button>
          )}
          
          {showAuth && (
            <>
              <Button variant="outline" onClick={onLogin} className="border-red-700 text-red-200 hover:bg-red-900/30">
                Entrar
              </Button>
              <Button onClick={onSignup} className="bg-red-700 hover:bg-red-600 text-white">
                Criar Conta
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}