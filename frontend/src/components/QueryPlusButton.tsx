/**
 * Special popover button used to open a new entity query builder.
 */
import React from 'react';
import { Button, ListSubheader, Menu, MenuItem } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { Fields, FieldStruct } from 'react-awesome-query-builder';

interface Props {
  className?: string;
  fields: Fields;
  handleSelect: (path: string) => void;
}

// this is limited to one level of subfields of course
export const QueryPlusButton: React.FC<Props> = ({
  className,
  fields,
  handleSelect,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <Button className={className} onClick={handleClick}>
        <AddIcon />
      </Button>
      <Menu anchorEl={anchorEl} onClick={handleClose} open={Boolean(anchorEl)}>
        {Object.entries(fields).map(([fieldKey, field]) =>
          field.type === '!struct' && (field as FieldStruct).subfields ? (
            [
              <ListSubheader key={fieldKey} disableSticky={true}>
                {field.label}
              </ListSubheader>,
              Object.entries((field as FieldStruct).subfields).map(
                ([subFieldKey, subField]) => (
                  <MenuItem
                    key={subFieldKey}
                    onClick={_e => {
                      handleSelect(`${fieldKey}.${subFieldKey}`);
                    }}
                    value={`${fieldKey}.${subFieldKey}`}
                  >
                    &#160;&#160;{subField.label}
                  </MenuItem>
                ),
              ),
            ]
          ) : (
            <MenuItem
              key={fieldKey}
              onClick={_e => {
                handleSelect(fieldKey);
              }}
              value={fieldKey}
            >
              {field.label}
            </MenuItem>
          ),
        )}
      </Menu>
    </React.Fragment>
  );
};
