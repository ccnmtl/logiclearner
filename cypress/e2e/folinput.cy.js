import {
    predicateList, operatorList, variableList, constantList
} from '../../media/js/src/firstOrderLogic/utils';

const category = [['Predicate', predicateList], ['Operators', operatorList],
    ['Variables', variableList], ['Constants', constantList]];

describe('First-Order Logic Expression Game', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8000/fol/express/');
        cy.get('#cu-privacy-notice-button').click();
    });

    it('renders the Grid component', () => {
        cy.get('#grid').should('exist');
    });

    it('updates the grid', () => {
        cy.get('div.order-1>strong').then(statement => {
            cy.get('div.grid-actions>button').first().click();
            cy.get('div.order-1>strong')
                .should('not.contain', statement[0].innerHTML);
        });
    });

    describe('Statement Inputs', () => {
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

    describe('Statement Buttons', () => {
        it('has an empty input', () =>
            cy.get('#statement-text').should('have.value', ''));
        category.forEach(([key, items]) => {
            describe(`Checks the ${key} buttons`, () => {
                beforeEach(() => {
                    it(`${key} button list exists`, () =>
                        cy.get(`ul#${key}`).should('exist'));
                    it(`${key} button list is the proper length`, () =>
                        cy.get(`ul#${key}>li`)
                            .should('have.length', items.length));
                });

                // Limit the button tests to 3 items max per category
                items.slice(0, 3).forEach(item => {
                    it(`shows ${item} button`, () =>
                        cy.get(`ul#${key}>li`).should('contain', item));
                    it(`adds ${item} to the input`, () => {
                        cy.get(`button#${item}`).click();
                        cy.get('#statement-text').should('contain', item);
                    });
                });
            });
        });
    });
});