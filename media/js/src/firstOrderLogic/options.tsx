import React, { useEffect, useState } from 'react';
import { GridStatement } from './utils';

interface OptionProps {
    options: GridStatement[]
    correctIndex: number
    isCorrect: boolean
    setIsCorrect: Function
    selected: number|null
    setSelected: React.Dispatch<React.SetStateAction<number|null>>
}

export const Options: React.FC<OptionProps> = ({
    options, correctIndex, isCorrect, setIsCorrect, selected, setSelected
}:OptionProps) => {
    const showResult = (i:number) => {
        if (selected != null && selected === i)
            if (isCorrect) return 'success'
            else return 'danger'
        else return 'outline-primary'
    }
    
    useEffect(() => {
        setIsCorrect(correctIndex === selected);
    }, [selected]);

    return <section className='col-4'>
        <div className="row">
            {options.map((option, i) => 
                <div className='my-1' key={i}>
                    <button className={`btn btn-large w-100 my-1 btn-${showResult(i)}`}
                        onClick={() => setSelected(i)}
                    >
                        <p>{option.naturalLanguageStatement}</p>
                        <strong>{option.formalFOLStatement}</strong>
                    </button>
                </div>
            )}
        </div>
    </section>
}