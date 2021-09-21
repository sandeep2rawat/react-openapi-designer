import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
import TreeList from '../Tree/List';
import {StoresContext} from '../Tree/context';
import Item from './Item';
import PathItem from './PathItem';
import {NodeTypes} from '../../utils/tree';

const Sidebar = observer((props) => {
  const stores = React.useContext(StoresContext);
  const handleScroll = () => {};

  const rowHeight = (e) =>
    'path' === e.type &&
    e.metadata !== undefined &&
    'operations' in e.metadata &&
    e.metadata.operations.items.length > 0
      ? 50
      : 30;

  const rowRenderer = React.useCallback(
    (node, rowOptions) => {
      if (node.type === NodeTypes.Path) {
        return (
          <div className="flex group w-full items-center">
            <PathItem node={node} isEdited={!!rowOptions.isEdited} />
          </div>
        );
      } else {
        return (
          <div className="relative flex items-stretch w-full h-full DesignTreeListItem--hover group">
            <Item
              placeholder=""
              className="truncate"
              node={node}
              {...rowOptions}
            />
          </div>
        );
      }
    },
    [stores.designTreeStore, stores.graphStore],
  );

  return (
    <TreeList
      store={stores.designTreeStore.treeStore}
      stores={stores}
      draggable={false}
      rowHeight={rowHeight}
      rowRenderer={rowRenderer}
      itemClassName="DesignTreeListItem"
      className="SidebarTreeList"
      innerPadding={15}
      initialScrollOffset={0}
      onScroll={handleScroll}
      autoSize={true}
      style={props.style}
    />
  );
});

Sidebar.propTypes = {
  style: PropTypes.object,
  //onClick: PropTypes.func,
  openapi: PropTypes.object,
};

export default Sidebar;
