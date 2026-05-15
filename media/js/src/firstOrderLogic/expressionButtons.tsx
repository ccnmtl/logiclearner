/* eslint-disable no-useless-escape */
import React from 'react';

interface ExpressButtonProps {
    items: string[],
    onClick: (char:string) => void,
    title: string
}

export const ExpressButton: React.FC<ExpressButtonProps> = ({
    items, onClick, title
}:ExpressButtonProps) => {
    return <div className="mb-2">
        <span className="me-2 fw-bold">{title}</span>
        <ul id={title} className="list-inline d-inline-block mb-0">
            {items.map((item:string, i:number) =>
                <li key={i} className="list-inline-item mb-1">
                    <button id={item}
                        className="btn btn-outline-secondary btn-sm"
                        aria-label={
                            `Add a ${item} symbol to the statement.`
                        }
                        onClick={() => onClick(item)}
                    >
                        {item}</button>
                </li>
            )}
        </ul>
    </div>;
};