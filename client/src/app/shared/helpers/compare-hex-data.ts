import { HexManagementState, HexManagementStateKey } from '@app/shared/services/hex-management';
import { isHexAEqualHexB } from './is-hex-a-equal-hex-b';

export const compareHexManagementStateKey = (
  prev: HexManagementState,
  curr: HexManagementState,
  key: HexManagementStateKey,
): boolean => {
  // TODO: remove console.log
  console.log(
    `\n\n${key}\n\nprev hexData: ${JSON.stringify(prev[key])} \n\ncurr hexData: ${JSON.stringify(curr[key])}`,
  );

  const hasMismatch = curr[key].some((currentHex, index) => {
    return !isHexAEqualHexB(currentHex, prev[key][index], true);
  });
  // TODO: remove console.log
  if (!hasMismatch) console.log('>> no mismatch found, skipping hexData update', key);
  return !hasMismatch;
};
