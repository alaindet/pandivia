export type ErrorI18n = {
  message: string;
  params: any;
};

export function errorI18n<T = Record<string, any>>(
  message: string,
  params: T,
): Error {
  return new Error(JSON.stringify({ message, params }));
}

export function readErrorI18n(err: Error): [ErrorI18n['message'], ErrorI18n['params']] {
  const errorI18n = JSON.parse(err.message) as ErrorI18n;
  return [errorI18n.message, errorI18n.params];
}
