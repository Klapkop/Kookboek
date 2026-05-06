# Mijn Kookboek

Persoonlijk digitaal kookboek gebouwd met [Eleventy](https://www.11ty.dev/) en [Cooklang](https://cooklang.org/). Recepten worden geschreven in het `.cook`-formaat en automatisch gepubliceerd naar GitHub Pages via GitHub Actions.

## Projectstructuur

```
recepten/
├── recipes/               # Cooklang-recepten (.cook bestanden)
│   ├── mains/             # Hoofdgerechten
│   ├── soups/             # Soepen
│   ├── sides/             # Bijgerechten
│   ├── drinks/            # Dranken
│   ├── breads/            # Brood
│   ├── breakfast/         # Ontbijt
│   ├── sauces/            # Sauzen
│   ├── desserts/          # Desserts
│   ├── snacks/            # Snacks
│   └── techniek/          # Basistechnieken
├── src/
│   ├── _data/
│   │   └── recepten.js    # Laadt en parseert alle .cook bestanden
│   ├── _includes/
│   │   └── base.njk       # HTML-basistemplate
│   ├── index.njk          # Startpagina
│   └── recepten/
│       ├── index.njk      # Alle recepten (per categorie)
│       └── recept.njk     # Individuele receptpagina
├── css/
│   └── style.css          # Opmaak
├── .eleventy.js           # Eleventy-configuratie
└── .github/
    └── workflows/
        └── deploy.yml     # Automatische publicatie naar GitHub Pages
```

## Quickstart

### Vereisten

- [Node.js](https://nodejs.org/) versie 18 of hoger
- Git

### Installatie

```bash
git clone https://github.com/GEBRUIKER/REPO.git
cd REPO
npm install
```

### Lokaal draaien

```bash
npm start
```

De site is beschikbaar op `http://localhost:8080`. Wijzigingen in recepten of templates worden automatisch herladen.

### Bouwen

```bash
npm run build
```

De gegenereerde site staat in de map `_site/`.

## Een recept toevoegen

Maak een nieuw `.cook` bestand aan in de juiste categoriemap, bijvoorbeeld `recipes/mains/mijn-recept.cook`:

```
---
title: Mijn Recept
description: Korte omschrijving van het gerecht.
servings: 4
time: 30 min
course: dinner
tags:
  - italiaans
  - pasta
---

> Tip: dit is een opmerking die bovenaan de receptpagina verschijnt.

= Voorbereiding

Snijd @ui{1} fijn en verhit @olijfolie{2%el} in een #koekenpan{}.

= Bereiding

Bak de ui ~{5%min} op middelhoog vuur tot glazig.
```

### Cooklang-syntaxis

| Syntaxis | Betekenis | Voorbeeld |
|---|---|---|
| `@naam{hoeveelheid%eenheid}` | Ingrediënt | `@pasta{400%g}` |
| `@naam{}` | Ingrediënt zonder hoeveelheid | `@zwarte peper{}` |
| `#naam{}` | Kookgerei | `#grote pan{}` |
| `~{tijd%eenheid}` | Timer | `~{10%min}` |
| `~naam{tijd%eenheid}` | Timer met naam | `~saus{20%min}` |
| `= Naam` | Sectieheader | `= Saus` |
| `> tekst` | Tip of opmerking | `> Gebruik verse pasta voor het beste resultaat.` |

### Verplichte frontmatter-velden

```yaml
---
title: Naam van het recept
servings: 4
course: dinner        # dinner, lunch, breakfast, soup, side, drink
time: 30 min
tags:
  - tag-naam
---
```

## Publiceren naar GitHub Pages

### Eenmalige instelling

1. Maak een repository aan op GitHub
2. Voeg de remote toe en push:
   ```bash
   git remote add origin https://github.com/GEBRUIKER/REPO.git
   git push -u origin main
   ```
3. Ga in de GitHub-repository naar **Settings → Pages**
4. Stel **Source** in op **GitHub Actions**

Bij elke push naar `main` bouwt GitHub Actions de site automatisch en publiceert deze op `https://GEBRUIKER.github.io/REPO/`.

### PATH_PREFIX

De workflow gebruikt de naam van de repository als URL-prefix. Heb je een gebruikerspagina (repository heet `gebruiker.github.io`), pas dan in `.github/workflows/deploy.yml` de `PATH_PREFIX` aan:

```yaml
PATH_PREFIX: /
```

## Afhankelijkheden

| Pakket | Versie | Functie |
|---|---|---|
| `@11ty/eleventy` | ^3.0 | Statische sitegenerator |
| `@cooklang/cooklang` | ^0.17 | Cooklang-parser |
| `gray-matter` | ^4.0 | YAML-frontmatter parsen |
