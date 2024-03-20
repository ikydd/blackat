import React from 'react';
import meta from '../../../package.json';
import './SmallPrint.css';

const SmallPrint = () => (
  <div id="small-print">
    <div>
      <p>
        BlacKat is a fan-made website and is not run for profit. Images &amp; universe are
        intellectual property &copy; of{' '}
        <a href="https://www.fantasyflightgames.com">Fantasy Flight Games</a>,{' '}
        <a href="https://company.wizards.com/">Wizards of the Coast</a> and/or{' '}
        <a href="https://nullsignal.games/">Null Signal Games</a>. The BlacKat image is by{' '}
        <a href="https://seageart.com/">Seage</a> who can be found on{' '}
        <a href="https://youtube.com/seagespeaks">YouTube</a>. Data &amp; icons graciously provided
        by <a href="https://netrunnerdb.com/">NetrunnerDB</a>.
      </p>
      <p id="version">Site Version: {meta.version}</p>
    </div>
  </div>
);

export default SmallPrint;
