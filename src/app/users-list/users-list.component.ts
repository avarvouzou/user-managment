import { Component, Directive, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service'
import { transformServerUsers } from '../shared/user-helper';
import { PresentationUser, ServerUser, App } from '../shared/user.interface';


export type SortColumn = keyof PresentationUser | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };

const compare = (v1: string | number | App[], v2: string | number | App[]) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdSortableHeader {

  @Input() sortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction});
  }
}

@Component({
  selector: 'users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  private serverUsers: ServerUser[] = [];
  public users: PresentationUser[] = [];

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.userService.getUsers().subscribe((userResp) => {
      this.users = transformServerUsers(userResp.data);
      this.serverUsers = userResp.data;
    })
  }

  rowClicked(user: PresentationUser) {
    console.log(user)
    this.router.navigate([`/users/${user._id}`])
  }

  onSort({column, direction}: SortEvent) {

    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // sorting countries
    if (direction === '' || column === '') {
      this.users = transformServerUsers(this.serverUsers);
    } else {
      this.users = [...transformServerUsers(this.serverUsers)].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }



}
