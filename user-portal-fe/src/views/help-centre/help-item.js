import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function HelpItem({ key, title, summary }) {
  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={title.toString().toLowerCase().replaceAll(" ", "-")}
          id={title.toString().toLowerCase().replaceAll(" ", "-")}
        >
          <Typography sx={{ color: theme => theme.palette.primary.main }}>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {summary}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
