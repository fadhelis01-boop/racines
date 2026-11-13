import { Component, type ReactNode } from "react";

// Filet de sécurité : une erreur dans une page n'affiche jamais un écran blanc
export default class Garde extends Component<{ children: ReactNode; cle: string }, { err: Error | null; cle: string }> {
  state = { err: null as Error | null, cle: "" };
  static getDerivedStateFromError(err: Error) {
    return { err };
  }
  static getDerivedStateFromProps(p: { cle: string }, s: { err: Error | null; cle: string }) {
    return p.cle !== s.cle ? { err: null, cle: p.cle } : null;
  }
  render() {
    if (!this.state.err) return this.props.children;
    return (
      <div className="card" style={{ marginTop: 20 }}>
        <h2>Oups, cette page a rencontré un problème 🌱</h2>
        <p className="small muted">Vos données ne sont pas perdues. Revenez en arrière ou rechargez l'application.</p>
        <div className="row">
          <button className="btn" onClick={() => history.back()}>← Retour</button>
          <button className="btn primary" onClick={() => location.reload()}>Recharger</button>
        </div>
        <details className="box small"><summary>Détail technique</summary>{String(this.state.err.message)}</details>
      </div>
    );
  }
}
