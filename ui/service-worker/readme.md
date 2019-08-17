# Architecture

The service worker cache is a mechanism of caching notes and operations on notes offline to achieve the following:

- Offline-first (eventually!) where the server does not need to be contacted every time notes are fetched, updated, created or deleted
- Real-time saving does not need to contact the server which keeps API requests down
- Updates can be synced in the background even when the app is closed

## IndexDB cache of notes (DB)

Stores a cache of notes with extra properties:

- shouldCreateOnServer is used to determine whether a POST to create the note should be issued. This is only set when the user creates a new note offline.
- synced is used to determine whether there are any pending updates to be synced with the server
- state is used to determine which API request to issue when syncing notes to the server

## Handlers

The service worker handlers intercept fetch requests for the different operations on notes and acts as an entry point for the rest of the flow.

All of these handlers should operate on the IndexDB cache and not hit any network so that this architecture works fully offline.

## API to interface with cache

Similar to the Internote Services that act as a layer between the front-end and the DynamoDB, the API in the service worker acts as an interface between the service worker handlers and the IndexDB.

## Sync mechanism that syncs cache with server

Using service worker background sync the sync mechanism reads through the IndexDB for notes that are not yet synced and issues requests to the server to sync the notes. The sync mechanism schedules the sync for when the user next comes online in case of network outages, and also continues to issue requests should the user close the app.

# Workflow

## List

- Pull from IndexDB
- Filter for state !== DELETE
- Respond with notes

## Create

- Create temporary UUID
- Set it's state to UPDATE
- Set shouldCreateOnServer to true
- Set synced to false
- Set it's title, content and tags to default note (just like API does)
- Add to IndexDB
- Respond with note

## Update

- Find note in IndexDB
- _If found_, update it's title, content and tags
- Set it's state to UPDATE
- Keep shouldCreateOnServer as it currently is in the IndexDB in case of create -> update without sync inbetween
- Set synced to false
- Respond with note
- _If not found_, run through create note flow but set the noteId to the request's noteId (without response) and then update note flow

## Delete

- Find note in IndexDB
- _If found_, set it's state to DELETE
- Set synced to false
- Respond with void
- _If not found_, run through create note flow but set the noteId to the request's noteId (without response) and then update note flow

## Sync

- Get all notes from IndexDB where synced is false
- Filter notes for those that need to be created and issue POST requests. There is no need to create notes that have both shouldCreateOnServer and state === DELETE as it implies the user has created a new note and deleted it without a sync in-between
- Filter notes for those that need to be updated and issue PUT requests
- Filter notes for those that need to be deleted and issue DELETE requests
- At the end of every request, replace the note in the IndexDB with the response from the server to keep it fresh
