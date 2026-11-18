import { useState } from "react";
import { useStore, setSettings, update, today, toggleFait, type Situation } from "../lib/store";
import { ZONES, animal } from "../data/index";
import { href } from "../lib/router";
import { Back, Listen, toast, A, Titre } from "../components/ui";
import { Vignette } from "../components/Ico";
import type { ZoneId } from "../data/calendrier";

// Déménager : appartement ↔ maison avec jardin, et tous les cas intermédiaires
const LIEUX: [Situation, string][] = [["jardin", "🏡 Maison avec jardin"], ["petit-jardin", "🌿 Petit jardin ou cour"], ["balcon", "🏢 Balcon ou terrasse"], ["appartement", "🏙️ Appartement sans extérieur"]];
const avecTerre = (s: Situation) => s === "jardin" || s === "petit-jardin";

interface Item { id: string; t: string; d?: string; lien?: [string, string] }

function checklist(de: Situation, vers: Situation, animaux: string[], plantes: number): { titre: string; items: Item[] }[] {
  const out: { titre: string; items: Item[] }[] = [];
  const perdTerre = avecTerre(de) && !avecTerre(vers);
  const gagneTerre = !avecTerre(de) && avecTerre(vers);
  const perdExterieur = de !== "appartement" && vers === "appartement";

  out.push({ titre: "Avant de partir : ce que j'emporte", items: [
    { id: "pots", t: "Faire l'inventaire des plantes en pot et de leurs besoins", d: `Vous suivez ${plantes} plante(s) dans « Mes plantes » : elles vous suivent dans l'appli, avec leurs rappels.` },
    ...(avecTerre(de) ? [
      { id: "vivaces", t: "Diviser les vivaces auxquelles vous tenez (rhubarbe, ciboulette, iris, hémérocalles, fraisiers…)", d: "Prenez un éclat avec racines plutôt que toute la touffe ; mettez-le en pot 2 à 4 semaines avant le départ pour qu'il s'enracine.", lien: ["/guide/bouturage", "Bouturer et diviser"] as [string, string] },
      { id: "boutures", t: "Bouturer arbustes et aromatiques (romarin, sauge, lavande, rosier, figuier, groseillier)", lien: ["/guide/bouturage", "Bouturer"] as [string, string] },
      { id: "graines", t: "Récolter les graines de vos variétés (tomates, haricots, fleurs)", lien: ["/guide/graines-maison", "Récolter ses graines"] as [string, string] },
      { id: "vente", t: "Vente ou fin de bail : vérifier ce que vous avez le droit d'emporter", d: "Les arbres et plantes en pleine terre font en principe partie du bien vendu : listez dans le compromis ce que vous gardez. En location, remettez le jardin dans l'état prévu par le bail." },
      { id: "compost", t: "Donner ou utiliser le compost, vider le récupérateur d'eau, nettoyer et ranger les outils" },
    ] : [
      { id: "boutures-int", t: "Bouturer les grandes plantes difficiles à transporter (pothos, monstera, ficus)", d: "Une bouture dans un bocal voyage partout ; c'est une assurance si la plante mère souffre du transport." },
    ]),
  ] });

  out.push({ titre: "Le jour J : transporter les plantes", items: [
    { id: "arroser", t: "Arroser 2 jours avant (pas la veille : un pot détrempé est lourd et coule)" },
    { id: "cartons", t: "Caler les pots dans des cartons ouverts, envelopper les grandes plantes dans un drap ou du papier kraft", d: "Attachez les tiges souples, protégez les pointes des cactus avec du papier journal." },
    { id: "chaleur", t: "Jamais de plantes dans un coffre fermé au soleil ni dans un camion qui dort dehors en hiver", d: "Au-dessus de 30 °C les feuilles brûlent en une heure ; sous 10 °C les plantes tropicales souffrent. Elles voyagent en dernier dans le camion et sortent en premier." },
    { id: "long", t: "Long trajet : feuillages tropicaux dans la voiture, pas plus de 2 jours sans lumière" },
  ] });

  if (animaux.length) {
    const ruminants = animaux.filter((a) => ["chevre", "mouton", "cochon"].includes(a));
    const equides = animaux.filter((a) => ["ane", "cheval"].includes(a));
    const volailles = animaux.filter((a) => ["poule", "canard", "oie", "pintade", "caille", "dindon", "pigeon"].includes(a));
    out.push({ titre: "Les animaux", items: [
      ...(perdTerre ? [{ id: "replacer", t: "Trouver un nouveau foyer à vos animaux AVANT le déménagement", d: "Voisins, amis, associations, groupes d'éleveurs locaux. Donnez les carnets, le registre et les habitudes (aliment, caractère). Prévoyez 1 à 3 mois." }] : []),
      ...(volailles.length ? [{ id: "volailles", t: "Volailles : déclarer leur détention à la mairie de la nouvelle commune", d: "Transport en cage ou carton aéré, de nuit ou tôt le matin, sans les nourrir 6 h avant. Gardez-les enfermées 3 à 5 jours dans le nouveau poulailler pour qu'il devienne « leur maison »." }] : []),
      ...(ruminants.length ? [{ id: "ruminants", t: "Chèvres, moutons, cochons : prévenir l'EDE (établissement de l'élevage) du changement de lieu, document de circulation pour le transport", d: "Les déplacements d'ovins, caprins et porcins sont tracés : registre d'élevage à jour, boucles d'identification, véhicule adapté." }] : []),
      ...(equides.length ? [{ id: "equides", t: "Ânes, chevaux : déclarer le nouveau lieu de détention auprès de l'IFCE (SIRE)", d: "Le document d'identification voyage avec l'animal ; l'abri et la clôture doivent être prêts à l'arrivée." }] : []),
      ...(animaux.includes("abeille") ? [{ id: "ruches", t: "Ruches : déplacer de nuit, entrée fermée et aérée, à plus de 3 km ou de moins de 1 m par jour", d: "Mettez à jour la déclaration de ruches (emplacement) sur le site du ministère de l'agriculture." }] : []),
      { id: "veto", t: "Repérer un vétérinaire qui soigne les animaux de ferme près du nouveau logement", lien: ["/diagnostic-animal", "Santé des animaux"] as [string, string] },
    ] });
  }

  if (gagneTerre) out.push({ titre: "En arrivant dans une maison avec jardin", items: [
    { id: "observer", t: "Observer avant de tout bouleverser : soleil, ombres, eau stagnante, vents, ce qui pousse déjà", d: "L'idéal est d'observer une saison entière ; notez où la neige fond en premier et où l'eau reste après la pluie." },
    { id: "identifier", t: "Identifier les plantes et arbres déjà en place (certains sont précieux, d'autres toxiques ou envahissants)", lien: ["/identifier", "Identifier par photo"] as [string, string] },
    { id: "sol", t: "Tester le sol (texture, pH, vie) et vérifier qu'il n'est pas pollué (ancien garage, remblais, bord de route)", lien: ["/guide/connaitre-sol", "Connaître son sol"] as [string, string] },
    { id: "petit", t: "Commencer petit : 10 à 20 m² bien tenus valent mieux que 100 m² envahis d'herbe", lien: ["/creer", "Créer mon potager"] as [string, string] },
    { id: "compost-new", t: "Installer le compost dès la première semaine", lien: ["/guide/compost-tas", "Faire un bon compost"] as [string, string] },
    { id: "amenager", t: "Choisir comment aménager : potager, verger, haie, coin sauvage, poulailler…", lien: ["/amenagements", "Les aménagements comparés"] as [string, string] },
    { id: "pots-terre", t: "Mettre en terre les plantes de balcon qui en profiteront (aromatiques, rosiers, petits fruitiers, vivaces)", d: "Au printemps ou à l'automne, après une semaine d'acclimatation à mi-ombre. Les plantes d'intérieur restent dedans (dehors seulement l'été, à l'abri du soleil direct)." },
    { id: "regles", t: "Se renseigner sur les règles : distances de plantation, brûlage, eau, déclaration des animaux", lien: ["/guide/voisinage-regles", "Règles à connaître"] as [string, string] },
  ] });

  if (perdTerre || perdExterieur) out.push({ titre: perdExterieur ? "En arrivant dans un appartement sans extérieur" : "En arrivant avec seulement un balcon", items: [
    { id: "lumiere", t: "Repérer la lumière de chaque fenêtre (test de l'ombre de la main)", lien: ["/guide/lumiere-led", "La lumière en intérieur"] as [string, string] },
    { id: "trier", t: "Ce qui ne survivra pas en pot ou en intérieur : le donner plutôt que le voir dépérir", d: perdExterieur ? "Arbres fruitiers, grands arbustes, lavande, romarin, rosiers ne vivent pas en intérieur." : "Fruitiers nains, petits fruits, aromatiques, fraisiers, rosiers et vivaces compactes vivent bien en grand bac sur un balcon." },
    ...(perdExterieur ? [
      { id: "potager-int", t: "Recréer un petit potager d'intérieur : aromatiques, micro-pousses, salades, tomates naines sous lampe", lien: ["/guide/potager-interieur", "Potager d'intérieur"] as [string, string] },
      { id: "lombri", t: "Continuer le compost en appartement : lombricomposteur ou bokashi", lien: ["/guide/lombricompost", "Lombricompostage"] as [string, string] },
    ] : [
      { id: "poids", t: "Vérifier le poids admis par le balcon avant d'y mettre de grands bacs", lien: ["/guide/balcon-voisinage", "Balcon : poids et voisinage"] as [string, string] },
      { id: "potager-balcon", t: "Planifier le potager de balcon", lien: ["/creer", "Créer mon potager"] as [string, string] },
    ]),
    { id: "jardin-partage", t: "Garder un coin de terre : jardin partagé, jardin familial de la commune, potager chez un voisin", lien: ["/guide/sol-pollue", "Jardins partagés"] as [string, string] },
  ] });

  out.push({ titre: "Les premiers jours", items: [
    { id: "repos", t: "Laisser les plantes se remettre 2 à 3 semaines : pas de rempotage ni d'engrais, arrosage normal", d: "Perdre quelques feuilles après un déménagement est normal (choc de lumière et de température)." },
    { id: "climat", t: "Mettre à jour la ville et le climat : le calendrier se recale tout seul" },
  ] });
  return out;
}

