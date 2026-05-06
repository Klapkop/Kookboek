'use strict';

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const {
  CooklangParser,
  getFlatIngredients,
  getQuantityValue,
  getQuantityUnit,
} = require('@cooklang/cooklang');

const CATEGORIEEN = {
  mains: 'Hoofdgerechten',
  soups: 'Soepen',
  sides: 'Bijgerechten',
  drinks: 'Dranken',
  breads: 'Brood',
  breakfast: 'Ontbijt',
  sauces: 'Sauzen',
  desserts: 'Desserts',
  snacks: 'Snacks',
  techniek: 'Technieken',
};

const parser = new CooklangParser();

function slugify(tekst) {
  return tekst
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Render één item uit een stap (tekst, ingrediënt-ref, kookgerei-ref of timer-ref)
function renderItem(item, recipe) {
  switch (item.type) {
    case 'text':
      return item.value ?? '';
    case 'ingredient': {
      const ing = recipe.ingredients[item.index];
      if (!ing) return '';
      const waarde = getQuantityValue(ing.quantity);
      const eenheid = getQuantityUnit(ing.quantity);
      const hoeveelheid = waarde != null ? `${waarde}${eenheid ? ' ' + eenheid : ''} ` : '';
      return `<span class="ingredient">${hoeveelheid}${ing.name}</span>`;
    }
    case 'cookware': {
      const gerei = recipe.cookware[item.index];
      return gerei ? `<span class="cookware">${gerei.name}</span>` : '';
    }
    case 'timer': {
      const timer = recipe.timers[item.index];
      if (!timer) return '';
      const waarde = getQuantityValue(timer.quantity);
      const eenheid = getQuantityUnit(timer.quantity);
      const duur = waarde != null ? `${waarde}${eenheid ? ' ' + eenheid : ''}` : '';
      return `<span class="timer">${timer.name ? timer.name + ': ' : ''}${duur}</span>`;
    }
    default:
      return '';
  }
}

function parseerInhoud(cooklangInhoud) {
  const [recipe] = parser.parse(cooklangInhoud);

  // Ingrediëntenlijst via helper (groepeert duplicaten)
  const ingredienten = getFlatIngredients(recipe).map((ing) => ({
    name: ing.name,
    quantity: ing.quantity != null ? String(ing.quantity) : null,
    unit: ing.unit || null,
  }));

  // Secties en stappen — de parser splitst native op = Sectienaam
  // content-items zijn ofwel {type:'text'} (notitie via >) of {type:'step'}
  const secties = recipe.sections.map((sectie) => {
    const notities = sectie.content
      .filter((item) => item.type === 'text')
      .map((item) => item.value)
      .filter(Boolean);

    const stappen = sectie.content
      .filter((item) => item.type === 'step')
      .map((stap) => ({
        html: stap.value.items.map((item) => renderItem(item, recipe)).join(''),
      }))
      .filter((s) => s.html.trim());

    return { naam: sectie.name, notities, stappen };
  });

  // Verzamel alle notities (ook uit naamloze voorsectie)
  const notities = secties.flatMap((s) => s.notities);

  // Verwijder secties die alleen notities en geen stappen hadden
  const berekteSecties = secties.filter((s) => s.stappen.length > 0 || s.naam);

  return { notities, secties: berekteSecties, ingredienten };
}

function parseerReceptBestand(bestandspad, categorie) {
  const raw = fs.readFileSync(bestandspad, 'utf-8');
  const { data: frontmatter, content: cooklangInhoud } = matter(raw);
  const { notities, secties, ingredienten } = parseerInhoud(cooklangInhoud);
  const titel = frontmatter.title || path.basename(bestandspad, '.cook');

  return {
    titel,
    slug: slugify(titel),
    categorie,
    categorieNaam: CATEGORIEEN[categorie] || categorie,
    frontmatter,
    notities,
    ingredienten,
    secties,
    url: `/recepten/${categorie}/${slugify(titel)}/`,
  };
}

module.exports = function () {
  const receptenMap = path.join(__dirname, '../../recipes');
  const alleRecepten = [];

  for (const categorie of Object.keys(CATEGORIEEN)) {
    const dir = path.join(receptenMap, categorie);
    if (!fs.existsSync(dir)) continue;

    for (const bestand of fs.readdirSync(dir).filter((f) => f.endsWith('.cook'))) {
      try {
        alleRecepten.push(parseerReceptBestand(path.join(dir, bestand), categorie));
      } catch (e) {
        console.warn(`Kon ${bestand} niet laden: ${e.message}`);
      }
    }
  }

  return alleRecepten.sort((a, b) => a.titel.localeCompare(b.titel, 'nl'));
};
