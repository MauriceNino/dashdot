export type HttpResponse<T> = {
  loading: boolean;
  data?: T;
  error?: any;
};
