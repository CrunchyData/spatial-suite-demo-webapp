// @ts-check
import React, { memo } from 'react';
import {
  Table, TableHeader, TableBody,
} from '@patternfly/react-table';
import { Text, TextContent } from '@patternfly/react-core';
import styles from './index.module.scss';

/** @typedef {import('api').SurroundingParcel} SurroundingParcel */

/** @typedef {React.ComponentProps<typeof Table>} TableProps */
/** @typedef  {TableProps['cells']} TableCells */
/** @typedef {TableProps['rows']} TableRows */

const noBreak = () => ({ className: styles.noBreak });

/**
 * Definitions for table headings and column "transforms"
 * @type {TableCells}
 */
const columns = [
  {
    title: 'ID',
    cellTransforms: [noBreak],
  },
  'Address',
  {
    title: 'Acres',
    cellTransforms: [noBreak],
  },
];

/**
 * Lists search results - all parcels located within the specified distance
 * @param {Object} props
 * @param {Array<SurroundingParcel>} props.parcelSearchResults
 */
const SearchResultsList = ({ parcelSearchResults }) => {
  if (!parcelSearchResults.length) return null;

  /** @type {TableRows} */
  const rows = parcelSearchResults.map(parcel => ({
    cells: [
      parcel.parcelid,
      parcel.address,
      parcel.acres,
    ],
  }));

  return (
    <>
      <TextContent>
        <Text>{rows.length} parcels found</Text>
      </TextContent>
      <Table
        aria-label="Surrounding parcels"
        className={styles.root}
        cells={columns}
        rows={rows}
      >
        <TableHeader />
        <TableBody rowKey={rowKey} />
      </Table>
    </>
  );
};

/** Generates a row key for the <TableBody> component */
function rowKey({ rowData }) {
  return rowData.id.title;
}

export default memo(SearchResultsList);
