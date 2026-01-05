import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-ui-dialog',
  imports: [DialogModule],
  template: `
    <p-dialog
      [header]="header()"
      [(visible)]="visible"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      [dismissableMask]="true"
      position="top"
      [style]="{ width: '100%', maxWidth: '600px', marginTop: '80px' }"
      [breakpoints]="{ '960px': '95vw' }"
      styleClass="app-glass-dialog"
    >
      <ng-content></ng-content>

      <ng-content select="[footer]"></ng-content>
    </p-dialog>
  `,
  styles: `


  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiDialog {
  visible = model<boolean>(false);
  header = input<string>('');
}
