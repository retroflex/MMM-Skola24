# MMM-Skola24
A [MagicMirror²](https://github.com/MichMich/MagicMirror) module that shows Swedish school timetables from Skola24.

![image](https://user-images.githubusercontent.com/25268023/163270857-f13185dc-593f-4662-b863-70216571c297.png)

[Bright mode screenshot](https://user-images.githubusercontent.com/25268023/163323529-1d9d37a6-c80f-46b9-bb2c-11c9da47f14f.png)<br />
[Colored dark mode screenshot](https://user-images.githubusercontent.com/25268023/163323552-0e28268f-2249-4266-a6f8-96f820284176.png)

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
| `host`                        | The hostname of the "domain" (most often the municipality) where the school is located.<br />**Default value:** `'goteborg.skola24.se'`
| `unitGuid`                    | An ID specifying the school.<br />**Default value:** `'ODJiYjcwYjEtYWE3MS1mNGU1LWFhNDktOTU2ZDM5M2M4NmQ5'`
| `selection`                   | An ID specifying the class (e.g. 3A).<br />**Default value:** `'OGQ5ZmM5YTQtOTZkMi1mY2I4LWE4M2ItZTJiZjI5MjFiMmEx'`
| `width`                       | Width in pixels of the timetable.<br />**Default value:** `600`
| `height`                      | Original height in pixels of the timetable. The rendered timetable will be much less than this as the free times at the end of each days and the footer is clipped.<br />**Default value:** `600`
| `darkMode`                    | True to fit the standard MagicMirror theme. False for the usual bright timetable colors.<br />**Default value:** `true`
| `darkModeRecolorLessons`      | Only used in dark mode. True to color all lesson boxes dark green. False to keep original colors (which imo are to bright for MagicMirror).<br />**Default value:** `true`

The `unitGuid` and `selection` values can be fetched with your browser's developer tools (open with F12 in browser). Go to e.g. https://web.skola24.se/timetable/timetable-viewer/goteborg.skola24.se/any-test, select the school and class and inspect the outgoing network traffic and you can find these values.

# Details
On weekdays, the timetable for the current week is shown. On the weekend it will instead show the timetable for the upcoming week.
