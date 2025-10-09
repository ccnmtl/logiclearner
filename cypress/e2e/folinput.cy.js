describe('First-Order Logic', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8000/fol');
        cy.get('#cu-privacy-notice-button').click();
    });

    it('renders the FOL component', () => {
        cy.get('#grid-game').should('exist');
    });

    it('renders the Grid component', () => {
        cy.get('#grid-game').should('exist');
    });

    describe('Statement Inputs', () => {
        beforeEach(() => {
            cy.get('select#mode').select(1);
        });

        it('renders the component', () => {
            cy.get('[data-testid=statement-input]').should('exist');
        });

        const checkFeedback = (input) => {
            cy.get('#statement-text').type(input);
            cy.get('[data-testid=submit-button]').click();
            return cy.get('[data-testid=feedback]');
        };

        it('displays feedback', () => {
            cy.get('[data-testid=submit-button]').click();
            cy.get('[data-testid=feedback]').should('exist');
        });

        it('checks for ForAll and Exists', () => {
            checkFeedback('Bad Text').should('not.contain', 'Success!');
        });
    });
});