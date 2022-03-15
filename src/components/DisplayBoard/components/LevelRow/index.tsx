import React from 'react';
import styles from './LevelRow.module.less';
import { useDispatch } from 'react-redux';
import { TopicsArea } from '../TopicsArea/TopicsArea';
import { Id, Level, ResearchArea, Topic } from '../../../../interfaces/map';
import If from '../../../../components/If';
import { Technology } from '../../../../interfaces/map';
import { useGetAllTechnologiesForArea, useTopicCountForLevel } from '../../../../hooks/use-boards';
import { UNSCHEDULED_LEVEL_ID, UNSCHEDULED_TECHNOLOGY_ID } from '../../../../constants/board';
import { reorderLevel } from '../../../../service/levels';
import { lightenColor } from '../../../../utils/color';
import classNames from 'classnames';
import { useAppDispatch } from '../../../../redux/store';
import { Button, Dropdown, Menu, Space, Typography } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

// import { reorderLevel } from '../../../../service/levels';

interface LevelRowProps {
  level: Level;
  researchAreas: ResearchArea[];
  selectedTopics: Topic[];
  draggingTopicId?: string | null;
  toggleSelection: (topic: Topic) => void;
  toggleSelectionInGroup: (topic: Topic) => void;
  multiSelectTo: (topic: Topic) => void;
  index: number;
  levelsCount: number;
  width: number;
}

interface TopicsAreaWrapperProps {
  area: ResearchArea;
  level: Level;
  draggingTopicId?: Id | null;
  toggleSelection: (topic: Topic) => void;
  toggleSelectionInGroup: (topic: Topic) => void;
  multiSelectTo: (topic: Topic) => void;
  selectedTopics: Topic[];
  levelsCount: number;
  levelIndex: number;
  researchAreaIndex: number;
}

// TODO: get topic numbercss
const TopicsAreaWrapper = ({
  area,
  level,
  selectedTopics,
  draggingTopicId,
  toggleSelection,
  toggleSelectionInGroup,
  multiSelectTo,
  levelsCount,
  researchAreaIndex,
  levelIndex,
}: TopicsAreaWrapperProps) => {
  const dispatch = useAppDispatch();
  const technologiesInArea: Technology[] = useGetAllTechnologiesForArea(area.id);
  const count = useTopicCountForLevel(level.id);

  return (
    <div
      key={`${area.id}#${level.id}`}
      className={classNames([styles.container, styles.topicsArea])}
    >
      <div className={styles.titleContainer}>
        <If
          condition={researchAreaIndex === 0}
          then={() => (
            <Space direction="horizontal" size={16}>
              <Dropdown
                overlay={
                  <Menu>
                    <If
                      condition={levelIndex !== 0 && level.id !== UNSCHEDULED_LEVEL_ID}
                      then={() => (
                        <Menu.Item
                          onClick={() => {
                            dispatch(reorderLevel({ destinationIndex: levelIndex - 1, level }));
                          }}
                        >
                          Move up
                        </Menu.Item>
                      )}
                    />
                    <If
                      condition={levelIndex < levelsCount - 2 && level.id !== UNSCHEDULED_LEVEL_ID}
                      then={() => (
                        <Menu.Item
                          onClick={() => {
                            dispatch(reorderLevel({ destinationIndex: levelIndex + 1, level }));
                          }}
                        >
                          Move down
                        </Menu.Item>
                      )}
                    />
                  </Menu>
                }
                placement="bottomLeft"
                arrow
              >
                <MoreOutlined style={{ fontSize: 16, cursor: 'pointer', color: 'white' }} />
              </Dropdown>
              <Typography.Text className={styles.title}>
                <span className={styles.titleLevel}>LEVEL #{levelIndex + 1}</span> &nbsp;∙&nbsp;{' '}
                {count}&nbsp;
                {count > 1 ? 'TOPICS' : 'TOPIC'}
              </Typography.Text>
            </Space>
          )}
          else={() => <div>&nbsp;</div>}
        />
      </div>

      <div className={styles.topicContainer}>
        <If
          condition={technologiesInArea.length === 0}
          then={() => <div className={styles.emptyArea} />}
          else={() =>
            technologiesInArea.map((technology, technologyIndex) => (
              <TopicsArea
                technology={technology}
                level={level}
                key={`${technology.id}-${level.id}`}
                draggingTopicId={draggingTopicId}
                selectedTopics={selectedTopics}
                toggleSelection={toggleSelection}
                toggleSelectionInGroup={toggleSelectionInGroup}
                multiSelectTo={multiSelectTo}
                researchAreaIndex={researchAreaIndex}
                technologyIndex={technologyIndex}
                levelIndex={levelIndex}
              />
            ))
          }
        />

        {/* TODO: replace this this sass */}
        <If
          condition={
            !(
              technologiesInArea.length === 1 &&
              technologiesInArea[0].id === UNSCHEDULED_TECHNOLOGY_ID
            )
          }
          then={() => <div className={styles.addButtonSpace} />}
        />
      </div>
    </div>
  );
};

export const LevelRow = ({
  level,
  researchAreas,
  selectedTopics,
  draggingTopicId,
  toggleSelection,
  toggleSelectionInGroup,
  multiSelectTo,
  index,
  levelsCount,
}: LevelRowProps) => {
  return (
    <div
      key={level.id}
      className={styles.levelRow}
      style={{
        backgroundColor: lightenColor('#23213A', 20 - index * (20 / Math.max(levelsCount - 1, 1))),
      }}
    >
      <div className={styles.levelContainer}>
        {researchAreas.map((area, researchAreaIndex) => (
          <TopicsAreaWrapper
            key={`${area.id}#${level.id}`}
            area={area}
            level={level}
            toggleSelection={toggleSelection}
            toggleSelectionInGroup={toggleSelectionInGroup}
            multiSelectTo={multiSelectTo}
            draggingTopicId={draggingTopicId}
            selectedTopics={selectedTopics}
            researchAreaIndex={researchAreaIndex}
            levelsCount={levelsCount}
            levelIndex={index}
          />
        ))}
      </div>
    </div>
  );
};

export default LevelRow;

/*

 */
