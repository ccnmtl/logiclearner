import React from 'react';
import { Score } from './utils';

interface ProgressProps {
    difficulty: string
    score: Score,
}

export const Progress: React.FC<ProgressProps> = ({
    difficulty,
    score
}:ProgressProps) => {
    /**
     * EVAN'S NOTE: This was made for my own convenience I imagine you might
     * want to be more explicit with your expression of the progress shapes.
     * @returns An array of SVG text elements corresponding to the different
     * progress states
     */
    // const mkArr = (
    //     length: number, sign: 1 | -1
    // ) => Array.from({ length }, (_, i) =>
    //     <text color="black" x='50%' y='55%' dominantBaseline='middle'
    //         textAnchor='middle' fontSize={10}
    //     >
    //         {sign * (i+1)}
    //     </text>
    // );
    // const success = mkArr(4, 1);
    // const skip = mkArr(4, -1);

    return <svg
        viewBox={`0 0 120 ${10 * Math.ceil(score[difficulty].length/12)}`}
        width={'100%'}
    >
        {// UNCOMMENT WHEN YOU ARE READY TO WORK ON THE PROGRESS DISPLAY
        /* {score[difficulty].map((val, i) => <svg x={10 * (i % 12)}
            y={10 * Math.floor(i/12)} width={10} height={10} key={i}
        >
            {val > 0 ? success[val-1]: skip[-val-1]}
        </svg>
        )} */}
    </svg>;
};
