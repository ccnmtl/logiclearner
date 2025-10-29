import React from 'react';
import { GridItem, getColorName } from './utils';

interface GridProps {
    grid: GridItem[],
    size: number,
    handleNewGrid: () => void
}

export const Grid: React.FC<GridProps> = (
    {grid, size, handleNewGrid}:GridProps
) => {
    const chunks = (arr:GridItem[], n:number) => {
        const result = [];
        const limit = Math.min(arr.length, n);
        for (let i=0; i < arr.length; i = i + limit) {
            result.push(arr.slice(i, i+limit));
        }
        return result;
    };

    const createShape = (shape:string, color:string) => {
        if (shape === 'circle') {
            return <circle x={0} y={0} cx={60} cy={60} r={50} fill={color} />;
        } else if (shape === 'square') {
            return <rect x={10} y={10} width={100} height={100} fill={color} />;
        } else if (shape === 'triangle') {
            return <polygon points='60,10 110,110 10,110' fill={color} />;
        }
    };

    const placeText = (number:number) => {
        // Place a number in the center
        return (
            <text
                x='50%'
                y='55%'
                dominantBaseline='middle'
                textAnchor='middle'
                fill='white'
                fontSize='3em'
                fontWeight={700}
            >
                {number}
            </text>
        );
    };

    return <section id="grid" className="container grid-container">
        <svg viewBox='0 0 150 160' width='100%'>
            <rect x={3} y={1} fill='#eceff1'  width={150} height={158}/>
            {chunks(grid, size).map((row, i) =>
                row.map((item, j) =>
                    <svg x={30*j} y={32*i} width={30} height={32} key={i*10+j}
                        viewBox='0 0 100 120'>
                        <rect x={4} y={4} width={104} height={112}
                            fill='#ffffff'>
                        </rect>
                        <svg x={15} y={-10} width={80} height={120}
                            viewBox='0 0 120 120' >
                            {createShape(item.shape, item.color)}
                            {placeText(item.number)}
                        </svg>
                        <text x={55} y='100' dominantBaseline='middle'
                            textAnchor='middle' fill={item.color}
                            fontSize='1.2rem' fontWeight={600}
                            className='grid-color-label'
                        >
                            {getColorName(item.color).toLowerCase()}</text>
                    </svg>
                )
            )}
        </svg>
        <button className='btn btn-primary mt-2'
            onClick={handleNewGrid}>Next Grid</button>
    </section>;
};