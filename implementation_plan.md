# Synchronisation du Portfolio (juvanio.html) avec le CV

Ce plan d'implémentation détaille les modifications nécessaires pour aligner le contenu du fichier `juvanio.html` avec les informations du `G_Curriculum_Vitae.pdf`, tout en intégrant les optimisations techniques (SEO, performances, accessibilité et UX) abordées précédemment.

## User Review Required

> [!IMPORTANT]
> Merci de valider ces points avant que je ne procède aux modifications :
> 1. **Titre principal :** Le CV indique *« Architecte Backend & Ingénieur Plateforme »* alors que le site affiche *« Ingénieur Senior Spécialisé Backend & Sécurité »*. Souhaites-tu que je remplace le texte du site par celui du CV ?
> 2. **Lien GitHub :** Le CV mentionne un profil GitHub personnel mais sans donner l'URL exacte. Dois-je mettre un lien temporaire (ex: `#`) que tu pourras modifier ?
> 3. **Hackathon Nunyalab (2020) :** Dans ton CV, il est dans les *Expériences*, mais sur le site, une ligne similaire est dans *Formation*. Veux-tu que je le déplace formellement dans la timeline des Expériences ?

## Proposed Changes

### 1. Synchronisation du Contenu (CV vers HTML)

#### [MODIFY] `juvanio.html`
- **Profil / Hero :** 
  - Ajuster le titre et la description pour intégrer les mots-clés du CV (ex: *« Ingénieur Plateforme »*, *« systèmes à forte criticité »*).
- **Contacts & Liens :**
  - Ajouter le deuxième numéro de téléphone : `+229 01 69 41 36 86`.
  - Ajouter un bouton/lien vers **GitHub** dans la section contact et dans le footer.
- **Expériences :**
  - Ajouter l'expérience : *« Nunyalab, Tech4Rights (Hackathon) – Développeur Mobile (Oct. - Nov. 2020) »* dans la timeline.
- **Formation :**
  - Ajouter la formation *« SAGE 100 Comptabilité (Oct - Nov 2021) »*.
- **Loisirs :**
  - Ajouter un encart "Loisirs / Centres d'intérêt" (Musique, Écriture, Mangas, Arts martiaux...) à côté de la section Langues.

### 2. Améliorations Techniques (SEO & Accessibilité)

#### [MODIFY] `juvanio.html`
- **SEO & Meta-tags :** 
  - Ajout des balises `<meta name="description">` et des balises Open Graph (`og:title`, `og:description`, `og:type`) pour un beau rendu lors du partage sur LinkedIn.
- **Sémantique :** 
  - Envelopper tout le contenu sous la balise `<nav>` et le `<header>` dans une balise sémantique `<main>`.
- **Accessibilité Mobile :** 
  - Désactivation du custom cursor sur les écrans tactiles via `@media (pointer: coarse) { body { cursor: auto; } }`.
  - Léger ajustement de la couleur `var(--muted)` pour un meilleur contraste lisible.

### 3. Performances & UX

#### [MODIFY] `juvanio.html`
- **Performance du Noise (Bruit) :** 
  - Remplacer le filtre SVG ultra-gourmand en CPU/GPU appliqué sur le `body::before` par un `background-image` utilisant une image encodée en base64 beaucoup plus légère (PNG/WebP), ce qui rendra le défilement fluide sur mobile.
- **Scrollbar Personnalisée :** 
  - Ajout d'une barre de défilement stylisée (via `::-webkit-scrollbar`) assortie au thème sombre du site.
- **Hero "Scroll" cliquable :** 
  - Transformer le texte "Scroll" animé en un vrai lien anchor (`<a href="#tenxyte">`) pour améliorer la navigation.
- **Fluidité du Curseur :** 
  - Optimiser le script JS du curseur pour n'appliquer les modifications CSS que dans la boucle `requestAnimationFrame`.

## Verification Plan

1. **Vérification visuelle :** S'assurer que le design original (couleurs, polices, espacements) n'est pas altéré par les ajouts.
2. **Responsive :** Vérifier que les nouveaux éléments (Loisirs, nouveau contact) s'affichent correctement sur mobile (largeur < 900px).
3. **Performance visuelle :** Vérifier l'absence de saccades lors du défilement après le changement du système de filtre SVG.
4. **Validité des données :** S'assurer que chaque ligne du CV se retrouve fidèlement retranscrite sur la page HTML.
