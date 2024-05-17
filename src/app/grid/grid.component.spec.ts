import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GridComponent } from './grid.component';

describe('GridComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;
    component.radius = 1;
    component.hexWidth = 100;
    component.styleVariables = {
      width: '100px',
      height: '100px'
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should calculate the correct grid width 0 radius', () => {
      component.radius = 0;
      component.ngOnChanges();
      expect(component.gridWidth).toBe(100);
    });

    it('should calculate the correct grid width 1 radius', () => {
      component.radius = 1;
      component.ngOnChanges();
      expect(component.gridWidth).toBe(250);
    });

    it('should calculate the correct grid width 2 radius', () => {
      component.radius = 2;
      component.ngOnChanges();
      expect(component.gridWidth).toBe(400);
    });

    it('should calculate the correct grid width 3 radius', () => {
      component.radius = 3;
      component.ngOnChanges();
      expect(component.gridWidth).toBe(550);
    });

    it('should calculate the correct grid width 15 radius', () => {
      component.radius = 15;
      component.ngOnChanges();
      expect(component.gridWidth).toBe(2350);
    });
  });
});