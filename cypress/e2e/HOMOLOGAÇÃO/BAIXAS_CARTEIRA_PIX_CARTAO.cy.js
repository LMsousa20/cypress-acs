describe('RECEBIMENTOS MANUAIS', () => {

  function parseValorBR(valorStr) {
    return parseFloat(valorStr.replace(/\./g, '').replace(',', '.'));
  }

  const dados =
  {
    data: '17/04/2026',
    caixa: 'Fechado',
    pdv: 'LUCAS',
    valorAdicionar: 100,
    produto: 'GASOLINA COMUM',
    adquirentes: {
      carteira: 'CARTEIRA DIGITAL',
      pix: 'REDE',
      adquirentes: 'TDL'
    },

    administradoras: {
      credito: 'AMERICA',
      debito: 'VISA DEB',
      pix: 'PIX BAIXA NAO',
      carteira: 'CART DIGITAL BAIXA NAO',
      pef: 'PAGAMENTO DE FRETE'
    },
    cliente: {
      chequeAvista: 'ACOFORTE',
      chequeprazo: 'ACOFORTE',
      Convenio: 'LUCAS'
    },
    cheque: {
      Comp: "123",
      Banco: "341",
      Ag: "1234",
      Conta: "12345678-9",
      Cheque: "000123"
    }
  }

  // 🔥 VARIÁVEIS NO ESCOPO CORRETO
  let cxGerenciaCarteira = 0;
  let cxGerenciaPix = 0;
  let cxGerenciaCartao = 0;
  let cxGerenciaCarteiraPOS = 0;
  let cxGerenciaPixPOS = 0;
  let cxGerenciaCartaoPOS = 0;
  let liquidoGerenciaCarteira = 0;
  let liquidoGerenciaPix = 0;
  let liquidoGerenciaCartao = 0;
  
  context('Setup Inicial', () => {

    it('Limpando o Cache _ para login', () => {
      cy.limparCache({ log: false });
    });

    it('LOGIN', () => {
      cy.login();
    });

    it('CX GERENCIA - ANTERIOR', () => {

      cy.visit('movimentos/caixas-da-gerencia').wait(1000);

      cy.get('#mat-input-3').click().clear().wait(200).type(dados.data)
      cy.get('#mat-input-4').click().clear().wait(200).type(dados.data)

      cy.get('.col > .text-right > .mat-raised-button > .mat-button-wrapper').click().wait(1500)

      cy.get('#link-edit > .mat-icon').click().wait(500)

      cy.get(':nth-child(2) > :nth-child(2) > :nth-child(10) > .col-5 > .form-control').invoke('val')
        .then((valor) => {
          cxGerenciaCarteira = parseValorBR(valor);
          cy.log(`Valor capturado Carteira: ${cxGerenciaCarteira}`);
        });

      cy.get(':nth-child(2) > :nth-child(2) > :nth-child(11) > .col-5 > .form-control').invoke('val')
        .then((valor) => {
          cxGerenciaPix = parseValorBR(valor);
          cy.log(`Valor capturado Pix: ${cxGerenciaPix}`);
        });

        cy.get(':nth-child(2) > :nth-child(2) > :nth-child(4) > .col-5 > .form-control').invoke('val')
        .then((valor) => {
          cxGerenciaCartao = parseValorBR(valor);
          cy.log(`Valor capturado Pix: ${cxGerenciaCartao}`);
        });

    });

    it('BAIXA DE CARTAO', () => {

      cy.visit('financeiro/cartoes/baixa').wait(1000);

      cy.get('#mat-input-3').clear().type('01/10/2020');
      cy.get('#mat-input-4').clear().type(dados.data);

      cy.get('.col-lg-3 > div.ng-untouched > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-suffix > .mat-focus-indicator > .mat-button-wrapper > .mat-icon')
        .click();

      cy.get('#search_baixa_cartoes > #div-modal-dialog > #div-modal-content > #div-modal-body > table_data-simple > acs-data-table > table_filter-default > #div-d-flex > #form-field-pesquisar > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix > #input-pesquisar')
        .click()
        .type(dados.adquirentes.adquirentes).wait(200)

      cy.get('#search_baixa_cartoes .mat-form-field-suffix')
        .click()

      cy.contains('td', dados.adquirentes.adquirentes)
        .parent('tr')
        .click()

      cy.get('.col > .text-right > .mat-raised-button').click()

      cy.get('#mat-checkbox-1 > .mat-checkbox-layout > .mat-checkbox-inner-container').click()
      cy.get('#mat-checkbox-2 > .mat-checkbox-layout > .mat-checkbox-inner-container').click()
      cy.get('#mat-checkbox-3 > .mat-checkbox-layout > .mat-checkbox-inner-container').click().wait(500)

      cy.get('#mat-input-15').invoke('val')
        .then((valor) => {
          liquidoGerenciaCartao = parseValorBR(valor);
          cy.log(`Valor liquido Pix: ${liquidoGerenciaCartao}`);
        });

      cy.get('#salvar-button').wait(500).click()


      cy.get('#mat-input-32').wait(500)
        .clear()
        .click()
        .type(dados.data)

        cy.get(':nth-child(3) > div.ng-untouched > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-suffix > .mat-focus-indicator > .mat-button-wrapper > .mat-icon')
        .click()

        cy.get('#search_finalizar_baixa_cartoes_dialog > #div-modal-dialog > #div-modal-content > #div-modal-body > table_data-simple > acs-data-table > table_filter-default > #div-d-flex > #form-field-pesquisar > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix > #input-pesquisar')
        .type('Nubank').wait(500)

            cy.contains('td', 'Nubank')
        .parent('tr')
        .click()



  cy.get('#listar_despesas_cartoes_dialog > #div-modal-dialog > #div-modal-content > #div-modal-footer > .button-modal-group > .ml-auto > .mat-accent')
  .click().wait(1500)

      cy.get('#choose_quitacao_dialog > #div-modal-dialog > #div-modal-content > #div-modal-footer > .button-modal-group > .ml-2').click().wait(1500)

      cy.get('#choose_fatura_dialog > #div-modal-dialog > #div-modal-content > #div-modal-footer > .button-modal-group > .ml-2').click().wait(1500)

    });


    it('BAIXA DE CARTEIRA DIGITAL', () => {

      cy.visit('financeiro/carteira-digital/baixa').wait(1000);

      cy.get('#mat-input-3').clear().type('01/10/2020');
      cy.get('#mat-input-4').clear().type(dados.data);

      cy.get('.col-lg-3 > div.ng-untouched > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-suffix > .mat-focus-indicator > .mat-button-wrapper > .mat-icon')
        .click();

      cy.get('#search_baixa_carteira input')
        .click()
        .type(dados.adquirentes.carteira).wait(200)

      cy.get('#search_baixa_carteira .mat-form-field-suffix')
        .click()

      cy.contains('td', dados.adquirentes.carteira)
        .parent('tr')
        .click()

      cy.get('.col > .text-right > .mat-raised-button').click()

      cy.get('#mat-checkbox-1 > .mat-checkbox-layout > .mat-checkbox-inner-container').click()
      cy.get('#mat-checkbox-2 > .mat-checkbox-layout > .mat-checkbox-inner-container').click()
      cy.get('#mat-checkbox-3 > .mat-checkbox-layout > .mat-checkbox-inner-container').click().wait(500)

      cy.get('#mat-input-10').invoke('val')
        .then((valor) => {
          liquidoGerenciaCarteira = parseValorBR(valor);
          cy.log(`Valor liquido Carteira: ${liquidoGerenciaCarteira}`);
        });

      cy.get('#salvar-button').wait(500).click()

      cy.get('#mat-input-18').wait(500)
        .clear()
        .click()
        .type(dados.data)

      cy.get('.w-100 > .modal-footer-custom > .mat-accent').click().wait(1500)

      cy.get('#dialogs_choose > #div-modal-dialog > #div-modal-content > #div-modal-footer > .button-modal-group > .ml-2').click().wait(1500)

    });

    it('BAIXA DE PIX', () => {

      cy.visit('financeiro/pix/baixa').wait(1000);

      cy.get('#mat-input-3').clear().type('01/10/2020');
      cy.get('#mat-input-4').clear().type(dados.data);

      cy.get('.col-lg-3 > div.ng-untouched > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-suffix > .mat-focus-indicator > .mat-button-wrapper > .mat-icon')
        .click();

      cy.get('#search_baixa_pix input')
        .click()
        .type(dados.adquirentes.pix).wait(200)

      cy.get('#search_baixa_pix .mat-form-field-suffix')
        .click()

      cy.contains('td', dados.adquirentes.pix)
        .parent('tr')
        .click()

      cy.get('.col > .text-right > .mat-raised-button').click()

      cy.get('#mat-checkbox-1 > .mat-checkbox-layout > .mat-checkbox-inner-container').click()
      cy.get('#mat-checkbox-2 > .mat-checkbox-layout > .mat-checkbox-inner-container').click()
      cy.get('#mat-checkbox-3 > .mat-checkbox-layout > .mat-checkbox-inner-container').click().wait(500)

      cy.get('#mat-input-10').invoke('val')
        .then((valor) => {
          liquidoGerenciaPix = parseValorBR(valor);
          cy.log(`Valor liquido Pix: ${liquidoGerenciaPix}`);
        });

      cy.get('#salvar-button').wait(500).click()

      cy.get('#mat-input-18').wait(500)
        .clear()
        .click()
        .type(dados.data)

      cy.get('.w-100 > .modal-footer-custom > .mat-accent').click().wait(1500)

      cy.get('#dialogs_choose > #div-modal-dialog > #div-modal-content > #div-modal-footer > .button-modal-group > .ml-2').click().wait(1500)

    });

    it('CX GERENCIA - POSTERIOR', () => {

      cy.visit('movimentos/caixas-da-gerencia').wait(1000);

      cy.get('#mat-input-3').click().clear().wait(200).type(dados.data)
      cy.get('#mat-input-4').click().clear().wait(200).type(dados.data)

      cy.get('.col > .text-right > .mat-raised-button > .mat-button-wrapper').click().wait(500)

      cy.get('#link-edit > .mat-icon').click().wait(500)

      cy.get(':nth-child(2) > :nth-child(2) > :nth-child(10) > .col-5 > .form-control').invoke('val')
        .then((valor) => {
          cxGerenciaCarteiraPOS = parseValorBR(valor);
          cy.log(`Valor Carteira Pós: ${cxGerenciaCarteiraPOS}`);
        });

      cy.get(':nth-child(2) > :nth-child(2) > :nth-child(11) > .col-5 > .form-control').invoke('val')
        .then((valor) => {
          cxGerenciaPixPOS = parseValorBR(valor);
          cy.log(`Valor Pix Pós: ${cxGerenciaPixPOS}`);
        });

        
      cy.get(':nth-child(2) > :nth-child(2) > :nth-child(4) > .col-5 > .form-control').invoke('val')
        .then((valor) => {
          cxGerenciaCartaoPOS = parseValorBR(valor);
          cy.log(`Valor Pix Pós: ${cxGerenciaCartaoPOS}`);
        });

    });

    
    it('VALIDANDO OS VALORES', () => {
      
      cy.then(() => {
        
        // CARTEIRA
        if (cxGerenciaCarteiraPOS === (cxGerenciaCarteira + liquidoGerenciaCarteira)) {
          cy.log(`✅ CARTEIRA DIGITAL OK: ${cxGerenciaCarteiraPOS} = ${cxGerenciaCarteira} + ${liquidoGerenciaCarteira}`);
        } else {
          throw new Error(`❌ CARTEIRA DIGITAL divergente: ${cxGerenciaCarteiraPOS} != ${cxGerenciaCarteira} + ${liquidoGerenciaCarteira}`);
        }
        
        // PIX
        if (cxGerenciaPixPOS === (cxGerenciaPix + liquidoGerenciaPix)) {
          cy.log(`✅ PIX OK: ${cxGerenciaPixPOS} = ${cxGerenciaPix} + ${liquidoGerenciaPix}`);
        } else {
          throw new Error(`❌ PIX divergente: ${cxGerenciaPixPOS} != ${cxGerenciaPix} + ${liquidoGerenciaPix}`);
        }

          // CARTAO
        if (cxGerenciaCartaoPOS === (cxGerenciaCartao + liquidoGerenciaCartao)) {
          cy.log(`✅ Cartao OK: ${cxGerenciaCartaoPOS} = ${cxGerenciaCartao} + ${liquidoGerenciaCartao}`);
        } else {
          throw new Error(`❌ Cartao divergente: ${cxGerenciaCartaoPOS} != ${cxGerenciaCartao} + ${liquidoGerenciaCartao}`);
        }
        
      });
      
    });


  });
    
});