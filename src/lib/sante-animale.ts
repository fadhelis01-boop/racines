import { MALADIES_ANIMALES, type MaladieAnimale } from "../data/maladies-animales";

// Classement des causes probables : signes cochés en commun, puis gravité
export function diagnostiquerAnimal(espece: string, signes: string[]): { m: MaladieAnimale; score: number }[] {
  return MALADIES_ANIMALES
    .filter((m) => !espece || m.especes.includes(espece))
    .map((m) => {
      const communs = m.signesIds.filter((s) => signes.includes(s)).length;
      const score = communs === 0 ? 0 : communs * 10 + (communs / m.signesIds.length) * 5 + m.urgence;
      return { m, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
}
