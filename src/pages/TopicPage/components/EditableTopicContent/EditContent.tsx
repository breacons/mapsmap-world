import * as React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { Board, Topic, TopicVersion } from '../../../../interfaces/map';
import { useMemo, useRef } from 'react';
import { Button, Divider } from 'antd';
import { convertToRaw, convertFromRaw, EditorState } from 'draft-js';
// @ts-ignore
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js';
import { useAppDispatch } from '../../../../redux/store';
import { updateTopic, updateTopicVersion } from '../../../../service/topics';
import { useCurrentTopicVersion } from '../../../../hooks/use-topics';
import { useCurrentBoard } from '../../../../hooks/use-boards';
import styles from './styles.module.less';
import { SaveOutlined } from '@ant-design/icons';
// @ts-ignore
// import draftToMarkdown from 'draftjs-to-markdown';

interface Props {
  topic: Topic;
  setEditing: (editing: boolean) => void;
  versionId: string;
}

export const EditContent = ({ topic, setEditing, versionId }: Props) => {
  const ref = useRef<Editor>(null);
  const { board } = useCurrentBoard();
  const { topics } = board as Board;
  const dispatch = useAppDispatch();
  const { version } = useCurrentTopicVersion();

  const editorState = useMemo(() => {
    const rawData = markdownToDraft(version?.content || '');
    const contentState = convertFromRaw(rawData);
    return EditorState.createWithContent(contentState);
  }, [version?.content]);

  const onSave = () => {
    if (ref.current) {
      // @ts-ignore
      const rawContentState = convertToRaw(ref.current.getEditorState().getCurrentContent());

      const markdownString = draftToMarkdown(rawContentState, {
        entityItems: {
          MENTION: {
            open: function (entity: any, block: any) {
              return '[';
            },

            close: function (entity: any) {
              return `](${entity.data.url})`;
            },
          },
        },
      });

      dispatch(
        updateTopicVersion({
          topic,
          versionId,
          version: { ...(version as TopicVersion), content: markdownString },
        }),
      );

      setEditing(false);

      // @ts-ignore
      // console.log(rawContentState)
      //
      // const hashConfig = {
      //   trigger: '#',
      //   separator: ' ',
      // };
      //
      // const markup = draftToMarkdown(rawContentState, hashConfig);
    }
  };

  return (
    <div>
      <Editor
        ref={ref}
        defaultEditorState={editorState}
        toolbarClassName={styles.toolbar}
        wrapperClassName={styles.wrapper}
        editorClassName={styles.editor}
        customStyleMap={{
          monospace: {
            backgroundColor: 'red',
          },
          greenBackground: {
            backgroundColor: 'green',
          },
        }}
        // onEditorStateChange={this.onEditorStateChange}
        mention={{
          separator: ' ',
          trigger: '#',
          suggestions: topics.map((t) => ({
            text: t.title,
            value: t.title,
            url: `/boards/${topic.boardId}/topics/${t.id}`,
          })),
        }}
        toolbar={{
          options: [
            'blockType',

            'inline',
            // 'fontSize',
            // 'fontFamily',
            'list',
            // 'textAlign',
            // 'colorPicker',
            'link',
            // 'embedded',
            // 'emoji',
            // 'image',
            'remove',
            // 'history',
          ],
          inline: {
            options: ['bold', 'italic', 'underline'],
            // monospace: { className: 'hello', style: { backgroundColor: 'red' } },
          },
          blockType: {
            inDropdown: true,
            options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6' /*'Blockquote', 'Code'*/],
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
          },
          list: {
            inDropdown: false,
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
            options: ['unordered', 'ordered'],
          },
        }}
      />
      <Button onClick={onSave} type="ghost">
        <SaveOutlined />
        Save
      </Button>
    </div>
  );
};
