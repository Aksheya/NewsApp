import React from 'react';
import { MdShare, MdDelete } from 'react-icons/md';
import { withRouter } from 'react-router-dom';
import ShareModal from "./ShareModal";
import '../styles/favArticle.css'
import { Row, Col } from 'react-bootstrap';

class FavArticle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            article: this.props.article.value
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
            state: { type: this.state.article.type }
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


    delete = (e) => {
        e.stopPropagation();
        localStorage.removeItem(this.props.article.key)
        const title = this.state.article.title;
        this.setState({
            article: null
        })
        this.props.getParent(this.props.index, title);
    }

    render() {
        const article = this.state.article;
        var section;
        var myStyle;
        var typeStyle;
        var type;
        if (article !== null) {
            var datetime = new Date(article.date);
            const day = String(datetime.getDate()).padStart(2, '0');
            const month = String(datetime.getMonth() + 1).padStart(2, '0'); //January is 0!
            const year = datetime.getFullYear();
            datetime = year + '-' + month + '-' + day;
            var articleSection = article.section;
            if(articleSection === undefined || articleSection === "")
                articleSection = "UNDEFINED";
            const values = this.getSection(articleSection);
            section = values[0];
            myStyle = {
                color: values[1],
                backgroundColor: values[2],
                fontSize: '12px'
            };
            typeStyle = {
                backgroundColor: article.type ? '#182848' : '#DDDDDD',
                color: article.type ? '#ffffff' : '#00000',
                fontSize: '12px'
            }
            type = article.type ? 'GUARDIAN' : 'NYTIMES';
        }
        return (
            <>
                {article !== null ?
                    <>
                        <Col className="favArticleCard" onClick={() => this.handleClick(article.url)}>
                            <Row>
                                <Col className="favArticleText">
                                    <p className="favArticleTitle">{article.title}
                                        <span onClick={(e) => this.share(e)}><MdShare /></span>
                                        <span onClick={(e) => this.delete(e)}><MdDelete /></span>
                                    </p>

                                </Col>
                            </Row>
                            <Row style={{ textAlign: 'center' }}>
                                <Col lg={12} style={{ padding: '10px' }}>
                                    <img className="favArticleImage" src={article.image} alt="News" />
                                </Col>
                            </Row>
                            <Row style={{ padding: '10px 5px' }}>
                                <Col lg={5} md={7} sm={6} xs={6} style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                                    <span className="favArticleDate" style={{fontSize:'15px'}}>{datetime}</span>
                                </Col>
                                {/* <Col  lg={0} md={2}  sm={0} xs={0} style={{ paddingLeft: '0px', paddingRight: '0px' }}></Col> */}
                                <Col lg={3} md={3} sm={3} xs={3} style={{ paddingLeft: '0px', paddingRight: '0px', margin: 'auto',display: 'flex', justifyContent: 'flex-end', alignItems: 'end'}}>
                                    <span className="favArticleSection" style={myStyle}>{section}</span>
                                </Col >
                                <Col lg={3} md={1} sm={3} xs={3} style={{ paddingLeft: '4px', paddingRight: '0px', margin: 'auto',display: 'flex',justifyContent: 'flex-end', alignItems: 'end' }}>
                                    <span className="favArticleType" style={typeStyle} >{type}</span>
                                </Col>
                            </Row>
                        </Col>
                        {!!this.state.showModal &&
                            <ShareModal type={this.state.article.type} show={this.state.showModal} handleClose={() => this.closeModal()} title={article.title} shareUrl={article.shareUrl} />
                        }
                    </> :
                    <>
                    </>
                }
            </>
        );
    }
}

export default withRouter(FavArticle);

