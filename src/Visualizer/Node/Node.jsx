import React, {Component} from 'react';

import './Node.css';

export default class Node extends Component {
    static TileType = Object.freeze({"Normal":1, "Wall":2, "Start":3, "Finish":4})

    constructor() {
      super();
      this.state = { };
    }

    render() {
        const {
            col,
            row,
            Type,
            onMouseDown,
            onMouseEnter
        } = this.props;

        let extraClassName = (Node.TileType.Finish === Type)
            ? 'node-finish'
            : (Node.TileType.Start === Type)
            ? 'node-start'
            : (Node.TileType.Wall === Type)
            ? 'node-wall'
            : '';

        return (
            <div
            id={`node-${row}-${col}`}
            className={`node ${extraClassName}`}      
            onMouseDown={() => onMouseDown(row, col)}
            onMouseEnter={() => onMouseEnter(row, col)}></div>
        );
    }
}