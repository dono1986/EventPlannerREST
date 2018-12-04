/**
 * Event Entity (ES6 Class)
 */

class EventEntity {
    constructor(id, title, description, expires) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.expires = expires;
    }
}

module.exports = EventEntity;