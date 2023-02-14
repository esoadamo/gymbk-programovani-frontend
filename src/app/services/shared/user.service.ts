import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { combineLatest, Observable, of } from 'rxjs';
import { UserRole } from '../../../api/backend';
import { filter, map, mergeMap, shareReplay, take, tap } from 'rxjs/operators';
import { ModalService } from './modal.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly role$: Observable<UserRole | null>;

  readonly isLoggedIn$: Observable<boolean>;

  readonly isAdmin$: Observable<boolean>;

  readonly isOrg$: Observable<boolean>;

  readonly isTester$: Observable<boolean>;

  readonly isParticipant$: Observable<boolean>;

  readonly isParticipantHidden$: Observable<boolean>;

  /**
   * This observable fires immediately if user is logged in
   * If not, then show a login modal once and fire only if the login was successful
   * If the login modal is canceled, then this is newer fired
   */
  get afterLogin$(): Observable<void> {
    return this.requestLogin$.pipe(
      filter((loginOk) => loginOk),
      map(() => {})
    );
  }

  /**
   * This observable fires immediately if user is logged in
   * If not, then show a login modal once and fire only if the login was successful
   * If the login modal is canceled, then navigation to the root page is forced
   */
  get forceLogin$(): Observable<void> {
    return this.requestLogin$.pipe(
      tap((loginOk) => {
        if (!loginOk) {
          this.router.navigate(['/']).then();
        }
      }),
      filter((loginOk) => loginOk),
      map(() => {})
    );
  }

  /**
   * Requests a single login attempt if not logged in yet
   */
  get requestLogin$(): Observable<boolean> {
    environment.logger.debug('new login request');
    return this.isLoggedIn$.pipe(
      mergeMap((isLoggedIn) => {
        if (isLoggedIn) {
          return of(true);
        } else {
          const modal = this.modal.showLoginModal();
          // test if login was successful after modal is hidden
          return modal.visible$.pipe(
            filter((visible) => !visible),
            take(1),
            map(() => modal.component.instance.loginOk)
          );
        }
      }),
      take(1)
    );
  }

  constructor(private backend: BackendService, private modal: ModalService, private router: Router) {
    // prepare role observables
    // admin > org > tester > participant > participant_hidden
    this.role$ = backend.user$.pipe(map((user) => user?.role || null));
    this.isAdmin$ = this.role$.pipe(map((role) => role === 'admin'));
    this.isOrg$ = combineLatest([this.isAdmin$, this.role$])
      .pipe(map(([isAdmin, role]) => isAdmin || role === 'org'));
    this.isTester$ = combineLatest([this.isOrg$, this.role$])
      .pipe(map(([isOrg, role]) => isOrg || role === 'tester'));
    this.isParticipant$ = combineLatest([this.isTester$, this.role$])
      .pipe(map(([isTester, role]) => isTester || role === 'participant'));
    this.isParticipantHidden$ = combineLatest([this.isParticipant$, this.role$])
      .pipe(map(([isParticipant, role]) => isParticipant || role === 'participant_hidden'));

    this.isLoggedIn$ = this.role$.pipe(map((role) => role !== null), shareReplay(1));
  }
}
