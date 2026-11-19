# Daily Checklist

A calm, responsive checklist for everyday tasks. It runs in a browser with no install, framework, account, or network connection.

## Features

- Add, complete, filter, and remove tasks.
- See how many tasks are left and completed.
- Clear completed tasks in one action.
- Save tasks locally in the current browser.
- Keyboard-friendly controls and responsive layout.

## Run locally

Open `index.html` in a current browser. For local development, serve this folder with `python -m http.server 8000` and visit `http://localhost:8000`.

## Test

Requires Node.js 18 or newer; there are no npm dependencies.

```sh
npm test
npm run check
```

## Privacy

Tasks are stored in browser `localStorage` and are never transmitted. Clearing this browser's site data removes them.

## License

MIT. See [LICENSE](./LICENSE).
