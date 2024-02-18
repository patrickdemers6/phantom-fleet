import SingleCharacterButton from '@/components/SingleCharacterButton';
import {
  Grid, Menu, MenuItem, Tooltip,
} from '@mui/material';
import { useRef, useState } from 'react';

const OPEN_MENU = { name: 'More', shortName: '+', value: -1 };

type CircleSelectData = {
  primary: FieldOption[];
  secondary?: FieldOption[];
};

const CircleSelect = (props: RendererProps<CircleSelectData>) => {
  const { RenderSubItems } = props;
  const { primary, secondary } = props.data;

  const [menuOpen, setMenuOpen] = useState(false);
  const menuAnchor = useRef(null);

  let selectedItemIsInSecondary = false;
  let selectedItem = primary.find((item) => item.value === props.value);
  if (!selectedItem && secondary) {
    selectedItem = secondary.find((item) => item.value === props.value);
    selectedItemIsInSecondary = true;
  }

  const closeMenu = () => setMenuOpen(false);

  const onClick = (item: FieldOption) => {
    if (item.name === OPEN_MENU.name) {
      setMenuOpen(true);
      return;
    }

    closeMenu();
    props.handleChange(item.value);
  };

  const hasSecondary = secondary && secondary.length > 0;

  return (
    <>
      <Grid container>
        {(hasSecondary ? [...primary, OPEN_MENU] : primary).map((item) => (
          <Grid item xs={3} key={item.name} sx={{ textAlign: 'center' }}>
            <Tooltip title={item.name}>
              <div ref={item.name === OPEN_MENU.name ? menuAnchor : null}>
                <SingleCharacterButton
                  onClick={() => onClick(item)}
                  variant={(item.value === props.value || (item.name === OPEN_MENU.name && selectedItemIsInSecondary)) ? 'contained' : 'text'}
                  character={item.shortName}
                />
              </div>
            </Tooltip>
          </Grid>
        ))}
      </Grid>
      {hasSecondary
        && (
        <Menu
          open={menuOpen}
          onClose={closeMenu}
          anchorEl={menuAnchor.current}
          anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
        >
          {secondary.map((item) => (
            <MenuItem
              key={item.name}
              onClick={() => onClick(item)}
              selected={item.value === props.value}
            >
              {item.name}
            </MenuItem>
          ))}
        </Menu>
        )}
      {selectedItem?.items
        ? <RenderSubItems secondary vin={props.vin} items={selectedItem.items} />
        : null}
    </>
  );
};

export default CircleSelect;
