declare const __brand: unique symbol;
export type Branded<T, B extends string> = T & {
    readonly [__brand]: B;
};
export declare function brand<T, B extends string>(value: T): Branded<T, B>;
export declare function unbrand<T>(branded: Branded<T, string>): T;
export {};
//# sourceMappingURL=branded.d.ts.map