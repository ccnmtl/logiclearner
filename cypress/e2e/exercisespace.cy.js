describe('Exercise Space Interactions', function() {
    beforeEach(() => {
        let baseUrl = 'http://localhost:8000/';
        cy.visit(baseUrl);
        cy.get('#cu-privacy-notice-button').click();
    });
    it('Should check exercise space', function() {
        cy.get('[data-cy="level-one"]').click();
        cy.get('[data-cy="question1"]').click();
        cy.get('[data-bs-target="#keyBindingModal"]').should('exist');
        cy.get('[data-bs-target="#lawSheetModal"]').should('exist');
        cy.get('.question__status__text').should('exist');
        cy.get('.question__status__text').should(
            'contain', 'Haven’t started');
        cy.get('[data-cy="solution-key"]').should('exist');
        cy.get('[data-cy="solution-key"]').click({force: true});
        cy.get('.solutionkey').should('exist');
        cy.get('[data-cy="solution-step-0"]').should(
            'contain', 'Premise: (p∨q)∨(p∨¬q)');
        cy.get('[data-cy="solution-step-1"]').should(
            'contain', 'Step 1');
        cy.get('[data-cy="reset-proof"]').should('exist');
        cy.get('[data-cy="reset-proof"]').should('be.disabled');
        cy.get('.question').should('contain',
            'Prove that (p∨q)∨(p∨¬q) is a Tautology.');
    });
    it('Tests a11y on the exercise space', function() {
        cy.get('[data-cy="level-one"]').click();
        cy.get('[data-cy="question1"]').click();
        cy.injectAxe();
        cy.checkA11y('html', {
            runOnly: {
                type: 'tag',
                values: ['wcag2a']
            }});
    });
});