'use strict';

// Load core modules
var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

var Report = new Schema( {
	'project'         : String,
	'path'            : String,
	'checksum'        : { 'type' : String, 'unique' : true },
	'date'            : Date,
	'maintainability' : Number,
	'params'          : Number,
	'functions'       : Array,
	'dependencies'    : Array,
	'aggregate'       : Object
} );

mongoose.model( 'Report', Report );
