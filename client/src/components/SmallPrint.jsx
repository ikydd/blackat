import React from 'react';
import meta from '../../../package.json';
import './SmallPrint.css';

const SmallPrint = () => (
  <div id="small-print">
    <p>
      BlacKat is a fan-made website and is not run for profit. Images &amp; universe are
      intellectual property &copy; of{' '}
      <a title="Fantasy Flight Games" href="https://www.fantasyflightgames.com">
        Fantasy Flight Games
      </a>
      ,{' '}
      <a title="Wizards of the Coast" href="https://company.wizards.com/">
        Wizards of the Coast
      </a>{' '}
      and/or{' '}
      <a title="Null Signal Games" href="https://nullsignal.games/">
        Null Signal Games
      </a>
      . The BlacKat image is by{' '}
      <a title="Seage" href="https://seageart.com/">
        Seage
      </a>{' '}
      who can be found on{' '}
      <a title="Seage on YouTube" href="https://youtube.com/seagespeaks">
        YouTube
      </a>
      . Data &amp; icons graciously provided by{' '}
      <a title="NetrunnerDB" href="https://netrunnerdb.com/">
        NetrunnerDB
      </a>
      .
    </p>
    <p id="version">Site Version: {meta.version}</p>
  </div>
);

export default SmallPrint;
