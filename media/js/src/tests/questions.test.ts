import { getStatements, getStatement, getSolutions } from '../utils';
import questionsData from '../questions.json';

describe('getStatements', () => {
    it('returns the question count for each difficulty', () => {
        expect(getStatements(0).length).toBe(18);
        expect(getStatements(1).length).toBe(9);
        expect(getStatements(2).length).toBe(6);
    });
    it('returns statements ordered by pk', () => {
        for (let difficulty = 0; difficulty < 3; difficulty++) {
            const pks = getStatements(difficulty).map((s) => s.pk);
            expect(pks).toEqual([...pks].sort((a, b) => a - b));
        }
    });
});

describe('getStatement', () => {
    it('finds a statement by pk', () => {
        const statement = getStatement(16);
        expect(statement.question).toBe('~(~p)');
        expect(statement.answer).toBe('p');
        expect(statement.difficulty).toBe(0);
    });
    it('throws on an unknown pk', () => {
        expect(() => getStatement(999)).toThrow();
    });
});

describe('getSolutions', () => {
    it('maps solution steps to the Solution shape', () => {
        const solutions = getSolutions(16);
        expect(solutions.length).toBe(2);
        expect(solutions[0]).toMatchObject(
            {statement: 16, ordinal: 0, text: '~(~p)', law: 'Start'});
        expect(solutions[1]).toMatchObject(
            {statement: 16, ordinal: 1, text: 'p', law: 'Double Negation'});
    });
    it('throws on an unknown pk', () => {
        expect(() => getSolutions(999)).toThrow();
    });
});

describe('questions.json data integrity', () => {
    it.each(questionsData.questions.map(
        (q) => [q.pk, q]
    ))('question %i starts at the premise and ends at the target',
        (pk, question) => {
            const solution = question.solution;
            expect(solution[0].rule).toBe('Start');
            expect(solution[0].statement).toBe(question.premise);
            expect(solution[solution.length - 1].statement)
                .toBe(question.target);
        });
    it('has unique pks', () => {
        const pks = questionsData.questions.map((q) => q.pk);
        expect(new Set(pks).size).toBe(pks.length);
    });
});
