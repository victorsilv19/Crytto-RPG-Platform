import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { toast } from "sonner@2.0.3";
import { 
  CreditCard, 
  Coins, 
  Gift, 
  TrendingUp, 
  Zap, 
  Star,
  Crown,
  ShoppingBag
} from "lucide-react";

interface CryttsShopProps {
  balance: number;
  onPurchase: (amount: number, price: number) => void;
}

interface CryttsPackage {
  id: string;
  name: string;
  crytts: number;
  price: number;
  bonus?: number;
  popular?: boolean;
  bestValue?: boolean;
}

export function CryttsShop({ balance, onPurchase }: CryttsShopProps) {
  const [selectedPayment, setSelectedPayment] = useState("credit");
  const [customAmount, setCustomAmount] = useState("");

  const packages: CryttsPackage[] = [
    {
      id: "starter",
      name: "Pacote Iniciante",
      crytts: 100,
      price: 4.99,
      bonus: 0
    },
    {
      id: "adventurer", 
      name: "Pacote Aventureiro",
      crytts: 250,
      price: 9.99,
      bonus: 25,
      popular: true
    },
    {
      id: "hero",
      name: "Pacote Herói",
      crytts: 500,
      price: 19.99,
      bonus: 75
    },
    {
      id: "legend",
      name: "Pacote Lenda",
      crytts: 1000,
      price: 34.99,
      bonus: 200,
      bestValue: true
    },
    {
      id: "master",
      name: "Pacote Mestre",
      crytts: 2500,
      price: 79.99,
      bonus: 600
    },
    {
      id: "god",
      name: "Pacote Divino",
      crytts: 5000,
      price: 149.99,
      bonus: 1500
    }
  ];

  const paymentMethods = [
    { id: "credit", name: "Cartão de Crédito", icon: CreditCard },
    { id: "pix", name: "PIX", icon: Zap },
    { id: "paypal", name: "PayPal", icon: ShoppingBag },
    { id: "crypto", name: "Criptomoeda", icon: Coins }
  ];

  const handlePurchase = (pkg: CryttsPackage) => {
    const totalCrytts = pkg.crytts + (pkg.bonus || 0);
    onPurchase(totalCrytts, pkg.price);
    toast.success(`🎉 ${totalCrytts} Crytts adquiridos com sucesso!`);
  };

  const handleCustomPurchase = () => {
    const amount = parseInt(customAmount);
    if (amount < 10) {
      toast.error("Quantidade mínima: 10 Crytts");
      return;
    }
    
    const price = (amount * 0.05); // R$ 0,05 por Crytt
    onPurchase(amount, price);
    toast.success(`🎉 ${amount} Crytts personalizados adquiridos!`);
    setCustomAmount("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-red-900/20 to-red-700/10 border-red-700/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Loja de Crytts</h2>
              <p className="text-muted-foreground">
                Adquira Crytts para apoiar criadores, comprar conteúdo e interagir com streams
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{balance}</div>
              <div className="text-sm text-muted-foreground">Crytts atuais</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <Card 
            key={pkg.id} 
            className={`relative hover:border-red-700/50 transition-colors ${
              pkg.popular ? 'border-primary ring-1 ring-primary/20' : ''
            } ${pkg.bestValue ? 'border-yellow-600 ring-1 ring-yellow-600/20' : ''}`}
          >
            {/* Badges */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 flex gap-2">
              {pkg.popular && (
                <Badge className="bg-primary text-white">
                  <Star className="h-3 w-3 mr-1" />
                  Mais Popular
                </Badge>
              )}
              {pkg.bestValue && (
                <Badge className="bg-yellow-600 text-white">
                  <Crown className="h-3 w-3 mr-1" />
                  Melhor Valor
                </Badge>
              )}
            </div>

            <CardHeader className="text-center pt-6">
              <CardTitle className="text-lg">{pkg.name}</CardTitle>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {pkg.crytts.toLocaleString()}
                  {pkg.bonus && (
                    <span className="text-lg text-green-400">
                      +{pkg.bonus}
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {pkg.bonus && `Bônus de ${pkg.bonus} Crytts • `}
                  Total: {(pkg.crytts + (pkg.bonus || 0)).toLocaleString()} Crytts
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  R$ {pkg.price.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">
                  ~R$ {(pkg.price / (pkg.crytts + (pkg.bonus || 0))).toFixed(4)} por Crytt
                </div>
              </div>

              <Button 
                onClick={() => handlePurchase(pkg)}
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
              >
                <Coins className="h-4 w-4 mr-2" />
                Comprar Agora
              </Button>

              {/* Package Benefits */}
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  <span>Crédito instantâneo</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  <span>Sem taxas extras</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  <span>Suporte 24/7</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Custom Amount */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Quantidade Personalizada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Quantidade de Crytts</Label>
              <Input
                type="number"
                min="10"
                max="10000"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Mínimo 10 Crytts"
              />
            </div>
            <div className="flex-1">
              <Label>Preço Total</Label>
              <div className="h-10 flex items-center px-3 border border-border rounded-md bg-muted">
                R$ {customAmount ? (parseInt(customAmount) * 0.05).toFixed(2) : "0.00"}
              </div>
            </div>
          </div>
          <Button 
            onClick={handleCustomPurchase}
            disabled={!customAmount || parseInt(customAmount) < 10}
            className="w-full"
          >
            <Coins className="h-4 w-4 mr-2" />
            Comprar {customAmount || 0} Crytts
          </Button>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Métodos de Pagamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {paymentMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <Button
                  key={method.id}
                  variant={selectedPayment === method.id ? "default" : "outline"}
                  onClick={() => setSelectedPayment(method.id)}
                  className="h-16 flex flex-col gap-1"
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="text-xs">{method.name}</span>
                </Button>
              );
            })}
          </div>

          <Separator />

          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-medium mb-2">Segurança Garantida</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Pagamento criptografado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Dados protegidos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Reembolso em 7 dias</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Earnings Info for Masters */}
      <Card className="bg-gradient-to-r from-green-900/20 to-green-700/10 border-green-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-400">
            <TrendingUp className="h-5 w-5" />
            Para Mestres de RPG
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Como mestre, você pode ganhar Crytts através de:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Doações em live streams</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Vendas no marketplace</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Assinaturas de fãs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Sessões privadas</span>
              </div>
            </div>
          </div>
          <Button variant="outline" className="border-green-700/50 text-green-300 hover:bg-green-900/30">
            <Crown className="h-4 w-4 mr-2" />
            Saiba Mais sobre Monetização
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}