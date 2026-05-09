/** Public-folder URLs must respect Vite `base` (e.g. GitHub Pages project path). */
const noiseUrl = `${import.meta.env.BASE_URL}noise.svg`
document.documentElement.style.setProperty('--noise-svg-url', `url('${noiseUrl}')`)
