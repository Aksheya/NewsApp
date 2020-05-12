import React from 'react';
import queryString from 'query-string';
import axios from 'axios'
import SearchCard from './SearchCard';
import { Col } from 'react-bootstrap';
import '../styles/search.css';
import Loader from './Loader';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            guardianArticles: null,
            nyArticles: null
        }
    }

    componentDidMount() {
        this.fetchArticles();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.type !== this.props.type || prevProps.location.search !== this.props.location.search) {
            this.fetchArticles();
        }
    }

    fetchArticles() {
        const keyword = queryString.parse(this.props.location.search).q
        axios.get('https://react-aks05.appspot.com/guardian-search/', {
            params: {
                keyword: keyword
            }
        }).then(res => {
            this.setState({
                guardianArticles: res.data.results,
            });
        })
            .catch(error => {
                console.log(error)
            })
        axios.get('https://react-aks05.appspot.com/ny-search/', {
            params: {
                keyword: keyword
            }
        }).then(res => {
            this.setState({
                nyArticles: res.data.results,
            });
        })
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        var guardianArticles = this.state.guardianArticles;
        var nyArticles = this.state.nyArticles
        if (guardianArticles !== null && nyArticles !== null) {
            if (guardianArticles.length === 0 && this.state.nyArticles.length === 0)
                return (
                    <div className="resultsName">No results</div>
                )
            guardianArticles = guardianArticles.slice(0, 5);
            nyArticles = nyArticles.slice(0, 5)
            return (
                <div>
                    <p className="results">Results</p>
                    <ul>
                        {this.state.guardianArticles &&
                            guardianArticles.map((article, index) =>
                                <Col md={12} lg={3} className="searchCardContainer" key={index}>
                                    <SearchCard article={article} switch={true} />
                                </Col>
                            )
                        }
                        {this.state.nyArticles &&
                            nyArticles.map((article, index) =>
                                <Col md={12} lg={3} className="searchCardContainer" key={index}>
                                    <SearchCard article={article} switch={false} />
                                </Col>
                            )
                        }
                    </ul>
                </div>
            )
        }
        else {
            return (
                <div>
                    <Loader />
                </div>)
        }
    }
}

export default Search