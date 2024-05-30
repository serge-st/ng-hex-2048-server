import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GridComponent } from './grid.component';

describe('GridComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;
    component.radius = 1;
    component.hexWidth = 100;
    component.hexHeight = 100;
    component.styleVariables = { width: '100px', height: '100px', xCoord: '100px', yCoord: '100px' };
    component.offset = { x: 0, y: 0 };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setGridWidth', () => {
    it('should calculate the correct grid width 0 radius', () => {
      component.radius = 0;
      component.setGridWidth();
      expect(component.gridWidth).toBe(100);
    });

    it('should calculate the correct grid width 1 radius', () => {
      component.radius = 1;
      component.setGridWidth();
      expect(component.gridWidth).toBe(250);
    });

    it('should calculate the correct grid width 2 radius', () => {
      component.radius = 2;
      component.setGridWidth();
      expect(component.gridWidth).toBe(400);
    });

    it('should calculate the correct grid width 3 radius', () => {
      component.radius = 3;
      component.setGridWidth();
      expect(component.gridWidth).toBe(550);
    });

    it('should calculate the correct grid width 15 radius', () => {
      component.radius = 15;
      component.setGridWidth();
      expect(component.gridWidth).toBe(2350);
    });
  });

  describe('setGridHeight', () => {
    it('should calculate the correct grid height 0 radius', () => {
      component.hexHeight = 100;
      component.radius = 0;
      component.setGridHeight();
      expect(component.gridHeight).toBe(100);
    });

    it('should calculate the correct grid height 1 radius', () => {
      component.hexHeight = 100;
      component.radius = 1;
      component.setGridHeight();
      expect(component.gridHeight).toBe(300);
    });

    it('should calculate the correct grid height 2 radius', () => {
      component.hexHeight = 100;
      component.radius = 2;
      component.setGridHeight();
      expect(component.gridHeight).toBe(500);
    });

    it('should calculate the correct grid height 5 radius', () => {
      component.hexHeight = 100;
      component.radius = 5;
      component.setGridHeight();
      expect(component.gridHeight).toBe(1100);
    });
  });

  describe('setOffset', () => {
    it('should calculate the correct offset on radius 1', () => {
      component.hexHeight = 100;
      component.hexWidth = 100;
      component.radius = 1;
      component.setGridWidth();
      component.setGridHeight();
      component.setOffset();

      expect(component.offset).toEqual({ x: 75, y: 100 });
    });

    it('should calculate the correct offset on radius 2', () => {
      component.hexHeight = 100;
      component.hexWidth = 100;
      component.radius = 2;
      component.setGridWidth();
      component.setGridHeight();
      component.setOffset();

      expect(component.offset).toEqual({ x: 150, y: 200 });
    });
  });

  // TODO: review later
  // describe('setHexCoords', () => {
  //   it('should generate the correct hex coords 1 radius', () => {
  //     component.radius = 1;
  //     component.setHexCoords();
  //     expect(component.hexCoords).toEqual([
  //       { q: -1, r: 0, s: 1 },
  //       { q: -1, r: 1, s: 0 },
  //       { q: 0, r: -1, s: 1 },
  //       { q: 0, r: 0, s: 0 },
  //       { q: 0, r: 1, s: -1 },
  //       { q: 1, r: -1, s: 0 },
  //       { q: 1, r: 0, s: -1 },
  //     ]);
  //   });

  //   it('should return 19 objects for 2 radius', () => {
  //     component.radius = 2;
  //     component.setHexCoords();
  //     expect(component.hexCoords.length).toBe(19);
  //   });
  // });
});
