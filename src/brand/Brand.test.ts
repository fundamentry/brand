import { describe, expect, expectTypeOf, it } from 'vitest';

import { Brand } from './Brand.js';

type A = Brand.Branded<string, 'a'>;
type B = Brand.Branded<string, 'b'>;
type C = Brand.Branded<number, 'c'>;
type AB = A & B;
type Point = Brand.Branded<{ x: number; y: number }, 'point'>;

describe('Brand.nominal', () => {
  it('returns the given primitive value unchanged', () => {
    expect(Brand.nominal<A>('test')).toBe('test');
    expect(Brand.nominal<C>(42)).toBe(42);
  });

  it('returns the given object value unchanged (same reference)', () => {
    const raw = { x: 1, y: 2 };

    expect(Brand.nominal<Point>(raw)).toBe(raw);
  });

  it('produces a value assignable to the branded type', () => {
    const id = Brand.nominal<A>('test');

    expectTypeOf(id).toEqualTypeOf<A>();
  });

  it('accepts a partially branded value when adding further brands', () => {
    const a = Brand.nominal<A>('test');

    expectTypeOf(Brand.nominal<AB>(a)).toEqualTypeOf<AB>();
  });
});

describe('combined brands', () => {
  it('does not collapse to never', () => {
    expectTypeOf<AB>().not.toBeNever();
  });

  it('is assignable to each of its constituent brands', () => {
    expectTypeOf<AB>().toExtend<A>();
    expectTypeOf<AB>().toExtend<B>();
  });

  it('is not assignable from any single constituent brand', () => {
    expectTypeOf<A>().not.toExtend<AB>();
    expectTypeOf<B>().not.toExtend<AB>();
  });

  it('is equivalent whether intersected or nested', () => {
    type Nested = Brand.Branded<A, 'b'>;

    expectTypeOf<Nested>().toExtend<AB>();
    expectTypeOf<AB>().toExtend<Nested>();
  });

  it('remains usable as its base type', () => {
    expectTypeOf<AB>().toExtend<string>();
  });
});

describe('Brand.Branded', () => {
  it('is not structurally assignable from its unbranded base type', () => {
    expectTypeOf<string>().not.toExtend<A>();
  });

  it('keeps distinct brands from being assignable to one another', () => {
    expectTypeOf<A>().not.toExtend<B>();
    expectTypeOf<B>().not.toExtend<A>();
    expectTypeOf<A>().not.toExtend<C>();
  });
});

describe('Brand.Any', () => {
  it('is extended by every branded type', () => {
    expectTypeOf<A>().toExtend<Brand.Any>();
    expectTypeOf<C>().toExtend<Brand.Any>();
    expectTypeOf<AB>().toExtend<Brand.Any>();
    expectTypeOf<Point>().toExtend<Brand.Any>();
  });

  it('is not extended by unbranded types', () => {
    expectTypeOf<string>().not.toExtend<Brand.Any>();
    expectTypeOf<{ x: number; y: number }>().not.toExtend<Brand.Any>();
  });
});

describe('Brand.Unbranded', () => {
  it('strips the brand back down to a type the base type is assignable to', () => {
    expectTypeOf<string>().toExtend<Brand.Unbranded<A>>();
    expectTypeOf<number>().toExtend<Brand.Unbranded<C>>();
  });

  it('recovers the exact base type', () => {
    expectTypeOf<Brand.Unbranded<A>>().toEqualTypeOf<string>();
    expectTypeOf<Brand.Unbranded<Point>>().toEqualTypeOf<{
      x: number;
      y: number;
    }>();
  });

  it('strips every brand from a combined brand', () => {
    expectTypeOf<Brand.Unbranded<AB>>().toEqualTypeOf<string>();
    expectTypeOf<
      Brand.Unbranded<Brand.Branded<A, 'b'>>
    >().toEqualTypeOf<string>();
  });
});
