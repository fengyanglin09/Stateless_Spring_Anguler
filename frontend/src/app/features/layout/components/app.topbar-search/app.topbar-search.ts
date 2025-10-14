import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {AppSearchMenu, AppSearchMenuItem} from './app.tobar-search.model';
import {InputGroup} from 'primeng/inputgroup';
import {Button} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {SplitButton} from 'primeng/splitbutton';
import {of} from 'rxjs';
import {Router} from '@angular/router';


@Component({
  selector: '[app-topbar-search]',
  imports: [
    InputGroup,
    Button,
    FormsModule,
    SplitButton
  ],
  templateUrl: './app.topbar-search.html',
  styleUrl: './app.topbar-search.scss'
})
export class AppTopbarSearch implements OnInit {

  searchOptions: MenuItem[] = [];
  selectedSearchItem?: AppSearchMenuItem;
  searchTerm: string = '';

  constructor(private router: Router) {

  }

  ngOnInit(): void {
        this.searchOptions = this.getSearchMenu().menuItems.map((item: AppSearchMenuItem) => {
          return {
            id: item.id,
            label: item.label,
            icon: item.icon,
            command: () => this.selectedSearchItem = item
          }
        })

        this.selectedSearchItem = this.getSearchMenu().menuItems[0];
    }


  onSearch() {

  }

  /**
   * Executed when the search is executed, if match is found, will route to the gene card, if not... tbd
   * @param menuItem
   * @param searchTerm
   */
  onSearchSelected(menuItem: AppSearchMenuItem, searchTerm?: string) {
    const searchType = (menuItem as any)['searchType'];
    this.router.navigate(
      ['/search'],
      // {
      //   queryParams: {
      //     ["query"]: CommonUtils.serializeObject({
      //       [menuItem.searchParam]: [{
      //         value: this.getSearchTermByFilterType(searchTerm?.trim(), searchType),
      //         matchMode: menuItem.searchMatchMode
      //       }]
      //     })
      //   }
      // }
    );
  }


  getSearchMenu(): AppSearchMenu {
    return {
      selectedIndex: 0,
      menuItems: [
        {
          id: 'softLabOrderNumber',
          label: 'Soft Lab Order',
          icon: 'fa fa-vials',
          searchParam: 'softLabOrderNumber',
          searchMatchMode: 'equals',
        },
        {
          id: 'softOrderNumber',
          label: 'Soft Order',
          icon: 'fa fa-vial',
          searchParam: 'softOrderNumber',
          searchMatchMode: 'equals'
        },
        {
          id: 'patientLastName',
          label: 'Patient Last Name',
          icon: 'fa-solid fa-user',
          searchMatchMode: 'equals',
          searchParam: 'patientLastName'
        },
        {
          id: 'patientMpi',
          label: 'Patient MPI',
          icon: 'fa-solid fa-user',
          searchParam: 'patientMpi',
          searchMatchMode: 'equals',
        },
        {
          id: 'patientMrn',
          label: 'Patient MRN',
          icon: 'fa-solid fa-user',
          searchParam: 'patientMrn',
          searchMatchMode: 'equals'
        }
      ],
      onSearch: (searchTerm: string, menuItem: MenuItem) => {
        this.onSearchSelected(menuItem as AppSearchMenuItem, searchTerm);
        return of(void 0);
      }
    }
  };

}
