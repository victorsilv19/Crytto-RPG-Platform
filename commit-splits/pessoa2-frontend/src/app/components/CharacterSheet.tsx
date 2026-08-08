import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { toast } from "sonner";
import type { StoredCharacter } from "../lib/characterStore";
import { 
  Save, 
  Edit3, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Dice6, 
  Shield, 
  Sword, 
  Heart, 
  Zap, 
  Eye, 
  User,
  Backpack,
  FileUser
} from "lucide-react";

interface CharacterData {
  // Basic Info
  name: string;
  class: string;
  race: string;
  level: number;
  background: string;
  alignment: string;
  
  // Core Stats
  stats: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  
  // Combat Stats
  hitPoints: { current: number; max: number; temporary: number };
  armorClass: number;
  initiative: number;
  speed: number;
  
  // Skills & Proficiencies
  skills: { name: string; value: number; proficient: boolean }[];
  
  // Equipment
  equipment: { name: string; description: string; equipped: boolean }[];
  
  // Spells & Abilities
  spells: { name: string; level: number; description: string }[];
  abilities: { name: string; description: string; uses: { current: number; max: number } }[];
  
  // Background
  personality: string;
  backstory: string;
}

interface CharacterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  characters: StoredCharacter[];
  onSaveCharacter?: (character: StoredCharacter) => void;
}

const getModifier = (stat: number) => Math.floor((stat - 10) / 2);

// Converte o personagem persistido (formato do CharacterManager/localStorage)
// para o formato rico exibido na ficha, preenchendo campos extras com padrões.
function toSheetData(c: StoredCharacter): CharacterData {
  return {
    name: c.name,
    class: c.class,
    race: c.race,
    level: c.level,
    background: c.background,
    alignment: "Neutro",
    stats: { ...c.stats },
    hitPoints: { current: c.hp.current, max: c.hp.max, temporary: 0 },
    armorClass: c.ac,
    initiative: getModifier(c.stats.dexterity),
    speed: 30,
    skills: (c.skills || []).map((name) => ({ name, value: 0, proficient: false })),
    equipment: [],
    spells: [],
    abilities: [],
    personality: "",
    backstory: c.backstory || "",
  };
}

// Reaplica os campos editáveis da ficha de volta no personagem persistido.
function mergeIntoStored(base: StoredCharacter, sheet: CharacterData): StoredCharacter {
  return {
    ...base,
    name: sheet.name,
    class: sheet.class,
    race: sheet.race,
    background: sheet.background,
    stats: { ...sheet.stats },
    hp: { current: sheet.hitPoints.current, max: sheet.hitPoints.max },
    ac: sheet.armorClass,
    skills: sheet.skills.map((s) => s.name),
    backstory: sheet.backstory,
  };
}

