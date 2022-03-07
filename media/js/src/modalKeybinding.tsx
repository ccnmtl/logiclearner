import React from 'react';

export const STATIC_URL = LogicLearner.staticUrl;

export const ModalKeybinding: React.FC = () => {

    return (<>
        <div className='modal fade'
            id='keyBindingModal'
            tabIndex={-1}
            aria-labelledby='keyBindingModalLabel'
            aria-hidden='true'>
            <div
                className='modal-dialog
                    modal-dialog-scrollable modal-dialog-variable'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <h5 className='modal-title'
                            id='keyBindingModalLabel'>
                            How to type logic symbols
                        </h5>
                        <button
                            className='btn-close'
                            data-bs-dismiss='modal'
                            aria-label='Close'></button>
                    </div>
                    <div className='modal-body'>
                        <p>
                            Key binding instructions TBD
                        </p>
                    </div>
                    <div className='modal-footer'>
                        <button className='btn btn-secondary'
                            data-bs-dismiss='modal'>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>);
};