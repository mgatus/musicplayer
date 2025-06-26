# Vue Music Player

A simple music player built with Vue.js and Material Web Components.

## Features

- Play, pause, next, and previous song controls
- Playlist with cover images and artist names
- Material Design UI and icons
- Responsive and modern design
- Custom scrollbar and smooth transitions

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal) to view the app.

### Build for Production

```bash
npm run build
```
The production-ready files will be in the `dist` folder.

## Deployment to GitHub Pages

1. **Set the `base` in `vite.config.js` to your repo name:**
   ```js
   export default defineConfig({
     // ...
     base: '/YOUR_REPO_NAME/',
   })
   ```

2. **Add the deploy script to `package.json`:**
   ```json
   "scripts": {
     "deploy": "vite build && gh-pages -d dist"
   }
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

4. **On GitHub:**  
   Go to **Settings > Pages** and set the source to the `gh-pages` branch.

Your app will be live at:  
`https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPO_NAME/`

## Static Assets

- Place your audio files in `public/songs/`
- Place your cover images in `public/covers/`
- Edit `public/songs.json` to manage your playlist:
  ```json
  [
    { "title": "Sugar", "filename": "sample.mp3", "cover": "6.webp", "artist": "Maroon V" }
    // ...
  ]
  ```

## Customization

- **Material Icons:** Uses Material Symbols via Google Fonts.
- **Font:** Uses Roboto via Google Fonts.
- **Styling:** Customize in `src/components/MusicPlayer.vue` and `src/assets/main.css`.

## License

MIT

---

**Made with Vue.js & Material Web Components**
