
/* IMPORT */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {parseArgv} from 'specialist';
import readdir from 'tiny-readdir';

/* HELPERS */

const Helpers = {

  /* API */

  getOptions: (): { ext?: string, root: string, propsRe: RegExp } => {

    const {folder, ext, props} = parseArgv ( process.argv );
    const root = path.resolve ( process.cwd (), folder );
    const propsRe = new RegExp ( `(?<!\\w|\\/\\S*)(${props.replaceAll ( ',', '|' )})(?!\\w)`, 'g' );
    const options = {ext, root, propsRe};

    return options;

  },

  getMangled: (() => {

    const cache: Record<string, string> = {};
    let index = 0;

    const getIdentifier = (): string => {
      const identifier = (index++).toString ( 32 ).toUpperCase ();
      if ( /^[a-z0-9]/.test ( identifier ) ) return getIdentifier (); // Skipping identifiers starting with a number (invalid) or with a lower case character (high probability of collision)
      return identifier;
    };

    const getIdentifierProp = ( prop: string ): string => {
      return cache[prop] || ( cache[prop] = getIdentifier () );
    };

    return getIdentifierProp;

  })(),

  getSources: async (): Promise<string[]> => {

    const {ext, root} = Helpers.getOptions ();
    const {files} = await readdir ( root, { followSymlinks: false } );
    const sourceRe = /\.(js|jsx|ts|tsx)$/;
    const isSource = ( file: string ) => sourceRe.test ( file ) && ( !ext || file.endsWith ( ext ) );
    const sources = files.filter ( isSource );

    return sources;

  }

};

/* MAIN */

const Mangler = {

  /* API */

  mangle: async (): Promise<void> => {

    const {propsRe} = Helpers.getOptions ();
    const sources = await Helpers.getSources ();

    let bytesPrev = 0;
    let bytesNext = 0;

    for ( const source of sources ) {

      const contentPrev = fs.readFileSync ( source, 'utf8' );
      const contentNext = contentPrev.replace ( propsRe, Helpers.getMangled );

      bytesPrev += contentPrev.length;
      bytesNext += contentNext.length;

      fs.writeFileSync ( source, contentNext );

    }

    console.log ( `Total bytes: ${bytesPrev} -> ${bytesNext}` );

  }

};

/* EXPORT */

export default Mangler;
