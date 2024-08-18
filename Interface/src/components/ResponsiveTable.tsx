import React from 'react';

interface Column {
  header: string;
  accessor: string;
}

interface ResponsiveTableProps {
  columns: Column[];
  data: any[];
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({ columns, data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-muted">
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="p-2 text-left text-muted-foreground font-medium">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-border">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="p-2">
                  <div className="md:hidden font-medium mb-1">{column.header}:</div>
                  <div>{row[column.accessor]}</div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResponsiveTable;