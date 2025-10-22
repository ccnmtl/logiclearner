import React, { useEffect } from 'react';
import { GridStatement } from './utils';

interface OptionProps {
    options: GridStatement[]
    correctIndex: number
    isCorrect: boolean
    setIsCorrect: React.Dispatch<React.SetStateAction<boolean>>;
    selected: number|null
    setSelected: React.Dispatch<React.SetStateAction<number|null>>
    handleAttempt: (isCorrect:boolean) => void
}

export const Options: React.FC<OptionProps> = ({
    options, correctIndex, isCorrect, setIsCorrect, selected, setSelected,
    handleAttempt
}:OptionProps) => {
    const showResult = (i:number) => {
        if (selected != null && selected === i)
            if (isCorrect) return 'selection-correct';
            else return 'selection-incorrect';
        else return '';
    };

    useEffect(() => {
        const result = correctIndex === selected;
        setIsCorrect(result);
        if (selected != null) {
            handleAttempt(result);
        }
    }, [selected]);

    return <div className="col-md-6 py-md-0 solution-step">
        <section id="solution">
            <p className="solution-step__prompt py-md-0">
                Select the best matching statement</p>
            {options.map((option, i) =>
                <button key={i} onClick={() => setSelected(i)} className={
                    `btn-grid-selection d-flex ${showResult(i)}`}
                >
                    {selected === i &&
                        <div className="selection-feedback">
                            <div className="selection-feedback-icon">
                                {isCorrect ? '✓' : '!'}
                            </div>
                        </div>}
                    <div className="selection-text flex-grow-1">
                        <div className="selection-label">
                            {option.formalFOLStatement}
                        </div>
                    </div>
                </button>
            )}
        </section>
    </div>;
};