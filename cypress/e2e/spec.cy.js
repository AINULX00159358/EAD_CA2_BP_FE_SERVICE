describe('E2E UI Test', () => {

  before(() => {
    cy.visit("http://localhost:32137", { timeout: 30000 });
  });


  it('should visit', () => {
    cy.wait(1000);
    cy.get('form').within(($form) => {
      cy.get('input[name="email"]').type('eaxample@email.com')
      cy.get('input[name="systolic"]').type('120')
      cy.get('input[name="diastolic"]').type('98')
      cy.root().submit()
    })

  });

})
