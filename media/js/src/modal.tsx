import React, { useEffect } from 'react';

interface ModalProps {
    title: string;
    bodyText: string;
    cancelText: string;
    cancelFunc(): void;
}

export const Modal: React.FC<ModalProps> = ({
    title, bodyText, cancelText, cancelFunc
}: ModalProps) => {
    useEffect(() => {
        const body = document.getElementsByTagName('body')[0];
        body.classList.add('modal-open');

        // Close modal on esc
        const closeOnEsc = (evt: KeyboardEvent): void => {
            if (evt.code == 'Escape') {
                cancelFunc();
            }
        };
        window.addEventListener('keyup', closeOnEsc);
        return () => {
            const bdy = document.getElementsByTagName('body')[0];
            bdy.classList.remove('modal-open');
            // Remove Esc key handler
            window.removeEventListener('keyup', closeOnEsc);
        };
    }, []);

    const cancelHandler = (
        evt: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
        evt.preventDefault();
        cancelFunc();
    };

    return (
        <div className="modal fade show"
            id="exampleModal"
            tabIndex={-1}
            aria-labelledby="modal-label"
            aria-hidden="false"
            onClick={cancelHandler}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modal-label">
                            {title}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={cancelHandler}/>
                    </div>
                    <div className="modal-body">
                        {bodyText}
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={cancelHandler}>{cancelText}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
