import React, { useEffect, useState } from "react";
import { marketplaceApi, type ApiMarketplaceItem } from "../lib/api";
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
import { toast } from "sonner";
import { 
  ShoppingCart, 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Star, 
  Download,
  Heart,
  Share2,
  Eye,
  Filter,
  Search,
  MapPin,
  Music,
  Scroll,
  Palette,
  DollarSign,
  TrendingUp,
  Award
} from "lucide-react";

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: "Mapas" | "Aventuras" | "Trilha Sonora" | "Tokens" | "Assets" | "Outros";
  rating: number;
  reviews: number;
  downloads: number;
  author: string;
  authorId: string;
  images: string[];
  tags: string[];
  createdAt: Date;
  isOwned?: boolean;
  isFavorite?: boolean;
}

interface EnhancedMarketplaceProps {
  userType: "master" | "player";
  balance: number;
  userId: string;
  onBalanceChange?: (newBalance: number) => void;
  onPurchase?: (item: MarketplaceItem) => void;
}

function fromApi(i: ApiMarketplaceItem, ownedIds: Set<string>): MarketplaceItem {
  return {
    id: i.id,
    title: i.title,
    description: i.description || "",
    price: i.price,
    category: i.category as MarketplaceItem["category"],
    rating: i.rating,
    reviews: i.reviews,
    downloads: i.downloads,
    author: i.author,
    authorId: i.author_id,
    images: i.images || [],
    tags: i.tags || [],
    createdAt: new Date(i.created_at),
    isOwned: ownedIds.has(i.id),
  };
}

