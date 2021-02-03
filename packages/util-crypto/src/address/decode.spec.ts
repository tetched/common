// Copyright 2017-2021 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { hexToU8a, stringToU8a, u8aToHex } from '@polkadot/util';

import { createTestPairs, TestKeyringMap } from '../../../keyring/src/testingPairs';
import { decodeAddress } from '.';

describe('decodeAddress', (): void => {
  let keyring: TestKeyringMap;

  beforeAll((): void => {
    keyring = createTestPairs({ type: 'sr25519' });
  });

  it('decodes an address', (): void => {
    expect(
      decodeAddress('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
    ).toEqual(
      keyring.alice.publicKey
    );
  });

  it('decodes the council address', (): void => {
    expect(
      u8aToHex(decodeAddress('F3opxRbN5ZbjJNU511Kj2TLuzFcDq9BGduA9TgiECafpg29'))
    ).toEqual(u8aToHex(stringToU8a('modlpy/trsry'.padEnd(32, '\0'))));
  });

  it('converts a publicKey (u8a) as-is', (): void => {
    expect(
      decodeAddress(new Uint8Array([1, 2, 3]))
    ).toEqual(
      new Uint8Array([1, 2, 3])
    );
  });

  it('converts a publicKey (hex) as-is', (): void => {
    expect(
      decodeAddress('0x01020304')
    ).toEqual(
      new Uint8Array([1, 2, 3, 4])
    );
  });

  it('decodes a short address', (): void => {
    expect(
      decodeAddress('F7NZ')
    ).toEqual(new Uint8Array([1]));
  });

  it('decodes a 1-byte accountId (with prefix)', (): void => {
    expect(
      decodeAddress('g4b', false, 2)
    ).toEqual(new Uint8Array([1]));
  });

  it('decodes a 2-byte accountId', (): void => {
    expect(
      decodeAddress('3xygo', false, 2)
    ).toEqual(new Uint8Array([0, 1]));
  });

  it('encodes a 4-byte address', (): void => {
    expect(
      decodeAddress('zswfoZa', false, 2)
    ).toEqual(new Uint8Array([1, 2, 3, 4]));
  });

  it('decodes a 8-byte address', (): void => {
    expect(
      decodeAddress('848Gh2GcGaZia', false, 2)
    ).toEqual(new Uint8Array([42, 44, 10, 0, 0, 0, 0, 0]));
  });

  it('decodes a 33-byte address', (): void => {
    expect(
      decodeAddress('KWCv1L3QX9LDPwY4VzvLmarEmXjVJidUzZcinvVnmxAJJCBou')
    ).toEqual(
      hexToU8a('0x03b9dc646dd71118e5f7fda681ad9eca36eb3ee96f344f582fbe7b5bcdebb13077')
    );
  });

  it('decodes a 2-byte prefix', (): void => {
    expect(
      decodeAddress('2vRvjTMnza9uQZzYcjtEHiYkUzLaUvfXxA5nvU2qC68YUvS9VD')
    ).toEqual(
      decodeAddress('5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaQua')
    );
  });

  it.skip('allows invalid prefix (in list)', (): void => {
    expect(
      (): Uint8Array => decodeAddress('6GfvWUvHvU8otbZ7sFhXH4eYeMcKdUkL61P3nFy52efEPVUx')
    ).toThrow(/address prefix/);
  });

  it('fails when length is invalid', (): void => {
    expect(
      (): Uint8Array => decodeAddress('y9EMHt34JJo4rWLSaxoLGdYXvjgSXEd4zHUnQgfNzwES8b')
    ).toThrow(/address length/);
  });

  it('fails when the checksum does not match', (): void => {
    expect(
      (): Uint8Array => decodeAddress('5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMa9cj')
    ).toThrow(/address checksum/);
    expect(
      (): Uint8Array => decodeAddress('5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDwU')
    ).toThrow(/address checksum/);
  });

  it('fails when invalid base58 encoded address is found', (): void => {
    expect(
      () => u8aToHex(decodeAddress('F3opIRbN5ZbjJNU511Kj2TLuzFcDq9BGduA9TgiECafpg29'))
    ).toThrow(/Decoding F3opIRbN5ZbjJNU511Kj2TLuzFcDq9BGduA9TgiECafpg29: Invalid base58 character "I" \(0x49\) at index 4/);
  });
});
