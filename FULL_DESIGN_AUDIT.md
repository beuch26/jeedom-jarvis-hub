# J.A.R.V.I.S. & JEEDOM HUB — ARCHITECTURE GLOBALE DU DESIGN

Ce document fournit une vision complète, chirurgicale et transversale de l'ensemble du système de design (DOM, CSS, JavaScript, Canvas et logique domotique) pour permettre une analyse approfondie et des optimisations de haut niveau.

---

## 1. Vue d'Ensemble & Agencement Spatial

Le Design Plan (Plan 4) est une interface de pilotage domotique ultra-moderne projetée sur un plan architectural 3D texturé :
```
+---------------------------------------------------------------------------------------+
|  [LINKY TELEMETRY CARD]                                          [WEATHER HUD CARD]   |
|  - Conso instantanée (kW)                                       - Température / MinMax|
|  - Arc bar 10 segments LED                                      - Humidité / Pression |
|  - Compteurs Jour / Mois                                        - Vent / Pluie        |
|  - Statut présence Foyer                                        - Éphémérides Soleil  |
|                                                                                       |
|                                                                                       |
|                                  [PLAN 3D MAISON & JARDIN]                            |
|                                                                                       |
|                                                                                       |
|  [J.A.R.V.I.S. TERMINAL]                                                              |
|  - Horloge temps réel                                                                 |
|  - Orbe Matrice Biométrique 60 FPS                                                    |
|    (Rig 3D, Halftone, Gaze tracking)                                                  |
|  - Barre Commande Vocale                                [FLOATING QUICK ACTIONS DOCK] |
|    (STT / TTS / Écoute active)                          - Scénarios OFF / Nuit / Jour |
|                                                         - Volets / Chauffage / Portail|
+---------------------------------------------------------------------------------------+
```

---

## 2. Les Composants d'Interface (DOM & Rôles)

### A. Terminal J.A.R.V.I.S. (`#knx-jarvis-terminal`)
- **Position** : Fixé en bas à gauche (`bottom: 18px; left: 16px; width: 205px; z-index: 1000`).
- **Structure** :
  - `.knx-terminal-header` : Brackets HUD cyan, libellé `J.A.R.V.I.S. DOMOTIC CORE` et horloge numérique dynamique (`#knx-jarvis-clock`).
  - `.knx-neural-hero-stage` (Hauteur : 165px) :
    - Canvas `#knx-jarvis-orb` (205x165 px) : Rendu temps réel de la matrice biométrique animée (version 9.5 PRO).
    - Vignette radiale douce estompant les bords dans le noir spatial.
  - `.knx-voice-bar` (`#knx-voice-bar`) :
    - Bouton microphone avec onde lumineuse au toucher / écoute.
    - Libellé d'état vocal (`#knx-voice-status`).
    - Indicateur de parole avec égaliseur LED ou points d'activité.
- **États CSS** :
  - `.jarvis-listening` : Déclenche l'état d'attention (yeux fixés vers l'utilisateur, sourcils haussés, lèvres entrouvertes).
  - `.jarvis-speaking` : Déclenche l'articulation vocale (mouvements labiaux et abaissement de la mâchoire).

### B. Carte Télémetrie Énergie Linky (`#knx-linky-card`)
- **Position** : Haut gauche (`top: 18px; left: 16px; width: 240px; z-index: 900`).
- **Fonctionnalités** :
  - Puissance instantanée en kW avec barregraphe à segments LED cyan.
  - Compteurs d'énergie du jour et du mois (kWh) cliquables ouvrant les graphiques historiques.
  - Statut de présence géolocalisée du foyer (`#knx-presence-status`).
  - Mode repliable (*accordion*) avec bouton de collapse tactile.

### C. Carte Météo & Climat (`#knx-hud-card`)
- **Position** : Haut droite (`top: 18px; right: 16px; width: 260px; z-index: 900`).
- **Fonctionnalités** :
  - Température actuelle héroïque (°C), pastilles Min / Max du jour.
  - Badge météo avec icône vectorielle animée selon la condition météo (soleil, nuage, pluie, orage).
  - Grille 4 instruments : Humidité (%), Pression (hPa), Vent (km/h), Précipitations (mm).
  - Éphéméride du soleil : heures précises du lever et du coucher.

### D. Dock Central d'Actions Rapides (`#knx-dock-container`)
- **Position** : Bas centre (`bottom: 18px; transform: translateX(-50%); z-index: 950`).
- **Boutons tactiles** :
  - `TOUT OFF` (Extinction globale).
  - `JOUR OFF` / `NUIT`.
  - `OUVRIR VOLETS` / `FERMER VOLETS`.
  - `CHAUFFAGE` / `PORTAIL` / `ROBOT ASPIRATEUR` (avec jauge de batterie en direct).

---

## 3. Système Visuel & Charte Graphique (CSS)

- **Style Global** : *Cyberpunk / Sci-Fi HUD Glassmorphism*.
- **Palette Chromatique** :
  - **Arrière-plan verre spatial** : `rgba(4, 16, 30, 0.92)` avec `backdrop-filter: blur(16px)`.
  - **Bordures HUD & Brackets** : `rgba(0, 240, 255, 0.28)` et cornières d'angle néon (`#00f0ff`).
  - **Couleur Primaire (Cyan Jarvis)** : `#38bdf8` / `#00f0ff`.
  - **Couleur Accent (Blanc Néon)** : `#e8faff` / `#ffffff`.
  - **Couleur Avertissement / Énergie** : `#fbbf24` (Or / Jaune Linky).
  - **Couleur Succès / Présence** : `#4ade80` (Vert émeraude).
- **Typographies** :
  - `Orbitron` : Titrages HUD et chiffres majeurs.
  - `Rajdhani` : Libellés d'interface, boutons et jauges.
  - `JetBrains Mono` / `Share Tech Mono` : Glyphes de code et horloge.

---

## 4. Moteur Matrice Biométrique (Spécifications Techniques Canvas)

1. **Génération de la Peau & Hauteur 3D (`buildBaseSkinAndDepth`)** :
   - Grille 240x300 points avec calcul d'un champ scalaire `heightField`.
   - Modélisation du dôme crânien, orbites, arête nasale continue, pommettes et philtrum.
   - Éclairage studio avec source directionnelle (`lx=0, ly=-0.34, lz=0.94`) pour un rendu en clair-obscur avec ombrage de Blinn-Phong.
   - Fusion de la texture photographique studio locale (`jarvis_portrait.jpg`) pour un micro-grain de peau réaliste.
2. **Animation 3D en Temps Réel (`sampleAnimatedFace`)** :
   - Roulis, tangage et lacet avec effet de parallaxe de profondeur (`depth * 0.88`).
   - Saccades autonomes toutes les 1.8 à 3.5 secondes.
   - Suivi interactif du regard sur mouvement de la souris.
   - Lèvres articulées en direct avec cavité buccale ombrée et éclat gloss sur la lèvre inférieure.
3. **Double Tramage (*Halftone* + *Code Glyph Streams*)** :
   - Hautes lumières traitées par un réseau dense de micro-quads décalés.
   - Demi-teintes composées de chiffres condensés (`0`, `1`, `8`, `S`, `!`, `:`).
   - Passe de post-traitement *Bloom* (glow optique) en superposition `screen`.
