import React, { Component } from 'react';
import './rwd.css';
import PropTypes from 'prop-types';

class LoadingWindow extends React.Component {
    constructor(props) {
        super(props);
        this. state = {
        };
    };

    render() {
        return (
            <div id="loading_logo">
                <p>Finding<span>.</span><span>.</span><span>.</span></p>
            </div>
        )
    }
}

export default LoadingWindow;