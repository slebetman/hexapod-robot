#! /usr/bin/env node

"use strict"

var Gpio = require('pigpio').Gpio;
var path = require('path');
var express = require('express');
var app = express();

var CENTER = 1500;
var SERVO_TRAVEL = 600;
var FULL_TRAVEL = 100;

var servos = {
	left : {
		h : {
			f: new Gpio(7,{mode: Gpio.OUTPUT}),
			m: new Gpio(8,{mode: Gpio.OUTPUT}),
			r: new Gpio(21,{mode: Gpio.OUTPUT})
		},
		v : {
			f: new Gpio(12,{mode: Gpio.OUTPUT}),
			m: new Gpio(20,{mode: Gpio.OUTPUT}),
			r: new Gpio(16,{mode: Gpio.OUTPUT})
		}
	},
	// right : {
	// 	h : {
	// 		f: new Gpio(5,{mode: Gpio.OUTPUT}),
	// 		m: new Gpio(11,{mode: Gpio.OUTPUT}),
	// 		r: new Gpio(26,{mode: Gpio.OUTPUT})
	// 	},
	// 	v : {
	// 		f: new Gpio(6,{mode: Gpio.OUTPUT}),
	// 		m: new Gpio(19,{mode: Gpio.OUTPUT}),
	// 		r: new Gpio(13,{mode: Gpio.OUTPUT})
	// 	}
	// }
}

function setServo (servo, position) {
	var travel = Math.round((position/FULL_TRAVEL) * SERVO_TRAVEL);
	servo.servoWrite(CENTER+travel);
}

for (var side in servos) {
	for (var joint in servos[side]) {
		for (var leg in servos[side][joint]) {
			setServo(servos[side][joint][leg], 0); // center all
		}
	}
}

app.get('/', (req,res) => {
	res.sendFile(__dirname + '/resources/index.html');
});

app.get('/control', (req,res) => {
	var position = +(req.query.pos);
	try {
		setServo(position);
		res.send('OK');
	}
	catch (err) {
		res.send(err);
	}
});

app.use(express.static('resources'));

app.listen(7070, () => {
	console.log('server started on port 8877');
});
