/* Load Event entity */
const EventEntity = require('../model/evententity');

/* Load DAO Common functions */
const daoCommon = require('./commons/daoCommon');

/**
 * Event Data Access Object
 */
class EventDao {

    constructor() {
        this.common = new daoCommon();
    }

    /**
     * Tries to find an entity using its Id / Primary Key
     * @params id
     * @return entity
     */
    findById(id) {
        let sqlRequest = "SELECT id, title, desc, expires FROM Event WHERE id=$id";
        let sqlParams = {$id: id};
        return this.common.findOne(sqlRequest, sqlParams).then(row =>
            new EventEntity(row.id, row.title, row.desc, row.expires));
    };

    /**
     * Finds all entities.
     * @return all entities
     */
    findAll(mindate) {
        let sqlRequest = "SELECT id, title, expires FROM Event WHERE expires >= $mindate ORDER BY expires ASC";
        let sqlParams = { $mindate: mindate };
        return this.common.findAll(sqlRequest,sqlParams).then(rows => {
            let Events = [];
            for (const row of rows) {
                Events.push(new EventEntity(row.id, row.title, undefined, row.expires));
            }
            return Events;
        });
    };
    
    /**
     * Counts all the records present in the database for a given mindate
     * @return count
     */
    countAll(mindate) {
        let sqlRequest = "SELECT COUNT(*) AS count FROM Event WHERE expires >= $mindate";
        let sqlParams = { $mindate: mindate };

        return this.common.findOne(sqlRequest,sqlParams);
    };

    /**
     * Updates the given entity in the database
     * @params Event
     * @return true if the entity has been updated, false if not found and not updated
     */
    update(eventEntity) {
        let sqlRequest = "UPDATE Event SET " +
            "title=$title, " +
            "desc=$desc, " +
            "expires=$expires " +
            "WHERE id=$id";

        let sqlParams = {
            $title: eventEntity.title,
            $desc: eventEntity.description,
            $expires: eventEntity.expires,
            $id: eventEntity.id
        };
        return this.common.run(sqlRequest, sqlParams);
    };

    /**
     * Creates the given entity in the database
     * @params Event
     * returns database insertion status
     */
    create(eventEntity) {
        let sqlRequest = "INSERT INTO Event (title, desc, expires) " +
            "VALUES ($title, $desc, $expires)";
        let sqlParams = {
            $title: eventEntity.title,
            $desc: eventEntity.description,
            $expires: eventEntity.expires
        };
        return this.common.run(sqlRequest, sqlParams);
    };

    /**
     * Creates the given entity with a provided id in the database
     * @params Event
     * returns database insertion status
     */
    createWithId(eventEntity) {
        let sqlRequest = "INSERT into Event (id, title, desc, expires) " +
            "VALUES ($id, $title, $desc, $expires)";
        let sqlParams = {
            $id: eventEntity.id,
            $title: eventEntity.title,
            $desc: eventEntity.description,
            $expires: eventEntity.expires
        };
        return this.common.run(sqlRequest, sqlParams);
    };

    /**
     * Deletes an entity using its Id / Primary Key
     * @params id
     * returns database deletion status
     */
    deleteById(id) {
        let sqlRequest = "DELETE FROM Event WHERE id=$id";
        let sqlParams = {$id: id};
        return this.common.run(sqlRequest, sqlParams);
    };

    /**
     * Returns true if an entity exists with the given Id / Primary Key
     * @params id
     * returns database entry existence status (true/false)
     */
    exists(id) {
        let sqlRequest = "SELECT (count(*) > 0) as found FROM Event WHERE id=$id";
        let sqlParams = {$id: id};
        return this.common.run(sqlRequest, sqlParams);
    };
}

module.exports = EventDao;