export default function Demenagement() {
  const s = useStore((x) => x);
  const [vers, setVers] = useState<Situation>(avecTerre(s.settings.situation) ? "appartement" : "jardin");
  const [zone, setZone] = useState<ZoneId>(s.settings.zone);
  const [archiver, setArchiver] = useState(true);
  const de = s.settings.situation;
  const animaux = [...new Set(s.troupeaux.map((t) => t.animalId))];
  const actifs = s.espaces.filter((e) => !e.archive);
  const enCours = s.cultures.filter((c) => !c.fini);
  const sections = checklist(de, vers, animaux, s.plantes.length);
  const total = sections.reduce((n, x) => n + x.items.length, 0);
  const faits = sections.reduce((n, x) => n + x.items.filter((i) => s.fait["dem:" + i.id]).length, 0);

  const valider = () => {
    const d = today();
    update((st) => ({
      ...st,
      espaces: archiver ? st.espaces.map((e) => (e.archive ? e : { ...e, archive: d, lieu: LIEUX.find(([k]) => k === de)?.[1].slice(3) })) : st.espaces,
      cultures: archiver ? st.cultures.map((c) => (c.fini ? c : { ...c, fini: d })) : st.cultures,
      settings: { ...st.settings, situation: vers, zone, lune: vers === "appartement" ? false : st.settings.lune, animauxActifs: avecTerre(vers) ? st.settings.animauxActifs : false },
    }));
    setSettings({});
    toast("C'est fait : l'appli est adaptée à votre nouveau logement");
  };

  return (
    <div>
      <Back />
      <Titre ico="maison-jardin" emoji="📦">Je déménage</Titre>
      <p className="muted small" style={{ marginTop: -6 }}>D'un appartement vers une maison avec jardin, ou l'inverse : une liste à cocher pour ne rien perdre en route (plantes, graines, animaux, démarches), puis l'appli s'adapte à votre nouveau lieu. Vos récoltes, notes, graines, favoris et « Mes plantes » sont toujours conservés.</p>

      <div className="card stack">
        <div><b>Aujourd'hui :</b> {LIEUX.find(([k]) => k === de)?.[1]}</div>
        <label className="field">Je pars vers
          <select value={vers} onChange={(e) => setVers(e.target.value as Situation)}>
            {LIEUX.filter(([k]) => k !== de).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </label>
        <label className="field">Climat du nouveau logement
          <select value={zone} onChange={(e) => setZone(e.target.value as ZoneId)}>{ZONES.map((z) => <option key={z.id} value={z.id}>{z.nom}</option>)}</select>
        </label>
      </div>

      <div className="row between" style={{ marginTop: 14 }}>
        <h2 style={{ margin: 0 }}>Ma liste ({faits}/{total})</h2>
        <Listen id="demenagement" title="Je déménage" blocks={sections.flatMap((x) => [x.titre, ...x.items.map((i) => i.t + (i.d ? ". " + i.d : ""))])} />
      </div>
      <div className="progress" style={{ margin: "8px 0 12px" }}><div style={{ width: `${total ? (faits / total) * 100 : 0}%` }} /></div>
      {sections.map((x) => (
        <div key={x.titre}>
          <h3>{x.titre}</h3>
          {x.items.map((i) => (
            <label key={i.id} className="card row" style={{ alignItems: "flex-start", flexWrap: "nowrap", cursor: "pointer", opacity: s.fait["dem:" + i.id] ? 0.6 : 1 }}>
              <input type="checkbox" checked={!!s.fait["dem:" + i.id]} onChange={() => toggleFait("dem:" + i.id)} style={{ width: 22, height: 22, flexShrink: 0 }} />
              <span>
                <b style={{ textDecoration: s.fait["dem:" + i.id] ? "line-through" : undefined }}>{i.t}</b>
                {i.d && <span className="small" style={{ display: "block", marginTop: 2 }}>{i.d}</span>}
                {i.lien && <a className="small" href={href(i.lien[0])} onClick={(e) => e.stopPropagation()}>{i.lien[1]} →</a>}
              </span>
            </label>
          ))}
        </div>
      ))}

      {animaux.length > 0 && !avecTerre(vers) && (
        <div className="callout warn"><b>Vos animaux</b>{animaux.map((a) => animal(a)?.nom).filter(Boolean).join(", ")} : ils ne pourront pas vivre dans le nouveau logement. Leur suivi reste dans l'appli tant que vous ne le supprimez pas (Mon jardin → Animaux).</div>
      )}

      <h2>Adapter l'appli au nouveau logement</h2>
      <div className="card stack">
        <p className="small" style={{ margin: 0 }}>Menus, calendrier, conseils du jour, assistant de création et alertes météo se règlent sur « {LIEUX.find(([k]) => k === vers)?.[1].slice(3)} ».</p>
        {(actifs.length > 0 || enCours.length > 0) && (
          <label className="row" style={{ cursor: "pointer", alignItems: "flex-start", flexWrap: "nowrap" }}>
            <input type="checkbox" checked={archiver} onChange={(e) => setArchiver(e.target.checked)} style={{ width: 20, height: 20 }} />
            <span className="small">Archiver les {actifs.length} emplacement(s) et clore les {enCours.length} culture(s) en cours de l'ancien logement (ils restent dans l'historique et les récoltes, mais disparaissent du plan et des rappels).</span>
          </label>
        )}
        <button className="btn primary" onClick={valider} disabled={de === vers}>✅ Je suis installé(e) : adapter l'appli</button>
      </div>
      <h2>Ensuite</h2>
      <div className="grid-sm">
        <A to="/creer" className="btn">👨‍🌾 Créer mon nouveau potager</A>
        {avecTerre(vers) && <A to="/amenagements" className="btn">🗺️ Comment aménager le jardin</A>}
        <A to="/reglages" className="btn">📍 Ville pour la météo</A>
        <A to="/jardin" className="btn"><Vignette id="mesplantes" emoji="🌿" taille={22} /> Mes plantes</A>
      </div>
    </div>
  );
}
