
class DDBMessageBroker {
    constructor() {
        this._mb = null;
        this._messageQueue = [];
        this._blockMessages = [];
    }
    register() {
        if (this._mb) return;
        const key = Symbol.for('@dndbeyond/message-broker-lib')
        if (key)
            this._mb = window[key];
        if (!this._mb) return;
        this._mb.subscribe(this._onMessage.bind(this));
        this._mbDispatch = this._mb.dispatch.bind(this._mb);
        this._mb.dispatch = this._onDispatchMessage.bind(this);
    }
    unregister() {
        if (!this._mb) return;
        if (this._mbDispatch) {
            this._mb.dispatch = this._mbDispatch;
            this._mbDispatch = null;
        }
        // We can't unsubscribe from the _onMessage
        this._mb = null;
    }
    _onMessage(message) {
        // Check if we unregistered
        if (!this._mb) return;
        //console.log("Received ", message);
        this._messageQueue.push(message);
    }
    _onDispatchMessage(message) {
        //console.log("Dispatching ", message);
        const blockIndex = this._blockMessages.findIndex(msg => msg.type === message.eventType);
        if (blockIndex !== -1) {
            if (this._blockMessages[blockIndex].once) {
                this._blockMessages.splice(blockIndex, 1);
            }
            //console.log("Dropped message ", message);
            return;
        }
        this._mbDispatch(message);
    }
    blockMessages(msg) {
        this.register();
        this._blockMessages.push(msg);
    }
    getPendingMessages(type) {
        this.register();
        return this._messageQueue.filter(m => m.eventType === type);
    }
    postMessage(data) {
        this.register();
        if (!this._mb) return;
        data.source = data.source || "Beyond20";
        this._mb.dispatch(data);
    }
    flush() {
        this._messageQueue.length = 0;
    }
}