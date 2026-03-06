'use client';

import { Table, Box, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

export default function DataTable<T extends { id: string }>({
  columns,
  data,
  emptyMessage = 'No data found.',
}: DataTableProps<T>) {
  return (
    <Box overflowX="auto" borderRadius="md" border="1px solid" borderColor="gray.200">
      <Table.Root size="sm">
        <Table.Header>
          <Table.Row>
            {columns.map((col, i) => (
              <Table.ColumnHeader key={i} width={col.width} px={4} py={3} fontSize="xs" textTransform="uppercase" color="gray.600">
                {col.header}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={columns.length} textAlign="center" py={8}>
                <Text color="gray.500">{emptyMessage}</Text>
              </Table.Cell>
            </Table.Row>
          ) : (
            data.map((row) => (
              <Table.Row key={row.id} _hover={{ bg: 'gray.50' }}>
                {columns.map((col, i) => (
                  <Table.Cell key={i} px={4} py={3} fontSize="sm">
                    {typeof col.accessor === 'function'
                      ? col.accessor(row)
                      : (row[col.accessor] as ReactNode)}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
