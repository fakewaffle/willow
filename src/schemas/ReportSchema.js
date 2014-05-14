'use strict';

// Load core modules
var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

var Report = new Schema( {
	'project'      : String,
	'date'         : Date,
	'paths'        : Array,
	'changedPaths' : Array,
	'averages'     : Object
} );

mongoose.model( 'Report', Report );
