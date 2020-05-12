import React from 'react';
import commentBox from 'commentbox.io';

class CommentBox extends React.Component {
    componentDidMount() {
        this.removeCommentBox = commentBox('5650461130489856-proj', {
            defaultBoxId: this.props.articleId
        });
    }
    componentWillUnmount() {

        this.removeCommentBox();
    }

    render() {
        return (
            <div className="commentbox"></div>
        );
    }
}

export default CommentBox;