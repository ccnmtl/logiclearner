import React, { useState, useEffect } from 'react';
import { getStatements, Statement } from './utils';
import { Question } from './question';

interface QuestionsDashboardProps {
    difficulty: number;
    level: string;
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

    return (
        <>
            <div className="d-flex flex-column min-vh-100 justify-content-center
                            align-items-center">
                <p>Level {difficulty + 1}</p>
                <p className='h2'>{level}</p>
                <p>One sentence description here</p>

                {statements.map((statement, idx) => {
                    return (<Question
                        statement={statement}
                        listNum={idx}
                        id={statement.pk}
                        idStr={statement.pk.toString()}
                        key={idx}
                        level={level} />);
                })}
            </div>
        </>
    );
};