#!/usr/bin/env node

/**
 *  Publish various date formats to MQTT for use by devices without clocks and
 *  no connection to an NTP time server.
 *
 *  Typical application is to run in a cron job, once per minute. Accuracy of
 *  the reported time is limited to increments of +/- minute.
 *
 *  Requires the mqtt package from npm.
 */

// Change to match local settings.
const mqttUrl = 'mqtt://127.0.0.1';
const mqttUser = 'Contoso';
const mqttPassword = 'P@ssw0rd';
const mqttTopicRoot = 'datetime';

const mqtt = require('mqtt');  // This package comes from NPM. Install with the command 'npm -i mqtt'.

let mqttClient = mqtt.connect(mqttUrl, {mqttUser, mqttPassword});
mqttClient.on('connect', () => {
  now = new Date();
  mqttClient.publish(mqttTopicRoot, now.toLocaleString(), true);                               // '11/08/2021, 11:24:36'. Depends on server locale settings.
  mqttClient.publish(`${mqttTopicRoot}/date`,  now.toLocaleDateString(), true);                // '11/08/2021'
  mqttClient.publish(`${mqttTopicRoot}/time`, `${now.getHours()}:${now.getMinutes()}`, true);  // '11:24' No seconds.
  mqttClient.publish(`${mqttTopicRoot}/iso`, now.toISOString(), true);                         // '2021-08-11T16:24:36.414Z'
  mqttClient.publish(`${mqttTopicRoot}/posix`, (now * 1000).toString(), true);                 // Unix-style: seconds since Midnight, Jan 1, 1970 UTC.
  mqttClient.end();
});

mqttClient.on('error', () => {
  console.log('Unable to connect to MQTT broker.');
});
