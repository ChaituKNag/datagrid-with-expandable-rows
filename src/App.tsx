import { DataGrid, GridRowsProp, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import config from './config.json';
import data from './data.json';
import { CityConfig, CountryConfig, DataItem } from './types';
import { useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { ChevronRight, ExpandMore } from '@mui/icons-material';
import { styled } from '@mui/material';

const StyledContainer = styled('div')`
  .MuiDataGrid-cell--editable {
    background-color: beige;
  }
`

const getRowData = (itemData: DataItem[]): GridRowsProp => config.reduce((list: GridRowsProp, country: CountryConfig) => {
  const countryRows = itemData.filter(item => item.countryId === country.id);
  const updatedList = [
    ...list,
    { id: `country_${country.id}`, country: country.name, countryId: country.id, isParent: true, isShown: true },
    ...(countryRows.map((item: DataItem) => {
      return {
        id: `country_${country.id}__city_${item.cityId}`,
        country: '',
        countryId: country.id,
        city: country.cities.find((city: CityConfig) => city.id === item.cityId)?.name,
        val1: item.val1,
        val2: item.val2,
        val3: item.val3,
      }
    }))
  ]
  
  return updatedList
}, []);

const getRenderHeader = (handleToggleHeader: (row: any) => void) => ({ value, row }: GridRenderCellParams<any, any>) => {
  return (
    value ? <Grid onClick={() => handleToggleHeader(row)} alignSelf={"baseline"} style={{ cursor: "pointer" }}>
      {!row.isShown ? <ChevronRight /> : <ExpandMore />}
      <Typography component="span" variant="h5">{value}</Typography>
    </Grid> : ''
  )
}

const getColumns = (handleToggleHeader: (row: any) => void): GridColDef[] => [
  { field: 'country', headerName: '', width: 200, renderCell: getRenderHeader(handleToggleHeader)},
  { field: 'city', headerName: 'City', width: 250},
  { field: 'val1', headerName: 'One', width: 250, editable: true},
  { field: 'val2', headerName: 'Two', width: 250, editable: true},
  { field: 'val3', headerName: 'Three', width: 250, editable: true},
];

export default function App() {
  const [rowData, setRowData] = useState(getRowData(data));
  const handleToggleHeader = (row: any) => {
    const rowId = row?.id;
    setRowData(_rowData => _rowData.map(dataItem => dataItem.id === rowId ? {
      ...dataItem,
      isShown: !dataItem.isShown
    } : dataItem));
  }

  const handleBulkToggle = (isShown: boolean) => setRowData(_rowData => _rowData.map(dataItem => ({
    ...dataItem,
    isShown
  })))

  const handleCollapseAll = () => handleBulkToggle(false);
  const handleExpandAll = () => handleBulkToggle(true);

  const shownCountries = rowData.filter(dataItem => dataItem.country && dataItem.isShown).map(dataItem => dataItem.countryId);
  const filteredRowData = rowData.filter(dataItem => !!dataItem.country || shownCountries.includes(dataItem.countryId));
  return (
    <StyledContainer>
      <Typography variant='h3' marginBlockEnd={3}>Data Management</Typography>
      <Grid container marginBottom={2}>
        <Button color="primary" variant="contained" onClick={handleExpandAll} style={{ marginRight: 10}}>Expand all</Button>
        <Button variant="outlined" onClick={handleCollapseAll}>Collapse all</Button>
      </Grid>
      <DataGrid 
        disableColumnSorting
        disableColumnMenu
        rows={filteredRowData} 
        columns={getColumns(handleToggleHeader)} 
        hideFooter
        isCellEditable={({ row }) => {
          return row.country === '';
        }}
      />
    </StyledContainer>
  );
}
