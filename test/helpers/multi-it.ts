import { it } from '@jest/globals';

type ItParams = Parameters<typeof it>;

export const multiIt = (times: number, ...itParams: ItParams): void => {
  const [testName, fn, timeout] = itParams;
  for (let i = 1; i <= times; i++) {
    const fullItTestName = `[iter ${i}]: ${testName}`;
    it(fullItTestName, fn, timeout);
  }
};
