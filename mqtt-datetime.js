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
const mqttUser = 'mqtt';
const mqttPassword = 'password';
const mqttTopicRoot = 'datetime';

const mqtt = require('mqtt');  // This package comes from NPM. Install with the command 'npm -i mqtt'.

let mqttClient = mqtt.connect(mqttUrl, {mqttUser, mqttPassword});
mqttClient.on('connect', () => {
  now = new Date();
  mqttClient.publish(mqttTopicRoot, now.toLocaleString(), {retain: "true"});
  mqttClient.publish(`${mqttTopicRoot}/date`,  now.toLocaleDateString(), {retain: "true"});
  mqttClient.publish(`${mqttTopicRoot}/time`, `${now.getHours()}:${now.getMinutes()}`, {retain: "true"});
  mqttClient.publish(`${mqttTopicRoot}/iso`, now.toISOString(), {retain: "true"});
  mqttClient.publish(`${mqttTopicRoot}/posix`, (now * 1000).toString(), {retain: "true"});
  mqttClient.end();
});

mqttClient.on('error', () => {
  console.log('Unable to connect to MQTT broker.');
});
