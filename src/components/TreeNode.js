import React from 'react';
import {
  FaFile,
  FaFolder,
  FaFolderOpen,
  FaChevronDown,
  FaChevronRight,
  FaMinusCircle
} from 'react-icons/fa';
import styled from 'styled-components';
import last from 'lodash/last';
import PropTypes from 'prop-types';

const getPaddingLeft = (level, type) => {
  let paddingLeft = level * 20;
  if (type === 'file') paddingLeft += 20;
  return paddingLeft;
}

const RemoveIcon = styled.div`
  align-self: flex-end;
  font-size: 12px;
  display: none;
`;

const StyledTreeNode = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 5px 8px;
  padding-left: ${props => getPaddingLeft(props.level, props.type)}px;

  &:hover {
    background: lightgray;
    border-radius: 4px;
  }

  &:hover ${RemoveIcon} {
    display: block;
  }
`;

const TreeNodeWrapper = styled.div`
  display: flex;
  align-items: baseline;
`;


const NodeIcon = styled.div`
  font-size: 12px;
  margin-right: ${props => props.marginRight ? props.marginRight : 5}px;
`;

const getNodeLabel = (node) => last(node.path.split('/'));

const TreeNode = (props) => {
  const { node, getChildNodes, level, onToggle, onNodeSelect, onNodeRemove } = props;

  return (
    <React.Fragment>
      <StyledTreeNode level={level} type={node.type} key={node.path}>
        <TreeNodeWrapper>
          <NodeIcon onClick={() => onToggle(node)}>
            { node.type === 'folder' && (node.isOpen ? <FaChevronDown /> : <FaChevronRight />) }
          </NodeIcon>

          <NodeIcon marginRight={10}>
            { node.type === 'file' && <FaFile /> }
            { node.type === 'folder' && node.isOpen === true && <FaFolderOpen /> }
            { node.type === 'folder' && !node.isOpen && <FaFolder /> }
          </NodeIcon>

          <span role="button" onClick={() => onNodeSelect(node)}>
            { getNodeLabel(node) }
          </span>
        </TreeNodeWrapper>

        <RemoveIcon role="button" onClick={() => onNodeRemove(node)} title="Remove item">
          { node && node.isRoot === undefined && <FaMinusCircle /> }
        </RemoveIcon>
      </StyledTreeNode>

      { node.isOpen && getChildNodes(node).map(childNode => (
        <TreeNode
          {...props}
          node={childNode}
          level={level + 1}
        />
      ))}
    </React.Fragment>
  );
}

TreeNode.propTypes = {
  node: PropTypes.object.isRequired,
  getChildNodes: PropTypes.func.isRequired,
  level: PropTypes.number.isRequired,
  onToggle: PropTypes.func.isRequired,
  onNodeSelect: PropTypes.func.isRequired,
  onNodeRemove: PropTypes.func.isRequired
};

TreeNode.defaultProps = {
  level: 0,
};

export default TreeNode;