export function CharacterSheet({ isOpen, onClose, characters, onSaveCharacter }: CharacterSheetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [characterData, setCharacterData] = useState<CharacterData | null>(null);

  // Seleciona automaticamente o primeiro personagem do usuário (nunca um exemplo).
  useEffect(() => {
    if (!isOpen) return;
    const exists = characters.some((c) => c.id === selectedId);
    const next = exists ? selectedId : characters[0]?.id || "";
    setSelectedId(next);
  }, [isOpen, characters]);

  // Sempre que a seleção mudar, monta os dados da ficha a partir do personagem real.
  useEffect(() => {
    const selected = characters.find((c) => c.id === selectedId);
    setCharacterData(selected ? toSheetData(selected) : null);
    setIsEditing(false);
  }, [selectedId, characters]);

  const getModifierString = (stat: number) => {
    const mod = getModifier(stat);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const handleSave = () => {
    const base = characters.find((c) => c.id === selectedId);
    if (!base || !characterData) return;
    onSaveCharacter?.(mergeIntoStored(base, characterData));
    setIsEditing(false);
    toast.success("📝 Ficha de personagem salva com sucesso!");
  };

  const handleReset = () => {
    const selected = characters.find((c) => c.id === selectedId);
    setCharacterData(selected ? toSheetData(selected) : null);
    setIsEditing(false);
    toast.info("🔄 Ficha restaurada.");
  };

  const rollAttribute = (statName: string, statValue: number) => {
    const roll = Math.floor(Math.random() * 20) + 1;
    const modifier = getModifier(statValue);
    const total = roll + modifier;
    toast.success(`🎲 ${statName}: ${roll} + ${modifier} = ${total}`);
  };

  if (!isOpen) return null;

  // Estado vazio: nenhum personagem criado ainda (sem exemplos pré-carregados).
  if (!characterData) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="border-b border-border flex-row items-center justify-between">
            <CardTitle>Ficha de Personagem</CardTitle>
            <Button variant="outline" onClick={onClose}>✕</Button>
          </CardHeader>
          <CardContent className="p-8 text-center text-muted-foreground">
            <FileUser className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="mb-1">Você ainda não tem personagens.</p>
            <p className="text-sm">Crie um personagem em "Meus Personagens" para ver sua ficha aqui.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-red-900/30 border border-red-700/50 text-red-200">
                  {characterData.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="flex items-center gap-2">
                  {isEditing ? (
                    <Input 
                      value={characterData.name}
                      onChange={(e) => setCharacterData({...characterData, name: e.target.value})}
                      className="text-lg font-medium"
                    />
                  ) : (
                    characterData.name
                  )}
                  <Badge variant="outline" className="border-red-700/50 text-red-300">
                    Nível {characterData.level}
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {characterData.race} {characterData.class} • {characterData.background}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 items-center">
              {/* Seletor de personagem quando o usuário possui mais de um */}
              {characters.length > 1 && !isEditing && (
                <Select value={selectedId} onValueChange={setSelectedId}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Escolher personagem" />
                  </SelectTrigger>
                  <SelectContent>
                    {characters.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleReset} className="border-red-700/50 text-red-300 hover:bg-red-900/30">
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Resetar
                  </Button>
                  <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                    <Save className="h-4 w-4 mr-1" />
                    Salvar
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)} className="border-red-700/50 text-red-300 hover:bg-red-900/30">
                  <Edit3 className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              )}
              <Button variant="outline" onClick={onClose}>
                ✕
              </Button>
            </div>
          </div>
        </CardHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <CardContent className="p-6">
            <Tabs defaultValue="stats" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="stats" className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Atributos
                </TabsTrigger>
                <TabsTrigger value="combat" className="flex items-center gap-1">
                  <Sword className="h-4 w-4" />
                  Combate
                </TabsTrigger>
                <TabsTrigger value="skills" className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  Perícias
                </TabsTrigger>
                <TabsTrigger value="equipment" className="flex items-center gap-1">
                  <Backpack className="h-4 w-4" />
                  Equipamentos
                </TabsTrigger>
                <TabsTrigger value="background" className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  História
                </TabsTrigger>
              </TabsList>

              {/* Attributes Tab */}
              <TabsContent value="stats" className="mt-6">
                <div className="grid grid-cols-3 gap-6">
                  {Object.entries(characterData.stats).map(([stat, value]) => (
                    <Card key={stat} className="text-center bg-muted/30">
                      <CardContent className="p-4">
                        <Label className="text-sm uppercase tracking-wide">
                          {stat === 'strength' && 'Força'}
                          {stat === 'dexterity' && 'Destreza'}
                          {stat === 'constitution' && 'Constituição'}
                          {stat === 'intelligence' && 'Inteligência'}
                          {stat === 'wisdom' && 'Sabedoria'}
                          {stat === 'charisma' && 'Carisma'}
                        </Label>
                        <div className="mt-2">
                          {isEditing ? (
                            <Input
                              type="number"
                              value={value}
                              onChange={(e) => setCharacterData({
                                ...characterData,
                                stats: { ...characterData.stats, [stat]: parseInt(e.target.value) || 0 }
                              })}
                              className="text-center text-2xl font-bold"
                            />
                          ) : (
                            <div 
                              className="text-2xl font-bold cursor-pointer hover:text-primary transition-colors"
                              onClick={() => rollAttribute(stat.charAt(0).toUpperCase() + stat.slice(1), value)}
                            >
                              {value}
                            </div>
                          )}
                          <div className="text-lg text-muted-foreground">
                            {getModifierString(value)}
                          </div>
                        </div>
                        {!isEditing && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2 border-red-700/50 text-red-300 hover:bg-red-900/30"
                            onClick={() => rollAttribute(stat.charAt(0).toUpperCase() + stat.slice(1), value)}
                          >
                            <Dice6 className="h-3 w-3 mr-1" />
                            Rolar
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Combat Tab */}
              <TabsContent value="combat" className="mt-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Heart className="h-5 w-5 text-red-500 mr-2" />
                        <Label>Pontos de Vida</Label>
                      </div>
                      <div className="text-2xl font-bold">
                        {isEditing ? (
                          <div className="flex gap-1">
                            <Input
                              type="number"
                              value={characterData.hitPoints.current}
                              onChange={(e) => setCharacterData({
                                ...characterData,
                                hitPoints: { ...characterData.hitPoints, current: parseInt(e.target.value) || 0 }
                              })}
                              className="text-center"
                            />
                            <span className="self-center">/</span>
                            <Input
                              type="number"
                              value={characterData.hitPoints.max}
                              onChange={(e) => setCharacterData({
                                ...characterData,
                                hitPoints: { ...characterData.hitPoints, max: parseInt(e.target.value) || 0 }
                              })}
                              className="text-center"
                            />
                          </div>
                        ) : (
                          <span className={characterData.hitPoints.current <= characterData.hitPoints.max * 0.3 ? 'text-red-400' : ''}>
                            {characterData.hitPoints.current}/{characterData.hitPoints.max}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Shield className="h-5 w-5 text-blue-500 mr-2" />
                        <Label>Classe de Armadura</Label>
                      </div>
                      <div className="text-2xl font-bold">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={characterData.armorClass}
                            onChange={(e) => setCharacterData({...characterData, armorClass: parseInt(e.target.value) || 0})}
                            className="text-center"
                          />
                        ) : (
                          characterData.armorClass
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                        <Label>Iniciativa</Label>
                      </div>
                      <div className="text-2xl font-bold">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={characterData.initiative}
                            onChange={(e) => setCharacterData({...characterData, initiative: parseInt(e.target.value) || 0})}
                            className="text-center"
                          />
                        ) : (
                          getModifierString(characterData.initiative)
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <User className="h-5 w-5 text-green-500 mr-2" />
                        <Label>Velocidade</Label>
                      </div>
                      <div className="text-2xl font-bold">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={characterData.speed}
                            onChange={(e) => setCharacterData({...characterData, speed: parseInt(e.target.value) || 0})}
                            className="text-center"
                          />
                        ) : (
                          `${characterData.speed} pés`
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Abilities */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-base">Habilidades Especiais</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {characterData.abilities.map((ability, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{ability.name}</h4>
                            <p className="text-sm text-muted-foreground">{ability.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="border-red-700/50 text-red-300">
                              {ability.uses.current}/{ability.uses.max}
                            </Badge>
                            {!isEditing && ability.uses.current > 0 && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-red-700/50 text-red-300 hover:bg-red-900/30"
                                onClick={() => toast.success(`✨ ${ability.name} ativada!`)}
                              >
                                Usar
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Skills Tab */}
              <TabsContent value="skills" className="mt-6">
                <div className="grid grid-cols-2 gap-4">
                  {characterData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{skill.name}</span>
                          {skill.proficient && (
                            <Badge variant="outline" className="border-green-700/50 text-green-300">
                              Proficiente
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">
                          {skill.value >= 0 ? '+' : ''}{skill.value}
                        </span>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-red-700/50 text-red-300 hover:bg-red-900/30"
                          onClick={() => {
                            const roll = Math.floor(Math.random() * 20) + 1;
                            const total = roll + skill.value;
                            toast.success(`🎲 ${skill.name}: ${roll} + ${skill.value} = ${total}`);
                          }}
                        >
                          <Dice6 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Equipment Tab */}
              <TabsContent value="equipment" className="mt-6">
                <div className="space-y-4">
                  {characterData.equipment.map((item, index) => (
                    <Card key={index} className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{item.name}</h4>
                              {item.equipped && (
                                <Badge className="bg-green-900/30 border border-green-700/50 text-green-300">
                                  Equipado
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          {isEditing && (
                            <Button variant="outline" size="sm" className="border-red-700/50 text-red-300 hover:bg-red-900/30">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {isEditing && (
                    <Button variant="outline" className="w-full border-red-700/50 text-red-300 hover:bg-red-900/30">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Equipamento
                    </Button>
                  )}
                </div>
              </TabsContent>

              {/* Background Tab */}
              <TabsContent value="background" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Personalidade</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <Textarea
                          value={characterData.personality}
                          onChange={(e) => setCharacterData({...characterData, personality: e.target.value})}
                          placeholder="Descreva a personalidade do seu personagem..."
                          className="min-h-24"
                        />
                      ) : (
                        <p className="text-muted-foreground">{characterData.personality}</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">História de Fundo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <Textarea
                          value={characterData.backstory}
                          onChange={(e) => setCharacterData({...characterData, backstory: e.target.value})}
                          placeholder="Conte a história do seu personagem..."
                          className="min-h-32"
                        />
                      ) : (
                        <p className="text-muted-foreground">{characterData.backstory}</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}