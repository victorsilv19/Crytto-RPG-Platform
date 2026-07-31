import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, RotateCcw, Plus } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { motion } from "motion/react";

interface DiceResult {
  id: string;
  type: string;
  result: number;
  timestamp: Date;
  modifier?: number;
  total: number;
}

interface DiceRollerProps {
  onRoll?: (result: DiceResult) => void;
}

export function DiceRoller({ onRoll }: DiceRollerProps) {
  const [isRolling, setIsRolling] = useState(false);
  const [lastResult, setLastResult] = useState<DiceResult | null>(null);
  const [lastMultipleResults, setLastMultipleResults] = useState<DiceResult[]>([]);
  const [history, setHistory] = useState<DiceResult[]>([]);
  const [modifier, setModifier] = useState(0);
  const [diceCount, setDiceCount] = useState(1);

  const diceTypes = [
    { name: "D4", sides: 4 },
    { name: "D6", sides: 6 },
    { name: "D8", sides: 8 },
    { name: "D10", sides: 10 },
    { name: "D12", sides: 12 },
    { name: "D20", sides: 20 },
    { name: "D100", sides: 100 }
  ];

  const rollDice = async (diceType: string, sides: number) => {
    if (isRolling) return;

    setIsRolling(true);

    // Simulate rolling animation delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const results: DiceResult[] = [];
    let grandTotal = 0;
    
    // Roll multiple dice
    for (let i = 0; i < diceCount; i++) {
      const result = Math.floor(Math.random() * sides) + 1;
      const total = result + (i === diceCount - 1 ? modifier : 0); // Add modifier only to last die
      
      const diceResult: DiceResult = {
        id: `${Date.now()}-${i}`,
        type: diceType,
        result,
        timestamp: new Date(),
        modifier: (i === diceCount - 1 && modifier !== 0) ? modifier : undefined,
        total
      };
      
      results.push(diceResult);
      grandTotal += result;
    }
    
    // Add modifier to grand total
    const finalTotal = grandTotal + modifier;
    
    // Set results
    if (diceCount === 1) {
      setLastResult(results[0]);
      setLastMultipleResults([]);
    } else {
      setLastResult(null);
      setLastMultipleResults(results);
    }
    
    setHistory(prev => [...results, ...prev.slice(0, 9)]); // Keep last 10 rolls
    setIsRolling(false);

    // Show toast with result
    if (diceCount === 1) {
      const result = results[0].result;
      if (diceType === "D20") {
        if (result === 20) {
          toast.success(`🎯 CRÍTICO! Rolou ${result}${modifier !== 0 ? ` + ${modifier} = ${finalTotal}` : ''}`);
        } else if (result === 1) {
          toast.error(`💥 FALHA CRÍTICA! Rolou ${result}${modifier !== 0 ? ` + ${modifier} = ${finalTotal}` : ''}`);
        } else {
          toast.info(`🎲 ${diceType}: ${result}${modifier !== 0 ? ` + ${modifier} = ${finalTotal}` : ''}`);
        }
      } else {
        toast.info(`🎲 ${diceType}: ${result}${modifier !== 0 ? ` + ${modifier} = ${finalTotal}` : ''}`);
      }
    } else {
      const resultsList = results.map(r => r.result).join(' + ');
      toast.info(`🎲 ${diceCount}${diceType}: ${resultsList}${modifier !== 0 ? ` + ${modifier}` : ''} = ${finalTotal}`);
    }

    onRoll?.(results[0]);
  };

  const getDiceIcon = (result: number) => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
    const IconComponent = icons[Math.min(result - 1, 5)];
    return IconComponent;
  };

  const getResultColor = (diceType: string, result: number) => {
    if (diceType === "D20") {
      if (result === 20) return "text-green-400";
      if (result === 1) return "text-red-400";
    }
    return "text-primary";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🎲 Rolagem de Dados
          {isRolling && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="text-primary"
            >
              <RotateCcw className="h-4 w-4" />
            </motion.div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dice Count Input */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Quantidade:</span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDiceCount(prev => Math.max(1, prev - 1))}
              className="h-8 w-8 p-0"
            >
              -
            </Button>
            <div className="w-12 text-center text-sm font-medium">
              {diceCount}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDiceCount(prev => Math.min(10, prev + 1))}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <span className="text-xs text-muted-foreground">dado(s)</span>
        </div>
        
        {/* Modifier Input */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Modificador:</span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModifier(prev => prev - 1)}
              className="h-8 w-8 p-0"
            >
              -
            </Button>
            <div className="w-12 text-center text-sm font-medium">
              {modifier > 0 ? `+${modifier}` : modifier}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModifier(prev => prev + 1)}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setModifier(0)}
            className="text-xs"
          >
            Reset
          </Button>
        </div>

        {/* Last Result Display - Single Die */}
        {lastResult && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-muted/50 rounded-lg p-4 text-center border border-primary/20"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              {getDiceIcon(lastResult.result) && React.createElement(getDiceIcon(lastResult.result), {
                className: `h-8 w-8 ${getResultColor(lastResult.type, lastResult.result)}`
              })}
            </div>
            <div className="space-y-1">
              <Badge variant="outline" className="border-primary/50 text-primary">
                {lastResult.type}
              </Badge>
              <div className={`text-2xl font-bold ${getResultColor(lastResult.type, lastResult.result)}`}>
                {lastResult.result}
                {lastResult.modifier && (
                  <span className="text-sm text-muted-foreground">
                    {lastResult.modifier > 0 ? ` + ${lastResult.modifier}` : ` ${lastResult.modifier}`}
                  </span>
                )}
              </div>
              {lastResult.modifier !== undefined && (
                <div className="text-lg font-medium text-foreground">
                  Total: {lastResult.total}
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        {/* Last Result Display - Multiple Dice */}
        {lastMultipleResults.length > 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-muted/50 rounded-lg p-4 border border-primary/20"
          >
            <div className="text-center mb-3">
              <Badge variant="outline" className="border-primary/50 text-primary">
                {lastMultipleResults.length}x {lastMultipleResults[0].type}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mb-3">
              {lastMultipleResults.map((result, idx) => (
                <div 
                  key={result.id}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 ${
                    getResultColor(result.type, result.result) === 'text-green-400' 
                      ? 'border-green-400/50 bg-green-400/10' 
                      : getResultColor(result.type, result.result) === 'text-red-400'
                      ? 'border-red-400/50 bg-red-400/10'
                      : 'border-primary/30 bg-primary/10'
                  }`}
                >
                  <span className={`font-bold ${getResultColor(result.type, result.result)}`}>
                    {result.result}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-center space-y-1">
              <div className="text-sm text-muted-foreground">
                {lastMultipleResults.map(r => r.result).join(' + ')}
                {lastMultipleResults[lastMultipleResults.length - 1].modifier !== undefined && (
                  <span>
                    {lastMultipleResults[lastMultipleResults.length - 1].modifier! > 0 
                      ? ` + ${lastMultipleResults[lastMultipleResults.length - 1].modifier}` 
                      : ` ${lastMultipleResults[lastMultipleResults.length - 1].modifier}`}
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold text-primary">
                Total: {lastMultipleResults.reduce((sum, r) => sum + r.result, 0) + (lastMultipleResults[lastMultipleResults.length - 1].modifier || 0)}
              </div>
            </div>
          </motion.div>
        )}

        {/* Dice Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {diceTypes.map((dice) => (
            <Button
              key={dice.name}
              variant="outline"
              onClick={() => rollDice(dice.name, dice.sides)}
              disabled={isRolling}
              className="h-12 flex flex-col gap-1"
            >
              <span className="text-xs font-medium">{dice.name}</span>
              <span className="text-xs text-muted-foreground">1-{dice.sides}</span>
            </Button>
          ))}
          
          {/* Quick D20 Button */}
          <Button
            onClick={() => rollDice("D20", 20)}
            disabled={isRolling}
            className="h-12 bg-primary hover:bg-primary/90 col-span-4"
          >
            {isRolling ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
              >
                🎲
              </motion.div>
            ) : (
              "🎲 ROLAR D20"
            )}
          </Button>
        </div>

        {/* Roll History */}
        {history.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Últimas Rolagens</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {history.map((roll) => (
                <div
                  key={roll.id}
                  className="flex items-center justify-between text-xs bg-muted/30 rounded px-2 py-1"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      {roll.type}
                    </Badge>
                    <span className={getResultColor(roll.type, roll.result)}>
                      {roll.result}
                      {roll.modifier !== undefined && (
                        <span className="text-muted-foreground">
                          {roll.modifier > 0 ? ` +${roll.modifier}` : ` ${roll.modifier}`} = {roll.total}
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    {roll.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHistory([])}
              className="w-full text-xs"
            >
              Limpar Histórico
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}