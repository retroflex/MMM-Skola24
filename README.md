# MMM-Skola24
A [MagicMirror²](https://github.com/MichMich/MagicMirror) module that shows Swedish school timetables from Skola24.

# Installation
1. Clone repo:
```
	cd MagicMirror/modules/
	git clone https://github.com/retroflex/MMM-Skola24
```
2. Install dependencies:
```
	cd MMM-Skola24/
	npm install
```
3. Add the module to the ../MagicMirror/config/config.js, example:
```
		{
			module: 'MMM-Skola24',
			header: 'My Timetable',
			position: 'bottom_right',
			config: {
				host: 'goteborg.skola24.se',
				unitGuid: 'ODJiYjcwYjEtYWE3MS1mNGU1LWFhNDktOTU2ZDM5M2M4NmQ5',
				selection: 'OGQ5ZmM5YTQtOTZkMi1mY2I4LWE4M2ItZTJiZjI5MjFiMmEx',
			}
		},
```

# Configuration
| Option                        | Description
| ------------------------------| -----------
| `host`                        | The hostname of the "domain" (most often the municipality) where the school is located.<br />**Default value:** 'goteborg.skola24.se'
| `unitGuid`                    | An ID specifying the school.<br />**Default value:**'ODJiYjcwYjEtYWE3MS1mNGU1LWFhNDktOTU2ZDM5M2M4NmQ5'
| `selection`                   | An ID specifying the class (e.g. 3A).<br />**Default value:**'OGQ5ZmM5YTQtOTZkMi1mY2I4LWE4M2ItZTJiZjI5MjFiMmEx'
| `width`                       | Width in pixels of the timetable.<br />**Default value:**600
| `height`                      | Original height in pixels of the timetable. The rendered timetable will be much less than this as the free times at the end of each days and the footer is clipped.<br />**Default value:**600
| `darkMode`                    | True to fit the standard MagicMirror theme. False for the usual bright timetable colors.<br />**Default value:**true
| `darkModeRecolorLessons`      | Only used in dark mode. True to color all lesson boxes dark green. False to keep original colors (which imo are to bright for MagicMirror).<br />**Default value:**true

The `unitGuid` and `selection` values can be fetched with your browser's developer tools (open with F12 in browser). Go to e.g. https://web.skola24.se/timetable/timetable-viewer/goteborg.skola24.se/any-test, select the school and class and inspect the outgoing network traffic and you can find these values.
