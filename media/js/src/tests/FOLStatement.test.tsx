import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StatementInput } from '../firstOrderLogic/statementInput';


const naturalLanguageStatement = 'For all circles that are Green, there ' +
    'exists a square with a value less than 5 directly below it.';
const formalFOLStatement = '∀xshape(x,circle)∧color(x,green)→∃yshape(y,' +
    'square)∧value(y)<5∧adjacency(y,below,x)';
const extraParentheses = '∀x((shape(x,circle)∧color(x,green))→∃y(shape(y,' +
    'square)∧value(y)<5∧adjacency(y,below,x)))';
const withSpaces = '∀x shape(x, circle) ∧ color(x, green) → ∃y shape(y, ' +
    'square) ∧ value(y) < 5 ∧ adjacency(y, below, x)';

const checkForAllImpliesExists = 'The statement must begin with ∀x, ' +
    'independent and dependent predicates separated by → , and dependent ' +
    'predicates are preceded by ∃y';

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
let text, setText, isCorrect, setIsCorrect;
beforeEach(() => {
    // Use React.useState to manage text and isCorrect for the component
    const Wrapper = () => {
        [text, setText] = React.useState('');
        [isCorrect, setIsCorrect] = React.useState(false);
        return (
            <StatementInput
                correctStatement={{
                    naturalLanguageStatement: naturalLanguageStatement,
                    formalFOLStatement: formalFOLStatement,
                    details: {
                        color: 'Irrelevant to the current test',
                        number: 0,
                        shape: 'Not needed',
                    }
                }}
                difficulty='hard'
                text={text}
                setText={setText}
            />
        );
    };
    render(<Wrapper />);
});

window.scrollTo = jest.fn();

const checkFeedback = async() => {
    await act(async() => {
        fireEvent.click(screen.getByTestId('submit-button'));
    });
    return screen.findByTestId('feedback');
};

it('Renders the StatementInput component', () => {
    const feedback = screen.queryByTestId('feedback');
    expect(screen.getByTestId('statement-text')).toBeVisible();
    expect(screen.getByTestId('submit-button')).toBeVisible();
    expect(feedback).not.toBeInTheDocument();
});

describe('Feedback on empty input', () => {
    let feedback;
    beforeEach(async() => {
        feedback = await checkFeedback();
    });
    it('Feedback exists', () => expect(feedback).toBeInTheDocument());
    it('Empty input does not show success message', () => expect(
        feedback.textContent).not.toContain('Success!'));
    it('Feedback checks for ∀x, →, ∃y', () => expect(feedback.textContent)
        .toContain(checkForAllImpliesExists));
});

describe('Feedback on a correct input', () => {
    it('Empty response does not display success message', async() =>
        expect((await checkFeedback()).textContent).not.toContain('Success!'));
    it('Correct input displays success message', async() => {
        const textarea = screen.getByTestId('statement-text');
        textarea.textContent = formalFOLStatement;
        const feedback = await checkFeedback();
        expect(feedback.textContent).toContain('Success!');
    });
    it('Success message with extra parentheses', async() => {
        const textarea = screen.getByTestId('statement-text');
        textarea.textContent = extraParentheses;
        const feedback = await checkFeedback();
        expect(feedback.textContent).toContain('Success!');
    });
    it('Success message with spaces', async() => {
        const textarea = screen.getByTestId('statement-text');
        textarea.textContent = withSpaces;
        const feedback = await checkFeedback();
        expect(feedback.textContent).toContain('Success!');
    });
});

describe('General Checks', () => {
    it('Checks for unpaired parenthesis', async() => {
        screen.getByTestId('statement-text').textContent = '∀x(' +
            'shape(x,circle)∧color(x,green))→∃y(shape(y,square)∧value(y)<5∧' +
            'adjacency(y,below,x)))';
        const feedback = await checkFeedback();
        expect(feedback.textContent).not.toContain('Success!');
        expect(feedback.textContent).toContain(
            'There is an unpaired parenthesis.');
    });
    describe('Feedback shows check for ∀x, →, and ∃y', () => {
        it('Missing ∀x', async() => {
            screen.getByTestId('statement-text').textContent =
                'shape(x,circle)∧color(x,green)→∃yshape(y,square)∧' +
                'value(y)<5∧adjacency(y,below,x)';
            const feedback = await checkFeedback();
            expect(feedback.textContent).not.toContain('Success!');
            expect(feedback.textContent).toContain(checkForAllImpliesExists);
        });
        it('Missing →', async() => {
            screen.getByTestId('statement-text').textContent = '∀x' +
                'shape(x,circle)∧color(x,green))∃y(shape(y,square)∧' +
                'value(y)<5∧adjacency(y,below,x)';
            const feedback = await checkFeedback();
            expect(feedback.textContent).not.toContain('Success!');
            expect(feedback.textContent).toContain(checkForAllImpliesExists);
        });
        it('Missing ∃y', async() => {
            screen.getByTestId('statement-text').textContent = '∀x' +
                'shape(x,circle)∧color(x,green)→shape(y,square)∧value(y)<5∧' +
                'adjacency(y,below,x)';
            const feedback = await checkFeedback();
            expect(feedback.textContent).not.toContain('Success!');
            expect(feedback.textContent).toContain(checkForAllImpliesExists);
        });
    });
});

