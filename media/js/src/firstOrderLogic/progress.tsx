import React from 'react';
import { Score } from './utils';
import { STATIC_URL } from './firstOrderLogic';

interface ProgressProps {
    difficulty: string
    score: Score,
}

export const Progress: React.FC<ProgressProps> = ({
    difficulty,
    score
}:ProgressProps) => {
    return <div className="progress-state d-flex">
        {score[difficulty].map((val, i) => {
            return <div className="progress-state d-flex" key={i}>
                <div className={`progress-state__${4-i}`}>
                    <img alt="Go to Questions list for this level"
                        src={`${STATIC_URL}img/icon-clover-${4-i}.svg`} />
                    {val}
                </div>
            </div>;
        })}
    </div>;
};