export function EnhancedMarketplace({ userType, balance, userId, onBalanceChange, onPurchase }: EnhancedMarketplaceProps) {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [ownedIds, setOwnedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const [rawItems, owned] = await Promise.all([
          marketplaceApi.list(),
          marketplaceApi.purchases(userId),
        ]);
        const ownedSet = new Set(owned);
        setOwnedIds(ownedSet);
        setItems(rawItems.map(i => fromApi(i, ownedSet)));
      } catch (err) {
        console.warn("[crytto] falha ao carregar marketplace:", err);
        toast.error("Não foi possível carregar o marketplace.");
      }
    })();
  }, [userId]);

  const [cart, setCart] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState("recent");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<MarketplaceItem>>({});
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);

  const categories = [
    { value: "all", label: "Todas as Categorias", icon: null },
    { value: "Mapas", label: "Mapas", icon: MapPin },
    { value: "Aventuras", label: "Aventuras", icon: Scroll },
    { value: "Trilha Sonora", label: "Trilha Sonora", icon: Music },
    { value: "Tokens", label: "Tokens", icon: Palette },
    { value: "Assets", label: "Assets", icon: Upload },
    { value: "Outros", label: "Outros", icon: Star }
  ];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "rating": return b.rating - a.rating;
      case "popular": return b.downloads - a.downloads;
      case "recent": return b.createdAt.getTime() - a.createdAt.getTime();
      default: return 0;
    }
  });

  const addToCart = (itemId: string) => {
    if (!cart.includes(itemId)) {
      setCart(prev => [...prev, itemId]);
      toast.success("🛒 Item adicionado ao carrinho!");
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(id => id !== itemId));
    toast.info("🗑️ Item removido do carrinho");
  };

  const toggleFavorite = (itemId: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, isFavorite: !item.isFavorite }
        : item
    ));
    
    const item = items.find(i => i.id === itemId);
    if (item?.isFavorite) {
      toast.info("💔 Removido dos favoritos");
    } else {
      toast.success("❤️ Adicionado aos favoritos!");
    }
  };

  const purchaseItem = async (item: MarketplaceItem) => {
    if (item.isOwned) {
      toast.info("Você já possui este item.");
      return;
    }
    if (balance < item.price) {
      toast.error("💰 Crytts insuficientes para esta compra!");
      return;
    }
    try {
      const res = await marketplaceApi.purchase(item.id, userId);
      const newOwned = new Set(ownedIds); newOwned.add(item.id);
      setOwnedIds(newOwned);
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, isOwned: true } : i));
      removeFromCart(item.id);
      onBalanceChange?.(res.new_balance);
      onPurchase?.(item);
      toast.success(`✅ ${item.title} comprado com sucesso! (-${item.price} Crytts)`);
    } catch (err: any) {
      toast.error(err?.message || "Falha na compra.");
    }
  };

  const purchaseCart = async () => {
    const cartItems = items.filter(item => cart.includes(item.id) && !item.isOwned);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
    if (balance < totalPrice) {
      toast.error("💰 Crytts insuficientes para finalizar a compra!");
      return;
    }
    for (const item of cartItems) {
      await purchaseItem(item);
    }
    setCart([]);
    toast.success(`🎉 Compra finalizada! Total: ${totalPrice} Crytts`);
  };

  const createItem = async () => {
    try {
      const created = await marketplaceApi.create({
        title: formData.title || "Novo Item",
        description: formData.description || "",
        price: formData.price || 10,
        category: formData.category || "Outros",
        author: userType === "master" ? "Você" : "Usuário",
        author_id: userId,
        images: formData.images || [],
        tags: formData.tags || [],
      });
      const newItem = fromApi(created, ownedIds);
      setItems(prev => [newItem, ...prev]);
      setFormData({});
      setIsCreateDialogOpen(false);
      toast.success(`✨ ${newItem.title} criado com sucesso!`);
    } catch (err: any) {
      toast.error(err?.message || "Falha ao criar item.");
    }
  };

  const updateItem = async () => {
    if (!selectedItem) return;
    try {
      const updated = await marketplaceApi.update(selectedItem.id, {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        category: formData.category as any,
        tags: formData.tags,
        images: formData.images,
      });
      const merged = fromApi(updated, ownedIds);
      setItems(prev => prev.map(i => i.id === merged.id ? { ...merged, isFavorite: i.isFavorite } : i));
      setFormData({});
      setIsEditDialogOpen(false);
      setSelectedItem(null);
      toast.success("✅ Item atualizado com sucesso!");
    } catch (err: any) {
      toast.error(err?.message || "Falha ao atualizar item.");
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      await marketplaceApi.remove(itemId);
      setItems(prev => prev.filter(item => item.id !== itemId));
      toast.success("🗑️ Item removido do marketplace!");
    } catch (err: any) {
      toast.error(err?.message || "Falha ao remover item.");
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(cat => cat.value === category);
    return categoryData?.icon;
  };

  const ItemForm = ({ isEdit = false }) => (
    <div className="space-y-4">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Básico</TabsTrigger>
          <TabsTrigger value="media">Mídia</TabsTrigger>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <div>
            <Label>Título</Label>
            <Input
              value={formData.title || ""}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Nome do seu item"
            />
          </div>
          
          <div>
            <Label>Descrição</Label>
            <Textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Descreva seu item em detalhes..."
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Categoria</Label>
              <Select 
                value={formData.category || ""} 
                onValueChange={(value) => setFormData({...formData, category: value as any})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.slice(1).map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Preço (Crytts)</Label>
              <Input
                type="number"
                min="1"
                value={formData.price || 10}
                onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 10})}
              />
            </div>
          </div>
          
          <div>
            <Label>Tags (separadas por vírgula)</Label>
            <Input
              value={formData.tags?.join(", ") || ""}
              onChange={(e) => setFormData({
                ...formData, 
                tags: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
              })}
              placeholder="ex: medieval, castelo, horror"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="media" className="space-y-4">
          <div>
            <Label>Imagens</Label>
            <div className="space-y-2">
              <Input
                placeholder="URL da imagem principal"
                value={formData.images?.[0] || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  images: [e.target.value, ...(formData.images?.slice(1) || [])]
                })}
              />
              <Button variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Upload de Arquivo
              </Button>
            </div>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-medium mb-2">Preview</h4>
            <div className="bg-gray-800 border border-red-900/30 h-32 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Preview da imagem</span>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-4">
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-medium mb-2">Dicas para Vendas</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Use títulos descritivos e atrativos</li>
              <li>• Inclua pelo menos 3 imagens de alta qualidade</li>
              <li>• Adicione tags relevantes para facilitar a busca</li>
              <li>• Descreva o que está incluído no download</li>
            </ul>
          </div>
          
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium mb-2">Política de Preços</h4>
            <p className="text-sm text-muted-foreground">
              O Crytto cobra uma taxa de 15% sobre cada venda. Você receberá 85% do valor final.
            </p>
          </div>
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
        <Button onClick={isEdit ? updateItem : createItem}>
          {isEdit ? "Atualizar" : "Publicar"} Item
        </Button>
      </div>
    </div>
  );

  const cartTotal = cart.reduce((sum, itemId) => {
    const item = items.find(i => i.id === itemId);
    return sum + (item?.price || 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header and Cart */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              🛒 Marketplace
              <Badge variant="outline" className="border-primary/50 text-primary">
                {balance} Crytts
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <Button
                  onClick={purchaseCart}
                  className="bg-primary hover:bg-primary/90"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Finalizar Compra ({cartTotal} Crytts)
                </Button>
              )}
              
              {userType === "master" && (
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => setFormData({})}>
                      <Plus className="h-4 w-4 mr-2" />
                      Vender Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Adicionar Item ao Marketplace</DialogTitle>
                      <DialogDescription>
                        Crie um novo item para vender no marketplace
                      </DialogDescription>
                    </DialogHeader>
                    <ItemForm />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Search and Filters */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar itens..."
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center gap-2">
                      {cat.icon && React.createElement(cat.icon, { className: "h-4 w-4" })}
                      {cat.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Mais Recentes</SelectItem>
                <SelectItem value="popular">Mais Populares</SelectItem>
                <SelectItem value="rating">Melhor Avaliados</SelectItem>
                <SelectItem value="price-low">Menor Preço</SelectItem>
                <SelectItem value="price-high">Maior Preço</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <div className="text-lg font-medium text-primary">{filteredItems.length}</div>
              <div className="text-xs text-muted-foreground">Itens Encontrados</div>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <div className="text-lg font-medium text-green-400">{cart.length}</div>
              <div className="text-xs text-muted-foreground">No Carrinho</div>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <div className="text-lg font-medium text-blue-400">{items.filter(i => i.isOwned).length}</div>
              <div className="text-xs text-muted-foreground">Comprados</div>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <div className="text-lg font-medium text-red-400">{items.filter(i => i.isFavorite).length}</div>
              <div className="text-xs text-muted-foreground">Favoritos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => {
          const CategoryIcon = getCategoryIcon(item.category);
          const isInCart = cart.includes(item.id);
          
          return (
            <Card key={item.id} className="hover:border-red-700/50 transition-colors">
              <CardHeader className="pb-2">
                <div className="bg-gray-800 border border-red-900/30 h-32 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-transparent"></div>
                  {CategoryIcon && <CategoryIcon className="h-12 w-12 text-red-400 relative z-10" />}
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <Badge variant="outline" className="text-xs border-primary/50 text-primary">
                      {item.category}
                    </Badge>
                    {item.isOwned && (
                      <Badge className="text-xs bg-green-500">
                        Comprado
                      </Badge>
                    )}
                  </div>
                  
                  {/* Favorite Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0"
                    onClick={() => toggleFavorite(item.id)}
                  >
                    <Heart className={`h-3 w-3 ${item.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                  </Button>
                </div>
                
                <CardTitle className="text-sm leading-tight">{item.title}</CardTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>por {item.author}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{item.rating}</span>
                    <span>({item.reviews})</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 space-y-3">
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      +{item.tags.length - 3}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Download className="h-3 w-3" />
                    <span>{item.downloads}</span>
                  </div>
                  <span>{item.createdAt.toLocaleDateString()}</span>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="text-lg font-medium text-primary">{item.price}</span>
                    <span className="text-sm text-muted-foreground">Crytts</span>
                  </div>
                  
                  <div className="flex gap-1">
                    {item.authorId === "current-user" && userType === "master" ? (
                      <>
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedItem(item);
                                setFormData(item);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Editar {selectedItem?.title}</DialogTitle>
                              <DialogDescription>
                                Modifique as informações do seu item
                              </DialogDescription>
                            </DialogHeader>
                            <ItemForm isEdit />
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteItem(item.id)}
                          className="border-red-700/50 text-red-300 hover:bg-red-900/30"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </>
                    ) : item.isOwned ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.info("📥 Iniciando download...")}
                        className="border-green-700/50 text-green-300 hover:bg-green-900/30"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    ) : (
                      <>
                        {isInCart ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="border-red-700/50 text-red-300 hover:bg-red-900/30"
                          >
                            Remover
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addToCart(item.id)}
                          >
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Carrinho
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          onClick={() => purchaseItem(item)}
                          className="bg-primary hover:bg-primary/90"
                          disabled={balance < item.price}
                        >
                          Comprar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium mb-2">Nenhum item encontrado</h3>
            <p className="text-muted-foreground">
              Tente ajustar seus filtros ou buscar por outros termos.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}