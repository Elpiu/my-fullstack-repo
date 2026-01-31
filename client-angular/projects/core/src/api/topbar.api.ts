import { Type } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

export interface TopbarItem {
  label: string;
  visible: boolean;
  // Proprietà per link standard
  url?: string;
  icon?: string;
  // Proprietà per componente dinamico
  component?: Type<any>;
  // Azioni
  handlerClick?: (router: Router, route: ActivatedRoute) => void;
}
