import * as React from 'react';
import classNames from 'classnames';
import shallowEqual from 'shallowequal';
import { supportRef } from 'rc-util/lib/ref';
import type {
  DataIndex,
  ColumnType,
  CustomizeComponent,
  DefaultRecordType,
  AlignType,
  CellEllipsisType,
} from '../interface';
import { getPathValue, validateValue } from '../utils/valueUtil';
import StickyContext from '../context/StickyContext';
import HoverContext from '../context/HoverContext';
import type { HoverContextProps } from '../context/HoverContext';
import { warning } from 'rc-util/lib/warning';
import { useContextSelector } from '../ContextSelector';

/** Check if cell is in hover range */
function inHoverRange(cellStartRow: number, cellRowSpan: number, startRow: number, endRow: number) {
  const cellEndRow = cellStartRow + cellRowSpan - 1;
  return cellStartRow <= endRow && cellEndRow >= startRow;
}

function isRenderCell(data: any) {
  return data && typeof data === 'object' && !Array.isArray(data) && !React.isValidElement(data);
}

function isRefComponent(component: CustomizeComponent) {
  // String tag component also support ref
  if (typeof component === 'string') {
    return true;
  }
  return supportRef(component);
}

interface InternalCellProps<RecordType extends DefaultRecordType>
  extends Pick<HoverContextProps, 'onHover'> {
  prefixCls?: string;
  className?: string;
  record?: RecordType;
  /** `column` index is the real show rowIndex */
  index?: number;
  /** the index of the record. For the render(value, record, renderIndex) */
  renderIndex?: number;
  dataIndex?: DataIndex;
  render?: ColumnType<RecordType>['render'];
  component?: CustomizeComponent;
  children?: React.ReactNode;
  colSpan?: number;
  rowSpan?: number;
  ellipsis?: CellEllipsisType;
  align?: AlignType;

  shouldCellUpdate?: (record: RecordType, prevRecord: RecordType) => boolean;

  // Fixed
  fixLeft?: number | false;
  fixRight?: number | false;
  firstFixLeft?: boolean;
  lastFixLeft?: boolean;
  firstFixRight?: boolean;
  lastFixRight?: boolean;

  // ====================== Private Props ======================
  /** @private Used for `expandable` with nest tree */
  appendNode?: React.ReactNode;
  additionalProps?: React.TdHTMLAttributes<HTMLTableCellElement>;
  /** @private Fixed for user use `shouldCellUpdate` which block the render */
  expanded?: boolean;

  rowType?: 'header' | 'body' | 'footer';

  isSticky?: boolean;

  hovering?: boolean;
}

export type CellProps<RecordType extends DefaultRecordType> = Omit<
  InternalCellProps<RecordType>,
  keyof HoverContextProps
>;

const getTitleFromCellRenderChildren = ({
  ellipsis,
  rowType,
  children,
}: Pick<InternalCellProps<any>, 'ellipsis' | 'rowType' | 'children'>) => {
  let title: string;
  const ellipsisConfig: CellEllipsisType = ellipsis === true ? { showTitle: true } : ellipsis;
  if (ellipsisConfig && (ellipsisConfig.showTitle || rowType === 'header')) {
    if (typeof children === 'string' || typeof children === 'number') {
      title = children.toString();
    } else if (React.isValidElement(children) && typeof children.props.children === 'string') {
      title = children.props.children;
    }
  }
  return title;
};

