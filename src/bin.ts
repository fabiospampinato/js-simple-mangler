#!/usr/bin/env node

/* IMPORT */

import {program, updater} from 'specialist';
import Mangler from '.';

/* HELPERS */

const name = 'js-simple-mangler';
const version = '1.0.0';
const description = 'A simple JavaScript mangler that works across multiple files.';

/* MAIN */

updater ({ name, version });

program
  .name ( name )
  .version ( version )
  .description ( description )
  .option ( '--ext', 'The extension of the files to consider' )
  .option ( '--folder <folder>', 'The target folder where to seearch for files to mangle' )
  .option ( '--props <props>', 'The list of properties to mangle' )
  .action ( async () => {
    await Mangler.mangle ();
    process.exit ( 0 );
  });

program.parse ();
