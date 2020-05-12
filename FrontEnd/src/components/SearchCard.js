import React from 'react';
import { withRouter } from 'react-router-dom';
import { MdShare } from 'react-icons/md';
import ShareModal from "./ShareModal";
import '../styles/searchCard.css'
import { Row, Col } from 'react-bootstrap';

class SearchCard extends React.Component {
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
        var datetime = new Date(this.props.article.date);
        const day = String(datetime.getDate()).padStart(2, '0');
        const month = String(datetime.getMonth() + 1).padStart(2, '0');
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
        };
        return (
            <>
                <Col className="searchCard" onClick={() => this.handleClick(article.url)}>
                    <Row>
                        <Col className="searchText">
                            <p className="searchTitle">{article.title}
                                <span onClick={(e) => this.share(e)}><MdShare /></span>
                            </p>
                        </Col>
                    </Row>
                    <Row style={{ textAlign: 'center' }}>
                        <Col md={12} style={{ padding: '10px' }}>
                            <img className="searchImage" src={article.image} alt="News" />
                        </Col>
                    </Row>
                    <Row style={{ padding: '2px 0px 10px 0px' }}>
                        <Col md={6} sm={6} xs={6} style={{ marginTop: '-2px' }}>
                            <span className="searchDate">{datetime}</span>
                        </Col>
                        <Col md={6} sm={6} xs={6}>
                            <span className="searchSection" style={myStyle}>{section}</span>
                        </Col>
                    </Row>
                </Col>
                {!!this.state.showModal &&
                    <ShareModal show={this.state.showModal} handleClose={() => this.closeModal()} title={article.title} shareUrl={article.shareUrl} />
                }
            </>
        )
    }
}

export default withRouter(SearchCard)