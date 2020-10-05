import React, { Component } from 'react';
import values from 'lodash/values';
import PropTypes from 'prop-types';

import TreeNode from './TreeNode';

// Dummy data
const data = {
  '/root': {
    path: '/root',
    type: 'folder',
    isRoot: true,
    children: ['/root/david', '/root/jslancer'],
  },
  '/root/david': {
    path: '/root/david',
    type: 'folder',
    children: ['/root/david/readme.md'],
  },
  '/root/david/readme.md': {
    path: '/root/david/readme.md',
    type: 'file',
    content: 'Thanks for reading me me. But there is nothing here.'
  },
  '/root/jslancer': {
    path: '/root/jslancer',
    type: 'folder',
    children: ['/root/jslancer/projects', '/root/jslancer/vblogs'],
  },
  '/root/jslancer/projects': {
    path: '/root/jslancer/projects',
    type: 'folder',
    children: ['/root/jslancer/projects/treeview'],
  },
  '/root/jslancer/projects/treeview': {
    path: '/root/jslancer/projects/treeview',
    type: 'folder',
    children: [],
  },
  '/root/jslancer/vblogs': {
    path: '/root/jslancer/vblogs',
    type: 'folder',
    children: [],
  },
};

export default class Tree extends Component {

  state = {
    nodes: data,
  };

  getRootNodes = () => {
    const { nodes } = this.state;
    return values(nodes).filter(node => node.isRoot === true);
  }

  getChildNodes = (node) => {
    const { nodes } = this.state;
    if (!node.children) return [];
    return node.children.map(path => nodes[path]);
  }

  onToggle = (node) => {
    const { nodes } = this.state;
    nodes[node.path].isOpen = !node.isOpen;
    this.setState({ nodes });
  }

  onNodeSelect = node => {
    const { onSelect } = this.props;
    onSelect(node);
  }

  onNodeRemove = node => {
    const { nodes } = this.state;

    // We need to look up this items' parent first
    for (const [key, value] of Object.entries(nodes)) {
      if (value.children && value.children.length > 0) {
        const index = value.children.findIndex(key => key === node.path);
        if (index >= 0) {
          nodes[key].children.splice(index, 1);
        }
      }
    }

    delete nodes[node.path]

    this.setState({ nodes });
  }

  handleNodeAdd = (node, parentKey) => {
    const { nodes } = this.state;

    let newItem = {}

    if (node.content) { // File
      newItem = {
        path: node.key,
        type: 'file',
        content: node.content
      }
    } else { // Folder
      newItem = {
        path: node.key,
        type: 'folder',
        children: []
      }
    }

    nodes[node.key] = newItem;

    nodes[parentKey].children.push(node.key);

    this.setState({ nodes });
  }

  render() {
    const rootNodes = this.getRootNodes();

    return (
      <div>
        { rootNodes.map(node => (
          <TreeNode
            node={node}
            key={node.path}
            getChildNodes={this.getChildNodes}
            onToggle={this.onToggle}
            onNodeSelect={this.onNodeSelect}
            onNodeRemove={this.onNodeRemove}
          />
        ))}
      </div>
    )
  }
}

Tree.propTypes = {
  onSelect: PropTypes.func.isRequired,
};