describe('First-Order Logic Match Game', () => {
    const ifCorrect = (action, alternative=()=>{}) => {
        cy.get('#next').then(($body) => {
            if ($body[0].innerText.includes('Skip')) {
                action();
            } else {
                alternative();
            }
        });
    };

    const findAnswer = () => {
        cy.get('#solution>button').each(($btn) => {
            cy.get($btn).click();
            ifCorrect(() => cy.get('#submit').click());
        });
    };

    const failedAttempt = () => {
        cy.get('button.btn-grid-selection').first().click();
        cy.get('#submit').click();
        cy.get('#next').then(($next) => {
            if ($next[0].innerText.includes('Next')) {
                cy.get('#next').click();
                failedAttempt();
            }
        });
    };

    beforeEach(() => {
        cy.visit('http://localhost:8000/fol/match/');
        cy.get('#cu-privacy-notice-button').click();
    });

    it('renders the Grid component', () => {
        cy.get('#grid').should('exist');
    });

    it('renders the Level selection', () => {
        cy.get('select').should('exist');
        ['Easy', 'Medium', 'Hard'].forEach(diff =>
            cy.get('select').contains(diff));
    });

    describe('Buttons', () => {
        it('shows the buttons', () => {
            cy.get('#info').should('exist');
            cy.get('#solution>button').should('have.length', 4);
            cy.get('#submit').should('exist');
            cy.get('#next').should('exist');
        });

        it('opens the modal', () => {
            cy.get('#info').click();
            cy.get('#CloverModal').should('exist');
        });

        describe('Option Behaviors', () => {
            it('tries each option', () => {
                cy.get('#solution>button').each(($btn) => {
                    cy.get($btn).click();
                    cy.get($btn).should('have.class', 'selected');
                    ifCorrect(() => cy.get('#submit').click());
                });
            });

        });
    });

    describe('Check Correct', () => {
        it('shows the correct value', () => {
            findAnswer();
            cy.get('.selection-correct').should('exist');
            cy.get('#solution>button').should('have.class','selection-correct');
        });
    });

    describe('Progress', () => {
        it('renders the component', () => {
            cy.get('.progress-state').should('exist');
        });

        it('shows the updated state', () => {
            for (let i = 0; i < 5; i++) {
                cy.get(`.progress-state__${i}`)
                    .should('exist').and('contain', 0);
            }
            findAnswer();
            cy.get('.progress-state').should('contain', 1);
        });

        describe('Skips', () => {
            const checkSkip = (x) => {
                cy.get('.progress-state__0').should('contain', x);
            };

            beforeEach(() => {
                checkSkip(0);
            });

            it('counts skips on unattempted grid', () => {
                cy.get('#next').click();
                checkSkip(1);
            });

            it('skips with incorrect guess', () => {
                failedAttempt();
                cy.get('#next').click();
                checkSkip(1);
            });

            it('does not skip on correct guess', () => {
                findAnswer();
                cy.get('#next').click();
                checkSkip(0);
            });

            const swapDifficulty = () => {
                cy.get('select').select('medium');
                cy.get('select').select('easy');
            };

            it('does not skip on difficulty change for no attempt', () => {
                swapDifficulty();
                checkSkip(0);
            });

            it('skips on difficulty change for bad attempts', () => {
                failedAttempt();
                swapDifficulty();
                checkSkip(1);
            });

            it('does not skip on difficulty change for successful attempts',
                () => {
                    findAnswer();
                    swapDifficulty();
                    checkSkip(0);
                });
        });
    });
});