import { assert } from '@std/assert';

import * as index from './index.ts';

test('should export method `generateRegistrationOptions`', () => {
  assert(index.generateRegistrationOptions);
});

test('should export method `verifyRegistrationResponse`', () => {
  assert(index.verifyRegistrationResponse);
});

test('should export method `generateAuthenticationOptions`', () => {
  assert(index.generateAuthenticationOptions);
});

test('should export method `verifyAuthenticationResponse`', () => {
  assert(index.verifyAuthenticationResponse);
});

test('should export service `MetadataService`', () => {
  assert(index.MetadataService);
});

test('should export service `SettingsService`', () => {
  assert(index.SettingsService);
});
