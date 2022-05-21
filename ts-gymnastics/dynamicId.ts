type Entity = { type: 'user' } | { type: 'group' } | { type: 'role' };

// type EntityWithId = Entity & { id: string };

type EntityWithId =
  | { type: 'user'; userId: string }
  | { type: 'group'; groupId: string }
  | { type: 'role'; roleId: string };

type Solution = {
  [EntityType in Entity['type']]: {
    type: EntityType;
    // [`${EntityType}Id`]: string;
  } & Record<`${EntityType}Id`, string>;
}[Entity['type']];

const result: Solution = {
  type: 'user',
  userId: '123',
};

const result2: Solution = {
  type: 'group',
  groupId: 'asd',
};
