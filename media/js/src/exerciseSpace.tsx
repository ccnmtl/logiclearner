import React, { useEffect, useState } from 'react';
import { getStatement, Statement } from './utils';
import { useParams } from 'react-router-dom';
import { Exercise } from './exercise';


export const ExerciseSpace: React.FC = () => {
    const { id } = useParams();
    const [statement, setStatement] = useState<Statement>({
        pk: null,
        question: '',
        answer: '',
        difficulty: null,
        created_at: ''
    });

    async function fetchStatement() {

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const json: Statement = await getStatement(Number(id));
        setStatement(json);
    }



    useEffect(() => {
        {void fetchStatement();}
    }, []);

    return (
        <>
            <Exercise
                statement={statement}
                id={id}/>
        </>
    );
};