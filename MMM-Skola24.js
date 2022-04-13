/* Magic Mirror
 * Module: MMM-Skola24
 *
 * By Johan Persson, https://github.com/retroflex
 * MIT Licensed.
 */

Module.register('MMM-Skola24', {
    // Default configuration.
    defaults: {
        width: 600,
        height: 600,
        host: 'goteborg.skola24.se',
        unitGuid: 'ODJiYjcwYjEtYWE3MS1mNGU1LWFhNDktOTU2ZDM5M2M4NmQ5',   // School: Lärjeskolan
        selection: 'OGQ5ZmM5YTQtOTZkMi1mY2I4LWE4M2ItZTJiZjI5MjFiMmEx',  // Class: 4A
        darkMode: true,
        darkModeRecolorLessons: true  // True if all lessons should be green in dark mode. False if original colors should be kept also in dark mode.
    },

    // Notification from node_helper.js.
    // The schema data is received here and copied. Then module is redrawn.
    // @param notification - Notification type.
    // @param payload - Contains module instance identifier and schema data in JSON.
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'SCHEMA') {
            if (null == payload)
              return;

            if (null == payload.identifier)
              return;

            if (payload.identifier !== this.identifier)  // To make sure the correct instance is updated, since they share node_helper.
              return;

            if (null == payload.schemaJson)
              return;

            this.schemaJson = payload.schemaJson;
            this.updateDom(0);
        }
    },

    // Override dom generator.
    getDom: function() {
        if (this.schemaJson === null)
          return "Laddar...";
        
        let height = this.calculateHeight();

        let canvas = document.createElement('canvas');
        canvas.width  = this.config.width;
        canvas.height = height;

        let ctx = canvas.getContext('2d');

        const boxList = this.schemaJson['boxList'];
        if (boxList !== undefined)
        {
            for (let i = 0; i < boxList.length; ++i) {
                const box = boxList[i];
                const type = box['type'];

                const x = box['x'];
                const y = box['y'];
                const width = box['width'];
                const height = box['height'];
                let bColor = box['bColor'];
                let fColor = box['fColor'];

                if (this.config.darkMode)
                {
                  if (type === 'ClockAxisBox' ||
                      type === 'HeadingDay')
                  {
                      bColor = fColor = '#000000';
                  }
                  else if (type === 'TimetableDay')
                  {
                      bColor = '#000000';
                      fColor = '#404040';
                  }
                  else if (type === 'Lesson')
                  {
                    if (this.config.darkModeRecolorLessons)
                    {
                        bColor = '#005020';
                        fColor = '#e0fff0';
                    }
                  }
                  else if (type === 'ClockFrameStart' ||
                           type === 'ClockFrameEnd')
                  {
                      bColor = fColor = 'rgba(0, 0, 0, 0.5)';
                  }
                  else
                  {
                      bColor = this.invertColor(bColor);
                      fColor = this.invertColor(fColor);
                  }
                }

                ctx.fillStyle = bColor;
                ctx.fillRect(x, y, width, height);
                ctx.strokeStyle = fColor;
                ctx.strokeRect(x, y, width, height);
            }
        }

        const lineList = this.schemaJson['lineList'];
        if (lineList !== undefined)
        {
            for (let i = 0; i < lineList.length; ++i) {
                const line = lineList[i];
                const type = line['type'];
                const p1x = line['p1x'];
                const p1y = line['p1y'];
                const p2x = line['p2x'];
                const p2y = line['p2y'];
                let color = line['color'];
                
                if (this.config.darkMode)
                    color = '#404040';

                ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.moveTo(p1x, p1y);
                ctx.lineTo(p2x, p2y);
                ctx.stroke();
            }
        }

        const textList = this.schemaJson['textList'];
        if (textList !== undefined)
        {
            for (let i = 0; i < textList.length; ++i) {
                const text = textList[i];
                const type = text['type'];
                const x = text['x'];
                const y = text['y'] + 2;  // +2 because it looks better.
                let fColor = text['fColor'];
                const fontsize = text['fontsize'];
                const str = text['text'];
                let bold = text['bold'];
                const italic = text['italic'];

                if (this.config.darkMode)
                {
                  const keepColor = (type === 'Lesson' && !this.config.darkModeRecolorLessons);
                  if (!keepColor)
                    fColor = '#ffffff';
                }

                if (type === 'Lesson')
                    bold = true;

                let font = '';
                if (bold === true)
                    font += 'bold ';

                if (italic === true)
                    font += 'italic ';

                font += fontsize + 'px Roboto, Arial, Helvetica, sans-serif';

                ctx.font = font;
                ctx.fillStyle = fColor;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                ctx.fillText(str, x, y);
            }
        }

        let borderColor = '#404040';
        ctx.strokeStyle = borderColor;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        return canvas;
    },

    // Override start to init stuff.
    start: function() {
        this.schemaJson = null;

        // Tell node_helper to load schema data at startup.
        this.sendSocketNotification('LOAD_SCHEMA', { identifier: this.identifier,
                                                     host: this.config.host,
                                                     unitGuid: this.config.unitGuid,
                                                     selection: this.config.selection,
                                                     width: this.config.width,
                                                     height: this.config.height });

        // Make sure schema data is reloaded each hour.
        let self = this;
        setInterval(function() {
            self.sendSocketNotification('LOAD_SCHEMA', { identifier: this.identifier,
                                                         host: this.config.host,
                                                         unitGuid: this.config.unitGuid,
                                                         selection: this.config.selection,
                                                         width: this.config.width,
                                                         height: this.config.height });
        }, 60 * 60 * 1000); // In millisecs. Refresh every hour.
    },

    // Calculates the height of the schema data by only including lessons.
    // This means free time after lessons + footer will be clipped.
    // The footer has only been a big empty box in all examples I have seen.
    calculateHeight: function()
    {
        let maxHeight = 50;  // Any small number bigger than 0.
        const boxList = this.schemaJson['boxList'];
        if (boxList !== undefined)
        {
            for (let i = 0; i < boxList.length; ++i) {
                const box = boxList[i];
                const type = box['type'];

                // Only include lessons (and their start + end times) => unused space at bottom is removed.
                if (type === 'Lesson' ||
                    type === 'ClockFrameStart' ||
                    type === 'ClockFrameEnd')
                {
                    const y = box['y'];
                    const height = box['height'];
                
                    maxHeight = Math.max(maxHeight, y + height);
                }
            }
        }
        
        const margin = 20;
        return maxHeight + margin;
    },
    
    invertColor: function(hex) {
        if (hex.indexOf('#') === 0) {
            hex = hex.slice(1);
        }
        // convert 3-digit hex to 6-digits.
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        if (hex.length !== 6) {
            throw new Error('Invalid HEX color.');
        }
        // invert color components
        let r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
            g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
            b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
        // pad each with zeros and return
        return '#' + this.padZero(r) + this.padZero(g) + this.padZero(b);
    },

    padZero: function(str, len) {
        len = len || 2;
        let zeros = new Array(len).join('0');
        return (zeros + str).slice(-len);
    }
});
