'use strict';

// Load core modules
var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

var ComplexityReport = new Schema( {
	'project'         : String,
	'path'            : String,
	'checksum'        : String,
	'date'            : Date,
	'maintainability' : Number,
	'params'          : Number,
	'functions'       : Array,
	'dependencies'    : Array,
	'aggregate'       : Object
} );

mongoose.model( 'ComplexityReport', ComplexityReport );
