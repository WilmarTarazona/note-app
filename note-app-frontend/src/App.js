import React from 'react';
import axios from 'axios';
import SidebarComponent from './sidebar/sidebar';
import EditorComponent from './editor/editor';
import './App.css';

// const firebase = require('firebase');

class App extends React.Component {

  constructor() {
    super()
    this.state = {
      selectedNoteIndex: null,
      selectedNote: null,
      notes: null
    }
  }


  render() {
    return (
      <div className="app-container">
        <SidebarComponent
          selectedNoteIndex={this.state.selectedNoteIndex}
          notes={this.state.notes}
          deleteNote={this.deleteNote}
          selectNote={this.selectNote}
          newNote={this.newNote}></SidebarComponent>
        {
          this.state.selectedNote ?
            <EditorComponent selectedNote={this.state.selectedNote}
              selectedNoteIndex={this.state.selectedNoteIndex}
              notes={this.state.notes}
              noteUpdate={this.noteUpdate}></EditorComponent> :
            null
        }
      </div>
    )
  }
  componentDidMount = () => {
    axios.get('http://127.0.0.1:8000/api/notes/')
      .then(response => this.setState({ notes: response.data}))
      .catch(error => console.error('Error fetching notes:', error));
  }
  selectNote = (note, index) => this.setState({ selectedNoteIndex: index, selectedNote: note });
  noteUpdate = (id, noteObj) => {
    axios.put('http://127.0.0.1:8000/api/notes/' + id + '/' , {'title': noteObj.title, 'body': noteObj.body})
      .then(response => console.log(response.data))
      .catch(error => console.error('Error fetching notes:', error));
  }
  newNote = async (title) => {
    const note = {
      title: title,
      body: ''
    };
    axios.post('http://127.0.0.1:8000/api/notes/', { title: note.title, body: note.body })
      .then(response => {
        this.setState({ notes: [...this.state.notes, response.data] });
        const newNoteIndex = response.data.id;
        this.setState({ selectedNote: this.state.notes[newNoteIndex], selectedNoteIndex: newNoteIndex });
      })
      .catch(error => console.error('Error adding note:', error));
  }
  deleteNote = async (note) => {
    const noteIndex = this.state.notes.indexOf(note);
    await this.setState({ notes: this.state.notes.filter(_note => _note !== note) });
    if (this.state.selectedNoteIndex === noteIndex) {
      this.setState({ selectedNoteIndex: null, selectedNote: null });
    } else {
      this.state.notes.length > 1 ?
      this.selectNote(this.state.notes[this.state.selectedNoteIndex - 1], this.state.selectedNoteIndex - 1) :
      this.setState({ selectedNoteIndex: null, selectedNote: null });
    }
    axios.delete(`http://127.0.0.1:8000/api/notes/${note.id}/`)
    .then(response => console.log(response))
    .catch(error => console.error('Error deleting note:', error));
  }

}
export default App
