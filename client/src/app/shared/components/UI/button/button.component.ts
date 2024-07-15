import { NgClass } from '@angular/common';
import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { ButtonStyleType, ColorsType } from './types';
import { PRIMARY_COLORS, SECONDARY_COLORS } from './constants';

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
  private buttonColors: Record<ButtonStyleType, ColorsType> = {
    primary: PRIMARY_COLORS,
    secondary: SECONDARY_COLORS,
  };
  private get buttonColor(): ColorsType {
    return this.buttonColors[this.styleType];
  }

  @HostBinding('style.--width') get with() {
    return this.width + 'px' || undefined;
  }

  @Output() appButtonEvent = new EventEmitter<void>();

  onClickEvent() {
    this.appButtonEvent.emit();
  }

  @HostBinding('style') get cssVariables(): string {
    const { basic, hover, active, disabled } = this.buttonColor;
    const basicVars = `--bas-bg-color: ${basic.backgroundColor}; --bas-border-color: ${basic.borderColor};`;
    const hoverVars = `--hov-bg-color: ${hover.backgroundColor}; --hov-border-color: ${hover.borderColor};`;
    const activeVars = `--act-bg-color: ${active.backgroundColor}; --act-border-color: ${active.borderColor};`;
    const disabledVars = `--dis-color: ${disabled.color}; --dis-bg-color: ${disabled.backgroundColor}; --dis-border-color: ${disabled.borderColor};`;
    return basicVars + hoverVars + activeVars + disabledVars;
  }
}
