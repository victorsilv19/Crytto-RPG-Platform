import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { toast } from "sonner@2.0.3";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  MapPin, 
  Bell,
  Repeat,
  Video,
  Star,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface SessionEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  duration: number; // in minutes
  type: "session" | "planning" | "oneshot" | "campaign";
  location?: string;
  players: string[];
  maxPlayers: number;
  isRecurring: boolean;
  recurringType?: "weekly" | "biweekly" | "monthly";
  status: "scheduled" | "live" | "completed" | "cancelled";
  reminder: boolean;
  isPublic: boolean;
}

interface CalendarAgendaProps {
  userType: "master" | "player";
}

export function CalendarAgenda({ userType }: CalendarAgendaProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [events, setEvents] = useState<SessionEvent[]>([
    {
      id: "1",
      title: "Campanha: Reino de Eldoria - Episódio 12",
      description: "Os heróis enfrentam o Dragão Dourado na torre final",
      date: new Date(2024, 11, 28), // 28 de dezembro
      time: "19:00",
      duration: 240,
      type: "campaign",
      players: ["João Silva", "Maria Santos", "Pedro Costa"],
      maxPlayers: 5,
      isRecurring: true,
      recurringType: "weekly",
      status: "scheduled",
      reminder: true,
      isPublic: true
    },
    {
      id: "2",
      title: "One-Shot: Mistério na Taverna",
      description: "Aventura única para jogadores iniciantes",
      date: new Date(2024, 11, 30),
      time: "20:30",
      duration: 180,
      type: "oneshot",
      players: ["Ana Lima", "Carlos Mendes"],
      maxPlayers: 4,
      isRecurring: false,
      status: "scheduled",
      reminder: true,
      isPublic: true
    },
    {
      id: "3",
      title: "Planejamento: Nova Campanha Cyberpunk",
      description: "Sessão de criação de personagens e worldbuilding",
      date: new Date(2025, 0, 2), // 2 de janeiro
      time: "18:00",
      duration: 120,
      type: "planning",
      players: [],
      maxPlayers: 6,
      isRecurring: false,
      status: "scheduled",
      reminder: true,
      isPublic: false
    }
  ]);
  
  const [formData, setFormData] = useState<Partial<SessionEvent>>({});
  const [selectedEvent, setSelectedEvent] = useState<SessionEvent | null>(null);

  // Calendar logic
  const today = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  const getDaysInCalendar = () => {
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "campaign": return "bg-blue-500";
      case "oneshot": return "bg-green-500";
      case "planning": return "bg-yellow-500";
      case "session": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live": return "text-red-400 border-red-400";
      case "completed": return "text-green-400 border-green-400";
      case "cancelled": return "text-gray-400 border-gray-400";
      case "scheduled": return "text-blue-400 border-blue-400";
      default: return "text-gray-400 border-gray-400";
    }
  };

  const createEvent = () => {
    const newEvent: SessionEvent = {
      id: Date.now().toString(),
      title: formData.title || "Nova Sessão",
      description: formData.description || "",
      date: formData.date || new Date(),
      time: formData.time || "19:00",
      duration: formData.duration || 180,
      type: formData.type || "session",
      players: formData.players || [],
      maxPlayers: formData.maxPlayers || 5,
      isRecurring: formData.isRecurring || false,
      recurringType: formData.recurringType,
      status: "scheduled",
      reminder: formData.reminder || true,
      isPublic: formData.isPublic || true
    };

    setEvents(prev => [...prev, newEvent]);
    setFormData({});
    setIsCreateDialogOpen(false);
    
    // Save to localStorage
    localStorage.setItem('crytto-calendar-events', JSON.stringify([...events, newEvent]));
    
    toast.success(`📅 ${newEvent.title} agendado com sucesso!`);
  };

  const updateEvent = () => {
    if (!selectedEvent) return;

    setEvents(prev => prev.map(event => 
      event.id === selectedEvent.id 
        ? { ...event, ...formData }
        : event
    ));
    
    setFormData({});
    setIsEditDialogOpen(false);
    setSelectedEvent(null);
    
    // Save to localStorage
    const updatedEvents = events.map(event => 
      event.id === selectedEvent.id 
        ? { ...event, ...formData }
        : event
    );
    localStorage.setItem('crytto-calendar-events', JSON.stringify(updatedEvents));
    
    toast.success("✅ Evento atualizado!");
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    
    // Save to localStorage
    const updatedEvents = events.filter(event => event.id !== eventId);
    localStorage.setItem('crytto-calendar-events', JSON.stringify(updatedEvents));
    
    toast.success("🗑️ Evento removido!");
  };

  const EventForm = ({ isEdit = false }) => (
    <div className="space-y-4">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Básico</TabsTrigger>
          <TabsTrigger value="players">Jogadores</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <div>
            <Label>Título</Label>
            <Input
              value={formData.title || ""}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Nome da sessão"
            />
          </div>
          
          <div>
            <Label>Descrição</Label>
            <Textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Descreva o que acontecerá na sessão..."
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo</Label>
              <Select 
                value={formData.type || ""} 
                onValueChange={(value) => setFormData({...formData, type: value as any})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de sessão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="session">Sessão Regular</SelectItem>
                  <SelectItem value="campaign">Campanha</SelectItem>
                  <SelectItem value="oneshot">One-Shot</SelectItem>
                  <SelectItem value="planning">Planejamento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Duração (minutos)</Label>
              <Input
                type="number"
                min="30"
                max="600"
                value={formData.duration || 180}
                onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Data</Label>
              <Input
                type="date"
                value={formData.date ? formData.date.toISOString().split('T')[0] : ""}
                onChange={(e) => setFormData({...formData, date: new Date(e.target.value)})}
              />
            </div>
            
            <div>
              <Label>Horário</Label>
              <Input
                type="time"
                value={formData.time || "19:00"}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="players" className="space-y-4">
          <div>
            <Label>Máximo de Jogadores</Label>
            <Input
              type="number"
              min="1"
              max="10"
              value={formData.maxPlayers || 5}
              onChange={(e) => setFormData({...formData, maxPlayers: parseInt(e.target.value)})}
            />
          </div>
          
          <div>
            <Label>Jogadores Convidados</Label>
            <Textarea
              value={formData.players?.join(", ") || ""}
              onChange={(e) => setFormData({
                ...formData, 
                players: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
              })}
              placeholder="Digite os nomes separados por vírgula..."
              rows={3}
            />
          </div>
          
          <div>
            <Label>Local/Plataforma</Label>
            <Input
              value={formData.location || ""}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="Ex: Discord, Presencial, Roll20..."
            />
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Sessão Pública</Label>
              <p className="text-sm text-muted-foreground">Visível para outros jogadores</p>
            </div>
            <input
              type="checkbox"
              checked={formData.isPublic || false}
              onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
              className="rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Lembrete</Label>
              <p className="text-sm text-muted-foreground">Notificação antes da sessão</p>
            </div>
            <input
              type="checkbox"
              checked={formData.reminder || false}
              onChange={(e) => setFormData({...formData, reminder: e.target.checked})}
              className="rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Evento Recorrente</Label>
              <p className="text-sm text-muted-foreground">Repetir automaticamente</p>
            </div>
            <input
              type="checkbox"
              checked={formData.isRecurring || false}
              onChange={(e) => setFormData({...formData, isRecurring: e.target.checked})}
              className="rounded"
            />
          </div>
          
          {formData.isRecurring && (
            <div>
              <Label>Frequência</Label>
              <Select 
                value={formData.recurringType || ""} 
                onValueChange={(value) => setFormData({...formData, recurringType: value as any})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Com que frequência?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="biweekly">Quinzenal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => {
          setIsCreateDialogOpen(false);
          setIsEditDialogOpen(false);
          setFormData({});
        }}>
          Cancelar
        </Button>
        <Button onClick={isEdit ? updateEvent : createEvent}>
          {isEdit ? "Atualizar" : "Criar"} Evento
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Agenda de Sessões
            </CardTitle>
            {userType === "master" && (
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setFormData({})}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Sessão
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Agendar Nova Sessão</DialogTitle>
                    <DialogDescription>
                      Configure os detalhes da sua próxima sessão de RPG
                    </DialogDescription>
                  </DialogHeader>
                  <EventForm />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Hoje
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {getDaysInCalendar().map((date, index) => {
                  const dayEvents = getEventsForDate(date);
                  const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                  const isToday = date.toDateString() === today.toDateString();
                  const isSelected = selectedDate?.toDateString() === date.toDateString();
                  
                  return (
                    <div
                      key={index}
                      className={`min-h-24 p-1 border border-border rounded cursor-pointer transition-colors hover:bg-accent/50 ${
                        !isCurrentMonth ? 'text-muted-foreground bg-muted/30' : ''
                      } ${isToday ? 'bg-primary/10 border-primary/30' : ''} ${
                        isSelected ? 'bg-accent border-accent-foreground' : ''
                      }`}
                      onClick={() => setSelectedDate(date)}
                    >
                      <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary' : ''}`}>
                        {date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded truncate ${getEventTypeColor(event.type)} text-white`}
                            title={event.title}
                          >
                            {event.time} {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayEvents.length - 2} mais
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Event Details */}
        <div className="space-y-4">
          {/* Selected Date Events */}
          {selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {selectedDate.toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getEventsForDate(selectedDate).length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhuma sessão agendada</p>
                ) : (
                  <div className="space-y-3">
                    {getEventsForDate(selectedDate).map(event => (
                      <Card key={event.id} className="bg-muted/30">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm">{event.title}</h4>
                            {userType === "master" && (
                              <div className="flex gap-1">
                                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                  <DialogTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                      onClick={() => {
                                        setSelectedEvent(event);
                                        setFormData(event);
                                      }}
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>Editar {selectedEvent?.title}</DialogTitle>
                                      <DialogDescription>
                                        Modifique os detalhes da sessão
                                      </DialogDescription>
                                    </DialogHeader>
                                    <EventForm isEdit />
                                  </DialogContent>
                                </Dialog>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                                  onClick={() => deleteEvent(event.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              <span>{event.time} ({event.duration}min)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-3 w-3" />
                              <span>{event.players.length}/{event.maxPlayers} jogadores</span>
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3 w-3" />
                                <span>{event.location}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className={getStatusColor(event.status)}>
                              {event.status === 'scheduled' && 'Agendado'}
                              {event.status === 'live' && 'Ao Vivo'}
                              {event.status === 'completed' && 'Concluído'}
                              {event.status === 'cancelled' && 'Cancelado'}
                            </Badge>
                            {event.isRecurring && (
                              <Badge variant="outline" className="text-purple-400 border-purple-400">
                                <Repeat className="h-3 w-3 mr-1" />
                                Recorrente
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Próximas Sessões</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events
                  .filter(event => new Date(event.date) >= today && event.status === 'scheduled')
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(0, 5)
                  .map(event => (
                    <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                      <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.date).toLocaleDateString('pt-BR')} às {event.time}
                        </p>
                      </div>
                      {event.reminder && <Bell className="h-3 w-3 text-yellow-500" />}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="text-lg font-bold text-primary">
                    {events.filter(e => e.status === 'scheduled').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Agendadas</div>
                </div>
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="text-lg font-bold text-green-400">
                    {events.filter(e => e.status === 'completed').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Completas</div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">
                  {Math.round(events.filter(e => e.status === 'completed').reduce((sum, e) => sum + e.duration, 0) / 60)}h
                </div>
                <div className="text-xs text-muted-foreground">Total jogado</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}