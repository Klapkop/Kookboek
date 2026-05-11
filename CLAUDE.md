# Cooklang Receptenverzameling

Dit project beheert een persoonlijke receptenverzameling met de [Cooklang](https://cooklang.org) opmaaktaal. Alle recepten zijn platte-tekst `.cook`-bestanden die kunnen worden verwerkt door Cooklang-compatibele apps, CookCLI en editors.

---

## Projectstructuur

```
Recepten/
├── CLAUDE.md                  ← u bent hier
├── docs/
│   ├── preferences.md         ← dieetvoorkeuren en kookstijl
│   └── equipment.md           ← beschikbare keukenapparatuur
├── recipes/
│   ├── config/
│   │   └── aisle.conf         ← gangindeling voor boodschappen
│   ├── breakfast/
│   ├── mains/
│   ├── sides/
│   ├── soups/
│   ├── sauces/
│   ├── breads/
│   ├── desserts/
│   ├── snacks/
│   ├── drinks/
│   └── *.menu                 ← maaltijdplannen (wekelijks, etc.)
```

Plaats receptafbeeldingen naast het bijbehorende `.cook`-bestand met een overeenkomende bestandsnaam:
- `recipes/mains/Spaghetti Carbonara.cook`
- `recipes/mains/Spaghetti Carbonara.jpg`
- `recipes/mains/Spaghetti Carbonara.0.jpg` ← stapspecifieke afbeeldingen (0-geïndexeerd)

---

## Cooklang Syntaxreferentie

### Ingrediënten — `@`
```
Voeg @zout naar smaak toe.
Voeg @zwarte peper{} naar smaak toe.    ← meerdelig vereist {}
Prik gaatjes in @aardappel{2}.          ← hoeveelheid
Gebruik @speklapjes{1%kg}.              ← hoeveelheid + eenheid
Voeg @olijfolie{2%el} toe.
```

### Kookgerei — `#`
```
Doe in een #pan.
Pureer met een #aardappelstamper{}.     ← meerdelig vereist {}
```

### Timers — `~`
```
Bak ~{25%min}.                     ← anonieme timer
Laat ~saus{10%min} sudderen.        ← benoemde timer (verschijnt in meldingen)
```

### Opmerkingen — `--` of `[- -]`
```
-- Verbrand de roux niet!
Voeg langzaam @melk{4%cup} toe [- TODO: omzetten naar ml -], blijf roeren.
```

### Notities — `>`
```
> Dit gerecht is afkomstig uit Rome. Gebruik guanciale voor authenticiteit.
```
Let op: Gebruik geen markdown in Notities, de cook web interface rendert dit niet. Vermijd `**vet**`, `*cursief*` en lijstitems met `- ` — deze verschijnen als letterlijke tekst.

Voor meerdere regels binnen één notitieblok: gebruik `\` aan het einde van de regel. Alleen de eerste regel begint met `>` — vervolgregels na `\` hebben geen `>` prefix.
```
> Rijstkeuze — gebruik uitsluitend risottorijst.\
Arborio — romig en zacht, meest gebruikt.\
Carnaroli — behoudt beter zijn beet, voorkeur van Italiaanse koks.
```

### Secties
```
= Deeg

Meng @bloem{200%g} en @water{100%ml}.

== Vulling ==

Combineer @kaas{100%g} en @spinazie{50%g}.
```

### Verkorte bereidingswijzen
```
Bak @ui{1}(fijngesneden) met @knoflook{2%teentjes}(fijngehakt).
```

### Verwijzen naar andere recepten
```
Serveer met @./sauces/Hollandaise{150%g}.
@./sides/groene salade{}
```

### Stappen
Elke alinea is één stap. Scheid stappen met een lege regel.
Forceer een regelafbreking binnen een stap met `\` aan het einde van de regel.

---

## Metagegevens (YAML Front Matter)

Elk recept **moet** beginnen met een YAML front matter blok. Gebruik deze vaste sleutels:

```yaml
---
title: Receptnaam
description: Een korte omschrijving van het gerecht.
servings: 4
time: 45 min                     # totale tijd (voorbereiding + bereiding)
course: dinner                   # breakfast | lunch | dinner | snack | dessert | drink
tags:
  - pasta
  - snel
  - comfort-eten
author: Uw naam
source: https://example.org/recept
locale: nl_NL
image: Receptnaam.jpg            # optioneel, als de bestandsnaamconventie niet wordt gebruikt
---
```

**Verplicht:** `title`, `servings`, `course`
**Aanbevolen:** `description`, `time`, `tags`
**Optioneel:** `author`, `source`, `locale`, `image`

---

## Receptsjabloon

Volg bij het aanmaken van een nieuw recept precies deze structuur:

```
---
title: Recepttitel
description: Korte omschrijving.
servings: 4
time: 30 min
course: dinner
tags:
  - tag1
  - tag2
source: https://...   (weglaten als origineel)
---

> Optionele notitie of achtergrondverhaal bij het gerecht.

= Sectienaam   (secties weglaten als het recept eenvoudig/lineair is)

Stap één met @ingrediënt{hoeveelheid%eenheid} en #kookgerei{} inline.
Ga verder op de volgende regel als dat nodig is voor dezelfde stap.

Voeg @nog een ingrediënt{} toe en kook ~{10%min}.

== Sectie Twee ==

Laatste stappen hier.
```

---

## Aanmaakregels

Volg bij het aanmaken of bewerken van `.cook`-bestanden altijd deze regels:

### Syntaxis
1. **Elk meerdelig ingrediënt of kookgerei moet eindigen met `{}`** — bijv. `@olijfolie{}`, `#bakplaat{}`.
2. **Enkelvoudige ingrediënten hebben geen accolades nodig** tenzij ze een hoeveelheid hebben — `@zout` is goed, `@zout{1%tl}` is goed, `@zout{}` is overbodig.
3. **Geef altijd eenheden aan met `%`** — `@bloem{200%g}`, niet `@bloem{200g}`.
4. **Gebruik breuken waar dat natuurlijk klinkt** — `@boter{1/2%cup}` niet `@boter{0.5%cup}`.
5. **Timers hebben altijd een eenheid nodig** — `~{25%min}`, nooit `~{25}`.
6. **Gebruik benoemde timers voor duidelijkheid** — `~pasta{10%min}` zodat app-meldingen betekenisvol zijn.
7. **Herhaal ingredientnamen niet in stappen** als ze al uit de context blijken — houd de tekst leesbaar.

### Metagegevens
8. **Voeg altijd YAML front matter toe** met minimaal `title`, `servings` en `course`.
9. **`time`** is de enige ondersteunde tijdsleutel — gebruik `time: 45 min` voor de totale tijd. Sleutels als `prep time`, `cook time` en `time required` worden niet herkend door de parser en genereren waarschuwingen.
10. **`tags`** moeten in kleine letters staan, met koppeltekens bij meerdere woorden (bijv. `één-pan`, `van-tevoren-te-maken`).
11. **`servings`** moet een gewoon geheel getal zijn (gebruikt voor schalen). Voeg `yield` toe als het recept een meetbare hoeveelheid oplevert (bijv. `yield: 500%ml`).

### Structuur
12. **Gebruik secties** (`= Naam`) voor recepten met meerdere componenten — bijv. pastadeeg + saus, of cake + glazuur.
13. **Elke stap = één alinea** (lege regel ertussen). Houd stappen gericht en uitvoerbaar.
14. **Zet notities (`>`) bovenaan**, vóór de eerste stap, voor achtergrond en tips.
15. **Gebruik inline opmerkingen (`--`)** voor tips binnen een stap, niet voor volledige alinea's.
16. **Verwijs naar deelrecepten** met `@./pad/naar/recept{}` in plaats van stappen te dupliceren.

### Bestandsnaamgeving
17. **Gebruik Titelnotatie met spaties** — `Spaghetti Carbonara.cook`, niet `spaghetti-carbonara.cook`.
18. **Plaats in de juiste map** op basis van `course` — een `dinner`-recept gaat in `recipes/mains/`, een `snack` in `recipes/snacks/`, etc.
19. **Sauzen en bouillons** gaan altijd in `recipes/sauces/`, ook als ze onderdeel zijn van een hoofdgerecht.

---

## Map → Gang Koppeling

| Map          | course-waarden                         |
|--------------|----------------------------------------|
| `breakfast/` | breakfast                              |
| `mains/`     | lunch, dinner                          |
| `sides/`     | side                                   |
| `soups/`     | soup                                   |
| `sauces/`    | sauce, condiment, broth                |
| `breads/`    | bread                                  |
| `desserts/`  | dessert                                |
| `snacks/`    | snack, appetizer                       |
| `drinks/`    | drink, cocktail                        |

---

## Docs-map

De map `docs/` bevat referentie-informatie over de kok en zijn keuken. Dit zijn gewone Markdown-bestanden, geen `.cook`-recepten.

| Bestand | Doel |
|---------|------|
| `docs/preferences.md` | Dieetvoorkeuren, allergieën, favoriete keukens, kookstijl |
| `docs/equipment.md` | Beschikbare keukenapparatuur (apparaten, pannen, gereedschappen) |

Raadpleeg deze bestanden bij het genereren van recepten om suggesties af te stemmen op wat de kok daadwerkelijk kan bereiden.

---

## Maaltijdplannen (`.menu`-bestanden)

Maaltijdplannen staan in de map `recipes/`.

```
= Maandag

@./mains/Chicken Stir Fry{4%porties}
@./sides/Gestoomde Rijst{4%porties}

= Dinsdag

@./soups/Minestrone{6%porties}
@./breads/Focaccia{1}
```

Secties kunnen datums bevatten voor tijdsbewuste apps:
```
== Dag 1 (2026-05-06) ==

@./breakfast/Shakshuka{4%porties}
```

---

## Veelgemaakte Fouten om te Vermijden

- ❌ `@olijfolie` → ✅ `@olijfolie{}`  (meerdelig zonder accolades wordt verwerkt als `@olijfolie` alleen)
- ❌ `@bloem{200g}` → ✅ `@bloem{200%g}` (eenheid moet na `%` komen)
- ❌ `~{25}` → ✅ `~{25%min}` (timers hebben een eenheid nodig)
- ❌ Metagegevens buiten front matter → ✅ Alle metagegevens binnen `--- ... ---`
- ❌ `tags: pasta, snel` → ✅ Tags als YAML-lijst
- ❌ Een sausrecept inline dupliceren → ✅ Ernaar verwijzen met `@./sauces/Naam{}`
- ❌ `prep time: 10 min` / `time required: 45 min` → ✅ `time: 45 min` (enige ondersteunde tijdsleutel)

---

## CookCLI Snelreferentie

```bash
# Installeren (macOS)
brew install cookcli

# Recept bekijken
cook recipe read recipes/mains/Spaghetti\ Carbonara.cook

# Boodschappenlijst genereren
cook shopping list recipes/mains/Spaghetti\ Carbonara.cook

# Lokale webinterface starten
cook server start --dir recipes

# Recept valideren
cook recipe check recipes/mains/Spaghetti\ Carbonara.cook
```

---

## Vaardigheden (Claude Code)

Invoke these skills when the user's request matches:
- `/create-recipe` — when asked to write or create a new recipe
- `/convert-recipe` — when given a URL or plain text to convert to Cooklang
- `/validate-recipes` — when asked to check or validate .cook files
- `/shopping-list` — when asked for a shopping list
- `/scale-recipe` — when asked to scale or resize a recipe
- `/meal-plan` — when asked to plan meals or create a .menu file

## Git policy
- Zorg dat je altijd een commit aanmaakt aan na een wijziging
- Zorg dat je altijd pushed naar remote na het maken van een commit
