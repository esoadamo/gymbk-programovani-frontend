import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { ModalComponent } from "../../../models";
import { FormBuilder, Validators } from "@angular/forms";
import { BackendService } from "../../../services";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'ksi-modal-login',
  templateUrl: './modal-login.component.html',
  styleUrls: ['./modal-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalLoginComponent implements OnInit, ModalComponent {
  @ViewChild('template', {static: true})
  templateBody: TemplateRef<unknown>;

  title = 'modal.login.title';

  form = this.fb.group(({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  }));

  showErr$: Observable<boolean>;

  private modalRef: BsModalRef;

  constructor(private backend: BackendService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
  }

  onModalOpened(modalRef: BsModalRef): void {
    this.modalRef = modalRef;
  }

  /**
   * Tries to login
   * If succeeds, closes modal
   * If fails, shows error message
   *
   * @return false to override default form post action
   */
  login(): false {
    if (!this.form.valid) {
      return false;
    }
    this.form.disable();
    this.showErr$ = this.backend.login(this.form.controls.email.value, this.form.controls.password.value)
      .pipe(
        tap((loginOk) => {
          if (loginOk) {
            this.modalRef.hide();
          } else {
            this.form.enable();
          }
        }),
        map((loginOk) => !loginOk),
      );
    return false;
  }
}
