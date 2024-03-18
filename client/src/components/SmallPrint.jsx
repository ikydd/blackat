import React from 'react';
import './SmallPrint.css';
import meta from '../../../package.json';

const SmallPrint = () => (
  <div id="small-print">
    <p>Version {meta.version}</p>
    <p>
      Images &amp; universe are intellectual property of{' '}
      <a href="https://www.fantasyflightgames.com">Fantasy Flight Games</a>,{' '}
      <a href="https://company.wizards.com/">Wizards of the Coast</a> and/or{' '}
      <a href="https://nullsignal.games/">Null Signal Games</a>
    </p>
    <p>
      BlacKat image by <a href="http://seageart.com/">Seage</a> who can be found on{' '}
      <a href="http://youtube.com/seagespeaks">YouTube</a>
    </p>
    <p>
      Data &amp; icons graciously provided by <a href="http://netrunnerdb.com/">NetrunnerDB</a>
    </p>
  </div>
);

export default SmallPrint;
