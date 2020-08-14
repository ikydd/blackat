import React, { Component } from 'react';

class FilterNotifier extends Component {
    render() {
        return this.props.on ? <span role="alert">&bull;</span> : ""
    }
}

export default FilterNotifier;
