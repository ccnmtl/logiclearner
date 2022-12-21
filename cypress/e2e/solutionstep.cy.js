describe('Exercise Space Interactions', { testIsolation: false }, () => {
    before(() => {
        let baseUrl = 'http://localhost:8000/';
        cy.visit(baseUrl);
    });
    it('Should go through level one question', function() {
        cy.get('[data-cy="level-one"]').click();
        cy.get('[data-cy="question2"]').click();
        cy.get('#laws-0').should('exist');
        cy.get('#statementInput-0').should('exist');
        //syntax error
        cy.get('select').select('Double Negation', {force: true});
        cy.get('input').type('test', {force: true});
        cy.get('.btn-success').click({force: true});
        cy.get('.text-danger').should('contain',
            'Syntax error in input expression');
        //incorrect step
        cy.get('select').select('Double Negation', {force: true});
        cy.get('input').clear({force: true});
        cy.get('input').type('~p', {force: true});
        cy.get('.btn-success').click({force: true});
        cy.get('.text-danger').should('contain',
            'Invalid next step for current expression');
        //incorrect law
        cy.get('select').select('Absorption', {force: true});
        cy.get('input').clear({force: true});
        cy.get('input').type('p', {force: true});
        cy.get('.btn-success').click({force: true});
        cy.get('.text-danger').should('contain',
            'Input expression not entailed by selected rule');
        //correct step
        cy.get('select').select('Double Negation', {force: true});
        cy.get('.btn-success').click({force: true});
        cy.get('.medal-box').should('exist');
        cy.get('.medal-box').should('contain', 'Congratulations!');
        cy.get('.question__status__text').should('contain', 'Completed');

        cy.get('[data-cy="level-button"]').click({force: true});
        cy.get('[data-cy="questions-completed"]').should('contain', '1/2');
    });
    it('Should test reset level', function() {
        cy.get('.ll-button__text').click();
        cy.get('.btn-danger').click();
        cy.get('[data-cy="questions-completed"]').should('contain', '0/2');
    });
    it('Should test delete step function', function() {
        cy.get('[data-cy="question1"]').click();
        cy.get('select').select('Associativity', {force: true});
        cy.get('input').type('pvqvpv~q', {force: true});
        cy.get('.btn-success').click({force: true});
        cy.get('.question__status__text').should('contain', 'In progress');
        cy.get('[data-cy="reset-proof"]').should('not.be.disabled');

        cy.get('[data-cy="-1"]').select('Negation', {force: true});
        cy.get('#statementInput-1').type('pvpvT', {force: true});
        cy.get('.btn-success').click({force: true});
        cy.get('[data-cy="Negation-1"]').should('be.disabled');
        cy.get('#statementInput-1').should('be.disabled');
        cy.get('.btn-danger').click({force: true});
        cy.get('[data-cy="Negation-1"]').should('not.be.disabled');
        cy.get('#statementInput-1').should('not.be.disabled');
    });
    it('Should test hint functionality', function() {
        cy.visit('http://localhost:8000/level/2');
        cy.get('[data-cy="question3"]').click();
        cy.wait(500);
        cy.get('[data-cy="hint-button"]').click({force: true});
        cy.get('[data-cy="law-hint"]').should('exist');
        cy.get('[data-cy="law-hint"]').should('contain', 'Distributivity');
        cy.get('[data-cy="hint-button"]').click({force: true});
        cy.get('[data-cy="hint-button"]').should('be.disabled');
        cy.get('[data-cy="expression-hint"]').should('exist');
        cy.get('[data-cy="expression-hint"]').should('contain', 'pv(q^~q)');
    });
});