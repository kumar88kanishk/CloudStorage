import * as React from 'react';
import Card from '@mui/material/Card';
import HelpItem from './help-item';
import HelpMoreButton from './help-more';


export default function HelpList({ helpList }) {
  return (
    <Card sx={{ p: 1, mt: 1, mb: 1 }}>
      <>
        {(helpList || []).map((e) => {
          return <HelpItem key={e.id} summary={e.summary} title={e.title} />
        })}
        <HelpMoreButton />
      </>
    </Card>
  );
}
