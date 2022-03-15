import { Button, Divider, Popconfirm } from 'antd';
import classNames from 'classnames';
import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';

import If from '../../If';
import styles from './EditableTable.module.less';

export interface Record {
  key: number;
}

interface Props {
  fields: any;
  isEditing: boolean;
  hasError: boolean;
  finishRow: (index: number) => void;
  editRow: (index: number) => void;
  record: Record;
  allowDisplay: boolean;
}

export const Operations = ({
  fields,
  isEditing,
  hasError,
  finishRow,
  editRow,
  record,
  allowDisplay,
}: Props) => (
  <Fragment>
    <If
      condition={allowDisplay}
      then={() => (
        <Fragment>
          <If
            condition={isEditing}
            then={() => (
              <Button
                type="link"
                onClick={() => !hasError && finishRow(record.key)}
                className={classNames([styles.rowButton, { [styles.disabledSave]: hasError }])}
              >
                <FormattedMessage id="EditableTable.Save" defaultMessage="Mentés" />
              </Button>
            )}
            else={() => (
              <Button type="link" onClick={() => editRow(record.key)} className={styles.rowButton}>
                <FormattedMessage id="EditableTable.Edit" defaultMessage="Szerkeszés" />
              </Button>
            )}
          />
          <Divider type="vertical" />
        </Fragment>
      )}
    />
    <Popconfirm
      title={
        <FormattedMessage
          id="EditableTable.Remove.Title"
          defaultMessage="Biztosan törölni szeretnéd?"
        />
      }
      okText={<FormattedMessage id="EditableTable.Remove.Ok" defaultMessage="Törlés" />}
      okType="danger"
      cancelText={<FormattedMessage id="EditableTable.Remove.Cancel" defaultMessage="Mégse" />}
      onConfirm={() => fields.remove(record.key)}
    >
      <Button type="link" className={styles.rowButton}>
        <FormattedMessage id="EditableTable.Remove" defaultMessage="Eltávolítás" />
      </Button>
    </Popconfirm>
  </Fragment>
);

export default Operations;
