describe('RECEBIMENTOS MANUAIS', () => {

  function parseValorBR(valorStr) {
    return parseFloat(valorStr.replace(/\./g, '').replace(',', '.'));
  }

  const dados =
  {
    idCaixa: 3840, //    <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ID DA PRESTAÇÃO - IMPORTANTISSIMO 
    caixa: 'Fechado',
    pdv: 'LUCAS',
    valorAdicionar: 100,
    produto: 'GASOLINA COMUM',
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
      Convenio: 'TDL CLIENTE COM ACRESCIMO'
    },
    cheque: {
      Comp: "123",
      Banco: "341",
      Ag: "1234",
      Conta: "12345678-9",
      Cheque: "000123"
    }
  }

  // let valorAnteriorDinheiro;
  let valorAnteriorCredito;
  let valorAnteriorDebito;
  let valorAnteriorPix;
  let valorAnteriorCarteiraDigital;
  let valorAnteriorChequeAVista;
  let valorAnteriorChequeAPrazo;
  let valorAnteriorPEF;
  let valorAnteriorConvenio;
  let valorAnteriorDescontoBalcao;
  let valorAnteriorDescontoContrato;
  let valorAnteriorAcrescimoContrato;

  context('Setup Inicial', () => {

    it('Limpando o Cache _ para login', () => {
      cy.limparCache({ log: false });
    });

    it('LOGIN', () => {
      cy.login();
    });

    it('PRESTACAO PRESTACAO ESPECIFICA', () => {

      cy.visit(`movimentos/caixas-de-venda/${dados.idCaixa}`).wait(1000);
      
      

    });

    it('BUSCANDO VALORES', () => {
      // Executa UMA VEZ antes de todos os testes
      cy.get(':nth-child(8) > .row > .input-text > .form-control').invoke('val')
        .then((valor) => {
          valorAnteriorCredito = parseValorBR(valor);
          cy.log(`Valor capturado Credito: ${valorAnteriorCredito}`);
        });

      cy.get(':nth-child(9) > .row > .input-text > .form-control').invoke('val')
        .then((valor) => {
          valorAnteriorDebito = parseValorBR(valor);
          cy.log(`Valor capturado Debito: ${valorAnteriorDebito}`);
        });

      cy.get(':nth-child(19) > .row > .input-text > .form-control').invoke('val')
        .then((valor) => {
          valorAnteriorPix = parseValorBR(valor);
          cy.log(`Valor capturado Pix: ${valorAnteriorPix}`);
        });

      cy.get(':nth-child(18) > .row > .input-text > .form-control').invoke('val')
        .then((valor) => {
          valorAnteriorCarteiraDigital = parseValorBR(valor);
          cy.log(`Valor capturado CarteiraDigital: ${valorAnteriorCarteiraDigital}`);
        });

      cy.get(':nth-child(6) > .row > .input-text > .form-control').invoke('val')
        .then((valor) => {
          valorAnteriorChequeAPrazo = parseValorBR(valor);
          cy.log(`Valor capturado CarteiraDigital: ${valorAnteriorChequeAPrazo}`);
        });

      cy.get(':nth-child(5) > .row > .input-text > .form-control').invoke('val')
        .then((valor) => {
          valorAnteriorChequeAVista = parseValorBR(valor);
          cy.log(`Valor capturado CarteiraDigital: ${valorAnteriorChequeAVista}`);
        });

      cy.get(':nth-child(10) > .row > .input-text > .form-control').invoke('val')
        .then((valor) => {
          valorAnteriorPEF = parseValorBR(valor);
          cy.log(`Valor capturado PEF: ${valorAnteriorPEF}`);
        });

      cy.get(':nth-child(12) > .row > .input-text > .form-control').invoke('val')
        .then((valor) => {
          valorAnteriorConvenio = parseValorBR(valor);
          cy.log(`Valor capturado Convenio: ${valorAnteriorConvenio}`);
        });

      cy.get('#mat-input-27').invoke('val')
        .then((valor) => {
          valorAnteriorDescontoBalcao = parseFloat(valor.replace(',', '.'));
          cy.log(`Valor capturado Desconto Balcão: ${valorAnteriorDescontoBalcao}`);
        });

      cy.get('#mat-input-28').invoke('val')
        .then((valor) => {
          valorAnteriorDescontoContrato = parseFloat(valor.replace(',', '.'));
          cy.log(`Valor capturado Desconto Contrato: ${valorAnteriorDescontoContrato}`);
        });

      cy.get('#mat-input-29').invoke('val')
        .then((valor) => {
          valorAnteriorAcrescimoContrato = parseFloat(valor.replace(',', '.'));
          cy.log(`Valor capturado Acréscimo Contrato: ${valorAnteriorAcrescimoContrato}`);
        });

      cy.screenshot('Valores Iniciais - Recebimentos Manuais');

    });


    it('Desbloquear o caixa se estiver bloqueado', () => {

      cy.get('body').then(($body) => {
        if ($body.find('[title="Desbloqueia o caixa"]').length > 0) {
          cy.get('[title="Desbloqueia o caixa"]').then(($button) => {
            if ($button.is(':enabled') && !$button.is(':disabled')) {
              cy.get('[title="Desbloqueia o caixa"]').click().wait(500);
              cy.log('✅ Caixa estava bloqueado - Botão clicado');
              cy.get('#dialogs_choose > #div-modal-dialog > #div-modal-content > #div-modal-footer > .button-modal-group > .ml-2').click();
              
              cy.get('#toast-container > .ng-trigger')
                .should('be.visible')
                .then(() => {
                  cy.get('.toast-message > :nth-child(1)')
                    .invoke('text')
                    .then((message) => {
                      cy.log('Mensagem do toast:', message);
                      throw new Error(`Teste interrompido. Mensagem: ${message}`);
                    });
                });


            } else {
              cy.log('ℹ️ Caixa já está desbloqueado - Botão inativo');
            }
          });
        } else {
          cy.log('ℹ️ Botão de desbloquear caixa não encontrado');
          throw new Error('ℹ️ Botão de desbloquear caixa não encontrado');
        }
      });
    });

  });

  context('Adicionando Recebimentos de Convenio', () => {

    //Convenio

    it('Acessar prestacao', () => {
      cy.visit(`movimentos/caixas-de-venda/${dados.idCaixa}`).wait(1000);
    });


    it(' ADICIONADO Convenio', () => {
      cy.get(':nth-child(1) > .row > :nth-child(2) > .form-control').clear().type('100').wait(500);
      cy.get(':nth-child(12) > .row > .col-3.ng-star-inserted > .mat-focus-indicator > .mat-button-wrapper > .button-text').click().wait(1000);
      cy.get('#button-create').click().wait(1000);
    });

    it('Convenio - Componente busca - PDV', () => {
      cy.get('#mat-input-78').click().wait(1000);
      cy.buscarComp(dados.pdv).then((modalTitle) => {
        cy.log(`Modal utilizado: ${modalTitle}`)
        // Aqui você pode adicionar verificações do que acontece após o clique
      }
      )
    });


    it('Convenio - Componente busca - Caixa ', () => {
      cy.get('#mat-input-79').click().wait(1000);
      cy.buscarComp(dados.caixa).then((modalTitle) => {
        cy.log(`Modal utilizado: ${modalTitle}`)
        // Aqui você pode adicionar verificações do que acontece após o clique
      });
    });

    it('Convenio - Componente busca - Cliente', () => {
      cy.get('#mat-input-49').click().wait(1000);
      cy.buscarComp(dados.cliente.Convenio).then((modalTitle) => {
        cy.log(`Modal utilizado: ${modalTitle}`)
        // Aqui você pode adicionar verificações do que acontece após o clique
      });
    });


    it('Convenio - Componente busca - Produto ', () => {
      cy.get('.panel-header > .mat-focus-indicator > .mat-button-wrapper').click().wait(500);
      cy.get('#mat-input-85').click().wait(500);
      cy.log('#exampleModalLabel')
      cy.get('#search_item_convenio > #div-modal-dialog > #div-modal-content > #div-modal-body > table_data-simple > acs-data-table > table_filter-default > #div-d-flex > #form-field-pesquisar > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix > #input-pesquisar')
        .should('be.visible')
        .click().type(dados.produto).wait(1000)
      cy.log('ABERTO O MODAL')
      cy.get('#search_item_convenio > #div-modal-dialog > #div-modal-content > #div-modal-body > table_data-simple > acs-data-table > table_filter-default > #div-d-flex > #form-field-pesquisar > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-suffix > #button-search > .mat-button-wrapper > #icon-search').should('be.visible').click()
      // Primeiro verifica se a tabela está visível
      cy.get('table.acs-table').should('be.visible')
      // Aguarda um momento para garantir que os dados carregaram
      cy.get('tbody tr').should('have.length.at.least', 1)
      // Clique na linha do cliente específico
      cy.contains('td', dados.produto)
        .parent('tr')
        .click()
      cy.get('#mat-input-86').clear().type('10').wait(500);
      cy.get('#mat-input-89').clear().type('10').wait(500);
      cy.get('.ml-auto > .mat-accent > .mat-button-wrapper').click().wait(500);

    })


    it('Adicionando Valor ', () => {
      cy.get('#mat-input-56').clear().type('100').wait(500);
      cy.get(':nth-child(2) > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-suffix > .mat-focus-indicator > .mat-button-wrapper > .mat-icon').click().wait(500);
      cy.get('#salvar-button').click().wait(500);
      cy.get('#toast-container > .ng-trigger').click().wait(500);
      cy.get('#salvar-button').click().wait(500);
      cy.get('#choose_criar_editar__recebimento > #div-modal-dialog > #div-modal-content > #div-modal-footer > .button-modal-group > .ml-2').click().wait(1000);



    })



  });



  context('Adicionando Recebimentos de Cartão de Credito', () => {

    // CARTÃO DE CREDITO

     it('Acessar prestacao', () => {
      cy.visit(`movimentos/caixas-de-venda/${dados.idCaixa}`).wait(1000);
    });


    it('Cartão de Credito', () => {


      cy.get(':nth-child(8) > .row > .col-3.ng-star-inserted > .mat-focus-indicator > .mat-button-wrapper > .button-text').click().wait(1000);
      cy.get('#button-create').click().wait(1000);
      // cy.get('[formcontrolname="descricao"]').click().wait(1000);
      cy.get('#mat-input-95').click().wait(1000);
    });

    it('Cartão de Credito - Componente busca - PDV', () => {
      cy.buscarComp(dados.pdv).then((modalTitle) => {
        cy.log(`Modal utilizado: ${modalTitle}`)
        // Aqui você pode adicionar verificações do que acontece após o clique
      })
    });


    it('Link do componente de busca - Caixa ', () => {
      cy.get('#mat-input-96').click().wait(1000);
      // cy.get('#mat-input-50')

    })

    it('Cartão de Credito - Componente busca - Caixa Vendas', () => {
      cy.buscarComp(dados.caixa).then((modalTitle) => {
        cy.log(`Modal utilizado: ${modalTitle}`)
        // Aqui você pode adicionar verificações do que acontece após o clique
      })
    });


    it('Link do componente de busca - Administradora ', () => {
      // cy.get('#mat-input-95')
      cy.get('#mat-input-50').click().wait(1000);

    })

    it('Componente busca - Administradora', () => {
      cy.buscarComp(dados.administradoras.credito).then((modalTitle) => {
        cy.log(`Modal utilizado: ${modalTitle}`)
        // Aqui você pode adicionar verificações do que acontece após o clique
      })
    });


    it('Adicionando Valor ', () => {
      cy.get('[formcontrolname="valor"]').clear().type('100').wait(500);

    });


    it('Finalizar o caixa - Salvar', () => {
      cy.get('#salvar-button').click().wait(500);
      cy.get('#choose_criar_editar__recebimento > #div-modal-dialog > #div-modal-content > #div-modal-footer > .button-modal-group > .ml-2').click().wait(500);
      cy.get('.mr-2 > .mat-focus-indicator > .mat-button-wrapper').click();


    })
  });

  context('Adicionando Recebimentos de Cartão de Debito', () => {
    // CARTÃO DE DEBITO 

    it('Acessar prestacao', () => {

      cy.visit(`movimentos/caixas-de-venda/${dados.idCaixa}`).wait(1000);


    });

    it('Cartão de debito', () => {

      cy.get(':nth-child(9) > .row > .col-3.ng-star-inserted > .mat-focus-indicator > .mat-button-wrapper > .button-text').click().wait(1000);
      cy.get('#button-create').click().wait(1000);
      // cy.get('[formcontrolname="descricao"]').click().wait(1000);
      cy.get('#mat-input-95').click().wait(1000);
    });

    it('Cartão de debito - Componente busca - PDV', () => {
      cy.buscarComp(dados.pdv).then((modalTitle) => {
        cy.log(`Modal utilizado: ${modalTitle}`)
        // Aqui você pode adicionar verificações do que acontece após o clique
      }
      )
    });

    it('Link do componente de busca - Caixa ', () => {
      cy.get('#mat-input-96').click().wait(1000);
      // cy.get('#mat-input-50')

    })

    it('Cartão de debito - Componente busca - Caixa ', () => {

      cy.buscarComp(dados.caixa).then((modalTitle) => {
        cy.log(`Modal utilizado: ${modalTitle}`)
        // Aqui você pode adicionar verificações do que acontece após o clique
      });

    });


    it('Link do componente de busca - Administradora ', () => {
      // cy.get('#mat-input-95')
      cy.get('#mat-input-50').click().wait(1000);

    })

    it('Cartão de debito - Componente busca - Administradora', () => {

      cy.buscarComp(dados.administradoras.debito).then((modalTitle) => {
        cy.log(`Modal utilizado: ${modalTitle}`)
        // Aqui você pode adicionar verificações do que acontece após o clique
      });


    });


    it('Adicionando Valor ', () => {
      cy.get('[formcontrolname="valor"]').clear().type('100').wait(500);

    });


    it('Finalizar o caixa - Salvar', () => {
      cy.get('#salvar-button').click().wait(500);
      cy.get('#choose_criar_editar__recebimento > #div-modal-dialog > #div-modal-content > #div-modal-footer > .button-modal-group > .ml-2').click().wait(500);
    })

  });

  

  context('Adicionando Recebimentos de PIX', () => {

    //PIX


    it('Acessar prestacao', () => {

      cy.visit(`movimentos/caixas-de-venda/${dados.idCaixa}`).wait(1000);


    });

    it('PIX', () => {
      // cy.get(':nth-child(1) > .row > :nth-child(2) > .form-control').clear().type('100').wait(500);
      cy.get(':nth-child(19) > .row > .col-3.ng-star-inserted > .mat-focus-indicator > .mat-button-wrapper > .button-text').click().wait(1000);
      cy.get('#button-create').click().wait(1000);
      // cy.get('[formcontrolname="descricao"]').click().wait(1000);
      cy.get('#mat-input-75').click().wait(1000);
    });

    it('PIX - Componente busca - PDV', () => {
      cy.buscarComp(dados.pdv).then((modalTitle) => {
        cy.log(`Modal utilizado: ${modalTitle}`)
        // Aqui você pode adicionar verificações do que acontece após o clique
      }
      )
    });

    it('Link do componente de busca - Caixa ', () => {
      cy.get('#mat-input-76').click().wait(1000);
      // cy.get('#mat-input-50')

    })

    it('PIX - Componente busca - Caixa ', () => {

      cy.buscarComp(dados.caixa).then((modalTitle) => {
        cy.log(`Modal utilizado: ${modalTitle}`)
        // Aqui você pode adicionar verificações do que acontece após o clique
      });

    });


    it('Link do componente de busca - Administradora ', () => {
      // cy.get('#mat-input-95')
      cy.get('#mat-input-48').click().wait(1000);

    })

    it('PIX - Componente busca - Administradora', () => {

      cy.buscarComp(dados.administradoras.pix).then((modalTitle) => {
        cy.log(`Modal utilizado: ${modalTitle}`)
        // Aqui você pode adicionar verificações do que acontece após o clique
      });


    });


    it('Adicionando Valor ', () => {
      cy.get('[formcontrolname="valor"]').clear().type('100').wait(500);

    });


    it('Finalizar o caixa - Salvar', () => {
      cy.get('#salvar-button').click().wait(500);
      cy.get('#choose_criar_editar__recebimento > #div-modal-dialog > #div-modal-content > #div-modal-footer > .button-modal-group > .ml-2').click().wait(500);
    })

  });

  context('Adicionando Recebimentos de Carteira Digital', () => {

    //CARTEIRA DIGITAL


    it('Acessar prestacao', () => {

      cy.visit(`movimentos/caixas-de-venda/${dados.idCaixa}`).wait(1000);


    });

    it('CARTEIRA DIGITAL', () => {
      // cy.get(':nth-child(1) > .row > :nth-child(2) > .form-control').clear().type('100').wait(500);
      cy.get(':nth-child(18) > .row > .col-3.ng-star-inserted > .mat-focus-indicator > .mat-button-wrapper > .button-text').click().wait(1000);
      cy.get('#button-create').click().wait(1000);
      // cy.get('[formcontrolname="descricao"]').click().wait(1000);
      cy.get('#mat-input-70').click().wait(1000);
    });

    it('CARTEIRA DIGITAL - Componente busca - PDV', () => {
      cy.buscarComp(dados.pdv).then((modalTitle) => {
        cy.log(`Modal utilizado: ${modalTitle}`)
        // Aqui você pode adicionar verificações do que acontece após o clique
      }
      )
    });

    it('Link do componente de busca - Caixa ', () => {
      cy.get('#mat-input-71').click().wait(1000);
      // cy.get('#mat-input-50')

    })

    it('CARTEIRA DIGITAL - Componente busca - Caixa ', () => {

      cy.buscarComp(dados.caixa).then((modalTitle) => {
        cy.log(`Modal utilizado: ${modalTitle}`)
        // Aqui você pode adicionar verificações do que acontece após o clique
      });

    });


    it('Link do componente de busca - Administradora ', () => {
      // cy.get('#mat-input-95')
      cy.get('#mat-input-45').click().wait(1000);

    })

    it('CARTEIRA DIGITAL - Componente busca - Administradora', () => {

      cy.buscarComp(dados.administradoras.carteira).then((modalTitle) => {
        cy.log(`Modal utilizado: ${modalTitle}`)
        // Aqui você pode adicionar verificações do que acontece após o clique
      });


    });


    it('Adicionando Valor ', () => {
      cy.get('[formcontrolname="valor"]').clear().type('100').wait(500);

    });


    it('Finalizar o caixa - Salvar', () => {
      cy.get('#salvar-button').click().wait(500);
      cy.get('#choose_criar_editar__recebimento > #div-modal-dialog > #div-modal-content > #div-modal-footer > .button-modal-group > .ml-2').click().wait(500);
    })


  });

  context('Adicionando Recebimentos de PEF', () => {

    //PEF

    it('Acessar prestacao', () => {
      cy.visit(`movimentos/caixas-de-venda/${dados.idCaixa}`).wait(1000);
    });


    it(' ADICIONADO PEF', () => {
      // cy.get(':nth-child(1) > .row > :nth-child(2) > .form-control').clear().type('100').wait(500);
      cy.get(':nth-child(10) > .row > .col-3.ng-star-inserted > .mat-focus-indicator > .mat-button-wrapper > .button-text').click().wait(1000);
      cy.get('#button-create').click().wait(1000);
    });

    it('PEF - Componente busca - PDV', () => {
      cy.get('#mat-input-95').click().wait(1000);
      cy.buscarComp(dados.pdv).then((modalTitle) => {
        cy.log(`Modal utilizado: ${modalTitle}`)
        // Aqui você pode adicionar verificações do que acontece após o clique
      }
      )
    });





    it('PEF - Componente busca - Caixa ', () => {
      cy.get('#mat-input-96').click().wait(1000);
      cy.buscarComp(dados.caixa).then((modalTitle) => {
        cy.log(`Modal utilizado: ${modalTitle}`)
        // Aqui você pode adicionar verificações do que acontece após o clique
      });
    });

    it('PEF - Componente busca - Administradora', () => {
      cy.get('#mat-input-50').click().wait(1000);
      cy.buscarComp(dados.administradoras.pef).then((modalTitle) => {
        cy.log(`Modal utilizado: ${modalTitle}`)
        // Aqui você pode adicionar verificações do que acontece após o clique
      });
    });


    it('Adicionando Valor ', () => {
      cy.get('[formcontrolname="valor"]').clear().type('100').wait(500);
      cy.get('#salvar-button').click().wait(500);
      cy.get('#choose_criar_editar__recebimento > #div-modal-dialog > #div-modal-content > #div-modal-footer > .button-modal-group > .ml-2').click().wait(500);
    })

  });


 context('Adicionando Recebimentos de Cheque A Prazo', () => {

    //Cheque A Prazo

    it('Acessar prestacao', () => {
      cy.visit(`movimentos/caixas-de-venda/${dados.idCaixa}`).wait(1000);
    });


    it(' ADICIONADO Cheque A Prazo', () => {
      // cy.get(':nth-child(1) > .row > :nth-child(2) > .form-control').clear().type('100').wait(500);
      cy.get(':nth-child(6) > .row > .col-3.ng-star-inserted > .mat-focus-indicator > .mat-button-wrapper > .button-text').click().wait(1000);
      cy.get('#button-create').click().wait(1000);
    });

    it('Cheque A Prazo - Componente busca - PDV', () => {
      cy.get('#mat-input-94').click().wait(1000);
      cy.buscarComp(dados.pdv).then((modalTitle) => {
        cy.log(`Modal utilizado: ${modalTitle}`)
        // Aqui você pode adicionar verificações do que acontece após o clique
      }
      )
    });


    it('Cheque A Prazo - Componente busca - Caixa ', () => {
      cy.get('#mat-input-95').click().wait(1000);
      cy.buscarComp(dados.caixa).then((modalTitle) => {
        cy.log(`Modal utilizado: ${modalTitle}`)
        // Aqui você pode adicionar verificações do que acontece após o clique
      });
    });

    it('Cheque A Prazo - Componente busca - Cliente', () => {
      cy.get('#mat-input-62').click().wait(1000);
      cy.buscarComp(dados.cliente.chequeAvista).then((modalTitle) => {
        cy.log(`Modal utilizado: ${modalTitle}`).wait(500);
        // Aqui você pode adicionar verificações do que acontece após o clique
        cy.get('#mat-input-78').wait(500);
      });
    });

    it('Cheque A Prazo - Componente busca - Cidade', () => {
      cy.get('#mat-input-77').click().wait(1000);
      cy.buscarComp('2304400').then((modalTitle) => {
        cy.log(`Modal utilizado: ${modalTitle}`)
        // Aqui você pode adicionar verificações do que acontece após o clique
      });
    });

    it('Cheque A Prazo - Dados', () => {
      cy.get('#mat-select-40').click();
      cy.get('.mat-option-text')
        .contains('Pré-Datado')
        .click();

      cy.get('#mat-input-72').clear().type(dados.cheque.Comp).wait(500);
      cy.get('#mat-input-73').clear().type(dados.cheque.Banco).wait(500);
      cy.get('#mat-input-74').clear().type(dados.cheque.Ag).wait(500);
      cy.get('#mat-input-75').clear().type(dados.cheque.Conta).wait(500);
      cy.get('#mat-input-76').clear().type(dados.cheque.Cheque).wait(500);


    });


    it('Adicionando Valor ', () => {
      cy.get('[formcontrolname="valor"]').clear().type('100').wait(500);
      cy.get('#salvar-button').click().wait(500);
      cy.get('#choose_criar_editar__recebimento > #div-modal-dialog > #div-modal-content > #div-modal-footer > .button-modal-group > .ml-2').click().wait(500);
      // cy.get('.mr-2 > .mat-focus-indicator > .mat-button-wrapper').should('be:visible').click();
    })
  });

  
  context('Adicionando Recebimentos de Cheque A Vista', () => {

    //Cheque A Vista

    it('Acessar prestacao', () => {
      cy.visit(`movimentos/caixas-de-venda/${dados.idCaixa}`).wait(1000);
    });


    it(' ADICIONADO Cheque A Vista', () => {
      // cy.get(':nth-child(1) > .row > :nth-child(2) > .form-control').clear().type('100').wait(500);
      cy.get(':nth-child(5) > .row > .col-3.ng-star-inserted > .mat-focus-indicator > .mat-button-wrapper > .button-text').click().wait(1000);
      cy.get('#button-create').click().wait(1000);
    });

    it('Cheque A Vista - Componente busca - PDV', () => {
      cy.get('#mat-input-94').click().wait(1000);
      cy.buscarComp(dados.pdv).then((modalTitle) => {
        cy.log(`Modal utilizado: ${modalTitle}`)
        // Aqui você pode adicionar verificações do que acontece após o clique
      }
      )
    });


    it('Cheque A Vista - Componente busca - Caixa ', () => {
      cy.get('#mat-input-95').click().wait(1000);
      cy.buscarComp(dados.caixa).then((modalTitle) => {
        cy.log(`Modal utilizado: ${modalTitle}`)
        // Aqui você pode adicionar verificações do que acontece após o clique
      });
    });

    it('Cheque A Vista - Componente busca - Cliente', () => {
      cy.get('#mat-input-62').click().wait(1000);
      cy.buscarComp(dados.cliente.chequeAvista).then((modalTitle) => {
        cy.log(`Modal utilizado: ${modalTitle}`).wait(500);
        // Aqui você pode adicionar verificações do que acontece após o clique
        cy.get('#mat-input-78').wait(500);
      });
    });

    it('Cheque A Vista - Componente busca - Cidade', () => {
      cy.get('#mat-input-77').click().wait(1000);
      cy.buscarComp('2304400').then((modalTitle) => {
        cy.log(`Modal utilizado: ${modalTitle}`)
        // Aqui você pode adicionar verificações do que acontece após o clique
      });
    });

    it('Cheque A Vista - Dados', () => {
      cy.get('#mat-input-72').clear().type(dados.cheque.Comp).wait(500);
      cy.get('#mat-input-73').clear().type(dados.cheque.Banco).wait(500);
      cy.get('#mat-input-74').clear().type(dados.cheque.Ag).wait(500);
      cy.get('#mat-input-75').clear().type(dados.cheque.Conta).wait(500);
      cy.get('#mat-input-76').clear().type(dados.cheque.Cheque).wait(500);


    });


    it('Adicionando Valor ', () => {
      cy.get('[formcontrolname="valor"]').clear().type('100').wait(500);
      cy.get('#salvar-button').click().wait(500);
      cy.get('#choose_criar_editar__recebimento > #div-modal-dialog > #div-modal-content > #div-modal-footer > .button-modal-group > .ml-2').click().wait(500);
      // cy.get('.mr-2 > .mat-focus-indicator > .mat-button-wrapper').should('be:visible').click();
    })
  });

  















  context('Validando os valores', () => {

    it('ACESSAR ULTIMA PRESTACAO', () => {

      cy.visit(`movimentos/caixas-de-venda/${dados.idCaixa}`).wait(1000);


    });
    it('Valida se todos os valores foram incrementados corretamente', () => {

      // Abre ou atualiza os valores antes de verificar
            cy.visit(`movimentos/caixas-de-venda/${dados.idCaixa}`).wait(1000);

      const campos = [
        { nome: 'Débito', seletor: ':nth-child(9) > .row > .input-text > .form-control', valorAnterior: valorAnteriorDebito },
        { nome: 'Crédito', seletor: ':nth-child(8) > .row > .input-text > .form-control', valorAnterior: valorAnteriorCredito },
        { nome: 'PIX', seletor: ':nth-child(19) > .row > .input-text > .form-control', valorAnterior: valorAnteriorPix },
        { nome: 'Carteira Digital', seletor: ':nth-child(18) > .row > .input-text > .form-control', valorAnterior: valorAnteriorCarteiraDigital },
        { nome: 'Cheque à Prazo', seletor: ':nth-child(6) > .row > .input-text > .form-control', valorAnterior: valorAnteriorChequeAPrazo },
        { nome: 'Cheque à Vista', seletor: ':nth-child(5) > .row > .input-text > .form-control', valorAnterior: valorAnteriorChequeAVista },
        { nome: 'PEF', seletor: ':nth-child(10) > .row > .input-text > .form-control', valorAnterior: valorAnteriorPEF },
        { nome: 'Convenio', seletor: ':nth-child(12) > .row > .input-text > .form-control', valorAnterior: valorAnteriorConvenio },
        // { nome: 'Desconto Balcão', seletor: '#mat-input-27', valorAnterior: valorAnteriorDescontoBalcao },
        // { nome: 'Desconto Contrato', seletor: '#mat-input-28', valorAnterior: valorAnteriorDescontoContrato },
        // { nome: 'Acréscimo Contrato', seletor: '#mat-input-29', valorAnterior: valorAnteriorAcrescimoContrato }
      ];

      const erros = [];
      const oks = [];

      campos.forEach((campo) => {
        cy.get(campo.seletor)
          .invoke('val')
          .then((valor) => {
            const novoValor = parseValorBR(valor);


            const esperado = campo.valorAnterior + 100;

            if (novoValor === esperado) {
              const msgOk = `✅ ${campo.nome}: OK - valor ${novoValor} = ${campo.valorAnterior} + 100`;
              cy.log(msgOk);
              oks.push(msgOk);
            } else {
              const msgErro = `❌ ${campo.nome}: valor ${novoValor} ≠ ${campo.valorAnterior} + 100`;
              cy.log(msgErro);
              erros.push(msgErro);
            }
          });
      });

      // Depois que todos os comandos Cypress forem executados
      cy.then(() => {
        cy.log('📊 Resumo da Validação:');
        cy.log(`🟢 Sucessos (${oks.length}):`);
        oks.forEach(msg => cy.log(`   ${msg}`));

        if (erros.length > 0) {
          cy.log(`🔴 Erros (${erros.length}):`);
          erros.forEach(msg => cy.log(`   ${msg}`));
          throw new Error(`⚠️ Foram encontrados ${erros.length} erro(s):\n- ${erros.join('\n- ')}`);
        } else {
          cy.log('🎉 Todos os valores foram incrementados corretamente!');
        }
      });
    });
  });




});



