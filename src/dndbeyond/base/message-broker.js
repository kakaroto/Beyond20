
class DDBMessageBroker {
    constructor() {
        this._mb = null;
        this._messageQueue = [];
        this._blockMessages = [];
        this._hooks = {};
        this._characterId = (window.location.pathname.match(/\/characters\/([0-9]+)/) || [])[1];
        this.saveMessages = false;
        this._debug = true;
    }
    uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
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
    /**
     * Hook on events from the message broker of a particular type
     */
    on(event, callback, {once=false, send=true, recv=true}={}) {
        const callbacks = this._hooks[event] || [];
        callbacks.push({callback, once, send, recv});
        this._hooks[event] = callbacks;
    }
    _dispatchHooks(eventType, message, recv) {
        let stopPropagation = false;
        const hooks = this._hooks[eventType] || [];
        for (let idx = 0; idx < hooks.length; idx++) {
            const hook = hooks[idx];
            if (recv && !hook.recv) continue;
            if (!recv && !hook.send) continue;
            if (hook.once) {
                hooks.splice(idx, 1);
                idx--;
            }
            stopPropagation |= hook.callback(message) === false;
            if (stopPropagation) break;
        }
        return stopPropagation;
    }
    _onMessage(message) {
        // Check if we unregistered
        if (!this._mb) return;
        if (this._debug) console.log("Received ", message);
        if (this.saveMessages) {
            this._messageQueue.push(message);
        }
        if (this._dispatchHooks(message.eventType, message, true)) return;
        this._dispatchHooks(null, message, true);
    }
    _onDispatchMessage(message) {
        if (this._debug) console.log("Dispatching ", message);
        const blockIndex = this._blockMessages.findIndex(msg => msg.type === message.eventType);
        if (blockIndex !== -1) {
            if (this._blockMessages[blockIndex].once) {
                this._blockMessages.splice(blockIndex, 1);
            }
            if (this._debug) console.log("Dropped message ", message);
            return;
        }
        if (this._dispatchHooks(message.eventType, message, false)) return;
        if (this._dispatchHooks(null, message, false)) return;
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
    getContext(character) {
        const context = {};
        context.messageScope = this._mb.gameId == '0' ? "userId" : "gameId";
        if (context.messageScope === "gameId") {
            context.messageTarget = this._mb.gameId;
        }
        if (context.messageScope === "userId") {
            context.messageTarget = this._mb.userId;
        }
        context.entityType = this._characterId ? "character" : "user";
        if (context.entityType === "character" && this._characterId) {
            context.entityId = this._characterId;
        }
        if (context.entityType === "user") {
            context.entityId = this._mb.userId;
        }
        if (character) {
            context.name = character.name;
            context.avatarUrl = character.avatar;
        }
        return context;
    }
    postMessage(data) {
        this.register();
        if (!this._mb) return;
        data.id = data.id || this.uuid(),
        data.dateTime = String(data.dateTime || Date.now());
        data.source = data.source || "Beyond20";
        data.persist = data.persist || false;
        const defaultScope = this._mb.gameId == '0' ? "userId" : "gameId";
        const defaultType = this._characterId ? "character" : "user";
        data.messageScope = data.messageScope || defaultScope;
        if (data.messageScope === "gameId") {
            data.messageTarget = data.messageTarget || this._mb.gameId;
        }
        if (data.messageScope === "userId") {
            data.messageTarget = data.messageTarget || this._mb.userId;
        }
        data.entityType = data.entityType || defaultType;
        if (data.entityType === "character" && this._characterId) {
            data.entityId = data.entityId || this._characterId;
        }
        if (data.entityType === "user") {
            data.entityId = data.entityId || this._mb.userId;
        }
        if (this._mb.gameId != '0') {
            data.gameId = data.gameId || this._mb.gameId;
        }
        data.userId = data.userId || this._mb.userId;
        this._mb.dispatch(this._cleanupPostData(data));
    }
    _cleanupPostData(data) {
        // Beyond20 requests will have character's class features and `Thieves' Cant` or `Hexblade's Curse`
        // uses a non-ascii character (’) which gets corrupted when sent over the message broker
        return JSON.parse(JSON.stringify(data).replace(/’/g, "'"))
    }
    flush() {
        this._messageQueue.length = 0;
    }
}