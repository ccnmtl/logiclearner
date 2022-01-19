import React from 'react';

export const LevelsDashboard: React.FC = () => {

    return (
        <>
            <div className="d-flex flex-column min-vh-100 justify-content-center
                            align-items-center">
                <div className="card" style={{width: '20rem', height: '10rem'}}>
                    <div className="card-body">
                        <div className="text-center">
                            <p className="card-text">LEVEL I:</p>
                            <p>NOVICE</p>
                            <span className="float-end">1/10</span>
                            <div><a className={'btn btn-primary'}
                                href={'/questions/0'}>Level I</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card" style={{width: '20rem', height: '10rem'}}>
                    <div className="card-body">
                        <div className="text-center">
                            <p className="card-text">LEVEL II:</p>
                            <p>LEARNER</p>
                            <span className="float-end">10/10</span>
                            <div><a className={'btn btn-primary'}
                                href={'/questions/1'}>Level II</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card" style={{width: '20rem', height: '10rem'}}>
                    <div className="card-body">
                        <div className="text-center">
                            <p className="card-text">LEVEL III:</p>
                            <p>APPRENTICE</p>
                            <span className="float-end">2/10</span>
                            <div><a className={'btn btn-primary'}
                                href={'/questions/2'}>Level III</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
