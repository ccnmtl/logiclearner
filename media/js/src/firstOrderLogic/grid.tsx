import React, { useState } from 'react';
import { GridItem } from './utils';

interface GridProps {
    grid: GridItem[],
    size: number
}

export const Grid: React.FC<GridProps> = ({grid, size}:GridProps) => {
    const chunks = (arr:GridItem[], n:number) => {
        const result = [];
        const limit = Math.min(arr.length, n);
        for (let i=0; i < arr.length; i = i + limit) {
            result.push(arr.slice(i, i+limit))
        }
        return result;
    }

    const createShape = (shape:string, color:string) => {
        if (shape === 'circle') {
            return <circle x={0} y={0} cx={60} cy={60} r={50} fill={color} />
        } else if (shape === 'square') {
            return <rect x={10} y={10} width={100} height={100} fill={color} />
        } else if (shape === 'triangle') {
            return <polygon points='60,10 110,110 10,110' fill={color} />
        }
    }

    const placeText = (number:number) => {
        // Place a number in the center
        return <text x='50%' y='55%' dominantBaseline='middle' textAnchor='middle'
            fill='white' fontSize='3em' fontWeight={700}>{number}</text>;
    }
    
    return <section id='grid' className='col-6 d-flex justify-content-center w-100'>
            <svg viewBox='0 0 120 120' width='100%'>
                {chunks(grid, size).map((row, i) =>
                    row.map((item, j) =>
                        <svg x={24*j} y={24*i} width={24} height={24} key={i*10+j}
                            viewBox='0 0 120 120'>
                            {createShape(item.shape, item.color)}
                            {placeText(item.number)}
                        </svg>
                    )
                )}
            </svg>
        </section>
}