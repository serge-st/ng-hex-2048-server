import { NgClass } from '@angular/common';
import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { ButtonStyleType } from './types';
import { PRIMARY_COLORS, SECONDARY_COLORS } from '@app/shared/constants';
import { ColorType } from '@app/shared/types';
import { getCSSVariableString } from '@app/shared/helpers';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() styleType: ButtonStyleType = 'primary';
  @Input() active: boolean = false;
  @Input() disabled: boolean = false;
  @Input() width?: number;
  @Output() appButtonEvent = new EventEmitter<void>();

  onClickEvent() {
    this.appButtonEvent.emit();
  }

  @HostBinding('style.--width') get with() {
    return this.width + 'px' || undefined;
  }

  private buttonColors: Record<ButtonStyleType, ColorType> = {
    primary: PRIMARY_COLORS,
    secondary: SECONDARY_COLORS,
  };
  private get buttonColor(): ColorType {
    return this.buttonColors[this.styleType];
  }

  @HostBinding('style') get cssVariables(): string {
    const { basic, hover, active, focus, disabled } = this.buttonColor;

    const cssVars = {
      'bs-color': basic?.color,
      'bs-bg-color': basic?.backgroundColor,
      'bs-border-color': basic?.borderColor,
      'hov-bg-color': hover?.backgroundColor,
      'hov-border-color': hover?.borderColor,
      'act-bg-color': active?.backgroundColor,
      'act-border-color': active?.borderColor,
      'focus-box-shadow-rgb': focus?.boxShadowRGB,
      'dsbld-color': disabled?.color,
      'dsbld-bg-color': disabled?.backgroundColor,
      'dsbld-border-color': disabled?.borderColor,
    };

    return getCSSVariableString(cssVars);
  }
}
