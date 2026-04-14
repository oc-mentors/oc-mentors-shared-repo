# Audit and Implementation Plan — Backend/Product Flows

## 1. Tutor request lifecycle

### What currently exists
- **Firestore:** `tutorRequests/{requestId}` rules (read by participant, create by auth, update/delete by participant). Types: `TutorRequestDoc` (studentUid, tutorUid, status, initialMessage, subject, createdAt, updatedAt, respondedAt).
- **Connections:** Created directly when student taps "Message" via `getOrCreateConnectionWithTutor` in ConnectionsContext; no request step.
- **UI:** TutorDetailPage "Message" calls `getOrCreateConnectionWithTutor` then navigates to chat.

### What is missing
- No creation of `tutorRequests` docs.
- No tutor view of incoming requests (pending list).
- No accept/reject actions; no creation of connection/conversation only on accept.

### Files to modify
- **New:** `src/app/contexts/TutorRequestsContext.tsx` (create request, list incoming for tutor, accept, reject).
- **Modify:** `src/app/pages/TutorDetailPage.tsx` — student: show "Request tutor" (create request) or "Message" (if connection exists); tutor: show "Message" if connection exists.
- **Modify:** `src/app/contexts/ConnectionsContext.tsx` — add `createConnectionFromRequest(requestId, ...)` used when tutor accepts (or call Cloud Function).
- **New (or add to TutorHomePage):** UI for tutors to see incoming requests and accept/reject (e.g. `TutorRequestsPage.tsx` or section in TutorHomePage).
- **Modify:** `App.tsx` — add route for tutor requests if new page; wrap with TutorRequestsProvider.

### Implementation plan
1. Add TutorRequestsContext: `createRequest(tutorUid, initialMessage?, subject?)`, `getIncomingRequestsForTutor()`, `acceptRequest(requestId)`, `rejectRequest(requestId)`. acceptRequest creates connection + conversation (client-side for now; later Cloud Function).
2. TutorDetailPage: if user is student and no connection → show "Request tutor" → create request, show "Request sent". If connection exists → show "Message" (current flow). If user is tutor and connection exists → show "Message".
3. Add TutorRequestsPage (tutor role): list pending requests; each row Accept/Reject. On Accept call acceptRequest (which creates connection + conversation, updates request status).
4. Firestore schema: use existing TutorRequestDoc. On accept: create connection (with requestId), create conversation, update request (status: accepted, respondedAt: serverTimestamp()).

### Risks / compatibility
- Existing flows that only had "Message" will now show "Request tutor" first for students; after accept, "Message" appears. Backward compat: existing connections unchanged.

---

## 2. Cloud Functions / server-side safety

### What currently exists
- **Project:** No `firebase.json`, no `functions/` folder. firebase-admin used in scripts only.
- **Message lastMessage:** Updated in ConversationsContext.addMessage (client-side) via updateDoc on conversation.

### What is missing
- No Cloud Functions. Accept-request and lastMessage updates are client-side only.

### Files to add/modify
- **New:** `firebase.json` (project config, firestore + functions).
- **New:** `functions/package.json`, `functions/index.js` (or index.ts).
- **New:** Callable `acceptTutorRequest` (requestId) — atomic: update request, create connection, create conversation.
- **New:** Firestore trigger `onDocumentCreated('conversations/{convId}/messages/{msgId}')` — update parent conversation lastMessageText, lastMessageAt, lastMessageSenderUid.

### Implementation plan
1. Add firebase.json with "firestore" and "functions" (source: "functions").
2. Add functions/ with Node 18, firebase-admin and firebase-functions; export callable acceptTutorRequest and onCreate for messages.
3. acceptTutorRequest: validate request exists and status pending and caller is tutorUid; batch: update request (status, respondedAt), create connection, create conversation doc; return conversationId.
4. onMessageCreated: read message doc, get senderUid and text; update parent conversation with lastMessageText, lastMessageSenderUid, lastMessageAt (serverTimestamp()), updatedAt.

### Risks / compatibility
- Requires Blaze plan for Cloud Functions. If not deploying Functions, client-side flow still works.

---

## 3. Reviews

### What currently exists
- **Types:** ReviewDoc (tutorUid, studentUid, connectionId, rating, text, createdAt). Firestore rules: read true, create if auth, update/delete if resource.data.studentUid == auth.uid.
- **UI:** RateSessionPage has rating + review text + submit but only navigates to schedule; no Firestore write. TutorDetailPage shows hardcoded reviews (not from Firestore).

### What is missing
- No write to `reviews` collection. No check that student has a connection before allowing review. No update to tutorProfiles ratingAvg/ratingCount.

### Files to modify
- **Modify:** `src/app/pages/RateSessionPage.tsx` — accept location.state with connectionId, tutorUid; on submit addDoc to reviews, then update tutorProfiles (increment ratingCount, recompute ratingAvg) or call Cloud Function later.
- **Optional:** Pass connectionId/tutorUid from Schedule/PastLessons when navigating to rate-session (from session or connection).

### Implementation plan
1. RateSessionPage: require connectionId and tutorUid in state (from session or connection). On submit: addDoc reviews/{autoId} with tutorUid, studentUid (auth.uid), connectionId, rating, text, createdAt. Then get tutorProfiles/{tutorUid}, compute new ratingAvg and ratingCount, updateDoc.
2. Validate in UI: only allow submit if we have connectionId (and optionally check in security rules that connection exists and studentUid is in it — possible with get() in rules).

