# mqtt-datetime

Publish various date formats to MQTT for use by devices without clocks and no connection to an NTP time server.

## What is it?

mqtt-datetime.js is a Node.js script that reads the date and time from the system it's running on and publishes it to an MQTT broker in a few different formats.

## Why would anybody do that?

The main use case for mqtt-datetime is for network connected microcontrollers that need to access the current date and time. You might be thinking, "But why not NTP?" The NTP protocol is a fine option for getting network time. But, for a tiny microcontroller where resources are tight, it may not be feasible. Many Internet of Things (IoT) devices already use the MQTT to send and receive data, so the protocol is already part of the software.

## How do I use it?

mqtt-datetime publishes date and time information on a few different topics.

* datetime -- A date and time string in a format like: `11/08/2021, 11:24:36`
* datetime/date -- The date portion of the string. Example: `11/08/2021`
* datetime/time -- The time portion of the string. Example: `11:24` Notice there are no seconds. (See below for more on that.)
* datetime/iso -- An ISO8601 formatted datetime string. Example: `2021-08-11T16:24:36.414Z`
* datetime/posix -- Unix-style: seconds since Midnight, Jan 1, 1970 UTC.

Configure it in a cron job that runs every minute and you have a lightweight alternative to using a network time server. 

## What should I watch out for?

Due to the time it takes to publish the data, it's not accurate down to the second. In fact, it may not be accurate at all. Uee it with that thought in mind. The topic is published with the retain flag set, so the MQTT broker will keep the last know datetime until it receives an update. This is great for devices that go into a deep sleep state. The disadvantage comes if the datetime ever fails to update. If the cron job fails for any reason, the date and time will be stuck in the past.

## Possible use cases.

I created this to allow me to display date and time info on the display of a weather station. The device can connect to WiFi and interact with MQTT. I reads and displays temperature, humidity, and barometric pressure. It dows no have a real time clock or NTP client. But, subscribing to the datetime MQTT topic will allow it to print date and time to the display.

IT could also be useful for data logging sensors. For example, devices that record data to an internal micro SD card could add a date time stamp to give some clarity as to when the data was collected.
