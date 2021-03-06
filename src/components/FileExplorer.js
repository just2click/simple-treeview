import React, { Component } from 'react';
import styled from 'styled-components';
import last from 'lodash/last';
import Buttons from './Buttons'
import Tree from './Tree';

const StyledFileExplorer = styled.div`
  width: 800px;
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 600px;
`;

const TreeWrapper = styled.div`
  width: 250px;
`;

// Display content of a file
const FileContentWrapper = styled.div`
  visibility: ${props => props.selectedFile && props.selectedFile.content && props.selectedFile.content !== '' ? 'visible' : 'hidden'};
  width: 250px;
`;

const FileContentHr = styled.hr`
  display: ${props => props.selectedFile && props.selectedFile.content && props.selectedFile.content !== '' ? 'block' : 'none'};
  width: 250px;
`;

export default class FileExplorer extends Component {
  constructor () {
    super();
    this.state = {
      selectedFile: null,
      newItem: null // Bug not used
    };

    this.tree = React.createRef(); // Reference this child so we can invoke inner functions
    this.handleItemSelection = this.handleItemSelection.bind(this);
    this.getFilename = this.getFilename.bind(this);
  }

  onSelect = (file) => this.setState({ selectedFile: file });

  handleItemSelection = (updatedItem) => {
    const { state } = this;
    this.tree.current.handleNodeAdd(updatedItem, state.selectedFile.path);
  }

  // Helper function to get file name when it is displayed
  getFilename () {
    const { state } = this;
    if (state.selectedFile && state.selectedFile.path) {
      const fileName = last(state.selectedFile.path.split('/'));

      return 'File: ' + fileName;
    }

    return ''
  }

  render() {
    const { selectedFile } = this.state;

    return (
      <StyledFileExplorer>
        <Buttons selectedFile={selectedFile} onItemSelection={this.handleItemSelection} />
        <ContentWrapper>
          <TreeWrapper>
            <Tree onSelect={this.onSelect} ref={this.tree}/>
          </TreeWrapper>
          <FileContentWrapper selectedFile={selectedFile}>
            { selectedFile && selectedFile.type === 'file' && this.getFilename() }
            <FileContentHr selectedFile={selectedFile} />
            { selectedFile && selectedFile.type === 'file' && selectedFile.content }
          </FileContentWrapper>
        </ContentWrapper>
      </StyledFileExplorer>
    )
  }
}