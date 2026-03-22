export type DomainEvent<T extends string = string, P = unknown> = Readonly<{
    type: T;
    occurredAt: Date;
    payload: P;
}>;
export declare function createDomainEvent<T extends string, P>(type: T, payload: P): DomainEvent<T, P>;
//# sourceMappingURL=domain-event.d.ts.map