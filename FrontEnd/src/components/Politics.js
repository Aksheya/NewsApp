import React from "react";
import axios from 'axios';
import Card from './Card';
import '../styles/home.css';
import Loader from './Loader';

class Politics extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            newsArticles : null,
            loader: false
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = ()=>{
        if(this.props.switch){
            axios.get('https://react-aks05.appspot.com/guardian-politics')
            .then(res => {
                const newsArticles = res.data;
                this.setState({ 
                    newsArticles,
                    loader: false 
                });
            //  console.log(this.state.newsArticles.results)
            })
        }
        else{
            axios.get('https://react-aks05.appspot.com/ny-politics')
            .then(res => {
                const newsArticles = res.data;
                this.setState({ 
                    newsArticles,
                    loader : false
                });
            //  console.log(this.state.newsArticles.results)
            })
        }
    }

    componentDidUpdate(prevProps) {
        // console.log("inside component did update")
        if (prevProps.switch!== this.props.switch) {
            this.setState({
                loader : true
            })
            this.fetchData();
        }
    }

    render(){
        // console.log(this.props.switch,"switch",this.state.newsArticles)
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


export default Politics;



