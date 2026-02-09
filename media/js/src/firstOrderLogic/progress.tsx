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
    return <button className="progress-state d-flex btn"
        data-bs-toggle="modal" data-bs-target="#progressModal"
    >
        {score[difficulty].map((val, i) => {
            return <div className="progress-state d-flex" key={i}>
                <div className={`progress-state__${4-i}`}>
                    <img alt="Go to Questions list for this level"
                        src={`${STATIC_URL}img/icon-clover-${4-i}.svg`} />
                    {val}
                </div>
            </div>;
        })}
        <div className="modal fade" id="progressModal" tabIndex={-1}
            aria-labelledby="progressModal" aria-hidden="true">
            <div className={`modal-dialog modal-dialog-scrollable
                modal-dialog-variable`}
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="progressInfoLabel">
                            Your progress in Level {difficulty}
                        </h5>
                        <button type="button" className="btn-close"
                            data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        Lorem ipsum dolor sit amet, consectetur adipiscing
                        elit, sed do eiusmod tempor incididunt ut labore et
                        dolore magna aliqua. Ut enim ad minim veniam, quis
                        nostrud exercitation ullamco laboris nisi ut aliquip ex
                        ea commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat
                        cupidatat non proident, sunt in culpa qui officia
                        deserunt mollit anim id est laborum.
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary"
                            data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </button>;
};
