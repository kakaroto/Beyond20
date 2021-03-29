
class DDBMessageBroker {
    constructor() {
        this._mb = null;
        this._messageQueue = [];
    }
    register() {
        // FIXME: This needs to run from the page script context
        if (this._mb) return;
        const key = Symbol.for('@dndbeyond/message-broker-lib')
        if (key)
            this._mb = window[key];
        if (!this._mb) return;
        this._mb.subscribe(this._onMessage.bind(this));
        this._mbPost = this._mb.post.bind(this._mb);
        this._mb.post = this._onPostMessage.bind(this);
    }
    _onMessage(message) {
        console.log("Received ", message);
        this._messageQueue.push(message);
    }
    _onPostMessage(message) {
        console.log("Posting ", message);
        this._mbPost(message);
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