import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import {
  AdminTaskService,
  BackendService,
  IconService,
  KsiTitleService, ModalService,
  RoutesService,
  TasksService,
  YearsService
} from '../../../services';
import { AdminTask, AdminTaskDeployResponse, Wave } from '../../../../api';
import { BehaviorSubject, combineLatest, Observable, of, timer } from 'rxjs';
import { filter, map, mergeMap, take, tap } from 'rxjs/operators';
import { IAdminTask } from '../../../models';
import { Utils } from '../../../util';

interface WaveTasks {
  wave: Wave,
  tasks: Observable<IAdminTask>[]
}

@Component({
  selector: 'ksi-page-admin-tasks',
  templateUrl: './page-admin-tasks.component.html',
  styleUrls: ['./page-admin-tasks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageAdminTasksComponent implements OnInit {
  @ViewChild('modalDeployLog', {static: true})
  modalDeployLog: TemplateRef<unknown>;

  private readonly deployLogSubject = new BehaviorSubject<AdminTaskDeployResponse | null>(null);
  readonly deployLog$ = this.deployLogSubject.asObservable();

  waveTasks$: Observable<WaveTasks[]>;

  constructor(
    private years: YearsService,
    private title: KsiTitleService,
    private tasks: TasksService,
    public icon: IconService,
    public routes: RoutesService,
    private backend: BackendService,
    private modal: ModalService,
    private adminTasks: AdminTaskService,
  ) {
  }

  ngOnInit(): void {
    this.waveTasks$ = this.years.adminTasks$.pipe(
      mergeMap((tasks) => {
        const waveIdTasks: { [waveId: number]: Observable<IAdminTask>[] } = {};
        tasks.forEach((task) => {
          this.adminTasks.tasksCache.set(task.id, this.adminTasks.enrichTask(this.adminTasks.enrichTask(task)));
          if (!(task.wave in waveIdTasks)) {
            waveIdTasks[task.wave] = [];
          }
          waveIdTasks[task.wave].push(this.adminTasks.tasksCache.get(task.id));
        });

        const waves$: Observable<Wave[]> = combineLatest(
          Object.keys(waveIdTasks).map((waveId) => this.tasks.cacheWaves.get(Number(waveId)))
        );
        const waveTasks$: Observable<Observable<IAdminTask>[][]> = of(
          Object.keys(waveIdTasks).map((waveId) => waveIdTasks[Number(waveId)])
        );

        return combineLatest([waves$, waveTasks$]);
      }),
      map(([waves, waveTasks]) => {
        return waves.map((wave, i) => ({wave, tasks: waveTasks[i]}));
      }),
      map((waveTasks) => {
        return waveTasks.sort((a, b) => b.wave.id - a.wave.id);
      })
    );
    this.title.subtitle = 'admin.root.tasks.title';
  }

  deployTask(task: AdminTask, event: MouseEvent): void {
    Utils.hideButton(event.target as HTMLButtonElement, 2000);

    this.backend.http.adminTaskDeploySingle(task.id).pipe(take(1)).subscribe(() => {
      // Periodically listen to deploy status changes and if the deployment ends with an error, show the deployment log
      const s = timer(100, 1500).pipe(
        mergeMap(() => this.adminTasks.tasksCache.refresh(task.id))
      ).subscribe((task) => {
        if (task.$isStableDeployState) {
          s.unsubscribe();
        }

        if (task.deploy_status === 'error') {
          this.showDeployLog(task);
        }
      });
    });
  }

  showDeployLog(task: AdminTask): void {
    this.deployLogSubject.next(null);
    const s = timer(100, 1500).pipe(
      mergeMap(() => this.backend.http.adminTasksGetDeploySingle(task.id))
    ).subscribe((r) => {
      this.deployLogSubject.next(r);
    });
    this.modal.showModalTemplate(
      this.modalDeployLog,
      'admin.tasks.deploy.log.title',
      {class: 'modal-full-page'}
    ).afterClose$.subscribe(() => s.unsubscribe());
  }

  mergeTask(task: IAdminTask, event: MouseEvent): void {
    this.modal.yesNo('admin.tasks.head.actions.merge.confirmation')
      .pipe(
        filter((r) => !!r),
        tap(() => Utils.hideButton(event.target as HTMLButtonElement)),
        mergeMap(() => this.backend.http.adminTaskMergeSingle(task.id)),
        mergeMap(() => this.adminTasks.tasksCache.refresh(task.id))
      )
      .subscribe();
  }
}
