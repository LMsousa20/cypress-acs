describe('EMISSAO DE NOTAS', () => {

  function parseValorBR(valorStr) {
    return parseFloat(valorStr.replace(/\./g, '').replace(',', '.'));
  }

  const dados =
  {
    idCaixa: 3783,
    caixa: 'Fechado',
    pdv: 'LUCAS',
    valorAdicionar: 100,
    CodBarras: '7894900700046',
    produto: '0001000119 - CC SEM ACUCAR COLOR LT 350ML',
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
      Convenio: 'TDL CLIENTE COM ACRESCIMO',
      NotaFiscal: 'ALUCARD'
    },
    cheque: {
      Comp: "123",
      Banco: "341",
      Ag: "1234",
      Conta: "12345678-9",
      Cheque: "000123"
    }
  }


  context('Setup Inicial', () => {

    it('Limpando o Cache _ para login', () => {
      cy.limparCache({ log: false });
    });

    it('LOGIN', () => {
      cy.login();
    });

    it('ACESSANDO TELA DE NOTA', () => {

      cy.visit('/movimentos/notas-fiscais/entrada/create').wait(1000);



    });



    it('NOTA Fiscal- CLIENTE ', () => {
      cy.get('#mat-input-12').click().wait(500);
      cy.log('#exampleModalLabel')
      cy.get('.search-notas-entrada-saida > #dialogs-modal > #dialogs_search > #div-modal-dialog > #div-modal-content > #div-modal-body > table_data-simple > acs-data-table > table_filter-default > #div-d-flex > #form-field-pesquisar > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix > #input-pesquisar')
        .should('be.visible')
        .click().type(dados.cliente.NotaFiscal).wait(1000)
      cy.log('ABERTO O MODAL')
      cy.get('.search-notas-entrada-saida > #dialogs-modal > #dialogs_search > #div-modal-dialog > #div-modal-content > #div-modal-body > table_data-simple > acs-data-table > table_filter-default > #div-d-flex > #form-field-pesquisar > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-suffix > #button-search')
        .should('be.visible').click()
      // Primeiro verifica se a tabela está visível
      cy.get('table.acs-table').should('be.visible')
      // Aguarda um momento para garantir que os dados carregaram
      cy.get('tbody tr').should('have.length.at.least', 1)
      // Clique na linha do cliente específico
      cy.contains('td', dados.cliente.NotaFiscal)
        .parent('tr')
        .click()

    })

    it('NOTA Fiscal- PRODUTO ', () => {
      cy.get('[paneltitle="Itens da Nota"] > .mat-card > .mb-2 > .mat-card-header > .mat-card-header-text > .mat-card-title > .panel-header > .mat-focus-indicator')
      .click().wait(500);
      cy.get('#mat-input-127').click().wait(1000);
      cy.contains('td', 'TDL')
      .parent('tr')
      .click().wait(500);
      
      cy.get('#mat-input-128').click().type(dados.CodBarras).wait(300)
      
      cy.get('#mat-input-131').click().wait(300);
      
      cy.get('#mat-input-129')
      .should('have.value', dados.produto) // Se não for igual, o teste falha aqui
      // .click()
      .wait(1000);
      
    })
    
    it('NOTA Fiscal- PRODUTO  - CFOP ', () => {
      cy.get('.mat-card-content > :nth-child(1) > :nth-child(8) > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-suffix > .mat-focus-indicator > .mat-button-wrapper > .mat-icon').click();
      
      cy.contains('td', '1949')
      .parent('tr')
      .click().wait(500);
      
    })
    
    it('NOTA Fiscal- PRODUTO  - QUANTIDADE ', () => {
      cy.get('#mat-input-138').click().type('1').wait(1000)
      
      cy.get('#listar_item_nota_dialog > #div-modal-dialog > #div-modal-content > #div-modal-footer > .button-modal-group > .ml-auto > .mat-accent')
      .click()
      
      
      
    })
    
    it('SALVANDO', () => {
      
      cy.get('#salvar-button').click().wait(1000)
      
      cy.get('#choose_finalizar_nota_dialog > #div-modal-dialog > #div-modal-content > #div-modal-footer > .button-modal-group > .ml-2').click().wait(2000)
      
      
    })
    
    it('EMITINDO', () => {
      // se sim 
      cy.get('#choose_emitir_nota_dialog > #div-modal-dialog > #div-modal-content > #div-modal-footer > .button-modal-group > .ml-2')
      .click()

      // se não
      // cy.get('#choose_emitir_nota_dialog > #div-modal-dialog > #div-modal-content > #div-modal-footer > .button-modal-group > .ml-auto').click()


    })

 it('VALIDANDO O ENVIO - OK ', () => { 

    cy.url({ timeout: 10000 }).then((url) => {

      if (url.includes('/movimentos/notas-fiscais/entrada')) {

        cy.log('✅ Nota emitida com sucesso');

      } else {

        cy.log('❌ Falha na emissão da nota');

        cy.get('.mat-snack-bar-container, .mat-dialog-container', { timeout: 10000 })
          .should('be.visible')
          .then((erro) => {

            const mensagem = erro.text();
            cy.log('Mensagem de erro: ' + mensagem);

            throw new Error('Erro na emissão da nota: ' + mensagem);

          });

      }

    });

  });


  });


});



