import Modal from 'react-bootstrap/Modal';
import React from 'react';
import '../styles/modal.css';
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton, EmailIcon, EmailShareButton } from 'react-share'
import { Row, Col } from 'react-bootstrap';

const ShareModal = (props) => {
    return (
        <>
            <Modal show={props.show} onHide={() => props.handleClose()}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.type !== undefined && (props.type ? <div className="modalType">GUARDIAN</div> : <div className="modalType">NYTIMES</div>)}{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Share via
                    <Row className="modal-row">
                        <Col>
                            <FacebookShareButton
                                hashtag="#CSCI_571_NewsApp"
                                url={props.shareUrl}
                                quote="CSCI_571_NewsApp"
                            >
                                <FacebookIcon size={45} round />
                            </FacebookShareButton>
                        </Col>
                        <Col>
                            <TwitterShareButton
                                url={props.shareUrl}
                                hashtags={["CSCI_571_NewsApp"]}
                            >
                                <TwitterIcon size={45} round />
                            </TwitterShareButton>
                        </Col>
                        <Col>
                            <EmailShareButton
                                subject="#CSCI_571_NewsApp"
                                body={props.shareUrl}
                            >
                                <EmailIcon size={45} round />
                            </EmailShareButton>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ShareModal;