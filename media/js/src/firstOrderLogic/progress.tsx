import React, { useEffect, useState } from 'react';
import { Score, dTitle } from './utils';
import { STATIC_URL } from './firstOrderLogic';

interface ProgressProps {
    difficulty: string
    score: Score
    rounds: Score
}

const mkClover = (i:number, alt:string) =>
    <img alt={alt}
        src={`${STATIC_URL}img/icon-clover-${4-i}.svg`} />;

const rank = ['first', 'second', 'third', 'fourth', 'skipped'];
const rankKey = Array.from(rank, (place, i) => i === 4 ? 'Skipped' :
    `Correct on ${place} attempt`);
const rankKeyHTML = Array.from(rank, (place, i) => i === 4 ?
    <strong>{place}</strong> :
    <>correct on <strong>{place}</strong> attempt</>);


export const Progress: React.FC<ProgressProps> = ({
    difficulty, score, rounds
}:ProgressProps) => {
    const emptyStatus = <p>You haven't started the game yet. Once you've played
        a few rounds, come back here to see a breakdown of your progress.</p>;
    const [rStatus, setRStatus] = useState(emptyStatus);

    useEffect(() => {
        const diff = rounds[difficulty];
        const len = diff.length;
        if (len > 0) {
            const status = <p>You have played <strong>{len} round
                {len === 1 ? '' : 's'}</strong>.</p>;
            const progress = <p>{len > 2 &&
                diff.slice(0, 3).every(x => x === 4) ?
                'Excellent work! You\'ve mastered this level, so ' +
                    'go ahead and challenge yourself with the next one!'
                :
                'Keep playing a few more rounds to learn and ' +
                    'understand the patterns. Practice will help you get ' +
                    'better each time.'}</p>;
            setRStatus(<>{status} {progress}</>);
        } else {
            setRStatus(emptyStatus);
        }
    }, [rounds, difficulty]);

    return <div className="progress-state d-flex">
        {score[difficulty].map((val, i) => {
            return <div className="progress-state d-flex" key={i}>
                <div className={`progress-state__${4-i}`}>
                    {mkClover(i, 'Go to Questions list for this level')}
                    {val}
                </div>
            </div>;
        })}
        <div className="btn p-0 progress-state d-flex" data-bs-toggle="modal"
            data-bs-target="#CloverModal"
        >
            <div className="progress-state__i">
                <img alt="Go to Questions list for this level"
                    src={`${STATIC_URL}img/icon-clover-i.svg`} />
            </div>
        </div>
        <div className="modal fade" id="CloverModal" tabIndex={-1}
            aria-labelledby="CloverModal" aria-hidden="true">
            <div className={`modal-dialog modal-dialog-scrollable
                modal-dialog-variable`}
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="progressInfoLabel">
                            Your progress in Level {dTitle[difficulty]}
                        </h5>
                        <button type="button" className="btn-close"
                            data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <h4>Key</h4>
                        <table className="table table-borderless">
                            <tbody>
                                {rankKey.map((alt, i) => {
                                    const round = score[difficulty][i];
                                    return <tr key={i}>
                                        <td className="progress-state__key">
                                            {mkClover(i, alt)}
                                        </td>
                                        <td>
                                            {round} round
                                            {round === 1 ? ' ' : 's '}
                                            {rankKeyHTML[i]}
                                        </td>
                                    </tr>;
                                })}
                            </tbody>
                        </table>
                        <hr />
                        <h4>Your progress breakdown</h4>
                        <div className="mt-3">
                            {rStatus}
                        </div>
                        <div className="d-flex flex-wrap">
                            {rounds[difficulty].map((round, i) => {
                                const len = rounds[difficulty].length;
                                return <div key={i}
                                    className="progress-state__key mx-1"
                                >
                                    {mkClover(4 - round, rankKey[round])}
                                    R{len - i}
                                </div>;
                            })}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary"
                            data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>;
};