describe('Predicate Checks', () => {
    describe('Missing Predicates', () => {
        it('On the left side', async() => {
            screen.getByTestId('statement-text').textContent = '∀x' +
                '(x,circle)∧color(x,green)→∃y∧value(y)<5∧' +
                'adjacency(y,below,x)';
            const feedback = await checkFeedback();
            expect(feedback.textContent).toContain(
                'Missing shape from the left side of the statement');
        });
        it('On the right side', async() => {
            screen.getByTestId('statement-text').textContent = '∀x' +
                'shape(x,circle)∧color(x,green)→∃yshape(y,square)∧' +
                'adjacency(y,below,x)';
            const feedback = await checkFeedback();
            expect(feedback.textContent).toContain(
                'Missing < from the right side of the statement');
        });
        it('No Predicates', async() => {
            screen.getByTestId('statement-text').textContent = '∀x→∃y';
            const feedback = await checkFeedback();
            expect(feedback.textContent).toContain(
                'Missing shape from the left side of the statement');
            expect(feedback.textContent).toContain(
                'Missing < from the right side of the statement');
        });
    });
    describe('Wrong Variable', () => {
        it('Check for x with y', async() => {
            screen.getByTestId('statement-text').textContent =
                '∀xshape(y,circle)∧color(x,green)→∃yshape(y,' +
                'square)∧value(y)<5∧adjacency(y,below,x)';
            const feedback = await checkFeedback();
            expect(feedback.textContent).toContain(
                'The shape from the left side uses the wrong variable.');
        });
        it('Check for x with r', async() => {
            screen.getByTestId('statement-text').textContent =
                '∀xshape(r,circle)∧color(x,green)→∃yshape(y,' +
                'square)∧value(y)<5∧adjacency(y,below,x)';
            const feedback = await checkFeedback();
            expect(feedback.textContent).toContain(
                'The shape from the left side uses the wrong variable.');
        });
        it('Check for y with x', async() => {
            screen.getByTestId('statement-text').textContent =
                '∀xshape(x,circle)∧color(x,green)→∃yshape(x,' +
                'square)∧value(y)<5∧adjacency(y,below,x)';
            const feedback = await checkFeedback();
            expect(feedback.textContent).toContain(
                'The shape from the right side uses the wrong variable.');
        });
        it('Check for y with r', async() => {
            screen.getByTestId('statement-text').textContent =
                '∀xshape(x,circle)∧color(x,green)→∃yshape(r,' +
                'square)∧value(y)<5∧adjacency(y,below,x)';
            const feedback = await checkFeedback();
            expect(feedback.textContent).toContain(
                'The shape from the right side uses the wrong variable.');
        });
    });
    describe('Bad Values', () => {
        it('Check Color', async() => {
            screen.getByTestId('statement-text').textContent =
                '∀xshape(x,circle)∧color(x,red)→∃yshape(y,' +
                'square)∧value(y)<5∧adjacency(y,below,x)';
            const feedback = await checkFeedback();
            expect(feedback.textContent).toContain(
                'The color from the left side of the statement is incorrect');
        });
        it('Check Shape', async() => {
            screen.getByTestId('statement-text').textContent =
                '∀xshape(x,square)∧color(x,green)→∃yshape(y,' +
                'square)∧value(y)<5∧adjacency(y,below,x)';
            const feedback = await checkFeedback();
            expect(feedback.textContent).toContain(
                'The shape from the left side of the statement is incorrect');
        });
        it('Check Value Comparison', async() => {
            screen.getByTestId('statement-text').textContent =
                '∀xshape(x,circle)∧color(x,green)→∃yshape(y,' +
                'square)∧value(y)<1∧adjacency(y,below,x)';
            const feedback = await checkFeedback();
            expect(feedback.textContent).toContain(
                'The < from the right side of the statement is incorrect');
        });
        it('Check Value Comparison, non-negative', async() => {
            screen.getByTestId('statement-text').textContent =
                '∀xshape(x,circle)∧color(x,green)→∃yshape(y,' +
                'square)∧value(y)<-5∧adjacency(y,below,x)';
            const feedback = await checkFeedback();
            expect(feedback.textContent).toContain(
                'The < from the right side of the statement is incorrect');
        });
        it('Check Adjacency, direction', async() => {
            screen.getByTestId('statement-text').textContent =
                '∀xshape(x,circle)∧color(x,green)→∃yshape(y,' +
                'square)∧value(y)<5∧adjacency(y,above,x)';
            const feedback = await checkFeedback();
            expect(feedback.textContent).toContain('The adjacency from the ' +
                'right side of the statement is incorrect');
        });
        it('Check Adjacency, variables (x,x)', async() => {
            screen.getByTestId('statement-text').textContent =
                '∀xshape(x,circle)∧color(x,green)→∃yshape(y,' +
                'square)∧value(y)<5∧adjacency(x,below,x)';
            const feedback = await checkFeedback();
            expect(feedback.textContent).toContain('The adjacency from the ' +
                'right side uses the wrong variable');
        });
        it('Check Adjacency, variables (y,y)', async() => {
            screen.getByTestId('statement-text').textContent =
                '∀xshape(x,circle)∧color(x,green)→∃yshape(y,' +
                'square)∧value(y)<5∧adjacency(y,below,y)';
            const feedback = await checkFeedback();
            expect(feedback.textContent).toContain('The adjacency from the ' +
                'right side of the statement is incorrect');
        });
    });
});

it('Can hold multiple errors', async() => {
    screen.getByTestId('statement-text').textContent = '∀xshape(x,red)∧' +
        'color(x,blue)→∃yshape(x,square)∧value(y)<5∧adjacency(y,below,x)';
    const feedback = await checkFeedback();
    expect(feedback.textContent).toContain('The shape from the left side of ' +
        'the statement is incorrect');
    expect(feedback.textContent).toContain('The color from the left side of ' +
        'the statement is incorrect');
    expect(feedback.textContent).toContain('The shape from the right side ' +
        'uses the wrong variable.');
});
