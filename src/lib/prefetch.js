/**
 * Module-level promise cache.
 * Call prefetchAll() right after unlock so data is ready when user navigates.
 * Pages call getLetters() / getWishlist() — reuses the in-flight or resolved promise.
 */
import { fetchAllLetters, fetchAllWishlist } from './supabase';

let lettersPromise  = null;
let wishlistPromise = null;

export function prefetchAll() {
  if (!lettersPromise)  lettersPromise  = fetchAllLetters().catch(() => []);
  if (!wishlistPromise) wishlistPromise = fetchAllWishlist().catch(() => []);
}

export function getLetters() {
  if (!lettersPromise) lettersPromise = fetchAllLetters().catch(() => []);
  return lettersPromise;
}

export function getWishlist() {
  if (!wishlistPromise) wishlistPromise = fetchAllWishlist().catch(() => []);
  return wishlistPromise;
}

/** Call after a write so next page load re-fetches fresh data */
export function invalidateLetters()  { lettersPromise  = null; }
export function invalidateWishlist() { wishlistPromise = null; }
