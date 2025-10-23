// ✅ Include this in your package
export class OutboxMessage {
    id: number;
    message_id: string;
    exchange: string;
    routing_key: string;
    type: string;
    headers: any;
    properties: any;
    body: any;
    status: 'PENDING' | 'SENT';
    sent_at: Date;
    created_at: Date;
    updated_at: Date;

    public markAsSent(): void {
        if (this.status === 'SENT') {
            throw new Error('Message is already marked as sent.');
        }
        this.status = 'SENT';
        this.sent_at = new Date();
    }

    getProperties(): any {
        return { ...this.properties, headers: this.headers };
    }

    getBody(): any {
        return this.body;
    }

    getDestination() {
        return {
            exchange: this.exchange,
            routingKey: this.routing_key,
        };
    }
}
