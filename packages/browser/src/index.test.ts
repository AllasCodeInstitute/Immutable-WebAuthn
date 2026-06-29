/// <reference lib="DOM" />
import { assert } from '@std/assert';

import * as index from './index.ts';

test('should export method `startRegistration`', () => {
  assert(index.startRegistration);
});

test('should export method `startAuthentication`', () => {
  assert(index.startAuthentication);
});

test('should export method `browserSupportsWebAuthn`', () => {
  assert(index.browserSupportsWebAuthn);
});

test('should export method `browserSupportsWebAuthnAutofill`', () => {
  assert(index.browserSupportsWebAuthnAutofill);
});

test('should export method `platformAuthenticatorIsAvailable`', () => {
  assert(index.platformAuthenticatorIsAvailable);
});

test('should export method `base64URLStringToBuffer`', () => {
  assert(index.base64URLStringToBuffer);
});

test('should export method `bufferToBase64URLString`', () => {
  assert(index.bufferToBase64URLString);
});

test('should export singleton `WebAuthnAbortService`', () => {
  assert(index.WebAuthnAbortService);
});
