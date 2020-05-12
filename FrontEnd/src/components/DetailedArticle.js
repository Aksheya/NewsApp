import React from "react"
import '../styles/home.css'
import axios from 'axios'
import { Container, Row, Col } from 'react-bootstrap';
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton, EmailIcon, EmailShareButton } from 'react-share'
import queryString from 'query-string'
import '../styles/Icons.css'
import '../styles/article.css'
import { IconContext } from "react-icons";
import { FaRegBookmark, FaChevronDown, FaChevronUp, FaBookmark } from "react-icons/fa";
import CommentBox from './CommentBox'
import Loader from './Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactTooltip from 'react-tooltip'
import { Zoom } from 'react-toastify';
import { Element, Link, animateScroll as scroll } from 'react-scroll'

class DetailedArticle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            article: null,
            show: false,
            url: "",
            favourite: false
        }
    }

    componentDidMount() {
        this.fetchArticle();
    }

    closeModal = (title) => toast(title, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: 'black-font',
    });

    scrollToTopOfPage = () => {
        scroll.scrollToTop();

    }

    bookmarkItem = () => {
        if (localStorage.getItem('myNewsApp' + this.state.article.url) === null) {
            var bookmarkArticle = Object.assign({}, this.state.article);
            bookmarkArticle.type = this.props.history.location.state.type;
            if (this.state.article.section === "" || this.state.article.section === undefined)
                bookmarkArticle.section = this.props.history.location.state.section;
            localStorage.setItem('myNewsApp' + this.state.article.url, JSON.stringify(bookmarkArticle));
            this.closeModal('Saving ' + this.state.article.title);
            this.setState({
                favourite: true
            })
        }
        else {
            localStorage.removeItem('myNewsApp' + this.state.article.url);
            this.closeModal('Removing ' + this.state.article.title);
            this.setState({
                favourite: false
            })
        }
    }

    fetchArticle() {
        const type = this.props.history.location.state.type ? 'guardian' : 'ny';
        const url = queryString.parse(this.props.location.search).id
        axios.get('https://react-aks05.appspot.com/' + type + '-detail-article/', {
            params: {
                url: url
            }
        }).then(res => {
            var fav = false;
            if (localStorage.getItem('myNewsApp' + res.data.results.url) === null)
                fav = false;
            else fav = true;
            if (Object.keys(res.data.results).length === 0)
                this.setState({
                    article: {},
                    show: false,
                    favourite: fav,
                });
            else this.setState({
                article: res.data.results,
                show: false,
                favourite: fav,
            });
        }).catch(error => {
            console.log(error)
        })
    }

    callSetState = () => {
        this.setState({
            show: !this.state.show
        })
    }
    showDescription = (down) => {
        if (down === true) {
            this.callSetState();
            return;
        }
        setTimeout(() => {
            this.setState((prevState) => {
                return {
                    show: !prevState.show
                }
            })
        }, 1000)

        if (down === false)
            this.scrollToTopOfPage()
    }

    render() {
        if (this.state.article != null && Object.keys(this.state.article).length !== 0) {
            var datetime = new Date(this.state.article.date);
            const day = String(datetime.getDate()).padStart(2, '0');
            const month = String(datetime.getMonth() + 1).padStart(2, '0'); //January is 0!
            const year = datetime.getFullYear();
            datetime = year + '-' + month + '-' + day;
            const description = this.state.article.description;
            var regex = new RegExp(".{0,}?(?:\\.|!|\\?|[.”]|[.\"]|[.\\'])(?:(?=\\ [A-Z0-9“\"\\'])|$)", "g");
            var descArray = description.match(regex);
            var shortDescription = (descArray.slice(0, 4)).join("");
            var longDescription = ""
            if (descArray.length > 4)
                longDescription = (descArray.slice(4, descArray.length)).join("")
        }
        if (this.state.article !== null && Object.keys(this.state.article).length === 0)
            return (<div>No results</div>)
        return (
            <div>
                {this.state.article == null ? (
                    <Loader />
                ) : (
                        <div>
                            <Container fluid="xl" className="articleContainer">
                                <Row>
                                    <Col className="detailedArticleTitle">
                                        {this.state.article.title}
                                    </Col>
                                </Row>
                                <Row className="rowContent">
                                    <Col xs={5} md={8} sm={5} className="detailedArticleDate" style={{ paddingRight: '0px', fontSize: '19px' }}>
                                        {datetime}
                                    </Col>
                                    <Col md={4} xs={7} sm={7}>
                                        <Row style={{ justifyContent: "flex-end" }}>
                                            <Col lg={1} sm={0} xs={0}></Col>
                                            <Col className="shareCol" lg={7} md={9} sm={5} xs={9} style={{ justifyContent: "center" }}>
                                                <span data-tip="Facebook" data-for="Facebook">
                                                    <FacebookShareButton
                                                        hashtag="#CSCI_571_NewsApp"
                                                        url={this.state.article.shareUrl}
                                                        quote="CSCI_571_NewsApp"
                                                    >
                                                        <FacebookIcon size={31} round />
                                                    </FacebookShareButton>
                                                </span>
                                                <ReactTooltip id="Facebook" place="top" type="dark" effect="solid" className='toolTip' />
                                                <span data-tip="Twitter" data-for="Twitter">
                                                    <TwitterShareButton
                                                        url={this.state.article.shareUrl}
                                                        hashtags={["CSCI_571_NewsApp"]}
                                                    >
                                                        <TwitterIcon size={31} round />
                                                    </TwitterShareButton>
                                                </span>
                                                <ReactTooltip id="Twitter" place="top" type="dark" effect="solid" className='toolTip' />
                                                <span data-tip="Email" data-for="Email">
                                                    <ReactTooltip id="Email" place="top" type="dark" effect="solid" className='toolTip' />
                                                    <EmailShareButton
                                                        subject="#CSCI_571_NewsApp"
                                                        body={this.state.article.shareUrl}
                                                    >
                                                        <EmailIcon size={31} round />
                                                    </EmailShareButton>
                                                </span>
                                            </Col>
                                            <Col lg={2} md={3} sm={2} xs={3} className="styleBookmark">
                                                <span data-tip="Bookmark" data-for="Bookmark" >
                                                    <ToastContainer transition={Zoom} />
                                                    <ReactTooltip id="Bookmark" place="top" type="dark" effect="solid" className='toolTip' />
                                                    {!this.state.favourite &&
                                                        <IconContext.Provider value={{ color: "#CB3142", className: "bookmark" }}>
                                                            <FaRegBookmark onClick={() => this.bookmarkItem()} size={26} />
                                                        </IconContext.Provider>
                                                    }
                                                    {!!this.state.favourite &&
                                                        <IconContext.Provider value={{ color: "#CB3142", className: "bookmark" }}>
                                                            <FaBookmark size={26} onClick={() => this.bookmarkItem()} />
                                                        </IconContext.Provider>
                                                    }
                                                </span>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className="detailedArticleImageRow">
                                    <Col>
                                        <img className="detailedArticleImage" src={this.state.article.image} alt="DetailedArticleImage" />
                                    </Col>
                                </Row>
                                <Row >
                                    <Col>
                                        <span className="detailedArticleShortDescription">{shortDescription}</span>
                                        {!this.state.show && longDescription.length !== 0 &&
                                            <span>..</span>
                                        }
                                        <Element name="test1" className="element">
                                            {!!this.state.show &&
                                                <span className="detailedArticleLongDescription">{longDescription}</span>
                                            }
                                        </Element>
                                    </Col>
                                </Row>
                                {longDescription.length !== 0 &&
                                    <Row className="showButton">
                                        {!this.state.show ?
                                            <Col>
                                                <Link activeClass="active" to="test1" spy={true} smooth={true} offset={50} duration={500}>
                                                    <IconContext.Provider value={{ className: "downArrow" }}>
                                                        <div onClick={() => this.showDescription(true)}>
                                                            <FaChevronDown />
                                                        </div>
                                                    </IconContext.Provider>
                                                </Link>
                                            </Col>
                                            :
                                            <Col>
                                                <IconContext.Provider value={{ className: "upArrow" }} >
                                                    <div onClick={() => this.showDescription(false)}>
                                                        <FaChevronUp />
                                                    </div>
                                                </IconContext.Provider>
                                            </Col>
                                        }
                                    </Row>
                                }
                            </Container>
                            <Container fluid="xl" className="commentboxContainer">
                                <Row>
                                    {
                                        <CommentBox articleId={this.state.article.url} />
                                    }
                                </Row>
                            </Container>
                        </div>
                    )}
            </div>
        );
    }
}

export default DetailedArticle;



