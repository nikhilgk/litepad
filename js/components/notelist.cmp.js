import { ShortcutService } from '../services/shortcut.svc.js';
import { m } from '../../vendor/js/mithril.js';

export class NoteListComponent {

  constructor() {
    this.loading = true;
    this.selected = null;
    this.selectedTile = null;
    this.notes = null;
    this.shortcut = new ShortcutService();
    this.q = m.route.param('q');
    this.search = this.q ? `/q/${this.q}` : '';
    this.defineShortcuts();
  }

  defineShortcuts() {
    this.shortcut.add('up', {excludeTags: ['INPUT', 'TEXTAREA']}, () => this.selectPrevious());
    this.shortcut.add('down', {excludeTags: ['INPUT', 'TEXTAREA']}, () => this.selectNext());
    this.shortcut.add('space', {excludeTags: ['INPUT', 'TEXTAREA']}, () => {
      if (this.selected) {
        m.route.set(`/view/${this.selected.id}${this.search}`);
      }
      return false;
    });
  }

  onupdate() {
    if (this.selectedTile) {
      this.selectedTile.dom.scrollIntoView();
    }
  }

  empty() {
    return this.notes && this.notes.length === 0;
  }

  select(note) {
    this.deselect();
    note.selected = true;
    this.selected = note;
    m.redraw(); 
  }

  deselect() {
    this.notes.forEach((note) => {
      note.selected = false;
    });
    this.selected = null;
    this.selectedTile = null;
  }

  selectNext() {
    if (this.selected) {
      const index = this.notes.indexOf(this.selected);
      if (index < this.notes.length-1) {
        this.select(this.notes[index+1]);
      }
    } else if (this.notes.length > 0) {
      this.select(this.notes[0]);
    }   
  }

  selectPrevious(){
    if (this.selected) {
      const index = this.notes.indexOf(this.selected);
      if (index > 0) {
        this.select(this.notes[index-1]);
      }
    }
  }

  tile(note) {
    const modified = note.modified || note.created;
    const subtitle = `${note.words()} &bull; ${modified}`;
    const selected = (note.selected) ? '.selected' : '';
    const content = [];
    content.push(m('.tile-title', note.title));
    content.push(m('.tile-subtitle', m.trust(subtitle)));
    if (note.highlight) {
      content.push(m('.tile-highlight', m.trust(note.highlight)));
    }
    return m(`.tile${selected}`, {
        onclick: () => { m.route.set(`/view/${note.id}${this.search}`); },
        'data-note-id': note.id 
      },
      [
        m('.tile-icon', m('i.icon.icon-link.centered')),
        m('.tile-content', content)
      ]);
  }

  view(vnode) {
    this.notes = vnode.attrs.notes;
    if (this.notes instanceof Array) {
      this.loading = false;
    }
    if (this.loading) {
      return [m('.loading'), m('.loading-message', 'Loading...')];
    }
    if (this.empty()) {
      let emptyTitle = "There are no notes.";
      let emptySubtitle = 'Click the button to add a new note.';
      let emptyRoute = '/new';
      let emptyIcon = [m('i.icon.icon-plus'), ' Add'];
      if (this.q) {
        emptyIcon = [m('i.icon.icon-back'), ' Go Home'];
        emptyTitle = "No notes found.";
        emptySubtitle = "There are no notes matching your search.";
        emptyRoute = '/home';
      }
      return m('.empty', [
        m('.empty-icon', m('i.icon.icon-cross')),
        m('h4.empty-title', emptyTitle),
        m('p.empty-subtitle', emptySubtitle),
        m('.empty-action', m('button.btn.btn-primary', {
          onclick: () => {
            m.route.set(emptyRoute);
          }
        }, emptyIcon))
      ]);
    }
    if (this.error) {
      return m('.toast.toast-error', 'An error occurred when loading notes.');
    }
    return this.notes.map((note) => {
      const tile = this.tile(note);
      if (note.selected) {
        this.selectedTile = tile;
      }
      return tile;
    });
  }
}
