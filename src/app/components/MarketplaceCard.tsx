import { Button } from "./ui/button";
import { Star } from "lucide-react";

interface MarketplaceCardProps {
  title: string;
  price: number;
  rating: number;
  category: string;
  onBuy?: () => void;
}

export function MarketplaceCard({ title, price, rating, category, onBuy }: MarketplaceCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg hover:shadow-red-900/20 transition-all hover:border-red-700/50">
      <div className="bg-gray-800 h-32 flex items-center justify-center">
        <span className="text-gray-400 text-sm">Preview</span>
      </div>
      
      <div className="p-3">
        <div className="text-xs text-red-400 mb-1 uppercase tracking-wide">{category}</div>
        <h3 className="font-medium text-sm mb-2 truncate text-card-foreground">{title}</h3>
        
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-3 w-3 fill-red-400 text-red-400" />
          <span className="text-xs text-muted-foreground">{rating}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm text-red-300">{price} Crytts</span>
          <Button size="sm" onClick={onBuy} className="bg-primary hover:bg-primary/90">
            Comprar
          </Button>
        </div>
      </div>
    </div>
  );
}