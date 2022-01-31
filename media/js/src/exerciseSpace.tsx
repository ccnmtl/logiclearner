import React from 'react';
import { Nav } from './nav';
import { Footer } from './footer';

interface ExerciseSpaceProps {
    difficulty: number;
    level: string;
    question: string;
}

const laws: Array<string> = ['identity', 'negation', 'domination',
    'idempotence', 'commutativity', 'associativity', 'absorption', 'demorgan"s',
    'literal negation', 'distributivity', 'double negation',
    'implication to disjunction', 'iff to implication'];

export const ExerciseSpace: React.FC<ExerciseSpaceProps> = (
    {difficulty, level, question}: ExerciseSpaceProps) => {

    // useEffect(() => {

    // }, []);

    return (
        <>
            <Nav />
            <form>
                <div className='form-group'>
                    <label htmlFor='statementInput'>Statement</label>
                    <input type='text' className='form-control'
                        id='statementInput' aria-describedby='statement'
                        placeholder='Wizard like instructions' />
                </div>
                <select name='laws' id='laws'>
                    {laws.map((law, index) => {
                        return (
                            <option key={index} value={law}>{law}</option>
                        );
                    })}
                </select>
                <button type='submit' className='btn btn-primary'>Go</button>
            </form>
            <Footer />
        </>
    );
};
