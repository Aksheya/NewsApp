import React from "react";
import '../styles/card.css';
import { Container, Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { MdShare } from 'react-icons/md';
import ShareModal from "./ShareModal";
import Truncate from 'react-truncate';


class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        }
    }

    getSection = (section) => {
        switch (section.toLowerCase()) {
            case 'sport':
                return ['SPORT', 'black', '#ffcc00'];
            case 'sports':
                return ['SPORTS', 'black', '#ffcc00'];
            case 'business':
                return ['BUSINESS', 'white', '#5996E5'];
            case 'politics':
                return ['POLITICS', 'white', '#579288'];
            case 'world':
                return ['WORLD', 'white', '#7457F6'];
            case 'technology':
                return ['TECHNOLOGY', 'black', '#D1DA59'];
            default:
                return [section.toUpperCase(), 'white', '#6F757B'];
        }
    }

    handleClick = (url) => {
        this.props.history.push({
            pathname: '/article',
            search: '?id=' + url,
            state: { type: this.props.switch, section: this.props.article.section }
        })
    }

    share = (e) => {
        e.stopPropagation();
        this.setState({
            showModal: true
        })
    }

    closeModal = () => {
        this.setState({
            showModal: false
        })
    }

    render() {
        const article = this.props.article;
        var datetime = new Date(article.date);
        const day = String(datetime.getDate()).padStart(2, '0');
        const month = String(datetime.getMonth() + 1).padStart(2, '0'); //January is 0!
        const year = datetime.getFullYear();
        datetime = year + '-' + month + '-' + day;
        var articleSection = article.section;
        if(articleSection === undefined || articleSection === "")
            articleSection = "UNDEFINED";
        const values = this.getSection(articleSection);
        const section = values[0];
        const myStyle = {
            color: values[1],
            backgroundColor: values[2],
            borderRadius: '3px',
            fontWeight: 600,
            padding: '1px 5px',
        }
        return (
            <>
                <Container fluid="xl" className="fluidContainer" onClick={() => this.handleClick(article.url)}>
                    <Row className="articleCard">
                        <Col lg={3} md={12} >
                            <img className="articleImage" src={article.image} alt="News" />
                        </Col>
                        <Col className="articleText" lg={9} md={12}>
                            <p className="articleTitle">{article.title}
                                <span onClick={(e) => this.share(e)}><MdShare /></span>
                            </p>
                            <p>
                                <Truncate lines={3} ellipsis={<span>...</span>}>
                                    {article.description}
                                </Truncate>
                            </p>
                            <span className="articleDate">{datetime}</span>
                            <span className="articleSection" style={myStyle}>{section}</span>
                        </Col>
                    </Row>
                </Container>
                <Container>
                    {!!this.state.showModal &&
                        <ShareModal show={this.state.showModal} handleClose={() => this.closeModal()} title={article.title} shareUrl={article.shareUrl} />
                    }
                </Container>
            </>
        );
    }
}

export default withRouter(Card);



