import _ from 'lodash';

export const firebaseToObject = <T>(original: any): T =>
  _.mapValues(_.keyBy(original, 'key'), 'value') as T;

export const firebaseToArray = <T>(items: { key: string; value: T }[]): (T & { id: string })[] =>
  _.map(items, (item: any) => ({ ...item.value, id: item.key }));

// TODO: ???
export const firebaseObjectToArray = <T>(obj: Record<string, T>): (T & { id: string })[] =>
  obj
    ? Object.keys(obj).map(
        (key: string) =>
          ({
            id: key,
            // @ts-ignore
            ...obj[key],
          } as T & { id: string }),
      )
    : [];
