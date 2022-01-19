import React, { useState, useEffect } from 'react';

interface QuestionsDashboardProps {
    difficulty: number;
    level: string
}

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

    useEffect(() => {
        async function fetchStatements() {
            const response = await fetch(`/api/statements/${difficulty}/`);
            if (response.status !== 200) {
                throw new Error(`GET request failed: ${response.statusText}`);
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const json: Array<Statement> = await response.json();

            setStatements(json);
        }
        void fetchStatements();
    }, []);

    const questionList= statements.map((statement, index) =>
        <div className="p-3 mb-2 bg-light w-50 text-dark" key={statement.pk}>
            <span className="h2">{index + 1} </span> {statement.question}
        </div>
    );
    return (
        <div className="d-flex flex-column min-vh-100 justify-content-center
                        align-items-center">
            <p>Level {difficulty + 1}</p>
            <p className='h2'>{level}</p>
            <p>One sentence description here</p>

            {questionList}
        </div>
    );
};
