describe('Tutorial Interactions', function() {
    before(() => {
        let baseUrl = 'http://localhost:8000/tutorial/';
        cy.visit(baseUrl);
        cy.get('#cu-privacy-notice-button').click();
    });
    it('Should list all tutorial steps and modals', function() {
        cy.get('[data-cy="tutorial-one"]').click();
        cy.get('#guide-modal').should('contain', 'Law sheet');

        cy.get('[data-cy="tutorial-two"]').click({force: true});
        cy.get('#guide-question').should('contain', 'Logic proof question');

        cy.get('[data-cy="tutorial-three"]').click({force: true});
        cy.get('#guide-solution').should('contain', 'Solution step');
        cy.get('#helper-solution').should('have.css', 'background-color')
            .and('eq', 'rgba(239, 112, 37, 0.25)');

        cy.get('[data-cy="tutorial-four"]').click({force: true});
        cy.get('#guide-stepactions').should('contain', 'Go, or Delete step');

        cy.get('[data-cy="tutorial-five"]').click({force: true});
        cy.get('#guide-solutionkey').should('contain', 'Solution key');

        cy.get('[data-cy="tutorial-six"]').click({force: true});
        cy.get('#guide-reset').should('contain', 'Reset proof');

        cy.get('[data-cy="lawSheetModal"]').should('contain', 'Law sheet');
        cy.get('[data-cy="keyBindingModal"]')
            .should('contain', 'Logic symbols');
    });
    it('Tests a11y on the tutorial page', function() {
        cy.get('[data-cy="tutorial-one"]').click();
        cy.injectAxe();
        cy.checkA11y('html', {
            runOnly: {
                type: 'tag',
                values: ['wcag2a']
            }});
    });
});