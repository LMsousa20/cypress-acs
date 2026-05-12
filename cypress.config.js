const { defineConfig } = require("cypress");
require('dotenv').config();


module.exports = defineConfig(
{
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: true,
    json: true,
    code: false,           // OCULTA CÓDIGO
    charts: true,          // MOSTRA GRÁFICOS
    embeddedScreenshots: true,  // SCREENSHOTS NO RELATÓRIO
    inlineAssets: true,    // FUNCIONA OFFLINE
    reportPageTitle: 'Relatório de Testes - Lançamentos Manuais',
    timestamp: 'dd/mm/yyyy HH:MM:ss',
    log: true
  },
   screenshotOnRunFailure: true  // CAPTURA SCREENSHOTS AUTOMATICAMENTE
  
  ,
 projectId: 'bv3urc',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },

    testIsolation: false,
    baseUrl: process.env.CYPRESS_BASE_URL || 'https://hom.appposto.com.br/',
    env: {
      userLogin: process.env.CYPRESS_USER_LOGIN,
      userPassword: process.env.CYPRESS_USER_PASSWORD,
      tenantId: process.env.CYPRESS_TENANT_ID,
      empresa: process.env.CYPRESS_EMPRESA,
    },

    
    downloadsFolder: 'cypress/downloads',
    pageLoadTimeout: 60000, // Aumenta o tempo limite de carregamento da página
  },
});
