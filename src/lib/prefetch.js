/**
 * Module-level promise cache.
 * Call prefetchAll() right after unlock so data is ready when user navigates.
 * Pages call getLetters() / getWishlist() / etc. — reuses the in-flight or resolved promise.
 */
import { fetchAllLetters, fetchAllWishlist, fetchPasswords, fetchPhotos, fetchSongs, fetchGiftMessages } from './supabase';

let lettersPromise  = null;
let wishlistPromise = null;
let passwordsPromise = null;
let photosPromise   = null;
let songsPromise    = null;
let messagesPromise = null;

export function prefetchAll() {
  if (!lettersPromise)  lettersPromise  = fetchAllLetters().catch(() => []);
  if (!wishlistPromise) wishlistPromise = fetchAllWishlist().catch(() => []);
  if (!passwordsPromise) passwordsPromise = fetchPasswords().catch(() => []);
  if (!photosPromise)   photosPromise   = fetchPhotos().catch(() => []);
  if (!songsPromise)    songsPromise    = fetchSongs().catch(() => []);
  if (!messagesPromise) messagesPromise = fetchGiftMessages().catch(() => []);
}

export function getLetters() {
  if (!lettersPromise) lettersPromise = fetchAllLetters().catch(() => []);
  return lettersPromise;
}

export function getWishlist() {
  if (!wishlistPromise) wishlistPromise = fetchAllWishlist().catch(() => []);
  return wishlistPromise;
}

export function getPasswords() {
  if (!passwordsPromise) passwordsPromise = fetchPasswords().catch(() => []);
  return passwordsPromise;
}

export function getPhotos() {
  if (!photosPromise) photosPromise = fetchPhotos().catch(() => []);
  return photosPromise;
}

export function getSongs() {
  if (!songsPromise) songsPromise = fetchSongs().catch(() => []);
  return songsPromise;
}

export function getMessages() {
  if (!messagesPromise) messagesPromise = fetchGiftMessages().catch(() => []);
  return messagesPromise;
}

/** Call after a write so next page load re-fetches fresh data */
export function invalidateLetters()  { lettersPromise  = null; }
export function invalidateWishlist() { wishlistPromise  = null; }
export function invalidatePasswords() { passwordsPromise = null; }
export function invalidatePhotos()   { photosPromise    = null; }
export function invalidateSongs()    { songsPromise     = null; }
export function invalidateMessages() { messagesPromise  = null; }
