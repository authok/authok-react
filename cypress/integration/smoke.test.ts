const EMAIL = Cypress.env('USER_EMAIL');
const PASSWORD = Cypress.env('USER_PASSWORD');

if (!EMAIL || !PASSWORD) {
  throw new Error(
    'You must provide CYPRESS_USER_EMAIL and CYPRESS_USER_PASSWORD environment variables'
  );
}

const loginToAuthok = (): void => {
  cy.get('.authok-lock-input-username .authok-lock-input').clear().type(EMAIL);
  cy.get('.authok-lock-input-password .authok-lock-input').clear().type(PASSWORD);
  cy.get('.authok-lock-submit').click();
};

describe('Smoke tests', () => {
  it('do basic login and show user', () => {
    cy.visit('/');
    cy.get('#login').should('be.visible');
    cy.get('#login').click();

    loginToAuthok();

    cy.get('#hello').contains(`Hello, ${EMAIL}!`);
    cy.get('#logout').click();
    cy.get('#login').should('exist');
  });

  it('should protect a route and return to path after login', () => {
    cy.visit('/users');

    loginToAuthok();

    cy.url().should('include', '/users');
    cy.get('#logout').click();
  });

  it('should access an api', () => {
    cy.visit('/users');

    loginToAuthok();

    cy.get('table').contains('bob@example.com');
    cy.get('#logout').click();
  });
});
