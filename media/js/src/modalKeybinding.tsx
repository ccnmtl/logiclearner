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
                            This is a guide on how to type logic symbols
                            in your statements.
                        </p>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col"
                                        className="text-nowrap pe-3">
                                        Key binding
                                    </th>
                                    <th scope="col"
                                        className="text-nowrap pe-3">
                                        How to type
                                    </th>
                                    <th scope="col"
                                        className="text-nowrap pe-3">
                                        Logic symbol
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>^</td>
                                    <td>The caret symbol, <b>^</b></td>
                                    <td><b>∧</b> (and)</td>
                                </tr>
                                <tr>
                                    <td>v</td>
                                    <td>Lowercase <b>v</b>, as in victory</td>
                                    <td><b>∨</b> (or)</td>
                                </tr>
                                <tr>
                                    <td>~</td>
                                    <td>Tilde symbol, <b>~</b></td>
                                    <td><b>¬</b> (negation; not)</td>
                                </tr>
                                <tr>
                                    <td>-&gt;</td>
                                    <td>Hyphen and greater than symbols, <span
                                        className="text-nowrap">
                                        <b>-&gt;</b>
                                    </span>
                                    </td>
                                    <td>
                                        <b>→</b> (implies; if &hellip; then)
                                    </td>
                                </tr>
                                <tr>
                                    <td>&lt;-&gt;</td>
                                    <td>
                                        less than, hyphen, and greater
                                        than symbols, <span
                                            className="text-nowrap">
                                            <b>&lt;-&gt;</b>
                                        </span>
                                    </td>
                                    <td>
                                        <b>↔</b> (if and only if; iff; means
                                        the same as)
                                    </td>
                                </tr>
                                <tr>
                                    <td>T</td>
                                    <td>Uppercase <b>T</b></td>
                                    <td><b>T</b> (True)</td>
                                </tr>
                                <tr>
                                    <td>F</td>
                                    <td>Uppercase <b>F</b></td>
                                    <td><b>F</b> (False)</td>
                                </tr>
                            </tbody>
                        </table>
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