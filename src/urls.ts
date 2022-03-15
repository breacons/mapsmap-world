export const URL_EVENT_DETAIL = '/events/:eventId';
export const URL_ADMIN = '/admin';
export const URL_ADMIN_EVENT_LIST = `${URL_ADMIN}/events`;
export const URL_ADMIN_EVENT_DETAIL = `${URL_ADMIN_EVENT_LIST}/:eventId`;
export const URL_ADMIN_CREATE_EVENT = `${URL_ADMIN_EVENT_LIST}/create`;
export const URL_ADMIN_EDIT_EVENT_DETAIL = `${URL_ADMIN_EVENT_DETAIL}/edit`;
export const URL_ADMIN_PROFILE = `${URL_ADMIN}/profile`;
export const URL_ADMIN_LOGIN = '/login';
export const URL_ADMIN_SIGNUP = '/signup';

export const URL_LANDING = '/';
export const URL_LOGIN = '/login';
export const URL_SIGNUP = '/signup';
export const URL_BOARDS = '/boards';
export const URL_CREATE_BOARD = `${URL_BOARDS}/create`;
export const URL_BOARD = `${URL_BOARDS}/:boardId`;

export const getBoardDetailsUrl = (id: string) => URL_BOARD.replace(':boardId', id);
