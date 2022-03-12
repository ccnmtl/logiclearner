import React from 'react';

export const STATIC_URL = LogicLearner.staticUrl;

export const ModalLawsheet: React.FC = () => {

    return (<>
        <div className='modal fade'
            id='lawSheetModal'
            tabIndex={-1}
            aria-labelledby='lawSheetModalLabel'
            aria-hidden='true'>
            <div
                className='modal-dialog
                    modal-dialog-scrollable modal-dialog-variable'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <h5 className='modal-title'
                            id='lawSheetModalLabel'>
                            Laws of Propositional Logic
                        </h5>
                        <button
                            className='btn-close'
                            data-bs-dismiss='modal'
                            aria-label='Close'></button>
                    </div>
                    <div className='modal-body'>
                        <div className='row'>
                            <section className='col-12 col-md-6 law-definition'>
                                <h5>Absorption laws:</h5>
                                p ∨ (p ∧ q) ≡ p<br />
                                p ∧ (p ∨ q) ≡ p
                            </section>
                            <section className='col-12 col-md-6 law-definition'>
                                <h5>Associativity laws:</h5>
                                ( p ∧ q ) ∧ r ≡ p ∧ ( q ∧ r )<br />
                                ( p ∨ q ) ∨ r ≡ p ∨ ( q ∨ r )
                            </section>
                            <section className='col-12 col-md-6 law-definition'>
                                <h5>Commutativity laws:</h5>
                                p ∧ q ≡ q ∧ p<br />
                                p ∨ q ≡ q ∨ p
                            </section>
                            <section className='col-12 col-md-6 law-definition'>
                                <h5>De Morgan’s laws:</h5>
                                ¬( p ∧ q ) ≡ ¬p ∨ ¬q<br />
                                ¬( p ∨ q ) ≡ ¬p ∧ ¬q
                            </section>
                            <section className='col-12 col-md-6 law-definition'>
                                <h5>Distributive laws:</h5>
                                p ∧ ( q ∨ r ) ≡ ( p ∧ q ) ∨ ( p ∧ r )<br />
                                p ∨ ( q ∧ r ) ≡ ( p ∨ q ) ∧ ( p ∨ r )<br />
                                p ∨ ( q ∨ r ) ≡ ( p ∨ q ) ∨ ( p ∨ r )<br />
                                p ∧ ( q ∧ r ) ≡ ( p ∧ q ) ∧ ( p ∧ r )
                            </section>
                            <section className='col-12 col-md-6 law-definition'>
                                <h5>Domination laws:</h5>
                                p ∨ T ≡ T<br />
                                p ∧ F ≡ F
                            </section>
                            <section className='col-12 col-md-6 law-definition'>
                                <h5>Double negation law:</h5>
                                ¬¬p ≡ p
                            </section>
                            <section className='col-12 col-md-6 law-definition'>
                                <h5>Idempotent laws:</h5>
                                p ∨ p ≡ p<br />
                                p ∧ p ≡ p
                            </section>
                            <section className='col-12 col-md-6 law-definition'>
                                <h5>Identity laws:</h5>
                                p ∧ T ≡ p<br />
                                p ∨ F ≡ p
                            </section>
                            <section className='col-12 col-md-6 law-definition'>
                                <h5>Implication to disjunction law:</h5>
                                p → q ≡ ¬p ∨ q
                            </section>
                            <section className='col-12 col-md-6 law-definition'>
                                <h5>IFF to implication law:</h5>
                                p ↔ q ≡ ( p → q ) ∧ ( q → p )
                            </section>
                            <section className='col-12 col-md-6 law-definition'>
                                <h5>Negation laws:</h5>
                                p ∧ ¬p ≡ F<br />
                                p ∨ ¬p ≡ T
                            </section>
                        </div>
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