// src/app/modules/syllogimous/syllogimous.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SyllogimousComponent } from './syllogimous.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BodyModule } from './components/body/body.module';
import { FooterModule } from './components/footer/footer.module';
import { ModalLevelChangeComponent } from './components/modal-level-change/modal-level-change.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  { path: '', component: SyllogimousComponent }
];

@NgModule({
  declarations: [
    SyllogimousComponent,
    ModalLevelChangeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    NgbModule,
    RouterModule.forChild(routes),
    BodyModule,
    FooterModule
  ]
})
export class SyllogimousModule { }