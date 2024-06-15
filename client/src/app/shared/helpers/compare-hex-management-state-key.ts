import { HexManagementState, HexManagementStateKey } from '@app/shared/services/hex-management';
import { isHexAEqualHexBNew } from './is-hex-a-equal-hex-b';

export const compareHexManagementStateKey = (
  prev: HexManagementState,
  curr: HexManagementState,
  key: HexManagementStateKey,
): boolean => {
  // TODO: remove console.log
  const isHexData = key === 'hexData';

  if (isHexData) {
    console.log(
      `\n\n${key}\n\nprev hexData: ${JSON.stringify(prev[key])} \n\ncurr hexData: ${JSON.stringify(curr[key])} \n\nprev hexData length: ${prev[key].length} \n\ncurr hexData length: ${curr[key].length}`,
    );
  }

  const hasMismatch = curr[key].some((currentHex, index) => {
    return !isHexAEqualHexBNew(currentHex, prev[key][index]);
  });
  // TODO: remove console.log
  if (isHexData) {
    if (!hasMismatch) console.log('>> no mismatch found, skipping hexData update', key);
  }

  return !hasMismatch;
};