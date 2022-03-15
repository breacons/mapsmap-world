import { Button } from 'antd';
import { ModalProps } from 'antd/es/modal';
import { concat } from 'lodash';
import React, { useState } from 'react';
import { useFieldArray } from 'react-final-form-arrays';
import { FormattedMessage } from 'react-intl';

import Collection from '../../Collection';
import { CollectionProps, CustomColumnsProps } from '../../Collection/Collection';
import Empty from './Empty/Empty';
import styles from './RestorableEditableTable.module.less';
import TableOperations from './TableOperations';
export interface EditableListProps<T extends object & RestorableRowProps>
  extends Partial<Omit<CollectionProps<T>, 'locale' | 'columns'>> {
  columns: CustomColumnsProps<T>[];
  error: Error | null;
  isLoading: boolean;

  name: string;
  locale: {
    modalTitle: React.ReactElement | string;
    createButton: React.ReactElement | string;
  };
  createComponent:
    | React.ComponentClass
    | React.FC<{ index: number; onSubmit: (values: any) => void; name: string } & ModalProps>;
  renderOperation?: (index: number, value: T) => undefined | React.ReactElement;
  getNewItem: () => undefined | T | Partial<T>;
  editable?: boolean;
  onCreateButtonClick?: (evt: React.MouseEvent) => void;
  verifyItemOnClose?: (item: T & { toCreate: boolean }) => boolean;
}
export interface RestorableRowProps {
  toDelete?: boolean;
  toCreate?: boolean;
}
export default function RestorableEditableTable<T extends object & RestorableRowProps>(
  props: EditableListProps<T>,
) {
  const items = useFieldArray<T>(props.name);
  const [itemIndex, setItemIndex] = useState<number | null>(null);
  const {
    columns,
    createComponent: CreateComponent,
    error,
    isLoading,
    getNewItem,
    locale,
    renderOperation,
    name,
    editable,
    onCreateButtonClick,
    verifyItemOnClose = (item: T & { toCreate: boolean }) => !!item,
    ...restProps
  } = props;

  const newColumns = concat(columns, {
    title: (
      <FormattedMessage
        key="TableHeader.Operations"
        id="TableHeader.Operations"
        defaultMessage="Műveletek"
      />
    ),
    key: 'operations',
    width: 300,
    // eslint-disable-next-line react/display-name
    render: (item: T, _record: T, index: number) => (
      <TableOperations<T>
        item={{
          toCreate: false,
          toDelete: false,
          ...item,
        }}
        name={name}
        index={index}
        renderOperation={renderOperation}
        setItem={(index: number) => setItemIndex(index)}
        editable={editable}
      />
    ),
  }) as CollectionProps<T>['columns'];
  const closeModal = (item?: T & { toCreate: boolean }) => {
    const itemExists = item && verifyItemOnClose(item);

    if (!item || !itemExists) {
      items.fields.pop();
      setItemIndex(null);
      return;
    }

    if (item.toCreate) {
      items.fields.pop();

      items.fields.push(item);
    }

    setItemIndex(null);
  };

  return (
    <React.Fragment>
      <React.Fragment>
        <Collection<T>
          pagination={false}
          rowKey={(row: T) => {
            return Object.values(row).join();
          }}
          {...restProps}
          dataSource={items.fields.value}
          columns={newColumns}
          emptyText={<Empty isLoading={isLoading} error={error} />}
          rowClassName={(item: T) => (item.toDelete ? styles.toDeleteRow : '')}
          buttons={
            <Button
              type="primary"
              onClick={(evt: React.MouseEvent) => {
                if (onCreateButtonClick) {
                  onCreateButtonClick(evt);
                }
                if (evt.isDefaultPrevented()) {
                  return;
                }
                const newItem = getNewItem();
                if (newItem !== undefined) {
                  items.fields.push(newItem as T);
                }
                setItemIndex(items.fields.value.length);
              }}
            >
              {locale.createButton}
            </Button>
          }
        />
      </React.Fragment>
      {itemIndex !== null && (
        <CreateComponent
          index={itemIndex || 0}
          name={name}
          onSubmit={closeModal}
          onCancel={() => setItemIndex(null)}
          title={locale.modalTitle}
          visible={itemIndex !== null}
          destroyOnClose
        />
      )}
    </React.Fragment>
  );
}
