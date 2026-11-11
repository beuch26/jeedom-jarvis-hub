# Jeedom J.A.R.V.I.S. Design Hub & Neural Biometric Matrix

Interface domotique haut de gamme pour Jeedom (Plan 4) avec terminal intelligent cybernétique J.A.R.V.I.S. et moteur de rendu matriciel biométrique animé en temps réel.

---

## 🌟 Fonctionnalités Principales

### 1. Moteur Matrice Biométrique J.A.R.V.I.S. (v9.5 PRO)
- **Modélisation anatomique 3D** :
  - Rig paramétrique haute définition (repères calibrés pour yeux, paupières, arête du nez, philtrum, lèvres et mâchoire).
  - Éclairage studio Clair-Obscur dynamique avec calcul des normales de surface (`dzdx`, `dzdy`), ombrage de Blinn-Phong et occlusion ambiante.
  - Dégradés vaporeux d'atténuation latérale et verticale éliminant tout effet de découpe rigide ou de "photo flottante".
- **Tramage Multi-Échelle Haute Fidélité** :
  - **Hautes lumières** : trame *halftone* de micro-quads denses restituant le galbe et la réflectance des pommettes, du front et de l'arête nasale.
  - **Demi-teintes** : paquets de caractères numériques et glyphes de code (`JetBrains Mono`).
  - **Ombres et contours** : particules et fines poussières lumineuses.
  - **Passe de Bloom / Glow optique** : diffusion lumineuse subtile sur les zones d'éclat.
- **Cinématique et Regard Vivant (60 FPS)** :
  - Mouvements continus de respiration, lacet (*yaw*), tangage (*pitch*) et roulis (*roll*) avec parallaxe de profondeur 3D.
  - Saccades oculaires autonomes naturelles (mouvements rapides du regard).
  - Suivi interactif du curseur souris dès que l'utilisateur survole le terminal.
  - Clignement organique des paupières le long d'une courbe anatomique de fermeture.
  - Articulation labiale et baisse de la mâchoire synchronisées avec la synthèse vocale (`jarvis-speaking`) et posture d'écoute attentive (`jarvis-listening`).

### 2. Hub Domotique & Cartographie 3D Jeedom
- Intégration complète avec l'API Jeedom, commandes KNX (éclairages, volets, dimmers, scénarios).
- Flux vidéo des caméras (Dahua / RTSP / MJPEG).
- Widgets transparents en verre spatial rétroéclairé (`glassmorphism` cybernétique).
- Reconnaissance et retour vocal immersif.

---

## 📁 Structure du Dépôt

- **`visage_ia_holographique.html`** : Maquette autonome / bac à sable interactif de test. Ouvrable directement dans n'importe quel navigateur (inclut les contrôles de thème Noir / Jarvis / Matrix / Ambre, la synthèse vocale féminine, la modulation microphone temps réel et le mode webcam).
- **`design_hub.js`** : Script de production injecté dans le Plan Jeedom.
- **`design_hub.css`** : Feuilles de style de production du hub, animations, cards et terminal.
- **`jarvis_portrait.jpg`** : Texture photographique locale utilisée pour enrichir le micro-grain de peau en haute résolution (100% hors-ligne, zéro blocage CSP).

---

## 🚀 Utilisation & Déploiement

### Test autonome de la matrice IA
Ouvrez simplement `visage_ia_holographique.html` dans un navigateur moderne (Chrome, Edge, Firefox, Safari).

### Déploiement sur Jeedom
1. Déposez `design_hub.js`, `design_hub.css` et `jarvis_portrait.jpg` dans `/var/www/html/data/custom/` sur votre serveur Jeedom.
2. Dans le Design (Plan) souhaité, insérez le composant texte/HTML avec les balises :
   ```html
   <link rel="stylesheet" href="data/custom/design_hub.css">
   <script src="data/custom/design_hub.js"></script>
   ```

---

## 🛠️ Pistes d'Amélioration Futures
- Implémentation d'un renderer Three.js / WebGL Shaders (GLSL) avec maillage 3D déformable (Morph Targets / Blendshapes FACS).
- Analyseur FFT AudioContext avancé pour un lip-sync fréquentiel précis mot par mot.
- Intégration d'un LLM distant (Gemini / Claude / OpenAI) pour transformer le terminal en agent conversationnel domotique direct.
