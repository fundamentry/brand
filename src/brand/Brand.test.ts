import { describe, expect, expectTypeOf, it } from 'vitest';

import { Brand } from './Brand.js';

type A = Brand.Branded<string, 'a'>;
type B = Brand.Branded<number, 'b'>;
type Point = Brand.Branded<{ x: number; y: number }, 'point'>;

describe('Brand.nominal', () => {
  it('returns the given primitive value unchanged', () => {
    expect(Brand.nominal<A>('test')).toBe('test');
    expect(Brand.nominal<B>(42)).toBe(42);
  });

  it('returns the given object value unchanged (same reference)', () => {
    const raw = { x: 1, y: 2 };

    expect(Brand.nominal<Point>(raw)).toBe(raw);
  });

  it('produces a value assignable to the branded type', () => {
    const id = Brand.nominal<A>('test');

    expectTypeOf(id).toEqualTypeOf<A>();
  });
});

describe('Brand.Branded', () => {
  it('is not structurally assignable from its unbranded base type', () => {
    expectTypeOf<string>().not.toExtend<A>();
  });

  it('keeps distinct brands from being assignable to one another', () => {
    expectTypeOf<A>().not.toExtend<B>();
  });
});

describe('Brand.Unbranded', () => {
  it('strips the brand back down to a type the base type is assignable to', () => {
    expectTypeOf<string>().toExtend<Brand.Unbranded<A>>();
    expectTypeOf<number>().toExtend<Brand.Unbranded<B>>();
  });
});
