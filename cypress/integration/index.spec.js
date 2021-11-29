it('Checks that the site loads', function() {
    let baseUrl = 'http://localhost:8000';
    cy.visit(baseUrl);
});

it('Checks for start button', function() {
    let baseUrl = 'http://localhost:8000';
    cy.visit(baseUrl);
    cy.get('.btn').contains('Start From Home Page')
});
