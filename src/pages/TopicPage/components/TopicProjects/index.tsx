import { Button, Card, Col, Divider, Progress, Row, Typography } from 'antd';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Project, Topic, TopicVersion } from '../../../../interfaces/map';
import { ProjectModal } from './ProjectModal';
import { useState } from 'react';
import styles from './style.module.less';
import { PlusOutlined } from '@ant-design/icons';

interface Props {
  topic: Topic;
  version: TopicVersion;
}

const { Meta } = Card;

// TODO: description ellipsis
export const TopicProjects = ({ topic, version }: Props) => {
  const [selectedProject, setSelectedProject] = useState<null | Partial<Project>>(null);

  return (
    <div>
      <Button onClick={() => setSelectedProject({ id: 'NEW' })}>
        <PlusOutlined />
        New project
      </Button>
      <br />
      <br />
      <Row gutter={16}>
        {Object.values(version.projects || {}).map((project) => (
          <Col key={project.id} md={12} sm={24} className={styles.card}>
            <Link
              to={`/boards/${topic.boardId}/topics/${topic.id}/versions/${version.id}/projects/${project.id}`}
            >
              <Card
                hoverable
                cover={
                  <div
                    className={styles.cardCover}
                    style={{
                      borderRadius: 10,
                      backgroundImage: project.coverImageUrl
                        ? `url("${project.coverImageUrl}")`
                        : 'linear-gradient( 109.6deg,  rgba(61,245,167,1) 11.2%, rgba(9,111,224,1) 91.1% )',
                    }}
                  />
                }
              >
                <Meta title={project.title} description={project.organisation} />
                <Divider />
                <Progress
                  strokeColor="#74FBFD"
                  showInfo={false}
                  percent={Math.floor(
                    ((project.raisedFunding || 0) * 100) / (project.requiredFunding || 1),
                  )}
                />
                <Typography.Text type="secondary">
                  US${(project.raisedFunding || 0).toLocaleString()} pledged of $
                  {(project.requiredFunding || 0).toLocaleString()}
                </Typography.Text>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
      <ProjectModal
        topic={topic}
        version={version}
        project={selectedProject}
        closeModal={() => setSelectedProject(null)}
      />
    </div>
  );
};
