import { IncomingMessage, ServerResponse } from 'http';

type TObject = Record<string, any>;

export type NextFunction = (err?: any) => any;
export class HttpRequest extends IncomingMessage {
  params: TObject;
  path: string;
  search: string;
  query: TObject;
  body: TObject;
  originalUrl: string;
  [k: string]: any;
}

export class HttpResponse extends ServerResponse {
  json: (data: TObject | TObject[] | null) => any;
  send: (data?: TObject | TObject[] | string) => any;
  [k: string]: any;
};

export type Handler<
  Req extends HttpRequest = HttpRequest,
  Res extends HttpResponse = HttpResponse
  > = (
    req: Req,
    res: Res,
    next: NextFunction
  ) => any;

export type Handlers<
  Req extends HttpRequest = HttpRequest,
  Res extends HttpResponse = HttpResponse
  > = Array<Handler<Req, Res> | Handler<Req, Res>[]>;

export interface ILiteRouter<
  Req extends HttpRequest = HttpRequest,
  Res extends HttpResponse = HttpResponse
  > {
  get(path: string, ...handlers: Handlers<Req, Res>): this;
  post(path: string, ...handlers: Handlers<Req, Res>): this;
  put(path: string, ...handlers: Handlers<Req, Res>): this;
  delete(path: string, ...handlers: Handlers<Req, Res>): this;
  patch(path: string, ...handlers: Handlers<Req, Res>): this;
  head(path: string, ...handlers: Handlers<Req, Res>): this;
  all(path: string, ...handlers: Handlers<Req, Res>): this;
  options(path: string, ...handlers: Handlers<Req, Res>): this;
  [k: string]: any;
}
export interface ILiteApp<
  Req extends HttpRequest = HttpRequest,
  Res extends HttpResponse = HttpResponse
  > extends ILiteRouter<Req, Res> {
  handle(req: Req, res: Res): void;
  handle(req: any, res: any): any;
  use(router: ILiteRouter<Req, Res> | ILiteRouter<Req, Res>[]): this;
  use(path: string, router: ILiteRouter<Req, Res> | ILiteRouter<Req, Res>[]): this;
  use(path: string, middleware: Handler<Req, Res> | Handler<Req, Res>[], router: ILiteRouter<Req, Res> | ILiteRouter<Req, Res>[]): this;
  use(path: string, ...middlewares: Handlers<Req, Res>, router: ILiteRouter<Req, Res> | ILiteRouter<Req, Res>[]): this;
  use(middleware: Handler<Req, Res> | Handler<Req, Res>[]): this;
  use(...middlewares: Handlers<Req, Res>): this;
  use(path: string, middleware: Handler<Req, Res> | Handler<Req, Res>[]): this;
  use(path: string, ...middlewares: Handlers<Req, Res>): this;
  use(...args: any): this;
  listen(port: number, hostname?: string, callback?: (err?: Error) => void): void;
  listen(port: number, callback: (err?: Error) => void): void;
  listen(port: number, ...args: any): void;
}

export declare const liteApp: <
  Req extends HttpRequest = HttpRequest,
  Res extends HttpResponse = HttpResponse
  >(opts?: {
    qsParse?: (str: string, ...args: any) => Record<string, any>;
    urlParse?: (req: Req, ...args: any) => Record<string, any>;
    onError?: (err: any, req: Req, res: Res, next: NextFunction) => any;
    on404?: Handler<Req, Res>;
    base?: string;
  }) => ILiteApp;

export declare const liteRouter: <
  Req extends HttpRequest = HttpRequest,
  Res extends HttpResponse = HttpResponse
  >(opts?: { base?: string }) => ILiteRouter<Req, Res>;