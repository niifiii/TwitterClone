import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar'

const material = [
  MatButtonModule,
  MatToolbarModule,
]

@NgModule({
  imports: [material],
  exports: [material]
})
export class MaterialModule { }