### Risks / compatibility
- Aggregate update is client-side; could be moved to Cloud Function on review create. Rules: we could add validate connection in rule (get connection doc and check studentUid) — optional.

---

## 4. Tutor verifications

### What currently exists
- **Types:** TutorVerificationDoc (uid, status, submittedAt, reviewedAt, reviewedBy, notes, documentRefs: { type, storagePath }[]). Rules: read/write if auth.uid == userId.

### What is missing
- No UI to submit verification. No upload to Storage or write to tutorVerifications.

### Files to modify
- **New:** `src/app/pages/TutorVerificationPage.tsx` (or modal) — tutor uploads files, we upload to Storage (verifications/{uid}/filename), then setDoc/updateDoc tutorVerifications/{uid} with documentRefs and status: pending.
- **Modify:** Storage rules (if any) to allow upload to verifications/{uid}/* by auth user.

### Implementation plan
1. Tutor verification page: list current documentRefs and status; form to add file (type: student_id, etc.), upload to Firebase Storage at verifications/{uid}/{type}-{timestamp}.ext, then updateDoc tutorVerifications/{uid} with documentRefs array (append { type, storagePath }), set status to pending, submittedAt serverTimestamp().
2. storage.rules: allow write to verifications/{userId}/** if request.auth.uid == userId.

### Risks / compatibility
- Minimal; no admin review UI (scaffold or leave for later).

---

## 5. Sessions

### What currently exists
- **Types:** SessionDoc (connectionId, studentUid, tutorUid, status, scheduledAt, createdAt, updatedAt). Rules: sessions read, write if auth.
- **App:** Schedule/booking use CalendarContext (localStorage sessions); no Firestore sessions collection.

### What is missing
- No Firestore session docs. No booking flow that creates a session doc linked to a connection.

### Files to modify
- **Modify:** Add minimal session creation when "booking" from a connected tutor: e.g. BookSessionPage or SubjectTutorsPage confirm booking → addDoc to sessions with connectionId, studentUid, tutorUid, status: requested/pending, scheduledAt (from form). Tutor can confirm/cancel by updating status (e.g. confirmed, cancelled).
- **New (optional):** SessionsContext to load sessions for current user (where studentUid or tutorUid == uid).

### Implementation plan
1. Extend SessionDoc: status 'requested' | 'confirmed' | 'cancelled' | 'completed'. When student books (from a subject/tutor flow where they have a connection), addDoc sessions with connectionId, studentUid, tutorUid, status: 'requested', scheduledAt (Timestamp), createdAt, updatedAt. Tutor sees requested sessions and can update status to confirmed/cancelled.
2. Keep CalendarContext/localStorage for display if needed; optionally sync from Firestore sessions.

### Risks / compatibility
- Minimal; existing calendar/schedule UI can stay; we add Firestore session docs for connected bookings.

---

## 6. TutorStudentsPage chat link bug

### What currently exists
- TutorStudentsPage uses hardcoded `students` array with numeric id (1,2,3...). Link: `to={/chat/${student.id}}` — wrong (conversationId is Firestore doc id, not student id).

### What is missing
- Students list should come from connections where tutorUid == current user. Chat link must be /chat/{conversationId} from the connection.

### Files to modify
- **Modify:** `src/app/pages/TutorStudentsPage.tsx` — use useConnections(), filter connections where tutorUid == user.id. For each connection get student display (e.g. from conversation participantSummary or fetch users/{studentUid}). Message link: to={`/chat/${connection.conversationId}`}. Remove hardcoded students or keep as fallback when no connections.

### Implementation plan
1. TutorStudentsPage: useAuth(), useConnections(). connections.filter(c => c.tutorUid === user.id). Map to list with studentUid, conversationId, and display name (we need to get name: from conversation participantSummary for studentUid or from users — participantSummary is in conversation; we don't have conversation in context easily. So: load connections; for each connection we have studentUid and conversationId. To show student name we can read users/{studentUid} or add a small hook that loads conversation to get participantSummary[studentUid].displayName. Simpler: load conversations where participantUids array-contains uid, then for each conv get the other participant from participantSummary; if role is student, that's a "student" in our list — but we need to match connection so we have conversationId. So: from connections (as tutor) we have studentUid and conversationId. We need display name: either store in connection (denormalize) or fetch user. Easiest: add studentDisplayName, studentPhotoURL to connection when we create it (on accept). So when creating connection we set student display name. Then TutorStudentsPage just uses connection.studentDisplayName. So we need to add optional studentDisplayName, studentPhotoURL to ConnectionDoc and set them when creating connection (from request we might have student info). For now we can read users/{studentUid} in TutorStudentsPage for each connection to get display name — N reads. Or we add denormalized name to connection. I'll add optional studentDisplayName to connection when created on accept (from tutor request we don't have student name in request doc — we'd need to read user. So on accept in Cloud Function we can set it. For client-side accept we can read users/{studentUid} and then create connection with studentDisplayName. So: in acceptRequest we'll fetch student profile and set connection with studentDisplayName, studentPhotoURL so TutorStudentsPage can show list without extra reads.)
2. Implement: TutorStudentsPage loads connections (tutorUid === uid). Display name: use connection.studentDisplayName if present, else "Student" or fetch user. Link: /chat/${connection.conversationId}.

### Risks / compatibility
- If connections don't have studentDisplayName (old docs), show "Student" or fetch users once per connection.
