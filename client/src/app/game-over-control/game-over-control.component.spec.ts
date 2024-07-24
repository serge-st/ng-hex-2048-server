import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameOverControlComponent } from './game-over-control.component';

describe('GameOverControlComponent', () => {
  let component: GameOverControlComponent;
  let fixture: ComponentFixture<GameOverControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameOverControlComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameOverControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
