describe('Levels Dashboard Interactions', function() {
    beforeEach(() => {
        let baseUrl = 'http://localhost:8000';
        cy.visit(baseUrl);
        cy.get('#cu-privacy-notice-button').click();
    });
    it('Should list all levels', function() {
        cy.get('[data-cy="tutorial-link"]').contains('Using Logic Learner');
        cy.get('[data-cy="level-one"]').contains('Novice');
        cy.get('[data-cy="level-two"]').contains('Learner');
        cy.get('[data-cy="level-three"]').contains('Apprentice');
    });
    it('should go to correct tutorial url', function() {
        cy.get('[data-cy="tutorial-link"]').click();
        cy.url().should('eq', 'http://localhost:8000/tutorial/');
    });
    it('should go to correct level one url', function() {
        cy.get('[data-cy="level-one"]').click();
        cy.url().should('eq', 'http://localhost:8000/level/1');
    });
    it('should go to correct level two url', function() {
        cy.get('[data-cy="level-two"]').click();
        cy.url().should('eq', 'http://localhost:8000/level/2');
    });
    it('should go to correct level three url', function() {
        cy.get('[data-cy="level-three"]').click();
        cy.url().should('eq', 'http://localhost:8000/level/3');
    });
    it('Tests a11y on the levels dashboard', function() {
        cy.injectAxe();
        cy.checkA11y('html', {
            runOnly: {
                type: 'tag',
                values: ['wcag2a']
            }});
    });
});