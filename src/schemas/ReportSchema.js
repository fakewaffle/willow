'use strict';

// Load core modules
var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

var Report = new Schema( {
	'project'      : String,
	'paths'        : Array,
	'changedPaths' : Array,
	'date'         : Date
} );

mongoose.model( 'Report', Report );
