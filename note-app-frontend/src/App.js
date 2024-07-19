import React from 'react';
import axios from 'axios';
import SidebarComponent from './sidebar/sidebar';
import EditorComponent from './editor/editor';
import './App.css';

const BASE_URL = 'http://ec2-54-177-99-57.us-west-1.compute.amazonaws.com/api/notes/';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      selectedNoteIndex: null,
      selectedNote: null,
      notes: []
    };
  }

  render() {
    return (
      <div className="app-container">
        <SidebarComponent
          selectedNoteIndex={this.state.selectedNoteIndex}
          notes={this.state.notes}
          deleteNote={this.deleteNote}
          selectNote={this.selectNote}
          newNote={this.newNote}
        />
        {
          this.state.selectedNote ?
            <EditorComponent 
              selectedNote={this.state.selectedNote}
              selectedNoteIndex={this.state.selectedNoteIndex}
              notes={this.state.notes}
              noteUpdate={this.noteUpdate}
            /> :
            null
        }
      </div>
    );
  }

  componentDidMount = () => {
    this.fetchNotes();
  }

  fetchNotes = () => {
    axios.get(BASE_URL)
      .then(response => this.setState({ notes: response.data }))
      .catch(error => console.error('Error fetching notes:', error));
  }

  selectNote = (note, index) => {
    this.setState({ selectedNoteIndex: index, selectedNote: note });
  }

  noteUpdate = (id, noteObj) => {
    axios.put(`${BASE_URL}${id}/`, {
      'title': noteObj.title,
      'body': noteObj.body
    })
      .then(() => {
        this.fetchNotes();
        this.setState({ selectedNoteIndex: 0 });
      })
      .catch(error => console.error('Error updating note:', error));
  }

  newNote = async (title) => {
    const note = {
      title: title,
      body: ''
    };
    axios.post(BASE_URL, {
      title: note.title,
      body: note.body
    })
      .then(response => {
        this.fetchNotes();
        this.setState({ selectedNote: response.data });
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
    axios.delete(`${BASE_URL}${note.id}/`)
      .then(() => this.fetchNotes())
      .catch(error => console.error('Error deleting note:', error));
  }

}

export default App;
