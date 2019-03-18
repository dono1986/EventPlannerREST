/* Load Event Data Access Object */
const EventDao = require('../dao/eventDao');

/* Load Controller Common function */
const ControllerCommon = require('./common/controllerCommon');

/* Load Event entity */
const EventEntity = require('../model/evententity');

/* Load moment.js for date validation */
const Moment = require("moment")



/**
 * Event Controller
 */
class EventController {

    constructor() {
        this.EventDao = new EventDao();
        this.common = new ControllerCommon();
    }

    /**
     * Tries to find an entity using its Id / Primary Key
     * @params req, res
     * @return entity
     */
    findById(req, res) {
        let id = req.params.id;

        this.EventDao.findById(id)
            .then(this.common.findSuccess(res))
            .catch(this.common.findError(res));
    };

    isDateFormatCorrect(date) {
        return Moment(date, 'YYYY-MM-DD', true).isValid();
    }

    ensureCorrectDateFormat(date, res) {
        if(!this.isDateFormatCorrect(date)) {
            res.status(400); // bad request
            res.json({"errorCode": 11, "message": "Bad date format. Must be YYYY-MM-DD"});
            return false;
        }
        return true;
    }

    /**
     * Finds all entities.
     * @return all entities
     */
    findAll(req, res) {

        let date = new Date();
        let day = date.getUTCDate();
        let month = date.getUTCMonth();
        let year = date.getUTCFullYear();
        let timestamp = year + '-' + (month<10 ? '0' + month : month) + '-' + (day<10 ? '0' + day : day);

        let mindate = timestamp;

        if(req.query.mindate) {
            if(!this.ensureCorrectDateFormat(req.query.mindate, res)) return;
            mindate = req.query.mindate;
        }

        //const mindate = req.query.mindate && this.isDateFormatCorrect(req.query.mindate) ? req.query.mindate : timestamp;

		this.EventDao.findAll(mindate)
            .then(this.common.findSuccess(res))
            .catch(this.common.findError(res));
    };

    /**
     * Counts all the records present in the database
     * @return count
     */
    countAll(req, res) {

        let date = new Date();
        let day = date.getUTCDate();
        let month = date.getUTCMonth();
        let year = date.getUTCFullYear();
        let timestamp = year + '-' + (month<10 ? '0' + month : month) + '-' + (day<10 ? '0' + day : day);

        let mindate = timestamp;

        if(req.query.mindate) {
            if(!this.ensureCorrectDateFormat(req.query.mindate, res)) return;
            mindate = req.query.mindate;
        }

        //const mindate = req.query.mindate && this.isDateFormatCorrect(req.query.mindate) ? req.query.mindate : timestamp;

        this.EventDao.countAll(mindate)
            .then(this.common.findSuccess(res))
            .catch(this.common.serverError(res));
    };

    /**
     * Updates the given entity in the database
     * @params req, res
     * @return true if the entity has been updated, false if not found and not updated
     */
    update(req, res) {
        let eventEntity = new EventEntity();
        eventEntity.id = req.params.id;
        eventEntity.title = req.body.title;
        eventEntity.description = req.body.description;

        if(!this.ensureCorrectDateFormat(req.body.expires, res)) return;

        eventEntity.expires = req.body.expires;

        return this.EventDao.update(eventEntity)
            .then(this.common.editSuccess(res))
            .catch(this.common.serverError(res));
    };

    /**
     * Creates the given entity in the database
     * @params req, res
     * returns database insertion status
     */
    create(req, res) {
        let eventEntity = new EventEntity();
        if (req.body.id) {
            eventEntity.id = req.body.id;
        }
        eventEntity.title = req.body.title;
        eventEntity.description = req.body.description;
        
        if(!this.ensureCorrectDateFormat(req.body.expires, res)) return;

        eventEntity.expires = req.body.expires;

        if (req.body.id) {
            return this.EventDao.createWithId(eventEntity)
                .then(this.common.editSuccess(res))
                .catch(this.common.serverError(res));
        }
        else {
            return this.EventDao.create(eventEntity)
                .then(this.common.editSuccess(res))
                .catch(this.common.serverError(res));
        }

    };

    /**
     * Deletes an entity using its Id / Primary Key
     * @params req, res
     * returns database deletion status
     */
    deleteById(req, res) {
        let id = req.params.id;

        this.EventDao.deleteById(id)
            .then(this.common.editSuccess(res))
            .catch(this.common.serverError(res));
    };

    /**
     * Returns true if an entity exists with the given Id / Primary Key
     * @params req, res
     * @return
     */
    exists(req, res) {
        let id = req.params.id;

        this.EventDao.exists(id)
            .then(this.common.existsSuccess(res))
            .catch(this.common.findError(res));
    };
}

module.exports = EventController;