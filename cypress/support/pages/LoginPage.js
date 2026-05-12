class LoginPage {
  elements = {
    usernameInput: () => cy.get('[formcontrolname="username"]'),
    passwordInput: () => cy.get('#password-input'),
    empresaSelect: () => cy.get('mat-select[formcontrolname="empresa"]'),
    submitButton: () => cy.get('button[type="submit"]'),
    empresaOption: (nome) => cy.contains('mat-option', nome)
  }

  access(tenantId) {
    cy.visit(`/login/${tenantId}`);
  }

  login(username, password, empresa) {
    this.elements.usernameInput().clear().type(username);
    this.elements.passwordInput().clear().type(password);
    this.elements.empresaSelect().click();
    this.elements.empresaOption(empresa).click();
    this.elements.submitButton().click();
  }
}

export default new LoginPage();
