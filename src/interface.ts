import * as React from 'react';

/**
 * ColumnType which applied in antd: https://ant.design/components/table-cn/#Column
 * - defaultSortOrder
 * - filterDropdown
 * - filterDropdownVisible
 * - filtered
 * - filteredValue
 * - filterIcon
 * - filterMultiple
 * - filters
 * - sorter
 * - sortOrder
 * - sortDirections
 * - onFilter
 * - onFilterDropdownVisibleChange
 */

export type Key = React.Key;

export type FixedType = 'left' | 'right' | boolean;

export type DefaultRecordType = Record<string, any>;

export type TableLayout = 'auto' | 'fixed';

// ==================== Row =====================
export type RowClassName<RecordType> = (
  record: RecordType,
  index: number,
  indent: number,
) => string;

// =================== Column ===================
export interface CellType<RecordType> {
  key?: Key;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  column?: ColumnsType<RecordType>[number];
  colSpan?: number;
  rowSpan?: number;

  /** Only used for table header */
  hasSubColumns?: boolean;
  colStart?: number;
  colEnd?: number;
  measure?: boolean;
}

export interface RenderedCell<RecordType> {
  props?: CellType<RecordType>;
  children?: React.ReactNode;
}

export type DataIndex = string | number | (string | number)[];

interface ColumnSharedType<RecordType> {
  title?: React.ReactNode;
  key?: Key;
  className?: string;
  fixed?: FixedType;
  onHeaderCell?: GetComponentProps<ColumnsType<RecordType>[number]>;
  ellipsis?: boolean;
  align?: AlignType;
}

export interface ColumnGroupType<RecordType> extends ColumnSharedType<RecordType> {
  children: ColumnsType<RecordType>;
}

export type AlignType = 'left' | 'center' | 'right';

export interface ColumnType<RecordType> extends ColumnSharedType<RecordType> {
  colSpan?: number;
  dataIndex?: DataIndex;
  render?: (
    value: any,
    record: RecordType,
    index: number,
  ) => React.ReactNode | RenderedCell<RecordType>;
  rowSpan?: number;
  width?: number | string;
  onCell?: GetComponentProps<RecordType>;
  /** @deprecated Please use `onCell` instead */
  onCellClick?: (record: RecordType, e: React.MouseEvent<HTMLElement>) => void;
}

export type ColumnsType<RecordType> = (ColumnGroupType<RecordType> | ColumnType<RecordType>)[];

export type GetRowKey<RecordType> = (record: RecordType, index?: number) => Key;

// ================= Fix Column =================
export interface StickyOffsets {
  left: number[];
  right: number[];
}

// ================= Customized =================
export type GetComponentProps<DataType> = (
  data: DataType,
  index?: number,
) => React.HTMLAttributes<HTMLElement>;

type Component<P> =
  | React.ComponentType<P>
  | React.ForwardRefExoticComponent<P>
  | React.FC<P>
  | keyof React.ReactHTML;

export type CustomizeComponent<
  P extends React.HTMLAttributes<HTMLElement> = React.HTMLAttributes<HTMLElement>
> = Component<P>;

export type CustomizeScrollBody<RecordType> = (
  data: RecordType[],
  info: {
    scrollbarSize: number;
    ref: React.Ref<{ scrollLeft: number }>;
    onScroll: (info: { currentTarget?: HTMLElement; scrollLeft?: number }) => void;
  },
) => React.ReactNode;

export interface TableComponents<RecordType> {
  table?: CustomizeComponent;
  header?: {
    wrapper?: CustomizeComponent;
    row?: CustomizeComponent;
    cell?: CustomizeComponent;
  };
  body?:
    | CustomizeScrollBody<RecordType>
    | {
        wrapper?: CustomizeComponent;
        row?: CustomizeComponent;
        cell?: CustomizeComponent;
      };
}

export type GetComponent = (
  path: string[],
  defaultComponent?: CustomizeComponent,
) => CustomizeComponent;

// =================== Expand ===================
export type ExpandableType = false | 'row' | 'nest';

export interface LegacyExpandableProps<RecordType> {
  /** @deprecated Use `expandable.expandedRowKeys` instead */
  expandedRowKeys?: Key[];
  /** @deprecated Use `expandable.defaultExpandedRowKeys` instead */
  defaultExpandedRowKeys?: Key[];
  /** @deprecated Use `expandable.expandedRowRender` instead */
  expandedRowRender?: ExpandedRowRender<RecordType>;
  /** @deprecated Use `expandable.expandRowByClick` instead */
  expandRowByClick?: boolean;
  /** @deprecated Use `expandable.expandIcon` instead */
  expandIcon?: RenderExpandIcon<RecordType>;
  /** @deprecated Use `expandable.onExpand` instead */
  onExpand?: (expanded: boolean, record: RecordType) => void;
  /** @deprecated Use `expandable.onExpandedRowsChange` instead */
  onExpandedRowsChange?: (expandedKeys: Key[]) => void;
  /** @deprecated Use `expandable.defaultExpandAllRows` instead */
  defaultExpandAllRows?: boolean;
  /** @deprecated Use `expandable.indentSize` instead */
  indentSize?: number;
  /** @deprecated Use `expandable.expandIconColumnIndex` instead */
  expandIconColumnIndex?: number;
  /** @deprecated Use `expandable.expandedRowClassName` instead */
  expandedRowClassName?: RowClassName<RecordType>;
  /** @deprecated Use `expandable.childrenColumnName` instead */
  childrenColumnName?: string;
}

export type ExpandedRowRender<ValueType> = (
  record: ValueType,
  index: number,
  indent: number,
  expanded: boolean,
) => React.ReactNode;

export interface RenderExpandIconProps<RecordType> {
  prefixCls: string;
  expanded: boolean;
  record: RecordType;
  expandable: boolean;
  onExpand: TriggerEventHandler<RecordType>;
}

export type RenderExpandIcon<RecordType> = (
  props: RenderExpandIconProps<RecordType>,
) => React.ReactNode;

export interface ExpandableConfig<RecordType> extends LegacyExpandableProps<RecordType> {
  rowExpandable?: (record: RecordType) => boolean;
}

// =================== Render ===================
export type PanelRender<RecordType> = (data: RecordType[]) => React.ReactNode;

// =================== Events ===================
export type TriggerEventHandler<RecordType> = (
  record: RecordType,
  event: React.MouseEvent<HTMLElement>,
) => void;
