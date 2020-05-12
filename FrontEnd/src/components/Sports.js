import React from "react";
import axios from 'axios';
import Card from './Card';
import '../styles/home.css';
import Loader from './Loader';

class Sports extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newsArticles: null,
            loader: false
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        if (this.props.switch) {
            axios.get('https://react-aks05.appspot.com/guardian-sport ')
                .then(res => {
                    const newsArticles = res.data;
                    this.setState({
                        newsArticles,
                        loader: false
                    });
                })
        }
        else {
            axios.get('https://react-aks05.appspot.com/ny-sports')
                .then(res => {
                    const newsArticles = res.data;
                    this.setState({
                        newsArticles,
                        loader: false
                    });
                })
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.switch !== this.props.switch) {
            this.setState({
                loader: true
            })
            this.fetchData();
        }
    }

    render() {
        const newsArticles = this.state.newsArticles;
        if (newsArticles === null || !!this.state.loader || newsArticles.results.length === 0) {
            return (
                <Loader />
            )
        }
        else {
            const articles = this.state.newsArticles.results
            return (
                <div>
                    {this.state.newsArticles.results && !this.state.showDetails &&
                        <ul>
                            {
                                articles.map((article, index) =>
                                    <li key={index}>
                                        <Card article={article} switch={this.props.switch} />
                                    </li>
                                )}
                        </ul>
                    }
                </div>
            )
        }
    }
}


export default Sports;



