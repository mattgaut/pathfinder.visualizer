import { type } from '@testing-library/user-event/dist/type';
import React, {Component} from 'react';
import Node from './Node/Node';
import Astar, { astar } from '../Algorithm/Astar';

import './Visualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class Visualizer extends Component {
    constructor() {
      super();
      this.state = {
        grid: [],
        mouseIsPressed: false,
        currentTileType: Node.TileType.Wall
      };
    }

    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({grid});

        window.addEventListener("mouseup", this.handleWindowMouseUp)
        window.addEventListener("mousedown", this.handleWindowMouseDown)
        window.addEventListener("dragstart", this.handleWindowMouseUp)
    }

    componentWillUnmount(){
        window.removeEventListener("mouseup", this.handleWindowMouseUp)
        window.removeEventListener("mousedown", this.handleWindowMouseDown)
        window.removeEventListener("dragstart", this.handleWindowMouseUp)
    }

    handleMouseDown(row, col) {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col, this.state.currentTileType);
        this.setState({grid: newGrid});
    }
    
    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col, this.state.currentTileType);
        this.setState({grid: newGrid});
    }   

    handleWindowMouseUp = (event) => {
        this.setState({mouseIsPressed: false});
    }

    handleWindowMouseDown = (event) => {
        this.setState({mouseIsPressed: true});
    }

    changeCurrentTile = (type) => {
        this.setState({currentTileType: type});
    }

    visualizeAStar = () => {
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const nodesInShortestPathOrder = astar(grid, startNode, finishNode);
        console.log(nodesInShortestPathOrder.length);
        this.animateShortestPath(nodesInShortestPathOrder);
    }

    animateDijkstra(nodesInShortestPathOrder) {
        this.animateShortestPath(nodesInShortestPathOrder);
    }

    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-shortest-path';
            }, 50 * i);
        }
    }

    render() {
        const {grid, mouseIsPressed} = this.state;
    
        return (
            <>
                <button onClick={() => this.changeCurrentTile(Node.TileType.Wall)}>
                Wall
                </button>
                <button onClick={() => this.changeCurrentTile(Node.TileType.Normal)}>
                Open
                </button>
                <button onClick={() => this.visualizeAStar()}>
                Run
                </button>
                <div className="grid"> 
                    {grid.map((row, rowIdx) => {
                        return (
                            <div key={rowIdx}>
                                {row.map((node, nodeIdx) => {
                                    const {row, col, Type} = node;
                                        return (
                                            <Node
                                                key={nodeIdx}
                                                col={col}
                                                row={row}
                                                Type={Type}
                                                mouseIsPressed={mouseIsPressed}
                                                onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                                onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}></Node>
                                        );
                                })}
                            </div>
                        );
                    })}
                </div>
            </>
        );
    }
}

const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
};
  
const createNode = (col, row) => {

    let Type = Node.TileType.Normal;

    if (col === START_NODE_COL && row === START_NODE_ROW){
        Type = Node.TileType.Start;
    }

    if (col === FINISH_NODE_COL && row === FINISH_NODE_ROW){
        Type = Node.TileType.Finish;
    }

    return {
      col,
      row,
      Type: Type,
      distance: Infinity,
      distanceFromGoal: distance(col, row, FINISH_NODE_ROW, FINISH_NODE_COL),
      isVisited: false,
      previousNode: null,
    };
};

const distance = (x1, y1, x2, y2) => {
    return Math.pow(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2), 0.5);
}

const getNewGridWithWallToggled = (grid, row, col, type) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      Type: type,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};