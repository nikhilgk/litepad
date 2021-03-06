import { ConfigService } from './services/config.svc.js';
import { EditNoteComponent } from './components/editnote.cmp.js';
import { HomeComponent } from './components/home.cmp.js';
import { NewNoteComponent } from './components/newnote.cmp.js';
import { SearchComponent } from './components/search.cmp.js';
import { ViewNoteComponent } from './components/viewnote.cmp.js';
import { m } from '../vendor/js/mithril.js';

function init() {
  m.route(document.body, '/home', {
    '/home': HomeComponent,
    '/view/:id': ViewNoteComponent,
    '/view/:id/q/:q': ViewNoteComponent,
    '/edit/:id': EditNoteComponent,
    '/new': NewNoteComponent,
    '/search/:q': SearchComponent
  });
}

new ConfigService('1.1.0'); // eslint-disable-line no-new
init();
