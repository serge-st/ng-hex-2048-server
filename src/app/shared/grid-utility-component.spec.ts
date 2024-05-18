import { GridUtilityComponent } from './grid-utility-component';
import { StyleVariables } from './interfaces/style-variables';

class TestGridUtilityComponent extends GridUtilityComponent {
  hexWidth: number = 0;
  hexHeight: number = 0;
  styleVariables: StyleVariables = { width: '', height: '' };
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
    expect(result).toBe('10px');
  });

  it('should set correct hex height', () => {
    component.hexWidth = 100;
    component.setHexHeight();
    expect(component.hexHeight).toBe(86.60254037844386);
  });

  describe('setStyleVariables', () => {
    it('should set correct style variables', () => {
      component.setStyleVariables(100, 100);
      expect(component.styleVariables.width).toBe('100px');
      expect(component.styleVariables.height).toBe('100px');
    });

    it('should set style variables using own properties', () => {
      component.hexWidth = 200;
      component.hexHeight = 200;
      component.setStyleVariables(component.hexWidth, component.hexHeight);
      expect(component.styleVariables.width).toBe('200px');
      expect(component.styleVariables.height).toBe('200px');
    });
  });
});