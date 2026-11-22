import Explorer from './Explorer'
import { Notepad, DocumentViewer, ProjectViewer, MediaViewer, PdfViewer } from './Viewers'
import { MediaPlayer, TaskManager, Mail } from './Apps'

// app key (see lib/appMeta.js) -> component. Each receives { win }.
export const appComponents = {
  explorer: Explorer,
  notepad: Notepad,
  document: DocumentViewer,
  project: ProjectViewer,
  media: MediaViewer,
  pdf: PdfViewer,
  player: MediaPlayer,
  taskmgr: TaskManager,
  mail: Mail,
}
