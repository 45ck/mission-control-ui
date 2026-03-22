export function createDomainEvent(type, payload) {
    return { type, occurredAt: new Date(), payload };
}
//# sourceMappingURL=domain-event.js.map