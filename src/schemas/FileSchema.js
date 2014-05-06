'use strict';

// Load core modules
var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

var File = new Schema( {
	'path'     : String,
	'checksum' : String,
	'contents' : String
} );

mongoose.model( 'File', File );
