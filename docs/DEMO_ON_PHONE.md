# Demo the app on phones

Three ways to let people open the app on their phones.

---

## See it as an app on their phone (Add to Home Screen)

The app is set up as a **Progressive Web App (PWA)**. When someone opens your tunnel or deployed URL on their phone, they can **add it to their home screen** so it looks and feels like a normal app (icon, full-screen, no browser bar).

- **iPhone (Safari):** Tap the Share button → **Add to Home Screen** → name it “OC Mentors” → Add. It will appear on the home screen and open full-screen.
- **Android (Chrome):** When the page loads, you may see “Add to Home screen” or “Install app” in the menu (⋮) or as a banner. Tap it. The app icon is added to the home screen and opens in its own window.

After that, they open **OC Mentors** from the home screen like any other app.

---

## Option 1: Same WiFi (quick, in-person demo)

**Best for:** Demos in the same room; everyone on the same Wi‑Fi.

1. Start the dev server:
   ```bash
   npm run dev
   ```
2. In the terminal you’ll see something like:
   ```text
   Local:   http://localhost:5173/
   Network: http://192.168.1.xxx:5173/
   ```
3. On their phones, have them connect to the **same Wi‑Fi** as your laptop, then open the **Network** URL in the browser (e.g. `http://192.168.1.xxx:5173`).

**Note:** Your laptop must stay on and running `npm run dev`. If your IP changes (e.g. after reconnecting to Wi‑Fi), use the new Network URL.

---

## Option 2: Public URL via tunnel (any network)

**Best for:** Sharing with people not on your Wi‑Fi; they open a link from anywhere.

Use a tunnel so your local dev server gets a public URL (e.g. `https://abc123.ngrok.io`). They open that URL on their phone.

### Using ngrok (free tier)

1. Sign up at [ngrok.com](https://ngrok.com) and install the CLI.
2. Start your app:
   ```bash
   npm run dev
   ```
3. In another terminal, start the tunnel (pointing at your Vite port):
   ```bash
   ngrok http 5173
   ```
4. Copy the **HTTPS** URL ngrok shows (e.g. `https://abc123.ngrok-free.app`) and send it. Anyone can open it on their phone.

**Caveat:** With the free plan, the URL changes each time you restart ngrok. Your laptop must stay on and `npm run dev` must keep running.

### Using Cloudflare Tunnel (free, no sign-up for basic use)

1. Install: `npm install -g cloudflared` (or download from [developers.cloudflare.com/cloudflare-one/connections/connect-apps](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps)).
2. Run your app: `npm run dev`.
3. In another terminal:
   ```bash
   cloudflared tunnel --url http://localhost:5173
   ```
4. Use the `*.trycloudflare.com` URL it prints; share that link for phones.

---

## Option 3: Deploy (always-on link)

**Best for:** A stable link that works anytime, without your laptop.

You already use Firebase (Auth, Firestore). You can host the app on **Firebase Hosting** and get a URL like `https://your-project-id.web.app`.

1. Build the app:
   ```bash
   npm run build
   ```
2. Deploy:
   ```bash
   firebase deploy --only hosting
   ```
3. Firebase will print the live URL (e.g. `https://oc-mentors-xxxx.web.app`). Share that; it works on any phone, any network, 24/7.

**Before deploying:** Ensure your Firebase project’s Auth **authorized domains** include the hosting URL (e.g. `your-project-id.web.app`). In [Firebase Console](https://console.firebase.google.com) → Project → Authentication → Settings → Authorized domains, add it if needed.

---

## Summary

| Option        | Same room? | Any network? | Laptop must run? | URL stable? |
|---------------|------------|---------------|------------------|-------------|
| 1. Same WiFi  | Yes        | No            | Yes              | No (IP can change) |
| 2. Tunnel     | Yes        | Yes           | Yes              | No (free tier)     |
| 3. Deploy     | Yes        | Yes           | No               | Yes                |

For a one-off demo with people next to you, use **Option 1**. For sending a link to someone far away, use **Option 2** (tunnel) or **Option 3** (deploy).
