import { Component, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TasksService } from 'src/app/services/tasks.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  // dependency injection
  private tasksServices = inject(TasksService);
  private themeServices = inject(ThemeService);

  // states
  newTask = new FormControl('');
  themeInput = new FormControl('');
  createMutation$ = this.tasksServices.create();

  ngOnInit(): void {
    this.createMutation$.subscribe((data) => {
      if (data.isLoading) {
        this.newTask.disable();
      } else {
        this.newTask.enable();
      }
    });

    if (this.themeServices.theme === 'dark') {
      this.themeInput.setValue('true');
    }

    this.themeInput.valueChanges.subscribe(() => {
      this.themeServices.toggleTheme();
    });
  }
  // methods
  addTask() {
    const title = this.newTask.value?.trim();

    if (!title) {
      return;
    }
    this.newTask.setValue('');

    this.createMutation$.mutate(title).then((res) => {
      console.log(res);
    });
  }
}
