import React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import TagIcon from '@mui/icons-material/Tag';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';

import { SideBlock } from './SideBlock';
import { Button } from '@mui/material';

export const TagsBlock = ({ items, isLoading = true, onChangeTag }) => {
  return (
    <SideBlock title='Тэги'>
      <List>
        {(isLoading ? [...Array(5)] : items).map((name, i) => (
          <Button
            key={i}
            style={{ textDecoration: 'none', color: 'black' }}
            onClick={() => onChangeTag(name)}
          >
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <TagIcon />
                </ListItemIcon>
                {isLoading ? <Skeleton width={100} /> : <ListItemText primary={name} />}
              </ListItemButton>
            </ListItem>
          </Button>
        ))}
      </List>
    </SideBlock>
  );
};
