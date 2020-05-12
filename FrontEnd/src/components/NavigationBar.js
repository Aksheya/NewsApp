import React from "react";
import { default as NavBarSwitch } from "react-switch";
import { Switch, Route, Link } from 'react-router-dom';
import Home from './Home';
import Sports from './Sports';
import Politics from './Politics';
import Technology from './Technology';
import World from './World';
import Business from './Business';
import { withRouter } from 'react-router';
import '../styles/navbar.css';
import Search from './Search';
import ReactTooltip from 'react-tooltip'
import { IconContext } from "react-icons";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import Favourites from './Favourites';
import { Navbar, Nav } from 'react-bootstrap';
import DetailedArticle from "./DetailedArticle";
import BingAutoSuggest from "./BingAutoSuggest";
import { NavLink } from 'react-router-dom';

class NavigationBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showSwitch: true,
            switch: true,
            favouriteTab: false,
            activeLink: '/'
        }
    }

    componentDidMount() {
        if (localStorage.getItem('switch') === "false")
            this.setState({
                switch: false
            })
        else this.setState({
            switch: true
        })
        const pathname = this.props.location.pathname;
        if (pathname === "/article" || pathname === '/search' || pathname === '/favourites')
            this.setState({
                showSwitch: false
            })
        else this.setState({
            showSwitch: true
        })
        if (pathname === '/favourites')
            this.setState({
                favouriteTab: true
            })
        else this.setState({
            favouriteTab: false
        })
    }

    handleChange = (checked) => {
        this.setState({ switch: checked });
        localStorage.setItem('switch', checked)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location.pathname !== this.props.location.pathname) {
            const pathname = this.props.location.pathname;
            if (pathname === "/article" || pathname === '/search' || pathname === '/favourites')
                this.setState({
                    showSwitch: false
                })
            else this.setState({
                showSwitch: true
            })
            if (pathname === '/favourites')
                this.setState({
                    favouriteTab: true
                })
            else this.setState({
                favouriteTab: false
            })
        }
    }

    render() {
        return (
            <div className="main">
                    <Navbar bg="dark" expand="lg" variant="dark">
                        <BingAutoSuggest />
                        <Navbar.Toggle aria-controls="basic-navbar-nav" className="ml-auto" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                                <NavLink to="/" className="nav-link-class" style={{ textDecoration: 'none ' }} activeStyle={{ color: '#f2f2f2' }} exact>Home</NavLink>
                                <NavLink to="/World" className="nav-link-class" style={{ textDecoration: 'none ' }} activeStyle={{ color: '#f2f2f2' }} exact>World</NavLink>
                                <NavLink to="/Politics" className="nav-link-class" style={{ textDecoration: 'none ' }} activeStyle={{ color: '#f2f2f2' }} exact>Politics</NavLink>
                                <NavLink to="/Business" className="nav-link-class" style={{ textDecoration: 'none ' }} activeStyle={{ color: '#f2f2f2' }} exact>Business</NavLink>
                                <NavLink to="/Technology" className="nav-link-class" style={{ textDecoration: 'none ' }} activeStyle={{ color: '#f2f2f2' }} exact>Technology</NavLink>
                                <NavLink to="/Sports" className="nav-link-class" style={{ textDecoration: 'none ' }} activeStyle={{ color: '#f2f2f2' }} exact>Sports</NavLink>
                            </Nav>
                            <Nav>
                                <Nav.Link as={Link} to="/favourites" className="navBookmark">
                                    <span data-tip="Bookmark" data-for="favouriteTabOff" onClick={()=>ReactTooltip.hide()}>
                                        <ReactTooltip id="favouriteTabOff" place="bottom" type="dark" effect="solid" className='navToolTip' />
                                       
                                        {!this.state.favouriteTab && 
                                            <IconContext.Provider value={{ color: "#ffffff", className: "bookmark" }}>
                                                <div>
                                                    <FaRegBookmark size={22} />
                                                </div>
                                            </IconContext.Provider>
                                        }
                                        {!!this.state.favouriteTab &&
                                            <IconContext.Provider value={{ color: "#ffffff", className: "bookmark" }}>
                                                <div>
                                                    <FaBookmark size={22} />
                                                </div>
                                            </IconContext.Provider>
                                        }
                                    </span>
                                </Nav.Link>
                            </Nav>
                            {!!this.state.showSwitch &&
                                <Nav>
                                    <Navbar.Text className="NavbarText" style={{ display: "inline-block", color: "white", paddingRight: '10px', fontSize: '20px' }}>NYTimes</Navbar.Text>
                                    <Nav className="navSwitch">
                                        <NavBarSwitch
                                            onChange={(checked) => this.handleChange(checked)}
                                            checked={this.state.switch}
                                            offColor="#DDDDDD"
                                            onColor="#5996E5"
                                            offHandleColor="#ffffff"
                                            onHandleColor="#ffffff"
                                            uncheckedIcon={<div></div>}
                                            checkedIcon={<div></div>} />
                                    </Nav>
                                    <Navbar.Text className="NavbarText" style={{ display: "inline-block", color: "white", paddingRight: '10px', fontSize: '20px' }} color="white">Guardian</Navbar.Text>
                                </Nav>
                            }
                        </Navbar.Collapse>
                    </Navbar>
                    <Switch>
                        <Route exact path="/">
                            <Home switch={this.state.switch} />
                        </Route>
                        <Route path="/World">
                            <World switch={this.state.switch} />
                        </Route>
                        <Route path="/Politics">
                            <Politics switch={this.state.switch} />
                        </Route>
                        <Route path="/Business">
                            <Business switch={this.state.switch} />
                        </Route>
                        <Route path="/Technology">
                            <Technology switch={this.state.switch} />
                        </Route>
                        <Route path="/Sports">
                            <Sports switch={this.state.switch} />
                        </Route>
                    </Switch>
                    <Route path="/article" render={(props) => <DetailedArticle {...props} callParentNavigation={this.setRefToNav} />} />
                    <Route path="/search" render={(props) => <Search {...props} switch={this.state.switch} />} />
                    <Route path="/favourites" render={(props) => <Favourites {...props} />} />
              
            </div>
        );
    }
}

export default withRouter(NavigationBar);