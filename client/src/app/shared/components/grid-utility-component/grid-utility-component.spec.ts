import { GridUtilStyleVariables } from '@app/shared/interfaces';
import { GridUtilityComponent } from './grid-utility-component';

class TestGridUtilityComponent extends GridUtilityComponent {
  hexWidth: number = 0;
  hexHeight: number = 0;
  styleVariables: GridUtilStyleVariables = { width: '', height: '', xCoord: '', yCoord: '' };
}

describe('GridUtilityComponent', () => {
  let component: TestGridUtilityComponent;

  beforeEach(() => {
    component = new TestGridUtilityComponent();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should return correct pixel string', () => {
    const result = component.getPixelString(10);
    expect(result).toBe('10.000px');
  });

  it('should set correct hex height', () => {
    component.hexWidth = 100;
    component.setHexHeight();
    expect(component.hexHeight).toBe(86.60254037844386);
  });

  describe('setStyleVariables', () => {
    it('should set correct style variables', () => {
      component.setStyleVariables(100, 100);
      expect(component.styleVariables.width).toBe('100.000px');
      expect(component.styleVariables.height).toBe('100.000px');
    });

    it('should set style variables using own properties', () => {
      component.hexWidth = 200;
      component.hexHeight = 200;
      component.setStyleVariables(component.hexWidth, component.hexHeight);
      expect(component.styleVariables.width).toBe('200.000px');
      expect(component.styleVariables.height).toBe('200.000px');
    });

    it('should leave xCoord and yCoord empty if not provided', () => {
      component.setStyleVariables(100, 100);
      expect(component.styleVariables.xCoord).toBe('');
      expect(component.styleVariables.yCoord).toBe('');
    });

    it('should set xCoord and yCoord if provided', () => {
      component.setStyleVariables(100, 100, 50, 50);
      expect(component.styleVariables.xCoord).toBe('50.000px');
      expect(component.styleVariables.yCoord).toBe('50.000px');
    });
  });
});
