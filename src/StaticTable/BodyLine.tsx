import { useContext } from '@rc-component/context';
import classNames from 'classnames';
import * as React from 'react';
import { getCellProps, useRowInfo } from '../Body/BodyRow';
import Cell from '../Cell';
import TableContext from '../context/TableContext';
import type { FlattenData } from '../hooks/useFlattenRecords';
import StaticContext from './StaticContext';

export interface BodyLineProps<RecordType = any> {
  data: FlattenData<RecordType>;
  index: number;
  className?: string;
  style?: React.CSSProperties;
  rowKey: React.Key;
}

const BodyLine = React.forwardRef<HTMLDivElement, BodyLineProps>((props, ref) => {
  const { data, index, className, rowKey, style, ...restProps } = props;
  const { record, indent } = data;

  const { flattenColumns, prefixCls } = useContext(TableContext);
  const { scrollX } = useContext(StaticContext, ['scrollX']);

  const rowInfo = useRowInfo(record, rowKey);

  // ========================== Render ==========================
  return (
    <div
      {...restProps}
      ref={ref}
      className={classNames(className, `${prefixCls}-row`)}
      style={{
        ...style,
        width: scrollX,
      }}
    >
      {flattenColumns.map((column, colIndex) => {
        const { render, dataIndex, className: columnClassName, width: colWidth } = column;

        const { key, fixedInfo, appendCellNode, additionalCellProps } = getCellProps(
          rowInfo,
          column,
          colIndex,
          indent,
          index,
        );

        const { style: cellStyle } = additionalCellProps;
        const mergedStyle = {
          ...cellStyle,
          width: colWidth,
        };

        return (
          <Cell
            className={columnClassName}
            ellipsis={column.ellipsis}
            align={column.align}
            scope={column.rowScope}
            // component={column.rowScope ? scopeCellComponent : cellComponent}
            component="div"
            prefixCls={prefixCls}
            key={key}
            record={record}
            index={index}
            // renderIndex={renderIndex}
            renderIndex={index}
            dataIndex={dataIndex}
            render={render}
            shouldCellUpdate={column.shouldCellUpdate}
            {...fixedInfo}
            appendNode={appendCellNode}
            additionalProps={{
              ...additionalCellProps,
              style: mergedStyle,
            }}
          />
        );
      })}
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') {
  BodyLine.displayName = 'BodyLine';
}

export default BodyLine;