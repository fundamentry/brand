declare const brand: unique symbol;

export namespace Brand {
  interface Marker<T, B extends PropertyKey> {
    readonly [brand]: {
      readonly base: T;
      readonly names: { readonly [K in B]: K };
    };
  }

  export type Any = Marker<unknown, never>;

  export type Unbranded<T extends Any> = T[typeof brand]['base'];

  export type Branded<T, B extends PropertyKey> = T &
    Marker<T extends Any ? Unbranded<T> : T, B>;

  export const nominal = <T extends Any>(value: Unbranded<T>) => value as T;
}
