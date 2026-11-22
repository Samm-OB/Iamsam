# samOS

Samuel Ofoegbu's portfolio, built as a Windows 11–style desktop. React 19 + Vite + Tailwind 4 + Zustand.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Editing content

Everything shown on the desktop comes from `src/data/`. You shouldn't need to touch components.

| File | What it controls |
|---|---|
| `profile.js` | Name, title, email, links, resume path, and the text of `About_Me.txt` |
| `projects.js` | Projects folder (screenshots live in `src/assets/projects/`). `folder` picks the subfolder. |
| `career.js` | School folder, Experience folder, and the Tech Stack (Task Manager) app |
| `media.js` | Entertainment → Movies / TV Shows / Anime (**placeholders**). Add a `poster` image URL to replace the generated cover. |
| `playlist.js` | The music widget's playlist (**placeholders**). Use the `v=` id from a YouTube Music link. |
| `fs.js` | How it's all arranged into folders and desktop icons. Add new folders/files here. |

The resume PDF is served from `public/files/`.

## Layout

- `src/components/shell/`: desktop, windows (drag/resize/snap), taskbar, Start menu, lock screen, mobile home screen
- `src/apps/`: File Explorer, Notepad, Document, Photos (projects), Movies & TV, PDF, Media Player, Task Manager, Mail
- `src/store/os.js`: window manager state · `src/store/music.js`: shared YouTube player
- Screens narrower than 768px get a phone-style home screen where apps open full screen.

Icons and wallpapers are original SVGs. The Start button uses an "S" monogram instead of the Windows logo, which is a Microsoft trademark.
