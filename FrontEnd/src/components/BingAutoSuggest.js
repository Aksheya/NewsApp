import React, { Component, Fragment } from 'react';
import AsyncSelect from 'react-select/async'
import _ from "lodash";
import '../styles/search.css'
import { withRouter } from 'react-router-dom';
import Media from 'react-media';


class BingAutoSuggest extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = { selectedOption: "", valueOfBox: "" };
        this.fetchSearchResults = _.debounce(this.fetchSearchResults.bind(this), 1000);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.selectedOption !== this.state.selectedOption)
            this.props.history.push('/search?q=' + this.state.selectedOption.label);
        else
            if (prevProps.history.location.pathname !== '/search' && prevProps.location.pathname === '/search')
                this.setState({
                    valueOfBox: ""
                })
    }

    fetchSearchResults = (inpString, callback) => {
        if (!inpString) {
            callback([]);
        }
        else {
            setTimeout(() => {
                fetch(
                    `https://api.cognitive.microsoft.com/bing/v7.0/suggestions?q=${inpString}`,
                    {
                        headers: {
                            "Ocp-Apim-Subscription-Key": "e55248b17c204a3c8968bdee04023826"
                        }
                    }
                ).then((resp) => {
                    return resp.json()
                }).then((data) => {
                    const resultArray = [];
                    const resultsRaw = data.suggestionGroups[0].searchSuggestions;
                    resultsRaw.forEach((element) => {
                        resultArray.push({ value: element.url, label: element.displayText });
                    });
                    callback(resultArray);
                }).catch((error) => {
                    console.log(error, "catch the hoop")
                });
            });
        }
    }

    handleInputChange = (selectedOption) => {
        if (selectedOption) {
            this.setState({
                selectedOption: selectedOption,
                valueOfBox: selectedOption
            });
        }
    }
    render() {
        return (
            <Media queries={{
                small: "(max-width: 340px)",
                medium: "(max-width: 410px)"
            }}>
                {matches => (
                    <Fragment>
                        <AsyncSelect
                            // styles={this.customStyles}
                            className={matches.small ? `searchSmallWidth` : (matches.medium ? `searchMediumWidth` : `searchLargeWidth`)}
                            onChange={(e) => { this.handleInputChange(e) }}
                            loadOptions={this.fetchSearchResults}
                            placeholder="Enter Keyword ..."
                            noOptionsMessage={() => "No Match"}
                            value={this.state.valueOfBox}
                        />
                    </Fragment>
                )}
            </Media>

        );
    }
}

export default withRouter(BingAutoSuggest);

