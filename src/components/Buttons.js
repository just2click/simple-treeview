import React, { Component } from 'react';
import { FaFile, FaFolderPlus } from 'react-icons/fa';
import PropTypes from 'prop-types';
import * as _ from 'lodash'
import styled from 'styled-components';

const ButtonsWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  display: flex;
`;

const ButtonIcon = styled.div`
  font-size: 16px;
  margin: 4px;
  padding: 4px 4px 0;

  background: ${props => props.addEnabled ? 'lightgray' : 'transparent'};
  border-radius: 4px;
  box-shadow: ${props => props.addEnabled ? '1px 1px #888888' : '0 0 transparent'};

  &:hover {
    cursor: ${props => props.addEnabled ? 'pointer' : 'normal'};
  }
`;

const NameInput = styled.div`
  display: ${props => props.selectedPath !== '' ? 'block' : 'none'};
  font-size: 16px;
  margin: 4px;
  padding: 4px 8px 0;
`;

const NameWarning = styled.div`
  color: tomato;
  display: ${props => props.addEnabled && props.name === '' ? 'block' : 'none'};
  font-size: 16px;
  margin: 4px;
`;

const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

export default class Buttons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addEnabled: false,
      selectedPath: '',
      name: ''
    }

    this.handleAddButtons = this.handleAddButtons.bind(this);
    this.addFile = this.addFile.bind(this);
    this.addFolder = this.addFolder.bind(this);
    this.updateName = this.updateName.bind(this);
    this.resetInputs = this.resetInputs.bind(this);
  }

  componentDidMount() {
    this.handleAddButtons();
  }

  componentDidUpdate(prevProps) {
    const { props } = this
    if (!_.isEqual(prevProps.selectedFile, props.selectedFile) && props.selectedFile !== null) {
      this.handleAddButtons();
    }
  }

  handleAddButtons () {
    const { props } = this

    // Reset buttons
    this.setState({
      addEnabled: false
    })
    if (props && props.selectedFile && props.selectedFile.type === 'folder') {
      this.setState({
        addEnabled: true,
        selectedPath: props.selectedFile.path
      })
    }
  }

  addFile () {
    const { state, props, resetInputs } = this
    if (state.name !== '') {
      const newFile = {
        key: `${props.selectedFile.path}/${state.name}`,
        content: loremIpsum
      }
      this.props.onItemSelection(newFile);
    }

    resetInputs();
  }

  addFolder () {
    const { state, props, resetInputs } = this
    if (state.name !== '') {
      const newFolder = {
        key: `${props.selectedFile.path}/${state.name}`
      }
      this.props.onItemSelection(newFolder);
    }

    resetInputs();
  }

  updateName (event) {
    this.setState({ name: event.target.value })
  }

  resetInputs () {
    this.setState({
      addEnabled: false,
      selectedPath: '',
      name: ''
    });
  }

  render() {

    return (
      <ButtonsWrapper>
        <ButtonIcon onClick={this.addFile} addEnabled={this.state.addEnabled} title="Add a file">
          <FaFile />
        </ButtonIcon>
        <ButtonIcon onClick={this.addFolder} addEnabled={this.state.addEnabled} title="Add a folder">
          <FaFolderPlus />
        </ButtonIcon>
        <NameInput selectedPath={this.state.selectedPath}>
          {this.state.selectedPath}&nbsp;&nbsp;<input type="text" value={this.state.name} onChange={this.updateName} />
          <NameWarning>File/Folder name cannot be empty!</NameWarning>
        </NameInput>
      </ButtonsWrapper>
    )
  }
}

Buttons.propTypes = {
  onItemSelection: PropTypes.func.isRequired,
};