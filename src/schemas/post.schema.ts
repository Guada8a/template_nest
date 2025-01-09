export const postSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', example: 'My first post' },
    content: { type: 'string', example: 'This is my first post' },
    authorId: { type: 'number', example: 1 }
  }
};

