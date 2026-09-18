declare const brand: unique symbol;

export namespace Brand {
  export type Branded<T, B> = T & {
    readonly [brand]: B;
  };

  export type Unbranded<B extends Branded<unknown, unknown>> = Omit<
    B,
    typeof brand
  >;

  export const nominal = <T extends Branded<unknown, unknown>>(
    value: Unbranded<T>
  ) => value as T;
}
