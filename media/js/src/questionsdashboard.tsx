import React, { useState, useEffect } from 'react';
import {getStatements} from './utils';
import { Nav } from './nav';
import { Footer } from './footer';
import { Question } from './question';

interface QuestionsDashboardProps {
    difficulty: number;
    level: string;
}

// also involed here would be questionProgress: boolean;
// questionComplete: boolean;
type Statement = {
    pk: number;
    question: string;
    answer: string;
    difficulty: number;
    created_at: string;
}

export const QuestionsDashboard: React.FC<QuestionsDashboardProps> = (
    {difficulty, level}: QuestionsDashboardProps) => {

    const [statements, setStatements] = useState<Statement[]>([]);

    async function fetchStatements() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const json: Array<Statement> = await getStatements(difficulty);
        setStatements(json);
    }

    useEffect(() => {
        void fetchStatements();
    }, []);

    const questionList= statements.map((statement, idx) => {
        return (<Question
            statement={statement}
            idx={idx}
            key={statement.pk} />);
    });
    return (
        <>
            <Nav />
            <div className="d-flex flex-column min-vh-100 justify-content-center
                            align-items-center">
                <p>Level {difficulty + 1}</p>
                <p className='h2'>{level}</p>
                <p>One sentence description here</p>

                {questionList}
            </div>
            <Footer />
        </>
    );
};
