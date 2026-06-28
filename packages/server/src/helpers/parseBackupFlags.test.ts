import { assertEquals, assertThrows } from '@std/assert';

import { InvalidBackupFlags, parseBackupFlags } from './parseBackupFlags.ts';

test('should return single-device cred, not backed up', () => {
  const parsed = parseBackupFlags({ be: false, bs: false });

  assertEquals(parsed.credentialDeviceType, 'singleDevice');
  assertEquals(parsed.credentialBackedUp, false);
});

test('should throw on single-device cred, backed up', () => {
  assertThrows(
    () => parseBackupFlags({ be: false, bs: true }),
    InvalidBackupFlags,
    'impossible',
  );
});

test('should return multi-device cred, not backed up', () => {
  const parsed = parseBackupFlags({ be: true, bs: false });

  assertEquals(parsed.credentialDeviceType, 'multiDevice');
  assertEquals(parsed.credentialBackedUp, false);
});

test('should return multi-device cred, backed up', () => {
  const parsed = parseBackupFlags({ be: true, bs: true });

  assertEquals(parsed.credentialDeviceType, 'multiDevice');
  assertEquals(parsed.credentialBackedUp, true);
});
