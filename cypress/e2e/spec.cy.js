describe('E2E UI Test', () => {

before(() => {

  cy.visit(Cypress.env('APPURL'), { timeout: 30000 });
});


  it('should visit', () => {
    cy.wait(1000);
    cy.get('#logo').should('contain.text', 'UI');
    cy.get('form').within(($form) => {
      cy.get('input[name="email"]').type('cypresstest@email.com')
      cy.get('input[name="systolic"]').type('120')
      cy.get('input[name="diastolic"]').type('98')
      cy.root().submit()
    })
      cy.wait(1000);
      cy.get('#results_input').should('contain.text', 'Systolic :120 Diastolic 98')
      cy.get('#results_category').should('contain.html', 'Your blood Pressure category is: High')

  });

})
