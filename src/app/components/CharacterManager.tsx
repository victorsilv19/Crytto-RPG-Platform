import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { toast } from "sonner@2.0.3";
import { 
  User, 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Image, 
  Shield, 
  Sword, 
  Wand2, 
  Eye,
  Heart,
  Zap,
  Crown,
  Users
} from "lucide-react";

interface Character {
  id: string;
  name: string;
  class: string;
  level: number;
  race: string;
  background: string;
  avatarUrl?: string;
  hp: { current: number; max: number };
  ac: number;
  stats: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  skills: string[];
  backstory: string;
  playerId?: string;
  playerName?: string;
  status: "active" | "inactive" | "dead";
}

interface CharacterManagerProps {
  userType: "master" | "player";
}

export function CharacterManager({ userType }: CharacterManagerProps) {
  const [characters, setCharacters] = useState<Character[]>(() => {
    const saved = localStorage.getItem('crytto-characters');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        id: "1",
        name: "Aragorn Tempestade",
        class: "Guerreiro",
        level: 8,
        race: "Humano",
        background: "Soldado",
        avatarUrl: "",
        hp: { current: 72, max: 85 },
        ac: 18,
        stats: {
          strength: 16,
          dexterity: 14,
          constitution: 15,
          intelligence: 12,
          wisdom: 13,
          charisma: 14
        },
        skills: ["Intimidação", "Percepção", "Sobrevivência"],
        backstory: "Um guerreiro veterano que perdeu sua família em uma guerra...",
        playerId: "player1",
        playerName: "João Silva",
        status: "active"
      },
      {
        id: "2", 
        name: "Luna Luaverde",
        class: "Druida",
        level: 7,
        race: "Élfica",
        background: "Eremita",
        hp: { current: 45, max: 52 },
        ac: 14,
        stats: {
          strength: 10,
          dexterity: 14,
          constitution: 13,
          intelligence: 12,
          wisdom: 18,
          charisma: 15
        },
        skills: ["Medicina", "Natureza", "Percepção", "Sobrevivência"],
        backstory: "Protetora das florestas antigas, comunica-se com espíritos da natureza...",
        playerId: "player2", 
        playerName: "Maria Santos",
        status: "active"
      },
      {
        id: "3",
        name: "Zara Sombralâmina", 
        class: "Ladino",
        level: 6,
        race: "Halfling",
        background: "Criminoso",
        hp: { current: 38, max: 42 },
        ac: 15,
        stats: {
          strength: 8,
          dexterity: 18,
          constitution: 12,
          intelligence: 14,
          wisdom: 13,
          charisma: 16
        },
        skills: ["Furtividade", "Prestidigitação", "Percepção", "Enganação"],
        backstory: "Ex-ladra de rua que busca redenção através de aventuras...",
        status: "inactive"
      }
    ];
  });

  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Character>>({});
  
  // Função para resetar form data com valores padrão
  const resetFormData = () => {
    setFormData({
      name: "",
      class: "Guerreiro",
      race: "Humano",
      level: 1,
      background: "",
      avatarUrl: "",
      hp: { current: 10, max: 10 },
      ac: 10,
      stats: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10
      },
      skills: [],
      backstory: "",
      status: "active"
    });
  };

  const getClassIcon = (className: string) => {
    switch (className.toLowerCase()) {
      case "guerreiro": return <Sword className="h-4 w-4" />;
      case "mago": return <Wand2 className="h-4 w-4" />;
      case "ladino": return <Eye className="h-4 w-4" />;
      case "druida": return <Heart className="h-4 w-4" />;
      case "paladino": return <Shield className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "border-green-700/50 text-green-300";
      case "inactive": return "border-yellow-700/50 text-yellow-300";
      case "dead": return "border-red-700/50 text-red-300";
      default: return "border-gray-700/50 text-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Ativo";
      case "inactive": return "Inativo";
      case "dead": return "Morto";
      default: return status;
    }
  };

  const getStatModifier = (stat: number) => {
    return Math.floor((stat - 10) / 2);
  };

  const createCharacter = () => {
    const newCharacter: Character = {
      id: Date.now().toString(),
      name: formData.name || "Novo Personagem",
      class: formData.class || "Guerreiro",
      level: formData.level || 1,
      race: formData.race || "Humano",
      background: formData.background || "Aventureiro",
      avatarUrl: formData.avatarUrl || "",
      hp: formData.hp || { current: 10, max: 10 },
      ac: formData.ac || 10,
      stats: formData.stats || {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10
      },
      skills: formData.skills || [],
      backstory: formData.backstory || "",
      status: "active"
    };

    const updatedCharacters = [...characters, newCharacter];
    setCharacters(updatedCharacters);
    localStorage.setItem('crytto-characters', JSON.stringify(updatedCharacters));
    
    resetFormData();
    setIsCreateDialogOpen(false);
    toast.success(`✨ Personagem ${newCharacter.name} criado com sucesso!`);
  };

  const updateCharacter = () => {
    if (!selectedCharacter) return;

    const updatedCharacters = characters.map(char => 
      char.id === selectedCharacter.id 
        ? { ...char, ...formData }
        : char
    );
    
    setCharacters(updatedCharacters);
    localStorage.setItem('crytto-characters', JSON.stringify(updatedCharacters));
    
    resetFormData();
    setIsEditDialogOpen(false);
    setSelectedCharacter(null);
    toast.success(`✅ Personagem atualizado com sucesso!`);
  };

  const deleteCharacter = (id: string) => {
    const updatedCharacters = characters.filter(char => char.id !== id);
    setCharacters(updatedCharacters);
    localStorage.setItem('crytto-characters', JSON.stringify(updatedCharacters));
    toast.success("🗑️ Personagem removido!");
  };

  const CharacterForm = ({ isEdit = false }) => (
    <div className="space-y-4">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Básico</TabsTrigger>
          <TabsTrigger value="stats">Atributos</TabsTrigger>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              {formData.avatarUrl ? (
                <AvatarImage src={formData.avatarUrl} alt={formData.name} />
              ) : (
                <AvatarFallback className="bg-red-900/30 border border-red-700/50 text-red-200">
                  {formData.name?.substring(0, 2) || "??"}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 space-y-2">
              <Label>Avatar URL</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.avatarUrl || ""}
                  onChange={(e) => setFormData(prev => ({...prev, avatarUrl: e.target.value}))}
                  placeholder="https://exemplo.com/avatar.jpg"
                />
                <Button variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nome</Label>
              <Input
                value={formData.name || ""}
                onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                placeholder="Nome do personagem"
              />
            </div>
            <div>
              <Label>Nível</Label>
              <Input
                type="number"
                min="1"
                max="20"
                value={formData.level || 1}
                onChange={(e) => setFormData(prev => ({...prev, level: parseInt(e.target.value) || 1}))}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Classe</Label>
              <Select 
                value={formData.class || ""} 
                onValueChange={(value) => setFormData(prev => ({...prev, class: value}))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a classe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Guerreiro">Guerreiro</SelectItem>
                  <SelectItem value="Mago">Mago</SelectItem>
                  <SelectItem value="Ladino">Ladino</SelectItem>
                  <SelectItem value="Druida">Druida</SelectItem>
                  <SelectItem value="Paladino">Paladino</SelectItem>
                  <SelectItem value="Bárbaro">Bárbaro</SelectItem>
                  <SelectItem value="Clérigo">Clérigo</SelectItem>
                  <SelectItem value="Ranger">Ranger</SelectItem>
                  <SelectItem value="Feiticeiro">Feiticeiro</SelectItem>
                  <SelectItem value="Warlock">Warlock</SelectItem>
                  <SelectItem value="Bardo">Bardo</SelectItem>
                  <SelectItem value="Monge">Monge</SelectItem>
                  <SelectItem value="Artificer">Artificer</SelectItem>
                  <SelectItem value="Blood Hunter">Blood Hunter</SelectItem>
                  <SelectItem value="Mystic">Mystic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Raça</Label>
              <Select 
                value={formData.race || ""} 
                onValueChange={(value) => setFormData(prev => ({...prev, race: value}))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a raça" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Humano">Humano</SelectItem>
                  <SelectItem value="Élfico">Élfico</SelectItem>
                  <SelectItem value="Anão">Anão</SelectItem>
                  <SelectItem value="Halfling">Halfling</SelectItem>
                  <SelectItem value="Draconato">Draconato</SelectItem>
                  <SelectItem value="Tiefling">Tiefling</SelectItem>
                  <SelectItem value="Orc">Orc</SelectItem>
                  <SelectItem value="Gnomo">Gnomo</SelectItem>
                  <SelectItem value="Meio-Élfico">Meio-Élfico</SelectItem>
                  <SelectItem value="Meio-Orc">Meio-Orc</SelectItem>
                  <SelectItem value="Aarakocra">Aarakocra</SelectItem>
                  <SelectItem value="Aasimar">Aasimar</SelectItem>
                  <SelectItem value="Genasi">Genasi</SelectItem>
                  <SelectItem value="Goliath">Goliath</SelectItem>
                  <SelectItem value="Kenku">Kenku</SelectItem>
                  <SelectItem value="Lizardfolk">Lizardfolk</SelectItem>
                  <SelectItem value="Tabaxi">Tabaxi</SelectItem>
                  <SelectItem value="Triton">Triton</SelectItem>
                  <SelectItem value="Yuan-ti">Yuan-ti</SelectItem>
                  <SelectItem value="Firbolg">Firbolg</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label>Antecedente</Label>
            <Input
              value={formData.background || ""}
              onChange={(e) => setFormData(prev => ({...prev, background: e.target.value}))}
              placeholder="Ex: Soldado, Criminoso, Eremita..."
            />
          </div>
        </TabsContent>
        
        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>HP Atual / Máximo</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={formData.hp?.current || 10}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value) || 10;
                    setFormData(prev => ({
                      ...prev, 
                      hp: { 
                        current: newValue, 
                        max: prev.hp?.max || 10 
                      }
                    }));
                  }}
                />
                <span className="flex items-center">/</span>
                <Input
                  type="number"
                  value={formData.hp?.max || 10}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value) || 10;
                    setFormData(prev => ({
                      ...prev, 
                      hp: { 
                        current: prev.hp?.current || 10,
                        max: newValue
                      }
                    }));
                  }}
                />
              </div>
            </div>
            <div>
              <Label>Classe de Armadura</Label>
              <Input
                type="number"
                value={formData.ac || 10}
                onChange={(e) => setFormData(prev => ({...prev, ac: parseInt(e.target.value) || 10}))}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {Object.entries({
              strength: "Força",
              dexterity: "Destreza", 
              constitution: "Constituição",
              intelligence: "Inteligência",
              wisdom: "Sabedoria",
              charisma: "Carisma"
            }).map(([key, label]) => (
              <div key={key}>
                <Label>{label}</Label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.stats?.[key as keyof typeof formData.stats] || 10}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value) || 10;
                    setFormData(prev => ({
                      ...prev,
                      stats: {
                        ...prev.stats,
                        [key]: newValue
                      } as any
                    }));
                  }}
                />
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-4">
          <div>
            <Label>Perícias</Label>
            <Textarea
              value={formData.skills?.join(", ") || ""}
              onChange={(e) => setFormData(prev => ({
                ...prev, 
                skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
              }))}
              placeholder="Digite as perícias separadas por vírgula. Ex: Percepção, Furtividade, Intimidação, Atletismo..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Separe as perícias com vírgula
            </p>
          </div>
          
          <div>
            <Label>História de Fundo</Label>
            <Textarea
              value={formData.backstory || ""}
              onChange={(e) => setFormData(prev => ({...prev, backstory: e.target.value}))}
              placeholder="Conte a história do seu personagem..."
              rows={4}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => {
          setIsCreateDialogOpen(false);
          setIsEditDialogOpen(false);
          resetFormData();
        }}>
          Cancelar
        </Button>
        <Button onClick={isEdit ? updateCharacter : createCharacter}>
          {isEdit ? "Atualizar" : "Criar"} Personagem
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {userType === "master" ? <Crown className="h-5 w-5" /> : <Users className="h-5 w-5" />}
            {userType === "master" ? "Gerenciar Personagens" : "Seus Personagens"}
          </CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetFormData}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Personagem
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Novo Personagem</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes do seu novo personagem de RPG
                </DialogDescription>
              </DialogHeader>
              <CharacterForm />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {characters.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <User className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>Nenhum personagem criado ainda.</p>
            <p className="text-sm">Clique em "Novo Personagem" para começar!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {characters.map((character) => (
              <Card key={character.id} className="hover:border-red-700/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      {character.avatarUrl ? (
                        <AvatarImage src={character.avatarUrl} alt={character.name} />
                      ) : (
                        <AvatarFallback className="bg-red-900/30 border border-red-700/50 text-red-200">
                          {character.name.substring(0, 2)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{character.name}</h4>
                        <Badge variant="outline" className={getStatusColor(character.status)}>
                          {getStatusText(character.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {getClassIcon(character.class)}
                        <span>{character.race} {character.class}</span>
                        <Badge variant="outline" className="text-xs">Nível {character.level}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">HP:</span>
                      <div className="font-medium">
                        {character.hp.current}/{character.hp.max}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">CA:</span>
                      <div className="font-medium">{character.ac}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {Object.entries({
                      STR: character.stats.strength,
                      DEX: character.stats.dexterity,
                      CON: character.stats.constitution,
                      INT: character.stats.intelligence,
                      WIS: character.stats.wisdom,
                      CHA: character.stats.charisma
                    }).map(([key, value]) => (
                      <div key={key} className="text-center bg-muted/30 rounded p-1">
                        <div className="text-muted-foreground">{key}</div>
                        <div className="font-medium">
                          {value} ({getStatModifier(value) >= 0 ? '+' : ''}{getStatModifier(value)})
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {character.playerName && userType === "master" && (
                    <div className="text-xs text-muted-foreground border-t pt-2">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        Jogador: {character.playerName}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => {
                            setSelectedCharacter(character);
                            setFormData(character);
                          }}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Editar {selectedCharacter?.name}</DialogTitle>
                          <DialogDescription>
                            Modifique os atributos e informações do personagem
                          </DialogDescription>
                        </DialogHeader>
                        <CharacterForm isEdit />
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteCharacter(character.id)}
                      className="border-red-700/50 text-red-300 hover:bg-red-900/30"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}