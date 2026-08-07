import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Heart, Star, Zap, UserPlus, MessageSquare, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

interface ChatMessage {
  id: number;
  user: string;
  message: string;
  isPaid?: boolean;
}

interface ChatAreaProps {
  messages: ChatMessage[];
  userType?: "master" | "player";
}

export function ChatArea({ messages, userType = "player" }: ChatAreaProps) {
  const [chatMode, setChatMode] = useState<"live" | "session">("live");
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Mock friends list
  const friends = [
    { id: "1", name: "PlayerOne", status: "online" },
    { id: "2", name: "RogueMaster", status: "online" },
    { id: "3", name: "MageWizard", status: "offline" },
    { id: "4", name: "BarbarianKing", status: "online" },
    { id: "5", name: "HealerPriest", status: "offline" },
    { id: "6", name: "PaladinBrave", status: "online" },
  ];
  
  const handleAddMembers = () => {
    if (selectedFriends.length === 0) {
      toast.error("Selecione pelo menos um amigo!");
      return;
    }
    toast.success(`🎉 ${selectedFriends.length} membro(s) adicionado(s) à mesa!`);
    setSelectedFriends([]);
    setIsDialogOpen(false);
  };
  
  const toggleFriend = (friendId: string) => {
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };
  return (
    <div className="bg-card border border-border rounded-lg flex flex-col h-96">
      {/* Chat Mode Toggle */}
      <div className="border-b border-border p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            <Button 
              size="sm" 
              variant={chatMode === "live" ? "default" : "ghost"}
              onClick={() => setChatMode("live")}
              className="text-xs h-7"
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Chat Live
            </Button>
            <Button 
              size="sm" 
              variant={chatMode === "session" ? "default" : "ghost"}
              onClick={() => setChatMode("session")}
              className="text-xs h-7"
            >
              <Users className="h-3 w-3 mr-1" />
              Mesa
            </Button>
          </div>
          <Badge variant="outline" className="text-xs">
            {chatMode === "live" ? "Público" : "Privado"}
          </Badge>
        </div>
        
        {/* Reaction buttons */}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="border-red-700/50 text-red-300 hover:bg-red-900/30">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" className="border-red-700/50 text-red-300 hover:bg-red-900/30">
            <Star className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" className="border-red-700/50 text-red-300 hover:bg-red-900/30">
            <Zap className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded text-sm ${
              msg.isPaid
                ? "bg-red-900/30 border border-red-700/50 shadow-lg shadow-red-900/20"
                : "bg-accent/30"
            }`}
          >
            <span className="font-medium text-card-foreground">{msg.user}: </span>
            <span className="text-muted-foreground">{msg.message}</span>
          </div>
        ))}
      </div>
      
      {/* Add Members Button - Only for Masters */}
      {userType === "master" && (
        <div className="border-t border-border p-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full border-red-700/50 text-red-300 hover:bg-red-900/30"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Adicionar Membros à Mesa
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Adicionar Membros à Mesa</DialogTitle>
                <DialogDescription>
                  Selecione amigos para convidar para sua sessão de RPG.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-4">
                {friends.map((friend) => (
                  <div 
                    key={friend.id} 
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => toggleFriend(friend.id)}
                  >
                    <Checkbox 
                      id={friend.id}
                      checked={selectedFriends.includes(friend.id)}
                      onCheckedChange={() => toggleFriend(friend.id)}
                    />
                    <Label 
                      htmlFor={friend.id} 
                      className="flex-1 cursor-pointer flex items-center justify-between"
                    >
                      <span>{friend.name}</span>
                      <Badge 
                        variant="outline" 
                        className={friend.status === "online" 
                          ? "border-green-700/50 text-green-400" 
                          : "border-gray-700/50 text-gray-400"
                        }
                      >
                        {friend.status}
                      </Badge>
                    </Label>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAddMembers}
                  className="flex-1 bg-primary hover:bg-primary/90"
                  disabled={selectedFriends.length === 0}
                >
                  Adicionar {selectedFriends.length > 0 && `(${selectedFriends.length})`}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
      
      {/* Chat input */}
      <div className="border-t border-border p-3">
        <div className="flex gap-2">
          <Input 
            placeholder={chatMode === "live" ? "Chat público..." : "Chat da mesa..."} 
            className="text-sm bg-input-background border-border" 
          />
          <Button size="sm" className="bg-primary hover:bg-primary/90">Enviar</Button>
        </div>
      </div>
    </div>
  );
}