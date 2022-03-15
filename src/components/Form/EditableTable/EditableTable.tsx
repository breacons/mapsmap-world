import { Button, Table } from 'antd';
import classNames from 'classnames';
import { ValidationErrors } from 'final-form';
import React, { Fragment, ReactElement, ReactNode, useState } from 'react';
import { FormSpy } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import styles from './EditableTable.module.less';
import Empty from './Empty';
import Operations, { Record } from './Operations';

interface Props {
  name: string;
  addLabel: ReactNode;
  allowDisplay?: boolean;
  children: ReactElement | ReactElement[];
}

export const EditableTable = ({ children, name, addLabel, allowDisplay = false }: Props) => {
  const [editing, setEditing] = useState({});
  const [errors, setErrors] = useState<ValidationErrors>();

  const editRow = (index: number) => setEditing({ ...editing, [index]: true });
  const finishRow = (index: number) => setEditing({ ...editing, [index]: false });
  const isEditingRow = (index: number) => !!(editing as any)[index];
  const rowHasError = (index: number) => errors && errors[name] && !!errors[name][index];

  const transformFields = (fields: any) => {
    return fields.map((name: string, index: number) => {
      // Return the values as a string
      if (!isEditingRow(index) && allowDisplay) {
        return {
          key: index,
          ...fields.value[index],
        };
      }

      // Return the form fields
      const editingFields = { key: index };
      React.Children.forEach(children, (child, index) => {
        (editingFields as any)[child.props.name] = React.cloneElement(child, {
          name: `${name}.${child.props.name}`,
          label: false,
          autoFocus: index === 0,
        });
      });

      return editingFields;
    });
  };

  const getColumns = (fields: any) => {
    const valueFields = React.Children.map(children, (child) => ({
      title: child.props.label,
      dataIndex: child.props.name,
      key: child.props.name,
    }));

    // This is required as a separate function, otherwise eslint will miss the display name
    const renderOperations = (_: string, record: Record) => (
      <Operations
        record={record}
        fields={fields}
        isEditing={isEditingRow(record.key)}
        hasError={rowHasError(record.key)}
        finishRow={finishRow}
        editRow={editRow}
        allowDisplay={allowDisplay}
      />
    );

    const operationField = {
      title: '',
      dataIndex: 'operation',
      className: styles.operations,
      render: renderOperations,
    };

    return [...valueFields, operationField];
  };

  return (
    <Fragment>
      <FormSpy
        subscription={{ errors: true }}
        onChange={(props: any) => setErrors((props as any).errors)}
      />
      <FieldArray name={name}>
        {({ fields }) => {
          return (
            <Fragment>
              <Button
                type="primary"
                onClick={() => {
                  if (!fields.value) {
                    fields.value = [];
                  }

                  editRow(fields.value.length);
                  fields.push({});
                }}
                className={styles.addButton}
              >
                {addLabel}
              </Button>
              <Table
                dataSource={transformFields(fields)}
                columns={getColumns(fields)}
                className={styles.table}
                pagination={false}
                tableLayout="fixed"
                bordered
                size="middle"
                locale={{
                  emptyText: <Empty />,
                }}
                rowClassName={(record: Record) =>
                  classNames({ [styles.editing]: isEditingRow(record.key) })
                }
              />
            </Fragment>
          );
        }}
      </FieldArray>
    </Fragment>
  );
};

export default EditableTable;
