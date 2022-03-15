import { Button, Divider } from 'antd';
import React, { Fragment } from 'react';
import { useField } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import If from '../../../If';
import styles from './TableOperations.module.less';

interface OperationsCellProps<T> {
  index: number;
  name: string;
  setItem: (index: number) => void;
  item: T & { toCreate: boolean; toDelete: boolean };
  renderOperation?: (index: number, value: T) => undefined | React.ReactElement;
  editable?: boolean;
}

export const TableOperations = <T extends any>({
  index,
  name,
  setItem,
  item,
  renderOperation = () => undefined,
  editable,
}: OperationsCellProps<T>) => {
  const field = useField<T & { toDelete: boolean }>(`${name}[${index}]`);
  const toDeleteField = useField(`${name}[${index}].toDelete`);

  const toDelete = !!item.toDelete;

  const children = renderOperation(index, field.input.value);
  if (children !== undefined) {
    return children;
  }

  return (
    <React.Fragment>
      <If
        condition={!toDelete && editable !== false}
        then={() => (
          <Fragment>
            <Button
              type="link"
              className={styles.linkButton}
              onClick={() => {
                setItem(index);
              }}
            >
              <FormattedMessage
                key="TableAction.Edit"
                id="TableAction.Edit"
                defaultMessage="Szerkesztés"
              />
            </Button>
            <Divider type="vertical" />
          </Fragment>
        )}
      />

      <Button
        type="link"
        className={styles.linkButton}
        onClick={() => toDeleteField.input.onChange(!toDelete)}
      >
        <If
          condition={toDelete}
          then={() => (
            <FormattedMessage
              key="TableAction.Recover"
              id="TableAction.Recover"
              defaultMessage="Helyreállítás"
            />
          )}
          else={() => (
            <FormattedMessage
              key="TableAction.Delete"
              id="TableAction.Delete"
              defaultMessage="Eltávolítás"
            />
          )}
        />
      </Button>
    </React.Fragment>
  );
};

export default TableOperations;
