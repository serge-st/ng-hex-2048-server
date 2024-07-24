import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSetupPageComponent } from './game-setup-page.component';

describe('GameSetupPageComponent', () => {
  let component: GameSetupPageComponent;
  let fixture: ComponentFixture<GameSetupPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameSetupPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameSetupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
