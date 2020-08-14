import React, { Component } from 'react';

class FilterNotifier extends Component {
    inUse = () => this.props.options.find(({ selected }) => selected);

    render() {
        if (this.inUse()) {
            return (<span role="alert">&bull;</span>)
        }
        return "";
    }
}

export default FilterNotifier;
