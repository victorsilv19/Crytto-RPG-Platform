import React from "react";

interface State {
  error: Error | null;
}

// Evita a "tela preta": sem boundary, qualquer erro de renderização desmonta o app inteiro.
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[crytto] erro de renderização:", error, info.componentStack);
  }

  private recover = () => {
    // Volta para o dashboard: a última tela salva pode ser justamente a que falhou.
    localStorage.setItem("crytto-current-screen", "dashboard");
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-foreground p-6 text-center">
        <h1 className="text-2xl">Algo deu errado nesta tela</h1>
        <p className="text-muted-foreground max-w-md">{this.state.error.message}</p>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground" onClick={this.recover}>
            Voltar ao início
          </button>
          <button className="px-4 py-2 rounded-md border" onClick={() => window.location.reload()}>
            Recarregar
          </button>
        </div>
      </div>
    );
  }
}
