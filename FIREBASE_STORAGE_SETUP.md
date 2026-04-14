# Enable Firebase Storage (for profile photo upload)

If you see **"Upload timed out. Is Firebase Storage enabled?"** when uploading a profile picture, do the following.

## 1. Enable Storage in Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com/) and select your project (e.g. **oc-mentors-socratic**).
2. In the left sidebar, go to **Build → Storage**.
3. If you see **"Get started"**, click it.
4. Choose **Start in production mode** (we use custom rules). Click **Next**.
5. Pick your storage location (e.g. same as your app). Click **Done**.

Storage is now enabled and the default bucket is created (`your-project-id.appspot.com`).

## 2. Deploy Storage rules

Your app expects rules that allow users to upload only to their own `avatars/{userId}/` folder.

**Option A – Firebase Console**

1. In **Storage**, open the **Rules** tab.
2. Replace the rules with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /avatars/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **Publish**.

**Option B – CLI**

From the project root (where `storage.rules` lives):

```bash
firebase deploy --only storage
```

(Requires `firebase` CLI and `firebase login`.)

## 3. Check .env.local

Ensure your env has the storage bucket (usually the default):

```env
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

Example for project **oc-mentors-socratic**:

```env
VITE_FIREBASE_STORAGE_BUCKET=oc-mentors-socratic.appspot.com
```

If this is missing, the client may still use the default bucket, but setting it avoids issues.

## 4. Try again

Restart the app (`npm run dev`), then upload a profile photo again. If it still times out, check the browser **Console** (F12) for `[Avatar] Upload failed:` and the **Network** tab for requests to `firebasestorage.googleapis.com` or `upload.firebase.com`.
