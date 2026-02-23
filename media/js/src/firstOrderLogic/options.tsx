import React, { useEffect } from 'react';
import { GridStatement } from './utils';

interface OptionProps {
    options: GridStatement[]
    correctIndex: number
    showList: boolean[]
    setShowList: React.Dispatch<React.SetStateAction<boolean[]>>
    handleAttempt: (isCorrect:boolean) => void
    handleNewGrid: () => void
    selected: number
    setSelected: React.Dispatch<React.SetStateAction<number>>
}

export const Options: React.FC<OptionProps> = ({
    options, correctIndex, showList, setShowList,
    handleAttempt, handleNewGrid , selected, setSelected
}:OptionProps) => {
    const showResult = (i:number) => {
        if (showList[i])
            if (i === correctIndex) return 'selection-correct';
            else return 'selection-incorrect';
        else if (selected === i) {
            return 'selected';
        }
        else return '';
    };

    const handleSubmit = () => {
        if (selected !== -1) {
            setShowList(showList.map((val, i) => i === selected ? true : val));
        }
    };

    const mkFeedback = (content:string) => {
        return <div className="selection-feedback">
            <div className="selection-feedback-icon">
                {content}
            </div>
        </div>;
    };

    useEffect(() => {
        if (showList.includes(true)) {
            handleAttempt(showList[correctIndex]);
            setSelected(-1);
        }
    }, [showList]);

    return <div className="col-md-6 py-md-0 solution-step">
        <section id="solution">
            <p className="solution-step__prompt py-md-0">
                Select the best matching statement</p>
            {options.map((option, i) =>
                <button key={i} onClick={() => setSelected(i)}
                    className={`btn-grid-selection d-flex ${showResult(i)}`}
                    disabled={showList[i]}
                >
                    {showList[i] && mkFeedback(i === correctIndex ? '✓' : '!')}
                    <div className="selection-text flex-grow-1">
                        {showList[i] &&
                            <div className="selection-answer pb-2">
                                {option.naturalLanguageStatement}
                            </div>}
                        <div className="selection-label">
                            {option.formalFOLStatement}
                        </div>
                    </div>
                </button>
            )}
        </section>
        <button className='btn btn-success w-25 d-block ms-auto mb-4 mb-md-0'
            onClick={handleSubmit}>Go!</button>
        <div className="grid-actions">
            <button className="btn btn-outline-primary" onClick={handleNewGrid}>
                {showList[correctIndex] ? 'Next': 'Skip this'} grid »</button>
        </div>
    </div>;
};