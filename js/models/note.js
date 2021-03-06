import { ConfigService } from '../services/config.svc.js';
import { timeago } from '../../vendor/js/timeago.js';

export class Note {

  constructor(note) {
    this.config = new ConfigService();
    this.id = note.id.replace(new RegExp(`^${this.config.settings.prefix}`), '');
    const split = note.data.split(/\n\n/);
    this.title = split.shift();
    this.body = split.join('\n\n');
    this.created = timeago().format(note.created);
    this.highlight = this.formatHighlight(note.highlight);
    this.modified = (note.modified) ? timeago().format(note.modified) : null;
  }

  formatHighlight(highlight) {
    if (highlight) {
      return highlight.replace(/^"|\*+|_+|"$/g, '').replace(/\\n|\\t/g, ' ');
    }
    return null;
  }

  words() {
    return `${this.body.split(/\s/m).length} words`;
  }

  text() {
    return `${this.title}\n\n${this.body}`;
  }

}
