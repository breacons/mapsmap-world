import * as React from 'react';
import { Topic } from '../../../../interfaces/map';
import { useSelector } from 'react-redux';
import { selectPositions } from '../../../../redux/positions';
import { useMemo } from 'react';
import _ from 'lodash';
import styles from './styles.module.less';
import { columnWidth, rowHeight } from '../../index';
import { nanoid } from 'nanoid';
const lineWidth = 2;

interface Props {
  topics: Topic[];
  width: number;
  height: number;
}

interface Point {
  x: number;
  y: number;
}

const computePath = (from: Point, to: Point) => {
  if (from.x === to.x) {
    let first = from;
    let second = to;

    if (from.y > to.y) {
      first = to;
      second = from;
    }

    const width = lineWidth;
    const height = second.y - (first.y + rowHeight);

    return {
      id: nanoid(),
      boundingLeft: first.x + columnWidth / 2 - lineWidth / 2,
      boundingTop: first.y + rowHeight,
      boundingWidth: width,
      boundingHeight: height,
      pathStart: { x: lineWidth / 2, y: 0 },
      pathEnd: { x: lineWidth / 2, y: height },
      controlPointStart: { x: lineWidth / 2, y: 0 },
      controlPointEnd: { x: lineWidth / 2, y: height },
    };

    /// CASE 3
  } else if (from.y === to.y) {
    let first = from;
    let second = to;

    if (from.x > to.x) {
      first = to;
      second = from;
    }

    const width = second.x - (first.x + columnWidth);
    const height = lineWidth;

    return {
      id: nanoid(),
      boundingLeft: first.x + columnWidth,
      boundingTop: first.y + rowHeight / 2 - lineWidth / 2,
      boundingWidth: width,
      boundingHeight: height,
      pathStart: { x: 0, y: lineWidth / 2 },
      pathEnd: { x: width, y: lineWidth / 2 },
      controlPointStart: { x: 0, y: lineWidth / 2 },
      controlPointEnd: { x: width, y: lineWidth / 2 },
    };
  } else if ((to.x > from.x && to.y > from.y) || (to.x < from.x && to.y < from.y)) {
    // CASE 1
    let first = from;
    let second = to;

    if (from.x > to.x) {
      first = to;
      second = from;
    }

    const width = second.x - (first.x + columnWidth);
    const height = second.y - first.y + lineWidth;
    return {
      id: nanoid(),
      boundingLeft: first.x + columnWidth,
      boundingTop: first.y + rowHeight / 2 - lineWidth / 2,
      boundingWidth: width,
      boundingHeight: height,
      pathStart: { x: 0, y: lineWidth / 2 },
      pathEnd: { x: width, y: height - lineWidth / 2 },
      controlPointStart: { x: width / 2, y: 0 },
      controlPointEnd: { x: width / 2, y: height },
    };
  } else {
    // CASE 2
    let first = from;
    let second = to;

    if (from.x > to.x) {
      first = to;
      second = from;
    }

    const width = second.x - (first.x + columnWidth);
    const height = first.y - second.y + lineWidth;

    return {
      id: nanoid(),
      boundingLeft: first.x + columnWidth,
      boundingTop: second.y + rowHeight / 2 - lineWidth / 2,
      boundingWidth: width,
      boundingHeight: height,
      pathStart: { x: 0, y: height - lineWidth / 2 },
      pathEnd: { x: width, y: lineWidth / 2 },
      controlPointStart: { x: width / 2, y: height },
      controlPointEnd: { x: width / 2, y: 0 },
    };
  }

  return null;
};

export const Dependencies = ({ topics, width, height }: Props) => {
  const positions = useSelector(selectPositions);

  const dependencies = useMemo(() => {
    if (!positions) return [];
    return _.flatten(
      topics.map((topic) => {
        if (!positions[topic.id]) return null;

        return Object.keys(topic.dependentOn || {}).map((dependencyId) =>
          computePath(positions[topic.id], positions[dependencyId]),
        );
      }),
    ).filter((e) => e !== null);
  }, [positions, topics]);

  if (!topics || !positions || _.isEmpty(positions)) return null;

  return (
    <div className={styles.container} style={{ width, height }}>
      {dependencies.map((dependency: any) => (
        <div style={{ position: 'absolute' }} key={`${dependency.id}`}>
          <svg
            width={dependency.boundingWidth}
            height={dependency.boundingHeight}
            overflow="auto"
            className={styles.svgContainer}
            style={{
              left: dependency.boundingLeft,
              top: dependency.boundingTop,
            }}
          >
            {/*<defs>*/}
            {/*  <marker*/}
            {/*    id="arrowhead"*/}
            {/*    markerWidth="5"*/}
            {/*    markerHeight="4"*/}
            {/*    refX="5"*/}
            {/*    refY="0"*/}
            {/*    orient="auto"*/}
            {/*    markerUnits="strokeWidth"*/}
            {/*  >*/}
            {/*    <polygon points="0 0, 5 1.75, 0 3.5" fill="red"/>*/}
            {/*  </marker>*/}
            {/*</defs>*/}
            <path
              d={`M ${dependency.pathStart.x}  ${dependency.pathStart.y} C ${dependency.controlPointStart.x} ${dependency.controlPointStart.y} ${dependency.controlPointEnd.x} ${dependency.controlPointEnd.y} ${dependency.pathEnd.x} ${dependency.pathEnd.y}`}
              stroke="#D18ED1"
              strokeDasharray="10 10"
              strokeWidth={lineWidth}
              fill="transparent"
              pointerEvents="visibleStroke"
              markerEnd="url(#arrowhead)"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};
