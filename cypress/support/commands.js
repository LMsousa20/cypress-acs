// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (
  tenantId = Cypress.env('tenantId') || 'posto-mirla-01', 
  empresa = Cypress.env('empresa') || 'Empresa Emcomoda', 
  username = Cypress.env('userLogin') || 'admin', 
  password = Cypress.env('userPassword') || 'admin'
) => {

  cy.visit('/login/'+tenantId);
  
  // Preencher credenciais
  cy.get('[formcontrolname="username"]').clear().type(username);
  cy.get('#password-input').clear().type(password).wait(500);
  
//   //Abrir o select e escolher a empresa
 cy.get('mat-select[formcontrolname="empresa"]').click();
 cy.get('#cdk-overlay-0', { timeout: 10000 }).should('be.visible');
cy.get('#cdk-overlay-0 mat-option')
  .contains(empresa) // ← SUBSTITUA pelo nome da empresa que você quer
  .click();
  
  cy.get('button[type="submit"]').click();
  
  // Verificar redirecionamento
  cy.location('pathname').should('not.include', '/login')
    .then(() => {
      cy.log('Login realizado com sucesso!');
    });
  
  cy.wait(500);
  
});

Cypress.Commands.add('limparCache', (options = {}) => {
  const {
    tempoEspera = 100,
    log = true
  } = options;

  if (log) {
    cy.log('**Limpando cache**');
  }

  cy.clearCookies({ log });
  cy.clearLocalStorage({ log });
  
  if (tempoEspera > 0) {
    cy.wait(tempoEspera, { log });
  }
});

Cypress.Commands.add('buscarComp', (nomeCliente) => {
  cy.log('#exampleModalLabel')
  
  // Captura o título do modal antes da busca
  cy.get('#exampleModalLabel').then(($modalTitle) => {
    const modalTitle = $modalTitle.text().trim()
    cy.log(`Título do Modal: ${modalTitle}`)
  })

  cy.get('#input-pesquisar')
  .should('be.visible')
  .click().type(nomeCliente).wait(1000)
  cy.log('ABERTO O MODAL')
  cy.get('#button-search').should('be.visible').click()
  
  // Primeiro verifica se a tabela está visível
  cy.get('table.acs-table').should('be.visible')

  // Aguarda um momento para garantir que os dados carregaram
  cy.get('tbody tr').should('have.length.at.least', 1)

  // Clique na linha do cliente específico
  cy.contains('td', nomeCliente)
    .parent('tr')
    .click()

  // Retorna o título do modal para uso posterior se necessário
  return cy.get('#exampleModalLabel').invoke('text').then((text) => text.trim())
})