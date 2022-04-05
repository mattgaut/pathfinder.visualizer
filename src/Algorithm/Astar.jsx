import Node from '../Visualizer/Node/Node';
import Heap from 'heap';

export function astar(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    var openHeap = new Heap(function(nodeA, nodeB) {
        return (nodeA.distance + nodeA.distanceFromGoal) - (nodeB.distance + nodeB.distanceFromGoal);
    });
    var openSet = new Set();

    openHeap.push(startNode);
    openSet.add(startNode);

    while (openHeap.size() > 0) {
      const closestNode = openHeap.pop();
      openSet.delete(closestNode);

      if (closestNode.Type === Node.TileType.Wall){
        continue;
      }

      if (closestNode === finishNode){
        return constructPath(closestNode);
      }

      getNeighbors(closestNode, grid).forEach(neighbor => {
        const tentativeScore = closestNode.distance + 1;
        if (tentativeScore < neighbor.distance){
            neighbor.previousNode = closestNode;
            neighbor.distance = tentativeScore;
            if (!openSet.has(neighbor)){
                openSet.add(neighbor);
                openHeap.push(neighbor);
            }
          }
      });
    }

    return null;
  }
  
  function getNeighbors(node, grid) {
      const neighbors = [];

      if (node.row > 0){
        neighbors.push(grid[node.row - 1][node.col])
      }
      if (node.col > 0){
        neighbors.push(grid[node.row][node.col - 1])
      }
      if (node.row < grid.length - 1){
        neighbors.push(grid[node.row + 1][node.col])
      }
      if (node.col < grid[node.row].length - 1){
        neighbors.push(grid[node.row][node.col + 1])
      }

      return neighbors;
  }
  
  export function constructPath(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) { 
      console.log(currentNode.row + " : " + currentNode.col);
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }