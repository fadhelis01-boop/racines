// Tous les tests (exécutés à chaque build). Un seul domaine : npm run test:logique ou npm run test:recherche
import { bilan } from "./outils";
import "./logic.test";
import "./recherche.test";

bilan("(logique et recherche)");
