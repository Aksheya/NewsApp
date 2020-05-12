import React from 'react';
import FavArticle from './FavArticle';
import { Col } from 'react-bootstrap';
import '../styles/favourite.css'
import { Zoom } from 'react-toastify';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Favourites extends React.Component {
    constructor(props) {
        super(props);
        this.colRefs = []
        this.state = {
            itemCount: ""
        }
    }

    closeToast = (title) => toast(title, {
        className: 'black-font',
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
    });

    returnParent = (index, title) => {
        this.closeToast('Removing ' + title);
        this.colRefs[index].style.display = 'none'
        var keys = Object.keys(localStorage);
        var count = 0;
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] !== 'switch' && keys[i].startsWith('myNewsApp'))
                count++;
        }
        if (count === 0)
            this.setState({
                itemCount: 0
            })
    }

    render() {
        var keys = Object.keys(localStorage);
        var items = []
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] !== 'switch' && keys[i].startsWith('myNewsApp')) {
                var itemValue = localStorage.getItem(keys[i]);
                var itemKey = keys[i];
                var item = {
                    key: itemKey,
                    value: JSON.parse(itemValue)
                }
                items.push(item);
            }
        }
        // const itemC = this.state.itemCount;
        return (
            <div>
                <ToastContainer transition={Zoom} />
                {items.length > 0 &&
                    <>
                        <p className="favourites">Favorites</p>
                        <ul>
                            {
                                items.map((item, index) =>
                                    <Col lg={3} md={12} className="favouriteContainer" ref={(element) => this.colRefs[index] = element} id={item.key} key={index}>
                                        <FavArticle article={item} getParent={(index, title) => this.returnParent(index, title)} index={index} />
                                    </Col>

                                )}
                        </ul>
                    </>}
                {!(items.length > 0) &&
                    <>
                        <p className="favourites" style={{ textAlign: 'center' }}>You have no saved articles</p>
                    </>
                }
            </div>
        )
    }
}

export default Favourites;