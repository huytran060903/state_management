export interface StringParams {
  key: string;
  value: string;
  setNew: boolean;
}

export const getStringParams = (arrStringParams: StringParams[]): string => {
  const params = new URLSearchParams(window.location.search);

  for (const param of arrStringParams) {
    if (param.setNew) {
      params.set(param.key, param.value);
    } else {
      params.delete(param.key);
    }
  }
  return params.toString();
};
