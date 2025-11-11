import React, { useEffect } from 'react';
import { GridStatement } from './utils';

interface OptionProps {
    options: GridStatement[]
    correctIndex: number
    selected: boolean[]
    setSelected: React.Dispatch<React.SetStateAction<boolean[]>>
    handleAttempt: (isCorrect:boolean) => void
}

export const Options: React.FC<OptionProps> = ({
    options, correctIndex, selected, setSelected,
    handleAttempt
}:OptionProps) => {
    const showResult = (i:number) => {
        if (selected[i])
            if (i === correctIndex) return 'selection-correct';
            else return 'selection-incorrect';
        else return '';
    };

    const handleSelect = (i:number) => {
        setSelected(selected.map((val, idx) => i === idx ? true: val));
    };

    useEffect(() => {
        if (selected.includes(true)) {
            handleAttempt(selected[correctIndex]);
        }
    }, [selected]);

    return <div className="col-md-6 py-md-0 solution-step">
        <section id="solution">
            <p className="solution-step__prompt py-md-0">
                Select the best matching statement</p>
            {options.map((option, i) =>
                <button key={i} onClick={() => handleSelect(i)}
                    className={`btn-grid-selection d-flex ${showResult(i)}`}
                >
                    {selected[i] &&
                        <div className="selection-feedback">
                            <div className="selection-feedback-icon">
                                {i === correctIndex ? '✓' : '!'}
                            </div>
                        </div>}
                    <div className="selection-text flex-grow-1">
                        {selected[i] &&
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
    </div>;
};