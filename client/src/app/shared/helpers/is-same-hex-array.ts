import { HexManagementState, HexManagementStateKey } from '@app/shared/services/hex-management';
import { isHexAEqualHexB } from './is-hex-a-equal-hex-b';

export const isSameHexArray = (
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

  // TODO: re-check this
  if (prev[key].length !== curr[key].length) return false;

  const hasMismatch = curr[key].some((currentHex, index) => {
    return !isHexAEqualHexB(currentHex, prev[key][index]);
  });
  // TODO: remove console.log
  if (isHexData) {
    if (!hasMismatch) console.log('>> no mismatch found, skipping hexData update', key);
  }

  return !hasMismatch;
};
