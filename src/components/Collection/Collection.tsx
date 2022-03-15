import { CalendarOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Input, Row, Table } from 'antd';
import { ColumnType, FilterDropdownProps } from 'antd/es/table/interface';
import { TableProps } from 'antd/es/table/Table';
import { ColumnGroupType } from 'antd/lib/table';
import cx from 'classnames';
import { omit as _omit } from 'lodash';
import moment from 'moment';
import React, { ReactElement, ReactNode } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import styles from './Collection.module.less';

const { RangePicker } = DatePicker;

interface Column {
  title: string;
  key: string;
  width?: number;
  render: (row: unknown) => ReactElement;
}

export interface CustomColumnsProps<T> extends ColumnType<T> {
  searchable?: boolean;
  searchValue?: string;
  searchType?: 'text' | 'datetimerange' | 'daterange';
}
export interface CollectionProps<T> extends Partial<Omit<TableProps<T>, 'title' | 'pagination'>> {
  renderTags?: () => ReactElement;
  renderActionButtons?: () => ReactElement | null;
  emptyText: ReactNode;
  header?: boolean;
  buttons?: ReactNode | ReactNode[];
  columns: (CustomColumnsProps<T> | ColumnGroupType<T>)[];
  pagination?: boolean | TableProps<T>['pagination'];
}

// const messages = defineMessages({
//   inputPlaceholder: 'Név keresés',
// });

function Collection<T extends object>({
  emptyText,
  buttons,
  header,
  ...rest
}: CollectionProps<T>): ReactElement {
  const intl = useIntl();
  const searchInputRef = React.useRef<Input>(null);
  const { className, pagination, columns, rowKey, ...tableProps } = rest;
  const transformedColumns = columns.map((column: CustomColumnsProps<T>) => {
    if (!column.searchable) {
      return column;
    }
    const { searchType = 'text' } = column;
    if (searchType === 'text') {
      return {
        // eslint-disable-next-line react/display-name
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        }: FilterDropdownProps) => (
          <div className={styles.filterDropdown}>
            <Input
              ref={searchInputRef}
              placeholder={'Search'}
              value={selectedKeys && selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys && setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={confirm as any}
              className={styles.filterDropdownInput}
            />
            <Button
              type="primary"
              onClick={confirm as any}
              size="small"
              className={styles.filterDropdownButtonPrimary}
            >
              <FormattedMessage key="Input.Search" id="Input.Search" defaultMessage="Keresés" />
            </Button>
            <Button onClick={clearFilters} size="small" className={styles.filterDropdownButton}>
              <FormattedMessage key="Input.Reset" id="Input.Reset" defaultMessage="Törlés" />
            </Button>
          </div>
        ),
        // eslint-disable-next-line react/display-name
        filterIcon: (filtered: boolean) => (
          <SearchOutlined
            className={cx({
              [styles.filteredIcon]: filtered,
            })}
          />
        ),
        onFilterDropdownVisibleChange: (visible: boolean) => {
          if (visible) {
            setTimeout(() => searchInputRef.current && searchInputRef.current.select());
          }
        },

        ..._omit(column, ['searchable', 'searchType']),
      };
    }

    if (searchType === 'datetimerange' || searchType === 'daterange') {
      return {
        // eslint-disable-next-line react/display-name
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        }: FilterDropdownProps) => {
          const dates = selectedKeys ? selectedKeys[0]?.toString().split('|') : undefined;
          const start = dates && dates.length === 2 ? moment(dates[0]) : null;
          const end = dates && dates.length === 2 ? moment(dates[1]) : null;

          return (
            <div className={styles.filterDropdown}>
              <RangePicker
                showTime={searchType === 'daterange' ? false : { format: 'HH:mm' }}
                value={start && end ? [start, end] : null}
                format={searchType === 'daterange' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm'}
                onChange={(e) => {
                  if (!e) {
                    return;
                  }
                  const [start, end] = e;

                  if (!setSelectedKeys) {
                    return;
                  }
                  if (start && end) {
                    setSelectedKeys([[start.toISOString(), end.toISOString()].join('|')]);
                  } else {
                    setSelectedKeys([]);
                  }
                }}
                onOk={confirm as any}
                className={styles.datetimeRangePicker}
              />
              <Button
                type="primary"
                onClick={confirm as any}
                size="small"
                className={styles.filterDropdownButtonPrimary}
              >
                <FormattedMessage key="Input.Search" id="Input.Search" defaultMessage="Keresés" />
              </Button>
              <Button onClick={clearFilters} size="small" className={styles.filterDropdownButton}>
                <FormattedMessage key="Input.Reset" id="Input.Reset" defaultMessage="Törlés" />
              </Button>
            </div>
          );
        },
        // eslint-disable-next-line react/display-name
        filterIcon: (filtered: boolean) => (
          <CalendarOutlined
            className={cx({
              [styles.filteredIcon]: filtered,
            })}
          />
        ),
        onFilterDropdownVisibleChange: (visible: boolean) => {
          if (visible) {
            setTimeout(() => searchInputRef.current && searchInputRef.current.select());
          }
        },

        ..._omit(column, ['searchable', 'searchType']),
      };
    }

    throw new Error(`Unknown search type: ${column.searchType}`);
  });
  return (
    <>
      {header !== false && (
        <Row align="middle" className={styles.tableHeader}>
          <Col span={24} className={styles.tableFilters}>
            {buttons}
          </Col>
        </Row>
      )}

      <Row>
        <Table<T>
          size="middle"
          bordered
          rowKey={rowKey || 'id'}
          tableLayout="fixed"
          pagination={
            pagination === false
              ? false
              : pagination === true
              ? {
                  size: 'default',
                  showSizeChanger: true,
                }
              : {
                  size: 'default',
                  showSizeChanger: true,
                  ...pagination,
                }
          }
          locale={{
            filterConfirm: (
              <FormattedMessage id="Collection.TableFilter.Button.Ok" defaultMessage="Ok" />
            ),
            filterReset: (
              <FormattedMessage id="Collection.TableFilter.Button.Cancel" defaultMessage="Törlés" />
            ),
            emptyText: emptyText,
          }}
          className={cx(className, styles.tableRow)}
          columns={transformedColumns}
          {...tableProps}
        />
      </Row>
    </>
  );
}

export default Collection;
