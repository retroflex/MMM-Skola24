/* Magic Mirror
 * Module: MMM-Skola24
 *
 * By Johan Persson, https://github.com/retroflex
 * MIT Licensed.
 */

const nodeHelper = require('node_helper');
const axios = require('axios');
const luxon = require('luxon');

module.exports = nodeHelper.create({
    start: function() {
    },

    // Notification from module js.
    // @param notification - Notification type.
    // @param payload - .
    socketNotificationReceived: async function(notification, payload) {
        if (notification === 'LOAD_SCHEMA') {
            const identifier = payload.identifier;
            const key = await this.getKey();
            const schemaJson = await this.getSchemaJson(key, payload.host, payload.unitGuid, payload.selection, payload.width, payload.height);
            this.sendSocketNotification('SCHEMA', {identifier: identifier, schemaJson: schemaJson});
            return;
        }
    },

    getKey: async function() {
        try {
            const postData = 'null';
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Scope': '8a22163c-8662-4535-9050-bc5e1923df48',
                    'Content-Length': postData.length
                }
            };
            const response = await axios.post('https://web.skola24.se/api/get/timetable/render/key', postData, config);
            const key = response['data']['data']['key'];
            return key;
        } catch (e) {
            console.error('MMM-Skola24: Exception when getting key: ' + e);
        }
    },
    
    getSchemaJson: async function(key, host, unitGuid, selection, width, height) {
        try {
            // Show next week's schema on the weekend.
            const now = luxon.DateTime.now();
            if (now.weekday === 6)       // 6 = Saturday
              timeToShow = now.plus({days: 2});
            else if (now.weekday === 7)  // 7 = Sunday
              timeToShow = now.plus({days: 1});
            else
              timeToShow = now;

            const json = {};
            json['renderKey'] = key;
            json['host'] = host;
            json['unitGuid'] = unitGuid;
            json['scheduleDay'] = 0;
            json['blackAndWhite'] = false;
            json['width'] = width;
            json['height'] = height;
            json['selection'] = selection;
            json['showHeader'] = false;
            json['week'] = timeToShow.weekNumber;
            json['year'] = timeToShow.year;
            postData = JSON.stringify(json);

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Scope': '8a22163c-8662-4535-9050-bc5e1923df48',
                    'Content-Length': postData.length
                }
            };
            const response = await axios.post(' https://web.skola24.se/api/render/timetable', postData, config);            
            const schema = response['data']['data'];
            return schema;
        } catch (e) {
            console.error('MMM-Skola24: Exception when getting schema: ' + e);
        }
    }
});