function Cell<RecordType extends DefaultRecordType>(
  {
    prefixCls,
    className,
    record,
    index,
    renderIndex,
    dataIndex,
    render,
    children,
    component: Component = 'td',
    colSpan,
    rowSpan, // This is already merged on WrapperCell
    fixLeft,
    fixRight,
    firstFixLeft,
    lastFixLeft,
    firstFixRight,
    lastFixRight,
    appendNode,
    additionalProps = {},
    ellipsis,
    align,
    rowType,
    isSticky,

    // Hover
    hovering,
    onHover,
  }: // MISC
  InternalCellProps<RecordType>,
  ref: React.Ref<any>,
): React.ReactElement {
  const cellPrefixCls = `${prefixCls}-cell`;

  const supportSticky = React.useContext(StickyContext);

  // ==================== Child Node ====================
  const childNode = React.useMemo<React.ReactNode>(() => {
    if (validateValue(children)) {
      return children;
    }

    const value = getPathValue<React.ReactNode, RecordType>(record, dataIndex);

    // Customize render node
    if (render) {
      const renderNode = render(value, record, renderIndex);
      if (process.env.NODE_ENV !== 'production' && isRenderCell(renderNode)) {
        warning(
          false,
          '`column.render` do not support cell props any more, please use `onCell` instead.',
        );
      }
      return renderNode;
    }

    return value;
  }, [
    /* eslint-disable react-hooks/exhaustive-deps */
    // Always re-render if `renderWithProps`
    /* eslint-enable */
    children,
    dataIndex,
    record,
    render,
    renderIndex,
  ]);

  let mergedChildNode = childNode;

  // Not crash if final `childNode` is not validate ReactNode
  if (
    typeof mergedChildNode === 'object' &&
    !Array.isArray(mergedChildNode) &&
    !React.isValidElement(mergedChildNode)
  ) {
    mergedChildNode = null;
  }

  if (ellipsis && (lastFixLeft || firstFixRight)) {
    mergedChildNode = <span className={`${cellPrefixCls}-content`}>{mergedChildNode}</span>;
  }

  const mergedColSpan = colSpan ?? 1;
  const mergedRowSpan = rowSpan ?? 1;

  if (mergedColSpan === 0 || mergedRowSpan === 0) {
    return null;
  }

  // ====================== Fixed =======================
  const fixedStyle: React.CSSProperties = {};
  const isFixLeft = typeof fixLeft === 'number' && supportSticky;
  const isFixRight = typeof fixRight === 'number' && supportSticky;

  if (isFixLeft) {
    fixedStyle.position = 'sticky';
    fixedStyle.left = fixLeft as number;
  }
  if (isFixRight) {
    fixedStyle.position = 'sticky';

    fixedStyle.right = fixRight as number;
  }

  // ====================== Align =======================
  const alignStyle: React.CSSProperties = {};
  if (align) {
    alignStyle.textAlign = align;
  }

  // ====================== Hover =======================
  const onMouseEnter: React.MouseEventHandler<HTMLTableCellElement> = event => {
    if (record) {
      onHover(index, index + mergedRowSpan - 1);
    }

    additionalProps?.onMouseEnter?.(event);
  };

  const onMouseLeave: React.MouseEventHandler<HTMLTableCellElement> = event => {
    if (record) {
      onHover(-1, -1);
    }

    additionalProps?.onMouseLeave?.(event);
  };

  // ====================== Render ======================
  const title = getTitleFromCellRenderChildren({
    rowType,
    ellipsis,
    children: childNode,
  });

  const componentProps: React.TdHTMLAttributes<HTMLTableCellElement> & {
    ref: React.Ref<any>;
  } = {
    title,
    ...additionalProps,
    colSpan: mergedColSpan !== 1 ? mergedColSpan : null,
    rowSpan: mergedRowSpan !== 1 ? mergedRowSpan : null,
    className: classNames(
      cellPrefixCls,
      className,
      {
        [`${cellPrefixCls}-fix-left`]: isFixLeft && supportSticky,
        [`${cellPrefixCls}-fix-left-first`]: firstFixLeft && supportSticky,
        [`${cellPrefixCls}-fix-left-last`]: lastFixLeft && supportSticky,
        [`${cellPrefixCls}-fix-right`]: isFixRight && supportSticky,
        [`${cellPrefixCls}-fix-right-first`]: firstFixRight && supportSticky,
        [`${cellPrefixCls}-fix-right-last`]: lastFixRight && supportSticky,
        [`${cellPrefixCls}-ellipsis`]: ellipsis,
        [`${cellPrefixCls}-with-append`]: appendNode,
        [`${cellPrefixCls}-fix-sticky`]: (isFixLeft || isFixRight) && isSticky && supportSticky,
        [`${cellPrefixCls}-row-hover`]: hovering,
      },
      additionalProps.className,
    ),
    style: { ...additionalProps.style, ...alignStyle, ...fixedStyle },
    onMouseEnter,
    onMouseLeave,
    ref: isRefComponent(Component) ? ref : null,
  };

  return (
    <Component {...componentProps}>
      {appendNode}
      {mergedChildNode}
    </Component>
  );
}

const RefCell = React.forwardRef<any, InternalCellProps<any>>(Cell);
RefCell.displayName = 'Cell';

const comparePropList: (keyof InternalCellProps<any>)[] = ['expanded', 'className', 'hovering'];

const MemoCell = React.memo(
  RefCell,
  (prev: InternalCellProps<any>, next: InternalCellProps<any>) => {
    if (next.shouldCellUpdate) {
      return (
        // Additional handle of expanded logic
        comparePropList.every(propName => prev[propName] === next[propName]) &&
        // User control update logic
        !next.shouldCellUpdate(next.record, prev.record)
      );
    }

    return shallowEqual(prev, next);
  },
);

/** Inject hover data here, we still wish MemoCell keep simple `shouldCellUpdate` logic */
const WrappedCell = React.forwardRef((props: CellProps<any>, ref: React.Ref<any>) => {
  const { index, additionalProps = {}, colSpan, rowSpan } = props;
  const { colSpan: cellColSpan, rowSpan: cellRowSpan } = additionalProps;

  const mergedColSpan = colSpan ?? cellColSpan;
  const mergedRowSpan = rowSpan ?? cellRowSpan;

  const { onHover, hovering } = useContextSelector(HoverContext, cxt => {
    const isHovering = inHoverRange(index, mergedRowSpan || 1, cxt?.startRow, cxt?.endRow);

    return {
      onHover: cxt?.onHover,
      hovering: isHovering,
    };
  });

  return (
    <MemoCell
      {...props}
      colSpan={mergedColSpan}
      rowSpan={mergedRowSpan}
      hovering={hovering}
      ref={ref}
      onHover={onHover}
    />
  );
});
WrappedCell.displayName = 'WrappedCell';

export default React.memo(WrappedCell, () => true);
