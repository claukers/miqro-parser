export const newURL = (input: string, base?: string | any): any => {
  /* eslint-disable  @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  return new URL(input, base)
}  
