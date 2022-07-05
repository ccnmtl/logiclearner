describe('Question Dashboard Interactions', function() {
    beforeEach(() => {
        let baseUrl = 'http://localhost:8000';
        cy.visit(baseUrl);
        cy.get('#cu-privacy-notice-button').click();
    });
    it('Should list all Novice questions', function() {
        cy.get('[data-cy="level-one"]').click();
        cy.get('#cardset-label')
            .contains('Questions in Novice level');
        cy.get('[data-cy="question1"]').should(
            'contain', 'Prove that (p∨q)∨(p∨¬q) is a Tautology');
        cy.get('[data-cy="question2"]').should(
            'contain', 'Prove that ¬(¬p) is logically equivalent to p.');
        cy.get('.ll-button__text').should('contain', 'Reset level');
        cy.get('.ll-button__text').click();
        cy.get('.modal-header').should('contain', 'Reset');
    });
    it('Should list all Learner questions', function() {
        cy.get('[data-cy="level-two"]').click();
        cy.get('#cardset-label')
            .contains('Questions in Learner level');
        cy.get('[data-cy="question3"]').should(
            'contain', 'Prove that (p∨q)∧(p∨¬q) is logically equivalent to p.');
        cy.get('[data-cy="question4"]').should(
            'contain', 'Prove that (¬q∨q)∧¬r∧p∧r is a Fallacy.');
    });
    it('Should list all Apprentice questions', function() {
        cy.get('[data-cy="level-three"]').click();
        cy.get('#cardset-label')
            .contains('Questions in Apprentice level');
        cy.get('[data-cy="question5"]').should(
            'contain',
            'Prove that ¬(¬r∧¬(¬(p∧(q∨q)))) is logically equivalent' +
            ' to (p∧q)→r.');
    });
});