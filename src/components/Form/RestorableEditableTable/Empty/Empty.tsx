import { MehOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import React, { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
interface Props {
  isLoading: boolean;
  error: Error | null;
}
export function ProductGroupsListPageListEmpty({ isLoading, error }: Props): ReactElement {
  if (isLoading) {
    return (
      <FormattedMessage
        id="ProductGroupsListPage.List.LoadingMessage"
        defaultMessage="Betöltés folyamatban..."
      />
    );
  }
  if (error) {
    return (
      <Result
        status="warning"
        title={
          <FormattedMessage
            id="ProductGroupsListPage.List.Error.FailedToLoad"
            defaultMessage="Hiba történt az adatok betöltése közben"
          />
        }
        subTitle={
          <FormattedMessage
            id="ProductGroupsListPage.List.Error.Description"
            defaultMessage="Az adatok betöltése sikertelen volt ismeretlen hiba miatt."
          />
        }
        extra={
          <Button icon={<ReloadOutlined />} type="primary" key="refresh">
            <FormattedMessage
              id="ProductGroupsListPage.List.Error.RefreshButton"
              defaultMessage="Frissítés"
            />
          </Button>
        }
      />
    );
  }
  return (
    <Result
      icon={<MehOutlined />}
      title={
        <FormattedMessage
          id="ProductGroupsListPage.List.Empty.Title"
          defaultMessage="Nincs találat"
        />
      }
      subTitle={
        <FormattedMessage
          id="ProductGroupsListPage.List.Empty.Description"
          defaultMessage="A lista még egy elemet sem tartalmaz."
        />
      }
    />
  );
}

export default ProductGroupsListPageListEmpty;
