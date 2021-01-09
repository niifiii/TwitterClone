import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

const material = [
  MatButtonModule,
  MatToolbarModule,
  MatProgressSpinnerModule
]

@NgModule({
  imports: [material],
  exports: [material]
})
export class MaterialModule { }
