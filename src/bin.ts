#!/usr/bin/env node

/* IMPORT */

import {bin} from 'specialist';
import Mangler from '.';

/* MAIN */

bin ( 'manger', 'A simple JavaScript mangler that works across multiple files' )
  /* DEFAULT COMMAND */
  .option ( '--ext <extension>', 'The extension of the files to consider' )
  .option ( '--folder <folder>', 'The target folder where to seearch for files to mangle', { required: true } )
  .option ( '--props <props>', 'The comma-separated list of properties to mangle', { required: true } )
  .action ( Mangler.mangle )
  /* RUN */
  .run ();
