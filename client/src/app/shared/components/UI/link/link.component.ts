import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LinkStyleType } from './types';
import { ColorType } from '@app/shared/types';
import { PRIMARY_COLORS, UNDERLINE_LINK_COLORS } from '@app/shared/constants';
import { getCSSVariableString } from '@app/shared/helpers';

@Component({
  selector: 'app-link',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './link.component.html',
  styleUrl: './link.component.scss',
})
export class LinkComponent {
  @Input({ required: true }) to: RouterLink['routerLink'];
  @Input() styleType: LinkStyleType = 'underline';
  @Output() appLinkEvent = new EventEmitter<void>();

  onClickEvent() {
    this.appLinkEvent.emit();
  }

  private linkColors: Record<LinkStyleType, ColorType> = {
    'primary-btn': PRIMARY_COLORS,
    underline: UNDERLINE_LINK_COLORS,
  };
  private get linkColor(): ColorType {
    return this.linkColors[this.styleType];
  }
  get isButton(): boolean {
    return this.styleType.includes('btn');
  }

  @HostBinding('style') get cssVariables(): string {
    const { basic, hover, active, focus, disabled } = this.linkColor;

    const cssVars = {
      'bs-color': basic?.color,
      'bs-bg-color': basic?.backgroundColor,
      'bs-border-color': basic?.borderColor,
      'hov-color': hover?.color,
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
