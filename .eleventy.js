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

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy('css');

  eleventyConfig.addFilter('categorieNaam', (cat) => CATEGORIEEN[cat] || cat);

  eleventyConfig.addFilter('groeperenOpCategorie', (recepten) => {
    const groepen = {};
    for (const recept of recepten) {
      if (!groepen[recept.categorie]) groepen[recept.categorie] = [];
      groepen[recept.categorie].push(recept);
    }
    return Object.entries(groepen).map(([categorie, lijst]) => ({
      categorie,
      categorieNaam: CATEGORIEEN[categorie] || categorie,
      recepten: lijst,
    }));
  });

  return {
    pathPrefix: process.env.PATH_PREFIX || '/',
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      data: '_data',
    },
    templateFormats: ['njk', 'html', 'md'],
    htmlTemplateEngine: 'njk',
  };
};
